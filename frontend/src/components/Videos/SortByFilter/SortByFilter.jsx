import React from "react";

import { Check, ChevronDown } from "lucide-react";
import { useTranslation } from "react-i18next";

const SortByFilter = ({
  filters,
  openDropdowns,
  onToggleDropdown,
  onSortByChange,
}) => {
  const { t } = useTranslation();

  return (
    <div
      className="min-w-[170px] min-h-[56px] relative flex items-center justify-between cursor-pointer px-4 py-2 border border-black rounded-[17px] hover:bg-gray-50 transition-colors"
      onClick={(e) => {
        e.stopPropagation();
        onToggleDropdown("sortBy");
      }}
    >
      <div className="flex-1">
        <p className="text-xs font-bold text-black leading-tight">
          {t("Sort by")}
        </p>
        <p className="text-base font-normal text-black leading-tight">
          {t(
            filters.sortBy === "newest"
              ? "Newest"
              : filters.sortBy === "oldest"
                ? "Oldest"
                : "Most Popular",
          )}
        </p>
      </div>
      <ChevronDown />

      {/* Sort By Dropdown */}
      {openDropdowns.sortBy && (
        <div className="absolute top-full left-0 mt-2 w-full bg-white border border-black rounded-[17px] shadow-lg z-50 p-4">
          <div className="flex flex-col gap-2.5">
            {/* Newest Option */}
            <div
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => onSortByChange("newest")}
            >
              <div className="w-6 h-6 ">
                {filters.sortBy === "newest" && <Check />}
              </div>
              <p className="font-normal text-base text-black">{t("Newest")}</p>
            </div>
            {/* Oldest Option */}
            <div
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => onSortByChange("oldest")}
            >
              <div className="w-6 h-6 ">
                {filters.sortBy === "oldest" && <Check />}
              </div>
              <p className="font-normal text-base text-black">{t("Oldest")}</p>
            </div>
            {/* Most Popular Option */}
            <div
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => onSortByChange("popular")}
            >
              <div className="w-6 h-6">
                {filters.sortBy === "popular" && <Check />}
              </div>
              <p className="font-normal text-base text-black">
                {t("Most Popular")}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SortByFilter;
