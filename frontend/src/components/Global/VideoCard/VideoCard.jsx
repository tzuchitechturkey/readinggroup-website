import React from "react";

const VideoCard = ({
  item,
  size = "default",
  navigate,
  showDate = false,
  rounded = false,
}) => {
  const getSizeClasses = () => {
    switch (size) {
      case "large":
        return {
          container:
            "w-full sm:w-[95%] md:w-[90%]  h-auto sm:h-[200px]   md:h-[300px] lg:h-[450px]",
          image:
            "h-[200px] sm:h-[200px] md:h-[300px] lg:h-[450px] w-full sm:w-[95%] md:w-[90%] lg:w-full",
          titleHeight: "h-[30px] sm:h-[32px] md:h-[34px] lg:h-[35px]",
          categoryText:
            "text-[14px] sm:text-[15px] md:text-[16px] lg:text-[18px]",
          durationText:
            "text-[13px] sm:text-[14px] md:text-[15px] lg:text-[16px]",
          gap: "gap-[8px] sm:gap-[10px] md:gap-[12px] lg:gap-[12px]",
        };
      case "medium":
        return {
          container:
            "w-full sm:w-[48%] md:w-[45%] lg:w-[554px] h-auto sm:h-[120px] md:h-[160px] lg:h-[199px]",
          image:
            "h-[150px] sm:h-[120px] md:h-[160px] lg:h-[199px] w-full sm:w-[48%] md:w-[45%] lg:w-[554px]",
          titleHeight: "h-[25px] sm:h-[26px] md:h-[28px] lg:h-[30px]",
          categoryText:
            "text-[12px] sm:text-[13px] md:text-[14px] lg:text-[18px]",
          durationText:
            "text-[12px] sm:text-[13px] md:text-[14px] lg:text-[16px]",
          gap: "gap-[6px] sm:gap-[8px] md:gap-[10px] lg:gap-[12px]",
        };
      case "small":
        return {
          container: "w-full sm:w-[48%] md:w-[45%] lg:w-[290px]  h-[199px]",
          image: "h-[199px] w-full sm:w-[48%] md:w-[45%] lg:w-[290px]",
          titleHeight: "h-[25px] sm:h-[26px] md:h-[28px] lg:h-[30px]",
          categoryText:
            "text-[12px] sm:text-[13px] md:text-[14px] lg:text-[18px]",
          durationText:
            "text-[12px] sm:text-[13px] md:text-[14px] lg:text-[16px]",
          gap: "gap-[6px] sm:gap-[8px] md:gap-[10px] lg:gap-[12px]",
        };
      default:
        return {
          container:
            "w-full sm:w-[48%] md:w-[45%] h-auto sm:h-[120px] md:h-[160px] lg:h-[199px]",
          image:
            "h-[150px] sm:h-[120px] md:h-[160px]  lg:h-[199px] w-full  sm:w-[48%] md:w-[45%] ",
          titleHeight: "h-[30px] sm:h-[32px] md:h-[34px] lg:h-[35px]",
          categoryText:
            "text-[12px] sm:text-[13px] md:text-[14px] lg:text-[18px]",
          durationText:
            "text-[12px] sm:text-[13px] md:text-[14px] lg:text-[16px]",
          gap: "gap-[8px] sm:gap-[10px] md:gap-[12px] lg:gap-[12px]",
        };
    }
  };

  const { image, categoryText, durationText, gap } = getSizeClasses();

  return (
    <div
      onClick={() => navigate(`/videos/${item.id}`)}
      className={`flex flex-col gap-[3px] sm:gap-[4px] md:gap-[4px] lg:gap-[4px] items-start w-full ${rounded ? "rounded-xl" : ""}`}
    >
      <div
        className={`${image} ${rounded ? "rounded-xl" : ""} relative shrink-0 overflow-hidden cursor-pointer group`}
      >
        <img
          alt={item.title}
          className="absolute inset-0 w-full h-full object-cover pointer-events-none transition-transform duration-300 group-hover:scale-105"
          src={item.thumbnail || item.thumbnail_url}
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
        className={`flex ${gap} items-center w-full flex justify-between mt-0.5 sm:mt-1 mx-0.5 sm:mx-1 px-4 lg:px-0`}
      >
        <p
          className={`font-['Noto_Sans_TC:Regular',sans-serif] font-normal leading-[1.5] ${categoryText} text-black uppercase`}
        >
          {item.category?.name}
        </p>
        <p
          className={`font-['Noto_Sans_TC:Regular',sans-serif] font-normal leading-[1.5] ${durationText} text-[#081945]`}
        >
          {item.duration}
        </p>
      </div>
      {/* End Category Name && Duration */}
      {showDate && (
        <div className="mx-1 -mt-1 px-4 lg:px-0">
          <p className="text-[11px] sm:text-[12px] md:text-[13px] lg:text-[14px] text-[#285688]">
            {item?.happened_at}
          </p>
        </div>
      )}
    </div>
  );
};

export default VideoCard;
