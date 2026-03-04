import { useTranslation } from "react-i18next";
import { Upload } from "lucide-react";

const ImageSection = ({
  imagePreview,
  onFileChange,
  imageUrl,
  onImageUrlChange,
  errors,
}) => {
  const { t } = useTranslation();

  return (
    <>
      {/* Image Upload */}
      <div>
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
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t("Event Image")}*
        </label>
        <div className="flex items-center gap-4">
          <div
            className={`w-32 h-24 border-2 border-dashed rounded-lg flex items-center justify-center ${
              errors.image ? "border-red-500" : "border-gray-300"
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
              id="image-upload"
            />
            <label
              htmlFor="image-upload"
              className={`cursor-pointer inline-flex items-center gap-2 px-4 py-2 border ${
                errors.image ? "border-red-500" : "border-gray-300"
              } rounded-md hover:bg-gray-50`}
            >
              <Upload className="h-4 w-4" />
              {t("Upload Image")}
            </label>
            <p className="text-xs text-gray-500 mt-1">
              {t("Recommended: 16:9 aspect ratio")}
            </p>
            {errors.image && (
              <p className="text-red-500 text-xs mt-1">{errors.image}</p>
            )}
          </div>
        </div>
      </div>

      {/* Image URL */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t("Image URL")} ({t("Alternative to file upload")})
        </label>
        <input
          type="url"
          value={imageUrl}
          onChange={onImageUrlChange}
          className="w-full p-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
          placeholder={t("Enter image URL as alternative to file upload")}
        />
        <p className="text-xs text-gray-500 mt-1">
          {t("You can either upload a file above or provide a URL here")}
        </p>
      </div>
    </>
  );
};

export default ImageSection;
