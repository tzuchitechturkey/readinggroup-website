import React from "react";

import { Play } from "lucide-react";

export default function FeaturedVideoPlayer({ item = {}, t, navigate }) {
  return (
    <div className="w-full relative h-[50vh] sm:h-[60vh] md:h-[70vh] lg:h-[92vh]">
      <div className="relative w-full h-full overflow-hidden shadow-2xl group">
        {/* Video Container */}
        <div className="absolute inset-0 bg-black">
          <img
            src={`${item?.thumbnail_url || "/assets/default-thumbnail.jpg"}`}
            alt={item?.title || "Video Thumbnail"}
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
            <div className="bg-black rounded-full border-[4px] border-white p-2 sm:p-3 md:p-4 md:px-5 transition-all hover:scale-110 shadow-lg">
              {/* <Play className="h-5 w-5 sm:h-6 sm:w-6 md:h-8 md:w-8 lg:h-9 lg:w-9 fill-white text-white" /> */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="21"
                height="26"
                viewBox="0 0 21 26"
                fill="none"
              >
                <path
                  d="M0 24.2794V1.5807C0.000472611 1.2967 0.0773215 1.01806 0.222496 0.773966C0.367671 0.529876 0.575827 0.329325 0.825149 0.193332C1.07447 0.0573379 1.35578 -0.00909252 1.6396 0.0010004C1.92342 0.0110933 2.1993 0.0973374 2.43833 0.250697L20.0957 11.5969C20.3192 11.7401 20.5032 11.9373 20.6306 12.1703C20.758 12.4032 20.8248 12.6645 20.8248 12.93C20.8248 13.1956 20.758 13.4568 20.6306 13.6898C20.5032 13.9228 20.3192 14.1199 20.0957 14.2632L2.43833 25.6125C2.1993 25.7659 1.92342 25.8521 1.6396 25.8622C1.35578 25.8723 1.07447 25.8059 0.825149 25.6699C0.575827 25.5339 0.367671 25.3334 0.222496 25.0893C0.0773215 24.8452 0.000472611 24.5665 0 24.2825V24.2794Z"
                  fill="white"
                />
              </svg>
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
            <div className="text-white w-2/5">
              <h2 className="text-base sm:text-xl md:text-3xl lg:text-4xl font-bold mb-1 sm:mb-2 md:mb-4 line-clamp-3 sm:line-clamp-2 lg:line-clamp-none lg:leading-[50px]">
                {item?.title}
              </h2>
              <div className="mb-5 uppercase flex items-center  gap-1 text-[#FCFDFF] opacity-80">
                <p className=""> {t("Full Livestream")} </p>|
                <span>
                  {item?.happened_at
                    ? new Date(item.happened_at).toLocaleDateString("en-US", {
                        month: "short",
                        day: "2-digit",
                        year: "numeric",
                      })
                    : ""}
                </span>
              </div>
            </div>

            {/* Start Watch Button */}
            <button className="bg-white flex items-center gap-1   rounded-lg px-3 md:px-6 py-3 w-fit">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M5 3L19 12L5 21V3Z"
                  stroke="white"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M5 3L19 12L5 21V3Z"
                  stroke="#285688"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
              <span className="text-primary">{t("Watch")}</span>
            </button>
            {/* End Watch Button */}
          </div>
        </div>
      </div>
    </div>
  );
}
