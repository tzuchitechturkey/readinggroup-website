import { useState, useEffect, useRef, useCallback } from "react";

import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { format } from "date-fns";

import { setErrorFn } from "@/Utility/Global/setErrorFn";
import { processImageFile } from "@/Utility/imageConverter";
import { CreateEvent, EditEventById, GetEventCategories } from "@/api/events";

import { FORM_DATA_INITIAL_STATE } from "../utils/eventForm/constants";
import { validateForm, isFormValid } from "../utils/eventForm/validation";

export const useEventForm = (event = null, onSectionChange) => {
  const { t } = useTranslation();
  const categoryDropdownRef = useRef(null);

  const [formData, setFormData] = useState(FORM_DATA_INITIAL_STATE);
  const [errors, setErrors] = useState({});
  const [imagePreview, setImagePreview] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [categoriesList, setCategoriesList] = useState([]);
  const [categorySearchValue, setCategorySearchValue] = useState("");
  const [hasChanges, setHasChanges] = useState(false);

  // Initialize form when editing
  useEffect(() => {
    if (event?.id) {
      setFormData({
        category: event.category || "",
        title: event.title || "",
        image: null,
        image_url: event.image_url || "",
        country: event.country || "",
        language: event.language || "",
        happened_at: event.happened_at || "",
        thumbnail: null,
        thumbnail_url: event.thumbnail_url || "",
        status: event.status || "",
        external_link: event.external_link || "",
        report_type: event.report_type || "",
      });
      setImagePreview(event.image || event.image_url);
      setHasChanges(false);
    } else {
      resetForm();
    }
  }, [event?.id]);

  // Cleanup blob URLs on unmount
  useEffect(() => {
    return () => {
      if (imagePreview && imagePreview.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        categoryDropdownRef.current &&
        !categoryDropdownRef.current.contains(event.target)
      ) {
        setShowCategoryDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const getCategories = useCallback(async (searchVal = "") => {
    try {
      const res = await GetEventCategories(10, 0, searchVal);
      setCategoriesList(res?.data?.results);
    } catch (error) {
      console.error(error);
    }
  }, []);

  // Load categories on component mount
  useEffect(() => {
    getCategories();
  }, [getCategories]);

  const resetForm = useCallback(() => {
    setFormData(FORM_DATA_INITIAL_STATE);
    setErrors({});
    setImagePreview("");
    setHasChanges(false);

    if (imagePreview && imagePreview.startsWith("blob:")) {
      URL.revokeObjectURL(imagePreview);
    }
  }, [imagePreview]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    setHasChanges(true);

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleCategorySelect = (category) => {
    setFormData((prev) => ({
      ...prev,
      category: category.id,
    }));
    setShowCategoryDropdown(false);
    setCategorySearchValue("");
    setHasChanges(true);

    if (errors.category) {
      setErrors((prev) => ({
        ...prev,
        category: "",
      }));
    }
  };

  const handleThumbnailUpload = async (file) => {
    if (!file) return;

    try {
      const { file: processedFile, url } = await processImageFile(file);

      setFormData((prev) => ({
        ...prev,
        image: processedFile,
      }));

      setImagePreview(url);
      setHasChanges(true);

      if (errors.image) {
        setErrors((prev) => ({
          ...prev,
          image: "",
        }));
      }
    } catch (error) {
      console.error("Error processing image:", error);
      toast.error(t("Failed to process image"));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = validateForm(formData, t);
    setErrors(newErrors);

    if (!isFormValid(newErrors)) {
      toast.error(t("Please fix the errors in the form"));
      return;
    }

    const submitData = new FormData();
    submitData.append("category", formData.category?.id || formData.category);
    submitData.append("title", formData.title);
    submitData.append("status", formData.status);
    submitData.append("country", formData.country);
    submitData.append("language", formData.language);
    submitData.append("report_type", formData.report_type);

    if (formData.image) {
      submitData.append("image", formData.image);
    }

    if (formData.image_url) {
      submitData.append("image_url", formData.image_url);
    }

    if (formData.happened_at) {
      const formattedDate = format(
        new Date(formData.happened_at),
        "yyyy-MM-dd",
      );
      submitData.append("happened_at", formattedDate);
    }

    submitData.append("external_link", formData.external_link);

    setIsLoading(true);
    try {
      if (event?.id) {
        await EditEventById(event.id, submitData);
        toast.success(t("Event updated successfully"));
      } else {
        await CreateEvent(submitData);
        toast.success(t("Event created successfully"));
      }

      onSectionChange("events");
      resetForm();
    } catch (error) {
      setErrorFn(error, t);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    formData,
    setFormData,
    errors,
    setErrors,
    imagePreview,
    setImagePreview,
    isLoading,
    showCategoryDropdown,
    setShowCategoryDropdown,
    categoriesList,
    categorySearchValue,
    setCategorySearchValue,
    categoryDropdownRef,
    hasChanges,
    handleInputChange,
    handleCategorySelect,
    handleThumbnailUpload,
    handleSubmit,
    resetForm,
    getCategories,
  };
};
