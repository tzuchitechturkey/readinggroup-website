import { useTranslation } from "react-i18next";
import { Upload, Link, X, Plus } from "lucide-react";

const ImagesSection = ({
  imageFiles,
  imageUrls,
  onImageFilesChange,
  onImageUrlsChange,
  imageMode, // "files" or "urls"
  onImageModeChange,
  errors,
}) => {
  const { t } = useTranslation();

  const handleFileChange = (files) => {
    const newFiles = Array.from(files);
    onImageFilesChange(newFiles);
  };

  const addImageUrl = () => {
    onImageUrlsChange([...imageUrls, ""]);
  };

  const removeImageUrl = (index) => {
    const newUrls = imageUrls.filter((_, i) => i !== index);
    onImageUrlsChange(newUrls);
  };

  const updateImageUrl = (index, value) => {
    const newUrls = [...imageUrls];
    newUrls[index] = value;
    onImageUrlsChange(newUrls);
  };

  const removeFile = (index) => {
    const newFiles = imageFiles.filter((_, i) => i !== index);
    onImageFilesChange(newFiles);
  };

  return (
    <div className="space-y-6">
      {/* Mode Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          {t("Images")}*
        </label>
      </div>

      {/* File Upload Mode */}
      <div>
        <div className="px-4 py-3 bg-blue-50 border-b border-blue-100 rounded-t-lg">
          <p className="text-xs md:text-sm text-blue-800">
            <strong>{t("Important")}:</strong>{" "}
            {t(
              "Please select images with minimum dimensions of 800x600 pixels for best quality.",
            )}
          </p>
          <p className="text-xs text-blue-600 mt-1">
            {t("Supported formats")}: PNG, WEBP, JPG, JPEG, HEIC
          </p>
        </div>

        <div
          className={`border-2 border-dashed rounded-b-lg p-6 ${
            errors.images ? "border-red-500" : "border-gray-300"
          }`}
        >
          <input
            type="file"
            accept="image/*,.heic,.heif"
            multiple
            onChange={(e) => handleFileChange(e.target.files)}
            className="hidden"
            id="images-upload"
          />
          <label
            htmlFor="images-upload"
            className="cursor-pointer flex flex-col items-center gap-2"
          >
            <Upload className="h-12 w-12 text-gray-400" />
            <div className="text-center">
              <p className="text-sm font-medium text-gray-900">
                {t("Click to upload images")}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {t("You can select multiple images at once")}
              </p>
            </div>
          </label>

          {/* Preview uploaded files */}
          {imageFiles.length > 0 && (
            <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
              {imageFiles.map((file, index) => (
                <div key={index} className="relative">
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-24 object-cover rounded border"
                  />
                  <button
                    type="button"
                    onClick={() => removeFile(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        {errors.images && (
          <p className="text-red-500 text-xs mt-1">{errors.images}</p>
        )}
      </div>
    </div>
  );
};

export default ImagesSection;
