import React, { useState } from "react";

import { ChevronDown, X, Calendar } from "lucide-react";
import { format } from "date-fns";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

import Modal from "@/components/Global/Modal/Modal";
import FilterDatePickerModal from "@/components/ForPages/Videos/FilterDatePickerModal/FilterDatePickerModal";
import { Button } from "@/components/ui/button";

function VideoFilter({
  selectedDateRange,
  setSelectedDateRange,
  setContentType,
  setIndexSubject,
  setLanguageContent,
  setOpenFilterModal,
}) {
  const { t } = useTranslation();
  const [isDateModalOpen, setIsDateModalOpen] = useState(false);
  const clearDateFilter = () => {
    setSelectedDateRange({ startDate: null, endDate: null });
  };

  const handleDateSelection = (dateSelection) => {
    if (dateSelection.selection) {
      setSelectedDateRange({
        startDate: dateSelection.selection.startDate,
        endDate: dateSelection.selection.endDate,
      });
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
                defaultChecked
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
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                111
              </span>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <input
                type="checkbox"
                id="unit-video"
                defaultChecked
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
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                58
              </span>
            </div>
          </div>
        </div>

        {/* Index Subject */}
        <div className="mb-4 sm:mb-5 lg:mb-6">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <h3 className="text-sm sm:text-base font-medium text-gray-900">
              {t("Index Subject")}
            </h3>
            <ChevronDown className="w-4 h-4 text-gray-500" />
          </div>

          <div className="space-y-2 sm:space-y-3">
            <div className="flex items-center gap-2 sm:gap-3">
              <input
                type="checkbox"
                id="health"
                defaultChecked
                className="rounded border-gray-300 w-4 h-4"
                onChange={(e) => {
                  if (e.target.checked) {
                    setIndexSubject((prev) => [...prev, "health"]);
                  } else {
                    setIndexSubject((prev) =>
                      prev.filter((type) => type !== "health")
                    );
                  }
                }}
              />
              <label
                htmlFor="health"
                className="text-xs sm:text-sm text-gray-700 flex-1"
              >
                {t("Health")}
              </label>
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                113
              </span>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <input
                type="checkbox"
                id="environment"
                defaultChecked
                className="rounded border-gray-300 w-4 h-4"
                onChange={(e) => {
                  if (e.target.checked) {
                    setIndexSubject((prev) => [...prev, "environment"]);
                  } else {
                    setIndexSubject((prev) =>
                      prev.filter((type) => type !== "environment")
                    );
                  }
                }}
              />
              <label
                htmlFor="environment"
                className="text-xs sm:text-sm text-gray-700 flex-1"
              >
                {t("Environment")}
              </label>
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                56
              </span>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <input
                type="checkbox"
                id="education"
                className="rounded border-gray-300 w-4 h-4"
                onChange={(e) => {
                  if (e.target.checked) {
                    setIndexSubject((prev) => [...prev, "education"]);
                  } else {
                    setIndexSubject((prev) =>
                      prev.filter((type) => type !== "education")
                    );
                  }
                }}
              />
              <label
                htmlFor="education"
                className="text-xs sm:text-sm text-gray-700 flex-1"
              >
                {t("Education")}
              </label>
              <span className="text-xs bg-gray-100 px-2 py-1 rounded">45</span>
            </div>
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
            <div className="flex items-center gap-2 sm:gap-3">
              <input
                type="checkbox"
                id="arabic"
                defaultChecked
                className="rounded border-gray-300 w-4 h-4"
                onChange={(e) => {
                  if (e.target.checked) {
                    setLanguageContent((prev) => [...prev, "ar"]);
                  } else {
                    setLanguageContent((prev) =>
                      prev.filter((type) => type !== "ar")
                    );
                  }
                }}
              />
              <label
                htmlFor="arabic"
                className="text-xs sm:text-sm text-gray-700 flex-1"
              >
                {t("Arabic")}
              </label>
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                113
              </span>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <input
                type="checkbox"
                id="chinese"
                defaultChecked
                className="rounded border-gray-300 w-4 h-4"
                onChange={(e) => {
                  if (e.target.checked) {
                    setLanguageContent((prev) => [...prev, "ch"]);
                  } else {
                    setLanguageContent((prev) =>
                      prev.filter((type) => type !== "ch")
                    );
                  }
                }}
              />
              <label
                htmlFor="chinese"
                className="text-xs sm:text-sm text-gray-700 flex-1"
              >
                {t("Chinese")}
              </label>
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                56
              </span>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <input
                type="checkbox"
                id="japanese"
                className="rounded border-gray-300 w-4 h-4"
                onChange={(e) => {
                  if (e.target.checked) {
                    setLanguageContent((prev) => [...prev, "jp"]);
                  } else {
                    setLanguageContent((prev) =>
                      prev.filter((type) => type !== "jp")
                    );
                  }
                }}
              />
              <label
                htmlFor="japanese"
                className="text-xs sm:text-sm text-gray-700 flex-1"
              >
                {t("Japanese")}
              </label>
              <span className="text-xs bg-gray-100 px-2 py-1 rounded">45</span>
            </div>
          </div>
        </div>

        {/* Date Filter */}
        <div className="">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <button
              onClick={() => setIsDateModalOpen(true)}
              className="flex items-center gap-2 text-sm sm:text-base font-medium text-gray-900 hover:text-blue-600 transition-colors"
            >
              <Calendar className="w-4 h-4" />
              {t("Date")}
            </button>
            <ChevronDown className="w-4 h-4 text-gray-500" />
          </div>

          {/* Selected Date Display */}
          {(selectedDateRange.startDate || selectedDateRange.endDate) && (
            <div className="mb-3 p-2 sm:p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-start sm:items-center justify-between gap-2">
                <div className="text-xs sm:text-sm text-blue-800 flex-1 min-w-0 break-words">
                  {selectedDateRange.startDate && selectedDateRange.endDate
                    ? `${format(
                        selectedDateRange.startDate,
                        "MMM dd"
                      )} - ${format(selectedDateRange.endDate, "MMM dd, yyyy")}`
                    : selectedDateRange.startDate
                    ? format(selectedDateRange.startDate, "MMM dd, yyyy")
                    : format(selectedDateRange.endDate, "MMM dd, yyyy")}
                </div>
                <button
                  onClick={() =>
                    setSelectedDateRange({
                      startDate: null,
                      endDate: null,
                    })
                  }
                  className="text-blue-600 hover:text-red-600 transition-colors p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 sm:gap-3">
            <Button
              variant="outline"
              size="sm"
              className="text-gray-600 text-xs sm:text-sm px-3 py-2"
              onClick={() =>
                setSelectedDateRange({ startDate: null, endDate: null })
              }
            >
              {t("Reset")}
            </Button>
            <Button
              size="sm"
              className="bg-primary hover:bg-white text-white hover:text-primary text-xs sm:text-sm px-3 py-2 flex-1 sm:flex-none"
              onClick={() => {
                toast.success(t("Filters applied successfully"));
                setOpenFilterModal(false);
              }}
            >
              {t("Apply")}
            </Button>
          </div>
        </div>
      </div>
      {/* DatePicker Modal  */}
      <Modal
        isOpen={isDateModalOpen}
        onClose={() => setIsDateModalOpen(false)}
        title={t("Are you sure you want to send the data?")}
      >
        <FilterDatePickerModal
          setIsDateModalOpen={setIsDateModalOpen}
          selectedDateRange={selectedDateRange}
          setSelectedDateRange={setSelectedDateRange}
          clearDateFilter={clearDateFilter}
          handleDateSelection={handleDateSelection}
        />
      </Modal>
      {/* End DatePicker Modal  */}
    </div>
  );
}

export default VideoFilter;
