import React, { useEffect, useRef, useState } from "react";

import { X, Calendar } from "lucide-react";
import { format } from "date-fns";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

function FilterDatePickerModal({
  setIsDateModalOpen,
  selectedDateRange,
  setSelectedDateRange,
  clearDateFilter,
  handleDateSelection,
}) {
  const { t } = useTranslation();
  const initializedRef = useRef(false);

  const [localRange, setLocalRange] = useState(selectedDateRange || {});

  // keep localRange in sync when parent prop changes
  useEffect(() => {
    setLocalRange(selectedDateRange || {});
  }, [selectedDateRange]);

  useEffect(() => {
    // On first mount, if there's no selected range, default to Today
    if (!initializedRef.current) {
      initializedRef.current = true;
      if (!selectedDateRange || !selectedDateRange.startDate) {
        const today = new Date();
        const startOfToday = new Date(today);
        startOfToday.setHours(0, 0, 0, 0);
        setSelectedDateRange({ startDate: startOfToday, endDate: today });
      }
    }
  }, []);

  // Helper to compare dates (only year/month/day)
  const isSameDay = (a, b) => {
    if (!a || !b) return false;
    return (
      a.getFullYear() === b.getFullYear() &&
      a.getMonth() === b.getMonth() &&
      a.getDate() === b.getDate()
    );
  };

  const isRangeEqual = (rangeA, rangeB) => {
    if (!rangeA || !rangeB) return false;
    return (
      isSameDay(rangeA.startDate, rangeB.startDate) &&
      isSameDay(rangeA.endDate, rangeB.endDate)
    );
  };

  return (
    <div>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-4xl mx-4">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900">
              {t("Filter by Date")}
            </h3>
            <button
              onClick={() => setIsDateModalOpen(false)}
              className="text-gray-400 hover:text-gray-600 transition-colors p-2 rounded-lg hover:bg-gray-100"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="flex gap-6">
            {/* Left Side - Quick Select Options */}
            <div className="w-72">
              <div className="space-y-2">
                <button
                  onClick={() => {
                    const today = new Date();
                    const startOfToday = new Date(today);
                    startOfToday.setHours(0, 0, 0, 0);
                    const newRange = {
                      startDate: startOfToday,
                      endDate: today,
                    };
                    setLocalRange(newRange);
                    setSelectedDateRange(newRange);
                  }}
                  className={cn(
                    "w-full px-4 py-3 text-sm text-left border rounded-xl transition-all duration-200 font-medium",
                    isRangeEqual(
                      localRange,
                      (() => {
                        const today = new Date();
                        const start = new Date(today);
                        start.setHours(0, 0, 0, 0);
                        return { startDate: start, endDate: today };
                      })()
                    )
                      ? "text-blue-600 bg-blue-50 border-blue-200 hover:bg-blue-100"
                      : "bg-gray-50 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 border-gray-200"
                  )}
                >
                  {t("Today")}
                </button>
                <button
                  onClick={() => {
                    const today = new Date();
                    const last7Days = new Date(today);
                    last7Days.setDate(today.getDate() - 7);
                    const newRange = { startDate: last7Days, endDate: today };
                    setLocalRange(newRange);
                    setSelectedDateRange(newRange);
                  }}
                  className={cn(
                    "w-full px-4 py-3 text-sm text-left border rounded-xl transition-all duration-200 font-medium",
                    isRangeEqual(
                      localRange,
                      (() => {
                        const today = new Date();
                        const start = new Date(today);
                        start.setDate(today.getDate() - 7);
                        return { startDate: start, endDate: today };
                      })()
                    )
                      ? "text-blue-600 bg-blue-50 border-blue-200 hover:bg-blue-100"
                      : "bg-gray-50 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 border-gray-200"
                  )}
                >
                  {t("Last 7 days")}
                </button>
                <button
                  onClick={() => {
                    const today = new Date();
                    const last30Days = new Date(today);
                    last30Days.setDate(today.getDate() - 30);
                    const newRange = { startDate: last30Days, endDate: today };
                    setLocalRange(newRange);
                    setSelectedDateRange(newRange);
                  }}
                  className={cn(
                    "w-full px-4 py-3 text-sm text-left border rounded-xl transition-all duration-200 font-medium",
                    isRangeEqual(
                      localRange,
                      (() => {
                        const today = new Date();
                        const start = new Date(today);
                        start.setDate(today.getDate() - 30);
                        return { startDate: start, endDate: today };
                      })()
                    )
                      ? "text-blue-600 bg-blue-50 border-blue-200 hover:bg-blue-100"
                      : "bg-gray-50 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 border-gray-200"
                  )}
                >
                  {t("Last 30 days")}
                </button>
                <button
                  onClick={() => {
                    const today = new Date();
                    const last90Days = new Date(today);
                    last90Days.setDate(today.getDate() - 90);
                    const newRange = { startDate: last90Days, endDate: today };
                    setLocalRange(newRange);
                    setSelectedDateRange(newRange);
                  }}
                  className={cn(
                    "w-full px-4 py-3 text-sm text-left border rounded-xl transition-all duration-200 font-medium",
                    isRangeEqual(
                      localRange,
                      (() => {
                        const today = new Date();
                        const start = new Date(today);
                        start.setDate(today.getDate() - 90);
                        return { startDate: start, endDate: today };
                      })()
                    )
                      ? "text-blue-600 bg-blue-50 border-blue-200 hover:bg-blue-100"
                      : "bg-gray-50 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 border-gray-200"
                  )}
                >
                  {t("Last 90 days")}
                </button>

                <button
                  onClick={() => {
                    clearDateFilter();
                    setLocalRange({});
                  }}
                  className="w-full px-4 py-3 text-sm text-left bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 hover:border-red-300 rounded-xl transition-all duration-200 font-medium"
                >
                  {t("Clear All")}
                </button>
              </div>
            </div>

            {/* Right Side - Date Selectors */}
            <div className="flex-1 space-y-6">
              {/* Start Date */}
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-3">
                  {t("Start Date")}
                </label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal h-12 border-2 border-gray-200 hover:border-blue-300 rounded-xl",
                        !selectedDateRange.startDate && "text-muted-foreground"
                      )}
                    >
                      <Calendar className="mr-3 h-5 w-5 text-blue-500" />
                      {selectedDateRange.startDate ? (
                        <span className="text-gray-800 font-medium">
                          {format(
                            selectedDateRange.startDate,
                            "EEEE, MMMM do, yyyy"
                          )}
                        </span>
                      ) : (
                        <span className="text-gray-500">
                          {t("Pick start date")}
                        </span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    className="w-auto p-0 shadow-xl border-2"
                    align="start"
                  >
                    <CalendarComponent
                      mode="single"
                      selected={selectedDateRange.startDate}
                      onSelect={(date) =>
                        setSelectedDateRange((prev) => ({
                          ...prev,
                          startDate: date,
                        }))
                      }
                      disabled={(date) =>
                        date > new Date() || date < new Date("1900-01-01")
                      }
                      initialFocus
                      className="rounded-xl border-0"
                      classNames={{
                        months: "space-y-4",
                        month: "space-y-4",
                        caption:
                          "flex justify-center pt-1 relative items-center text-lg font-semibold",
                        caption_label: "text-lg font-semibold",
                        nav: "space-x-1 flex items-center",
                        nav_button:
                          "h-8 w-8 bg-transparent p-0 opacity-50 hover:opacity-100 rounded-lg hover:bg-gray-100",
                        nav_button_previous: "absolute left-3",
                        nav_button_next: "absolute right-3",
                        table: "w-full border-collapse space-y-1",
                        head_row: "flex",
                        head_cell:
                          "text-gray-500 rounded-md w-9 font-medium text-[0.8rem]",
                        row: "flex w-full mt-2",
                        cell: "text-center text-sm p-0 relative [&:has([aria-selected])]:bg-blue-100 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                        day: "h-9 w-9 p-0 font-normal aria-selected:opacity-100 hover:bg-blue-50 rounded-lg transition-colors",
                        day_selected:
                          "bg-blue-500 text-white hover:bg-blue-600 focus:bg-blue-600 rounded-lg",
                        day_today: "bg-gray-100 text-gray-900 font-semibold",
                        day_outside: "text-gray-400 opacity-50",
                        day_disabled: "text-gray-400 opacity-50",
                        day_range_middle:
                          "aria-selected:bg-blue-100 aria-selected:text-blue-900",
                        day_hidden: "invisible",
                      }}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* End Date */}
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-3">
                  {t("End Date")}
                </label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal h-12 border-2 border-gray-200 hover:border-blue-300 rounded-xl",
                        !selectedDateRange.endDate && "text-muted-foreground"
                      )}
                    >
                      <Calendar className="mr-3 h-5 w-5 text-blue-500" />
                      {selectedDateRange.endDate ? (
                        <span className="text-gray-800 font-medium">
                          {format(
                            selectedDateRange.endDate,
                            "EEEE, MMMM do, yyyy"
                          )}
                        </span>
                      ) : (
                        <span className="text-gray-500">
                          {t("Pick end date")}
                        </span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    className="w-auto p-0 shadow-xl border-2"
                    align="start"
                  >
                    <CalendarComponent
                      mode="single"
                      selected={selectedDateRange.endDate}
                      onSelect={(date) =>
                        setSelectedDateRange((prev) => ({
                          ...prev,
                          endDate: date,
                        }))
                      }
                      disabled={(date) =>
                        date > new Date() ||
                        date < new Date("1900-01-01") ||
                        (selectedDateRange.startDate &&
                          date < selectedDateRange.startDate)
                      }
                      initialFocus
                      className="rounded-xl border-0"
                      classNames={{
                        months: "space-y-4",
                        month: "space-y-4",
                        caption:
                          "flex justify-center pt-1 relative items-center text-lg font-semibold",
                        caption_label: "text-lg font-semibold",
                        nav: "space-x-1 flex items-center",
                        nav_button:
                          "h-8 w-8 bg-transparent p-0 opacity-50 hover:opacity-100 rounded-lg hover:bg-gray-100",
                        nav_button_previous: "absolute left-3",
                        nav_button_next: "absolute right-3",
                        table: "w-full border-collapse space-y-1",
                        head_row: "flex",
                        head_cell:
                          "text-gray-500 rounded-md w-9 font-medium text-[0.8rem]",
                        row: "flex w-full mt-2",
                        cell: "text-center text-sm p-0 relative [&:has([aria-selected])]:bg-blue-100 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                        day: "h-9 w-9 p-0 font-normal aria-selected:opacity-100 hover:bg-blue-50 rounded-lg transition-colors",
                        day_selected:
                          "bg-blue-500 text-white hover:bg-blue-600 focus:bg-blue-600 rounded-lg",
                        day_today: "bg-gray-100 text-gray-900 font-semibold",
                        day_outside: "text-gray-400 opacity-50",
                        day_disabled: "text-gray-400 opacity-50",
                        day_range_middle:
                          "aria-selected:bg-blue-100 aria-selected:text-blue-900",
                        day_hidden: "invisible",
                      }}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>

          {/* Modal Actions */}
          <div className="flex items-center justify-end gap-4 mt-8 pt-6 border-t border-gray-200">
            <Button
              variant="outline"
              onClick={() => setIsDateModalOpen(false)}
              className="px-6 py-3 text-gray-600 border-2 hover:bg-gray-50 rounded-xl font-medium"
            >
              {t("Cancel")}
            </Button>
            <Button
              onClick={handleDateSelection}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200"
            >
              {t("Apply Filter")}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FilterDatePickerModal;
