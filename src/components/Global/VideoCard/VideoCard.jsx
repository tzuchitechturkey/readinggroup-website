import React from "react";

import { Play } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const VideoCard = ({ item, showUnit = false, className = "" }) => {
  const { t } = useTranslation();

  return (
    <Link
      to={`/videos/details/${item.id}`}
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

          {/* Start Badges */}
          <div className="absolute top-3 left-3 flex gap-2">
            {showUnit && (
              <span className="bg-blue-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
                {item.unit}
              </span>
            )}
          </div>

          {/* Start Duration */}
          <div className="absolute top-5 left-5 flex items-center gap-3">
            <span className="bg-blue-500 rounded-full text-white text-xs font-semibold px-3 py-2 backdrop-blur-sm">
              {t("Weekly Feature")}
            </span>
            <span className="bg-blue-500 rounded-full text-white text-xs font-semibold px-3 py-2 backdrop-blur-sm">
              {item.duration}
            </span>
          </div>

          {/* Start Title */}
          <div className="absolute bottom-6 left-3">
            <h3 className="text-white font-semibold text-sm group-hover:text-blue-400 transition-colors">
              {item.title}
            </h3>
          </div>

          {/* Start Play Icon */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <Play className="w-8 h-8 text-white fill-white" />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default VideoCard;
