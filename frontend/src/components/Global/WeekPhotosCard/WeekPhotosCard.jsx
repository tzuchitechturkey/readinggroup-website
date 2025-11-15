import React from "react";

import { useNavigate } from "react-router-dom";

function WeekPhotosCard({ item }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/cards-photos/card/${item?.id}`);
  };

  return (
    <div className="mx-auto">
      <div
        key={item?.id}
        className="group cursor-pointer transform hover:scale-105 transition-all duration-300"
        onClick={handleClick}
      >
        {/* Card */}
        <div className="rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white">
          <div className="relative w-full h-[280px]">
            {/* Image */}
            <img
              src={item?.image || item?.image_url}
              alt={item?.title}
              className="absolute inset-0 w-full h-full object-cover"
            />

            {/* Bottom gradient overlay */}
            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />

            {/* Text overlay */}
            <div className="absolute bottom-4 left-0 right-0 px-4 z-10 text-center">
              <p className="text-white font-semibold text-[18px] leading-tight">
                {item?.title}
              </p>
              {item?.subtitle ? (
                <p className="text-white/90 text-sm mt-1">{item?.subtitle}</p>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WeekPhotosCard;
