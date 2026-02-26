import React from "react";

import { useTranslation } from "react-i18next";
import { Download } from "lucide-react";

const CardOverlay = ({ card, onViewDetails }) => {
  const { t } = useTranslation();

  const handleDownload = async (e) => {
    e.stopPropagation();
    try {
      const response = await fetch(card.image);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      // Extract filename or use title
      const fileName = card.title ? `${card.title}.jpg` : "tzu-chi-image.jpg";
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed", error);
    }
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
