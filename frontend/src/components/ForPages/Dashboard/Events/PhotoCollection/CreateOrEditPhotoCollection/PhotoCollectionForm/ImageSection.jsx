import { useState, useRef } from "react";

import { useTranslation } from "react-i18next";

const ImageSection = ({
  images,
  onNewImagesChange,
  onImageUrlChange,
  onAddImageUrl,
  onRemoveImage,
  errors,
}) => {
  const { t } = useTranslation();
  const [previewImages, setPreviewImages] = useState([]);
  const [imageUrl, setImageUrl] = useState("");
  const fileInputRef = useRef(null);

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    // Update files for parent component
    onNewImagesChange(files);

    // Create preview URLs
    const previews = files.map((file) => ({
      file,
      url: URL.createObjectURL(file),
      name: file.name,
      type: "file",
    }));
    setPreviewImages(previews);
  };

  const handleAddUrl = () => {
    if (imageUrl.trim()) {
      onAddImageUrl(imageUrl.trim());
      setImageUrl("");
    }
  };

  const handleRemovePreview = (index) => {
    const newPreviews = [...previewImages];
    URL.revokeObjectURL(newPreviews[index].url);
    newPreviews.splice(index, 1);
    setPreviewImages(newPreviews);

    // Update parent with remaining files
    const remainingFiles = newPreviews
      .filter((p) => p.type === "file")
      .map((p) => p.file);
    onNewImagesChange(remainingFiles);
  };

  const clearFileInput = () => {
    setPreviewImages([]);
    onNewImagesChange([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-6">
      <div className="px-4 py-3 bg-blue-50 border-b border-blue-100">
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
      <h3 className="text-lg font-medium text-gray-900">{t("Images")}</h3>

      {/* File Upload Section */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t("Upload Images")}
        </label>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            {t("Choose Images")}
          </button>
          <p className="text-gray-500 text-sm mt-2">
            {t("Support multiple image files (JPG, PNG, GIF)")}
          </p>
        </div>
        {errors.images && (
          <p className="text-red-500 text-xs mt-1">{errors.images}</p>
        )}
      </div>

      {/* URL Input Section */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t("Image URL")}
        </label>
        <div className="flex gap-2">
          <input
            type="url"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="flex-1 p-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
            placeholder={t("Enter image URL")}
          />
          <button
            type="button"
            onClick={handleAddUrl}
            disabled={!imageUrl.trim()}
            className="bg-green-500 hover:bg-green-600 disabled:bg-gray-300 text-white px-4 py-2 rounded-lg transition-colors"
          >
            {t("Add")}
          </button>
        </div>
      </div>

      {/* File Previews */}
      {previewImages.length > 0 && (
        <div>
          <h4 className="text-md font-medium text-gray-700 mb-3">
            {t("Selected Files")} ({previewImages.length})
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {previewImages.map((preview, index) => (
              <div key={index} className="relative group">
                <img
                  src={preview.url}
                  alt={preview.name}
                  className="w-full h-32 object-cover rounded-lg border"
                />
                <button
                  type="button"
                  onClick={() => handleRemovePreview(index)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
                >
                  ×
                </button>
                <p
                  className="text-xs text-gray-600 mt-1 truncate"
                  title={preview.name}
                >
                  {preview.name}
                </p>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={clearFileInput}
            className="mt-3 text-red-500 hover:text-red-700 text-sm"
          >
            {t("Clear All Files")}
          </button>
        </div>
      )}

      {/* Existing Images + URL Images */}
      {images && images.length > 0 && (
        <div>
          <h4 className="text-md font-medium text-gray-700 mb-3">
            {t("Current Images")} ({images.length})
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((image, index) => (
              <div key={index} className="relative group">
                <img
                  src={
                    typeof image === "string" ? image : image.image || image.url
                  }
                  alt={`Image ${index + 1}`}
                  className="w-full h-32 object-cover rounded-lg border"
                />
                <button
                  type="button"
                  onClick={() => onRemoveImage(index)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageSection;
