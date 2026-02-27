import React from "react";

import { Check, ChevronDown } from "lucide-react";
import { useTranslation } from "react-i18next";

const SortByFilter = ({
  filters,
  openDropdowns,
  onToggleDropdown,
  onSortByChange,
  showMostPopular = true,
}) => {
  const { t } = useTranslation();
  return (
    <div
      className={`min-w-[181px] min-h-[43px] relative flex items-center justify-between cursor-pointer px-4    ${openDropdowns.sort ? "rounded-t-[17px]" : "rounded-[17px]"}  bg-white transition-colors`}
      onClick={(e) => {
        e.stopPropagation();
        onToggleDropdown("sort");
      }}
    >
      <div className="flex-1  flex items-center gap-2">
        <p className="text-lg font-bold text-[#081945] leading-tight">
          {t("Sort by")}
        </p>
        <p className="text-base font-normal text-[#285688] leading-tight">
          {t(
            filters.sortBy === "all"
              ? "All"
              : filters.sortBy === "newest"
                ? "Newest"
                : filters.sortBy === "oldest"
                  ? "Oldest"
                  : "Most Popular",
          )}
        </p>
      </div>
      <ChevronDown className="text-[#081945] font-bold " />

      {/* Sort By Dropdown */}
      {openDropdowns.sort && (
        <div className="absolute top-full left-0 -mt-2  w-full bg-white  rounded-b-[17px] z-50 p-4">
          <hr className="bg-[#FCFDFF] rounded-2xl mb-3 " />

          <div className="flex flex-col gap-2.5">
            {/* Newest Option */}
            <div
              className={`flex items-center gap-2 cursor-pointer ${filters.sortBy === "newest" ? "text-[#285688]" : ""}`}
              onClick={() => onSortByChange("newest")}
            >
              <div className="w-6 h-6 ">
                {filters.sortBy === "newest" && <Check />}
              </div>
              <p className="font-normal text-base  ">{t("Newest")}</p>
            </div>
            {/* Oldest Option */}
            <div
              className={`flex items-center gap-2 cursor-pointer ${filters.sortBy === "oldest" ? "text-[#285688]" : ""}`}
              onClick={() => onSortByChange("oldest")}
            >
              <div className="w-6 h-6 ">
                {filters.sortBy === "oldest" && <Check />}
              </div>
              <p className="font-normal text-base  ">{t("Oldest")}</p>
            </div>
            {/* Most Popular Option */}
            {showMostPopular && (
              <div
                className={`flex items-center gap-2 cursor-pointer ${filters.sortByBy === "most_popular" ? "text-[#285688]" : ""}`}
                onClick={() => onSortByChange("most_popular")}
              >
                <div className="w-6 h-6">
                  {filters.sortByBy === "most_popular" && <Check />}
                </div>
                <p className="font-normal text-base  ">{t("Most Popular")}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SortByFilter;
