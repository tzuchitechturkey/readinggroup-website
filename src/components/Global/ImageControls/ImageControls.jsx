import React from "react";

import { useTranslation } from "react-i18next";
import { Heart, Expand, Download, Share } from "lucide-react";

function ImageControls({
  isLiked,
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
      className={`absolute bottom-4 ${
        isRTL ? "right-4" : "left-4"
      } flex items-center ${
        isRTL ? "space-x-reverse" : ""
      } space-x-3 ${className}`}
    >
      <button
        onClick={onLike}
        className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
          isLiked
            ? "bg-red-500 text-white hover:bg-red-600"
            : "bg-black bg-opacity-70 text-white hover:bg-opacity-80"
        }`}
        title={t(isLiked ? "Remove from favorites" : "Add to favorites")}
      >
        <Heart
          className={`w-5 h-5 transition-all duration-300 ${
            isLiked ? "fill-white" : ""
          }`}
        />
      </button>

      <button
        onClick={onExpandImage}
        className="w-12 h-12 bg-black bg-opacity-70 text-white rounded-full flex items-center justify-center hover:bg-opacity-80 transition-all"
        title={t("View full image")}
      >
        <Expand className="w-5 h-5" />
      </button>

      <button
        onClick={onDownloadImage}
        className="w-12 h-12 bg-black bg-opacity-70 text-white rounded-full flex items-center justify-center hover:bg-opacity-80 transition-all"
        title={t("Download image")}
      >
        <Download className="w-5 h-5" />
      </button>

      <button
        onClick={onShareImage}
        className="w-12 h-12 bg-black bg-opacity-70 text-white rounded-full flex items-center justify-center hover:bg-opacity-80 transition-all"
        title={t("Share image")}
      >
        <Share className="w-5 h-5" />
      </button>
    </div>
  );
}

export default ImageControls;
