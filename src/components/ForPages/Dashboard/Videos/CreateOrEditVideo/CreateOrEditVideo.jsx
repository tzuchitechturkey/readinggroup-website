import React, { useState, useEffect } from "react";

import { Save, Upload, Youtube } from "lucide-react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

function CreateOrEditVideo({ video = null, onClose, onSave }) {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    type: "",
    subject: "",
    language: "",
    duration: "",
    videoUrl: "",
    image: null,
    featured: false,
    isNew: false,
    number: "",
  });

  // Validation errors
  const [errors, setErrors] = useState({});

  // Categories and types options
  const categories = [
    "Humanitarian",
    "Environmental",
    "Medical",
    "Educational",
    "Cultural",
    "Disaster Relief",
  ];

  const videoTypes = [
    "Full Videos",
    "Short Clips",
    "Documentaries",
    "Interviews",
    "Events",
  ];

  const subjects = [
    "Documentary",
    "News Report",
    "Educational Content",
    "Interview",
    "Event Coverage",
    "Awareness Campaign",
  ];

  const languages = [
    "Arabic",
    "English",
    "Turkish",
    "Chinese",
    "Spanish",
    "French",
  ];

  // Initialize form data when editing
  useEffect(() => {
    if (video) {
      setFormData({
        title: video.title || "",
        category: video.category || "",
        type: video.type || "",
        subject: video.subject || "",
        language: video.language || "",
        duration: video.duration || "",
        videoUrl: video.videoUrl || "",
        image: null,
        featured: video.featured || false,
        isNew: video.isNew || false,
        number: video.number || "",
      });
      setImagePreview(video.image);
    }
  }, [video]);

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

  // Handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        image: file,
      }));

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = t("Title is required");
    }

    if (!formData.category) {
      newErrors.category = t("Category is required");
    }

    if (!formData.type) {
      newErrors.type = t("Type is required");
    }

    if (!formData.language) {
      newErrors.language = t("Language is required");
    }

    if (!formData.videoUrl.trim()) {
      newErrors.videoUrl = t("Video URL is required");
    } else if (!isValidYouTubeUrl(formData.videoUrl)) {
      newErrors.videoUrl = t("Please enter a valid YouTube URL");
    }

    if (!formData.duration.trim()) {
      newErrors.duration = t("Duration is required");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Validate YouTube URL
  const isValidYouTubeUrl = (url) => {
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/;
    return youtubeRegex.test(url);
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

      const videoData = {
        ...formData,
        id: video ? video.id : Date.now(), // Generate ID for new video
      };

      onSave(videoData);
      toast.success(
        video
          ? t("Video updated successfully")
          : t("Video created successfully")
      );
      onClose();
    } catch {
      toast.error(t("An error occurred while saving the video"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg p-6   w-full mx-4  overflow-y-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-[#1D2630]">
          {video ? t("Edit Video") : t("Create New Video")}
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Start Image Upload Section */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t("Video Thumbnail")}
          </label>
          <div className="flex items-center gap-4">
            <div className="w-32 h-24 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
              {imagePreview ? (
                <img
                  src={imagePreview}
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
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="image-upload"
              />
              <label
                htmlFor="image-upload"
                className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                <Upload className="h-4 w-4" />
                {t("Upload Image")}
              </label>
              <p className="text-xs text-gray-500 mt-1">
                {t("Recommended: 16:9 aspect ratio")}
              </p>
            </div>
          </div>
        </div>
        {/* End Image Upload Section */}

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
                placeholder={t("Enter video title")}
                className={errors.title ? "border-red-500" : ""}
              />
              {errors.title && (
                <p className="text-red-500 text-xs mt-1">{errors.title}</p>
              )}
            </div>
            {/* End Title */}

            {/* Start Category */}
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
            {/* End Category */}

            {/* Start Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("Type")} *
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.type ? "border-red-500" : "border-gray-300"
                }`}
              >
                <option value="">{t("Select Type")}</option>
                {videoTypes.map((type) => (
                  <option key={type} value={type}>
                    {t(type)}
                  </option>
                ))}
              </select>
              {errors.type && (
                <p className="text-red-500 text-xs mt-1">{errors.type}</p>
              )}
            </div>
            {/* End Type */}

            {/* Start Subject */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("Subject")}
              </label>
              <select
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">{t("Select Subject")}</option>
                {subjects.map((subject) => (
                  <option key={subject} value={subject}>
                    {t(subject)}
                  </option>
                ))}
              </select>
            </div>
            {/* End Subject */}

            {/* Start Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("Video Number")}
              </label>
              <Input
                name="number"
                value={formData.number}
                onChange={handleInputChange}
                placeholder={t("Enter video number (optional)")}
              />
            </div>
            {/* End Number */}
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
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.language ? "border-red-500" : "border-gray-300"
                }`}
              >
                <option value="">{t("Select Language")}</option>
                {languages.map((lang) => (
                  <option key={lang} value={lang}>
                    {t(lang)}
                  </option>
                ))}
              </select>
              {errors.language && (
                <p className="text-red-500 text-xs mt-1">{errors.language}</p>
              )}
            </div>
            {/* End Language */}

            {/* Start Duration */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("Duration")} *
              </label>
              <Input
                name="duration"
                value={formData.duration}
                onChange={handleInputChange}
                placeholder={t("e.g., 1h 28min or 15:30")}
                className={errors.duration ? "border-red-500" : ""}
              />
              {errors.duration && (
                <p className="text-red-500 text-xs mt-1">{errors.duration}</p>
              )}
            </div>
            {/* End Duration */}
            {/* Start Video URL */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("YouTube URL")} *
              </label>
              <div className="relative">
                <Input
                  name="videoUrl"
                  value={formData.videoUrl}
                  onChange={handleInputChange}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className={`pl-10 ${errors.videoUrl ? "border-red-500" : ""}`}
                />
                <Youtube className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
              {errors.videoUrl && (
                <p className="text-red-500 text-xs mt-1">{errors.videoUrl}</p>
              )}
            </div>
            {/* End Video URL */}

            {/* Start Status Checkboxes */}
            <div className="space-y-3">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="featured"
                  checked={formData.featured}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label className="ml-2 text-sm text-gray-700">
                  {t("Featured Video")}
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="isNew"
                  checked={formData.isNew}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label className="ml-2 text-sm text-gray-700">
                  {t("Mark as New")}
                </label>
              </div>
            </div>
            {/* End Status Checkboxes */}
          </div>
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
              : video
              ? t("Update Video")
              : t("Create Video")}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default CreateOrEditVideo;
