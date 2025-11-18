import React, { useState } from "react";

import { createPortal } from "react-dom";
import { Play } from "lucide-react";
import { useTranslation } from "react-i18next";

import VideoDetailsContent from "@/pages/Videos/VideoDetails/VideoDetailsContent";

const VideoCard = ({ item, bigCart, className = "" }) => {
  const { t, i18n } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCardClick = (e) => {
    e.preventDefault();
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <div
        onClick={handleCardClick}
        className={`group cursor-pointer transform hover:scale-105   transition-all duration-300 h-full ${className}`}
      >
        <div className="bg-gray-900 rounded-xl overflow-hidden shadow-lg h-full">
          <div
            className={` relative ${
              bigCart ? "h-[280px]" : "h-[200px]"
            }  flex-shrink-0`}
          >
            {/* Start Image */}
            <img
              src={
                item?.thumbnail ||
                item?.thumbnail_url ||
                item?.image ||
                item?.image_url
              }
              alt={item?.title}
              title={item?.title || "video"}
              loading="lazy"
              className="w-full h-full border border-red-900 object-cover group-hover:scale-105 transition-transform duration-300"
            />
            {/* End Image */}

            {/* Start Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent" />
            {/* End Gradient Overlay */}

            {/* Start Tags */}
            {/* <div className="absolute top-14 left-5 flex gap-2">
              {item?.tags?.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {item?.tags?.slice(0, 2).map((tag, index) => (
                    <span key={index} className="px-1 py-1 text-white">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div> */}
            {/* End Tags */}

            {/* Start Is new */}
            {item?.is_new && (
              <span className="absolute top-4 right-3 bg-blue-500 border border-white/20 rounded-xl px-4 py-1 text-white text-xs font-semibold backdrop-blur-sm fast-pulse">
                {t("New")}
              </span>
            )}
            {/* Start Is new */}
            {/* {item?.is_featured && (
              <span className="absolute bottom-16 left-7 bg-blue-500 border border-white/20 rounded-xl px-4 py-1 text-white text-xs font-semibold backdrop-blur-sm">
                {t("Featured")}
              </span>
            )} */}
            {/* End Is New */}

            {/* Start Duration */}
            <div className="absolute top-4 left-5 flex items-center gap-3">
              <span className="bg-black/40 border border-white/20 rounded-xl px-4 py-1 text-white text-sm font-medium backdrop-blur-sm">
                {t(item?.category?.name)}
              </span>
            </div>
            {/* Video Duration at bottom right */}

            {/* End Duration */}

            {/* Start Title */}
            <div
              className={`absolute bottom-6 ${
                i18n?.language === "ar" ? "right-7" : "left-7"
              } px-2`}
            >
              <h3 className="text-white font-extrabold text-2xl group-hover:text-blue-400 transition-colors drop-shadow-lg">
                {item?.title}
              </h3>
            </div>

            {/* End Title */}

            {/* Start Play Icon */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <Play className="w-8 h-8 text-white fill-white" />
              </div>
            </div>
            {/* End Play Icon */}
          </div>
        </div>
      </div>

      {/* Video Details Modal - Using Portal to render outside normal DOM hierarchy */}
      {isModalOpen &&
        createPortal(
          <VideoDetailsContent
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            videoData={item}
          />,
          document.body
        )}
    </>
  );
};

export default VideoCard;
