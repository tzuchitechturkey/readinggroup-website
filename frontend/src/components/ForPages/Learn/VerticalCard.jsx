import React from "react";
import { useTranslation } from "react-i18next";

const VerticalCard = ({ card, onClick }) => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-3 group w-full">
      {/* Aspect Ratio Container for Vertical Posters (3:4) */}
      <div
        className="relative w-full bg-[#4a7c59] rounded-sm overflow-hidden cursor-pointer shadow-sm group-hover:shadow-lg transition-all duration-300 border border-gray-100"
        style={{ paddingBottom: "133.33%" }} // 3:4 Ratio
        onClick={onClick}
      >
        <img
          src={card.image}
          alt={card.title || "Tzu Chi Content"}
          className="absolute inset-0 w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-110"
        />

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <div className="bg-white/90 backdrop-blur-sm text-black px-5 py-2 rounded-lg font-bold text-sm shadow-xl transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
            {t("View Details")}
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <span className="text-[13px] text-[#8e8e8e] font-medium tracking-tight">
          {card.date}
        </span>
      </div>
    </div>
  );
};

export default VerticalCard;
