import React, { useState, useEffect, useRef } from "react";

import { Save, X, User, Tag, Search, Upload } from "lucide-react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Loader from "@/components/Global/Loader/Loader";
import { setErrorFn } from "@/Utility/Global/setErrorFn";
import { processImageFile } from "@/Utility/imageConverter";
import { CreatePost, EditPostById, GetPostCategories } from "@/api/posts";
import countries from "@/constants/countries.json";
import { languages, postStatusOptions } from "@/constants/constants";
import { GetAuthors } from "@/api/authors";

import CustomBreadcrumb from "../../CustomBreadcrumb/CustomBreadcrumb";

function CreateOrEditPost({ onSectionChange, post = null }) {
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
    excerpt: "",
    body: "",
    writer: "",
    writer_avatar: "",
    category: "",
    status: "",
    // is_active: true,
    read_time: "",
    tags: "",
    language: "",
    post_type: "",
    image: null,
    image_url: "",
    metadata: "",
    country: "",
    camera_name: "",
  });
  const [initialFormData, setInitialFormData] = useState(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [errors, setErrors] = useState({});
  const [tagInput, setTagInput] = useState("");
  const [imageFile, setImageFile] = useState(null); // Store the actual file

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
      const res = await GetPostCategories(10, 0, searchVal);
      setCategoriesList(res?.data?.results);
    } catch (error) {
      console.error(error);
    }
  };

  // Type options
  const typeOptions = [
    { value: "card", label: "Card" },
    { value: "photo", label: "Photo" },
  ];

  // Initialize form data when editing
  useEffect(() => {
    if (post) {
      const initialData = {
        title: post.title || "",
        subtitle: post.subtitle || "",
        excerpt: post.excerpt || "",
        body: post.body || "",
        writer: post.writer || "",
        writer_avatar: post.writer_avatar || "",
        category: post.category || "",
        status: post.status || "draft",
        // is_active: post.is_active !== undefined ? post.is_active : true,
        read_time: post.read_time || "",
        tags: post.tags || "",
        language: post.language || "",
        post_type: post.post_type || "",
        image: post.image || null,
        image_url: post.image_url || "",
        metadata: post.metadata || "",
        country: post.country || "",
        camera_name: post.camera_name || "",
      };
      setFormData(initialData);
      setInitialFormData(initialData);
      setHasChanges(false);
    } else {
      setInitialFormData(null);
      setHasChanges(false);
    }
  }, [post]);

  // Check for changes when formData changes
  useEffect(() => {
    if (post && initialFormData) {
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
  }, [formData, post, initialFormData]);

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
    console.log("Selected writer:", writer);
    setFormData((prev) => ({
      ...prev,
      writer: writer.name,
      writer_avatar: writer.avatar || writer?.avatar_url,
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

    if (!formData.excerpt.trim()) {
      newErrors.excerpt = t("Excerpt is required");
    }

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

    if (!formData.post_type) {
      newErrors.post_type = t("Type is required");
    }

    if (!formData.country) {
      newErrors.country = t("Country is required");
    }

    if (!formData.image && !formData.image_url && !post) {
      newErrors.image = t("Image is required");
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
    const postData = new FormData();

    // Add all text fields
    postData.append("title", formData.title);
    postData.append("subtitle", formData.subtitle);
    postData.append("excerpt", formData.excerpt);
    postData.append("body", formData.body);
    postData.append("writer", formData.writer);
    postData.append("category", formData?.category?.id || formData?.category);
    postData.append("status", formData.status);
    postData.append("read_time", formData.read_time);
    postData.append("tags", JSON.stringify(formData.tags));
    postData.append("language", formData.language);
    postData.append("post_type", formData.post_type);
    postData.append("country", formData.country);
    postData.append("camera_name", formData.camera_name);

    // postData.append("is_active", formData.is_active);
    // Add image if selected
    // if (formData.image) {
    //   postData.append("image", formData.image);
    // }
    // Only append image if a new file was selected
    if (imageFile instanceof File) {
      postData.append("image", imageFile);
    }
    // Add image_url if provided
    if (formData.image_url) {
      postData.append("image_url", formData.image_url);
    }

    // Add metadata if provided
    if (formData.metadata) {
      postData.append("metadata", formData.metadata);
    }

    // Add timestamps
    if (post) {
      postData.append("created_at", post.created_at);
      postData.append("views", post.views || 0);
    }
    postData.append("updated_at", new Date().toISOString());

    setIsLoading(true);
    try {
      post?.id
        ? await EditPostById(post.id, postData)
        : await CreatePost(postData);

      toast.success(
        post?.id
          ? t("Post updated successfully")
          : t("Post created successfully")
      );
      onSectionChange("posts");
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
      className="bg-white rounded-lg p-6 l mx-4 overflow-y-auto"
      dir={i18n?.language === "ar" ? "rtl" : "ltr"}
    >
      {isLoading && <Loader />}
      {/* Start Breadcrumb */}
      <CustomBreadcrumb
        backTitle={t("Back to Posts List")}
        onBack={() => {
          onSectionChange("posts");
        }}
        page={post ? t("Edit Post") : t("Create New Post")}
      />
      {/* End Breadcrumb */}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Start Image Upload Section */}
        <div>
          <div className="px-4 py-3 bg-blue-50 border-b border-blue-100">
            <p className="text-sm text-blue-800">
              <strong>{t("Important")}:</strong>{" "}
              {t(
                "Please select an image with minimum dimensions of 1920x1080 pixels for best quality."
              )}
            </p>
            <p className="text-xs text-blue-600 mt-1">
              {t("Supported formats")}: PNG, WEBP, JPG, JPEG, HEIC
            </p>
          </div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t("Post Image")} *
          </label>
          <div className="flex items-center gap-4">
            <div
              className={`w-32 h-24 border-2 border-dashed rounded-lg flex items-center justify-center ${
                errors.image ? "border-red-500" : "border-gray-300"
              }`}
            >
              {formData.image || formData.image_url ? (
                <img
                  src={formData.image || formData.image_url}
                  alt="Preview"
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                <Upload className="h-8 w-8 text-gray-400" />
              )}
            </div>
            <div>
              <input
                type="file"
                accept="image/*,.heic,.heif"
                onChange={async (e) => {
                  const file = e.target.files[0];
                  if (file) {
                    try {
                      // معالجة الصورة (تحويل HEIC إذا لزم الأمر)
                      const { file: processedFile, url } =
                        await processImageFile(file);

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
                  }
                }}
                className="hidden"
                id="image-upload"
              />
              <label
                htmlFor="image-upload"
                className={`cursor-pointer inline-flex items-center gap-2 px-4 py-2 border ${
                  errors.image ? "border-red-500" : "border-gray-300"
                } rounded-md hover:bg-gray-50`}
              >
                <Upload className="h-4 w-4" />
                {t("Upload Image")}
              </label>
              <p className="text-xs text-gray-500 mt-1">
                {t("Recommended: 16:9 aspect ratio")}
              </p>
              {errors.image && (
                <p className="text-red-500 text-xs mt-1">{errors.image}</p>
              )}
            </div>
          </div>
        </div>
        {/* End Image Upload Section */}

        {/* Start Image URL Section */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t("Image URL")} ({t("Alternative to file upload")})
          </label>

          <Input
            name="image_url"
            value={formData.image_url}
            onChange={handleInputChange}
            placeholder={t("Enter image URL as alternative to file upload")}
          />
          <p className="text-xs text-gray-500 mt-1">
            {t("You can either upload a file above or provide a URL here")}
          </p>
        </div>
        {/* End Image URL Section */}
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
                placeholder={t("Enter post title")}
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
                placeholder={t("Enter post subtitle")}
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

            {/* Start Camera */}
            {formData.post_type === "photo" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t("Camera Model")}
                </label>
                <Input
                  name="camera_name"
                  value={formData.camera_name}
                  onChange={handleInputChange}
                  placeholder={t("Enter camera model")}
                  className={errors.camera_name ? "border-red-500" : ""}
                />
              </div>
            )}
            {/* End Camera */}
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
            {/* Start Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("Type")} *
              </label>
              <select
                name="post_type"
                value={formData.post_type}
                onChange={(e) => {
                  handleInputChange(e);
                  setFormData((prev) => ({
                    ...prev,
                    writer: "",
                  }));
                }}
                className={`w-full px-3 py-2 border rounded-md  outline-none ${
                  errors.post_type ? "border-red-500" : "border-gray-300"
                } ${!formData.post_type ? "text-gray-400" : "text-black"}`}
              >
                <option value="" hidden disabled>
                  {t("Select Type")}
                </option>

                {typeOptions.map((option) => (
                  <option
                    key={option.value}
                    className="text-black"
                    value={option.value}
                  >
                    {t(option.label)}
                  </option>
                ))}
              </select>

              {errors.post_type && (
                <p className="text-red-500 text-xs mt-1">{errors.post_type}</p>
              )}
            </div>
            {/* End Type */}

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
                            <Tag className="w-5 h-5 text-blue-600" />
                            <div className="flex-1">
                              <div className="font-medium text-sm">
                                {category.name}
                              </div>
                              {category.description && (
                                <div className="text-xs text-gray-500">
                                  {category.description}
                                </div>
                              )}
                            </div>
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
                {formData?.post_type === "photo"
                  ? t("Camera Man")
                  : t("Writer")}
                *
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
                      <div className="flex-1">
                        <div className="font-medium text-sm">
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
                                writer?.avatar_url ||
                                "/fake-user.png"
                              }
                              alt={writer.name}
                              className="w-8 h-8 rounded-full object-cover"
                            />
                            <div className="flex-1">
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

            {/* Start Active Status */}
            {/* <div className="flex items-center">
              <input
                type="checkbox"
                name="is_active"
                checked={formData.is_active}
                onChange={handleInputChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label className="ml-2 text-sm text-gray-700">
                {t("Active Post")}
              </label>
            </div> */}
            {/* End Active Status */}
          </div>
        </div>

        {/* Excerpt - Full Width */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t("Excerpt")} *
          </label>
          <textarea
            name="excerpt"
            value={formData.excerpt}
            onChange={handleInputChange}
            rows={4}
            placeholder={t("Enter post excerpt or summary")}
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
        </div>

        {/* Body Content - Full Width (CKEditor) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t("Body Content")} *
          </label>
          <div
            className={`border rounded-md ${
              errors.body ? "border-red-500" : "border-gray-300"
            } focus-within:ring-2 focus-within:ring-blue-500`}
          >
            <CKEditor
              editor={ClassicEditor}
              data={formData.body}
              config={{
                placeholder: t("Enter the full content of the post"),
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
              onBlur={() => {
                if (!formData.body.trim()) {
                  setErrors((prev) => ({
                    ...prev,
                    body: t("Body content is required"),
                  }));
                }
              }}
            />
          </div>
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
              onSectionChange("posts");
            }}
          >
            {t("Cancel")}
          </Button>
          <Button
            type="submit"
            className="flex items-center gap-2"
            disabled={post && !hasChanges}
          >
            <Save className="h-4 w-4" />
            {isLoading
              ? t("Saving...")
              : post
              ? t("Update Post")
              : t("Create Post")}
          </Button>
        </div>
      </form>
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

export default CreateOrEditPost;
