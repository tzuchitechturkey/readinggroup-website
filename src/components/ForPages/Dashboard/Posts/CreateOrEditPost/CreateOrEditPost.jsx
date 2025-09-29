import React, { useState, useEffect } from "react";

import { Save, X, Upload, User, Tag } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// Mock data for writers selection
const mockWriters = [
  {
    id: 1,
    name: "Ahmed Hassan",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop&crop=face",
    role: "Senior Writer",
  },
  {
    id: 2,
    name: "Sara Mohamed",
    avatar:
      "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=64&h=64&fit=crop&crop=face",
    role: "Environmental Journalist",
  },
  {
    id: 3,
    name: "Omar Ali",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop&crop=face",
    role: "Humanitarian Reporter",
  },
  {
    id: 4,
    name: "Dr. Fatima Zahra",
    avatar:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=64&h=64&fit=crop&crop=face",
    role: "Medical Writer",
  },
  {
    id: 5,
    name: "Khalid Ibrahim",
    avatar:
      "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=64&h=64&fit=crop&crop=face",
    role: "Education Specialist",
  },
];

function CreateOrEditPost({ post = null, onClose, onSave }) {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [showWriterDropdown, setShowWriterDropdown] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    excerpt: "",
    writer: "",
    writer_avatar: "",
    category: "",
    status: "Draft",
    active: true,
    tags: [],
  });

  // Tag input state
  const [tagInput, setTagInput] = useState("");

  // Validation errors
  const [errors, setErrors] = useState({});

  // Categories options
  const categories = [
    "Technology",
    "Environment",
    "Humanitarian",
    "Medical",
    "Education",
    "Community",
    "Youth",
    "Emergency",
    "Development",
    "Health",
    "Culture",
    "Rights",
    "Food",
    "Water",
  ];

  // Status options
  const statusOptions = [
    { value: "Draft", label: "Draft" },
    { value: "Published", label: "Published" },
  ];

  // Initialize form data when editing
  useEffect(() => {
    if (post) {
      setFormData({
        title: post.title || "",
        subtitle: post.subtitle || "",
        excerpt: post.excerpt || "",
        writer: post.writer || "",
        writer_avatar: post.writer_avatar || "",
        category: post.category || "",
        status: post.status || "Draft",
        active: post.active !== undefined ? post.active : true,
        tags: post.tags || [],
      });
    }
  }, [post]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
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
      writer_avatar: writer.avatar,
    }));
    setShowWriterDropdown(false);

    // Clear writer error if exists
    if (errors.writer) {
      setErrors((prev) => ({
        ...prev,
        writer: "",
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

    if (!formData.writer.trim()) {
      newErrors.writer = t("Writer is required");
    }

    if (!formData.category) {
      newErrors.category = t("Category is required");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const postData = {
        ...formData,
        id: post ? post.id : Date.now(),
        createdAt: post
          ? post.createdAt
          : new Date().toISOString().split("T")[0],
        updatedAt: new Date().toISOString().split("T")[0],
        views: post ? post.views : 0,
        readTime: `${Math.ceil(
          formData.excerpt.split(" ").length / 200
        )} min read`,
      };

      onSave(postData);
      alert(
        post ? t("Post updated successfully") : t("Post created successfully")
      );
      onClose();
    } catch {
      alert(t("An error occurred while saving the post"));
    } finally {
      setLoading(false);
    }
  };

  // Get selected writer info
  const selectedWriter = mockWriters.find((w) => w.name === formData.writer);

  return (
    <div className="bg-white rounded-lg p-6 l mx-4 overflow-y-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-[#1D2630]">
          {post ? t("Edit Post") : t("Create New Post")}
        </h2>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-full"
        >
          <X className="h-5 w-5 text-gray-500" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-4">
            {/* Title */}
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

            {/* Subtitle */}
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

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("Category")} *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.category ? "border-red-500" : "border-gray-300"
                }`}
              >
                <option value="">{t("Select Category")}</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {t(cat)}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p className="text-red-500 text-xs mt-1">{errors.category}</p>
              )}
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("Status")}
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {t(option.label)}
                  </option>
                ))}
              </select>
            </div>

            {/* Active Status */}
            <div className="flex items-center">
              <input
                type="checkbox"
                name="active"
                checked={formData.active}
                onChange={handleInputChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label className="ml-2 text-sm text-gray-700">
                {t("Active Post")}
              </label>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            {/* Writer Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("Writer")} *
              </label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowWriterDropdown(!showWriterDropdown)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-left flex items-center gap-3 ${
                    errors.writer ? "border-red-500" : "border-gray-300"
                  }`}
                >
                  {selectedWriter ? (
                    <>
                      <img
                        src={selectedWriter.avatar}
                        alt={selectedWriter.name}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <div className="font-medium text-sm">
                          {selectedWriter.name}
                        </div>
                        <div className="text-xs text-gray-500">
                          {selectedWriter.role}
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
                  <div className="absolute top-full left-0 right-0 z-10 mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                    {mockWriters.map((writer) => (
                      <button
                        key={writer.id}
                        type="button"
                        onClick={() => handleWriterSelect(writer)}
                        className="w-full px-3 py-2 text-left hover:bg-gray-50 flex items-center gap-3"
                      >
                        <img
                          src={writer.avatar}
                          alt={writer.name}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        <div className="flex-1">
                          <div className="font-medium text-sm">
                            {writer.name}
                          </div>
                          <div className="text-xs text-gray-500">
                            {writer.role}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              {errors.writer && (
                <p className="text-red-500 text-xs mt-1">{errors.writer}</p>
              )}
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("Tags")}
              </label>
              <div className="space-y-2">
                <Input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleTagInput}
                  placeholder={t("Type a tag and press Enter")}
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
            </div>
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
            {Math.ceil(formData.excerpt.split(" ").length / 200)}{" "}
            {t("minute(s) read")}
          </p>
        </div>

        {/* Form Actions */}
        <div className="flex items-center justify-end gap-3 pt-6 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={loading}
          >
            {t("Cancel")}
          </Button>
          <Button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            {loading
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

export default CreateOrEditPost;
