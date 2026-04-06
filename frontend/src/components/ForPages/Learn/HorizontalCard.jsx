import React from "react";

import { useTranslation } from "react-i18next";

import CardOverlay from "./CardOverlay";

const HorizontalCard = ({ card, onClick }) => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-1 group w-full">
      {/* Aspect Ratio Container for Horizontal Cards (Figma: 358/201) */}
      <div
        className="relative w-full aspect-[358/201] md:aspect-[240/135] bg-[#4a7c59] overflow-hidden cursor-pointer group-hover:shadow-lg transition-all duration-700"
        onClick={onClick}
      >
        <img
          src={card.image || card.image_url}
          alt={card.title || "Tzu Chi Content"}
          className="absolute inset-0 w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-110"
        />

        <CardOverlay card={card} onViewDetails={onClick} />
      </div>
      {/* <div className="flex flex-col gap-1">
        <span className="text-[14px] md:text-[16px] text-[#285688] font-normal leading-[1.2] md:leading-[1.5]">
          {card?.created_at
            ? new Date(card.created_at).toLocaleDateString("en-US", {
                month: "short",
                day: "2-digit",
                year: "numeric",
              })
            : "—"}{" "}
        </span>
      </div> */}
    </div>
  );
};

export default HorizontalCard;
