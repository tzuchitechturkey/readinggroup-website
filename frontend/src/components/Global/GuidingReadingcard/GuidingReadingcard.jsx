import React from "react";

import { useNavigate } from "react-router-dom";
import { Star, User, Tag } from "lucide-react";
import { useTranslation } from "react-i18next";

function GuidingReadingcard({ item }) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const handleCardClick = () => {
    navigate(
      `/${
        item?.post_type === "reading" ? "guiding-reading" : "cards-photos"
      }/card/${item.id}`
    );
  };
  return (
    <div
      key={item.id}
      onClick={handleCardClick}
      className="rounded-xl group cursor-pointer transform hover:scale-105 transition-all duration-300 shadow-sm hover:shadow-lg border border-gray-100 relative"
    >
      {/* Start Tag" */}
      <div className="absolute z-50 top-3 left-3">
        {item.tags && item.tags.length > 0 && (
          <div>
            {/* <h4 className="font-semibold text-[#1D2630] mb-3 flex items-center gap-2">
              <Tag className="w-4 h-4" />
              {t("Tags")}
            </h4> */}
            <div className="flex flex-wrap gap-2">
              {item.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium border border-blue-200 hover:bg-blue-100 transition-colors"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
      {/* Start Tag" */}

      <div className="text-center relative">
        <img
          src={item.image}
          alt="Chinese Text"
          className="  w-full h-[200px] rounded-lg object-cover"
        />

        <div className="absolute bottom-3 right-3">
          <User className="w-4 h-4 text-gray-400" />
        </div>
      </div>

      {/* Start Title */}
      <h3 className="font-semibold text-gray-800 text-sm mb-3 leading-tight my-1">
        {item.title.length > 25 ? item.title.slice(0, 25) + "..." : item.title}
      </h3>
      {/* End Title */}

      {/* Start Rating && Writer */}
      <div className="flex items-end justify-between pb-3">
        {/* Start Writer */}
        <div className="flex items-center justify-center gap-1 text-xs text-teal-600">
          <User className="w-3 h-3" />
          <span>{item.writer}</span>
        </div>
        {/* End Writer */}
        {/* Start Rating  */}
        <div className="flex flex-col items-end justify-center gap-2 ">
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-3 h-3 ${
                  i < Math.floor(item.rating)
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-gray-300"
                }`}
              />
            ))}
          </div>
          <span className="text-xs text-gray-600">({item.reviews}k)</span>
        </div>
        {/* Start Rating  */}
      </div>
      {/* End Rating && Writer */}
    </div>
  );
}

export default GuidingReadingcard;
