import React from "react";

import { Check } from "lucide-react";
import { useTranslation } from "react-i18next";

const VideoTypeFilter = ({
  filters,
  openDropdowns,
  onToggleDropdown,
  onVideoTypeChange,
}) => {
  const { t } = useTranslation();

  return (
    <div
      onClick={() => onToggleDropdown("videoType")}
      className="min-w-[170px] min-h-[56px] relative flex items-center justify-between cursor-pointer px-4 py-2 border border-black rounded-[17px] hover:bg-gray-50 transition-colors"
    >
      <div className="flex-1">
        <p className="text-xs font-bold text-black leading-tight">
          {t("Video Type")}
        </p>
        <p className="text-base font-normal text-black leading-tight">
          {filters.videoType.includes("all")
            ? t("All")
            : filters.videoType.length === 1
              ? t(
                  filters.videoType[0] === "livestream"
                    ? "Live Stream"
                    : filters.videoType[0] === "clips"
                      ? "Clips"
                      : "Guided Reading",
                )
              : `${filters.videoType.length} selected`}
        </p>
      </div>
      <svg
        width="18"
        height="18"
        viewBox="0 0 18 18"
        fill="none"
        className={`ml-2 transform transition-transform ${
          openDropdowns.videoType ? "rotate-180" : ""
        }`}
      >
        <path
          d="M4.5 6.75L9 11.25L13.5 6.75"
          stroke="black"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      {/* Video Type Dropdown */}
      {openDropdowns.videoType && (
        <div className="absolute top-full left-0 mt-2 w-full bg-white border border-black rounded-[17px] shadow-lg z-50 p-4">
          <div className="flex flex-col gap-2.5">
            {/* All Option */}
            <div
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => onVideoTypeChange("all")}
            >
              <div className="w-6 h-6">
                {filters.videoType.includes("all") && <Check />}
              </div>
              <p className="font-normal text-base text-black">{t("All")}</p>
            </div>
            {/* Livestream Option */}
            <div
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => onVideoTypeChange("livestream")}
            >
              <div className="w-6 h-6">
                {filters.videoType.includes("livestream") && <Check />}
              </div>
              <p className="font-normal text-base text-black">
                {t("Live Stream")}
              </p>
            </div>
            {/* Clips Option */}
            <div
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => onVideoTypeChange("clips")}
            >
              <div className="w-6 h-6">
                {filters.videoType.includes("clips") && <Check />}
              </div>
              <p className="font-normal text-base text-black">{t("Clips")}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoTypeFilter;
