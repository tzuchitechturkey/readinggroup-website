import { useTranslation } from "react-i18next";
import { ImageOff } from "lucide-react";

/**
 * Read-only thumbnail preview.
 * Shown after YouTube info is fetched so the user can confirm the image.
 */
export default function ThumbnailPreview({ thumbnailUrl }) {
  const { t } = useTranslation();

  if (!thumbnailUrl) return null;

  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-700">
        {t("Thumbnail")}
      </label>
      <div className="w-48 h-28 rounded-lg overflow-hidden border border-gray-200 bg-gray-50 flex items-center justify-center">
        <img
          src={thumbnailUrl}
          alt="thumbnail"
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.style.display = "none";
            e.currentTarget.nextSibling.style.display = "flex";
          }}
        />
        <div
          className="hidden w-full h-full items-center justify-center text-gray-400"
        >
          <ImageOff size={24} />
        </div>
      </div>
    </div>
  );
}
