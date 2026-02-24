import { Image, X, Upload } from "lucide-react";

import { Input } from "@/components/ui/input";

export const ImagesUploadSection = ({
  t,
  imagePreviews,
  imageUrlsInput,
  setImageUrlsInput,
  errors,
  formData,
  handleMultipleImageUpload,
  handleRemoveImagePreview,
  handleRemoveExistingImage,
  handleAddImageUrl,
  handleRemoveImageUrl,
}) => {
  return (
    <div className="space-y-6">
      {/* Image Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t("Images")} ({t("Upload images")})
        </label>

        {/* Upload Area */}
        <label className="relative flex items-center justify-center w-full h-24 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer group">
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => handleMultipleImageUpload(e.target.files)}
            className="hidden"
          />
          <div className="flex flex-col items-center justify-center">
            <Upload className="w-6 h-6 text-gray-400 group-hover:text-gray-600 transition-colors" />
            <p className="text-sm text-gray-600 mt-1">
              {t("Click to upload images or drag them here")}
            </p>
          </div>
        </label>

        {/* Image Previews */}
        {imagePreviews.length > 0 && (
          <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-3">
            {imagePreviews.map((preview, index) => (
              <div
                key={index}
                className="relative group rounded-lg overflow-hidden"
              >
                <img
                  src={preview}
                  alt={`Preview ${index}`}
                  className="w-full h-32 object-cover"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImagePreview(index)}
                  className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  title={t("Remove")}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        {errors.image && (
          <p className="text-red-500 text-xs mt-2">{errors.image}</p>
        )}

        <p className="text-xs text-gray-500 mt-2">
          {t("Supported formats: JPG, PNG, WebP (Max 5MB per image)")}
        </p>
      </div>

      {/* Existing Images (when editing) */}
      {formData.images && formData.images.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t("Existing Images")}
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {formData.images
              .filter((img) => typeof img === "object" && img?.image)
              .map((image, index) => (
                <div
                  key={index}
                  className="relative group rounded-lg overflow-hidden"
                >
                  <img
                    src={
                      image?.image_url ||
                      (typeof image.image === "string"
                        ? image.image
                        : URL.createObjectURL(image.image))
                    }
                    alt={`Existing ${index}`}
                    className="w-full h-32 object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveExistingImage(index)}
                    className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    title={t("Remove")}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Image URLs Section */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t("Image URLs")} ({t("Add images via URL")})
        </label>

        <div className="space-y-2">
          <div className="flex gap-2">
            <Input
              value={imageUrlsInput}
              onChange={(e) => setImageUrlsInput(e.target.value)}
              placeholder={t("Enter image URL")}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddImageUrl();
                }
              }}
            />
            <button
              type="button"
              onClick={handleAddImageUrl}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              {t("Add")}
            </button>
          </div>

          {/* Display Image URLs */}
          {formData.images_url && formData.images_url.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs text-gray-500 font-medium">
                {t("URLs added")}:
              </p>
              {formData.images_url.map((url, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 bg-gray-100 rounded-lg"
                >
                  <p className="text-sm text-gray-600 truncate">{url}</p>
                  <button
                    type="button"
                    onClick={() => handleRemoveImageUrl(index)}
                    className="ml-2 text-red-600 hover:text-red-800"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <p className="text-xs text-gray-500 mt-2">
          {t("Add external image URLs. At least one image is required.")}
        </p>
      </div>
    </div>
  );
};
