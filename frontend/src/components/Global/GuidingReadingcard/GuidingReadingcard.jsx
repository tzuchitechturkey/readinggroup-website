import React from "react";

import { useNavigate } from "react-router-dom";
import { Star, User } from "lucide-react";

function GuidingReadingcard({ item, showTags = true, fromContent = false }) {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(fromContent ?`/contents/content/${item?.id}`: `/cards-photos/card/${item?.id}`);
  };
  return (
    <div
      key={item?.id}
      onClick={handleCardClick}
      className="rounded-xl max-w-[40 0px]  group cursor-pointer border border-gray-100 relative"
    >
      {/* Start Tag" */}
      <div className="absolute z-10 top-3 left-3">
        {showTags && item?.tags && item?.tags.length > 0 && (
          <div>
            <div className="flex flex-wrap gap-2">
              {item?.tags.map((tag, index) => (
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

      <div className="text-center relative transform hover:scale-105 transition-all duration-300">
        <img
          src={
            item?.post_type
              ? item?.image || item?.image_url
              : item?.images[0]?.image || item?.image_url
          }
          alt="Chinese Text"
          className=" w-full h-[220px] rounded-lg "
        />

        <div className="absolute bottom-3 right-3">
          <User className="w-4 h-4 text-gray-400" />
        </div>
      </div>

      {/* Start Title */}
      <h3 className=" px-2 font-semibold text-gray-800 text-sm mb-3 leading-tight my-1">
        {item?.title?.length > 25
          ? item?.title?.slice(0, 25) + "..."
          : item?.title}
      </h3>
      {/* End Title */}

      {/* Start Rating && Writer */}
      <div className="flex items-end justify-between pb-3 px-2">
        {/* Start Writer */}
        <div className="flex items-center justify-center gap-1 text-xs text-teal-600">
          <User className="w-3 h-3" />
          <span>{item?.writer}</span>
        </div>
        {/* End Writer */}
        {/* Start Rating  */}
        <div className="flex flex-col items-end justify-center gap-2 ">
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-3 h-3 ${
                  i < Math.floor(item?.average_rating)
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-gray-300"
                }`}
              />
            ))}
          </div>
          <span className="text-xs text-gray-600">({item?.rating_count}k)</span>
        </div>
        {/* Start Rating  */}
      </div>
      {/* End Rating && Writer */}
    </div>
  );
}

export default GuidingReadingcard;
