import React from "react";

import { useTranslation } from "react-i18next";
import { X, Download } from "lucide-react";

function ImageModal({
  isOpen,
  onClose,
  imageData,
  onDownloadImage,
  isRTL = false,
}) {
  const { t } = useTranslation();

  console.log(imageData, "ssssssssssss");
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 z-[99999999] flex items-center justify-center p-4">
      <div className="relative max-w-7xl max-h-full w-full h-full flex items-center justify-center">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 bg-black bg-opacity-50 hover:bg-opacity-70 text-white rounded-full flex items-center justify-center transition-all"
          title={t("Close")}
        >
          <X className="w-6 h-6" />
        </button>

        {/* Download Button */}
        <button
          onClick={onDownloadImage}
          className="absolute top-4 left-4 z-10 w-10 h-10 bg-black bg-opacity-50 hover:bg-opacity-70 text-white rounded-full flex items-center justify-center transition-all"
          title={t("Download image")}
        >
          <Download className="w-5 h-5" />
        </button>

        {/* Image */}
        <img
          src={imageData.image}
          alt={imageData.title}
          className=" w-full  h-full object-contain rounded-lg"
          onClick={onClose}
        />

        {/* Image Info */}
        <div className="absolute bottom-4 left-4 right-4 bg-black bg-opacity-50 text-white p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-1">{t(imageData.title)}</h3>
          <p className="text-sm text-gray-300 mb-2">{t(imageData.subtitle)}</p>
          <div
            className={`flex items-center ${
              isRTL ? "flex-row-reverse" : ""
            } justify-between text-sm`}
          >
            <span>{imageData.writer}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ImageModal;
