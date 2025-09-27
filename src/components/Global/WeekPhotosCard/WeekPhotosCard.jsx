import React from "react";

function WeekPhotosCard({ item }) {
  return (
    <div className=" mx-auto">
      <div
        key={item.id}
        className="group cursor-pointer transform hover:scale-105 transition-all duration-300"
      >
        {/* البطاقة */}
        <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
          {/* Start Image */}
          <div className="relative aspect-square ">
            <img
              src={item.image}
              alt={item.title}
              className="w-full h-[300px]  rounded-xl object-cover group-hover:scale-110 transition-transform duration-300"
            />
            {/* Start Image */}
            {/* Start blur background */}
            <img
              src="../../../src/assets/blur-weekly-images.png"
              alt="blur"
              className="w-full h-full absolute top-0 left-0 z-1"
            />
            {/* End Blur background */}
            {/* Start Content */}
            <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 text-center w-full">
              <p className="font-bold text-lg text-[#ffffffcf]  ">
                Alexander Bastian
              </p>
              <p className="font-bold text-xs text-[#ffffffcf] mt-1">
                Expert Mobile Engineer
              </p>
            </div>

            {/* End Content */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default WeekPhotosCard;
