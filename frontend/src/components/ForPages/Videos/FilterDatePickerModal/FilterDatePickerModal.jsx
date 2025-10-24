import React, { useState } from "react";

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

  // State للتحكم في فتح وإغلاق الـ Popover
  const [dateOpen, setDateOpen] = useState(false);
  return (
    <div>
      <div className="space-y-4">
        {/* Start Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t("Published Date")}
          </label>
          <Popover open={dateOpen} onOpenChange={setDateOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !selectedDateRange.published_at && "text-muted-foreground"
                )}
              >
                <Calendar className="mr-2 h-4 w-4" />
                {selectedDateRange.published_at ? (
                  format(selectedDateRange.published_at, "PPP")
                ) : (
                  <span>{t("Pick published date")}</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <CalendarComponent
                mode="single"
                selected={selectedDateRange.published_at}
                onSelect={(date) => {
                  setSelectedDateRange((prev) => ({
                    ...prev,
                    published_at: date,
                  }));
                  setDateOpen(false); // إغلاق الـ Popover بعد اختيار التاريخ
                }}
                disabled={(date) =>
                  date > new Date() || date < new Date("1900-01-01")
                }
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        {/* End Start Date */}

        {/* Quick Select Options */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t("Quick Select")}
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                const today = new Date();
                const lastWeek = new Date(today);
                lastWeek.setDate(today.getDate() - 7);
                setSelectedDateRange({
                  published_at: lastWeek,
                });
              }}
              className="px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              {t("Last Week")}
            </button>
            <button
              onClick={() => {
                const today = new Date();
                const lastMonth = new Date(today);
                lastMonth.setMonth(today.getMonth() - 1);
                setSelectedDateRange({
                  published_at: lastMonth,
                });
              }}
              className="px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              {t("Last Month")}
            </button>
            <button
              onClick={() => {
                const today = new Date();
                const lastYear = new Date(today);
                lastYear.setFullYear(today.getFullYear() - 1);
                setSelectedDateRange({
                  published_at: lastYear,
                });
              }}
              className="px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              {t("Last Year")}
            </button>
            <button
              onClick={clearDateFilter}
              className="px-3 py-2 text-sm bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors"
            >
              {t("Clear All")}
            </button>
          </div>
        </div>
      </div>

      {/* Modal Actions */}
      <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
        <Button
          variant="outline"
          onClick={() => setIsDateModalOpen(false)}
          className="text-gray-600"
        >
          {t("Cancel")}
        </Button>
        <Button
          onClick={handleDateSelection}
          className="bg-blue-600 hover:bg-blue-700"
        >
          {t("Apply Filter")}
        </Button>
      </div>
    </div>
  );
}

export default FilterDatePickerModal;
