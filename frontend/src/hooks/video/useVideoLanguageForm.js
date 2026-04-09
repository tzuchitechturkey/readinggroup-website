/**
 * Hook for managing a single language version of a video.
 * Handles both PATCH (edit existing) and POST (add new translation).
 */

import { useState, useEffect, useRef } from "react";

import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { format } from "date-fns";

import {
  CreateVideo,
  PatchVideoById,
  FetchYouTubeInfo,
  GetVideoCategories,
} from "@/api/videos";
import { processImageFile } from "@/Utility/imageConverter";
import { setErrorFn } from "@/Utility/Global/setErrorFn";
import {
  validateForm,
  isFormValid,
  isValidYouTubeUrl,
} from "@/Utility/Video/validation";

const EMPTY_FORM = {
  title: "",
  category: "",
  video_type: "",
  language: "",
  thumbnail: null,
  thumbnail_url: "",
  video_url: "",
  happened_at: "",
  description: "",
  guest_speakers: [],
  status: "",
  duration: "",
  attachments: [],
};

function buildInitialFormData(data, baseVideoData = null) {
  if (!data) {
    return {
      ...EMPTY_FORM,
      category: baseVideoData?.category || "",
      video_type: baseVideoData?.video_type || "",
    };
  }
  return {
    id: data.id,
    title: data.title || "",
    category: data.category || "",
    video_type: data.video_type || "",
    language: data.language || "",
    thumbnail: data.thumbnail || null,
    thumbnail_url: data.thumbnail_url
      ? JSON.stringify(data.thumbnail_url)
      : "",
    video_url: data.video_url || "",
    happened_at: data.happened_at || "",
    description: data.description || "",
    guest_speakers: data.guest_speakers || [],
    status: data.status || "",
    duration: data.duration || "",
    attachments: data.attachments_data || data.attachments || [],
  };
}

/**
 * @param {object|null} initialData  - existing video fields for this language, or null for a new translation
 * @param {number}      baseVideoId  - id of the base video (used when POSTing a new translation)
 * @param {function}    onSaved      - called with the API response after a successful save
 */
export const useVideoLanguageForm = (initialData, baseVideoId, onSaved, baseVideoData = null, usedLangCodes = []) => {
  const { t } = useTranslation();

  const [formData, setFormData] = useState(() =>
    buildInitialFormData(initialData, baseVideoData),
  );
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(
    initialData?.thumbnail || null,
  );
  const [guestSpeakersInput, setGuestSpeakersInput] = useState("");
  const [isFetchingYoutube, setIsFetchingYoutube] = useState(false);
  const [showAttachmentsModal, setShowAttachmentsModal] = useState(false);
  const [previewFile, setPreviewFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [categoriesList, setCategoriesList] = useState([]);
  const [categorySearchValue, setCategorySearchValue] = useState("");
  const categoryDropdownRef = useRef(null);

  const isNewLang = !initialData?.id;

  // ── API helpers ──────────────────────────────────────────────────────────

  const getCategories = async (searchVal = "") => {
    try {
      const res = await GetVideoCategories(10, 0, searchVal);
      setCategoriesList(res.data.results);
    } catch (err) {
      setErrorFn(err, t);
    }
  };

  // ── Form handlers ────────────────────────────────────────────────────────

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleCategorySelect = (category) => {
    setFormData((prev) => ({ ...prev, category: category.id }));
    setShowCategoryDropdown(false);
    setCategorySearchValue("");
    if (errors.category) {
      setErrors((prev) => ({ ...prev, category: "" }));
    }
  };

  const handleGuestSpeakersInput = (e) => {
    if (e.key === "Enter" && guestSpeakersInput.trim()) {
      e.preventDefault();
      if (!(formData.guest_speakers || []).includes(guestSpeakersInput.trim())) {
        setFormData((prev) => ({
          ...prev,
          guest_speakers: [
            ...(prev.guest_speakers || []),
            guestSpeakersInput.trim(),
          ],
        }));
      }
      setGuestSpeakersInput("");
    }
  };

  const removeGuestSpeaker = (guestToRemove) => {
    setFormData((prev) => ({
      ...prev,
      guest_speakers: prev.guest_speakers.filter((g) => g !== guestToRemove),
    }));
  };

  const handleConfirmAttachments = (selectedAttachments) => {
    setFormData((prev) => ({ ...prev, attachments: selectedAttachments }));
    setShowAttachmentsModal(false);
  };

  const handleRemoveAttachment = (attachmentId) => {
    setFormData((prev) => ({
      ...prev,
      attachments: prev.attachments.filter((att) => att.id !== attachmentId),
    }));
  };

  const handlePreviewFile = (attachment) => {
    setPreviewFile(attachment);
    let url;
    if (attachment instanceof File) {
      url = URL.createObjectURL(attachment);
    } else if (typeof attachment?.file === "string") {
      url = attachment.file;
    } else if (attachment?.file instanceof File) {
      url = URL.createObjectURL(attachment.file);
    } else if (typeof attachment === "string") {
      url = attachment;
    } else {
      return;
    }
    setPreviewUrl(url);
  };

  const handleClosePreview = () => {
    if (previewUrl?.startsWith("blob:")) URL.revokeObjectURL(previewUrl);
    setPreviewFile(null);
    setPreviewUrl(null);
  };

  const handleThumbnailUpload = async (file) => {
    if (!file) return;
    try {
      const { file: processedFile, url } = await processImageFile(file);
      setImagePreview(processedFile);
      setFormData((prev) => ({ ...prev, thumbnail: url }));
    } catch {
      toast.error(t("Failed to process image"));
    }
  };

  const handleFetchYouTubeInfo = async () => {
    const url = formData.video_url?.trim();
    if (!url) {
      setErrors((prev) => ({ ...prev, video_url: t("Video URL is required") }));
      return;
    }
    if (!isValidYouTubeUrl(url)) {
      setErrors((prev) => ({
        ...prev,
        video_url: t("Please enter a valid YouTube URL"),
      }));
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
          .find(Boolean);
        const next = {
          ...prev,
          title: prev.title || data?.title || "",
          description: prev.description || data?.description || "",
          reference_code: prev.reference_code || data?.reference_code || "",
          language: prev.language || (!usedLangCodes.includes(data?.default_language) ? data?.default_language : "") || "",
          duration: prev.duration || data?.duration_formatted || "",
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
        language: "",
        video_url: "",
      }));
      toast.success(t("YouTube details fetched successfully"));
    } catch (err) {
      setErrorFn(err, t);
    } finally {
      setIsFetchingYoutube(false);
    }
  };

  // ── Save ─────────────────────────────────────────────────────────────────

  const buildPayload = () => {
    const fd = new FormData();
    fd.append("title", formData.title);
    fd.append("category", formData.category?.id || formData.category);
    fd.append("video_type", formData.video_type);
    fd.append("language", formData.language);
    fd.append("video_url", formData.video_url);

    if (formData.happened_at) {
      const formatted = format(
        new Date(formData.happened_at),
        "yyyy-MM-dd'T'HH:mm:ss",
      );
      fd.append("happened_at", formatted);
    }
    if (formData.attachments?.length > 0) {
      formData.attachments.forEach((att) => fd.append("attachments", att.id));
    }
    fd.append("description", formData.description);
    fd.append("guest_speakers", JSON.stringify(formData.guest_speakers));
    if (formData.duration) fd.append("duration", formData.duration);
    if (imagePreview instanceof File) fd.append("thumbnail", imagePreview);
    if (formData.thumbnail_url)
      fd.append("thumbnail_url", formData.thumbnail_url);
    return fd;
  };

  const handleSave = async () => {
    const newErrors = validateForm(formData, t);
    setErrors(newErrors);
    if (!isFormValid(newErrors)) {
      toast.error(t("Please fix the errors in the form"));
      return;
    }

    const fd = buildPayload();
    setIsLoading(true);
    try {
      if (isNewLang) {
        fd.append("base_video", baseVideoId);
        const response = await CreateVideo(fd);
        toast.success(t("Language version added successfully"));
        onSaved && onSaved(response.data);
      } else {
        const response = await PatchVideoById(formData.id, fd);
        setFormData((prev) => ({
          ...prev,
          ...buildInitialFormData(response.data),
        }));
        toast.success(t("Language version updated successfully"));
        onSaved && onSaved(null);
      }
    } catch (err) {
      setErrorFn(err, t);
    } finally {
      setIsLoading(false);
    }
  };

  // ── Effects ──────────────────────────────────────────────────────────────

  useEffect(() => {
    getCategories();
  }, []);

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
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return {
    formData,
    errors,
    isLoading,
    imagePreview,
    guestSpeakersInput,
    setGuestSpeakersInput,
    isFetchingYoutube,
    showAttachmentsModal,
    setShowAttachmentsModal,
    previewFile,
    previewUrl,
    showCategoryDropdown,
    setShowCategoryDropdown,
    categoriesList,
    categorySearchValue,
    setCategorySearchValue,
    categoryDropdownRef,
    isNewLang,
    handleInputChange,
    handleCategorySelect,
    handleGuestSpeakersInput,
    removeGuestSpeaker,
    handleConfirmAttachments,
    handleRemoveAttachment,
    handlePreviewFile,
    handleClosePreview,
    handleThumbnailUpload,
    handleFetchYouTubeInfo,
    handleSave,
    getCategories,
  };
};
