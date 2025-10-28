import React, { useState } from "react";

import { useTranslation } from "react-i18next";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";

import VideoDetailsContent from "@/pages/Videos/VideoDetails/VideoDetailsContent";

function ExternalNewsCard({ className = "", item }) {
  const { t } = useTranslation();
  const [openDetailsVideoModal, setOpenDetailsVideoModal] = useState(false);
  const navigate = useNavigate();

  return (
    <div
      onClick={() => {
        if (item.report_type === "videos") {
          setOpenDetailsVideoModal(true);
        } else {
          navigate(`/events/${item.id}`);
        }
      }}
      className={`group cursor-pointer transform hover:scale-105 transition-all duration-300 h-full ${className}`}
    >
      <div className="bg-gray-900 rounded-xl overflow-hidden shadow-lg h-full">
        <div className="relative h-full flex-shrink-0">
          {/* Start Image */}
          <img
            src={item.image}
            alt={item.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {/* End Image */}

          {/* Start Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent" />
          {/* End Gradient Overlay */}

          {/* Start Tags */}
          {Array.isArray(item?.tags) && item?.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {item?.tags.map((t, i) => (
                <span
                  key={`${t}-${i}`}
                  className={`px-2 sm:px-3 py-1 bg-transparent ${
                    i === 0 ? "border-[1px] border-text" : ""
                  } text-xs sm:text-sm rounded-full`}
                >
                  {t}
                </span>
              ))}
            </div>
          )}
          {/* End Tags */}

          {/* Start Tag */}
          <div className="absolute top-5 left-5 flex items-center gap-3">
            <span className="bg-blue-500 rounded-full text-white text-xs font-semibold px-3 py-2 backdrop-blur-sm">
              {t(item?.category?.name)}
            </span>
          </div>
          {/* End Tag */}

          {/* Start Title */}
          <div className="absolute bottom-6 left-3">
            <h3 className="text-white font-semibold text-lg group-hover:text-blue-400 transition-colors">
              {item.title}
            </h3>
          </div>
          {/* End Title */}
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

export default ExternalNewsCard;
