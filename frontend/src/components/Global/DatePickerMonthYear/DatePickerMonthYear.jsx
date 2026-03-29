import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { AlertCircle } from "lucide-react";

function DatePickerMonthYear({
  value,
  onChange,
  error = false,
  disabled = false,
}) {
  const { t } = useTranslation();
  const [selectedYear, setSelectedYear] = useState(
    value ? new Date(value).getFullYear() : new Date().getFullYear()
  );
  const [selectedMonth, setSelectedMonth] = useState(
    value ? new Date(value).getMonth() : new Date().getMonth()
  );

  // Update selected month and year when value prop changes
  useEffect(() => {
    if (value) {
      setSelectedYear(new Date(value).getFullYear());
      setSelectedMonth(new Date(value).getMonth());
    }
  }, [value]);

  const handleYearChange = (e) => {
    const year = parseInt(e.target.value);
    setSelectedYear(year);
    const newDate = new Date(year, selectedMonth, 1);
    onChange(newDate);
  };

  const handleMonthChange = (e) => {
    const month = parseInt(e.target.value);
    setSelectedMonth(month);
    const newDate = new Date(selectedYear, month, 1);
    onChange(newDate);
  };

  const months = [
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

  return (
    <div className="space-y-2">
      <div className="flex gap-3">
        {/* Year Selector */}
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t("Year")}
          </label>
          <select
            value={selectedYear}
            onChange={handleYearChange}
            disabled={disabled}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none ${
              error ? "border-red-500" : "border-gray-300"
            } ${disabled ? "bg-gray-100 cursor-not-allowed" : "bg-white"}`}
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

        {/* Month Selector */}
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t("Month")}
          </label>
          <select
            value={selectedMonth}
            onChange={handleMonthChange}
            disabled={disabled}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none ${
              error ? "border-red-500" : "border-gray-300"
            } ${disabled ? "bg-gray-100 cursor-not-allowed" : "bg-white"}`}
          >
            {months.map((month, index) => (
              <option key={index} value={index}>
                {t(month)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 text-red-600 text-sm">
          <AlertCircle size={16} />
          <span>{t("Date is required")}</span>
        </div>
      )}
    </div>
  );
}

export default DatePickerMonthYear;
