import React, { useState } from "react";

import ImageViewerModal from "@/components/Global/ImageViewerModal/ImageViewerModal";

const Revisititem = ({ item, size = "medium", t }) => {
  const getSizeClasses = () => {
    switch (size) {
      case "small":
        return {
          container:
            "w-full sm:w-[calc(50%-6px)] md:w-[calc(33.333%-18px)] lg:w-[261px]",
          image: "h-[250px] md:h-[280px] lg:h-[345px] w-full  ",
        };
      case "large":
        return {
          container: "w-full sm:w-[calc(50%-6px)] md:w-full lg:w-[613px]",
          image: "h-[250px] md:h-[280px] lg:h-[345px] w-full  ",
        };
      default:
        return {
          container:
            "w-full sm:w-[calc(50%-6px)] md:w-[calc(33.333%-18px)] lg:w-[261px]",
          image: "h-[250px] md:h-[280px] lg:h-[345px] w-full  ",
        };
    }
  };

  const { image } = getSizeClasses();
  const [isViewerOpen, setIsViewerOpen] = useState(false);

  return (
    <div
      className={`flex flex-col gap-[8px] sm:gap-[9px] md:gap-[10px] lg:gap-[11px] items-center w-full ${size === "large" ? "md:items-start" : ""}`}
    >
      <div
        className={`${image} max-w-[580px] relative shadow-[0px_9px_17px_0px_rgba(0,0,0,0.25)] cursor-pointer overflow-hidden  `}
        onClick={() => setIsViewerOpen(true)}
      >
        <img
          alt={item?.title}
          className="w-full max-w-[580px] h-full pointer-events-none transition-transform duration-300 hover:scale-105"
          src={item?.image || item?.image_url}
        />

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-20 opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <div className="bg-white bg-opacity-90 text-black px-3 sm:px-4 lg:px-4 py-1.5 sm:py-2 lg:py-2 rounded-lg font-bold text-[12px] sm:text-[13px] lg:text-sm">
            {t("View Details")}
          </div>
        </div>
      </div>

      <p
        className={`font-['Noto_Sans_TC:Bold',sans-serif]  leading-[1.5] text-[13px] sm:text-[14px] md:text-[15px] lg:text-[16px] text-center text-[#FCFDFF] opacity-80 w-full whitespace-pre-wrap ${size === "large" ? "text-left" : ""}`}
      >
        {item?.title}
      </p>
      {/* Image Viewer Modal - Single Image Display */}
      <ImageViewerModal
        isOpen={isViewerOpen}
        onClose={() => setIsViewerOpen(false)}
        images={[item]}
        currentIndex={0}
      />
    </div>
  );
};

export default Revisititem;
