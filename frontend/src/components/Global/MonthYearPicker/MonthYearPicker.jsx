import React, { useState, useRef, useEffect } from "react";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";

import { cn } from "@/lib/utils";

const MonthYearPicker = ({ month, year, onChange, className }) => {
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(false);
  const [viewYear, setViewYear] = useState(year);
  const containerRef = useRef(null);

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const monthShortNames = [
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
  ];

  // Sync viewYear when month/year props change if not expanded
  useEffect(() => {
    if (!isExpanded) {
      setViewYear(year);
    }
  }, [year, isExpanded]);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setIsExpanded(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handlePrevMonthYear = (e) => {
    e.stopPropagation();
    let newMonth = month - 1;
    let newYear = year;
    if (newMonth < 1) {
      newMonth = 12;
      newYear -= 1;
    }
    onChange({ month: newMonth, year: newYear });
  };

  const handleNextMonthYear = (e) => {
    e.stopPropagation();
    let newMonth = month + 1;
    let newYear = year;
    if (newMonth > 12) {
      newMonth = 1;
      newYear += 1;
    }
    onChange({ month: newMonth, year: newYear });
  };

  const handleMonthSelect = (mIndex) => {
    onChange({ month: mIndex + 1, year: viewYear });
    setIsExpanded(false);
  };

  const handlePrevYear = (e) => {
    e.stopPropagation();
    setViewYear((prev) => prev - 1);
  };

  const handleNextYear = (e) => {
    e.stopPropagation();
    setViewYear((prev) => prev + 1);
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative inline-flex flex-col bg-[var(--livestream-btn-white)] rounded-[17px] p-[10px] shadow-sm transition-all duration-300 z-50 min-w-[300px]",
        isExpanded ? "rounded-b-none" : "",
        className,
      )}
    >
      {/* Header - Always visible */}
      <div
        className="flex items-center justify-center gap-[16px] py-[4px] cursor-pointer select-none w-full"
        onClick={() => {
          setIsExpanded(!isExpanded);
          if (!isExpanded) setViewYear(year);
        }}
        role="button"
        tabIndex={0}
      >
        <button
          onClick={handlePrevMonthYear}
          className="hover:opacity-60 transition-opacity flex items-center justify-center size-[24px]"
          aria-label="Previous Month"
        >
          <ChevronLeft
            className="w-6 h-6 text-[#285688]" // Deep Blue from Figma
            strokeWidth={2.5}
          />
        </button>

        <div className="flex font-bold gap-[8px] items-center justify-center text-[#285688] text-[24px] uppercase w-[198px] truncate font-noto">
          <span>{t(monthNames[month - 1])}</span>
          <span>{year}</span>
        </div>

        <button
          onClick={handleNextMonthYear}
          className="hover:opacity-60 transition-opacity flex items-center justify-center size-[24px]"
          aria-label="Next Month"
        >
          <ChevronRight
            className="w-6 h-6 text-[#285688]" // Deep Blue from Figma
            strokeWidth={2.5}
          />
        </button>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden absolute top-full left-0 w-full bg-[var(--livestream-btn-white)] rounded-b-[17px] shadow-sm px-[10px] pb-[10px] z-50 rounded-t-none flex flex-col gap-[12px]"
          >
            {/* Divider */}
            {/* Design uses a vector, approximating with border */}
            <div className="h-[1px] bg-[#E5E5E5] w-full" />

            {/* Year Selection Row */}
            <div className="flex items-center justify-between w-full py-[4px]">
              <button
                onClick={handlePrevYear}
                className="hover:opacity-60 transition-opacity flex items-center justify-center size-[24px]"
              >
                <ChevronLeft
                  className="w-6 h-6 text-[#285688]"
                  strokeWidth={2.5}
                />
              </button>
              <span className="font-bold text-[#081945] text-[24px] uppercase text-center font-noto">
                {viewYear}
              </span>
              <button
                onClick={handleNextYear}
                className="hover:opacity-60 transition-opacity flex items-center justify-center size-[24px]"
              >
                <ChevronRight
                  className="w-6 h-6 text-[#285688]"
                  strokeWidth={2.5}
                />
              </button>
            </div>

            {/* Month Grid */}
            <div className="grid grid-cols-3 gap-[8px] w-full">
              {monthShortNames.map((mShort, index) => {
                const isSelected = month === index + 1 && year === viewYear;
                return (
                  <button
                    key={mShort}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMonthSelect(index);
                    }}
                    className={cn(
                      "flex items-center justify-center px-[10px] py-[4px] rounded-[42px] transition-all border w-full h-[32px]", // Fixed height/width approximation
                      isSelected
                        ? "border-[#285688] text-[#285688] font-semibold border-solid"
                        : "border-transparent text-[#081945] hover:bg-gray-100 hover:text-[#285688]",
                    )}
                  >
                    <span className="text-[16px] font-normal leading-[1.5] font-noto">
                      {t(mShort)}
                    </span>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MonthYearPicker;
