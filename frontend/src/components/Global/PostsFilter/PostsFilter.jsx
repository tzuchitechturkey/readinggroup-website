import React, { useState, useRef, useEffect } from "react";

import { Calendar, Search, ChevronDown, X, Filter } from "lucide-react";
import { format } from "date-fns";

import MultiSelect from "@/components/Global/MultiSelect/MultiSelect";
import { GetAllUsers, GetPostCategories } from "@/api/posts";
import { languages } from "@/constants/constants";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

import Loader from "../Loader/Loader";
import AutoComplete from "../AutoComplete/AutoComplete";

function PostsFilter({
  t,
  i18n,
  filters,
  updateFilter,
  onSearch,
  onResetFilters,
  cardAndPhoto = false,
  setClearFilterResult,
}) {
  // Destructure filters for easier access
  const { searchDate, writer, category, type, language, titleQuery } = filters;
  const [isDateModalOpen, setIsDateModalOpen] = useState(false);
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const [happenedAt, setHappenedAt] = useState();
  const [categoriesList, setCategoriesList] = useState([]);
  const [writersList, setWritersList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const searchInputRef = useRef(null);
  const [dateOpen, setDateOpen] = useState(false);

  const getWriters = async (searchVal = "") => {
    try {
      const res = await GetAllUsers(searchVal);
      setWritersList(res?.data?.results);
    } catch (error) {
      console.error(error);
    }
  };
  const getCategories = async (searchVal) => {
    setIsLoading(true);
    try {
      const res = await GetPostCategories(10, 0, searchVal);
      setCategoriesList(res?.data?.results);
    } catch (err) {
      setErrorFn(err, t);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (searchInputRef.current) searchInputRef.current.focus();
  }, []);

  const clearDateFilter = () => {
    setHappenedAt(null);
    updateFilter("searchDate", "");
  };

  const clearAllFilters = () => {
    if (onResetFilters) {
      onResetFilters();
    }
    setHappenedAt("");
    onSearch(true);
    setClearFilterResult(false);
  };

  const handleDateSelection = (data) => {
    const dateText = data.toISOString().split("T")[0]; // yyyy-mm-dd

    updateFilter("searchDate", dateText);
    setIsDateModalOpen(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") onSearch();
  };

  const getActiveFilters = () => {
    const filters = [];
    if (searchDate)
      filters.push({ type: "date", label: t("Date"), value: searchDate });
    if (writer?.username)
      filters.push({
        type: "writer",
        label: t("writer"),
        value: writer?.username,
      });
    if (Array.isArray(category) && category.length > 0) {
      category.forEach((cat) => {
        filters.push({
          type: "category",
          label: t("Category"),
          value: cat?.name || cat,
          categoryItem: cat,
        });
      });
    } else if (category && typeof category === "string") {
      filters.push({ type: "category", label: t("Category"), value: category });
    }
    if (Array.isArray(type) && type.length > 0) {
      type.forEach((typeItem) => {
        filters.push({
          type: "type",
          label: t("Type"),
          value: typeItem?.name || typeItem,
          typeItem,
        });
      });
    } else if (type && typeof type === "string") {
      filters.push({ type: "type", label: t("Type"), value: type });
    }
    if (language)
      filters.push({ type: "language", label: t("Language"), value: language });
    return filters;
  };

  const removeFilter = (filterType, filterValue) => {
    const updatedFilters = { ...filters };

    switch (filterType) {
      case "date":
        updatedFilters.searchDate = "";
        setHappenedAt(null);
        break;
      case "writer":
        updatedFilters.writer = "";
        break;
      case "category":
        // If it's an array of categories, remove the specific one
        if (Array.isArray(updatedFilters.category)) {
          updatedFilters.category = updatedFilters.category.filter(
            (cat) => (cat?.name || cat) !== filterValue
          );
        } else {
          updatedFilters.category = "";
        }
        break;
      case "language":
        updatedFilters.language = "";
        break;
      case "type":
        if (Array.isArray(updatedFilters.type)) {
          updatedFilters.type = updatedFilters.type.filter(
            (t) => (t?.name || t) !== filterValue
          );
        } else {
          updatedFilters.type = "";
        }
        break;
      default:
        break;
    }

    // Update the state
    if (onResetFilters) {
      switch (filterType) {
        case "date":
          updateFilter("searchDate", "");
          break;
        case "writer":
          updateFilter("writer", "");
          break;
        case "category":
          if (Array.isArray(category)) {
            updateFilter(
              "category",
              category.filter((cat) => (cat?.name || cat) !== filterValue)
            );
          } else {
            updateFilter("category", "");
          }
          break;
        case "language":
          updateFilter("language", "");
          break;
        case "type":
          if (Array.isArray(type)) {
            updateFilter(
              "type",
              type.filter((t) => (t?.name || t) !== filterValue)
            );
          } else {
            updateFilter("type", "");
          }
          break;
      }
    }

    const hasAnyFilter =
      updatedFilters.searchDate ||
      updatedFilters.writer ||
      (Array.isArray(updatedFilters.category)
        ? updatedFilters.category.length > 0
        : updatedFilters.category) ||
      updatedFilters.language ||
      updatedFilters.type ||
      updatedFilters.titleQuery;

    if (!hasAnyFilter && setClearFilterResult) {
      setClearFilterResult(false);
    } else {
      onSearch(false, updatedFilters);
    }
  };

  const activeFilters = getActiveFilters();
  useEffect(() => {
    getCategories();
    getWriters();
  }, []);

  return (
    <div dir={i18n?.language === "ar" ? "rtl" : "ltr"}>
      {isLoading && <Loader />}
      <div className="w-full px-4">
        <div className="mx-auto max-w-6xl rounded-3xl bg-[#457DF6] px-3 py-6 text-white shadow-xl sm:px-8 sm:py-8">
          <h2 className="text-xl font-bold sm:text-2xl mb-6">
            {t("What would you like to read about today ?")}
          </h2>

          {/* Desktop Smart Bar - Collapsible Advanced Filters */}
          <div className=" ">
            {/* Main Search Bar */}
            <div className="flex items-center gap-1 lg:gap-4 mb-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder={t("Search by title or keyword...")}
                  value={titleQuery}
                  onChange={(e) => updateFilter("titleQuery", e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="h-12 w-full rounded-lg border-0 bg-white pl-10 pr-4 text-sm text-gray-800 placeholder-gray-500 outline-none ring-2 ring-transparent focus:ring-white/80 transition-all"
                />
              </div>
              <button
                onClick={() => {
                  onSearch();
                }}
                className="inline-flex h-12 items-center justify-center rounded-lg bg-white px-2 lg:px-6 text-sm font-semibold text-[#1f3fb3] shadow-sm transition hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-white/80"
              >
                <Search
                  className={`h-4 w-4 ${
                    i18n?.language === "ar" ? "mr-1" : "mr-1"
                  } `}
                />
                <span className="hidden lg:inline-block">{t("Search")}</span>
              </button>
            </div>

            {/* Advanced Filters Toggle */}
            <div className="border-t border-white/20 pt-4">
              <button
                onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
                className="flex items-center gap-2 text-white/90 hover:text-white transition-colors"
              >
                <Filter className="h-4 w-4" />
                <span className="text-sm font-medium">
                  {t("Advanced Filters")}
                </span>
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${
                    isAdvancedOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {isAdvancedOpen && (
                <div className="mt-4 space-y-4">
                  {/* Start  Date && writer */}
                  <div className="grid lg:grid-cols-2 gap-4">
                    {/* Start Date */}
                    <div>
                      <div className="relative">
                        <Popover open={dateOpen} onOpenChange={setDateOpen}>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full text-left  text-black font-normal flex items-center justify-start  ",
                                !happenedAt && "text-muted-foreground"
                              )}
                            >
                              <Calendar className=" mr-2 h-4 w-4" />
                              {happenedAt ? (
                                format(happenedAt, "dd-MM-yyyy")
                              ) : (
                                <span className="">
                                  {t("Pick Happened Date")}
                                </span>
                              )}
                            </Button>
                          </PopoverTrigger>

                          <PopoverContent className="w-auto p-0" align="start">
                            <CalendarComponent
                              mode="single"
                              selected={
                                happenedAt ? new Date(happenedAt) : undefined
                              }
                              onSelect={(date) => {
                                if (!date) return;
                                date.setHours(12);
                                setHappenedAt(format(date, "yyyy-MM-dd"));
                                handleDateSelection(date);
                                setDateOpen(false);
                              }}
                              disabled={(date) =>
                                date > new Date() ||
                                date < new Date("1900-01-01")
                              }
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>

                        {happenedAt && (
                          <button
                            onClick={() => {
                              clearDateFilter();
                            }}
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full transition-colors"
                            type="button"
                          >
                            <X className="h-4 w-4 text-red-500" />
                          </button>
                        )}
                      </div>
                    </div>
                    {/* End Date */}

                    {/* Start Writer */}
                    <AutoComplete
                      placeholder={t("Select Writer")}
                      customStyle="bg-white"
                      selectedItem={writer}
                      onSelect={(item) => {
                        updateFilter("writer", item);
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
                    {/* End writer */}
                  </div>
                  {/* End Date && writer */}

                  {/* Start Category && type && Language,   */}
                  <div className="grid lg:grid-cols-4 gap-4">
                    {/* Start Category */}
                    <MultiSelect
                      items={categoriesList}
                      selected={
                        Array.isArray(category)
                          ? category
                          : category
                          ? [{ name: category }]
                          : []
                      }
                      onChange={(selected) =>
                        updateFilter("category", selected)
                      }
                      placeholder={t("Category")}
                      renderLabel={(item) => t(item?.name || item)}
                      renderValue={(item) => item?.name || item}
                      searchable={true}
                    />
                    {/* End Category */}

                    {/* Start Language */}
                    <MultiSelect
                      items={languages}
                      selected={Array.isArray(language) ? language : []}
                      onChange={(selected) =>
                        updateFilter("language", selected)
                      }
                      placeholder={t("Language")}
                      renderLabel={(item) => t(item)}
                      renderValue={(item) => item}
                      searchable={true}
                    />
                    {/* End Language */}
                    {/* Start Type */}
                    {cardAndPhoto && (
                      <MultiSelect
                        items={[{ name: "card" }, { name: "photo" }]}
                        selected={
                          Array.isArray(type)
                            ? type
                            : type
                            ? [{ name: type }]
                            : []
                        }
                        onChange={(selected) => updateFilter("type", selected)}
                        placeholder={t("Type")}
                        renderLabel={(item) => t(item?.name || item)}
                        renderValue={(item) => item?.name || item}
                        searchable={true}
                      />
                    )}
                    {/* End Type */}
                  </div>
                  {/* End Category && type && Language,   */}
                </div>
              )}

              {/* Action Buttons and Active Filters */}
              {isAdvancedOpen && (
                <div className="mt-4 ">
                  <div className="flex items-center justify-between">
                    {/* Active Filters Chips */}
                    {activeFilters.length > 0 && (
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm text-white/80 font-medium">
                          {t("Active filters:")}
                        </span>
                        {activeFilters.map((filter, index) => {
                          return (
                            <div
                              key={index}
                              className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 text-sm text-white"
                            >
                              <span className="font-medium">
                                {filter.label}:
                              </span>
                              <span>
                                {Array.isArray(filter.value)
                                  ? filter.value.join(", ")
                                  : filter.value}
                              </span>
                              <button
                                onClick={() =>
                                  removeFilter(filter.type, filter.value)
                                }
                                className="ml-1 hover:bg-white/20 rounded-full p-0.5 transition-colors"
                                title={t("Remove filter")}
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      {activeFilters?.length > 0 && (
                        <button
                          onClick={clearAllFilters}
                          className="px-6 py-2 text-sm font-semibold bg-white text-[#1f3fb3] rounded-lg hover:bg-gray-50 transition-all"
                        >
                          {t("Clear Filters")}
                        </button>
                      )}
                      <button
                        onClick={() => {
                          onSearch();
                        }}
                        disabled={isLoading || activeFilters.length === 0}
                        className={`${
                          isLoading || activeFilters.length === 0
                            ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                            : "bg-white text-[#1f3fb3] hover:bg-gray-50"
                        } px-6 py-2 text-sm font-semibold rounded-lg transition-all`}
                      >
                        {t("Apply Filters")}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PostsFilter;
