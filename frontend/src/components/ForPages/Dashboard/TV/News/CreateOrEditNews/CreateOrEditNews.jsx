import React, { useState, useEffect } from "react";

import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

import { setErrorFn } from "@/Utility/Global/setErrorFn";
import { CreateTvProgram, EditTvProgramById } from "@/api/tvPrograms";
import Loader from "@/components/Global/Loader/Loader";
// Category options
const CATEGORY_OPTIONS = [
  { value: "تعليمي", label: "Educational" },
  { value: "ثقافي", label: "Cultural" },
  { value: "مقابلات", label: "Interviews" },
  { value: "أخبار", label: "News" },
  { value: "ترفيهي", label: "Entertainment" },
  { value: "وثائقي", label: "Documentary" },
];

const CreateOrEditNews = ({
  isOpen,
  onClose,
  news = null,
  setSelectedNews,
  setUpdate,
}) => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    image: null,
    image_url: "",
    title: "",
    description: "",
    air_date: "",
    writer: "",
    category: "",
    is_live: false,
  });

  // State for image preview
  const [imagePreview, setImagePreview] = useState("");

  // Reset form when modal opens/closes or TV changes
  useEffect(() => {
    if (isOpen) {
      if (news?.id) {
        setFormData({
          title: news.title || "",
          description: news.description || "",
          air_date: news.air_date || "",
          writer: news.writer || "",
          category: news.category || "",
          image: null, // Reset file input
          image_url: news.image_url || "",
          is_live: news.is_live || false,
        });
        // Set existing image preview for editing
        setImagePreview(news.image || news.image_url || "");
      } else {
        setFormData({
          image: null,
          image_url: "",
          title: "",
          description: "",
          air_date: "",
          writer: "",
          category: "",
          is_live: false,
        });
        setImagePreview("");
      }
    } else {
      // Clean up preview URL when modal closes
      if (imagePreview && imagePreview.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreview);
      }
    }
  }, [isOpen, news]);

  // Cleanup on component unmount
  useEffect(() => {
    return () => {
      if (imagePreview && imagePreview.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  // Reset form function
  const resetForm = () => {
    setFormData({
      image: null,
      image_url: "",
      title: "",
      description: "",
      air_date: "",
      writer: "",
      category: "",
      is_live: false,
    });

    // Clean up existing preview
    if (imagePreview && imagePreview.startsWith("blob:")) {
      URL.revokeObjectURL(imagePreview);
    }

    setImagePreview("");
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Handle file upload and preview
  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast.error(t("Please select a valid image file"));
        return;
      }

      // Update form data with file
      setFormData((prev) => ({
        ...prev,
        image: file,
      }));

      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Create FormData object to handle file uploads
    const submitData = new FormData();

    // Append text fields
    submitData.append("title", formData.title);
    submitData.append("description", formData.description);
    submitData.append("air_date", formData.air_date);
    submitData.append("writer", formData.writer);
    submitData.append("category", formData.category);
    submitData.append("image_url", formData.image_url);
    submitData.append("is_live", formData.is_live);

    // Append file if it exists
    if (formData.image) {
      submitData.append("image", formData.image);
    }

    setIsLoading(true);
    try {
      if (news?.id) {
        // Update existing TV program
        await EditTvProgramById(news.id, submitData);
        toast.success(t("TV Program updated successfully"));
      } else {
        // Add new TV program
        await CreateTvProgram(submitData);
        toast.success(t("TV Program created successfully"));
      }

      // Close modal
      setSelectedNews(null);
      resetForm();
      onClose();
      // Refresh data
      setUpdate((prev) => !prev);
    } catch (error) {
      setErrorFn(error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="bg-white rounded-lg p-3  ">
      {isLoading && <Loader />}
      <h2 className="text-xl font-bold text-gray-800 mb-6">
        {news?.id ? t("Edit TV Program") : t("Add New TV Program")}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Start Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t("Title")}
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-lg outline-none"
            required
            placeholder={t("Enter program title")}
          />
        </div>
        {/* End Title */}

        {/* Start Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t("Description")}
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows={4}
            className="w-full p-3 border border-gray-300 rounded-lg outline-none"
            required
            placeholder={t("Enter program description")}
          />
        </div>
        {/* End Description */}

        {/* Start Date and Writer Row */}
        <div className="space-y-4">
          {/* Start Air Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t("Air Date")}
            </label>
            <input
              type="date"
              name="air_date"
              value={formData.air_date}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg outline-none"
              required
            />
          </div>
          {/* End Air Date */}

          {/* Start Writer */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t("Writer")}
            </label>
            <input
              type="text"
              name="writer"
              value={formData.writer}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg outline-none"
              required
              placeholder={t("Enter writer name")}
            />
          </div>
          {/* End Writer */}
          {/* End Date and Writer Row */}

          {/* Start Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t("Category")}
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg outline-none"
              required
            >
              <option value="">{t("Select Category")}</option>
              {CATEGORY_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.value} ({t(option.label)})
                </option>
              ))}
            </select>
          </div>
          {/* End Category */}

          {/* Start Image */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t("Program Image")}
            </label>
            <input
              type="file"
              name="image"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              onChange={handleFileChange}
              className="w-full p-3 border border-gray-300 rounded-lg outline-none file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              required={!news?.id}
            />
            <p className="text-xs text-gray-500 mt-1">
              {t("Max size: 5MB. Supported formats: JPG, PNG, WebP")}
            </p>
          </div>
          {/* End Image */}

          {/* Start Image URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t("Image URL")} ({t("Alternative to file upload")})
            </label>
            <input
              type="url"
              name="image_url"
              value={formData.image_url}
              onChange={handleInputChange}
              placeholder={t("Enter image URL as alternative")}
              className="w-full p-3 border border-gray-300 rounded-lg outline-none"
            />
          </div>
          {/* End Image URL */}

          {/* Start Is Live */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="is_live"
              name="is_live"
              checked={formData.is_live}
              onChange={handleInputChange}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label
              htmlFor="is_live"
              className="text-sm font-medium text-gray-700"
            >
              {t("Live Program")}
            </label>
          </div>
          {/* End Is Live */}

          {/* Start Image Preview */}
          {imagePreview && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t("Image Preview")}
              </label>
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="معاينة صورة البرنامج"
                  className="w-full h-48 object-cover rounded-lg border"
                />
                <button
                  type="button"
                  onClick={() => {
                    setFormData((prev) => ({ ...prev, image: null }));
                    if (imagePreview.startsWith("blob:")) {
                      URL.revokeObjectURL(imagePreview);
                    }
                    setImagePreview("");
                  }}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm hover:bg-red-600"
                >
                  ×
                </button>
              </div>
            </div>
          )}
          {/* End Image Preview */}

          {/* Start Actions */}
          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={() => {
                resetForm();
                onClose();
              }}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              {t("Cancel")}
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-white border-[1px] border-primary hover:text-primary transition-all duration-200"
            >
              {news?.id ? t("Save Changes") : t("Add Program")}
            </button>
          </div>
          {/* End Actions */}
        </div>
      </form>
    </div>
  );
};

export default CreateOrEditNews;
