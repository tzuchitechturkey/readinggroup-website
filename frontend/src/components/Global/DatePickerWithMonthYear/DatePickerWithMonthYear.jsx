import { useState, useEffect } from "react";
import { Calendar } from "lucide-react";
import { format } from "date-fns";
import { DayPicker } from "react-day-picker";
import * as Popover from "@radix-ui/react-popover";
import "react-day-picker/dist/style.css";
import "./DatePickerStyles.css";

// مكون Date Picker محسّن مع قوائم الشهر والسنة
function DatePickerWithMonthYear({ value, onChange, error, t, name = "happened_at" }) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState(
    value ? new Date(value) : new Date()
  );

  // تحديث currentDate عندما يتغير value من الخارج
  useEffect(() => {
    if (value) {
      setCurrentDate(new Date(value));
    }
  }, [value]);

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

  const years = Array.from({ length: 100 }, (_, i) => 
    new Date().getFullYear() - 50 + i
  );

  const handleMonthChange = (e) => {
    try {
      if (!e || !e.target) {
        console.error("Invalid event object");
        return;
      }
      const monthValue = parseInt(e.target.value);
      const newDate = new Date(currentDate);
      newDate.setMonth(monthValue);
      setCurrentDate(newDate);
    } catch (error) {
      console.error("Error changing month:", error);
    }
  };

  const handleYearChange = (e) => {
    try {
      if (!e || !e.target) {
        console.error("Invalid event object");
        return;
      }
      const yearValue = parseInt(e.target.value);
      const newDate = new Date(currentDate);
      newDate.setFullYear(yearValue);
      setCurrentDate(newDate);
    } catch (error) {
      console.error("Error changing year:", error);
    }
  };

  const handleDateSelect = (date) => {
    if (!date) {
      console.warn("No date selected");
      return;
    }
    try {
      // تأكد من أن date هو Date object صحيح
      const dateObj = date instanceof Date ? date : new Date(date);
      
      // تحقق من صحة التاريخ
      if (isNaN(dateObj.getTime())) {
        console.error("Invalid date object:", date);
        return;
      }
      
      // تحقق من أن onChange موجود
      if (typeof onChange !== "function") {
        console.error("onChange is not a function");
        return;
      }
      
      const formattedDate = format(dateObj, "yyyy-MM-dd");
      
      // استدعاء onChange مع event object بنفس شكل handleInputChange
      onChange({
        target: {
          value: formattedDate,
          name: name
        }
      });
      
      setIsOpen(false);
    } catch (error) {
      console.error("Error selecting date:", error);
    }
  };

  return (
    <Popover.Root open={isOpen} onOpenChange={setIsOpen}>
      <Popover.Trigger asChild>
        <button
          type="button"
          className={`w-full p-2 border rounded flex items-center justify-between bg-white hover:bg-gray-50 transition-colors ${
            error ? "border-red-500" : "border-gray-300"
          }`}
        >
          <span className={value ? "text-gray-900" : "text-gray-500"}>
            {value ? format(new Date(value), "MMMM d, yyyy") : t("Select a date")}
          </span>
          <Calendar className="h-5 w-5 text-gray-400" />
        </button>
      </Popover.Trigger>
      <Popover.Content className="w-auto p-4 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
        <div className="space-y-4">
          {/* قوائم الشهر والسنة */}
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

          {/* DayPicker */}
          <DayPicker
            mode="single"
            month={currentDate}
            onMonthChange={setCurrentDate}
            selected={value ? new Date(value) : undefined}
            onSelect={handleDateSelect}
            disabled={(date) => date > new Date()}
            showOutsideDays={false}
          />
        </div>
      </Popover.Content>
    </Popover.Root>
  );
}

export default DatePickerWithMonthYear;
