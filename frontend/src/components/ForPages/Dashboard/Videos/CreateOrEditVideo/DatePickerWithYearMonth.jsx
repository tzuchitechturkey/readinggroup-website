import { useState } from "react";

import { useTranslation } from "react-i18next";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

function DatePickerWithYearMonth({
  value,
  onChange,
  placeholder = "Pick a date",
  disabled = false,
  error = false,
}) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState(
    value ? new Date(value) : new Date()
  );

  const handleDateSelect = (date) => {
    onChange(date);
    setOpen(false);
  };

  // Disable future dates
  const isDateDisabled = (date) => {
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    return date > today;
  };

  return (
    <Popover open={open} onOpenChange={setOpen} className="!z-[999999999999999]">
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          disabled={disabled}
          className={cn(
            "w-full justify-start text-left font-normal",
            !value && "text-muted-foreground",
            error && "border-red-500"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {value ? format(new Date(value), "MM/dd/yyyy") : t(placeholder)}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-3" align="start">
        <div className="space-y-3">
          {/* Year and Month Selector */}
          <div className="flex items-center gap-2">
            <div className="flex-1">
              <label className="text-sm font-medium block mb-1">
                {t("Year")}:
              </label>
              <select
                value={calendarMonth.getFullYear()}
                onChange={(e) => {
                  const newDate = new Date(calendarMonth);
                  newDate.setFullYear(parseInt(e.target.value));
                  setCalendarMonth(newDate);
                }}
                className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
              >
                {Array.from({ length: 100 }, (_, i) => {
                  const year = new Date().getFullYear() - 50 + i;
                  return (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  );
                })}
              </select>
            </div>

            <div className="flex-1">
              <label className="text-sm font-medium block mb-1">
                {t("Month")}:
              </label>
              <select
                value={calendarMonth.getMonth()}
                onChange={(e) => {
                  const newDate = new Date(calendarMonth);
                  newDate.setMonth(parseInt(e.target.value));
                  setCalendarMonth(newDate);
                }}
                className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
              >
                {[
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
                ].map((month, index) => (
                  <option key={index} value={index}>
                    {t(month)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Calendar */}
          <CalendarComponent
            mode="single"
            month={calendarMonth}
            onMonthChange={setCalendarMonth}
            selected={value ? new Date(value) : undefined}
            onSelect={handleDateSelect}
            disabled={isDateDisabled}
            initialFocus
          />
        </div>
      </PopoverContent>
    </Popover>
  );
}

export default DatePickerWithYearMonth;
