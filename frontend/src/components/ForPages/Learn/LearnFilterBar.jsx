import React, { useEffect, useState } from "react";

import { useTranslation } from "react-i18next";
import { SlidersHorizontal, ChevronDown } from "lucide-react";

import DateFilter from "@/components/Videos/DateFilter/DateFilter";
import SortByFilter from "@/components/Videos/SortByFilter/SortByFilter";

const LearnFilterBar = ({
  activeCategory,
  categories = { cards: [], posters: [] },
  onCategoryClick,
  filters,
  openDropdowns,
  onToggleDropdown,
  onDateYearChange,
  onDateMonthSelect,
  onApplyDateFilter,
  onSortChange,
  onOpenFilter,
  totalrecord = 0,
}) => {
  const { t } = useTranslation();
  const [isMobileCategoryOpen, setIsMobileCategoryOpen] = useState(false);
  const [isMobileFiltersVisible, setIsMobileFiltersVisible] = useState(false);

  // Handle sort by filter changes - local sorting
  const handleSortByChange = (sortValue) => {
    onSortChange?.(sortValue);
    onToggleDropdown("sortBy");
  };

  const handleCategoryItemClick = (category) => {
    onCategoryClick(category);
    setIsMobileCategoryOpen(false);
  };

  // Flatten categories for mobile dropdown

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Check if click is outside the filter bar
      const filterBar = document.querySelector("[data-filter-bar]");
      if (filterBar && !filterBar.contains(event.target)) {
        // Close all dropdowns by setting them to false
        if (openDropdowns.date) onToggleDropdown("date");
        if (openDropdowns.sortBy) onToggleDropdown("sortBy");
        setIsMobileCategoryOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [onToggleDropdown, openDropdowns]);

  return (
    <div
      className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 md:gap-4 mb-8 md:mb-10"
      data-filter-bar
    >
      {/* Title and Count Row - Responsive */}
      <div className="flex flex-row items-center gap-3">
        <h2 className="font-noto-sans text-[20px] md:text-[24px] font-bold text-[#081945] leading-[1.5] uppercase">
          {t(activeCategory?.name || "Learn")}
        </h2>
        <div className="flex items-center self-stretch py-[4px]">
          <span className="font-noto-sans text-[14px] md:text-[16px] text-[#081945] font-normal leading-[1.5]">
            {totalrecord} {t("images")}
          </span>
        </div>
      </div>

      {/* Main Filter Bar Container */}
      <div className="flex flex-col md:flex-row items-center gap-4">
        {/* Mobile-Only Category Selector and Toggle Button */}
        <div className="flex md:hidden items-center justify-between w-full relative">
          {/* Mobile Category Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsMobileCategoryOpen(!isMobileCategoryOpen)}
              className="bg-[#fcfdff] h-[33px] flex items-center justify-between px-[16px] rounded-[17px] min-w-[170px]"
            >
              <span className="text-[14px] text-[#285688] font-normal">
                {t(activeCategory?.name || "Select Category")}
              </span>
              <ChevronDown className="w-4 h-4 text-[#285688]" />
            </button>

            {isMobileCategoryOpen && (
              <div className="absolute top-[38px] left-0 w-full bg-white rounded-[17px] shadow-lg z-50 p-2 overflow-hidden border border-gray-100 max-h-[300px] overflow-y-auto">
                <div className="flex flex-col gap-1">
                  {Object.entries(categories).map(([section, items]) => (
                    <div key={section} className="mb-2">
                      <div className="px-3 py-1 text-[10px] text-gray-400 font-bold uppercase">
                        {t(section)}
                      </div>
                      {items.map((cat) => (
                        <button
                          key={cat.id}
                          onClick={() => handleCategoryItemClick(cat)}
                          className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                            activeCategory?.id === cat.id
                              ? "bg-[#285688] text-white"
                              : "text-[#081945] hover:bg-gray-50"
                          }`}
                        >
                          {t(cat.name)}
                        </button>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Mobile Filter Toggle Button */}
          <button
            onClick={() => onOpenFilter?.()}
            className="bg-[#fcfdff] h-[33px] flex items-center gap-1.5 px-[16px] rounded-[4px] transition-colors"
          >
            <span className="text-[12px] text-[#285688] font-normal">
              {t("Filter")}
            </span>
            <SlidersHorizontal className="w-4 h-4 text-[#285688]" />
          </button>
        </div>

        {/* Filters (Desktop Always Visible, Mobile Toggleable) */}
        <div className="hidden md:flex w-full md:w-auto flex-col md:flex-row gap-[12px] relative z-40">
          <DateFilter
            filters={filters}
            openDropdowns={openDropdowns}
            onToggleDropdown={onToggleDropdown}
            onDateYearChange={onDateYearChange}
            onDateMonthSelect={onDateMonthSelect}
            onApplyDateFilter={onApplyDateFilter}
          />

          <SortByFilter
            filters={filters}
            openDropdowns={openDropdowns}
            onToggleDropdown={onToggleDropdown}
            onSortByChange={handleSortByChange}
          />
        </div>
      </div>
    </div>
  );
};

export default LearnFilterBar;
