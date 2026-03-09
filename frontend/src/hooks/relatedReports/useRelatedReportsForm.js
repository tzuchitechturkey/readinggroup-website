import { useState, useEffect, useRef, useMemo } from "react";

import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

import { setErrorFn } from "@/Utility/Global/setErrorFn";
import {
  CreateRelatedReport,
  EditRelatedReportById,
  GetRelatedReportCategories,
} from "@/api/relatedReports";

export const useCreateOrEditRelatedReports = (report, onSectionChange) => {
  const { t } = useTranslation();

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    external_link: "",
    duration: "",
    happened_at: "",
    image: null,
    category: null,
  });

  const [originalFormData, setOriginalFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  //   Category dropdown state
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [categoriesList, setCategoriesList] = useState([]);
  const [categorySearchValue, setCategorySearchValue] = useState("");
  const categoryDropdownRef = useRef(null);
  
  // Check if form has changes
  const hasChanges = useMemo(() => {
    return JSON.stringify(formData) !== JSON.stringify(originalFormData);
  }, [formData, originalFormData]);
  
  // Initialize form data when report changes
  useEffect(() => {
    if (report) {
      const initialData = {
        title: report.title || "",
        external_link: report.external_link || "",
        duration: report.duration || "",
        happened_at: report.happened_at || "",
        image: null,
        category: report.category || null,
      };
      setFormData(initialData);
      setOriginalFormData(JSON.parse(JSON.stringify(initialData)));
    } else {
      const initialData = {
        title: "",
        external_link: "",
        duration: "",
        happened_at: "",
        image: null,
        category: null,
      };
      setFormData(initialData);
      setOriginalFormData(JSON.parse(JSON.stringify(initialData)));
    }
  }, [report]);
  //   Get categories
  const getCategories = async (searchVal = "") => {
    try {
      const res = await GetRelatedReportCategories(50, 0, searchVal);
      setCategoriesList(res?.data?.results || []);
    } catch (error) {
      setErrorFn(error, t);
    }
  };
  //   Load categories on mount
  useEffect(() => {
    getCategories();
  }, []);
  //   Close dropdown when clicking outside
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
  const handleInputChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    if (type === "file") {
      setFormData((prev) => ({
        ...prev,
        [name]: files?.[0] || null,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };
  const handleCategorySelect = (category) => {
    setFormData((prev) => ({ ...prev, category }));
    setShowCategoryDropdown(false);
    setCategorySearchValue("");
    if (errors.category) {
      setErrors((prev) => ({ ...prev, category: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setIsLoading(true);
    
    // Validation
    const newErrors = {};
    if (!formData.title?.trim()) {
      newErrors.title = t("Title is required");
    }
    if (!formData.duration?.trim()) {
      newErrors.duration = t("Duration is required");
    }
    if (!formData.happened_at?.trim()) {
      newErrors.happened_at = t("Event date is required");
    } else if (!isValidDate(formData.happened_at)) {
      newErrors.happened_at = t("Please enter date in YYYY-MM-DD format");
    }
    if (formData.external_link && !isValidUrl(formData.external_link)) {
      newErrors.external_link = t("Please enter a valid URL");
    }
    if (!formData.image && !report) {
      newErrors.image = t("Report image is required");
    }
    if (!formData.category) {
      newErrors.category = t("Category is required");
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      toast.error(t("Please fix the errors in the form"));
      return;
    }
    
    try {
      const submitData = new FormData();

      submitData.append("title", formData.title.trim());
      submitData.append("external_link", formData.external_link || "");
      submitData.append("duration", formData.duration || "");
      submitData.append("happened_at", formData.happened_at || "");

      if (formData.category) {
        submitData.append("category", formData.category.id);
      }

      if (formData.image) {
        submitData.append("image", formData.image);
      }

      if (report) {
        // Edit existing report
        await EditRelatedReportById(report.id, submitData);
        toast.success(t("Related report updated successfully"));
      } else {
        // Create new report
        await CreateRelatedReport(submitData);
        toast.success(t("Related report created successfully"));
      }
      onSectionChange("relatedReports");
    } catch (error) {
      setErrorFn(error, t);
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to validate URL
  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  // Helper function to validate date format (YYYY-MM-DD)
  const isValidDate = (dateString) => {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(dateString)) return false;
    
    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date);
  };

  return {
    // Form state
    formData,
    hasChanges,
    errors,
    isLoading,

    // Category dropdown state
    showCategoryDropdown,
    setShowCategoryDropdown,
    categoriesList,
    categorySearchValue,
    setCategorySearchValue,
    categoryDropdownRef,

    // Handlers
    handleInputChange,
    handleCategorySelect,
    handleSubmit,

    // API functions
    getCategories,

    // Utils
    t,
  };
};
