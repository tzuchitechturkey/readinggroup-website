import { useState, useEffect, useRef, useMemo } from "react";

import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

import { setErrorFn } from "@/Utility/Global/setErrorFn";
import {
  CreateRelatedReport,
  EditRelatedReportById,
  GetRelatedReportCategories,
  FetchYouTubeInfoByUrl,
} from "@/api/relatedReports";

export const useCreateOrEditRelatedReports = (report, onSectionChange) => {
  const { t } = useTranslation();

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    external_link: "",
    duration: "",
    thumbnail_url: "",
    category: null,
  });

  const [originalFormData, setOriginalFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingYoutube, setIsFetchingYoutube] = useState(false);

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
        thumbnail_url: report.thumbnail_url || "",
        category: report.category || null,
      };
      setFormData(initialData);
      setOriginalFormData(JSON.parse(JSON.stringify(initialData)));
    } else {
      const initialData = {
        title: "",
        external_link: "",
        duration: "",
        thumbnail_url: "",
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
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
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

  // Helper function to validate YouTube URL
  const isValidYouTubeUrl = (url) => {
    const youtubeRegex =
      /^(https?:\/\/)?(www\.)?(youtube|youtu|youtube-nocookie)\.(com|be)\//;
    return youtubeRegex.test(url);
  };

  const handleFetchYouTubeInfo = async () => {
    const url = formData?.external_link?.trim();

    if (!url) {
      setErrors((prev) => ({
        ...prev,
        external_link: t("Video URL is required"),
      }));
      toast.error(t("Please enter a YouTube URL"));
      return;
    }

    if (!isValidYouTubeUrl(url)) {
      setErrors((prev) => ({
        ...prev,
        external_link: t("Please enter a valid YouTube URL"),
      }));
      toast.error(t("Please enter a valid YouTube URL"));
      return;
    }

    setIsFetchingYoutube(true);

    try {
      const response = await FetchYouTubeInfoByUrl(url);
      const data = response?.data || {};
      setFormData((prev) => {
        const next = {
          ...prev,
          title: prev.title || data?.title || "",
          description: prev.description || data?.description || "",
          duration: data?.duration_formatted || "", // Always update from YouTube
          thumbnail_url: JSON.stringify(data?.thumbnails) || "",
        };

        return next;
      });

      setErrors((prev) => ({
        ...prev,
        external_link: "",
        title: "",
        description: "",
        duration: "",
        thumbnail_url: "",
      }));
      toast.success(t("YouTube details fetched successfully"));
    } catch (err) {
      setErrorFn(err, t);
    } finally {
      setIsFetchingYoutube(false);
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
    if (formData.external_link && !isValidUrl(formData.external_link)) {
      newErrors.external_link = t("Please enter a valid URL");
    }
    if (!formData.thumbnail_url) {
      console.log("Validating thumbnail URL:", formData.thumbnail_url);
      newErrors.thumbnail_url = t(
        "Please enter the thumbnail URL using the YouTube fetch function",
      );
    }
    if (!formData.category) {
      console.log("Validating category:", formData.category);
      newErrors.category = t("Please select a category");
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

      if (formData.category) {
        submitData.append("category", formData.category.id);
      }

      if (formData.thumbnail_url) {
        submitData.append("thumbnail_url", formData.thumbnail_url);
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
  return {
    // Form state
    formData,
    hasChanges,
    errors,
    isLoading,
    isFetchingYoutube,

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
    handleFetchYouTubeInfo,
    handleSubmit,

    // API functions
    getCategories,

    // Utils
    t,
  };
};
