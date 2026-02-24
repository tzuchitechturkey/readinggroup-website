import { useState, useEffect, useCallback } from "react";

import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

import {
  GetEventCategories,
  AddEventCategory,
  EditEventCategoryById,
  DeleteEventCategory,
  SortEventCategories,
} from "@/api/events";

import { FORM_DATA_INITIAL_STATE, TOGGLE_FIELDS } from "../utils/eventCategories/constants";
import { validateForm, isFormValid } from "../utils/eventCategories/validation";

export const useEventCategories = () => {
  const { t, i18n } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [totalRecords, setTotalRecords] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [form, setForm] = useState(FORM_DATA_INITIAL_STATE);
  const [errors, setErrors] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [draggedItem, setDraggedItem] = useState(null);
  const [isSorting, setIsSorting] = useState(false);
  const [originalCategories, setOriginalCategories] = useState([]);
  const [hasChanges, setHasChanges] = useState(false);
  const limit = 10;

  const getCategoriesData = useCallback(
    async (page, searchValue = searchTerm) => {
      setIsLoading(true);
      const offset = page * 10;

      try {
        const res = searchValue
          ? await GetEventCategories(limit, offset, searchValue)
          : await GetEventCategories(limit, offset);
        const results = res?.data?.results || [];
        setCategories(results);
        setOriginalCategories(JSON.parse(JSON.stringify(results)));
        setHasChanges(false);
        setTotalRecords(res?.data?.count || 0);
      } catch (err) {
        console.error(err);
        toast.error(t("Failed to load categories"));
      } finally {
        setIsLoading(false);
      }
    },
    [searchTerm, t]
  );

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    getCategoriesData(newPage - 1);
  };

  const openAddModal = () => {
    setEditingCategory(null);
    setForm(FORM_DATA_INITIAL_STATE);
    setErrors({});
    setShowModal(true);
  };

  const openEditModal = (cat) => {
    setEditingCategory(cat);
    setForm({
      name: cat.name || "",
      description: cat.description || "",
      is_active: cat.is_active !== undefined ? cat.is_active : false,
      event_count: cat.event_count !== undefined ? cat.event_count : 0,
    });
    setErrors({});
    setShowModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleToggle = (fieldName, fieldValue) => {
    if (fieldName === "is_active" && !fieldValue && form.event_count === 0) {
      toast.info(
        t(
          "You cannot activate this category because it does not contain any events. Please add events first."
        )
      );
      return;
    }

    setForm((prev) => ({ ...prev, [fieldName]: !prev[fieldName] }));
  };

  const handleDragStart = (e, item) => {
    setDraggedItem(item);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e, targetItem) => {
    e.preventDefault();

    if (!draggedItem || draggedItem.id === targetItem.id) {
      setDraggedItem(null);
      return;
    }

    const newCategories = [...categories];
    const draggedIndex = newCategories.findIndex(
      (cat) => cat.id === draggedItem.id
    );
    const targetIndex = newCategories.findIndex(
      (cat) => cat.id === targetItem.id
    );

    [newCategories[draggedIndex], newCategories[targetIndex]] = [
      newCategories[targetIndex],
      newCategories[draggedIndex],
    ];

    setCategories(newCategories);
    setHasChanges(true);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
  };

  const handleSaveOrder = async () => {
    setIsSorting(true);
    try {
      const sortData = categories.map((cat, index) => ({
        id: cat.id,
        order: index,
      }));
      await SortEventCategories({ categories: sortData });
      toast.success(t("Categories reordered successfully"));
      setHasChanges(false);
      setOriginalCategories(JSON.parse(JSON.stringify(categories)));
    } catch (err) {
      console.error(err);
      toast.error(t("Failed to reorder categories"));
    } finally {
      setIsSorting(false);
    }
  };

  const handleCancelOrder = () => {
    setCategories(JSON.parse(JSON.stringify(originalCategories)));
    setHasChanges(false);
    toast.info(t("Changes cancelled"));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = validateForm(form, t);
    setErrors(newErrors);

    if (!isFormValid(newErrors)) {
      return;
    }

    try {
      const submitData = {
        name: form.name,
        description: form.description,
        is_active: form.is_active,
      };

      if (editingCategory && editingCategory.id) {
        await EditEventCategoryById(editingCategory.id, submitData);
        toast.success(t("Category updated"));
      } else {
        await AddEventCategory(submitData);
        toast.success(t("Category created"));
      }
      setShowModal(false);
      getCategoriesData(0);
    } catch (err) {
      console.error(err);
      toast.error(t("Operation failed"));
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedCategory?.id) return;
    try {
      await DeleteEventCategory(selectedCategory.id);
      toast.success(t("Category deleted"));
      setShowDeleteModal(false);
      setSelectedCategory(null);
      getCategoriesData(0);
    } catch (err) {
      console.error(err);
      toast.error(t("Delete failed"));
    }
  };

  const handleStatusToggle = async (cat) => {
    if (!cat.is_active && cat.event_count === 0) {
      toast.info(
        t(
          "You cannot activate this category because it does not contain any events. Please add events first."
        )
      );
      return;
    }
    try {
      await EditEventCategoryById(cat.id, {
        ...cat,
        is_active: !cat.is_active,
      });
      toast.success(
        cat.is_active ? t("Category disabled") : t("Category enabled")
      );
      getCategoriesData(currentPage - 1);
    } catch (err) {
      console.error(err);
      toast.error(t("Update failed"));
    }
  };

  const totalPages = Math.ceil(totalRecords / limit);

  useEffect(() => {
    getCategoriesData(0);
  }, [getCategoriesData]);

  return {
    isLoading,
    categories,
    setCategories,
    showModal,
    setShowModal,
    editingCategory,
    setEditingCategory,
    showDeleteModal,
    setShowDeleteModal,
    selectedCategory,
    setSelectedCategory,
    totalRecords,
    searchTerm,
    setSearchTerm,
    form,
    setForm,
    errors,
    setErrors,
    currentPage,
    setCurrentPage,
    draggedItem,
    setDraggedItem,
    isSorting,
    originalCategories,
    setOriginalCategories,
    hasChanges,
    setHasChanges,
    limit,
    totalPages,
    getCategoriesData,
    handlePageChange,
    openAddModal,
    openEditModal,
    handleInputChange,
    handleToggle,
    handleDragStart,
    handleDragOver,
    handleDrop,
    handleDragEnd,
    handleSaveOrder,
    handleCancelOrder,
    handleSubmit,
    handleConfirmDelete,
    handleStatusToggle,
    i18n,
    t,
    TOGGLE_FIELDS,
  };
};
