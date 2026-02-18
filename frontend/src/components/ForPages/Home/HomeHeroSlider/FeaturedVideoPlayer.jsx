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
    <div className="w-full relative h-[92vh]">
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

          {/* Play Button */}
          <button
            onClick={() => navigate(`/videos/details/${item.id}`)}
            className="absolute right-1/3 top-1/2 transform -translate-y-1/2 flex items-center justify-center hover:opacity-100 transition-opacity"
            aria-label="Play video"
          >
            <div className="    ">
              <div className=" bg-black rounded-full border-[1px] border-white p-3 md:p-4 transition-all hover:scale-110 shadow-lg">
                <Play className="h-8 w-8 md:h-9 md:w-9 fill-white text-white" />
              </div>
            </div>
          </button>

          {/* Info Text */}
          <div className="absolute top-1/2 left-20 transform -translate-y-1/2 flex flex-col  p-6 md:p-8">
            {/* Start Is new */}
            {!item?.is_new && (
              <span className=" border-[1px] border-white   text-white  font-normal px-2 py-1 rounded-full mb-4 w-fit">
                {t("New")}
              </span>
            )}
            <div className="text-white w-full">
              <h2 className="text-lg md:text-4xl w-96 font-bold mb-2">
                {title}
              </h2>
              <p className="text-sm md:text-base text-white/80 my-7">
                {description}
              </p>
            </div>
            <button className="bg-white text-primary hover:text-white hover:bg-primary transition rounded-lg px-4 py-2 text-sm md:text-base font-medium hover:bg-primary/90 transition-colors w-fit">
              {t("Watch")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
