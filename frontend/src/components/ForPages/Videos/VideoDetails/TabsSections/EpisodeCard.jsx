import React from "react";

import { Play } from "lucide-react";
import { Link } from "react-router-dom";

const EpisodeCard = ({ episode, index }) => {
  return (
    <div className="flex items-start gap-4 py-1 lg:p-4 hover:bg-gray-50 rounded-lg transition-colors duration-200">
      {/* Episode Number */}
      <div className="flex-shrink-0 w-8 text-center b">
        <span className="text-lg font-medium text-gray-700">{index + 1}</span>
      </div>

      {/* Episode Thumbnail */}
      <div className="flex-shrink-0 relative">
        <div className="w-24 h-16 sm:w-32 sm:h-20 md:w-40 md:h-24 rounded-lg overflow-hidden bg-gray-200">
          <img
            src={episode.thumbnail || episode.thumbnail_url}
            alt={episode.title}
            className="w-full h-full object-cover"
          />
          {/* Play Button Overlay */}
          <Link
            to={`/videos/${episode.id}`}
            className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 opacity-0 hover:opacity-100 transition-opacity duration-200"
          >
            <div className="w-8 h-8 bg-white bg-opacity-80 rounded-full flex items-center justify-center">
              <Play className="w-4 h-4 text-gray-700 fill-current ml-0.5" />
            </div>
          </Link>
        </div>
      </div>

      {/* Episode Details */}
      <div className="flex-1 min-w-0">
        <Link
          to={`/videos/details/${episode.id}`}
          className="block hover:text-blue-600 transition-colors duration-200"
        >
          <h3 className="font-medium text-gray-900 text-sm sm:text-base mb-1 line-clamp-1">
            {episode.title}
          </h3>
        </Link>
        <p className="text-gray-600 text-xs sm:text-sm mb-2 line-clamp-2">
          {episode.description}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-gray-500 text-xs sm:text-sm">
            {episode.duration}
          </span>
        </div>
      </div>
    </div>
  );
};

export default EpisodeCard;
