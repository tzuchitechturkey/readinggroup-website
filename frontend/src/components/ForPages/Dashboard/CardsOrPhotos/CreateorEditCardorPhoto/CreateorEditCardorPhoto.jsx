import React, { useState, useEffect } from "react";

import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

import { CreateMediaCard, EditMediaCardById } from "@/api/cardPhoto";
import { setErrorFn } from "@/Utility/Global/setErrorFn";
import Loader from "@/components/Global/Loader/Loader";

// Theme options
const THEME_OPTIONS = [
  { value: "dark", label: "Dark" },
  { value: "light", label: "Light" },
  { value: "colorful", label: "Colorful" },
  { value: "minimal", label: "Minimal" },
  { value: "classic", label: "Classic" },
];

// Language options
const LANGUAGE_OPTIONS = [
  { value: "ar", label: "Arabic" },
  { value: "en", label: "English" },
  { value: "tr", label: "Turkish" },
  { value: "fr", label: "French" },
  { value: "de", label: "German" },
];

// Type options
const TYPE_OPTIONS = [
  { value: "photo", label: "Photo" },
  { value: "gallery", label: "Gallery" },
  { value: "card", label: "Card" },
];

const CreateorEditCardorPhoto = ({
  isOpen,
  onClose,
  card = null,
  setUpdate,
}) => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    theme: "",
    language: "",
    kind: "card",
    image: null,
    image_url: "",
    cover_image: null,
    cover_image_url: "",
    metadata: "",
  });
  const [initialFormData, setInitialFormData] = useState(null);
  const [hasChanges, setHasChanges] = useState(false);

  // State for image previews
  const [imagePreviews, setImagePreviews] = useState({
    image: "",
    cover_image: "",
  });

  // Reset form when modal opens/closes or card changes
  useEffect(() => {
    if (isOpen) {
      if (card && card?.id) {
        const initialData = {
          ...card,
          image: null, // Reset file inputs
          cover_image: null,
          theme: card.theme || "",
          language: card.language || "",
          kind: card.kind || "card",
          image_url: card.image_url || "",
          cover_image_url: card.cover_image_url || "",
          metadata: card.metadata,
        };
        setFormData(initialData);
        setInitialFormData(initialData);
        setHasChanges(false);
        // Set existing image previews for editing
        setImagePreviews({
          image: card.image || "",
          cover_image: card.cover_image || "",
        });
      } else {
        const emptyData = {
          title: "",
          description: "",
          theme: "",
          language: "",
          kind: "card",
          image: null,
          image_url: "",
          cover_image: null,
          cover_image_url: "",
          metadata: "",
        };
        setFormData(emptyData);
        setInitialFormData(null);
        setHasChanges(false);
        setImagePreviews({
          image: "",
          cover_image: "",
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
  }, [isOpen, card]);

  // Check for changes when formData or imagePreviews change
  useEffect(() => {
    if (card?.id && initialFormData) {
      // Check if any field has changed
      const hasTextChanges = Object.keys(initialFormData).some((key) => {
        if (key === "image" || key === "cover_image") {
          return false; // Skip file fields
        }
        return formData[key] !== initialFormData[key];
      });

      // Check if new images have been uploaded
      const hasImageChanges =
        formData.image !== null || formData.cover_image !== null;

      setHasChanges(hasTextChanges || hasImageChanges);
    }
  }, [formData, card?.id, initialFormData]);

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
      title: "",
      description: "",
      theme: "",
      language: "",
      kind: "card",
      image: null,
      image_url: "",
      cover_image: null,
      cover_image_url: "",
      metadata: "",
    });

    // Clean up existing previews
    Object.values(imagePreviews).forEach((url) => {
      if (url && url.startsWith("blob:")) {
        URL.revokeObjectURL(url);
      }
    });

    setImagePreviews({
      image: "",
      cover_image: "",
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
        toast.error("Please select a valid image file.");
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size is too large. Maximum allowed is 5MB.");
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Create FormData object to handle file uploads
    const submitData = new FormData();

    // Append text fields
    submitData.append("title", formData.title);
    submitData.append("description", formData.description);
    submitData.append("theme", formData.theme);
    submitData.append("language", formData.language);
    submitData.append("kind", formData.kind);
    submitData.append("image_url", formData.image_url);
    submitData.append("cover_image_url", formData.cover_image_url);

    // Handle metadata - parse JSON if it's a string
    try {
      const metadataObj = formData.metadata;
      submitData.append("metadata", JSON.stringify(metadataObj));
    } catch {
      // If JSON parsing fails, send as empty object
      submitData.append("metadata", "{}");
    }

    // Append files if they exist
    if (formData.image) {
      submitData.append("image", formData.image);
    }
    if (formData.cover_image) {
      submitData.append("cover_image", formData.cover_image);
    }

    setIsLoading(true);
    try {
      if (card?.id) {
        EditMediaCardById(card.id, submitData);
        toast.success(t("Card updated successfully"));
      } else {
        await CreateMediaCard(submitData);
        toast.success(t("Card created successfully"));
      }

      setUpdate((prev) => !prev);
      resetForm();
      onClose();
    } catch (error) {
      setErrorFn(error);
    } finally {
      setIsLoading(false);
    }
  };
  if (!isOpen) return null;

  return (
    <div className="bg-white rounded-lg p-3 overflow-y-auto">
      {isLoading && <Loader />}
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
        {/* <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t("Theme")}
          </label>
          <select
            name="theme"
            value={formData.theme}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          > <option value="" disabled hidden>
              {t("Select a theme")}
            </option>
            {THEME_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {t(option.label)}
              </option>
            ))}
          </select>
        </div> */}
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
            <option value="" disabled hidden>
              {t("Select a language")}
            </option>
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
            {t("Kind")}
          </label>
          <select
            name="kind"
            value={formData.kind}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          >
            {" "}
            <option value="" disabled hidden>
              {t("Select a Type")}
            </option>
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
            required={!card?.id}
          />
          <p className="text-xs text-gray-500 mt-1">
            {t("Max size: 5MB. Supported formats: JPG, PNG, GIF, WebP")}
          </p>
        </div>
        {/* End Main Image */}

        {/* Start Image URL (Alternative) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t("Main Image URL")} ({t("Alternative to file upload")})
          </label>
          <input
            type="url"
            name="image_url"
            value={formData.image_url}
            onChange={handleInputChange}
            placeholder={t("Enter image URL as alternative to file upload")}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        {/* End Image URL */}

        {/* Start Cover Image */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t("Cover Image")}
          </label>
          <input
            type="file"
            name="cover_image"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            required={!card?.id}
          />
          <p className="text-xs text-gray-500 mt-1">
            {t("Max size: 5MB. Supported formats: JPG, PNG, GIF, WebP")}
          </p>
        </div>
        {/* End Cover Image */}

        {/* Start Cover Image URL (Alternative) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t("Cover Image URL")} ({t("Alternative to file upload")})
          </label>
          <input
            type="url"
            name="cover_image_url"
            value={formData.cover_image_url}
            onChange={handleInputChange}
            placeholder={t(
              "Enter cover image URL as alternative to file upload"
            )}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        {/* End Cover Image URL */}

        {/* Start Metadata */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t("Metadata")} ({t("Optional")})
          </label>
          <textarea
            name="metadata"
            value={formData.metadata}
            onChange={handleInputChange}
            rows={3}
            placeholder={t("Additional metadata in JSON format (optional)")}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <p className="text-xs text-gray-500 mt-1">
            {t('Example: {"tags": ["featured", "popular"], "priority": 1}')}
          </p>
        </div>
        {/* End Metadata */}

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
                  alt="preview"
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

          {imagePreviews.cover_image && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t("Cover Preview")}
              </label>
              <div className="relative">
                <img
                  src={imagePreviews.cover_image}
                  alt="preview"
                  className="w-full h-32 object-cover rounded-lg border"
                />
                <button
                  type="button"
                  onClick={() => {
                    setFormData((prev) => ({ ...prev, cover_image: null }));
                    setImagePreviews((prev) => ({ ...prev, cover_image: "" }));
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
            disabled={card?.id && !hasChanges}
            className={`px-6 py-2 bg-primary text-white rounded-lg border-[1px] border-primary transition-all duration-200 ${
              card?.id && !hasChanges
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-white hover:text-primary"
            }`}
          >
            {card?.id ? t("Save Changes") : t("Add Card")}
          </button>
        </div>
        {/* End Actions */}
      </form>
    </div>
  );
};

export default CreateorEditCardorPhoto;
