import React from "react";

import { useTranslation } from "react-i18next";

import DateFilter from "@/components/Videos/DateFilter/DateFilter";
import SortByFilter from "@/components/Videos/SortByFilter/SortByFilter";

const LearnFilterBar = ({
  activeCategory,
  filters,
  openDropdowns,
  onToggleDropdown,
  onDateYearChange,
  onDateMonthSelect,
  onApplyDateFilter,
  onSortChange,
  totalrecord = 0,
}) => {
  const { t } = useTranslation();

  // Handle sort by filter changes - local sorting
  const handleSortByChange = (sortValue) => {
    onSortChange?.(sortValue);
    onToggleDropdown("sort");
  };

  // Close dropdowns when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      // Check if click is outside the filter bar
      const filterBar = document.querySelector("[data-filter-bar]");
      if (filterBar && !filterBar.contains(event.target)) {
        // Close all dropdowns by setting them to false
        if (openDropdowns.date) onToggleDropdown("date");
        if (openDropdowns.sort) onToggleDropdown("sort");
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [onToggleDropdown, openDropdowns]);
  return (
    <div className="flex flex-col md:flex-row justify-between items-end md:items-center  mb-10" data-filter-bar>
      <div className="flex items-center gap-3">
        {/* Title */}
        <h2 className="text-2xl font-bold text-gray-900 leading-none">
          {t(activeCategory.name)} {activeCategory.learn_type}
        </h2>
        <span> {totalrecord}</span>
        <span> {activeCategory?.learn_type}</span>
      </div>
      {/* Filter Buttons */}

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
  );
};

export default LearnFilterBar;
