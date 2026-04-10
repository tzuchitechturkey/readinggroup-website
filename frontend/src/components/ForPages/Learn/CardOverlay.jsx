import React from "react";

import { useTranslation } from "react-i18next";
import { Download } from "lucide-react";

const CardOverlay = ({ card, onViewDetails }) => {
  const { t } = useTranslation();

  const handleDownload = (e) => {
    e.stopPropagation();
    const imageUrl = card.image || card.image_url;
    if (!imageUrl) return;

    const fileName = card.title ? `${card.title}.jpg` : "tzu-chi-image.jpg";

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);
      canvas.toBlob((blob) => {
        if (!blob) return;
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      }, "image/jpeg");
    };
    img.onerror = () => {
      // Fallback: open image in new tab if canvas approach fails
      window.open(imageUrl, "_blank");
    };
    img.src = imageUrl;
  };
  return (
    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-in-out flex flex-col items-center justify-center gap-3">
      {/* View Details Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onViewDetails();
        }}
        className="bg-white/90 backdrop-blur-sm text-black px-5 py-2 rounded-lg font-bold text-sm shadow-xl transform translate-y-4 group-hover:translate-y-0 transition-transform duration-700 ease-out hover:bg-white transition-colors"
      >
        {t("View Details")}
      </button>

      {/* Download Button */}
      <button
        onClick={handleDownload}
        className="bg-white/90 backdrop-blur-sm text-black px-5 py-2 rounded-lg font-bold text-sm shadow-xl transform translate-y-4 group-hover:translate-y-0 transition-transform duration-700 ease-out flex items-center gap-2 hover:bg-white transition-colors delay-100"
      >
        <Download className="w-4 h-4" />
        {t("Download Image")}
      </button>
    </div>
  );
};

export default CardOverlay;
