import { useState, useEffect, useRef } from "react";

import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

import { processImageFile } from "@/Utility/imageConverter";
import { setErrorFn } from "@/Utility/Global/setErrorFn";
import { CreateLearn, EditLearnById, GetLearnCategories } from "@/api/learn";

import { FORM_DATA_INITIAL_STATE } from "../../utils/postForm/constants";
import { validateForm, isFormValid } from "../../utils/postForm/validation";

export const useCreateOrEditLearn = (learn, onSectionChange) => {
  const { t, i18n } = useTranslation();

  // Form state
  const [formData, setFormData] = useState(FORM_DATA_INITIAL_STATE);
  const [initialFormData, setInitialFormData] = useState(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [errors, setErrors] = useState({});
  const [imageFile, setImageFile] = useState(null);

  // Dropdown state
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [categoriesList, setCategoriesList] = useState([]);
  const [categorySearchValue, setCategorySearchValue] = useState("");

  // Loading state
  const [isLoading, setIsLoading] = useState(false);

  // Refs
  const categoryDropdownRef = useRef(null);

  // ============ API Functions ============

  const getCategories = async (searchVal = "") => {
    try {
      const res = await GetLearnCategories(10, 0, searchVal);
      setCategoriesList(res?.data?.results);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  // ============ Form Handlers ============

  const handleInputChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    let newValue;

    if (type === "checkbox") {
      newValue = checked;
    } else if (type === "file") {
      newValue = files[0];
    } else {
      newValue = value;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleImageUpload = async (file) => {
    if (!file) return;

    try {
      const { file: processedFile, url } = await processImageFile(file);
      setImageFile(processedFile);
      setFormData((prev) => ({ ...prev, image: url }));

      // Clear error when uploading
      if (errors.image) {
        setErrors((prev) => ({ ...prev, image: "" }));
      }
    } catch (error) {
      console.error("Error processing image:", error);
      toast.error(t("Failed to process image"));
    }
  };

  const handleCategorySelect = (category) => {
    setFormData((prev) => ({
      ...prev,
      category: category.id,
    }));
    setShowCategoryDropdown(false);
    setCategorySearchValue("");

    if (errors.category) {
      setErrors((prev) => ({
        ...prev,
        category: "",
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = validateForm(formData, t, learn);
    setErrors(newErrors);

    if (!isFormValid(newErrors)) {
      toast.error(t("Please fix the errors in the form"));
      return;
    }

    // Create FormData for file upload
    const learnData = new FormData();

    // Add all text fields
    learnData.append("title", formData.title);
    learnData.append("subtitle", formData.subtitle);
    learnData.append("category", formData?.category?.id || formData?.category);
    // learnData.append("status", formData.status);
    learnData.append("learn_type", formData.learn_type);

    // Only append image if a new file was selected
    if (imageFile instanceof File) {
      learnData.append("image", imageFile);
    }

    // Add image_url if provided
    if (formData.image_url) {
      learnData.append("image_url", formData.image_url);
    }

    learnData.append("updated_at", new Date().toISOString());

    setIsLoading(true);
    try {
      learn?.id
        ? await EditLearnById(learn.id, learnData)
        : await CreateLearn(learnData);

      toast.success(
        learn?.id
          ? t("Learn updated successfully")
          : t("Learn created successfully"),
      );
      onSectionChange("learn");
    } catch (error) {
      setErrorFn(error, t);
    } finally {
      setIsLoading(false);
    }
  };

  // ============ Effects ============

  // Initialize form data when editing
  useEffect(() => {
    if (learn) {
      const initialData = {
        title: learn.title || "",
        subtitle: learn.subtitle || "",
        category: learn.category || "",
        // status: learn.status || "draft",
        tags: learn.tags || "",
        language: learn.language || "",
        learn_type: learn.learn_type || "",
        image: learn.image || null,
        image_url: learn.image_url || "",
      };
      setFormData(initialData);
      setInitialFormData(initialData);
      setHasChanges(false);
    } else {
      setInitialFormData(null);
      setHasChanges(false);
    }
  }, [learn]);

  // Check for changes when formData changes
  useEffect(() => {
    if (learn && initialFormData) {
      const hasTextChanges = Object.keys(initialFormData).some((key) => {
        return formData[key] !== initialFormData[key];
      });

      setHasChanges(hasTextChanges);
    }
  }, [formData, learn, initialFormData]);

  // Fetch writers and categories on mount
  useEffect(() => {
    getCategories();
  }, []);

  return {
    // Form state
    formData,
    setFormData,
    hasChanges,
    errors,
    setErrors,
    imageFile,

    // Dropdown state
    showCategoryDropdown,
    setShowCategoryDropdown,
    categoriesList,
    categorySearchValue,
    setCategorySearchValue,

    // Loading state
    isLoading,

    // Refs
    categoryDropdownRef,

    // Handlers
    handleInputChange,
    handleImageUpload,
    handleCategorySelect,
    handleSubmit,

    // API Functions
    getCategories,

    // Utilities
    i18n,
    t,
  };
};
