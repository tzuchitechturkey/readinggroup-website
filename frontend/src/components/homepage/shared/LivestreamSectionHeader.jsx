import React from "react";

import { Calendar, ChevronRight } from "lucide-react";

const LivestreamSectionHeader = ({ title, actionText, onActionClick }) => {
  return (
    <div className="flex gap-[16px] items-center w-full">
      {/* Date Icon and Title */}
      <div className="flex gap-[8px] items-center">
        <div className="size-[41px] flex items-center justify-center">
          <Calendar className="text-white" />
        </div>
        <p className="font-['Noto_Sans_TC:Bold',sans-serif] font-bold leading-[1.5] text-[24px] text-white">
          {title}
        </p>
      </div>

      {/* Horizontal Line */}
      <hr className="h-[2px] flex-1 bg-[#1B2D58]" />

      {/* Action Button */}
      {actionText && (
        <div
          className="flex gap-[4px] items-center cursor-pointer group"
          onClick={onActionClick}
        >
          <p className="font-['Noto_Sans_TC:Bold',sans-serif] font-bold leading-[1.2] text-[16px] text-[#8fabca] group-hover:text-white transition-colors">
            {actionText}
          </p>
          <div className="flex items-center justify-center size-[23px] group-hover:translate-x-1 transition-transform">
            <ChevronRight className="text-[#8fabca] group-hover:text-white transition-colors" />
          </div>
        </div>
      )}
    </div>
  );
};

export default LivestreamSectionHeader;
