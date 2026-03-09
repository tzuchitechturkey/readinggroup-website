import React from "react";

const VideoCard = ({
  item,
  size = "default",
  navigate,
  showDate = false,
  rounded = false,
  textClassName = "",
  fromHomePage = false,
  reportCard = false,
  heroReportCard = false,
}) => {
  const getSizeClasses = () => {
    switch (size) {
      case "large":
        return {
          image: `h-[200px] sm:h-[200px] md:h-[300px]  lg:h-[456px]   w-full sm:w-[90%] md:w-[90%]  lg:w-full`,
          titleHeight: "h-[30px] sm:h-[32px] md:h-[34px] lg:h-[35px]",
          categoryText: "text-[14px] sm:text-[15px] md:text-base lg:text-xl",
          durationText: "text-[13px] sm:text-[14px] md:text-[15px] lg:text-lg",
          gap: "gap-[8px] sm:gap-[10px] md:gap-[12px] lg:gap-[12px]",
        };

      case "small":
        return {
          image: `${fromHomePage ? "h-[200px] " : heroReportCard ? "h-[199px] " : "h-[174px] "} w-full sm:w-[48%] md:w-[45%] lg:w-[290px] `,
          titleHeight: "h-[25px] sm:h-[26px] md:h-[28px] lg:h-[30px]",
          categoryText: "text-[12px] sm:text-[13px] md:text-[14px] lg:text-xl",
          durationText: "text-[12px] sm:text-[13px] md:text-[14px] lg:text-lg",
          gap: "gap-[6px] sm:gap-[8px] md:gap-[10px] lg:gap-[12px]",
        };
    }
  };

  const { image, categoryText, durationText, gap } = getSizeClasses();

  const getThumbnailUrl = (thumbnails, size) => {
    const sizeMap = {
      small: "medium",
      large: "maxres", // 1280×720 أو 'standard' للـ 640×480
    };
    return thumbnails?.[sizeMap[size]]?.url;
  };
  const formatDate = (dateString) => {
    const date = new Date(dateString);

    const month = date.toLocaleDateString("en-US", { month: "short" });
    const day = date.getDate();
    const year = date.getFullYear();

    return `${month}. ${day}, ${year}`;
  };

  return (
    <div
      onClick={() => {
        if (reportCard) {
          window.open(item?.external_link, "_blank");
          return;
        } else {
          navigate(`/videos/${item?.id}`);
        }
      }}
      className={`flex flex-col gap-[3px] sm:gap-[4px] md:gap-[4px] lg:gap-[4px] items-start w-full ${rounded ? "rounded-xl" : ""}`}
    >
      <div
        className={`${image} ${rounded ? "rounded-xl" : ""} relative  shrink-0 overflow-hidden cursor-pointer group`}
      >
        <img
          className={` w-full h-full object-cover pointer-events-none transition-transform duration-300 group-hover:scale-105`}
          alt={item?.title}
          src={
            reportCard
              ? item?.image
              : getThumbnailUrl(item?.thumbnail_url, size)
          }
        />

        {/* Play Button Overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="w-10 sm:w-12 md:w-14 lg:w-16 h-10 sm:h-12 md:h-14 lg:h-16 bg-white bg-opacity-90 rounded-full flex items-center justify-center">
            <svg
              className="w-4 sm:w-5 md:w-5 lg:w-6 h-4 sm:h-5 md:h-5 lg:h-6 text-black ml-1"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Start Category Name && Duration */}
      <div
        className={`flex ${gap} items-center w-full flex justify-between mt-0.5 mx-0.5 sm:mx-1 px-4 lg:px-0 ${textClassName}`}
      >
        {/* make first letter uppercase */}
        <p
          className={`font-['Noto_Sans_TC:Regular',sans-serif] font-bold   ${categoryText} text-[#081945]  `}
        >
          {reportCard
            ? item?.category?.title?.charAt(0).toUpperCase() +
              item?.category?.title?.slice(1)
            : item?.category?.name?.charAt(0).toUpperCase() +
              item?.category?.name?.slice(1)}
        </p>
        {textClassName && <span className="mb-2">|</span>}
        <p
          className={`font-['Noto_Sans_TC:Regular',sans-serif] font-normal mb-1   ${durationText} text-[#081945]`}
        >
          {reportCard
            ? heroReportCard
              ? formatDate(item?.happened_at)
              : item?.duration
            : item?.duration}
        </p>
      </div>
      {/* End Category Name && Duration */}
      {showDate && (
        <div className="mx-1 -mt-1 px-4 lg:px-0">
          <p className="text-[11px] sm:text-[12px] md:text-[13px] lg:text-[14px] text-[#285688]">
            {formatDate(item?.happened_at)}
          </p>
        </div>
      )}
    </div>
  );
};

export default VideoCard;
