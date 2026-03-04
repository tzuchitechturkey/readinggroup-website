import React, { useState } from "react";

import { ArrowRight } from "lucide-react";

import ImageViewerModal from "@/components/Global/ImageViewerModal/ImageViewerModal";

const PosterCard = ({ poster, t }) => {
  const [isViewerOpen, setIsViewerOpen] = useState(false);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    })
      .format(date)
      .replace(",", "")
      .replace(/(\w{3})/, "$1.");
  };
  return (
    <div className="flex flex-col items-start pb-[40px] sm:pb-[45px] md:pb-[55px] lg:pb-[65px] w-full">
      <div className="flex flex-col md:flex-row gap-[16px] sm:gap-[20px] md:gap-[24px] lg:gap-[24px] items-start md:items-center w-full">
        {/* Left - Poster Image */}
        <div className="h-[250px] sm:h-[300px] md:h-[400px] lg:h-[501px] w-full sm:w-[90%] md:w-[48%] lg:w-[792px] relative shadow-[0px_-17px_19.3px_-14px_rgba(0,0,0,0.25)] overflow-hidden  ">
          <div
            aria-hidden="true"
            className="absolute inset-0 pointer-events-none"
          >
            <div className="absolute inset-0 overflow-hidden">
              <img
                alt={poster?.title}
                src={poster?.image || poster?.image_url}
                className="w-full h-full object-cover object-top"
              />
            </div>

            <div className="absolute inset-0 bg-gradient-to-b from-transparent from-[21.96%] via-[rgba(172,196,223,0.5)] via-[87.844%] to-[#acc4df]" />
          </div>
        </div>

        {/* Right - Content */}
        <div className="flex flex-1  flex-col  md:flex-row items-start md:items-center  w-full">
          <div className="flex flex-1 flex-col gap-[16px] sm:gap-[18px] md:gap-[20px] lg:gap-[24px] h-full items-start min-h-px min-w-px py-[8px] sm:py-[10px] md:py-[12px] lg:py-[12px] w-full">
            {/* Date Tag */}
            <div className="flex gap-[6px] sm:gap-[7px] md:gap-[8px] lg:gap-[8px] border-[1px] border-[#285688] items-center justify-center p-[6px] sm:p-[7px] md:p-[8px] lg:p-[8px] rounded-full">
              <p className="font-inter font-normal leading-none text-[#285688] text-[13px] sm:text-[14px] md:text-[15px] lg:text-[16px]">
                {formatDate(poster?.created_at)}
              </p>
            </div>

            {/* Title */}
            <p className=" font-['Noto_Sans_TC:Black',sans-serif] font-black leading-[1.5] text-[24px] sm:text-[28px] md:text-[36px] lg:text-[40px] text-[#081945] w-full whitespace-pre-wrap">
              {poster?.title}
            </p>
            <div className="flex items-center gap-3  ">
              {/* Learn More Button */}
              <button
                onClick={() => {
                  setIsViewerOpen(true);
                }}
                className="bg-[#285688] border-none outline-none p-[8px] px-3 md:p-[11px] lg:p-[12px] rounded-[6px] sm:rounded-[7px] md:rounded-[8px] lg:rounded-[8px] hover:bg-[#404040] transition-colors"
              >
                <p className="font-['Noto_Sans_TC:Regular',sans-serif] font-normal leading-[1.5] text-[12px] md:text-[15px] lg:text-[16px] text-[#f5f5f5]">
                  {t("Learn more")}
                </p>
              </button>
              <button
                onClick={() => {
                  setIsViewerOpen(true);
                }}
                className="bg-[#fff] flex items-center gap-1 border-none p-[8px] px-3 md:p-[11px] lg:p-[12px] rounded-[6px] sm:rounded-[7px] md:rounded-[8px] lg:rounded-[8px] hover:bg-[#404040] transition-colors"
              >
                <p className="font-['Noto_Sans_TC:Regular',sans-serif] font-normal leading-[1.5] text-[12px] md:text-[15px] lg:text-[16px] text-[#285688]">
                  {t("More Good Effects Posters")}
                </p>
                <ArrowRight className="size-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Image Viewer Modal */}
      <ImageViewerModal
        isOpen={isViewerOpen}
        onClose={() => setIsViewerOpen(false)}
        images={
          poster?.image
            ? [poster?.image]
            : poster?.image_url
              ? [poster?.image_url]
              : []
        }
        currentIndex={0}
      />
    </div>
  );
};

export default PosterCard;
