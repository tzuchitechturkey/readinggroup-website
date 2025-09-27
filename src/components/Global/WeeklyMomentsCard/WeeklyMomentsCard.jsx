import React from "react";

function WeeklyMomentsCard({ item }) {
  return (
    <div className="bg-[#fff]   p-4 rounded-2xl group cursor-pointer transform hover:scale-105 transition-all duration-300 shadow-[0_0_5px_rgba(0,0,0,0.3)]  ">
      {/* Start Image */}
      <div className="relative aspect-video overflow-hidden rounded-lg">
        <img
          src={item.image}
          alt={item.title}
          className="w-full h-full object-cover shadow-2xl"
          style={{
            filter:
              "drop-shadow(0 10px 25px rgba(255, 255, 255, 0.1)) drop-shadow(0 4px 15px rgba(255, 255, 255, 0.08))",
          }}
        />
      </div>
      {/* End Image */}

      {/* Start white Shadow overlay */}
      <div className="relative -mt-2">
        <div className="absolute inset-x-0 top-0 h-6 bg-gradient-to-t from-white/5 to-transparent blur-sm" />
      </div>
      {/* End white Shadow overlay */}

      <div className="mb-4 mt-5">
        {/* Start Date */}
        <div className="text-xs flex items-center gap-1">
          <span className="text-primary">SEPT 02</span>
          <span className="  text-xs">
            STARTING AT {item.startTime}
          </span>
        </div>
        {/* End Date */}

        {/* Start Title */}
        <h3 className="  font-semibold text-[16px] my-5 leading-tight">
          {item.title}
        </h3>
        {/* End Title */}

        {/* Start Type, Source, Language */}
        <div className="flex justify-around text-xs">
          <div>
            <div className="text-primary font-semibold mb-[6px]">Type</div>
            <div className="text-text">{item.type}</div>
          </div>
          <div>
            <div className="text-primary font-semibold mb-[6px]">Source</div>
            <div className="text-text">{item.source}</div>
          </div>
          <div>
            <div className="text-primary font-semibold mb-[6px]">
              Language
            </div>
            <div className="text-text">{item.language}</div>
          </div>
        </div>
        {/* End Type, Source, Language */}
      </div>
    </div>
  );
}

export default WeeklyMomentsCard;
