import React, { useState, useEffect } from "react";

import { X, Calendar } from "lucide-react";
import { format } from "date-fns";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

import countries from "@/constants/countries.json";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { languages } from "@/constants/constants";
import AutoComplete from "@/components/Global/AutoComplete/AutoComplete";
import MultiSelect from "@/components/Global/MultiSelect/MultiSelect";
import { GetAllUsers } from "@/api/posts";
import { GetEventCategories } from "@/api/events";

function EventsFilter({
  filters,
  updateFilter,
  sectionsList,
  setOpenFilterModal,
  hasActiveFilters,
  handleClearFilters,
}) {
  const { t } = useTranslation();
  const [dateOpen, setDateOpen] = useState(false);
  const [writersList, setWritersList] = useState([]);
  const [categoriesList, setCategoriesList] = useState([]);

  const getWriters = async (searchVal = "") => {
    try {
      const res = await GetAllUsers(searchVal);
      setWritersList(res?.data?.results);
    } catch (error) {
      console.error(error);
    }
  };

  const loadCategories = async () => {
    try {
      const res = await GetEventCategories(100, 0, "");
      setCategoriesList(res?.data?.results || []);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getWriters();
    loadCategories();
  }, []);

  return (
    <div className="w-full lg:w-80 flex-shrink-0">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-5 lg:p-6">
        {/* Start Section Filter */}
        <div className="mb-2 lg:mb-5">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm sm:text-base font-medium text-gray-900">
              {t("Sections")}
            </h3>
          </div>
          <MultiSelect
            items={sectionsList}
            selected={Array.isArray(filters.section) ? filters.section : []}
            onChange={(selected) => updateFilter("section", selected)}
            placeholder={t("Select Sections")}
            renderLabel={(item) => item?.name || item}
            renderValue={(item) => item?.name || item}
            searchable={true}
          />
        </div>
        {/* End Section Filter */}

        {/* Start Category Filter */}
        <div className="mb-2 lg:mb-5">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm sm:text-base font-medium text-gray-900">
              {t("Report Type")}
            </h3>
          </div>
          <MultiSelect
            items={[{ name: "videos" }, { name: "reports" }]}
            selected={
              Array.isArray(filters.report_type) ? filters.report_type : []
            }
            onChange={(selected) => updateFilter("report_type", selected)}
            placeholder={t("Select Type")}
            renderLabel={(item) => t(item?.name)}
            renderValue={(item) => item?.name}
            searchable={true}
          />
        </div>
        {/* End Category Filter */}
        {/* Start Category Filter */}
        <div className="mb-2 lg:mb-5">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm sm:text-base font-medium text-gray-900">
              {t("Category")}
            </h3>
          </div>
          <MultiSelect
            items={categoriesList}
            selected={Array.isArray(filters.category) ? filters.category : []}
            onChange={(selected) => updateFilter("category", selected)}
            placeholder={t("Select Category")}
            renderLabel={(item) => item?.name || item}
            renderValue={(item) => item?.name || item}
            searchable={true}
          />
        </div>
        {/* End Category Filter */}

        {/* Start Writer Filter */}
        <div className="mb-2 lg:mb-5">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm sm:text-base font-medium text-gray-900">
              {t("Writer")}
            </h3>
          </div>
          <AutoComplete
            placeholder={t("Select Writer")}
            customStyle="bg-white"
            selectedItems={Array.isArray(filters.writer) ? filters.writer : []}
            multiple={true}
            onSelect={(item) => {
              updateFilter("writer", item);
            }}
            onClear={() => {
              updateFilter("writer", []);
            }}
            searchMethod={getWriters}
            searchApi={true}
            list={writersList}
            searchPlaceholder={t("Search writers...")}
            required={false}
            renderItemLabel={(item) => item.username}
            renderItemSubLabel={(item) => item.groups?.[0]}
            showWriterAvatar={false}
          />
        </div>
        {/* End Writer Filter */}

        {/* Start Country Filter */}
        <div className="mb-2 lg:mb-5">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm sm:text-base font-medium text-gray-900">
              {t("Country")}
            </h3>
          </div>
          <MultiSelect
            items={countries}
            selected={Array.isArray(filters.country) ? filters.country : []}
            onChange={(selected) => updateFilter("country", selected)}
            placeholder={t("Select Country")}
            renderLabel={(item) => item?.name || item}
            renderValue={(item) => item?.name || item}
            searchable={true}
          />
        </div>
        {/* End Country Filter */}

        {/* Start Language Filter */}
        <div className="mb-2 lg:mb-5">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm lg:text-lg lg:font-semibold text-text">
              {t("Language")}
            </h3>
          </div>
          <MultiSelect
            items={languages}
            selected={Array.isArray(filters.language) ? filters.language : []}
            onChange={(selected) => updateFilter("language", selected)}
            placeholder={t("Select Language")}
            renderLabel={(item) => t(item)}
            renderValue={(item) => item}
            searchable={true}
          />
        </div>
        {/* End Language Filter */}

        {/* Start Date */}
        <div className="mb-3">
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
                    !filters.happened_at && "text-muted-foreground"
                  )}
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  {filters.happened_at ? (
                    format(new Date(filters.happened_at), "dd-MM-yyyy")
                  ) : (
                    <span>{t("Pick Happened Date")}</span>
                  )}
                </Button>
              </PopoverTrigger>

              <PopoverContent className="w-auto p-0" align="start">
                <CalendarComponent
                  mode="single"
                  selected={
                    filters.happened_at
                      ? new Date(filters.happened_at)
                      : undefined
                  }
                  onSelect={(date) => {
                    if (!date) return;
                    date.setHours(12);
                    updateFilter("happened_at", format(date, "yyyy-MM-dd"));
                    setDateOpen(false);
                  }}
                  disabled={(date) =>
                    date > new Date() || date < new Date("1900-01-01")
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>

            {filters.happened_at && (
              <button
                onClick={() => updateFilter("happened_at", null)}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full transition-colors"
                type="button"
              >
                <X className="h-4 w-4 text-red-500" />
              </button>
            )}
          </div>
        </div>
        {/* End Date */}

        {/* Clear Filters Button */}
        <div className="mb-4 ">
          {hasActiveFilters && (
            <div className="mt-4">
              <Button
                variant="outline"
                onClick={handleClearFilters}
                className="w-full text-red-600 border-red-600 hover:bg-red-50"
              >
                {t("Clear All Filters")}
              </Button>
            </div>
          )}
          {/* <Button
              size="sm"
              className="bg-primary hover:bg-white text-white hover:text-primary text-xs sm:text-sm px-3 py-2 flex-1 sm:flex-none"
              onClick={() => {
                toast.success(t("Filters applied successfully"));
                if (setOpenFilterModal) setOpenFilterModal(false);
              }}
            >
              {t("Apply")}
            </Button> */}
        </div>
      </div>
    </div>
  );
}

export default EventsFilter;
