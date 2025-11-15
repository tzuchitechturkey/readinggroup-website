import React, { useState } from "react";

import { useTranslation } from "react-i18next";
import { Heart, Expand, Download, Share } from "lucide-react";

import LoginModal from "../LoginModal";

function ImageControls({
  hasLiked,
  onLike,
  onExpandImage,
  onDownloadImage,
  onShareImage,
  isRTL = false,
  className = "",
}) {
  const { t } = useTranslation();
  const [showLoginModal, setShowLoginModal] = useState(false);

  // دالة للتحقق من تسجيل الدخول
  const isLoggedIn = () => {
    return Boolean(localStorage.getItem("accessToken"));
  };

  // دالة للتعامل مع الإعجاب
  const handleLike = () => {
    if (!isLoggedIn()) {
      setShowLoginModal(true);
      return;
    }
    onLike();
  };

  // دالة للتعامل مع المشاركة
  const handleShare = () => {
    if (!isLoggedIn()) {
      setShowLoginModal(true);
      return;
    }
    onShareImage();
  };
  return (
    <div
      className={`absolute bottom-3 ${
        isRTL ? "right-3" : "left-3"
      } flex items-center ${
        isRTL ? "space-x-reverse" : ""
      } space-x-2 ${className}`}
    >
      <button
        onClick={handleLike}
        className={`w-8 h-8 lg:w-9 lg:h-9 rounded-full flex items-center justify-center transition-all duration-300 ${
          hasLiked
            ? "bg-red-500 text-white hover:bg-red-600"
            : "bg-black bg-opacity-70 text-white hover:bg-opacity-80"
        }`}
        title={t(hasLiked ? "Remove from favorites" : "Add to favorites")}
      >
        <Heart
          className={`w-3 h-3 lg:w-4 lg:h-4 transition-all duration-300 ${
            hasLiked ? "fill-white" : ""
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
        onClick={handleShare}
        className="w-8 h-8 lg:w-9 lg:h-9 bg-black bg-opacity-70 text-white rounded-full flex items-center justify-center hover:bg-opacity-80 transition-all"
        title={t("Share image")}
      >
        <Share className="w-3 h-3 lg:w-4 lg:h-4" />
      </button>

      {/* Login Modal */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      />
    </div>
  );
}

export default ImageControls;
