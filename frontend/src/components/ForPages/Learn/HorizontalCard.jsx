import React from "react";

import { useTranslation } from "react-i18next";

const HorizontalCard = ({ card, onClick }) => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-1 group w-full">
      {/* Aspect Ratio Container for Horizontal Cards (Figma: 358/201) */}
      <div
        className="relative w-full aspect-[358/201] md:aspect-[240/135] bg-[#4a7c59] overflow-hidden cursor-pointer group-hover:shadow-lg transition-all duration-300"
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
        <span className="text-[14px] md:text-[16px] text-[#285688] font-normal leading-[1.2] md:leading-[1.5]">
          {card.date || card.happened_at || "—"}
        </span>
      </div>
    </div>
  );
};

export default HorizontalCard;
