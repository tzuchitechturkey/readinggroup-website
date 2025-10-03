import React from "react";

import { useNavigate } from "react-router-dom";

import { resolveAsset } from "@/utils/assetResolver";

const blurBackground = resolveAsset("blur-weekly-images.png");

function WeekPhotosCard({ item }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/cards-photos/photos/${item.id}`);
  };

  return (
    <div className="mx-auto">
      <div
        key={item.id}
        className="group cursor-pointer transform hover:scale-105 transition-all duration-300"
        onClick={handleClick}
      >
        {/* البطاقة */}
        <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
          {/* Start Image - make it fill the card */}
          <div className="relative w-full h-[320px] md:h-[360px]">
            {/* Main photo sits on top and covers the container */}
            <img
              src={resolveAsset(item.image) || item.image}
              alt={item.title}
              className="absolute inset-0 w-full h-full object-cover rounded-xl group-hover:scale-110 transition-transform duration-300 z-20"
            />

            {/* Blur background behind the photo for style (lower z-index) */}
            <img
              src={blurBackground}
              alt="blur"
              className="absolute inset-0 w-full h-full object-cover rounded-xl z-10"
            />

            {/* Start Content - overlay text */}
            <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 text-center w-full z-30 pointer-events-none">
              <p className="font-bold text-lg text-[#ffffffcf]">{item.title}</p>
              {item.subtitle ? (
                <p className="font-bold text-xs text-[#ffffffcf] mt-1">
                  {item.subtitle}
                </p>
              ) : null}
            </div>

            {/* End Content */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default WeekPhotosCard;
