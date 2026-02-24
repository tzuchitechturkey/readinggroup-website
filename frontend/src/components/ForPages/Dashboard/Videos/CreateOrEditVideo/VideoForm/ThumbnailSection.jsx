import { useTranslation } from "react-i18next";
import { AlertCircle } from "lucide-react";

export const ThumbnailSection = ({
  imagePreview,
  onUpload,
  error,
  isDisabled,
}) => {
  const { t } = useTranslation();

  const handleDragOver = (e) => {
    e.preventDefault();
    e.currentTarget.classList.add("border-blue-400", "bg-blue-50");
  };

  const handleDragLeave = (e) => {
    e.currentTarget.classList.remove("border-blue-400", "bg-blue-50");
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.currentTarget.classList.remove("border-blue-400", "bg-blue-50");
    const files = e.dataTransfer.files;
    if (files?.length) {
      onUpload(files[0]);
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files?.length) {
      onUpload(e.target.files[0]);
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {t("Thumbnail")}
      </label>

      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer transition-colors ${
          isDisabled ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        {imagePreview ? (
          <div className="space-y-3">
            <img
              src={
                typeof imagePreview === "string"
                  ? imagePreview
                  : URL.createObjectURL(imagePreview)
              }
              alt="Thumbnail preview"
              className="w-32 h-32 object-cover rounded mx-auto"
            />
            <p className="text-sm text-gray-500">{t("Click or drag to change")}</p>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-sm text-gray-600">{t("Drag or click to upload thumbnail")}</p>
            <p className="text-xs text-gray-500">{t("Maximum 5MB")}</p>
          </div>
        )}

        <input
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          disabled={isDisabled}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
        />
      </div>

      {error && (
        <div className="flex items-center gap-2 text-red-600 text-sm">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};
