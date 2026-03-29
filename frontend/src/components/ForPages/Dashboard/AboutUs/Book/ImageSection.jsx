import { useTranslation } from "react-i18next";
import { Upload } from "lucide-react";

const ImageSection = ({ imagePreview, onFileChange, errors, title, fieldName = "image" }) => {
  const { t } = useTranslation();
  const inputId = `${fieldName}-upload`;
  const hasError = errors[fieldName];

  return (
    <>
      {/* Image Upload */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {title} *
        </label>
        <div className="px-4 py-3 bg-blue-50 border-b border-blue-100">
          <p className="text-xs md:text-sm text-blue-800">
            <strong>{t("Important")}:</strong>{" "}
            {t(
              "Please select an image with minimum dimensions of 1920x1080 pixels for best quality.",
            )}
          </p>
          <p className="text-xs text-blue-600 mt-1">
            {t("Supported formats")}: PNG, WEBP, JPG, JPEG, HEIC
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div
            className={`w-32 h-24 border-2 border-dashed rounded-lg flex items-center justify-center ${
              hasError ? "border-red-500" : "border-gray-300"
            }`}
          >
            {imagePreview ? (
              <img
                src={imagePreview || "/fake-user.png"}
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
              accept="image/*,.heic,.heif"
              onChange={(e) => onFileChange(e.target.files[0])}
              className="hidden"
              id={inputId}
            />
            <label
              htmlFor={inputId}
              className={`cursor-pointer inline-flex items-center gap-2 px-4 py-2 border ${
                hasError ? "border-red-500" : "border-gray-300"
              } rounded-md hover:bg-gray-50`}
            >
              <Upload className="h-4 w-4" />
              {t("Upload Image")}
            </label>
            <p className="text-xs text-gray-500 mt-1">
              {t("Recommended: 16:9 aspect ratio")}
            </p>
            {hasError && (
              <p className="text-red-500 text-xs mt-1">{hasError}</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ImageSection;
