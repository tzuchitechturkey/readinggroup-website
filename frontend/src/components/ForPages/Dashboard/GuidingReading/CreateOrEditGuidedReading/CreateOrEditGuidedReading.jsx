import React, { useState, useEffect } from "react";

import { Save, Upload } from "lucide-react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CreateReading, EditReadingById } from "@/api/reading";
import { setErrorFn } from "@/Utility/Global/setErrorFn";

function CreateOrEditGuidedReading({ onSectionChange, guidedReading = null }) {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    publish_date: "",
    category: "",
    genre: "",
    language: "",
    source: "",
    rating: "",
    reviews: "",
    image: null,
    image_url: "",
    badge: "",
  });

  // Validation errors
  const [errors, setErrors] = useState({});

  // Categories and genres options
  const categories = [
    "Humanitarian",
    "Environmental",
    "Medical",
    "Educational",
    "Cultural",
    "Disaster Relief",
  ];

  const genres = [
    "Fiction",
    "Non-Fiction",
    "Biography",
    "Science",
    "History",
    "Philosophy",
    "Poetry",
    "Drama",
  ];

  const languages = [
    "Arabic",
    "English",
    "Turkish",
    "Chinese",
    "Spanish",
    "French",
  ];

  const badges = [
    "Featured",
    "New",
    "Bestseller",
    "Recommended",
    "Popular",
  ];

  // Initialize form data when editing
  useEffect(() => {
    if (guidedReading) {
      setFormData({
        title: guidedReading.title || "",
        author: guidedReading.author || "",
        publish_date: guidedReading.publish_date || "",
        category: guidedReading.category || "",
        genre: guidedReading.genre || "",
        language: guidedReading.language || "",
        source: guidedReading.source || "",
        rating: guidedReading.rating || "",
        reviews: guidedReading.reviews || "",
        image: guidedReading?.image || null,
        image_url: guidedReading.image_url || "",
        badge: guidedReading.badge || "",
      });
      // Set existing image preview
      setImagePreview(guidedReading.image || guidedReading.image_url);
    }
  }, [guidedReading]);

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

    // If image_url is provided, update preview
    if (name === "image_url" && value) {
      setImagePreview(value);
      // Clear the file image if URL is provided
      setFormData((prev) => ({
        ...prev,
        image: null,
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
        image_url: "", // Clear URL when file is uploaded
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

    if (!formData.author.trim()) {
      newErrors.author = t("Author is required");
    }

    if (!formData.category) {
      newErrors.category = t("Category is required");
    }

    if (!formData.language) {
      newErrors.language = t("Language is required");
    }

    if (!formData.publish_date) {
      newErrors.publish_date = t("Publish date is required");
    }

    // Validate rating (optional, but if provided must be valid)
    if (formData.rating && (isNaN(formData.rating) || formData.rating < 0 || formData.rating > 5)) {
      newErrors.rating = t("Rating must be between 0 and 5");
    }

    // Validate reviews (optional, but if provided must be valid)
    if (formData.reviews && (isNaN(formData.reviews) || formData.reviews < 0)) {
      newErrors.reviews = t("Reviews must be a positive number");
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

    setIsLoading(true);
    try {
      // Create FormData for file upload
      const formDataToSend = new FormData();

      // Add all form fields to FormData
      Object.keys(formData).forEach((key) => {
        if (key === "image" && formData[key] instanceof File) {
          // Add file if it's actually a file
          formDataToSend.append(key, formData[key]);
        } else if (key !== "image") {
          // Add all other fields except empty image
          if (
            formData[key] !== null &&
            formData[key] !== "" &&
            formData[key] !== undefined
          ) {
            formDataToSend.append(key, formData[key]);
          }
        }
      });

      guidedReading?.id
        ? await EditReadingById(guidedReading.id, formDataToSend)
        : await CreateReading(formDataToSend);

      toast.success(
        guidedReading?.id
          ? t("Reading updated successfully")
          : t("Reading created successfully")
      );
      onSectionChange("guidedReadings");
    } catch (err) {
      setErrorFn(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg p-6 w-full mx-4 overflow-y-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => onSectionChange("guidedReadings")}
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800"
          >
            ← {t("Back to Guided Readings List")}
          </button>
          <div className="h-4 w-px bg-gray-300" />
          <h2 className="text-xl font-semibold text-[#1D2630]">
            {guidedReading ? t("Edit Guided Reading") : t("Create New Guided Reading")}
          </h2>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Start Image Upload Section */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t("Reading Image")}
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
                placeholder={t("Enter reading title")}
                className={errors.title ? "border-red-500" : ""}
              />
              {errors.title && (
                <p className="text-red-500 text-xs mt-1">{errors.title}</p>
              )}
            </div>
            {/* End Title */}

            {/* Start Author */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("Author")} *
              </label>
              <Input
                name="author"
                value={formData.author}
                onChange={handleInputChange}
                placeholder={t("Enter author name")}
                className={errors.author ? "border-red-500" : ""}
              />
              {errors.author && (
                <p className="text-red-500 text-xs mt-1">{errors.author}</p>
              )}
            </div>
            {/* End Author */}

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

            {/* Start Genre */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("Genre")}
              </label>
              <select
                name="genre"
                value={formData.genre}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">{t("Select Genre")}</option>
                {genres.map((genre) => (
                  <option key={genre} value={genre}>
                    {t(genre)}
                  </option>
                ))}
              </select>
            </div>
            {/* End Genre */}

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

            {/* Start Source */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("Source")}
              </label>
              <Input
                name="source"
                value={formData.source}
                onChange={handleInputChange}
                placeholder={t("Enter source (optional)")}
              />
            </div>
            {/* End Source */}
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            {/* Start Publish Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("Publish Date")} *
              </label>
              <input
                type="date"
                name="publish_date"
                value={formData.publish_date}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.publish_date ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.publish_date && (
                <p className="text-red-500 text-xs mt-1">{errors.publish_date}</p>
              )}
            </div>
            {/* End Publish Date */}

            {/* Start Rating */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("Rating")}
              </label>
              <Input
                type="number"
                name="rating"
                value={formData.rating}
                onChange={handleInputChange}
                placeholder={t("Enter rating (0-5)")}
                step="0.01"
                min="0"
                max="5"
                className={errors.rating ? "border-red-500" : ""}
              />
              {errors.rating && (
                <p className="text-red-500 text-xs mt-1">{errors.rating}</p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                {t("Rating between 0 and 5")}
              </p>
            </div>
            {/* End Rating */}

            {/* Start Reviews */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("Reviews Count")}
              </label>
              <Input
                type="number"
                name="reviews"
                value={formData.reviews}
                onChange={handleInputChange}
                placeholder={t("Enter number of reviews")}
                min="0"
                className={errors.reviews ? "border-red-500" : ""}
              />
              {errors.reviews && (
                <p className="text-red-500 text-xs mt-1">{errors.reviews}</p>
              )}
            </div>
            {/* End Reviews */}

            {/* Start Badge */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("Badge")}
              </label>
              <select
                name="badge"
                value={formData.badge}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">{t("Select Badge")}</option>
                {badges.map((badge) => (
                  <option key={badge} value={badge}>
                    {t(badge)}
                  </option>
                ))}
              </select>
            </div>
            {/* End Badge */}
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex items-center justify-end gap-3 pt-6 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={() => onSectionChange("guidedReadings")}
          >
            {t("Cancel")}
          </Button>
          <Button type="submit" className="flex items-center gap-2" disabled={isLoading}>
            <Save className="h-4 w-4" />
            {isLoading
              ? t("Saving...")
              : guidedReading
              ? t("Update Reading")
              : t("Create Reading")}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default CreateOrEditGuidedReading;
