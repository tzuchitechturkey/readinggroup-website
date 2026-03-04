import React from "react";

import { useNavigate } from "react-router-dom";

const NewsCard = ({ news }) => {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate(`/latest-news/${news.id}`);
  };

  return (
    <div
      onClick={handleNavigate}
      className="group cursor-pointer bg-white rounded-lg overflow-hidden hover:shadow-lg transition-shadow flex gap-3 md:gap-4"
    >
      {/* Image */}
      <div className="relative w-20 h-20 md:w-24 md:h-24 flex-shrink-0 overflow-hidden bg-gray-200 rounded">
        <img
          src={news?.images?.[0]?.image || news?.image_url}
          alt={news.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
      </div>

      {/* Content */}
      <div className="flex-1 py-2 md:py-3 pr-3 md:pr-4 flex flex-col justify-between">
        <div>
          {news.happened_at && (
            <span className="inline-block bg-[#285688] text-white text-[10px] md:text-xs px-2 py-1 rounded mb-1">
              {new Date(news.happened_at).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          )}
          <h3 className="font-bold text-[#081945] text-sm md:text-base line-clamp-2">
            {news.title}
          </h3>
        </div>
        <p className="text-xs md:text-sm text-[#285688] line-clamp-1">
          {news.description}
        </p>
      </div>
    </div>
  );
};

export default NewsCard;
