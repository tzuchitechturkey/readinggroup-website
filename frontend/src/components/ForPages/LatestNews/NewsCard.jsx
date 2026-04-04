import React from "react";

import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const NewsCard = ({ news, t, latestItem }) => {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate(`/latest-news/${news.id}`);
  };
  const formatDate = (dateString) => {
    const date = new Date(dateString);

    const month = date.toLocaleString("en-US", { month: "short" });
    const day = date.getDate();
    const year = date.getFullYear();

    return `${month}. ${day}, ${year}`;
  };
  return (
    <div
      onClick={handleNavigate}
      className={` cursor-pointer ${latestItem ? "pb-6 pt-3" : "border-b-[1px] border-[#9FB3E1] pb-6 pt-3"} overflow-hidden  transition-shadow md:flex gap-3 md:gap-6`}
    >
      {/* Start Image */}
      <div className="relative lg:w-[480px] h-[200px] lg:h-[270px] flex-shrink-0 overflow-hidden ">
        <img
          src={news?.images?.[0]?.image}
          alt={news.title}
          className="w-full h-full object-cover  "
          loading="lazy"
        />
      </div>
      {/* End Image */}
      {/* Start Content */}
      <div className="flex-1 py-3 md:py-4 pr-3 md:pr-4 flex flex-col justify-center gap-4">
        {/* Start Is New */}
        {news.is_new && (
          <div className="px-3 py-1 w-fit rounded-full text-sm md:text-base border-[1px] border-[#081945]">
            <p className="text-[#081945]">{t("NEW")}</p>
          </div>
        )}

        {/* End Is New */}
        <div>
          {news.happened_at && (
            <span className="inline-block  text-[#081945] text-sm md:text-base font-bold rounded mb-1">
              {formatDate(news.happened_at)}
            </span>
          )}
          <h3 className="font-bold text-[#081945] text-xl md:text-2xl line-clamp-2">
            {news.title}
          </h3>
        </div>
        <p className="text-sm md:text-base text-[#081945] line-clamp-2">
          {news.description}
        </p>
        {/* Start Button */}
        <button
          className="w-fit flex items-center gap-1 rounded-md px-4 py-2 bg-[#285688] text-white text-xs md:text-sm lg:text-base"
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
