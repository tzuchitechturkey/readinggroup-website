import React from "react";

const CollectionCard = ({ photo, isNew = false, t, handleNavigate }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);

    const month = date.toLocaleString("en-US", { month: "short" });
    const day = date.getDate();
    const year = date.getFullYear();

    return `${month}. ${day}, ${year}`;
  };
  return (
    <div className="flex-1 h-[116px] md:h-[150px] lg:h-[189px] min-h-px relative overflow-hidden cursor-pointer group ">
      {/* Background Image */}
      <div className="">
        <div aria-hidden="true" className=" ">
          <img
            alt={photo.date}
            className="w-full duration-300 group-hover:scale-105"
            src={photo.image}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#061437]" />
        </div>
      </div>

      {/* Date Text */}
      <p className="absolute font-['Inter:Bold',sans-serif] font-semibold leading-normal bottom-[10px] sm:bottom-[12px] md:bottom-[14px] lg:bottom-[15px] left-1/2 transform -translate-x-1/2 text-[14px] sm:text-[16px] md:text-[20px]  text-white/90  ">
        {formatDate(photo.happened_at)}
      </p>

      {/* NEW Tag */}
      {isNew && (
        <div className="absolute border-[1px] border-white p-[6px] sm:p-[7px] md:p-[7px] lg:p-[8px] rounded-full top-2 sm:top-3 md:top-3 lg:top-4 left-2 sm:left-3 md:left-3 lg:left-4">
          <p className="font-inter font-normal leading-none text-[#f5f5f5] text-[12px] sm:text-[13px] md:text-[14px] lg:text-[16px]">
            {t("NEW")}
          </p>
        </div>
      )}

      {/* Hover Overlay */}
      <button
        onClick={() => {
          handleNavigate(photo.id);
        }}
        className="absolute inset-0 bg-black bg-opacity-30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center"
      >
        <p className="bg-white bg-opacity-90 text-black px-3 sm:px-4 lg:px-4 py-1.5 sm:py-2 lg:py-2 rounded-lg font-bold text-[12px] sm:text-[13px] lg:text-sm">
          {t("View Details")}
        </p>
      </button>
    </div>
  );
};

export default CollectionCard;
