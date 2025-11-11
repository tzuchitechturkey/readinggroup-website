import React from "react";

import { ChevronDown, X } from "lucide-react";
import { format } from "date-fns";
import { useTranslation } from "react-i18next";

import MultiSelect from "@/components/Global/MultiSelect/MultiSelect";
import { Button } from "@/components/ui/button";
import { languages } from "@/constants/constants";
import DatePickerWithYearMonth from "@/components/ForPages/Dashboard/Videos/CreateOrEditVideo/DatePickerWithYearMonth";

function VideoFilter({
  filters,
  updateFilter,
  categoriesList,
  hasActiveFilters,
  setCurrentPage,
  setFilteredData,
}) {
  const { t } = useTranslation();

  // Clear all filters and reset to default view
  const handleClearFilters = () => {
    updateFilter("searchValue", "");
    updateFilter("makingSearch", false);
    updateFilter("indexCategory", []);
    updateFilter("languageContent", []);
    updateFilter("happenedAt", null);
    updateFilter("isFeatured", null);
    updateFilter("isNew", null);
    setCurrentPage(1);
    setFilteredData({ count: 0, results: [] });
  };

  return (
    <div className="w-full lg:w-80 flex-shrink-0 ">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-5 lg:p-6 lg:pb-7 ">
        {/* Side Filtration */}
        <div className="mb-4 sm:mb-5 lg:mb-6">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <h3 className="text-base sm:text-lg font-semibold text-text">
              {t("Side Filtration")}
            </h3>
            <ChevronDown className="w-4 h-4 text-gray-500" />
          </div>

          {/* Content Type Filter */}
          <div className="space-y-2 sm:space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm sm:text-base font-medium text-gray-900">
                {t("Content Type")}
              </h3>
            </div>

            {/* Start Is Featured */}
            <div className="flex items-center gap-2 sm:gap-3">
              <input
                type="checkbox"
                id="is_featured"
                checked={filters.isFeatured === true}
                className="rounded border-gray-300 w-4 h-4"
                onChange={(e) => {
                  updateFilter("isFeatured", e.target.checked ? true : null);
                }}
              />
              <label
                htmlFor="is_featured"
                className="text-xs sm:text-sm text-gray-700 flex-1"
              >
                {t("Is Featured")}
              </label>
            </div>
            {/* End Is Featured */}

            {/* Start Is New */}
            <div className="flex items-center gap-2 sm:gap-3">
              <input
                type="checkbox"
                id="is_new"
                checked={filters.isNew === true}
                className="rounded border-gray-300 w-4 h-4"
                onChange={(e) => {
                  updateFilter("isNew", e.target.checked ? true : null);
                }}
              />
              <label
                htmlFor="is_new"
                className="text-xs sm:text-sm text-gray-700 flex-1"
              >
                {t("Is New")}
              </label>
            </div>
            {/* End Is New */}
          </div>
        </div>

        {/* Index Category */}
        <div className="mb-4 sm:mb-5 lg:mb-6">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <h3 className="text-sm sm:text-base font-medium text-gray-900">
              {t("Categories")}
            </h3>
            <ChevronDown className="w-4 h-4 text-gray-500" />
          </div>

          <MultiSelect
            items={categoriesList || []}
            selected={
              Array.isArray(filters.indexCategory) ? filters.indexCategory : []
            }
            onChange={(selected) => updateFilter("indexCategory", selected)}
            placeholder={t("Select Category")}
            renderLabel={(item) => t(item?.name || item)}
            renderValue={(item) => t(item?.name) || item}
            searchable={true}
          />
        </div>

        {/* Language Filter */}
        <div className="mb-4 sm:mb-5 lg:mb-6">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <h3 className="text-sm sm:text-base font-medium text-gray-900">
              {t("Language")}
            </h3>
            <ChevronDown className="w-4 h-4 text-gray-500" />
          </div>

          <MultiSelect
            items={languages?.map((lang) => ({ name: lang })) || []}
            selected={
              Array.isArray(filters.languageContent)
                ? filters.languageContent
                : []
            }
            onChange={(selected) => updateFilter("languageContent", selected)}
            placeholder={t("Select Language")}
            renderLabel={(item) => t(item?.name || item)}
            renderValue={(item) => t(item?.name) || item}
            searchable={true}
          />
        </div>
        {/* Start Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            {t("Happened Date")}
          </label>
          <div className="relative">
            <DatePickerWithYearMonth
              value={filters.happenedAt}
              onChange={(date) => {
                if (!date) return;
                date.setHours(12);
                updateFilter("happenedAt", format(date, "yyyy-MM-dd"));
              }}
              placeholder="Pick Happened Date"
            />

            {filters.happenedAt && (
              <button
                onClick={() => updateFilter("happenedAt", null)}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full transition-colors"
                type="button"
              >
                <X className="h-4 w-4 text-red-500" />
              </button>
            )}
          </div>
        </div>
        {/* End Date */}

        {/* Start Clear Filters Button */}
        {hasActiveFilters && (
          <div className="mt-4">
            <Button
              variant="outline"
              onClick={handleClearFilters}
              className="text-red-600 border-red-600 hover:bg-red-50 w-full"
            >
              {t("Clear All Filters")}
            </Button>
          </div>
        )}
        {/* End Clear Filters Button */}
      </div>
    </div>
  );
}

export default VideoFilter;
