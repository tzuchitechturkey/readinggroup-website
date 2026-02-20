/**
 * Custom hook for managing Content Form state and logic
 */

import { useState, useEffect, useRef } from "react";

import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

import { processImageFile } from "@/Utility/imageConverter";
import {
  CreateContent,
  EditContentById,
  GetContentCategories,
} from "@/api/contents";
import { GetAuthors } from "@/api/authors";
import { setErrorFn } from "@/Utility/Global/setErrorFn";

import { FORM_DATA_INITIAL_STATE } from "../../utils/contentForm/constants";
import { validateForm, isFormValid } from "../../utils/contentForm/validation";

export const useCreateOrEditContent = (content, onSectionChange) => {
  const { t, i18n } = useTranslation();

  // Form state
  const [formData, setFormData] = useState(FORM_DATA_INITIAL_STATE);
  const [initialFormData, setInitialFormData] = useState(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [errors, setErrors] = useState({});
  const [tagInput, setTagInput] = useState("");
  const [imageUrlsInput, setImageUrlsInput] = useState("");

  // Image files state
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  // Attachment files state
  const [attachmentFiles, setAttachmentFiles] = useState([]);
  const [previewFile, setPreviewFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  // Dropdown state
  const [showWriterDropdown, setShowWriterDropdown] = useState(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [writersList, setWritersList] = useState([]);
  const [categoriesList, setCategoriesList] = useState([]);
  const [writerSearchValue, setWriterSearchValue] = useState("");
  const [categorySearchValue, setCategorySearchValue] = useState("");

  // Loading state
  const [isLoading, setIsLoading] = useState(false);
  const [showAttachmentsModal, setShowAttachmentsModal] = useState(false);

  // Refs
  const writerDropdownRef = useRef(null);
  const categoryDropdownRef = useRef(null);

  // ============ API Functions ============

  const getWriters = async (searchVal = "") => {
    try {
      const res = await GetAuthors(10, 0, searchVal);
      setWritersList(res?.data?.results);
    } catch (error) {
      console.error("Error fetching writers:", error);
    }
  };

  const getCategories = async (searchVal = "") => {
    try {
      const res = await GetContentCategories(10, 0, searchVal);
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

  const handleMultipleImageUpload = async (files) => {
    if (!files || files.length === 0) return;

    try {
      const processedFiles = [];
      const newPreviews = [];

      for (const file of files) {
        const { file: processedFile, url } = await processImageFile(file);
        processedFiles.push(processedFile);
        newPreviews.push(url);
      }

      setImageFiles((prev) => [...prev, ...processedFiles]);
      setImagePreviews((prev) => [...prev, ...newPreviews]);

      // Clear error when uploading
      if (errors.image) {
        setErrors((prev) => ({ ...prev, image: "" }));
      }
    } catch (error) {
      console.error("Error processing images:", error);
      toast.error(t("Failed to process some images"));
    }
  };

  const handleRemoveImagePreview = (index) => {
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleRemoveExistingImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleAddImageUrl = () => {
    if (imageUrlsInput.trim()) {
      if (!formData.images_url.includes(imageUrlsInput.trim())) {
        setFormData((prev) => ({
          ...prev,
          images_url: [...prev.images_url, imageUrlsInput.trim()],
        }));
      }
      setImageUrlsInput("");
      setErrors((prev) => ({
        ...prev,
        images_url: "",
      }));
    }
  };

  const handleRemoveImageUrl = (index) => {
    setFormData((prev) => ({
      ...prev,
      images_url: prev.images_url.filter((_, i) => i !== index),
    }));
  };

  const handlePreviewFile = (file) => {
    setPreviewFile(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  const handleClosePreview = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewFile(null);
    setPreviewUrl(null);
  };

  const handleWriterSelect = (writer) => {
    setFormData((prev) => ({
      ...prev,
      writer: writer.name,
      writer_avatar: writer.avatar || writer?.avatar_url,
    }));
    setShowWriterDropdown(false);
    setWriterSearchValue("");

    if (errors.writer) {
      setErrors((prev) => ({
        ...prev,
        writer: "",
      }));
    }
  };

  const handleWriterSearch = () => {
    getWriters(writerSearchValue);
  };

  const handleClearWriterSearch = () => {
    setWriterSearchValue("");
    getWriters("");
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

  const handleTagInput = (e) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      if (!formData.tags.includes(tagInput.trim())) {
        setFormData((prev) => ({
          ...prev,
          tags: [...prev.tags, tagInput.trim()],
        }));
      }
      setTagInput("");
      setErrors((prev) => ({
        ...prev,
        tags: "",
      }));
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = validateForm(formData, t, content);
    
    // Additional check for images
    const hasImageFiles = imageFiles.length > 0;
    const hasImageUrls = formData.images_url && formData.images_url.length > 0;
    const hasExistingImages = formData.images && formData.images.length > 0;

    if (!hasImageFiles && !hasImageUrls && !hasExistingImages && !content) {
      newErrors.images = t("At least one image or image URL is required");
    }

    setErrors(newErrors);

    if (!isFormValid(newErrors)) {
      toast.error(t("Please fix the errors in the form"));
      return;
    }

    // Create FormData for file upload
    const contentData = new FormData();

    // Add all text fields
    contentData.append("title", formData.title);
    contentData.append("subtitle", formData.subtitle);
    contentData.append("body", formData.body);
    contentData.append("writer", formData.writer);
    contentData.append("category", formData?.category?.id || formData?.category);
    contentData.append("status", formData.status);
    contentData.append("is_active", formData.is_active);
    contentData.append("read_time", formData.read_time);
    contentData.append("tags", JSON.stringify(formData.tags));
    contentData.append("language", formData.language);
    contentData.append("country", formData.country);

    // Add image files
    if (imageFiles.length > 0) {
      imageFiles.forEach((file) => {
        if (file instanceof File) {
          contentData.append("images", file);
        }
      });
    }

    // Add image URLs
    if (Array.isArray(formData.images_url) && formData.images_url.length > 0) {
      formData.images_url.forEach((imgUrl) => {
        if (typeof imgUrl === "string" && imgUrl.trim()) {
          contentData.append("images_url", imgUrl);
        }
      });
    }

    // Add metadata if provided
    if (formData.metadata) {
      contentData.append("metadata", formData.metadata);
    }

    // Add attachments IDs
    if (formData.attachments && formData.attachments.length > 0) {
      formData.attachments.forEach((att) => {
        contentData.append("attachments", att.id);
      });
    }

    // Add timestamps
    if (content) {
      contentData.append("created_at", content?.created_at);
      contentData.append("views", content?.views || 0);
    }
    contentData.append("updated_at", new Date().toISOString());

    setIsLoading(true);
    try {
      content?.id
        ? await EditContentById(content?.id, contentData)
        : await CreateContent(contentData);

      toast.success(
        content?.id
          ? t("Content updated successfully")
          : t("Content created successfully"),
      );
      onSectionChange("contents");
    } catch (error) {
      setErrorFn(error, t);
    } finally {
      setIsLoading(false);
    }
  };

  // ============ Effects ============

  // Initialize form data when editing
  useEffect(() => {
    if (content) {
      const initialData = {
        title: content?.title || "",
        subtitle: content?.subtitle || "",
        body: content?.body || "",
        writer: content?.writer || "",
        writer_avatar: content?.writer_avatar || "",
        category: content?.category || "",
        status: content?.status || "draft",
        is_active:
          content?.is_active !== undefined ? content?.is_active : true,
        read_time: content?.read_time || "",
        tags: content?.tags || "",
        language: content?.language || "",
        image: content?.image || null,
        images: content?.images || [],
        images_url: content?.images_url || [],
        metadata: content?.metadata || "",
        country: content?.country || "",
        attachments: content?.attachments_data || content?.attachments || [],
      };
      setFormData(initialData);
      setInitialFormData(initialData);
      setHasChanges(false);
    } else {
      setInitialFormData(null);
      setHasChanges(false);
    }
  }, [content]);

  // Check for changes when formData changes
  useEffect(() => {
    if (content && initialFormData) {
      const hasTextChanges = Object.keys(initialFormData).some((key) => {
        if (key === "tags") {
          return (
            JSON.stringify(formData[key]) !==
            JSON.stringify(initialFormData[key])
          );
        }
        return formData[key] !== initialFormData[key];
      });

      setHasChanges(hasTextChanges);
    }
  }, [formData, content, initialFormData]);

  // Fetch writers and categories on mount
  useEffect(() => {
    getWriters();
    getCategories();
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        writerDropdownRef.current &&
        !writerDropdownRef.current.contains(event.target)
      ) {
        setShowWriterDropdown(false);
      }

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
    setErrors,
    tagInput,
    setTagInput,
    imageUrlsInput,
    setImageUrlsInput,

    // Image state
    imageFiles,
    imagePreviews,
    setImageFiles,
    setImagePreviews,
    previewFile,
    previewUrl,

    // Attachment state
    attachmentFiles,
    setAttachmentFiles,
    showAttachmentsModal,
    setShowAttachmentsModal,

    // Dropdown state
    showWriterDropdown,
    setShowWriterDropdown,
    showCategoryDropdown,
    setShowCategoryDropdown,
    writersList,
    categoriesList,
    writerSearchValue,
    setWriterSearchValue,
    categorySearchValue,
    setCategorySearchValue,

    // Loading state
    isLoading,

    // Refs
    writerDropdownRef,
    categoryDropdownRef,

    // Image Handlers
    handleMultipleImageUpload,
    handleRemoveImagePreview,
    handleRemoveExistingImage,
    handleAddImageUrl,
    handleRemoveImageUrl,
    handlePreviewFile,
    handleClosePreview,

    // Dropdown Handlers
    handleWriterSelect,
    handleWriterSearch,
    handleClearWriterSearch,
    handleCategorySelect,

    // Tag Handlers
    handleTagInput,
    removeTag,

    // Attachment Handlers
    handleConfirmAttachments,
    handleRemoveAttachment,

    // General Handlers
    handleInputChange,
    handleSubmit,

    // API Functions
    getCategories,

    // Utilities
    i18n,
    t,
  };
};
