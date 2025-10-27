import React, { useState } from "react";

import { ChevronDown, X, Calendar } from "lucide-react";
import { format } from "date-fns";
import { useTranslation } from "react-i18next";

import Modal from "@/components/Global/Modal/Modal";
import FilterDatePickerModal from "@/components/ForPages/Videos/FilterDatePickerModal/FilterDatePickerModal";
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
}) {
  const { t } = useTranslation();
  const [isDateModalOpen, setIsDateModalOpen] = useState(false);
  const [dateOpen, setDateOpen] = useState(false);

  const clearDateFilter = () => {
    setHappenedAt(null);
  };

  const handleDateSelection = (dateSelection) => {
    if (dateSelection.selection && dateSelection.selection.startDate) {
      // Format date as YYYY-MM-DD for API
      const formattedDate = format(
        dateSelection.selection.startDate,
        "yyyy-MM-dd"
      );
      setHappenedAt(formattedDate);
    }
    setIsDateModalOpen(false);
  };
  return (
    <div className="w-full lg:w-80 flex-shrink-0">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-5 lg:p-6">
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
              <span className="text-xs sm:text-sm text-gray-700">
                {t("All content")}
              </span>
              <span className="text-xs bg-gray-100 px-2 py-1 rounded">169</span>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <input
                type="checkbox"
                id="full-videos"
                checked={contentType.includes("Full Videos")}
                className="rounded border-gray-300 w-4 h-4"
                onChange={(e) => {
                  if (e.target.checked) {
                    setContentType((prev) => [...prev, "Full Videos"]);
                  } else {
                    setContentType((prev) =>
                      prev.filter((type) => type !== "Full Videos")
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
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                111
              </span>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <input
                type="checkbox"
                id="unit-video"
                checked={contentType.includes("Unit Video")}
                className="rounded border-gray-300 w-4 h-4"
                onChange={(e) => {
                  if (e.target.checked) {
                    setContentType((prev) => [...prev, "Unit Video"]);
                  } else {
                    setContentType((prev) =>
                      prev.filter((type) => type !== "Unit Video")
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
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                58
              </span>
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

          <div className="space-y-2 sm:space-y-3">
            {categoriesList && categoriesList.length > 0 ? (
              categoriesList.map((category) => (
                <div
                  key={category.id}
                  className="flex items-center gap-2 sm:gap-3"
                >
                  <input
                    type="checkbox"
                    id={`category-${category.id}`}
                    checked={indexCategory.includes(category.name)}
                    className="rounded border-gray-300 w-4 h-4"
                    onChange={(e) => {
                      if (e.target.checked) {
                        setIndexCategory((prev) => [...prev, category.name]);
                      } else {
                        setIndexCategory((prev) =>
                          prev.filter((name) => name !== category.name)
                        );
                      }
                    }}
                  />
                  <label
                    htmlFor={`category-${category.id}`}
                    className="text-xs sm:text-sm text-gray-700 flex-1 cursor-pointer"
                  >
                    {t(category.name)}
                  </label>
                  <span
                    className={`text-xs px-2 py-1 rounded ${
                      indexCategory.includes(category.name)
                        ? "bg-blue-100 text-blue-800"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {category.count || 0}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-xs sm:text-sm text-gray-500 text-center py-2">
                {t("No categories available")}
              </p>
            )}
          </div>
        </div>

        {/* Language Filter */}
        <div className="mb-4 sm:mb-5 lg:mb-6">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <h3 className="text-sm sm:text-base font-medium text-gray-900">
              {t("Language")}
            </h3>
            <ChevronDown className="w-4 h-4 text-gray-500" />
          </div>

          <div className="space-y-2 sm:space-y-3">
            {languages && languages.length > 0 ? (
              languages.map((lan) => (
                <div key={lan} className="flex items-center gap-2 sm:gap-3">
                  <input
                    type="checkbox"
                    id={`category-${lan}`}
                    checked={languageContent.includes(lan)}
                    className="rounded border-gray-300 w-4 h-4"
                    onChange={(e) => {
                      if (e.target.checked) {
                        setLanguageContent((prev) => [...prev, lan]);
                      } else {
                        setLanguageContent((prev) =>
                          prev.filter((name) => name !== lan)
                        );
                      }
                    }}
                  />
                  <label
                    htmlFor={`category-${lan}`}
                    className="text-xs sm:text-sm text-gray-700 flex-1 cursor-pointer"
                  >
                    {t(lan)}
                  </label>
                  {/* Start Count */}
                  {/* <span
                    className={`text-xs px-2 py-1 rounded ${
                      indexCategory.includes(lan)
                        ? "bg-blue-100 text-blue-800"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {lan || 0}
                  </span> */}
                  {/* End Count */}
                </div>
              ))
            ) : (
              <p className="text-xs sm:text-sm text-gray-500 text-center py-2">
                {t("No categories available")}
              </p>
            )}
          </div>
        </div>
        {/* Start Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
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
      </div>
      {/* DatePicker Modal  */}
      <Modal
        isOpen={isDateModalOpen}
        onClose={() => setIsDateModalOpen(false)}
        title={t("Select Date")}
      >
        <FilterDatePickerModal
          setIsDateModalOpen={setIsDateModalOpen}
          selectedDateRange={{
            startDate: happenedAt ? new Date(happenedAt) : null,
            endDate: null,
          }}
          setSelectedDateRange={(range) => {
            if (range.startDate) {
              setHappenedAt(format(range.startDate, "yyyy-MM-dd"));
            }
          }}
          clearDateFilter={clearDateFilter}
          handleDateSelection={handleDateSelection}
        />
      </Modal>
      {/* End DatePicker Modal  */}
    </div>
  );
}

export default VideoFilter;
