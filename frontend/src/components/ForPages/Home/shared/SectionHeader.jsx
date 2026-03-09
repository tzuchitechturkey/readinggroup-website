import React from "react";

import { ChevronRight } from "lucide-react";

const SectionHeader = ({
  title,
  actionText,
  onActionClick,
  iconColor = "#5E82AB",
}) => {
  return (
    <div className="flex gap-[8px] sm:gap-[12px] md:gap-[16px] items-center w-full">
      {/* Icon Line */}
      <div className="h-[24px] sm:h-[28px] md:h-[32px] lg:h-[36px] w-0 relative shrink-0">
        <div className="absolute inset-[0_-4px]">
          <svg
            width="8"
            height="100%"
            viewBox="0 0 8 36"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
          >
            <rect width="8" height="36" fill={iconColor} />
          </svg>
        </div>
      </div>

      {/* Title */}
      <p className="font-['Noto_Sans_TC:Bold',sans-serif] font-bold leading-[1.5] text-[16px] sm:text-[18px] md:text-[20px] lg:text-[24px] text-[#1b2d58] shrink-0">
        {title}
      </p>
      <hr className="h-[1px] border-0 flex-1 bg-[#1B2D58]" />

      {/* Action Button */}
      {actionText && (
        <div
          className="hidden lg:flex  gap-[2px] sm:gap-[3px] md:gap-[4px] items-center cursor-pointer group shrink-0"
          onClick={onActionClick}
        >
          <p className="font-['Noto_Sans_TC:Bold',sans-serif]  leading-[1.2] text-[12px] sm:text-[13px] md:text-[14px] lg:text-[16px] text-[#285688] group-hover:text-[#2563eb] transition-colors">
            {actionText}
          </p>
          <div className="flex items-center justify-center size-[18px] sm:size-[20px] md:size-[22px]  group-hover:translate-x-1 transition-transform">
            <ChevronRight className="size-5 text-[#285688]" />
          </div>
        </div>
      )}
    </div>
  );
};

export default SectionHeader;
