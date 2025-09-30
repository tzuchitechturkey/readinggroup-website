import React, { useState, useEffect } from "react";

import { useTranslation } from "react-i18next";

// Theme options
const THEME_OPTIONS = [
  { value: "dark", label: "Dark" },
  { value: "light", label: "Light" },
  { value: "colorful", label: "Colorful" },
  { value: "minimal", label: "Minimal" },
  { value: "classic", label: "Classic" }
];

// Language options
const LANGUAGE_OPTIONS = [
  { value: "ar", label: "Arabic" },
  { value: "en", label: "English" },
  { value: "tr", label: "Turkish" },
  { value: "fr", label: "French" },
  { value: "de", label: "German" }
];

// Type options
const TYPE_OPTIONS = [
  { value: "article", label: "Article" },
  { value: "photo", label: "Photo" },
  { value: "gallery", label: "Gallery" },
  { value: "news", label: "News" },
  { value: "event", label: "Event" },
  { value: "announcement", label: "Announcement" }
];

const CreateorEditCardorPhoto = ({
  isOpen,
  onClose,
  onSave,
  card = null,
  isEditing = false,
}) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    image: null,
    cover: null,
    title: "",
    description: "",
    theme: "",
    language: "",
    type: "",
  });

  // State for image previews
  const [imagePreviews, setImagePreviews] = useState({
    image: "",
    cover: "",
  });

  // Reset form when modal opens/closes or card changes
  useEffect(() => {
    if (isOpen) {
      if (card && isEditing) {
        setFormData({
          ...card,
          image: null, // Reset file inputs
          cover: null,
          theme: card.theme || "",
          language: card.language || "",
          type: card.type || "",
        });
        // Set existing image previews for editing
        setImagePreviews({
          image: card.image || "",
          cover: card.cover || "",
        });
      } else {
        setFormData({
          image: null,
          cover: null,
          title: "",
          description: "",
          theme: "",
          language: "",
          type: "",
        });
        setImagePreviews({
          image: "",
          cover: "",
        });
      }
    } else {
      // Clean up preview URLs when modal closes
      Object.values(imagePreviews).forEach((url) => {
        if (url && url.startsWith("blob:")) {
          URL.revokeObjectURL(url);
        }
      });
    }
  }, [isOpen, card, isEditing, imagePreviews]);

  // Cleanup on component unmount
  useEffect(() => {
    return () => {
      Object.values(imagePreviews).forEach((url) => {
        if (url && url.startsWith("blob:")) {
          URL.revokeObjectURL(url);
        }
      });
    };
  }, [imagePreviews]);

  // Reset form function
  const resetForm = () => {
    setFormData({
      image: null,
      cover: null,
      title: "",
      description: "",
      theme: "",
      language: "",
      type: "",
    });

    // Clean up existing previews
    Object.values(imagePreviews).forEach((url) => {
      if (url && url.startsWith("blob:")) {
        URL.revokeObjectURL(url);
      }
    });

    setImagePreviews({
      image: "",
      cover: "",
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle file upload and preview
  const handleFileChange = (e) => {
    const { name } = e.target;
    const file = e.target.files[0];

    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        alert("يرجى اختيار ملف صورة صحيح");
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("حجم الملف كبير جداً. الحد الأقصى 5 ميجابايت");
        return;
      }

      // Update form data with file
      setFormData((prev) => ({
        ...prev,
        [name]: file,
      }));

      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setImagePreviews((prev) => ({
        ...prev,
        [name]: previewUrl,
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Create FormData object to handle file uploads
    const submitData = new FormData();

    // Append text fields
    submitData.append("title", formData.title);
    submitData.append("description", formData.description);
    submitData.append("theme", formData.theme);
    submitData.append("language", formData.language);
    submitData.append("type", formData.type);

    // Append files if they exist
    if (formData.image) {
      submitData.append("image", formData.image);
    }
    if (formData.cover) {
      submitData.append("cover", formData.cover);
    }

    // For editing, include existing image URLs if no new files selected
    if (isEditing && card) {
      if (!formData.image && card.image) {
        submitData.append("existingImage", card.image);
      }
      if (!formData.cover && card.cover) {
        submitData.append("existingCover", card.cover);
      }
    }

    onSave(submitData);
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="bg-white rounded-lg p-3 overflow-y-auto">
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
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>
        {/* ENd Title */}
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
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>
        {/* End Description */}
        
        {/* Start Theme */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t("Theme")}
          </label>
          <select
            name="theme"
            value={formData.theme}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          >
            <option value="">{t("Select Theme")}</option>
            {THEME_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {t(option.label)}
              </option>
            ))}
          </select>
        </div>
        {/* End Theme */}
        
        {/* Start Language */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t("Language")}
          </label>
          <select
            name="language"
            value={formData.language}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          >
            <option value="">{t("Select Language")}</option>
            {LANGUAGE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {t(option.label)}
              </option>
            ))}
          </select>
        </div>
        {/* End Language */}
        
        {/* Start Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t("Type")}
          </label>
          <select
            name="type"
            value={formData.type}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          >
            <option value="">{t("Select Type")}</option>
            {TYPE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {t(option.label)}
              </option>
            ))}
          </select>
        </div>
        {/* End Type */}
        
        {/* Start Main Image */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t("Main Image")}
          </label>
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            required={!isEditing}
          />
          <p className="text-xs text-gray-500 mt-1">
            الحد الأقصى: 5 ميجابايت. الصيغ المدعومة: JPG, PNG, GIF, WebP
          </p>
        </div>
        {/* End Main Image */}

        {/* Start Cover Image */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t("Cover Image")}
          </label>
          <input
            type="file"
            name="cover"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            required={!isEditing}
          />
          <p className="text-xs text-gray-500 mt-1">
            الحد الأقصى: 5 ميجابايت. الصيغ المدعومة: JPG, PNG, GIF, WebP
          </p>
        </div>
        {/* End Cover Image */}

        {/* Start Image Previews */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {imagePreviews.image && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t("Main Image Preview")}
              </label>
              <div className="relative">
                <img
                  src={imagePreviews.image}
                  alt="معاينة الصورة الرئيسية"
                  className="w-full h-32 object-cover rounded-lg border"
                />
                <button
                  type="button"
                  onClick={() => {
                    setFormData((prev) => ({ ...prev, image: null }));
                    setImagePreviews((prev) => ({ ...prev, image: "" }));
                  }}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                >
                  ×
                </button>
              </div>
            </div>
          )}

          {imagePreviews.cover && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t("Cover Preview")}
              </label>
              <div className="relative">
                <img
                  src={imagePreviews.cover}
                  alt="معاينة صورة الغلاف"
                  className="w-full h-32 object-cover rounded-lg border"
                />
                <button
                  type="button"
                  onClick={() => {
                    setFormData((prev) => ({ ...prev, cover: null }));
                    setImagePreviews((prev) => ({ ...prev, cover: "" }));
                  }}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                >
                  ×
                </button>
              </div>
            </div>
          )}
        </div>
        {/* End Image Previews */}

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
            {isEditing ? t("Save Changes") : t("Add Card")}
          </button>
        </div>
        {/* End Actions */}
      </form>
    </div>
  );
};

export default CreateorEditCardorPhoto;
