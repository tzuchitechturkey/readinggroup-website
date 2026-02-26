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
}) {
  const { t, i18n } = useTranslation();
  const [localFilters, setLocalFilters] = useState(filters);
  const [localSelectedCategories, setLocalSelectedCategories] = useState(selectedCategories);
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
    onVideoTypeChange(localFilters.videoType[0]);
    onSortByChange(localFilters.sortBy);

    if (localFilters.date.year && localFilters.date.month) {
      const formattedDate = `${localFilters.date.year}-${String(
        localFilters.date.month,
      ).padStart(2, "0")}`;
      onApplyDateFilter();
    }

    const categoriesToRemove = selectedCategories.filter(
      (cat) => !localSelectedCategories.includes(cat)
    );
    const categoriesToAdd = localSelectedCategories.filter(
      (cat) => !selectedCategories.includes(cat)
    );

    categoriesToRemove.forEach((cat) => onCategorySelect(cat));
    categoriesToAdd.forEach((cat) => onCategorySelect(cat));

    onClose();
  };

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40 flex "
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className="fixed inset-x-0 bottom-10  bg-[#D7EAFF] z-50 max-h-[90vh]  overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-[#D7EAFF] border-b border-gray-300 px-6 py-4 flex items-center justify-between rounded-t-3xl">
          <h2 className="text-lg font-bold text-[#081945]">{t("Filter")}</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-300 rounded-lg transition-colors"
          >
            <X size={20} className="text-[#081945]" />
          </button>
        </div>

        {/* Filter Content */}
        <div className="px-6 py-6 space-y-6">
          {/* Video Type Filter */}
          <div>
            <h3 className=" font-bold text-[#081945] mb-3">
              {t("Video Type")}
            </h3>
            <div className="space-y-2">
              <label className="flex items-center gap-3 cursor-pointer bg-[#D7EAFF] p-2 rounded">
                <input
                  type="radio"
                  name="videoType"
                  value="all"
                  checked={localFilters.videoType.includes("all")}
                  onChange={() =>
                    setLocalFilters((prev) => ({
                      ...prev,
                      videoType: ["all"],
                    }))
                  }
                  className="w-5 h-5 appearance-none rounded-full border-2 border-[#285688] bg-[#D7EAFF] cursor-pointer checked:bg-[#285688] checked:border-[#285688] checked:shadow-[inset_0_0_0_3px_#D7EAFF]"
                />
                <span className="text-sm text-[#285688]">{t("All")}</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer bg-[#D7EAFF] p-2 rounded">
                <input
                  type="radio"
                  name="videoType"
                  value="livestream"
                  checked={localFilters.videoType.includes("livestream")}
                  onChange={() =>
                    setLocalFilters((prev) => ({
                      ...prev,
                      videoType: ["livestream"],
                    }))
                  }
                  className="w-5 h-5 appearance-none rounded-full border-2 border-[#285688] bg-[#D7EAFF] cursor-pointer checked:bg-[#285688] checked:border-[#285688] checked:shadow-[inset_0_0_0_3px_#D7EAFF]"
                />
                <span className="text-sm text-[#285688]">
                  {t("Livestream")}
                </span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer bg-[#D7EAFF] p-2 rounded">
                <input
                  type="radio"
                  name="videoType"
                  value="clips"
                  checked={localFilters.videoType.includes("clips")}
                  onChange={() =>
                    setLocalFilters((prev) => ({
                      ...prev,
                      videoType: ["clips"],
                    }))
                  }
                  className="w-5 h-5 appearance-none rounded-full border-2 border-[#285688] bg-[#D7EAFF] cursor-pointer checked:bg-[#285688] checked:border-[#285688] checked:shadow-[inset_0_0_0_3px_#D7EAFF]"
                />
                <span className="text-sm text-[#285688]">{t("Clip")}</span>
              </label>
            </div>
          </div>

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

              {/* Month and Year Dropdowns */}
              <div className="">
                <label className="flex items-center gap-2 cursor-pointer bg-[#D7EAFF] p-2 rounded">
                  <input
                    type="radio"
                    name="date"
                    value="specific"
                    checked={localFilters.date.month !== null}
                    onChange={() => {
                      setLocalFilters((prev) => ({
                        ...prev,
                        date: { year: 2026, month: 1 },
                      }));
                    }}
                    className="w-5 h-5 appearance-none rounded-full border-2 border-[#285688] bg-[#D7EAFF] cursor-pointer checked:bg-[#285688] checked:border-[#285688] checked:shadow-[inset_0_0_0_3px_#D7EAFF]"
                  />
                  <span className="text-sm text-[#285688]">
                    {t("Month & Year")}
                  </span>
                </label>

                {localFilters.date.month !== null && (
                  <div className="flex items-center justify-between mt-4 gap-2">
                    {/* Month Dropdown */}
                    <div className="relative w-1/2">
                      <button
                        onClick={() => setMonthDropdownOpen(!monthDropdownOpen)}
                        className="w-full px-3 py-2 bg-white border border-gray-300 rounded-full flex items-center justify-between text-sm text-[#285688]"
                      >
                        <span>
                          {currentMonth
                            ? t(currentMonth.label)
                            : t("Select Month")}
                        </span>
                        <ChevronDown
                          size={16}
                          className={`transform transition-transform ${
                            monthDropdownOpen ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                      {monthDropdownOpen && (
                        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg z-10 max-h-48 overflow-y-auto">
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
                              className="w-full text-left px-3 py-2 text-sm text-[#081945] hover:bg-gray-100"
                            >
                              {t(month.label)}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Year Dropdown */}
                    <div className="relative w-1/2">
                      <button
                        onClick={() => setYearDropdownOpen(!yearDropdownOpen)}
                        className="w-full px-3 py-2 bg-white border border-gray-300 rounded-full flex items-center justify-between text-sm text-[#285688]"
                      >
                        <span>{localFilters.date.year}</span>
                        <ChevronDown
                          size={16}
                          className={`transform transition-transform ${
                            yearDropdownOpen ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                      {yearDropdownOpen && (
                        <div className="absolute top-full right-0 mt-1 bg-white border border-gray-300 rounded-lg z-10 max-h-48 overflow-y-auto">
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
                              className="w-full text-left px-3 py-2 text-sm text-[#081945] hover:bg-gray-100"
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
          </div>

          {/* Sort By Filter */}
          <div>
            <h3 className="text-sm font-semibold text-[#081945] mb-3">
              {t("Sort By")}
            </h3>
            <div className="space-y-2">
              <label className="flex items-center gap-3 cursor-pointer bg-[#D7EAFF] p-2 rounded">
                <input
                  type="radio"
                  name="sortBy"
                  value="newest"
                  checked={localFilters.sortBy === "newest"}
                  onChange={() =>
                    setLocalFilters((prev) => ({
                      ...prev,
                      sortBy: "newest",
                    }))
                  }
                  className="w-5 h-5 appearance-none rounded-full border-2 border-[#285688] bg-[#D7EAFF] cursor-pointer checked:bg-[#285688] checked:border-[#285688] checked:shadow-[inset_0_0_0_3px_#D7EAFF]"
                />
                <span className="text-sm text-[#081945]">{t("Newest")}</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer bg-[#D7EAFF] p-2 rounded">
                <input
                  type="radio"
                  name="sortBy"
                  value="oldest"
                  checked={localFilters.sortBy === "oldest"}
                  onChange={() =>
                    setLocalFilters((prev) => ({
                      ...prev,
                      sortBy: "oldest",
                    }))
                  }
                  className="w-5 h-5 appearance-none rounded-full border-2 border-[#285688] bg-[#D7EAFF] cursor-pointer checked:bg-[#285688] checked:border-[#285688] checked:shadow-[inset_0_0_0_3px_#D7EAFF]"
                />
                <span className="text-sm text-[#081945]">{t("Oldest")}</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer bg-[#D7EAFF] p-2 rounded">
                <input
                  type="radio"
                  name="sortBy"
                  value="most_popular"
                  checked={localFilters.sortBy === "most_popular"}
                  onChange={() =>
                    setLocalFilters((prev) => ({
                      ...prev,
                      sortBy: "most_popular",
                    }))
                  }
                  className="w-5 h-5 appearance-none rounded-full border-2 border-[#285688] bg-[#D7EAFF] cursor-pointer checked:bg-[#285688] checked:border-[#285688] checked:shadow-[inset_0_0_0_3px_#D7EAFF]"
                />
                <span className="text-sm text-[#081945]">
                  {t("Most Popular")}
                </span>
              </label>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-sm font-semibold text-[#081945] mb-3">
              {t("Topics")}
            </h3>
            <div className="flex flex-wrap gap-2">
              {activeCategories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => {
                    setLocalSelectedCategories((prev) => {
                      if (prev.includes(category.id)) {
                        return prev.filter((id) => id !== category.id);
                      } 
                        return [...prev, category.id];
                      
                    });
                  }}
                  className={`px-3 py-1 rounded-full flex items-center gap-2 text-xs font-medium transition-colors ${
                    localSelectedCategories.includes(category.id)
                      ? "bg-[#285688] text-white"
                      : "bg-white text-[#081945] border border-gray-300"
                  }`}
                >
                  <span>{category.name}</span>
                  {localSelectedCategories.includes(category.id) && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setLocalSelectedCategories((prev) =>
                          prev.filter((id) => id !== category.id)
                        );
                      }}
                      className={`p-1 rounded-full transition-colors ${
                        localSelectedCategories.includes(category.id)
                          ? "hover:bg-[#1e4157] text-white"
                          : "hover:bg-gray-100 text-[#081945]"
                      }`}
                    >
                      <X size={16} className="ml-1 text-white" />
                    </button>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="sticky bottom-0 bg-[#D7EAFF] border-t border-gray-300 px-6 py-4 flex gap-3">
          <button
            onClick={() => {
              onResetFilters();
              setLocalSelectedCategories([]);
              setLocalFilters(filters);
              onClose();
            }}
            className="flex-1 px-4 py-3 bg-white text-[#081945] rounded-lg font-semibold hover:bg-gray-100 transition-colors border border-gray-300"
          >
            {t("Reset")}
          </button>
          <button
            onClick={handleApplyFilters}
            className="flex-1 px-4 py-3 bg-[#285688] text-white rounded-lg font-semibold hover:bg-[#1e4157] transition-colors"
          >
            {t("Apply All")}
          </button>
        </div>
      </div>
    </>
  );
}

export default MobileFilterModal;
