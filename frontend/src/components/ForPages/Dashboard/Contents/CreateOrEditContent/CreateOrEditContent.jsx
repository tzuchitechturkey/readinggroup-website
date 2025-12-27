import React, { useState, useEffect, useRef } from "react";

import { Save, X, User, Tag, Search, Upload, FileText } from "lucide-react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Loader from "@/components/Global/Loader/Loader";
import { setErrorFn } from "@/Utility/Global/setErrorFn";
import { processImageFile } from "@/Utility/imageConverter";
import {
  CreateContent,
  EditContentById,
  GetContentCategories,
} from "@/api/contents";
import countries from "@/constants/countries.json";
import { languages, postStatusOptions } from "@/constants/constants";
import Modal from "@/components/Global/Modal/Modal";
import { GetAuthors } from "@/api/authors";

import CustomBreadcrumb from "../../CustomBreadcrumb/CustomBreadcrumb";
import AttachmentsModal from "./AttachmentsModal";

function CreateOrEditContent({ onSectionChange, content = null }) {
  const { t, i18n } = useTranslation();
  const writerDropdownRef = useRef(null);
  const categoryDropdownRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showWriterDropdown, setShowWriterDropdown] = useState(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [writersList, setWritersList] = useState([]);
  const [categoriesList, setCategoriesList] = useState([]);
  const [writerSearchValue, setWriterSearchValue] = useState("");
  const [categorySearchValue, setCategorySearchValue] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    // excerpt: "",
    body: "",
    writer: "",
    writer_avatar: "",
    category: "",
    status: "",
    is_active: true,
    read_time: "",
    tags: "",
    language: "",
    image: null,
    images: [], // الصور المرفوعة كملفات (File objects) أو الصور الموجودة من الـ Backend
    images_url: [], // روابط الصور كنصوص (Array of strings) - يُرسل للـ Backend في مفتاح images_url
    metadata: "",
    country: "",
    attachments: [], // الملفات المرفوعة (PDF, Word, PowerPoint)
  });
  const [initialFormData, setInitialFormData] = useState(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [errors, setErrors] = useState({});
  const [tagInput, setTagInput] = useState("");
  const [imageUrlInput, setImageUrlInput] = useState("");
  const [imageUrlsInput, setImageUrlsInput] = useState("");
  const [imageFiles, setImageFiles] = useState([]); // Store multiple image files
  const [imagePreviews, setImagePreviews] = useState([]); // Store image previews
  const [attachmentFiles, setAttachmentFiles] = useState([]); // Store attachment files
  const [previewFile, setPreviewFile] = useState(null); // Store file for preview
  const [previewUrl, setPreviewUrl] = useState(null); // Store preview URL
  const [showAttachmentsModal, setShowAttachmentsModal] = useState(false);

  const getWriters = async (searchVal = "") => {
    try {
      const res = await GetAuthors(10, 0, searchVal);
      setWritersList(res?.data?.results);
    } catch (error) {
      console.error(error);
    }
  };
  const getCategories = async (searchVal = "") => {
    try {
      const res = await GetContentCategories(10, 0, searchVal);
      setCategoriesList(res?.data?.results);
    } catch (error) {
      console.error(error);
    }
  };

  // Handle attachments confirmation
  const handleConfirmAttachments = (selectedAttachments) => {
    setFormData((prev) => ({
      ...prev,
      attachments: selectedAttachments,
    }));
    setShowAttachmentsModal(false);
  };

  // Remove attachment
  const handleRemoveAttachment = (attachmentId) => {
    setFormData((prev) => ({
      ...prev,
      attachments: prev.attachments.filter((att) => att.id !== attachmentId),
    }));
  };

  // Initialize form data when editing
  useEffect(() => {
    if (content) {
      const initialData = {
        title: content?.title || "",
        subtitle: content?.subtitle || "",
        // excerpt: content?.excerpt || "",
        body: content?.body || "",
        writer: content?.writer || "",
        writer_avatar: content?.writer_avatar || "",
        category: content?.category || "",
        status: content?.status || "draft",
        is_active: content?.is_active !== undefined ? content?.is_active : true,
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
      // Compare all fields
      const hasTextChanges = Object.keys(initialFormData).some((key) => {
        // Special handling for tags array
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

  // Handle input changes
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

  // Handle writer selection
  const handleWriterSelect = (writer) => {
    setFormData((prev) => ({
      ...prev,
      writer: writer.name,
      writer_avatar: writer.avatar || writer.avatar_url || "",
    }));
    setShowWriterDropdown(false);
    setWriterSearchValue("");

    // Clear writer error if exists
    if (errors.writer) {
      setErrors((prev) => ({
        ...prev,
        writer: "",
      }));
    }
  };

  // Handle writer search
  const handleWriterSearch = () => {
    getWriters(writerSearchValue);
  };

  // Handle clear writer search
  const handleClearWriterSearch = () => {
    setWriterSearchValue("");
    getWriters("");
  };

  // Handle file preview
  const handlePreviewFile = (file) => {
    setPreviewFile(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  // Close preview
  const handleClosePreview = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewFile(null);
    setPreviewUrl(null);
  };

  // Handle category selection
  const handleCategorySelect = (category) => {
    setFormData((prev) => ({
      ...prev,
      category: category.id,
    }));
    setShowCategoryDropdown(false);
    setCategorySearchValue("");

    // Clear category error if exists
    if (errors.category) {
      setErrors((prev) => ({
        ...prev,
        category: "",
      }));
    }
  };
  // Handle tag input
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

  // Remove tag
  const removeTag = (tagToRemove) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = t("Title is required");
    }

    if (!formData.subtitle.trim()) {
      newErrors.subtitle = t("Subtitle is required");
    }

    // if (!formData.excerpt.trim()) {
    //   newErrors.excerpt = t("Excerpt is required");
    // }

    if (!formData.body.trim()) {
      newErrors.body = t("Body content is required");
    }

    if (!formData.writer.trim()) {
      newErrors.writer = t("Writer is required");
    }

    if (!formData.category) {
      newErrors.category = t("Category is required");
    }

    if (!formData.status) {
      newErrors.status = t("Status is required");
    }

    if (!formData.read_time) {
      newErrors.read_time = t("Read time is required");
    }

    if (!formData.tags || formData.tags.length === 0) {
      newErrors.tags = t("Tags are required");
    }

    if (!formData.language || !formData.language.trim()) {
      newErrors.language = t("Language is required");
    }

    if (!formData.country) {
      newErrors.country = t("Country is required");
    }

    const hasImageFiles = imageFiles.length > 0;
    const hasImageUrls = formData.images_url && formData.images_url.length > 0;
    const hasExistingImages = formData.images && formData.images.length > 0;

    // يجب توفير واحد على الأقل من: صور مرفوعة، روابط صور، أو صور موجودة
    if (!hasImageFiles && !hasImageUrls && !hasExistingImages && !content) {
      newErrors.images = t("At least one image or image URL is required");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
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
    contentData.append(
      "category",
      formData?.category?.id || formData?.category
    );
    contentData.append("status", formData.status);
    contentData.append("is_active", formData.is_active);
    contentData.append("read_time", formData.read_time);
    contentData.append("tags", JSON.stringify(formData.tags));
    contentData.append("language", formData.language);
    contentData.append("country", formData.country);
    // contentData.append("excerpt", formData.excerpt);

    // إضافة الصور كملفات (images) - يتم رفعها من الجهاز
    // هذه ستُحفظ في مفتاح images
    if (imageFiles.length > 0) {
      imageFiles.forEach((file) => {
        if (file instanceof File) {
          contentData.append("images", file);
        }
      });
    }

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
          : t("Content created successfully")
      );
      onSectionChange("contents");
    } catch (error) {
      setErrorFn(error, t);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    getWriters();
    getCategories();
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Close writer dropdown if clicked outside
      if (
        writerDropdownRef.current &&
        !writerDropdownRef.current.contains(event.target)
      ) {
        setShowWriterDropdown(false);
      }

      // Close category dropdown if clicked outside
      if (
        categoryDropdownRef.current &&
        !categoryDropdownRef.current.contains(event.target)
      ) {
        setShowCategoryDropdown(false);
      }
    };

    // Add event listener
    document.addEventListener("mousedown", handleClickOutside);

    // Cleanup
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div
      className="bg-white rounded-lg p-4 l mx-4 overflow-y-auto"
      dir={i18n?.language === "ar" ? "rtl" : "ltr"}
    >
      {isLoading && <Loader />}
      {/* Start Breadcrumb */}
      <CustomBreadcrumb
        backTitle={t("Back to Contents List")}
        onBack={() => {
          onSectionChange("contents");
        }}
        page={content ? t("Edit Content") : t("Create New Content")}
      />
      {/* End Breadcrumb */}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Start Image Upload Section */}
        <div>
          <div className="px-4 py-3 bg-blue-50 border-b border-blue-100">
            <p className="text-sm text-blue-800">
              <strong>{t("Important")}:</strong>{" "}
              {t(
                "Please select images with minimum dimensions of 1920x1080 pixels for best quality."
              )}
            </p>
            <p className="text-xs text-blue-600 mt-1">
              {t("Supported formats")}: PNG, WEBP, JPG, JPEG, HEIC
            </p>
          </div>
          <label className="block text-sm font-medium text-gray-700 my-2">
            {t("Content Images")} * ({t("You can upload multiple images")})
          </label>

          {/* Image Previews Grid */}
          {imagePreviews.length > 0 && (
            <div className="mb-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {imagePreviews.map((preview, index) => (
                <div
                  key={index}
                  className="relative group w-full aspect-video bg-gray-100 rounded-lg overflow-hidden"
                >
                  <img
                    src={preview}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const newPreviews = imagePreviews.filter(
                        (_, i) => i !== index
                      );
                      const newFiles = imageFiles.filter((_, i) => i !== index);
                      setImagePreviews(newPreviews);
                      setImageFiles(newFiles);
                    }}
                    className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200"
                  >
                    <X className="h-6 w-6 text-white" />
                  </button>
                  <div className="absolute top-1 right-1 bg-blue-600 text-white text-xs px-2 py-1 rounded">
                    {index + 1}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Existing Images from Backend */}
          {formData.images.length > 0 && (
            <div className="mb-4">
              <p className="text-sm font-medium text-gray-700 mb-2">
                {t("Existing Images")}
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {formData.images.map((image, index) => {
                  // Handle both string URLs and image objects from backend
                  const imageUrl =
                    typeof image === "string" ? image : image?.image;

                  // Only show if we have an image URL
                  if (!imageUrl) return null;

                  return (
                    <div
                      key={`existing-${index}`}
                      className="relative group w-full aspect-video bg-gray-100 rounded-lg overflow-hidden"
                    >
                      <img
                        src={imageUrl}
                        alt={`Existing ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setFormData((prev) => ({
                            ...prev,
                            images: prev.images.filter((_, i) => i !== index),
                          }));
                        }}
                        className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200"
                      >
                        <X className="h-6 w-6 text-white" />
                      </button>
                      <div className="absolute top-1 right-1 bg-green-600 text-white text-xs px-2 py-1 rounded">
                        {index + 1}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Upload Area - Images */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3">
              {t("Images")} ({imagePreviews.length})
            </h3>
            <input
              type="file"
              accept="image/*,.heic,.heif"
              onChange={async (e) => {
                const files = Array.from(e.target.files || []);
                if (files.length > 0) {
                  try {
                    const processedFiles = [];
                    const newPreviews = [];

                    for (const file of files) {
                      const { file: processedFile, url } =
                        await processImageFile(file);
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
                }
              }}
              className="hidden"
              id="image-upload"
              multiple
            />
            <label
              htmlFor="image-upload"
              className={`cursor-pointer flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-8 hover:border-primary hover:bg-gray-50 transition-colors ${
                errors.image ? "border-red-500" : "border-gray-300"
              }`}
            >
              <Upload className="h-12 w-12 text-gray-400 mb-2" />
              <p className="text-sm text-gray-600 mb-1">
                {t("Click to upload images or drag and drop")}
              </p>
              <p className="text-xs text-gray-500">
                {t("Supported formats")}: PNG, WEBP, JPG, JPEG, HEIC
              </p>
            </label>
            <p className="text-xs text-gray-500 mt-2">
              {t("Total images selected")}: {imagePreviews.length}
            </p>
          </div>

          {/* Start Image URLs Section - Separate field for image URLs */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t("Image URLs")} ({t("Add image URLs as alternative")})
            </label>

            <div className="space-y-2">
              <div className="flex gap-2">
                <Input
                  value={imageUrlsInput}
                  onChange={(e) => setImageUrlsInput(e.target.value)}
                  placeholder={t("Enter image URL and press Enter")}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && imageUrlsInput.trim()) {
                      e.preventDefault();
                      if (
                        !formData.images_url.includes(imageUrlsInput.trim())
                      ) {
                        setFormData((prev) => ({
                          ...prev,
                          images_url: [
                            ...prev.images_url,
                            imageUrlsInput.trim(),
                          ],
                        }));
                      }
                      setImageUrlsInput("");
                      setErrors((prev) => ({
                        ...prev,
                        images_url: "",
                      }));
                    }
                  }}
                />
              </div>

              {formData.images_url.length > 0 && (
                <div className="space-y-2">
                  {formData.images_url.map((url, index) => (
                    <div
                      key={`url-${index}`}
                      className="flex items-center justify-between p-2 bg-gray-100 rounded-lg"
                    >
                      <div className="flex-1 truncate">
                        <p className="text-sm text-gray-600 truncate">{url}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setFormData((prev) => ({
                            ...prev,
                            images_url: prev.images_url.filter(
                              (_, i) => i !== index
                            ),
                          }));
                        }}
                        className="ml-2 text-red-600 hover:text-red-800"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <p className="text-xs text-gray-500 mt-1">
              {t("Add image URLs here. These will be sent as images_url")}
            </p>
          </div>
          {/* Upload Area - Attachments */}
          <div>
            {/* Attachments List */}
            {attachmentFiles.length > 0 && (
              <div className="mt-4 space-y-2">
                <h4 className="text-sm font-medium text-gray-700">
                  {t("Attached files")}:
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  {attachmentFiles.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className=" flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded flex items-center justify-center text-xs font-semibold text-blue-600">
                          {file.name.split(".").pop().toUpperCase()}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-700 truncate">
                            {file.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {(file.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => handlePreviewFile(file)}
                          className="px-2 py-1 rounded bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors text-xs font-medium"
                          title={t("Preview")}
                        >
                          👁 {t("Preview")}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setAttachmentFiles((prev) =>
                              prev.filter((_, i) => i !== index)
                            );
                            setFormData((prev) => ({
                              ...prev,
                              attachments: prev.attachments.filter(
                                (_, i) => i !== index
                              ),
                            }));
                          }}
                          className="p-1 rounded hover:bg-red-100 text-red-600 transition-colors"
                        >
                          <X className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {errors.images && (
              <p className="text-red-500 text-xs mt-2">{errors.images}</p>
            )}

            {/* Start Attachments Section */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t("Attachments")}
              </label>
              <button
                type="button"
                onClick={() => setShowAttachmentsModal(true)}
                className="flex items-center gap-2 px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
              >
                <Upload className="w-4 h-4" />
                {t("Select Attachments")}
              </button>

              {/* Display selected attachments */}
              {formData.attachments && formData.attachments.length > 0 && (
                <div className="mt-4 space-y-2">
                  <p className="text-sm font-medium text-gray-700">
                    {t("Selected Attachments")} ({formData.attachments.length})
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {formData.attachments.map((attachment) => (
                      <div
                        key={attachment.id}
                        className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg"
                      >
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
                            <FileText className="w-4 h-4 text-blue-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-800 truncate">
                              {attachment.file_name}
                            </p>
                            {attachment.file && (
                              <a
                                href={attachment.file}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-blue-600 hover:underline"
                              >
                                {t("View File")}
                              </a>
                            )}
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveAttachment(attachment.id)}
                          className="flex-shrink-0 ml-2 p-1 text-red-600 hover:bg-red-50 rounded"
                          title={t("Remove")}
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <p className="text-xs text-gray-500 mt-2">
                {t("Click to select or manage attachments for this content")}
              </p>
            </div>
            {/* End Attachments Section */}
          </div>
        </div>
        {/* End Image Upload Section */}

        {/* Start Image URL Section - Only show if image field is empty and image_url has value */}
        {formData.images.length > 0 &&
          formData.images.some((img) => {
            // Check if any image has empty 'image' field but has 'image_url'
            return typeof img === "object" && !img?.image && img?.image_url;
          }) && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t("Image URLs")} ({t("Add multiple images as URLs")})
              </label>

              <div className="space-y-2">
                <div className="flex gap-2">
                  <Input
                    value={imageUrlInput}
                    onChange={(e) => setImageUrlInput(e.target.value)}
                    placeholder={t("Enter image URL and press Enter")}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && imageUrlInput.trim()) {
                        e.preventDefault();
                        // Add as string URL
                        const newImage = imageUrlInput.trim();
                        setFormData((prev) => ({
                          ...prev,
                          images: [...prev.images, newImage],
                        }));
                        setImageUrlInput("");
                        setErrors((prev) => ({
                          ...prev,
                          images: "",
                        }));
                      }
                    }}
                  />
                </div>

                {formData.images.some((img) => typeof img === "string") && (
                  <div className="space-y-2">
                    <p className="text-xs text-gray-500 font-medium">
                      {t("URLs only")}:
                    </p>
                    {formData.images.map((image, index) => {
                      // Only show string URLs in this section
                      if (typeof image !== "string") return null;

                      return (
                        <div
                          key={`url-${index}`}
                          className="flex items-center justify-between p-2 bg-gray-100 rounded-lg"
                        >
                          <div className="flex-1 truncate">
                            <p className="text-sm text-gray-600 truncate">
                              {image}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              setFormData((prev) => ({
                                ...prev,
                                images: prev.images.filter(
                                  (_, i) => i !== index
                                ),
                              }));
                            }}
                            className="ml-2 text-red-600 hover:text-red-800"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <p className="text-xs text-gray-500 mt-1">
                {t("Add image URLs for pictures without an image field")}
              </p>
            </div>
          )}

        {/* End Image URLs Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-4">
            {/* Start Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("Title")} *
              </label>
              <Input
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder={t("Enter content title")}
                className={errors.title ? "border-red-500" : ""}
              />
              {errors.title && (
                <p className="text-red-500 text-xs mt-1">{errors.title}</p>
              )}
            </div>
            {/* End Title */}
            {/* Start Subtitle */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("Subtitle")} *
              </label>
              <Input
                name="subtitle"
                value={formData.subtitle}
                onChange={handleInputChange}
                placeholder={t("Enter content subtitle")}
                className={errors.subtitle ? "border-red-500" : ""}
              />
              {errors.subtitle && (
                <p className="text-red-500 text-xs mt-1">{errors.subtitle}</p>
              )}
            </div>
            {/* End Subtitle */}

            {/* Start Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("Status")} *
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md outline-0 ${
                  errors.status ? "border-red-500" : "border-gray-300"
                } ${!formData.status ? "text-gray-400" : "text-black"}`}
              >
                <option value="" hidden disabled>
                  {t("Select Status")}
                </option>

                {postStatusOptions.map((option) => (
                  <option
                    className="text-black"
                    key={option.value}
                    value={option.value}
                  >
                    {t(option.label)}
                  </option>
                ))}
              </select>

              {errors.status && (
                <p className="text-red-500 text-xs mt-1">{errors.status}</p>
              )}
            </div>
            {/* End Status */}
            {/* Start Read Time */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("Read Time")} *
              </label>
              <Input
                name="read_time"
                type="number"
                value={formData.read_time}
                onChange={handleInputChange}
                placeholder={t("Enter Read Time in minutes")}
                className={errors.read_time ? "border-red-500" : ""}
              />
              {errors.read_time && (
                <p className="text-red-500 text-xs mt-1">{errors.read_time}</p>
              )}
            </div>
            {/* End Read Time */}

            {/* Start Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("Tags")} *
              </label>
              <div className="space-y-2">
                <Input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleTagInput}
                  placeholder={t("Type a tag and press Enter")}
                  className={errors.tags ? "border-red-500" : ""}
                />
                {formData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                      >
                        <Tag className="w-3 h-3" />
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="ml-1 text-blue-600 hover:text-blue-800"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
              {errors.tags && (
                <p className="text-red-500 text-xs mt-1">{errors.tags}</p>
              )}
            </div>
            {/* End Tags */}
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            {/* Start Language */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("Language")} *
              </label>
              <select
                name="language"
                value={formData.language}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md  outline-none   ${
                  errors.language ? "border-red-500" : "border-gray-300"
                } ${!formData.language ? "text-gray-400" : "text-black"}`}
              >
                <option value="" hidden disabled>
                  {t("Select Language")}
                </option>

                {languages.map((lang) => (
                  <option key={lang} className="text-black" value={lang}>
                    {t(lang)}
                  </option>
                ))}
              </select>

              {errors.language && (
                <p className="text-red-500 text-xs mt-1">{errors.language}</p>
              )}
            </div>
            {/* End Language */}
            {/* Start Country */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("Country")}
              </label>
              <select
                name="country"
                value={formData.country}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md  outline-none   ${
                  errors.country ? "border-red-500" : "border-gray-300"
                } ${!formData.country ? "text-gray-400" : "text-black"}`}
              >
                <option value="" hidden disabled>
                  {t("Select Country")}
                </option>

                {countries?.map((option) => (
                  <option
                    key={option.code}
                    className="text-black"
                    value={option.code}
                  >
                    {t(option.name)}
                  </option>
                ))}
              </select>
            </div>
            {/* End Country */}

            {/* Start Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("Category")} *
              </label>
              <div className="relative" ref={categoryDropdownRef}>
                <button
                  type="button"
                  onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-left flex items-center gap-3 ${
                    errors.category ? "border-red-500" : "border-gray-300"
                  }`}
                >
                  {formData?.category ? (
                    <>
                      <Tag className="w-5 h-5 text-blue-600" />
                      <div className="flex-1">
                        <div className="font-medium text-sm">
                          {categoriesList.find(
                            (cat) =>
                              cat.id ===
                              (formData.category?.id || formData.category)
                          )?.name || t("Select Category")}{" "}
                          {formData.category?.id}
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <Tag className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-500">
                        {t("Select Category")}
                      </span>
                    </>
                  )}
                </button>

                {showCategoryDropdown && (
                  <div className="absolute top-full left-0 right-0 z-10 mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-80 overflow-hidden">
                    {/* Search Box */}
                    <div className="p-3 border-b border-gray-200 bg-gray-50">
                      <div className="flex items-center gap-2">
                        <div className="relative flex-1">
                          <input
                            type="text"
                            value={categorySearchValue}
                            onChange={(e) =>
                              setCategorySearchValue(e.target.value)
                            }
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                                getCategories(categorySearchValue);
                              }
                            }}
                            placeholder={t("Search categories...")}
                            className="w-full px-3 py-1.5 pr-8 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                          />
                          {categorySearchValue && (
                            <button
                              type="button"
                              onClick={() => {
                                setCategorySearchValue("");
                                getCategories("");
                              }}
                              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            getCategories(categorySearchValue);
                          }}
                          className="p-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                          title={t("Search")}
                        >
                          <Search className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Categories List */}
                    <div className="max-h-60 overflow-y-auto">
                      {categoriesList.length > 0 ? (
                        categoriesList.map((category) => (
                          <button
                            key={category.id}
                            type="button"
                            onClick={() => handleCategorySelect(category)}
                            className="w-full px-3 py-2 text-left hover:bg-gray-50 flex items-center gap-3"
                          >
                            <div
                              className={`flex-1 ${
                                i18n?.language === "ar"
                                  ? "text-right"
                                  : "text-left"
                              } `}
                            >
                              <div className="font-medium text-sm">
                                {category.name}
                              </div>
                              {category.description && (
                                <div className="text-xs text-gray-500">
                                  {category.description}
                                </div>
                              )}
                            </div>
                            <Tag className="w-5 h-5 text-blue-600" />
                          </button>
                        ))
                      ) : (
                        <div className="px-3 py-4 text-center text-gray-500 text-sm">
                          {t("No categories found")}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
              {errors.category && (
                <p className="text-red-500 text-xs mt-1">{errors.category}</p>
              )}
            </div>
            {/* End Category */}

            {/* Start Writer Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("Writer")}
              </label>
              <div className="relative" ref={writerDropdownRef}>
                <button
                  type="button"
                  onClick={() => setShowWriterDropdown(!showWriterDropdown)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-left flex items-center gap-3 ${
                    errors.writer ? "border-red-500" : "border-gray-300"
                  }`}
                >
                  {formData?.writer ? (
                    <>
                      <img
                        src={formData?.writer_avatar || "/fake-user.png"}
                        alt={formData?.writer}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <div className={`flex-1`}>
                        <div
                          className={`font-medium ${
                            i18n?.language === "ar" ? "text-right" : "text-left"
                          } text-sm`}
                        >
                          {formData?.writer}
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <User className="w-8 h-8 text-gray-400" />
                      <span className="text-gray-500">
                        {t("Select Writer")}
                      </span>
                    </>
                  )}
                </button>

                {showWriterDropdown && (
                  <div className="absolute top-full left-0 right-0 z-10 mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-80 overflow-hidden">
                    {/* Search Box */}
                    <div className="p-3 border-b border-gray-200 bg-gray-50">
                      <div className="flex items-center gap-2">
                        <div className="relative flex-1">
                          <input
                            type="text"
                            value={writerSearchValue}
                            onChange={(e) =>
                              setWriterSearchValue(e.target.value)
                            }
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                                handleWriterSearch();
                              }
                            }}
                            placeholder={t("Search writers...")}
                            className="w-full px-3 py-1.5 pr-8 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                          />
                          {writerSearchValue && (
                            <button
                              type="button"
                              onClick={handleClearWriterSearch}
                              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={handleWriterSearch}
                          className="p-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                          title={t("Search")}
                        >
                          <Search className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Writers List */}
                    <div className="max-h-60 overflow-y-auto">
                      {writersList.length > 0 ? (
                        writersList.map((writer) => (
                          <button
                            key={writer.id}
                            type="button"
                            onClick={() => handleWriterSelect(writer)}
                            className="w-full px-3 py-2 text-left hover:bg-gray-50 flex items-center gap-3"
                          >
                            <img
                              src={
                                writer.avatar ||
                                writer.avatar_url ||
                                "/fake-user.png"
                              }
                              alt={writer.name}
                              className="w-8 h-8 rounded-full object-cover"
                            />
                            <div
                              className={` ${
                                i18n?.language === "ar"
                                  ? "text-right"
                                  : "text-left"
                              }  flex-1`}
                            >
                              <div className="font-medium text-sm">
                                {writer.name}
                              </div>
                              <div className="text-xs text-gray-500">
                                {writer.position}
                              </div>
                            </div>
                          </button>
                        ))
                      ) : (
                        <div className="px-3 py-4 text-center text-gray-500 text-sm">
                          {t("No writers found")}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
              {errors.writer && (
                <p className="text-red-500 text-xs mt-1">{errors.writer}</p>
              )}
            </div>
            {/* End Writer Selection */}
          </div>
        </div>

        {/* Excerpt - Full Width */}
        {/* <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t("Excerpt")} *
          </label>
          <textarea
            name="excerpt"
            value={formData.excerpt}
            onChange={handleInputChange}
            rows={4}
            placeholder={t("Enter content excerpt or summary")}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.excerpt ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.excerpt && (
            <p className="text-red-500 text-xs mt-1">{errors.excerpt}</p>
          )}
          <p className="text-xs text-gray-500 mt-1">
            {t("Approximately")}{" "}
            {Math.ceil(formData.excerpt.split(" ").length / 60)}{" "}
            {t("minute(s) read")}
          </p>
        </div> */}

        {/* Body Content - Full Width */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t("Body Content")} *
          </label>
          <CKEditor
            editor={ClassicEditor}
            data={formData.body}
            config={{
              placeholder: t("Enter the full content of the content"),
              language: i18n.language === "ar" ? "ar" : "en",
              // Custom upload adapter to suppress filerepository-no-upload-adapter error.
              extraPlugins: [MyCustomUploadAdapterPlugin],
              // Optional: remove plugins that may try to upload to server automatically.
              removePlugins: [
                // If build contains these and you don't want server upload.
                "MediaEmbedToolbar",
              ],
            }}
            onChange={(event, editor) => {
              const data = editor.getData();
              setFormData((prev) => ({ ...prev, body: data }));
              if (errors.body) {
                setErrors((prev) => ({ ...prev, body: "" }));
              }
            }}
            // onBlur={() => {
            //   if (!formData.body.trim()) {
            //     setErrors((prev) => ({
            //       ...prev,
            //       body: t("Body content is required"),
            //     }));
            //   }
            // }}
          />

          {errors.body && (
            <p className="text-red-500 text-xs mt-1">{errors.body}</p>
          )}
          <p className="text-xs text-gray-500 mt-1">
            {t("This is the main content that will be displayed to readers")}
          </p>
        </div>

        {/* Start Metadata - Full Width */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t("Metadata")}
          </label>
          <textarea
            name="metadata"
            value={formData.metadata}
            onChange={handleInputChange}
            rows={3}
            placeholder={t("Enter metadata (JSON format)")}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-xs text-gray-500 mt-1">
            {t("Optional metadata in JSON format")}
          </p>
        </div>
        {/* End Metadata - Full Width */}

        {/* Start Form Actions */}
        <div className="flex items-center justify-end gap-3 pt-6 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              onSectionChange("contents");
            }}
          >
            {t("Cancel")}
          </Button>
          <Button
            type="submit"
            className="flex items-center gap-2"
            disabled={content && !hasChanges}
          >
            <Save className="h-4 w-4" />
            {isLoading
              ? t("Saving...")
              : content
              ? t("Update Content")
              : t("Create Content")}
          </Button>
        </div>
      </form>

      {/* File Preview Modal */}

      <Modal
        isOpen={previewFile && previewUrl}
        onClose={handleClosePreview}
        title={`${t("Preview")}: ${previewFile?.name}`}
        width="min(90vw, 500px)"
      >
        <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl h-[80vh] flex flex-col">
          {/* Modal Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <button
              onClick={handleClosePreview}
              className="p-1 rounded hover:bg-gray-100 transition-colors"
            >
              <X className="h-6 w-6 text-gray-600" />
            </button>
          </div>

          {/* Modal Content */}
          <div className="flex-1 overflow-hidden bg-gray-50">
            {previewFile?.type === "application/pdf" ? (
              <iframe
                src={previewUrl}
                className="w-full h-full border-none"
                title="PDF Preview"
              />
            ) : previewFile?.type.includes("word") ||
              previewFile?.type ===
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ? (
              <div className="flex flex-col items-center justify-center h-full p-8">
                <div className="text-center">
                  <div className="w-20 h-20 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <span className="text-3xl">📄</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    {t("Word Document")}
                  </h3>
                  <p className="text-gray-600 mb-4">{previewFile?.name}</p>
                  <p className="text-sm text-gray-500 mb-4">
                    {t("Preview not available for Word documents in browser")}
                  </p>
                  <a
                    href={previewUrl}
                    download={previewFile?.name}
                    className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    {t("Download")}
                  </a>
                </div>
              </div>
            ) : previewFile?.type.includes("powerpoint") ||
              previewFile?.type ===
                "application/vnd.openxmlformats-officedocument.presentationml.presentation" ? (
              <div className="flex flex-col items-center justify-center h-full p-8">
                <div className="text-center">
                  <div className="w-20 h-20 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <span className="text-3xl">🎯</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    {t("PowerPoint Presentation")}
                  </h3>
                  <p className="text-gray-600 mb-4">{previewFile?.name}</p>
                  <p className="text-sm text-gray-500 mb-4">
                    {t("Preview not available for PowerPoint files in browser")}
                  </p>
                  <a
                    href={previewUrl}
                    download={previewFile?.name}
                    className="inline-block px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                  >
                    {t("Download")}
                  </a>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full p-8">
                <div className="text-center">
                  <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <span className="text-3xl">📎</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    {t("File")}
                  </h3>
                  <p className="text-gray-600 mb-4">{previewFile?.name}</p>
                  <p className="text-sm text-gray-500 mb-4">
                    {t("Preview not available for this file type")}
                  </p>
                  <a
                    href={previewUrl}
                    download={previewFile?.name}
                    className="inline-block px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    {t("Download")}
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </Modal>

      {/* Attachments Modal */}
      <AttachmentsModal
        isOpen={showAttachmentsModal}
        onClose={() => setShowAttachmentsModal(false)}
        selectedAttachments={formData.attachments}
        onConfirm={handleConfirmAttachments}
      />
    </div>
  );
}
// CKEditor custom upload adapter plugin (Base64 inline images)
function MyCustomUploadAdapterPlugin(editor) {
  editor.plugins.get("FileRepository").createUploadAdapter = (loader) => {
    return new Base64UploadAdapter(loader);
  };
}

class Base64UploadAdapter {
  constructor(loader) {
    this.loader = loader;
  }
  upload() {
    return this.loader.file.then(
      (file) =>
        new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => {
            resolve({ default: reader.result });
          };
          reader.onerror = (err) => reject(err);
          reader.readAsDataURL(file);
        })
    );
  }
  abort() {
    // No special abort handling needed for Base64 conversion.
  }
}
export default CreateOrEditContent;
