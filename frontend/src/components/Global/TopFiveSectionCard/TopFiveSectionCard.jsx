import React, { useState } from "react";

import { useNavigate } from "react-router-dom";
import { createPortal } from "react-dom";

import { useIsMobile } from "@/hooks/use-mobile";
import VideoDetailsContent from "@/pages/Videos/VideoDetails/VideoDetailsContent";

import Modal from "../Modal/Modal";

function TopFiveSectionCard({ item, index }) {
  const isMobile = useIsMobile();
  const [openDetailsVideoModal, setOpenDetailsVideoModal] = useState(false);
  const navigate = useNavigate();
  return (
    <div
      onClick={() => {
        if (item.report_type === "videos") {
          setOpenDetailsVideoModal(true);
          return;
        }
        let router = "";
        if (item.report_type === "videos") {
          router = `/events/video/${item.id}`;
        } else if (item.report_type === "reports") {
          router = `/events/report/${item.id}`;
        } else if (item.video_type === "videos") {
          router = `/videos/${item.id}`;
        } else if (item.content_type === "content") {
          router = `/contents/content/${item.id}`;
        } else {
          router = `/cards-photos/card/${item.id}`;
        }
        navigate(router);
      }}
      key={item?.id}
      className="  group cursor-pointer transform hover:scale-105 transition-all duration-300 flex items-center gap-1"
    >
      {/* Start Number */}
      <div className="relative z-20 flex-shrink-0 -mr-4">
        <div className="relative">
          <span
            className={` text-7xl md:text-8xl font-black leading-none  `}
            style={{
              WebkitTextStroke: "3px white",
              WebkitTextFillColor: "transparent",
              fontFamily: "Arial Black, sans-serif",
              marginLeft: isMobile ? "0px" : "-1rem",
            }}
          >
            {+index + 1}
          </span>
          <span
            className="absolute top-1 -left-0 md:-left-4 text-8xl md:text-9xl font-black leading-none text-black/20 -z-10"
            style={{
              fontFamily: "Arial Black, sans-serif",
            }}
          >
            {+index + 1}
          </span>
        </div>
      </div>
      {/* End Number */}

      <div className="flex-1 relative z-10">
        <div className="relative w-full 2xl:w-[200px] h-40 lg:h-[180px] rounded-lg overflow-hidden shadow-2xl bg-gray-900">
          <img
            src={
              item?.report_type === "videos" || item?.video_type
                ? item?.thumbnail || item?.thumbnail_url
                : item?.image || item?.image_url
            }
            alt={item?.title}
            className="w-full h-full  group-hover:scale-110 transition-transform duration-700 ease-out object-cover"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20" />

          <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-white/10 to-transparent" />
          <div className={`absolute bottom-2 left-2 `}>
            <h3 className="font-bold text-lg md:text-xl line-clamp-2 leading-tight mb-2 text-white">
              {item?.title}
            </h3>
          </div>
          {/* Start Content */}
          <div className="absolute bottom-7 left-0 right-0 p-4">
            <div className="text-white">
              {/* {item?.category?.id && (
                <div className="text-xs font-medium text-gray-300 mb-1 uppercase tracking-wide opacity-80">
                  {item?.category?.name}
                </div>
              )} */}

              <p className="text-gray-300 text-sm line-clamp-2 leading-relaxed opacity-90">
                {item?.language}
              </p>
            </div>
          </div>
          {/* End Content */}

          {/* Start Play Icon */}
          {item?.report_type === "videos" || item?.video_type ? (
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500">
              <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/30 transform scale-50 group-hover:scale-100 transition-all duration-500">
                <div className="w-0 h-0 border-l-[18px] border-l-white border-t-[11px] border-t-transparent border-b-[11px] border-b-transparent ml-1" />
              </div>
            </div>
          ) : (
            ""
          )}
          {/* End Play Icon */}

          {/* Inside Blur */}
          <div className="absolute inset-0 shadow-inner" />
        </div>
      </div>
      {openDetailsVideoModal &&
        createPortal(
          <VideoDetailsContent
            isOpen={openDetailsVideoModal}
            onClose={() => setOpenDetailsVideoModal(false)}
            videoData={item}
          />,
          document.body
        )}
    </div>
  );
}

export default TopFiveSectionCard;
