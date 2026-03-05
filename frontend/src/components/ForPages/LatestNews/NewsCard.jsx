import React from "react";

import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const NewsCard = ({ news, t }) => {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate(`/latest-news/${news.id}`);
  };

  return (
    <div
      onClick={handleNavigate}
      className="group cursor-pointer  rounded-lg overflow-hidden  transition-shadow flex gap-3 md:gap-6"
    >
      {/* Start Image */}
      <div className="relative w-[480px] h-[270px] flex-shrink-0 overflow-hidden  rounded">
        <img
          src={news?.image || news?.image_url}
          alt={news.title}
          className="w-full h-full object-cover  "
          loading="lazy"
        />
      </div>
      {/* End Image */}
      {/* Start Content */}
      <div className="flex-1 py-2 md:py-4 pr-3 md:pr-4 flex flex-col gap-4">
        {/* Start Is New */}
        <div className="px-3 py-1 w-fit rounded-full border-[1px] border-[#081945]">
          <p className="text-[#081945]">{t("NEW")}</p>
        </div>
        {/* End Is New */}
        <div>
          {news.happened_at && (
            <span className="inline-block  text-[#081945] text-[10px] md:text-lg font-bold rounded mb-1">
              {new Date(news.happened_at).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          )}
          <h3 className="font-bold text-[#081945] text-sm md:text-2xl line-clamp-2">
            {news.title}
          </h3>
        </div>
        <p className="text-xs md:text-base text-[#285688] line-clamp-2">
          {news.description}
        </p>
        {/* Start Button */}
        <button
          className="w-fit flex items-center gap-1 rounded-md px-4 py-2 bg-[#285688] text-white"
          onClick={() => {
            handleNavigate(news.id);
          }}
        >
          <span>{t("Read More")}</span>
          <ArrowRight />
        </button>
        {/* End Button */}
      </div>
    </div>
  );
};

export default NewsCard;
