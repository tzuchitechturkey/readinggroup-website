import React, { useState, useEffect } from "react";

import { Save, Upload } from "lucide-react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CreateAuthor, EditAuthorById } from "@/api/authors";
import { setErrorFn } from "@/Utility/Global/setErrorFn";
import { processImageFile } from "@/Utility/imageConverter";

import CustomBreadcrumb from "../../CustomBreadcrumb/CustomBreadcrumb";

function CreateOrEditWriter({
  onSectionChange,
  selectedWriter: writer = null,
}) {
  const { t, i18n } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [initialFormData, setInitialFormData] = useState(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    position: "",
    avatar: null,
    avatar_url: "",
  });

  // Initialize form data when editing
  useEffect(() => {
    if (writer) {
      const initialData = {
        name: writer?.name || "",
        description: writer?.description || "",
        position: writer?.position || "",
        avatar: writer?.avatar || null,
        avatar_url: writer?.avatar_url || "",
      };
      setFormData(initialData);
      setInitialFormData(initialData);
      setHasChanges(false);

      // Set existing avatar preview
      setImagePreview(writer?.avatar || null);
    } else {
      setInitialFormData(null);
      setHasChanges(false);
    }
  }, [writer]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!formData?.name.trim()) {
      newErrors.name = t("Name is required");
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
    const formDataToSend = new FormData();

    formDataToSend.append("name", formData?.name);
    formDataToSend.append("description", formData?.description || "");
    formDataToSend.append("position", formData?.position || "");

    if (imagePreview instanceof File) {
      formDataToSend.append("avatar", imagePreview);
    }

    // Add avatar_url if provided
    if (formData?.avatar_url) {
      formDataToSend.append("avatar_url", formData?.avatar_url);
    }

    setIsLoading(true);

    try {
      writer?.id
        ? await EditAuthorById(writer?.id, formDataToSend)
        : await CreateAuthor(formDataToSend);

      toast.success(
        writer?.id
          ? t("Writer updated successfully")
          : t("Writer created successfully")
      );
      onSectionChange("writers");
    } catch (err) {
      setErrorFn(err, t);
    } finally {
      setIsLoading(false);
    }
  };

  // Check for changes when formData changes
  useEffect(() => {
    if (writer && initialFormData) {
      // Compare all fields
      const hasTextChanges = Object.keys(initialFormData).some((key) => {
        // Skip avatar file field (check if new file was uploaded separately)
        if (key === "avatar") {
          return false;
        }
        return formData[key] !== initialFormData[key];
      });

      // Check if new avatar has been uploaded
      const hasNewAvatar = imagePreview instanceof File;

      setHasChanges(hasTextChanges || hasNewAvatar);
    }
  }, [formData, writer, initialFormData, imagePreview]);

  return (
    <div
      className="bg-white rounded-lg p-3 lg:p-6 w-full mx-4 overflow-y-auto"
      dir={i18n?.language === "ar" ? "rtl" : "ltr"}
    >
      {/* Start Breadcrumb */}
      <CustomBreadcrumb
        backTitle={t("Back to Writers List")}
        onBack={() => {
          onSectionChange("writers");
        }}
        page={writer ? t("Edit Writer") : t("Create New Writer")}
      />
      {/* End Breadcrumb */}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Start Image Upload Section */}
        <div>
          <div className="px-4 py-3 bg-blue-50 border-b border-blue-100">
            <p className="text-xs md:text-sm text-blue-800">
              <strong>{t("Important")}:</strong>{" "}
              {t(
                "Please select an image with minimum dimensions of 300x300 pixels for best quality."
              )}
            </p>
            <p className="text-xs text-blue-600 mt-1">
              {t("Supported formats")}: PNG, WEBP, JPG, JPEG, HEIC
            </p>
          </div>
          <label className="block text-sm font-medium text-gray-700 mb-2 mt-4">
            {t("Writer Avatar")}
          </label>
          <div className="flex items-center gap-4">
            <div
              className={`w-32 h-32 border-2 border-dashed border-gray-300 rounded-full flex items-center justify-center overflow-hidden`}
            >
              {formData?.avatar ? (
                <img
                  src={formData?.avatar}
                  alt="Preview"
                  className="w-full h-full object-cover"
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

                      setImagePreview(processedFile);
                      setFormData((prev) => ({ ...prev, avatar: url }));
                      setErrors((prev) => ({
                        ...prev,
                        avatar: "",
                      }));
                    } catch (error) {
                      console.error("Error processing image:", error);
                      toast.error(t("Failed to process image"));
                    }
                  }
                }}
                className="hidden"
                id="avatar-upload"
              />
              <label
                htmlFor="avatar-upload"
                className={`cursor-pointer inline-flex items-center gap-2 px-4 py-2 border ${
                  errors.avatar ? "border-red-500" : ""
                } border-gray-300 rounded-md hover:bg-gray-50`}
              >
                <Upload className="h-4 w-4" />
                {t("Upload Image")}
              </label>
              <p className="text-xs text-gray-500 mt-1">
                {t("Recommended: Square aspect ratio (1:1)")}
              </p>
            </div>
          </div>
        </div>
        {/* End Image Upload Section */}

        {/* Start Avatar URL Section */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t("Avatar URL")} ({t("Alternative to file upload")})
          </label>
          <Input
            name="avatar_url"
            value={formData?.avatar_url}
            onChange={handleInputChange}
            placeholder={t("Enter avatar URL as alternative to file upload")}
          />
          <p className="text-xs text-gray-500 mt-1">
            {t("You can either upload a file above or provide a URL here")}
          </p>
        </div>
        {/* End Avatar URL Section */}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-4">
            {/* Start Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("Name")} *
              </label>
              <Input
                name="name"
                value={formData?.name}
                onChange={handleInputChange}
                placeholder={t("Enter writer name")}
                className={errors.name ? "border-red-500" : ""}
              />
              {errors.name && (
                <p className="text-red-500 text-xs mt-1">{errors.name}</p>
              )}
            </div>
            {/* End Name */}

            {/* Start Position */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("Position")}
              </label>
              <Input
                name="position"
                value={formData?.position}
                onChange={handleInputChange}
                placeholder={t("Enter writer position")}
              />
            </div>
            {/* End Position */}
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("Description")}
              </label>
              <textarea
                name="description"
                value={formData?.description}
                onChange={handleInputChange}
                rows={4}
                placeholder={t("Enter writer description")}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-300"
              />
            </div>
            {/* End Description */}
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex items-center justify-end gap-3 pt-6 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={() => onSectionChange("writers")}
          >
            {t("Cancel")}
          </Button>
          <Button
            type="submit"
            className="flex items-center gap-2"
            disabled={writer && !hasChanges}
          >
            <Save className="h-4 w-4" />
            {isLoading
              ? t("Saving...")
              : writer
              ? t("Update Writer")
              : t("Create Writer")}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default CreateOrEditWriter;
