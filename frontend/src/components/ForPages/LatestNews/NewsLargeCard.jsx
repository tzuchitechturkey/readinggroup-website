import React from "react";

import { useNavigate } from "react-router-dom";
import { ChevronRight } from "lucide-react";

const NewsLargeCard = ({ news }) => {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate(`/latest-news/${news.id}`);
  };

  return (
    <div
      onClick={handleNavigate}
      className="group cursor-pointer bg-white rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
    >
      <div className="flex flex-col md:flex-row gap-4">
        {/* Image Left */}
        <div className="w-full md:w-1/3 h-48 md:h-auto overflow-hidden bg-gray-200">
          <img
            src={news?.images?.[0]?.image || news?.image_url}
            alt={news.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        </div>

        {/* Content Right */}
        <div className="flex-1 p-4 md:p-6 flex flex-col justify-between">
          {news.happened_at && (
            <span className="inline-block bg-[#E8F1F7] text-[#285688] text-xs px-3 py-1 rounded-full w-fit mb-3">
              {new Date(news.happened_at).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          )}

          <div className="flex-1">
            <h2 className="font-black text-[#081945] text-xl md:text-2xl mb-3 line-clamp-3">
              {news.title}
            </h2>
            <p className="text-[#285688] text-sm md:text-base leading-relaxed line-clamp-3">
              {news.description}
            </p>
          </div>

          <button className="inline-flex items-center gap-2 mt-4 bg-[#285688] hover:bg-[#1e3f5a] text-white px-4 py-2 rounded-lg font-semibold transition-colors text-sm">
            Read more
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewsLargeCard;
