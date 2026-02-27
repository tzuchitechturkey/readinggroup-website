import React from "react";

import { useTranslation } from "react-i18next";
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";

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
      className={`min-w-[170px] min-h-[43px] relative flex items-center justify-between cursor-pointer px-4    ${openDropdowns.date ? "rounded-t-[17px]" : "rounded-[17px]"}  bg-white transition-colors`}
      onClick={(e) => {
        e.stopPropagation();
        onToggleDropdown("date");
      }}
    >
      <div className="flex-1  flex items-center gap-2">
        <p className="text-lg font-bold text-[#081945] leading-tight">
          {t("Date")}
        </p>
        <p className="text-base font-normal text-[#285688] leading-tight">
          {filters.date.month
            ? `${
                [
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
                ][filters.date.month - 1]
              } ${filters.date.year}`
            : t("All")}
        </p>
      </div>
      <ChevronDown className="text-[#081945] font-bold " />

      {/* Date Dropdown */}
      {openDropdowns.date && (
        <div className="absolute top-full left-0 -mt-2  w-full bg-white  rounded-b-[17px] z-50 p-4">
          <hr className="bg-[#FCFDFF] rounded-2xl mb-3 " />

          {/* Year Selector */}
          <div className="flex items-center justify-between mb-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDateYearChange(-1);
              }}
              className="px-1"
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
                className="px-1"
              >
                <ChevronRight />
              </button>
            ) : (
              <div className="px-1 opacity-40 w-[30px]">
                {filters.date.year > currentYear && <ChevronRight />}
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
                className={`px-2.5 py-1 rounded-full text-[#081945] text-base font-normal capitalize ${
                  filters.date.month === index + 1
                    ? "border border-[#285688] text-[#285688] "
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
            //
            className={`w-full ${filters.date.month ? "bg-[#285688]" : "bg-[#C2DCF7]"} text-white px-2.5 py-1 rounded-lg text-base font-normal`}
          >
            {t("Apply")}
          </button>
        </div>
      )}
    </div>
  );
};

export default DateFilter;
