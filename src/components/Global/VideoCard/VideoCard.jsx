import React from "react";

import { Play, Clock, Eye } from "lucide-react";
import { Link } from "react-router-dom";

const VideoCard = ({ item, showUnit = false }) => (
  <Link
    to={`/videos/details/${item.id}`}
    className="group cursor-pointer transform hover:scale-105 transition-all duration-300 h-full"
  >
    <div className="bg-gray-900 rounded-xl overflow-hidden shadow-lg  ">
      <div className="relative  flex-shrink-0 ">
        {/* Start Image */}
        <img
          src={item.image}
          alt={item.title}
          className="w-full h-[175px] object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {/* End Image */}

        {/* Start Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t h-44 from-gray-900 via-transparent to-transparent" />
        {/* End Gradient Overlay */}

        {/* Start Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          {showUnit && (
            <span className="bg-blue-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
              {item.unit}
            </span>
          )}
        </div>
        {/* ENdStart Badges */}

        {/* Start Duration */}
        <div className="absolute top-3 left-3 flex items-center gap-3">
          <span className="bg-[#8A9097] rounded-full text-white text-xs font-semibold px-2 py-1   backdrop-blur-sm">
            Weekly Feature
          </span>
          <span className="bg-[#8A9097] rounded-full text-white text-xs font-semibold px-2 py-1   backdrop-blur-sm">
            {item.duration}
          </span>
        </div>
        {/* End Duration */}

        {/* Start Title */}
        <div className="absolute bottom-6 left-3 flex items-center gap-3">
          <h3 className="text-white font-semibold text-sm group-hover:text-blue-400 transition-colors">
            {item.title}
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
  </Link>
);

export default VideoCard;
