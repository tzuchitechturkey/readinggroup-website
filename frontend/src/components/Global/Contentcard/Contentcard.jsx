import React from "react";

import { useNavigate } from "react-router-dom";
import { Star, User } from "lucide-react";

function GuidingReadingcard({ item, showTags = true, fromContent = false }) {
  const [showAllTags, setShowAllTags] = React.useState(false);
  const handleShowMoreTags = (e) => {
    e.stopPropagation();
    setShowAllTags(true);
  };
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(
      fromContent
        ? `/contents/content/${item?.id}`
        : `/cards-photos/card/${item?.id}`
    );
  };

  return (
    <div
      key={item?.id}
      onClick={handleCardClick}
      className="rounded-2xl w-full max-w-[300px] mx-auto group cursor-pointer border border-gray-100 bg-white shadow-sm hover:shadow-lg transition-shadow duration-300 relative"
    >
      {/* Start Tag" */}
      <div className="absolute z-10 top-3 left-3">
        {showTags && item?.tags && item?.tags.length > 0 && (
          <div>
            <div className="flex flex-wrap gap-2">
              {((showAllTags ? item?.tags : item?.tags)?.length
                ? showAllTags
                  ? item.tags
                  : item.tags.slice(0, 3)
                : []
              ).map((tag, index) => (
                <span
                  key={index}
                  className="px-4 py-1 bg-black/40 border border-white/20 rounded-xl text-white text-sm font-semibold backdrop-blur-sm"
                >
                  #{tag}
                </span>
              ))}
              {!showAllTags && item?.tags.length > 3 && (
                <button
                  onClick={handleShowMoreTags}
                  className="px-4 py-1 bg-gradient-to-r from-blue-500 via-blue-400 to-blue-600 border-2 border-yellow-300 rounded-xl text-white text-sm font-bold shadow-md backdrop-blur-sm hover:scale-105 transition-transform"
                  style={{ minWidth: "90px" }}
                >
                  عرض المزيد
                </button>
              )}
            </div>
          </div>
        )}
      </div>
      {/* Start Tag" */}

      <div className="relative w-full h-[170px] overflow-hidden rounded-2xl">
        <img
          src={
            item?.post_type
              ? item?.image || item?.image_url
              : item?.images[0]?.image || item?.image_url
          }
          alt="card-img"
          loading="lazy"
          title={item?.title || "card image"}
          className="absolute inset-0 w-full h-full object-cover rounded-2xl"
        />
        <div className="absolute bottom-3 right-3">
          <User className="w-4 h-4 text-gray-400" />
        </div>
      </div>

      {/* Start Title */}
      <h3 className="px-3 font-bold text-xl text-gray-900 mb-2 leading-snug mt-2 drop-shadow-md tracking-tight text-right">
        {item?.title}
      </h3>
      {/* End Title */}

      {/* Start Rating && Writer */}
      <div className="flex items-center justify-between pb-3 px-3">
        {/* Start Writer */}
        <div className="flex items-center gap-1 text-base text-teal-700 font-bold">
          <User className="w-5 h-5" />
          <span>{item?.writer}</span>
        </div>
        {/* End Writer */}
        {/* Start Rating  */}
        <div className="flex flex-col items-end justify-center gap-1">
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-5 h-5 ${
                  i < Math.floor(item?.average_rating)
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-gray-300"
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-gray-700 font-bold">
            ({item?.rating_count}k)
          </span>
        </div>
        {/* Start Rating  */}
      </div>
      {/* End Rating && Writer */}
    </div>
  );
}

export default GuidingReadingcard;
