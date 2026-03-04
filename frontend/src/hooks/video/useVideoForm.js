/**
 * Custom hook for managing Video Form state and logic
 */

import { useState, useEffect, useRef } from "react";

import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { format } from "date-fns";

import {
  CreateVideo,
  EditVideoById,
  GetVideoCategories,
  FetchYouTubeInfo,
} from "@/api/videos";
import { processImageFile } from "@/Utility/imageConverter";
import { setErrorFn } from "@/Utility/Global/setErrorFn";
import { FORM_DATA_INITIAL_STATE } from "@/constants/video/videoConstants";
import {
  validateForm,
  isFormValid,
  isValidYouTubeUrl,
} from "@/Utility/Video/validation";

export const useCreateOrEditVideo = (video, onSectionChange) => {
  const { t } = useTranslation();

  // Form state
  const [formData, setFormData] = useState(FORM_DATA_INITIAL_STATE);
  const [initialFormData, setInitialFormData] = useState(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [errors, setErrors] = useState({});
  const [tagInput, setTagInput] = useState("");
  const [guestSpeakersInput, setGuestSpeakersInput] = useState("");
  const [showAttachmentsModal, setShowAttachmentsModal] = useState(false);
  const [previewFile, setPreviewFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  // Image preview
  const [imagePreview, setImagePreview] = useState(null);

  // Dropdown state
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [categoriesList, setCategoriesList] = useState([]);
  const [categorySearchValue, setCategorySearchValue] = useState("");

  // Loading states
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingYoutube, setIsFetchingYoutube] = useState(false);

  // Refs
  const categoryDropdownRef = useRef(null);

  // ============ API Functions ============

  const getCategories = async (searchVal = "") => {
    try {
      const res = await GetVideoCategories(10, 0, searchVal);
      setCategoriesList(res.data.results);
    } catch (err) {
      setErrorFn(err, t);
    }
  };

  // ============ Form Handlers ============

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    setHasChanges(true);

    // Clear error when user starts typing
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

    if (errors.category) {
      setErrors((prev) => ({
        ...prev,
        category: "",
      }));
    }
  };

  const handleTagsInput = (e) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      if (!formData?.tags.includes(tagInput.trim())) {
        setFormData((prev) => ({
          ...prev,
          tags: [...prev.tags, tagInput.trim()],
        }));
        setHasChanges(true);
      }
      setTagInput("");

      if (errors.tags) {
        setErrors((prev) => ({
          ...prev,
          tags: "",
        }));
      }
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
    setHasChanges(true);
  };

  const handleGuestSpeakersInput = (e) => {
    if (e.key === "Enter" && guestSpeakersInput.trim()) {
      e.preventDefault();
      console.log("Adding guest speaker:", guestSpeakersInput.trim());
      if (
        !(formData?.guest_speakers || []).includes(guestSpeakersInput.trim())
      ) {
        setFormData((prev) => ({
          ...prev,
          guest_speakers: [
            ...(prev.guest_speakers || []),
            guestSpeakersInput.trim(),
          ],
        }));
        setHasChanges(true);
      }
      setGuestSpeakersInput("");

      if (errors.guest_speakers) {
        setErrors((prev) => ({
          ...prev,
          guest_speakers: "",
        }));
      }
    }
  };

  const removeGuestSpeaker = (guestToRemove) => {
    setFormData((prev) => ({
      ...prev,
      guest_speakers: prev.guest_speakers.filter(
        (item) => item !== guestToRemove,
      ),
    }));
  };

  const handleConfirmAttachments = (selectedAttachments) => {
    setFormData((prev) => ({
      ...prev,
      attachments: selectedAttachments,
    }));
    setShowAttachmentsModal(false);
  };
  const handleRemoveAttachment = (attachmentId) => {
    setFormData((prev) => ({
      ...prev,
      attachments: prev.attachments.filter((att) => att.id !== attachmentId),
    }));
  };
  const handlePreviewFile = (file) => {
    console.log("111111:", file);
    setPreviewFile(file);
    // Handle both File objects and attachment objects from server
    let url;
    if (file instanceof File) {
      url = URL.createObjectURL(file);
    } else if (file?.file) {
      // attachment object from server with file URL
      url = file.file;
    } else {
      return;
    }
    setPreviewUrl(url);
  };

  const handleClosePreview = () => {
    // Only revoke if URL was created with createObjectURL
    if (previewUrl && previewUrl.startsWith("blob:")) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewFile(null);
    setPreviewUrl(null);
  };

  const handleThumbnailUpload = async (file) => {
    if (file) {
      try {
        const { file: processedFile, url } = await processImageFile(file);
        setImagePreview(processedFile);
        setFormData((prev) => ({ ...prev, thumbnail: url }));
        setErrors((prev) => ({
          ...prev,
          thumbnail: "",
        }));
      } catch (error) {
        console.error("Error processing image:", error);
        toast.error(t("Failed to process image"));
      }
    }
  };

  const handleFetchYouTubeInfo = async () => {
    const url = formData?.video_url?.trim();

    if (!url) {
      setErrors((prev) => ({
        ...prev,
        video_url: t("Video URL is required"),
      }));
      toast.error(t("Please enter a YouTube URL"));
      return;
    }

    if (!isValidYouTubeUrl(url)) {
      setErrors((prev) => ({
        ...prev,
        video_url: t("Please enter a valid YouTube URL"),
      }));
      toast.error(t("Please enter a valid YouTube URL"));
      return;
    }

    setIsFetchingYoutube(true);

    try {
      const response = await FetchYouTubeInfo({ video_url: url });
      const data = response?.data || {};
      setFormData((prev) => {
        const preferredOrder = [
          "maxres",
          "high",
          "standard",
          "medium",
          "default",
        ];
        const thumbnails = data?.thumbnails || {};
        const fallbackThumb = preferredOrder
          .map((key) => thumbnails?.[key]?.url)
          .find((thumb) => Boolean(thumb));

        const next = {
          ...prev,
          title: prev.title || data?.title || "",
          description: prev.description || data?.description || "",
          reference_code: prev.reference_code || data?.reference_code || "",
          language: prev.language || data?.default_language || "",
          duration: prev.duration || data?.duration_formatted || "",
          // convert to json
          thumbnail_url: JSON.stringify(thumbnails),
          happened_at:
            prev.happened_at || data?.published_at || prev.happened_at,
        };

        if (!prev.thumbnail_url && fallbackThumb) {
          setImagePreview(fallbackThumb);
        }

        return next;
      });

      setErrors((prev) => ({
        ...prev,
        title: "",
        description: "",
        reference_code: "",
        language: "",
        video_url: "",
      }));
      setHasChanges(true);
      toast.success(t("YouTube details fetched successfully"));
    } catch (err) {
      setErrorFn(err, t);
    } finally {
      setIsFetchingYoutube(false);
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

    const formDataToSend = new FormData();

    formDataToSend.append("title", formData?.title);
    formDataToSend.append(
      "category",
      formData?.category?.id || formData?.category,
    );
    formDataToSend.append("video_type", formData?.video_type);
    formDataToSend.append("language", formData?.language);
    formDataToSend.append("video_url", formData?.video_url);

    if (formData?.happened_at) {
      const formattedDate = format(
        new Date(formData.happened_at),
        "yyyy-MM-dd'T'HH:mm:ss",
      );
      formDataToSend.append("happened_at", formattedDate);
    }
    // Add attachments IDs
    if (formData.attachments && formData.attachments.length > 0) {
      formData.attachments.forEach((att) => {
        formDataToSend.append("attachments", att.id);
      });
    }
    formDataToSend.append("description", formData?.description);
    formDataToSend.append(
      "guest_speakers",
      JSON.stringify(formData?.guest_speakers),
    );

    if (formData?.duration) {
      formDataToSend.append("duration", formData?.duration);
    }

    if (imagePreview instanceof File) {
      formDataToSend.append("thumbnail", imagePreview);
    }

    if (formData?.thumbnail_url) {
      formDataToSend.append("thumbnail_url", formData?.thumbnail_url);
    }

    setIsLoading(true);

    try {
      video?.id
        ? await EditVideoById(video?.id, formDataToSend)
        : await CreateVideo(formDataToSend);

      toast.success(
        video?.id
          ? t("Video updated successfully")
          : t("Video created successfully"),
      );
      onSectionChange("videos");
    } catch (err) {
      setErrorFn(err, t);
    } finally {
      setIsLoading(false);
    }
  };

  // ============ Effects ============

  // Initialize form data when editing
  useEffect(() => {
    if (video) {
      const initialData = {
        title: video?.title || "",
        category: video?.category || "",
        language: video?.language || "",
        thumbnail: video?.thumbnail,
        thumbnail_url: JSON.stringify(video?.thumbnail_url) || "",
        is_featured: video?.is_featured || false,
        reference_code: video?.reference_code || "",
        video_url: video?.video_url || "",
        happened_at: video?.happened_at || "",
        description: video?.description || "",
        status: video?.status || "",
        duration: video?.duration || "",
        guest_speakers: video?.guest_speakers || [],
        video_type: video?.video_type || "",
        attachments: video?.attachments || [],
      };
      console.log(video);
      setFormData(initialData);
      setInitialFormData(initialData);
      setHasChanges(false);
      setImagePreview(video?.thumbnail || null);
    } else {
      setInitialFormData(null);
      setHasChanges(false);
    }
  }, [video]);

  // Check for changes when formData changes
  useEffect(() => {
    if (video && initialFormData) {
      const hasTextChanges = Object.keys(initialFormData).some((key) => {
        if (key === "thumbnail") {
          return false;
        }
        return formData[key] !== initialFormData[key];
      });

      const hasNewThumbnail = formData?.thumbnail !== null;

      setHasChanges(hasTextChanges || hasNewThumbnail);
    }
  }, [formData, video, initialFormData]);

  // Fetch categories on mount
  useEffect(() => {
    getCategories();
  }, []);

  // Close dropdowns when clicking outside
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

  return {
    // Form state
    formData,
    setFormData,
    hasChanges,
    errors,
    previewFile,
    previewUrl,
    setErrors,
    tagInput,
    setTagInput,
    guestSpeakersInput,
    setGuestSpeakersInput,
    showAttachmentsModal,
    setShowAttachmentsModal,
    // Image state
    imagePreview,
    setImagePreview,

    // Dropdown state
    showCategoryDropdown,
    setShowCategoryDropdown,
    categoriesList,
    categorySearchValue,
    setCategorySearchValue,
    categoryDropdownRef,

    // Loading states
    isLoading,
    isFetchingYoutube,

    // Handlers
    handleInputChange,
    handleCategorySelect,
    handleTagsInput,
    removeTag,
    handleGuestSpeakersInput,
    removeGuestSpeaker,
    handleThumbnailUpload,
    handleFetchYouTubeInfo,
    handleSubmit,
    handleConfirmAttachments,
    handleRemoveAttachment,
    handlePreviewFile,
    handleClosePreview,
    // API Functions
    getCategories,

    // Utilities
    isValidYouTubeUrl,
  };
};
