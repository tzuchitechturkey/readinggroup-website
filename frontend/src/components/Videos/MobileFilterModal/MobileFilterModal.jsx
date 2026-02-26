import React, { useState } from "react";

import { useTranslation } from "react-i18next";
import { X, ChevronDown } from "lucide-react";

function MobileFilterModal({
  isOpen,
  onClose,
  filters,
  onVideoTypeChange,
  onDateYearChange,
  onDateMonthSelect,
  onApplyDateFilter,
  onSortByChange,
  activeCategories,
  selectedCategories,
  onCategorySelect,
  appliedDateFilter,
  onResetFilters,
  onApplyFilters, // Add this optional unified callback
}) {
  const { t, i18n } = useTranslation();
  const [localFilters, setLocalFilters] = useState(filters);
  const [localSelectedCategories, setLocalSelectedCategories] =
    useState(selectedCategories);
  const [monthDropdownOpen, setMonthDropdownOpen] = useState(false);
  const [yearDropdownOpen, setYearDropdownOpen] = useState(false);

  if (!isOpen) return null;

  const months = [
    { value: 1, label: "January" },
    { value: 2, label: "February" },
    { value: 3, label: "March" },
    { value: 4, label: "April" },
    { value: 5, label: "May" },
    { value: 6, label: "June" },
    { value: 7, label: "July" },
    { value: 8, label: "August" },
    { value: 9, label: "September" },
    { value: 10, label: "October" },
    { value: 11, label: "November" },
    { value: 12, label: "December" },
  ];

  const years = Array.from({ length: 10 }, (_, i) => 2026 - i);

  const currentMonth = months.find((m) => m.value === localFilters.date.month);

  const handleApplyFilters = () => {
    // Call individual handlers if they exist
    onVideoTypeChange?.(localFilters.videoType[0]);
    onSortByChange?.(localFilters.sortBy);

    if (localFilters.date.month !== null) {
      onDateMonthSelect?.(localFilters.date.month);
    }

    if (localFilters.date.year) {
      onDateYearChange?.(localFilters.date.year);
    }

    if (onApplyDateFilter) {
      onApplyDateFilter();
    }

    if (onCategorySelect) {
      const currentSelected = selectedCategories || [];
      const newSelected = localSelectedCategories || [];

      const categoriesToRemove = currentSelected.filter(
        (cat) => !newSelected.includes(cat),
      );
      const categoriesToAdd = newSelected.filter(
        (cat) => !currentSelected.includes(cat),
      );

      categoriesToRemove.forEach((cat) => onCategorySelect(cat));
      categoriesToAdd.forEach((cat) => onCategorySelect(cat));
    }

    // Call unified handler if provided
    if (onApplyFilters) {
      onApplyFilters({
        ...localFilters,
        categories: localSelectedCategories,
      });
    }

    onClose();
  };

  const getFilterCount = () => {
    let count = (localSelectedCategories || []).length;
    if (
      localFilters.videoType &&
      localFilters.videoType.length > 0 &&
      !localFilters.videoType.includes("all")
    ) {
      count += 1;
    }
    if (localFilters.date.month !== null) {
      count += 1;
    }
    return count;
  };

  const filterCount = getFilterCount();

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/40 z-[60] backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className="fixed inset-0 bg-[#D7EAFF] z-[70] overflow-y-auto flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Main Content Area */}
        <div className="flex-1 px-[16px] py-[20px] pb-32">
          {/* Header */}
          <div className="flex items-center justify-between mb-[32px]">
            <h2 className="text-[20px] font-bold text-[#081945] font-noto-sans uppercase">
              {t("Filter")}
            </h2>
            <button
              onClick={onClose}
              className="p-1 hover:bg-[#285688]/10 rounded-full transition-colors"
            >
              <X size={24} className="text-[#081945]" />
            </button>
          </div>

          <div className="space-y-[32px]">
            {/* Video Type Filter */}
            {onVideoTypeChange && (
              <div className="space-y-[16px]">
                <h3 className="text-[16px] font-bold text-[#081945] font-noto-sans uppercase">
                  {t("Video Type")}
                </h3>
                <div className="space-y-[12px]">
                  {["all", "livestream", "clips"].map((type) => (
                    <label
                      key={type}
                      className="flex items-center gap-[12px] cursor-pointer group"
                    >
                      <div className="relative flex items-center justify-center">
                        <input
                          type="radio"
                          name="videoType"
                          value={type}
                          checked={localFilters.videoType.includes(type)}
                          onChange={() =>
                            setLocalFilters((prev) => ({
                              ...prev,
                              videoType: [type],
                            }))
                          }
                          className="peer appearance-none w-[20px] h-[20px] rounded-full border border-[#285688] bg-transparent cursor-pointer"
                        />
                        <div className="hidden peer-checked:block absolute w-[12px] h-[12px] rounded-full bg-[#285688]" />
                      </div>
                      <span className="text-[14px] font-noto-sans text-[#285688]">
                        {t(type.charAt(0).toUpperCase() + type.slice(1))}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Date Filter */}
            <div>
              <h3 className=" font-bold text-[#081945] mb-3">{t("Date")}</h3>
              <div className="space-y-2">
                <label className="flex items-center gap-3 cursor-pointer bg-[#D7EAFF] p-2 rounded">
                  <input
                    type="radio"
                    name="date"
                    value="all"
                    checked={localFilters.date.month === null}
                    onChange={() =>
                      setLocalFilters((prev) => ({
                        ...prev,
                        date: { year: 2026, month: null },
                      }))
                    }
                    className="w-5 h-5 appearance-none rounded-full border-2 border-[#285688] bg-[#D7EAFF] cursor-pointer checked:bg-[#285688] checked:border-[#285688] checked:shadow-[inset_0_0_0_3px_#D7EAFF]"
                  />
                  <span className="text-sm text-[#285688]">{t("All")}</span>
                </label>

                <label className="flex items-center gap-[12px] cursor-pointer group">
                  <div className="relative flex items-center justify-center">
                    <input
                      type="radio"
                      name="date"
                      value="specific"
                      checked={localFilters.date.month !== null}
                      onChange={() => {
                        setLocalFilters((prev) => ({
                          ...prev,
                          date: { ...prev.date, month: 1 },
                        }));
                      }}
                      className="peer appearance-none w-[20px] h-[20px] rounded-full border border-[#285688] bg-transparent cursor-pointer"
                    />
                    <div className="hidden peer-checked:block absolute w-[12px] h-[12px] rounded-full bg-[#285688]" />
                  </div>
                  <span className="text-[14px] font-noto-sans text-[#285688]">
                    {t("Month & Year")}
                  </span>
                </label>

                {localFilters.date.month !== null && (
                  <div className="flex items-center gap-[12px] pt-[8px]">
                    {/* Month Dropdown */}
                    <div className="relative flex-1">
                      <button
                        onClick={() => setMonthDropdownOpen(!monthDropdownOpen)}
                        className="w-full h-[40px] px-[16px] bg-[#FCFDFF] rounded-[17px] flex items-center justify-between text-[16px] text-[#285688] font-noto-sans"
                      >
                        <span className="truncate">
                          {currentMonth ? t(currentMonth.label) : t("Month")}
                        </span>
                        <ChevronDown
                          size={16}
                          className={`transform transition-transform duration-200 ${
                            monthDropdownOpen ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                      {monthDropdownOpen && (
                        <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl shadow-xl z-[80] max-h-[240px] overflow-y-auto border border-[#C2DCF7]">
                          {months.map((month) => (
                            <button
                              key={month.value}
                              onClick={() => {
                                setLocalFilters((prev) => ({
                                  ...prev,
                                  date: { ...prev.date, month: month.value },
                                }));
                                setMonthDropdownOpen(false);
                              }}
                              className="w-full text-left px-4 py-3 text-[14px] text-[#081945] hover:bg-[#D7EAFF]/30 active:bg-[#D7EAFF]/50 transition-colors border-b border-[#C2DCF7]/30 last:border-0"
                            >
                              {t(month.label)}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Year Dropdown */}
                    <div className="relative flex-1">
                      <button
                        onClick={() => setYearDropdownOpen(!yearDropdownOpen)}
                        className="w-full h-[40px] px-[16px] bg-[#FCFDFF] rounded-[17px] flex items-center justify-between text-[16px] text-[#285688] font-noto-sans"
                      >
                        <span>{localFilters.date.year}</span>
                        <ChevronDown
                          size={16}
                          className={`transform transition-transform duration-200 ${
                            yearDropdownOpen ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                      {yearDropdownOpen && (
                        <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl shadow-xl z-[80] max-h-[240px] overflow-y-auto border border-[#C2DCF7]">
                          {years.map((year) => (
                            <button
                              key={year}
                              onClick={() => {
                                setLocalFilters((prev) => ({
                                  ...prev,
                                  date: { ...prev.date, year },
                                }));
                                setYearDropdownOpen(false);
                              }}
                              className="w-full text-left px-4 py-3 text-[14px] text-[#081945] hover:bg-[#D7EAFF]/30 active:bg-[#D7EAFF]/50 transition-colors border-b border-[#C2DCF7]/30 last:border-0"
                            >
                              {year}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Sort By Filter */}
            <div className="space-y-[16px]">
              <h3 className="text-[16px] font-bold text-[#081945] font-noto-sans uppercase">
                {t("Sort By")}
              </h3>
              <div className="space-y-[12px]">
                {[
                  { value: "newest", label: "Newest" },
                  { value: "oldest", label: "Oldest" },
                  { value: "most_popular", label: "Most Popular" },
                ].map((option) => (
                  <label
                    key={option.value}
                    className="flex items-center gap-[12px] cursor-pointer group"
                  >
                    <div className="relative flex items-center justify-center">
                      <input
                        type="radio"
                        name="sortBy"
                        value={option.value}
                        checked={localFilters.sortBy === option.value}
                        onChange={() =>
                          setLocalFilters((prev) => ({
                            ...prev,
                            sortBy: option.value,
                          }))
                        }
                        className="peer appearance-none w-[20px] h-[20px] rounded-full border border-[#285688] bg-transparent cursor-pointer"
                      />
                      <div className="hidden peer-checked:block absolute w-[12px] h-[12px] rounded-full bg-[#285688]" />
                    </div>
                    <span className="text-[14px] font-noto-sans text-[#285688]">
                      {t(option.label)}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Categories / Topics */}
            {activeCategories && activeCategories.length > 0 && (
              <div className="space-y-[16px]">
                <h3 className="text-[16px] font-bold text-[#081945] font-noto-sans uppercase">
                  {t("Topics")}
                </h3>
                <div className="flex flex-wrap gap-[8px]">
                  {activeCategories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => {
                        setLocalSelectedCategories((prev) => {
                          const current = prev || [];
                          if (current.includes(category.id)) {
                            return current.filter((id) => id !== category.id);
                          }
                          return [...current, category.id];
                        });
                      }}
                      className={`h-[32px] px-[16px] rounded-full flex items-center gap-2 text-[14px] font-noto-sans transition-all active:scale-95 ${
                        (localSelectedCategories || []).includes(category.id)
                          ? "bg-[#285688] text-white shadow-md shadow-[#285688]/20"
                          : "bg-[#FCFDFF] text-[#285688] border border-[#C2DCF7] hover:border-[#285688]"
                      }`}
                    >
                      <span>{t(category.name)}</span>
                      {(localSelectedCategories || []).includes(
                        category.id,
                      ) && <X size={14} className="text-white" />}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="sticky bottom-0 bg-[#D7EAFF] px-[16px] py-[19px] flex gap-[12px] border-t border-[#FCFDFF]/20 shadow-[0_-10px_20px_rgba(0,0,0,0.05)] backdrop-blur-md">
          <button
            onClick={() => {
              onResetFilters?.();
              onClose();
            }}
            className="flex-1 h-[40px] bg-[#FCFDFF] text-[#285688] rounded-[4px] font-bold text-[14px] uppercase transition-all active:scale-[0.98] border border-[#C2DCF7] flex items-center justify-center"
          >
            {t("Reset")}
          </button>
          <button
            onClick={handleApplyFilters}
            className="flex-1 h-[40px] bg-[#285688] text-[#FCFDFF] rounded-[4px] font-bold text-[14px] uppercase transition-all active:scale-[0.98] flex items-center justify-center shadow-lg shadow-[#285688]/20"
          >
            {t("Apply")} {filterCount > 0 ? `(${filterCount})` : ""}
          </button>
        </div>
      </div>
    </>
  );
}

export default MobileFilterModal;
