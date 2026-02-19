import React from "react";

import Image from "../../../assets/4-top5.jpg";

const PosterCard = ({ poster }) => {
  return (
    <div className="flex flex-col items-start pb-[40px] sm:pb-[45px] md:pb-[55px] lg:pb-[65px] w-full">
      <div className="flex flex-col md:flex-row gap-[16px] sm:gap-[20px] md:gap-[24px] lg:gap-[24px] items-start md:items-center w-full">
        {/* Left - Poster Image */}
        <div className="h-[250px] sm:h-[300px] md:h-[400px] lg:h-[501px] w-full sm:w-[90%] md:w-[48%] lg:w-[792px] relative shadow-[0px_-17px_19.3px_-14px_rgba(0,0,0,0.25)] overflow-hidden rounded-lg md:rounded-xl lg:rounded-lg">
          <div
            aria-hidden="true"
            className="absolute inset-0 pointer-events-none"
          >
            <div className="absolute inset-0 overflow-hidden">
              <img
                alt={poster.title}
                src={poster.image}
                className="w-full h-full object-cover object-top"
              />
            </div>

            <div className="absolute inset-0 bg-gradient-to-b from-transparent from-[21.96%] via-[rgba(172,196,223,0.5)] via-[87.844%] to-[#acc4df]" />
          </div>
        </div>

        {/* Right - Content */}
        <div className="flex flex-1 flex-col md:flex-row items-start md:items-center self-stretch w-full">
          <div className="flex flex-1 flex-col gap-[16px] sm:gap-[18px] md:gap-[20px] lg:gap-[24px] h-full items-start min-h-px min-w-px py-[8px] sm:py-[10px] md:py-[12px] lg:py-[12px] w-full">
            {/* Date Tag */}
            <div className="flex gap-[6px] sm:gap-[7px] md:gap-[8px] lg:gap-[8px] border-[1px] border-[#1B2D58] items-center justify-center p-[6px] sm:p-[7px] md:p-[8px] lg:p-[8px] rounded-full">
              <p className="font-inter font-normal leading-none text-[#1B2D58] text-[13px] sm:text-[14px] md:text-[15px] lg:text-[16px]">
                {poster.date}
              </p>
            </div>

            {/* Title */}
            <p className="font-['Noto_Sans_TC:Black',sans-serif] font-black leading-[1.5] text-[24px] sm:text-[28px] md:text-[36px] lg:text-[40px] text-black w-full whitespace-pre-wrap">
              {poster.title}
            </p>

            {/* Learn More Button */}
            <button
              //   onClick={handleLearnMoreClick}
              className="bg-[#1B2D58] border border-[#1B2D58] flex gap-[6px] sm:gap-[7px] md:gap-[8px] lg:gap-[8px] items-center justify-center overflow-hidden p-[8px] sm:p-[10px] md:p-[11px] lg:p-[12px] rounded-[6px] sm:rounded-[7px] md:rounded-[8px] lg:rounded-[8px] hover:bg-[#404040] transition-colors"
            >
              <p className="font-['Noto_Sans_TC:Regular',sans-serif] font-normal leading-[1.5] text-[13px] sm:text-[14px] md:text-[15px] lg:text-[16px] text-[#f5f5f5]">
                {poster.buttonText || "Learn more"}
              </p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PosterCard;
