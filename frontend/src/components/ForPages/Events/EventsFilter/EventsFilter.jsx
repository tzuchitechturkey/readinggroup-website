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
import { GetAllUsers } from "@/api/posts";
import { GetEventCategories } from "@/api/events";

function EventsFilter({
  filters,
  updateFilter,
  sectionsList,
  setOpenFilterModal,
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

  const clearAllFilters = () => {
    updateFilter("search", "");
    updateFilter("section", "");
    updateFilter("category", "");
    updateFilter("country", "");
    updateFilter("writer", "");
    updateFilter("language", "");
    updateFilter("happened_at", null);
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
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {sectionsList.map((section) => (
              <div key={section.id} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id={`section-${section.id}`}
                  checked={filters.section === section.name}
                  className="w-4 h-4 appearance-none border-2 border-gray-300 rounded-sm checked:bg-blue-600 checked:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 relative checked:after:content-[\'\'] checked:after:text-white checked:after:text-xs checked:after:absolute checked:after:-top-[2px] checked:after:left-0.5 checked:after:font-bold"
                  onChange={(e) => {
                    if (e.target.checked) {
                      updateFilter("section", section.name);
                    } else {
                      updateFilter("section", "");
                    }
                  }}
                />
                <label
                  htmlFor={`section-${section.id}`}
                  className="text-xs sm:text-sm text-gray-700 cursor-pointer"
                >
                  {section.name}
                </label>
              </div>
            ))}
          </div>
        </div>
        {/* End Section Filter */}

        {/* Start Category Filter */}
        <div className="mb-2 lg:mb-5">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm sm:text-base font-medium text-gray-900">
              {t("Category")}
            </h3>
          </div>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {categoriesList.map((category) => (
              <div key={category.id} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id={`category-${category.id}`}
                  checked={filters.category === category.name}
                  className="w-4 h-4 appearance-none border-2 border-gray-300 rounded-sm checked:bg-blue-600 checked:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 relative checked:after:content-[\'\'] checked:after:text-white checked:after:text-xs checked:after:absolute checked:after:-top-[2px] checked:after:left-0.5 checked:after:font-bold"
                  onChange={(e) => {
                    if (e.target.checked) {
                      updateFilter("category", category.name);
                    } else {
                      updateFilter("category", "");
                    }
                  }}
                />
                <label
                  htmlFor={`category-${category.id}`}
                  className="text-xs sm:text-sm text-gray-700 cursor-pointer"
                >
                  {category.name}
                </label>
              </div>
            ))}
          </div>
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
            selectedItem={filters.writer}
            onSelect={(item) => {
              updateFilter("writer", item?.username || "");
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
          <div>
            <select
              value={filters.country}
              onChange={(e) => updateFilter("country", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="" disabled hidden >{t("Select Country")}</option>
              {countries.map((country) => (
                <option key={country.code} value={country.name}>
                  {country.name}
                </option>
              ))}
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
              value={filters.language}
              onChange={(e) => updateFilter("language", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="" disabled hidden >{t("Select Language")}</option>
              {languages.map((lang) => (
                <option key={lang.code} value={lang}>
                  {t(lang)}
                </option>
              ))}
            </select>
          </div>
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
                if (setOpenFilterModal) setOpenFilterModal(false);
              }}
            >
              {t("Apply")}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EventsFilter;
