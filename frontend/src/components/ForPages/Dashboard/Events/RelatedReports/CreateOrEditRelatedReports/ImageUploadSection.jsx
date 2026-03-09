import React from "react";

import { Upload } from "lucide-react";

/**
 * ImageUploadSection Component for RelatedReports
 * Handles image file upload only (no URL input)
 */
function ImageUploadSection({
  formData,
  errors,
  onFileChange,
  t,
}) {
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      onFileChange({
        target: {
          name: 'image',
          type: 'file',
          files: [file]
        }
      });
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200">
      {/* Image Upload Header */}
      <div className="px-4 py-3 bg-blue-50 border border-blue-100 rounded-lg mb-6">
        <p className="text-sm text-blue-800">
          <strong>{t("Important")}:</strong>{" "}
          {t(
            "Please select an image with minimum dimensions of 1920x1080 pixels for best quality.",
          )}
        </p>
        <p className="text-xs text-blue-600 mt-1">
          {t("Supported formats")}: PNG, WEBP, JPG, JPEG, HEIC
        </p>
      </div>

      {/* Image Upload Section */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t("Report Image")} *
        </label>
        <div className="flex items-center gap-4">
          {/* Image Preview */}
          <div
            className={`w-32 h-24 border-2 border-dashed rounded-lg flex items-center justify-center flex-shrink-0 ${
              errors?.image ? "border-red-500" : "border-gray-300"
            }`}
          >
            {formData?.image ? (
              <img
                src={URL.createObjectURL(formData.image)}
                alt="Preview"
                className="w-full h-full object-cover rounded-lg"
              />
            ) : (
              <Upload className="h-8 w-8 text-gray-400" />
            )}
          </div>

          {/* Upload Input */}
          <div className="flex-1">
            <input
              type="file"
              accept="image/*,.heic,.heif"
              onChange={handleFileChange}
              className="hidden"
              id="image-upload"
            />
            <label
              htmlFor="image-upload"
              className={`cursor-pointer inline-flex items-center gap-2 px-4 py-2 border rounded-md hover:bg-gray-50 transition-colors ${
                errors?.image ? "border-red-500" : "border-gray-300"
              }`}
            >
              <Upload className="h-4 w-4" />
              {t("Upload Image")}
            </label>
            <p className="text-xs text-gray-500 mt-2">
              {t("Recommended: 16:9 aspect ratio")}
            </p>
            {formData?.image && (
              <p className="text-xs text-gray-600 mt-1">
                {t("Selected file")}: <strong>{formData.image.name}</strong>
              </p>
            )}
            {errors?.image && (
              <p className="text-red-500 text-xs mt-2">{errors.image}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageUploadSection;
