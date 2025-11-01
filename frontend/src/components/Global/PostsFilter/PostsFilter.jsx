import React, { useState, useRef, useEffect } from "react";

import { Search, ChevronDown, X, Filter } from "lucide-react";

import MultiSelect from "@/components/Global/MultiSelect/MultiSelect";
import { GetAllUsers, GetPostCategories } from "@/api/posts";
import { languages } from "@/constants/constants";

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
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const [categoriesList, setCategoriesList] = useState([]);
  const [writersList, setWritersList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const searchInputRef = useRef(null);
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

  const clearAllFilters = () => {
    if (onResetFilters) {
      onResetFilters();
    }
    onSearch(true);
    setClearFilterResult(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") onSearch();
  };

  const getActiveFilters = () => {
    const filters = [];
    if (searchDate)
      filters.push({ type: "date", label: t("Date"), value: searchDate });
    if (Array.isArray(writer) && writer.length > 0) {
      writer.forEach((w) => {
        filters.push({
          type: "writer",
          label: t("writer"),
          value: w?.username || w,
          writerItem: w,
        });
      });
    } else if (writer && typeof writer === "object" && writer.username) {
      filters.push({
        type: "writer",
        label: t("writer"),
        value: writer?.username,
      });
    }
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
      case "writer":
        if (Array.isArray(updatedFilters.writer)) {
          updatedFilters.writer = updatedFilters.writer.filter(
            (w) => (w?.username || w) !== filterValue
          );
        } else {
          updatedFilters.writer = [];
        }
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
          if (Array.isArray(writer)) {
            updateFilter(
              "writer",
              writer.filter((w) => (w?.username || w) !== filterValue)
            );
          } else {
            updateFilter("writer", []);
          }
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
      (Array.isArray(updatedFilters.writer)
        ? updatedFilters.writer.length > 0
        : updatedFilters.writer) ||
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
                  <div className="grid lg:grid-cols-2 gap-4" />
                  {/* End Date && writer */}

                  {/* Start Category && type && Language,   */}
                  <div className="grid lg:grid-cols-4 gap-4">
                    {/* Start Writer */}
                    <AutoComplete
                      placeholder={t("Select Writer")}
                      customStyle="bg-white"
                      multiple={true}
                      selectedItems={
                        Array.isArray(writer) ? writer : writer ? [writer] : []
                      }
                      onSelect={(items) => {
                        updateFilter("writer", items);
                      }}
                      onClear={() => {
                        updateFilter("writer", []);
                      }}
                      searchMethod={getWriters}
                      searchApi={true}
                      list={writersList}
                      searchPlaceholder={t("Search writers...")}
                      required={false}
                      renderItemLabel={(item) => {
                        return item.username;
                      }}
                      // renderItemSubLabel={(item) => item.groups?.[0]}
                      showWriterAvatar={false}
                    />
                    {/* End writer */}
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
