import React from "react";

import { useNavigate } from "react-router-dom";
import { BookOpen, Star, User } from "lucide-react";

function GuidingReadingcard({ item }) {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/cards-photos/card/${item.id}`);
  };

  return (
    <div
      key={item.id}
      onClick={handleCardClick}
      className="rounded-xl group cursor-pointer transform hover:scale-105 transition-all duration-300 shadow-sm hover:shadow-lg border border-gray-100 relative"
    >
      {/* علامة "Incredible Card" */}
      <div className="absolute top-3 left-3">
        <span className="bg-teal-400 text-white text-xs font-medium px-2 py-1 rounded-md">
          {item.badge}
        </span>
      </div>

      <div className="text-center relative">
        <img
          src="../../../src/assets/azem.png"
          alt="Chinese Text"
          className="  w-full h-full rounded-lg"
        />

        <div className="absolute bottom-3 right-3">
          <User className="w-4 h-4 text-gray-400" />
        </div>
      </div>

      {/* Start Title */}
      <h3 className="font-semibold text-gray-800 text-sm mb-3  leading-tight my-1">
        {item.title}
      </h3>
      {/* End Title */}

      {/* Start Rating && Author */}
      <div className="flex items-center justify-between pb-3">
        {/* Start Author */}
        <div className="flex items-center justify-center gap-1 text-xs text-teal-600">
          <User className="w-3 h-3" />
          <span>{item.author}</span>
        </div>
        {/* End Author */}
        {/* Start Rating  */}
        <div className="flex items-center justify-center gap-2 ">
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
      {/* End Rating && Author */}
    </div>
  );
}

export default GuidingReadingcard;
