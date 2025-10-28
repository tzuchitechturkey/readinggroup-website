import React from "react";

import { useTranslation } from "react-i18next";
import { Heart, Expand, Download, Share } from "lucide-react";

function ImageControls({
  has_liked,
  onLike,
  onExpandImage,
  onDownloadImage,
  onShareImage,
  isRTL = false,
  className = "",
}) {
  const { t } = useTranslation();
  return (
    <div
      className={`absolute bottom-3 ${
        isRTL ? "right-3" : "left-3"
      } flex items-center ${
        isRTL ? "space-x-reverse" : ""
      } space-x-2 ${className}`}
    >
      <button
        onClick={onLike}
        className={`w-8 h-8 lg:w-9 lg:h-9 rounded-full flex items-center justify-center transition-all duration-300 ${
          has_liked
            ? "bg-red-500 text-white hover:bg-red-600"
            : "bg-black bg-opacity-70 text-white hover:bg-opacity-80"
        }`}
        title={t(has_liked ? "Remove from favorites" : "Add to favorites")}
      >
        <Heart
          className={`w-3 h-3 lg:w-4 lg:h-4 transition-all duration-300 ${
            has_liked ? "fill-white" : ""
          }`}
        />
      </button>

      <button
        onClick={onExpandImage}
        className="w-8 h-8 lg:w-9 lg:h-9 bg-black bg-opacity-70 text-white rounded-full flex items-center justify-center hover:bg-opacity-80 transition-all"
        title={t("View full image")}
      >
        <Expand className="w-3 h-3 lg:w-4 lg:h-4" />
      </button>

      <button
        onClick={onDownloadImage}
        className="w-8 h-8 lg:w-9 lg:h-9 bg-black bg-opacity-70 text-white rounded-full flex items-center justify-center hover:bg-opacity-80 transition-all"
        title={t("Download image")}
      >
        <Download className="w-3 h-3 lg:w-4 lg:h-4" />
      </button>

      <button
        onClick={onShareImage}
        className="w-8 h-8 lg:w-9 lg:h-9 bg-black bg-opacity-70 text-white rounded-full flex items-center justify-center hover:bg-opacity-80 transition-all"
        title={t("Share image")}
      >
        <Share className="w-3 h-3 lg:w-4 lg:h-4" />
      </button>
    </div>
  );
}

export default ImageControls;
