import { useState } from "react";

import { Calendar, Clock } from "lucide-react";
import { format } from "date-fns";
import { DayPicker } from "react-day-picker";
import * as Popover from "@radix-ui/react-popover";
import "react-day-picker/dist/style.css";
import "@/components/ForPages/Dashboard/CreateorEditCategoryModal/DatePickerStyles.css";

// ─────────────────────────────────────────────────────────────────────────────
// DatePickerWithMonthYear
// ─────────────────────────────────────────────────────────────────────────────

export function DatePickerWithMonthYear({
  value,
  onChange,
  error,
  t,
  isOpen,
  onOpenChange,
}) {
  const [currentDate, setCurrentDate] = useState(
    value ? new Date(value) : new Date(),
  );

  const months = [
    { value: 0, label: t("January") },
    { value: 1, label: t("February") },
    { value: 2, label: t("March") },
    { value: 3, label: t("April") },
    { value: 4, label: t("May") },
    { value: 5, label: t("June") },
    { value: 6, label: t("July") },
    { value: 7, label: t("August") },
    { value: 8, label: t("September") },
    { value: 9, label: t("October") },
    { value: 10, label: t("November") },
    { value: 11, label: t("December") },
  ];

  const years = Array.from(
    { length: 100 },
    (_, i) => new Date().getFullYear() - 50 + i,
  );

  const handleMonthChange = (e) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(parseInt(e.target.value));
    setCurrentDate(newDate);
  };

  const handleYearChange = (e) => {
    const newDate = new Date(currentDate);
    newDate.setFullYear(parseInt(e.target.value));
    setCurrentDate(newDate);
  };

  const handleDateSelect = (date) => {
    const formattedDate = format(date, "yyyy-MM-dd");
    onChange(formattedDate);
    onOpenChange(false);
  };

  return (
    <Popover.Root open={isOpen} onOpenChange={onOpenChange}>
      <Popover.Trigger asChild>
        <button
          type="button"
          className={`w-full px-3 py-2 border rounded-lg flex items-center justify-between bg-white hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            error ? "border-red-500" : "border-gray-300"
          }`}
        >
          <span className={value ? "text-gray-900" : "text-gray-500"}>
            {value
              ? format(new Date(value), "MMMM d, yyyy")
              : t("Select a date")}
          </span>
          <Calendar className="h-5 w-5 text-gray-400" />
        </button>
      </Popover.Trigger>
      <Popover.Content className="w-auto p-4 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
        <div className="space-y-4">
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="text-xs font-medium text-gray-600 mb-1 block">
                {t("Month")}
              </label>
              <select
                value={currentDate.getMonth()}
                onChange={handleMonthChange}
                className="w-full p-2 border border-gray-300 rounded text-sm"
              >
                {months.map((month) => (
                  <option key={month.value} value={month.value}>
                    {month.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex-1">
              <label className="text-xs font-medium text-gray-600 mb-1 block">
                {t("Year")}
              </label>
              <select
                value={currentDate.getFullYear()}
                onChange={handleYearChange}
                className="w-full p-2 border border-gray-300 rounded text-sm"
              >
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <DayPicker
            mode="single"
            month={currentDate}
            onMonthChange={setCurrentDate}
            selected={value ? new Date(value) : undefined}
            onSelect={(date) => {
              if (date) handleDateSelect(date);
            }}
          />
        </div>
      </Popover.Content>
    </Popover.Root>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TimePickerWithDropdowns
// ─────────────────────────────────────────────────────────────────────────────

export function TimePickerWithDropdowns({ value, onChange, error, t }) {
  const [isOpen, setIsOpen] = useState(false);
  const [hours, setHours] = useState(value ? parseInt(value.split(":")[0]) : 0);
  const [minutes, setMinutes] = useState(
    value ? parseInt(value.split(":")[1]) : 0,
  );

  const hoursList = Array.from({ length: 24 }, (_, i) =>
    String(i).padStart(2, "0"),
  );
  const minutesList = Array.from({ length: 60 }, (_, i) =>
    String(i).padStart(2, "0"),
  );

  const handleConfirm = () => {
    const formattedTime = `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
    onChange(formattedTime);
    setIsOpen(false);
  };

  const handleSetNow = () => {
    const now = new Date();
    setHours(now.getHours());
    setMinutes(now.getMinutes());
  };

  const displayTime = value || "00:00";

  return (
    <Popover.Root open={isOpen} onOpenChange={setIsOpen}>
      <Popover.Trigger asChild>
        <button
          type="button"
          className={`w-full px-3 py-2 border rounded-lg flex items-center justify-between bg-white hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            error ? "border-red-500" : "border-gray-300"
          }`}
        >
          <span
            className={value ? "text-gray-900 font-medium" : "text-gray-500"}
          >
            {displayTime}
          </span>
          <Clock className="h-5 w-5 text-gray-400" />
        </button>
      </Popover.Trigger>
      <Popover.Content className="w-auto p-6 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
        <div className="space-y-4 w-64">
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="text-xs font-medium text-gray-600 mb-2 block">
                {t("Hours")}
              </label>
              <select
                value={hours}
                onChange={(e) => setHours(parseInt(e.target.value))}
                className="w-full p-3 border border-gray-300 rounded-lg text-lg font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {hoursList.map((hour) => (
                  <option key={hour} value={parseInt(hour)}>
                    {hour}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-end">
              <span className="text-2xl font-bold text-gray-400">:</span>
            </div>

            <div className="flex-1">
              <label className="text-xs font-medium text-gray-600 mb-2 block">
                {t("Minutes")}
              </label>
              <select
                value={minutes}
                onChange={(e) => setMinutes(parseInt(e.target.value))}
                className="w-full p-3 border border-gray-300 rounded-lg text-lg font-medium focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {minutesList.map((minute) => (
                  <option key={minute} value={parseInt(minute)}>
                    {minute}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="bg-blue-50 rounded-lg p-3 text-center">
            <p className="text-xs text-gray-600 mb-1">{t("Selected Time")}</p>
            <p className="text-3xl font-bold text-blue-600">
              {String(hours).padStart(2, "0")}:
              {String(minutes).padStart(2, "0")}
            </p>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleSetNow}
              className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              {t("Now")}
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              className="flex-1 px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              {t("Confirm")}
            </button>
          </div>
        </div>
      </Popover.Content>
    </Popover.Root>
  );
}
