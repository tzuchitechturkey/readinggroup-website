import React from "react";

import { useTranslation } from "react-i18next";
import { ChevronLeft, ChevronRight } from "lucide-react";

const DateFilter = ({
  filters,
  openDropdowns,
  onToggleDropdown,
  onDateYearChange,
  onDateMonthSelect,
  onApplyDateFilter,
}) => {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear(); // 2026

  return (
    <div
      className="min-w-[170px] min-h-[56px] relative flex items-center justify-between cursor-pointer px-4 py-2 border border-black rounded-[17px] hover:bg-gray-50 transition-colors"
      onClick={(e) => {
        e.stopPropagation();
        onToggleDropdown("date");
      }}
    >
      <div className="flex-1">
        <p className="text-xs font-bold text-black leading-tight">
          {t("Date")}
        </p>
        <p className="text-base font-normal text-black leading-tight">
          {filters.date.month
            ? `${[
                "Jan", "Feb", "Mar", "Apr", "May", "Jun",
                "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
              ][filters.date.month - 1]} ${filters.date.year}`
            : t("All")}
        </p>
      </div>
      <svg
        width="18"
        height="18"
        viewBox="0 0 18 18"
        fill="none"
        className={`ml-2 transform transition-transform ${
          openDropdowns.date ? "rotate-180" : ""
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

      {/* Date Dropdown */}
      {openDropdowns.date && (
        <div className="absolute top-full left-0 mt-2 w-full bg-white border border-black rounded-[17px] shadow-lg z-50 p-4">
          {/* Year Selector */}
          <div className="flex items-center justify-between py-2 mb-4">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onDateYearChange(-1);
              }} 
              className="p-1"
            >
              <ChevronLeft />
            </button>
            <p className="font-bold text-base text-black">
              {filters.date.year}
            </p>
            {filters.date.year < currentYear ? (
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onDateYearChange(1);
                }} 
                className="p-1"
              >
                <ChevronRight />
              </button>
            ) : (
              <div className="p-1 opacity-40">
                <ChevronRight />
              </div>
            )}
          </div>

          {/* Months Grid */}
          <div className="grid grid-cols-2 gap-2 mb-4">
            {[
              "Jan",
              "Feb",
              "Mar",
              "Apr",
              "May",
              "Jun",
              "Jul",
              "Aug",
              "Sep",
              "Oct",
              "Nov",
              "Dec",
            ].map((month, index) => (
              <button
                key={month}
                onClick={(e) => {
                  e.stopPropagation();
                  onDateMonthSelect(index + 1);
                }}
                className={`px-2.5 py-1 rounded-full text-base font-normal capitalize ${
                  filters.date.month === index + 1
                    ? "border border-black bg-gray-100"
                    : "hover:bg-gray-50"
                }`}
              >
                {month}
              </button>
            ))}
          </div>

          {/* Apply Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onApplyDateFilter();
            }}
            className="w-full bg-black text-white px-2.5 py-1 rounded-full text-base font-normal"
          >
            {t("Apply")}
          </button>
        </div>
      )}
    </div>
  );
};

export default DateFilter;
