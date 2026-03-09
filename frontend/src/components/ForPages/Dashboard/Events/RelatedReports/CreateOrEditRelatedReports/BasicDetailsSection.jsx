import React, { useState } from "react";

import { ChevronDown, Search, X, Clock } from "lucide-react";
import * as Popover from "@radix-ui/react-popover";
import DatePickerWithMonthYear from "@/components/Global/DatePickerWithMonthYear/DatePickerWithMonthYear";

// مكون Time Picker محسّن مع Dropdowns للساعات والدقائق
function TimePickerWithDropdowns({ 
  value, 
  onChange, 
  error, 
  t 
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [hours, setHours] = useState(
    value ? parseInt(value.split(":")[0]) : 0
  );
  const [minutes, setMinutes] = useState(
    value ? parseInt(value.split(":")[1]) : 0
  );

  // تحديث الساعات والدقائق عند تغيير القيمة (خاصة في وضع التعديل)
  React.useEffect(() => {
    if (value) {
      const parts = value.split(":");
      setHours(parseInt(parts[0]));
      setMinutes(parseInt(parts[1]));
    }
  }, [value, isOpen]);

  const hoursList = Array.from({ length: 24 }, (_, i) => 
    String(i).padStart(2, "0")
  );
  const minutesList = Array.from({ length: 60 }, (_, i) => 
    String(i).padStart(2, "0")
  );

  const handleHourChange = (e) => {
    setHours(parseInt(e.target.value));
  };

  const handleMinuteChange = (e) => {
    setMinutes(parseInt(e.target.value));
  };

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
          <span className={value ? "text-gray-900 font-medium" : "text-gray-500"}>
            {displayTime}
          </span>
          <Clock className="h-5 w-5 text-gray-400" />
        </button>
      </Popover.Trigger>
      <Popover.Content className="w-auto p-6 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
        <div className="space-y-4 w-64">
          {/* Dropdowns للساعات والدقائق */}
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="text-xs font-medium text-gray-600 mb-2 block">
                {t("Hours")}
              </label>
              <select
                value={hours}
                onChange={handleHourChange}
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
                onChange={handleMinuteChange}
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

          {/* عرض الوقت المختار */}
          <div className="bg-blue-50 rounded-lg p-3 text-center">
            <p className="text-xs text-gray-600 mb-1">{t("Selected Time")}</p>
            <p className="text-3xl font-bold text-blue-600">
              {String(hours).padStart(2, "0")}:{String(minutes).padStart(2, "0")}
            </p>
          </div>

          {/* الأزرار */}
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

const BasicDetailsSection = ({
  formData,
  errors,
  onInputChange,
  showCategoryDropdown,
  setShowCategoryDropdown,
  categoriesList,
  categorySearchValue,
  setCategorySearchValue,
  categoryDropdownRef,
  onCategorySelect,
  onCategoryClearSearch,
  getCategories,
  t,
}) => {
  // Handler للتعامل مع تغييرات الوقت
  const handleDurationChange = (timeString) => {
    onInputChange({
      target: {
        name: 'duration',
        value: timeString
      }
    });
  };
  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200">
      <h3 className="text-lg font-medium text-gray-900 mb-6">
        {t("Basic Information")}
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Start Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t("Report Title")} *
          </label>
          <input
            type="text"
            name="title"
            value={formData.title || ""}
            onChange={onInputChange}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.title ? "border-red-500" : "border-gray-300"
            }`}
            placeholder={t("Enter report title")}
          />
          {errors.title && (
            <p className="text-sm text-red-600 mt-1">{errors.title}</p>
          )}
        </div>
        {/* End Title */}

        {/* Start Duration */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t("Duration")} *
          </label>
          <TimePickerWithDropdowns
            value={formData.duration || ""}
            onChange={handleDurationChange}
            error={!!errors.duration}
            t={t}
          />
          {errors.duration && (
            <p className="text-sm text-red-600 mt-1">{errors.duration}</p>
          )}
        </div>
        {/* End Duration */}

        {/* Start Event Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t("Event Date")} *
          </label>
         
          <DatePickerWithMonthYear
            value={formData.happened_at || ""}
            onChange={onInputChange}
            error={!!errors.happened_at}
            t={t}
          />
          {errors.happened_at && (
            <p className="text-sm text-red-600 mt-1">{errors.happened_at}</p>
          )}
        </div>
        {/* End Event Date */}

        {/* Start External Link */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t("External Link")}
          </label>
          <input
            type="text"
            name="external_link"
            value={formData?.external_link || ""}
            onChange={onInputChange}
            placeholder={t("e.g., https://example.com")}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors?.external_link ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.external_link && (
            <p className="text-sm text-red-600 mt-1">{errors.external_link}</p>
          )}
        </div>
        {/* End External Link */}

        {/* Start Category Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t("Category")} *
          </label>
          <div className="relative" ref={categoryDropdownRef}>
            <button
              type="button"
              onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
              className={`w-full px-3 py-2 border rounded-md text-left focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center justify-between ${
                errors.category ? "border-red-500" : "border-gray-300"
              }`}
            >
              <span className="text-gray-900">
                {formData.category?.title || t("Select a category")}
              </span>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </button>
            {showCategoryDropdown && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
                <div className="p-2 border-b">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      value={categorySearchValue}
                      onChange={(e) => {
                        setCategorySearchValue(e.target.value);
                        getCategories(e.target.value);
                      }}
                      className="w-full pl-10 pr-8 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder={t("Search categories...")}
                    />
                    {categorySearchValue && (
                      <button
                        type="button"
                        onClick={onCategoryClearSearch}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
                <div className="max-h-48 overflow-y-auto">
                  {categoriesList.length > 0 ? (
                    categoriesList.map((category) => (
                      <button
                        key={category.id}
                        type="button"
                        onClick={() => onCategorySelect(category)}
                        className="w-full px-3 py-2 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none"
                      >
                        <div>
                          <div className="font-medium text-gray-900">
                            {category.title}
                          </div>
                          {category.description && (
                            <div className="text-sm text-gray-500 truncate">
                              {category.description}
                            </div>
                          )}
                        </div>
                      </button>
                    ))
                  ) : (
                    <div className="px-3 py-2 text-gray-500 text-center">
                      {t("No categories found")}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
          {errors.category && (
            <p className="text-sm text-red-600 mt-1">{errors.category}</p>
          )}
        </div>
        {/* End Category */}
      </div>
    </div>
  );
};
export default BasicDetailsSection;
