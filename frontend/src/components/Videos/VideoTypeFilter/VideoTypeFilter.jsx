import React from "react";

import { Check, ChevronDown } from "lucide-react";
import { useTranslation } from "react-i18next";

const VideoTypeFilter = ({
  filters,
  openDropdowns,
  onToggleDropdown,
  onVideoTypeChange,
}) => {
  const { t } = useTranslation();
  console.log(filters.videoType);
  return (
    <div
      onClick={() => onToggleDropdown("videoType")}
      className={`min-w-[240px] min-h-[43px] relative flex items-center justify-between cursor-pointer px-4  ${openDropdowns.videoType ? "rounded-t-[17px]" : "rounded-[17px]"}  bg-white transition-colors`}
    >
      <div className="flex-1  flex items-center gap-2">
        <p className="text-lg font-bold text-[#081945] leading-tight">
          {t("Video Type")}
        </p>
        <p className="text-base font-normal text-[#285688] leading-tight">
          {filters.videoType.includes("all")
            ? t("All")
            : filters.videoType.length === 1
              ? t(
                  filters.videoType[0] === "full_video"
                    ? "Livestreams"
                    : filters.videoType[0] === "clips"
                      ? "Clips"
                      : "Guided Reading",
                )
              : `${filters.videoType.length} selected`}
        </p>
      </div>
      <ChevronDown className="text-[#081945] font-bold " />

      {/* Video Type Dropdown */}
      {openDropdowns.videoType && (
        <div className="absolute top-full left-0 -mt-2  w-full bg-white  rounded-b-[17px] z-50 p-4">
          <hr className="bg-[#FCFDFF] rounded-2xl mb-3 " />
          <div className="flex flex-col gap-2.5">
            {/* All Option */}
            <div
              className={`flex ${filters.videoType.includes("all") ? "text-[#285688]" : ""}  items-center gap-2 cursor-pointer`}
              onClick={() => onVideoTypeChange("all")}
            >
              <div className="w-6 h-6">
                {filters.videoType.includes("all") && <Check />}
              </div>
              <p className="font-normal text-base ">{t("All")}</p>
            </div>
            {/* full_video Option */}
            <div
              className={`flex ${filters.videoType.includes("full_video") ? "text-[#285688]" : ""}  items-center gap-2 cursor-pointer`}
              onClick={() => onVideoTypeChange("full_video")}
            >
              <div className="w-6 h-6">
                {filters.videoType.includes("full_video") && <Check />}
              </div>
              <p className="font-normal text-base ">{t("Livestreams")}</p>
            </div>
            {/* Clips Option */}
            <div
              className={`flex ${filters.videoType.includes("clips") ? "text-[#285688]" : ""}  items-center gap-2 cursor-pointer`}
              onClick={() => onVideoTypeChange("clips")}
            >
              <div className="w-6 h-6">
                {filters.videoType.includes("clips") && <Check />}
              </div>
              <p className="font-normal text-base ">{t("Clips")}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoTypeFilter;
