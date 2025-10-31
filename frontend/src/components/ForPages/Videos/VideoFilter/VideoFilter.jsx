import React, { useState } from "react";

import { ChevronDown, X, Calendar } from "lucide-react";
import { format } from "date-fns";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

import Modal from "@/components/Global/Modal/Modal";
import FilterDatePickerModal from "@/components/ForPages/Videos/FilterDatePickerModal/FilterDatePickerModal";
import MultiSelect from "@/components/Global/MultiSelect/MultiSelect";
import { Button } from "@/components/ui/button";
import { languages } from "@/constants/constants";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

function VideoFilter({
  happenedAt,
  setHappenedAt,
  setContentType,
  setIndexCategory,
  setLanguageContent,
  setOpenFilterModal,
  contentType = [],
  indexCategory = [],
  languageContent = [],
  categoriesList,
  hasActiveFilters,
  setSearchValue,
  setCurrentPage,
  setMakingSearch,
  setFilteredData,
}) {
  const { t } = useTranslation();
  const [dateOpen, setDateOpen] = useState(false);

  // Clear all filters and reset to default view
  const handleClearFilters = () => {
    setSearchValue("");
    setMakingSearch(false);
    setContentType([]);
    setIndexCategory([]);
    setLanguageContent([]);
    setHappenedAt(null);
    setCurrentPage(1);
    setFilteredData({ count: 0, results: [] });
    toast.success(t("Filters cleared"));
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

            <div className="flex items-center gap-2 sm:gap-3">
              <input
                type="checkbox"
                id="full-videos"
                checked={contentType.includes("full_video")}
                className="rounded border-gray-300 w-4 h-4"
                onChange={(e) => {
                  if (e.target.checked) {
                    setContentType((prev) => [...prev, "full_video"]);
                  } else {
                    setContentType((prev) =>
                      prev.filter((type) => type !== "full_video")
                    );
                  }
                }}
              />
              <label
                htmlFor="full-videos"
                className="text-xs sm:text-sm text-gray-700 flex-1"
              >
                {t("Full Videos")}
              </label>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <input
                type="checkbox"
                id="unit-video"
                checked={contentType.includes("unit_video")}
                className="rounded border-gray-300 w-4 h-4"
                onChange={(e) => {
                  if (e.target.checked) {
                    setContentType((prev) => [...prev, "unit_video"]);
                  } else {
                    setContentType((prev) =>
                      prev.filter((type) => type !== "unit_video")
                    );
                  }
                }}
              />
              <label
                htmlFor="unit-video"
                className="text-xs sm:text-sm text-gray-700 flex-1"
              >
                {t("Unit Video")}
              </label>
            </div>
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
            selected={Array.isArray(indexCategory) ? indexCategory : []}
            onChange={(selected) => setIndexCategory(selected)}
            placeholder={t("Select Categories")}
            renderLabel={(item) => t(item?.name || item)}
            renderValue={(item) => item?.name || item}
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
            selected={Array.isArray(languageContent) ? languageContent : []}
            onChange={(selected) => setLanguageContent(selected)}
            placeholder={t("Select Languages")}
            renderLabel={(item) => t(item?.name || item)}
            renderValue={(item) => item?.name || item}
            searchable={true}
          />
        </div>
        {/* Start Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            {t("Happened Date")}
          </label>
          <div className="relative">
            <Popover open={dateOpen} onOpenChange={setDateOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full text-left font-normal flex items-center",
                    !happenedAt && "text-muted-foreground"
                  )}
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  {happenedAt ? (
                    format(happenedAt, "dd-MM-yyyy")
                  ) : (
                    <span>{t("Pick Happened Date")}</span>
                  )}
                </Button>
              </PopoverTrigger>

              <PopoverContent className="w-auto p-0" align="start">
                <CalendarComponent
                  mode="single"
                  selected={happenedAt ? new Date(happenedAt) : undefined}
                  onSelect={(date) => {
                    if (!date) return;
                    date.setHours(12);
                    setHappenedAt(format(date, "yyyy-MM-dd"));
                    setDateOpen(false);
                  }}
                  disabled={(date) =>
                    date > new Date() || date < new Date("1900-01-01")
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>

            {happenedAt && (
              <button
                onClick={() => setHappenedAt(null)}
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
