import React, { useState } from "react";

import { ChevronDown, X, Calendar } from "lucide-react";
import { format } from "date-fns";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

import Modal from "@/components/Global/Modal/Modal";
import FilterDatePickerModal from "@/components/ForPages/Videos/FilterDatePickerModal/FilterDatePickerModal";
import { Button } from "@/components/ui/button";

function EventsFilter({
  selectedDateRange,
  setSelectedDateRange,
  selectedWriter,
  setSelectedWriter,
  selectedCountry,
  setSelectedCountry,
  selectedContentType,
  setSelectedContentType,
  selectedLanguage,
  setSelectedLanguage,
  selectedDuration,
  setSelectedDuration,
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

  const clearAllFilters = () => {
    setSelectedWriter("");
    setSelectedCountry("");
    setSelectedContentType("");
    setSelectedLanguage("");
    setSelectedDuration("");
    setSelectedDateRange({ startDate: null, endDate: null });
  };

  return (
    <div className="w-full lg:w-80 flex-shrink-0">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-5 lg:p-6">
        {/* Start Content Type Filter */}
        <div className="mb-2 lg:mb-5">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm sm:text-base font-medium text-gray-900">
              {t("Content Type")}
            </h3>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <input
                type="radio"
                id="all-content"
                name="contentType"
                checked={!selectedContentType}
                className="w-4 h-4 appearance-none border-2 border-gray-300 rounded-sm checked:bg-blue-600 checked:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 relative checked:after:content-['✓'] checked:after:text-white checked:after:text-xs checked:after:absolute checked:after:-top-[2px] checked:after:left-0.5 checked:after:font-bold"
                onChange={() => setSelectedContentType("")}
              />
              <label
                htmlFor="all-content"
                className="text-xs sm:text-sm text-gray-700"
              >
                {t("All Content")}
              </label>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="radio"
                id="video-content"
                name="contentType"
                checked={selectedContentType === "video"}
                className="w-4 h-4 appearance-none border-2 border-gray-300 rounded-sm checked:bg-blue-600 checked:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 relative checked:after:content-['✓'] checked:after:text-white checked:after:text-xs checked:after:absolute checked:after:-top-[2px] checked:after:left-0.5 checked:after:font-bold"
                onChange={() => setSelectedContentType("video")}
              />
              <label
                htmlFor="video-content"
                className="text-xs sm:text-sm text-gray-700"
              >
                {t("Videos Only")}
              </label>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="radio"
                id="news-content"
                name="contentType"
                checked={selectedContentType === "news"}
                className="w-4 h-4 appearance-none border-2 border-gray-300 rounded-sm checked:bg-blue-600 checked:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 relative checked:after:content-['✓'] checked:after:text-white checked:after:text-xs checked:after:absolute checked:after:-top-[2px] checked:after:left-0.5 checked:after:font-bold"
                onChange={() => setSelectedContentType("news")}
              />
              <label
                htmlFor="news-content"
                className="text-xs sm:text-sm text-gray-700"
              >
                {t("Reports Only")}
              </label>
            </div>
          </div>
        </div>
        {/* End Content Type Filter */}

        {/* Start Writer Filter */}
        <div className="mb-2 lg:mb-5">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm sm:text-base font-medium text-gray-900">
              {t("Writer")}
            </h3>
          </div>
          <div>
            <input
              type="text"
              placeholder={t("Search by writer...")}
              value={selectedWriter}
              onChange={(e) => setSelectedWriter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>
        {/* End Writer Filter */}

        {/* Start Country Filter */}
        <div className="mb-2 lg:mb-5">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm sm:text-base font-medium text-gray-900">
              {t("Country")}
            </h3>
          </div>
          <div>
            <select
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option disabled hidden value="">{t("All Countries")}</option>
              <option value="USA">{t("USA")}</option>
              <option value="Canada">{t("Canada")}</option>
              <option value="UK">{t("UK")}</option>
              <option value="France">{t("France")}</option>
              <option value="Germany">{t("Germany")}</option>
              <option value="China">{t("China")}</option>
              <option value="Japan">{t("Japan")}</option>
              <option value="Singapore">{t("Singapore")}</option>
            </select>
          </div>
        </div>
        {/* End Country Filter */}

        {/* Start Language Filter */}
        <div className="mb-2 lg:mb-5">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm lg:text-lg lg:font-semibold text-text">
              {t("Language")}
            </h3>
          </div>
          <div>
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option disabled hidden value="">{t("All Languages")}</option>
              <option value="en">{t("English")}</option>
              <option value="ar">{t("Arabic")}</option>
              <option value="tr">{t("Turkish")}</option>
              <option value="fr">{t("French")}</option>
              <option value="es">{t("Spanish")}</option>
            </select>
          </div>
        </div>
        {/* End Language Filter */}

        {/* Start Video Duration Filter */}
        {selectedContentType === "video" && (
          <div className="mb-2 lg:mb-5">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm lg:text-lg lg:font-semibold text-text">
                {t("Video Duration")}
              </h3>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <input
                  type="radio"
                  id="all-duration"
                  name="duration"
                  checked={!selectedDuration}
                  className="w-4 h-4 appearance-none border-2 border-gray-300 rounded-sm checked:bg-blue-600 checked:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 relative checked:after:content-['✓'] checked:after:text-white checked:after:text-xs checked:after:absolute checked:after:-top-[2px] checked:after:left-0.5 checked:after:font-bold"
                  onChange={() => setSelectedDuration("")}
                />
                <label
                  htmlFor="all-duration"
                  className="text-xs sm:text-sm text-gray-700"
                >
                  {t("All Durations")}
                </label>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="radio"
                  id="short-duration"
                  name="duration"
                  checked={selectedDuration === "short"}
                  className="w-4 h-4 appearance-none border-2 border-gray-300 rounded-sm checked:bg-blue-600 checked:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 relative checked:after:content-['✓'] checked:after:text-white checked:after:text-xs checked:after:absolute checked:after:-top-[2px] checked:after:left-0.5 checked:after:font-bold"
                  onChange={() => setSelectedDuration("short")}
                />
                <label
                  htmlFor="short-duration"
                  className="text-xs sm:text-sm text-gray-700"
                >
                  {t("Short (< 5 minutes)")}
                </label>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="radio"
                  id="medium-duration"
                  name="duration"
                  checked={selectedDuration === "medium"}
                  className="w-4 h-4 appearance-none border-2 border-gray-300 rounded-sm checked:bg-blue-600 checked:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 relative checked:after:content-['✓'] checked:after:text-white checked:after:text-xs checked:after:absolute checked:after:-top-[2px] checked:after:left-0.5 checked:after:font-bold"
                  onChange={() => setSelectedDuration("medium")}
                />
                <label
                  htmlFor="medium-duration"
                  className="text-xs sm:text-sm text-gray-700"
                >
                  {t("Medium (5-20 minutes)")}
                </label>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="radio"
                  id="long-duration"
                  name="duration"
                  checked={selectedDuration === "long"}
                  className="w-4 h-4 appearance-none border-2 border-gray-300 rounded-sm checked:bg-blue-600 checked:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 relative checked:after:content-['✓'] checked:after:text-white checked:after:text-xs checked:after:absolute checked:after:-top-[2px] checked:after:left-0.5 checked:after:font-bold"
                  onChange={() => setSelectedDuration("long")}
                />
                <label
                  htmlFor="long-duration"
                  className="text-xs sm:text-sm text-gray-700"
                >
                  {t("Long (> 20 minutes)")}
                </label>
              </div>
            </div>
          </div>
        )}
        {/* End Video Duration Filter */}
        {/* Start Date Filter */}
        <div className="mb-2 lg:mb-5">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm lg:text-lg lg:font-semibold text-text">
              {t("Publication Date")}
            </h3>
            <ChevronDown className="w-4 h-4 text-gray-500" />
          </div>

          <div className="space-y-3">
            <Button
              onClick={() => setIsDateModalOpen(true)}
              variant="outline"
              className="w-full justify-start text-left font-normal text-xs px-1"
            >
              <Calendar className="  h-4 w-4" />
              {selectedDateRange?.startDate && selectedDateRange?.endDate ? (
                `${format(selectedDateRange.startDate, "PPP")} - ${format(
                  selectedDateRange.endDate,
                  "PPP"
                )}`
              ) : (
                <span className="text-base">{t("Pick a date range")}</span>
              )}
            </Button>

            {(selectedDateRange?.startDate || selectedDateRange?.endDate) && (
              <Button
                onClick={clearDateFilter}
                variant="ghost"
                size="sm"
                className="w-full border-[1px] border-gray-300 rounded-lg"
              >
                <X className="mr-2 h-3 w-3" />
                {t("Clear Date Filter")}
              </Button>
            )}
          </div>
        </div>
        {/* End Date Filter */}

        {/* Clear Filters Button */}
        <div className="mb-4 ">
          {/* <Button
            variant="outline"
            onClick={clearAllFilters}
            className="w-full"
          >
            {t("Clear All Filters")}
          </Button> */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 sm:gap-3 mt-7 md:mt-auto">
            <Button
              variant="outline"
              size="sm"
              className="text-gray-600 text-xs sm:text-sm px-3 py-2"
              onClick={clearAllFilters}
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

      {/* Date Picker Modal */}
      <Modal
        isOpen={isDateModalOpen}
        onClose={() => setIsDateModalOpen(false)}
        title={t("Select Date Range")}
      >
        <FilterDatePickerModal
          setIsDateModalOpen={setIsDateModalOpen}
          selectedDateRange={selectedDateRange}
          setSelectedDateRange={setSelectedDateRange}
          clearDateFilter={clearDateFilter}
          handleDateSelection={handleDateSelection}
        />
      </Modal>
    </div>
  );
}

export default EventsFilter;
