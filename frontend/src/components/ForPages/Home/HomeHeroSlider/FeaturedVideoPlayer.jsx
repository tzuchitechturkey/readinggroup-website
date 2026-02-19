import React from "react";

import { Play } from "lucide-react";

export default function FeaturedVideoPlayer({
  videoId = "iUF3p_l1DfY",
  title = "Featured Video",
  description = "Watch our latest featured video",
  item = {},
  t,
  navigate,
}) {
  return (
    <div className="w-full relative h-[50vh] sm:h-[60vh] md:h-[70vh] lg:h-[92vh]">
      <div className="relative w-full h-full overflow-hidden shadow-2xl group">
        {/* Video Container */}
        <div className="absolute inset-0 bg-black">
          <img
            src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
            alt={title}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />

          {/* Overlay Gradient */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `
                    linear-gradient(
                        to right,
                        rgba(27,45,88,1) 0%,
                        rgba(27,45,88,1) 25%,
                        rgba(27,45,88,0.7) 50%,
                        rgba(27,45,88,0.4) 75%
                    )
                    `,
            }}
          />

          {/* Play Button - Responsive Positioning */}
          <button
            onClick={() => navigate(`/videos/details/${item.id}`)}
            className="absolute bottom-20 lg:top-1/2 right-1/2 lg:right-1/4 sm:right-1/3 md:right-1/3 transform -translate-y-1/2 flex items-center justify-center hover:opacity-100 transition-opacity z-10"
            aria-label="Play video"
          >
            <div className="bg-black rounded-full border-[1px] border-white p-2 sm:p-3 md:p-4 transition-all hover:scale-110 shadow-lg">
              <Play className="h-5 w-5 sm:h-6 sm:w-6 md:h-8 md:w-8 lg:h-9 lg:w-9 fill-white text-white" />
            </div>
          </button>

          {/* Info Text - Responsive Layout */}
          <div className="absolute top-1/3 lg:top-1/2 left-4 sm:left-6 md:left-8 lg:left-32 transform -translate-y-1/2 flex flex-col p-4 sm:p-6 md:p-8 max-w-xs sm:max-w-sm md:max-w-lg lg:max-w-full">
            {/* NEW Badge */}
            {!item?.is_new && (
              <span className="border-[1px] border-white text-white font-normal px-2 py-1 rounded-full mb-2 sm:mb-3 md:mb-4 w-fit text-xs sm:text-sm">
                {t("New")}
              </span>
            )}

            {/* Title and Description */}
            <div className="text-white">
              <h2 className="text-base sm:text-xl md:text-3xl lg:text-4xl font-bold mb-1 sm:mb-2 md:mb-4 line-clamp-3 sm:line-clamp-2 lg:line-clamp-none">
                {title}
              </h2>
              <p className="max-w-xl text-xs sm:text-sm md:text-base text-white/80 my-2 sm:my-4 md:my-6 lg:my-7 line-clamp-2 sm:line-clamp-3 lg:line-clamp-none">
                {description}
              </p>
            </div>

            {/* Watch Button */}
            <button className="bg-white text-primary hover:text-white hover:bg-primary rounded-lg px-3 sm:px-4 md:px-5 py-1.5 sm:py-2 md:py-2.5 text-xs sm:text-sm md:text-base font-medium transition-colors hover:bg-primary/90 w-fit">
              {t("Watch")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
