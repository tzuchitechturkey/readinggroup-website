import React, { useState, useRef, useEffect } from "react";

import { Calendar, Search, ChevronDown, X, Filter } from "lucide-react";

import Modal from "@/components/Global/Modal/Modal";
import FilterDatePickerModal from "@/components/ForPages/Videos/FilterDatePickerModal/FilterDatePickerModal";

function LearnFilter({
  t,
  searchDate,
  setSearchDate,
  writer,
  setWriter,
  category,
  setCategory,
  type,
  setType,
  language,
  setLanguage,
  source,
  setSource,
  titleQuery,
  setTitleQuery,
  onSearch,
}) {
  const [isDateModalOpen, setIsDateModalOpen] = useState(false);
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const [selectedDateRange, setSelectedDateRange] = useState({
    startDate: null,
    endDate: null,
  });

  const searchInputRef = useRef(null);

  useEffect(() => {
    if (searchInputRef.current) searchInputRef.current.focus();
  }, []);

  const clearDateFilter = () => {
    setSelectedDateRange({ startDate: null, endDate: null });
    setSearchDate("");
  };

  const clearAllFilters = () => {
    setTitleQuery("");
    setSearchDate("");
    setWriter("");
    setCategory("");
    setType("");
    setLanguage("");
    setSource("");
    setSelectedDateRange({ startDate: null, endDate: null });
  };

  const handleDateSelection = () => {
    let dateText = "";
    if (selectedDateRange.startDate && selectedDateRange.endDate) {
      const startDate = selectedDateRange.startDate
        .toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
        .replace(/,/g, "")
        .replace(/\s/g, " / ");
      const endDate = selectedDateRange.endDate
        .toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
        .replace(/,/g, "")
        .replace(/\s/g, " / ");
      dateText = `${startDate} - ${endDate}`;
    } else if (selectedDateRange.startDate) {
      dateText = selectedDateRange.startDate
        .toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
        .replace(/,/g, "")
        .replace(/\s/g, " / ");
    }
    setSearchDate(dateText);
    setIsDateModalOpen(false);
  };

  const handleSearch = () => {
    if (onSearch) onSearch();
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  const getActiveFilters = () => {
    const filters = [];
    if (searchDate)
      filters.push({ type: "date", label: t("Date"), value: searchDate });
    if (writer)
      filters.push({ type: "writer", label: t("writer"), value: writer });
    if (category)
      filters.push({ type: "category", label: t("Category"), value: category });
    if (type) filters.push({ type: "type", label: t("Type"), value: type });
    if (language)
      filters.push({ type: "language", label: t("Language"), value: language });
    if (source)
      filters.push({ type: "source", label: t("Source"), value: source });
    return filters;
  };

  const removeFilter = (filterType) => {
    switch (filterType) {
      case "date":
        clearDateFilter();
        break;
      case "writer":
        setWriter("");
        break;
      case "category":
        setCategory("");
        break;
      case "type":
        setType("");
        break;
      case "language":
        setLanguage("");
        break;
      case "source":
        setSource("");
        break;
      default:
        break;
    }
  };

  const activeFilters = getActiveFilters();

  return (
    <div>
      <div className="w-full px-4">
        <div className="mx-auto max-w-6xl rounded-3xl bg-[#457DF6] px-6 py-6 text-white shadow-xl sm:px-8 sm:py-8">
          <h2 className="text-xl font-bold sm:text-2xl mb-6">
            {t("What would you like to read about today ?")}
          </h2>

          {/* Desktop Smart Bar - Collapsible Advanced Filters */}
          <div className="hidden lg:block">
            {/* Main Search Bar */}
            <div className="flex items-center gap-4 mb-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder={t("Search by title or keyword...")}
                  value={titleQuery}
                  onChange={(e) => setTitleQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="h-12 w-full rounded-lg border-0 bg-white pl-10 pr-4 text-sm text-gray-800 placeholder-gray-500 outline-none ring-2 ring-transparent focus:ring-white/80 transition-all"
                />
              </div>
              <button
                onClick={handleSearch}
                className="inline-flex h-12 items-center justify-center rounded-lg bg-white px-6 text-sm font-semibold text-[#1f3fb3] shadow-sm transition hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-white/80"
              >
                <Search className="h-4 w-4 mr-2" />
                {t("Search")}
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

              {/* Collapsible Advanced Filters */}
              {isAdvancedOpen && (
                <div className="mt-4 space-y-4">
                  {/* First Row - Date and writer */}
                  <div className="grid grid-cols-2 gap-4">
                    {/* Date Filter */}
                    <div className="relative">
                      <button
                        onClick={() => setIsDateModalOpen(true)}
                        className={`h-10 w-full rounded-md border-0 bg-white px-3 text-sm outline-none ring-2 transition-all duration-200 flex items-center justify-between group hover:shadow-md ${
                          searchDate
                            ? "ring-blue-300 bg-blue-50"
                            : "ring-transparent hover:ring-blue-200 focus:ring-blue-300"
                        }`}
                      >
                        <div className="flex items-center">
                          <Calendar
                            className={`mr-2 h-4 w-4 ${
                              searchDate ? "text-blue-600" : "text-gray-500"
                            }`}
                          />
                          <span
                            className={`font-medium ${
                              searchDate ? "text-blue-800" : "text-gray-500"
                            }`}
                          >
                            {searchDate || t("Publication Date")}
                          </span>
                        </div>
                        <ChevronDown className="h-4 w-4 text-gray-400" />
                      </button>
                    </div>

                    {/* writer Filter */}
                    <input
                      type="text"
                      placeholder={t("writer")}
                      value={writer}
                      onChange={(e) => setWriter(e.target.value)}
                      className="h-10 w-full rounded-md border-0 bg-white px-3 text-sm text-gray-800 placeholder-gray-500 outline-none ring-2 ring-transparent focus:ring-white/80"
                    />
                  </div>

                  {/* Second Row - Category, type, Language, Source */}
                  <div className="grid grid-cols-4 gap-4">
                    {/* Category Filter */}
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="h-10 w-full rounded-md border-0 bg-white px-3 text-sm text-gray-800 outline-none ring-2 ring-transparent focus:ring-white/80"
                    >
                      <option value="">{t("Category")}</option>
                      <option value="Personal Growth">
                        {t("Personal Growth")}
                      </option>
                      <option value="Nature">{t("Nature")}</option>
                      <option value="Technology">{t("Technology")}</option>
                      <option value="History">{t("History")}</option>
                      <option value="Lifestyle">{t("Lifestyle")}</option>
                      <option value="Education">{t("Education")}</option>
                      <option value="Health">{t("Health")}</option>
                      <option value="Culture">{t("Culture")}</option>
                      <option value="Religion">{t("Religion")}</option>
                    </select>

                    {/* type Filter */}
                    <select
                      value={type}
                      onChange={(e) => setType(e.target.value)}
                      className="h-10 w-full rounded-md border-0 bg-white px-3 text-sm text-gray-800 outline-none ring-2 ring-transparent focus:ring-white/80"
                    >
                      <option value="">{t("Type")}</option>
                      <option value="Non-fiction">{t("Non-fiction")}</option>
                      <option value="Fiction">{t("Fiction")}</option>
                      <option value="Research">{t("Research")}</option>
                      <option value="Documentary">{t("Documentary")}</option>
                      <option value="Cookbook">{t("Cookbook")}</option>
                      <option value="Biography">{t("Biography")}</option>
                      <option value="Article">{t("Article")}</option>
                    </select>

                    {/* Language Filter */}
                    <select
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                      className="h-10 w-full rounded-md border-0 bg-white px-3 text-sm text-gray-800 outline-none ring-2 ring-transparent focus:ring-white/80"
                    >
                      <option value="">{t("Language")}</option>
                      <option value="English">{t("English")}</option>
                      <option value="Arabic">{t("Arabic")}</option>
                      <option value="Turkish">{t("Turkish")}</option>
                      <option value="French">{t("French")}</option>
                      <option value="Spanish">{t("Spanish")}</option>
                    </select>

                    {/* Source Filter */}
                    <select
                      value={source}
                      onChange={(e) => setSource(e.target.value)}
                      className="h-10 w-full rounded-md border-0 bg-white px-3 text-sm text-gray-800 outline-none ring-2 ring-transparent focus:ring-white/80"
                    >
                      <option value="">{t("Source")}</option>
                      <option value="Harvard Review">
                        {t("Harvard Review")}
                      </option>
                      <option value="National Geographic">
                        {t("National Geographic")}
                      </option>
                      <option value="MIT Press">{t("MIT Press")}</option>
                      <option value="Oxford Journal">
                        {t("Oxford Journal")}
                      </option>
                      <option value="Food & Culture Magazine">
                        {t("Food & Culture Magazine")}
                      </option>
                      <option value="Academic Press">
                        {t("Academic Press")}
                      </option>
                    </select>
                  </div>
                </div>
              )}

              {/* Action Buttons and Active Filters */}
              {isAdvancedOpen && (
                <div className="mt-4">
                  <div className="flex items-center justify-between">
                    {/* Active Filters Chips */}
                    {activeFilters.length > 0 && (
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm text-white/80 font-medium">
                          {t("Active filters:")}
                        </span>
                        {activeFilters.map((filter, index) => (
                          <div
                            key={index}
                            className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 text-sm text-white"
                          >
                            <span className="font-medium">{filter.label}:</span>
                            <span>{filter.value}</span>
                            <button
                              onClick={() => removeFilter(filter.type)}
                              className="ml-1 hover:bg-white/20 rounded-full p-0.5 transition-colors"
                              title={t("Remove filter")}
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    <button
                      onClick={handleSearch}
                      className="px-6 py-2 text-sm font-semibold bg-white text-[#1f3fb3] rounded-lg hover:bg-gray-50 transition-all"
                    >
                      {t("Apply Filters")}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Desktop Compact Row (for medium screens) */}
          <div className="hidden md:block lg:hidden">
            <div className="space-y-3">
              {/* First Row */}
              <div className="grid grid-cols-4 gap-3 items-center">
                {/* Search Input */}
                <div className="col-span-2 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    placeholder={t("Search by title...")}
                    value={titleQuery}
                    onChange={(e) => setTitleQuery(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="h-10 w-full rounded-md border-0 bg-white pl-10 pr-3 text-sm text-gray-800 placeholder-gray-500 outline-none ring-2 ring-transparent focus:ring-white/80"
                  />
                </div>

                {/* Date Filter */}
                <button
                  onClick={() => setIsDateModalOpen(true)}
                  className="h-10 w-full rounded-md bg-white px-3 text-sm text-gray-700 hover:bg-gray-50 flex items-center justify-between"
                >
                  <Calendar className="h-4 w-4" />
                  <span className="ml-1 text-xs">{t("Date")}</span>
                  <ChevronDown className="h-3 w-3" />
                </button>

                {/* Search Button */}
                <button
                  onClick={handleSearch}
                  className="h-10 bg-white text-[#1f3fb3] rounded-md px-4 font-semibold hover:bg-gray-50 transition-all"
                >
                  {t("Search")}
                </button>
              </div>

              {/* Second Row - Filters */}
              <div className="grid grid-cols-5 gap-3">
                {/* writer Filter */}
                <input
                  type="text"
                  placeholder={t("writer")}
                  value={writer}
                  onChange={(e) => setWriter(e.target.value)}
                  className="h-10 w-full rounded-md bg-white px-3 text-sm text-gray-800 placeholder-gray-500"
                />

                {/* Category Filter */}
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="h-10 w-full rounded-md bg-white px-3 text-sm text-gray-800"
                >
                  <option value="">{t("Category")}</option>
                  <option value="Personal Growth">
                    {t("Personal Growth")}
                  </option>
                  <option value="Technology">{t("Technology")}</option>
                  <option value="History">{t("History")}</option>
                </select>

                {/* type Filter */}
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="h-10 w-full rounded-md bg-white px-3 text-sm text-gray-800"
                >
                  <option value="">{t("Type")}</option>
                  <option value="Non-fiction">{t("Non-fiction")}</option>
                  <option value="Fiction">{t("Fiction")}</option>
                  <option value="Research">{t("Research")}</option>
                </select>

                {/* Language Filter */}
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="h-10 w-full rounded-md bg-white px-3 text-sm text-gray-800"
                >
                  <option value="">{t("Language")}</option>
                  <option value="English">{t("English")}</option>
                  <option value="Arabic">{t("Arabic")}</option>
                  <option value="Turkish">{t("Turkish")}</option>
                </select>

                {/* Source Filter */}
                <select
                  value={source}
                  onChange={(e) => setSource(e.target.value)}
                  className="h-10 w-full rounded-md bg-white px-3 text-sm text-gray-800"
                >
                  <option value="">{t("Source")}</option>
                  <option value="Harvard Review">{t("Harvard Review")}</option>
                  <option value="MIT Press">{t("MIT Press")}</option>
                  <option value="Oxford Journal">{t("Oxford Journal")}</option>
                </select>
              </div>
            </div>
          </div>

          {/* Mobile Stacked Design */}
          <div className="block md:hidden space-y-3">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder={t("Search by title...")}
                value={titleQuery}
                onChange={(e) => setTitleQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                className="h-12 w-full rounded-lg border-0 bg-white pl-10 pr-4 text-sm text-gray-800 placeholder-gray-500 outline-none"
              />
            </div>

            {/* Date and writer */}
            <div className="grid grid-cols-2 gap-3">
              {/* Date Filter */}
              <button
                onClick={() => setIsDateModalOpen(true)}
                className="h-12 rounded-lg bg-white px-4 text-sm text-gray-700 flex items-center justify-between"
              >
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>{t("Date")}</span>
                </div>
                <ChevronDown className="h-4 w-4" />
              </button>

              {/* writer Filter */}
              <input
                type="text"
                placeholder={t("writer")}
                value={writer}
                onChange={(e) => setWriter(e.target.value)}
                className="h-12 w-full rounded-lg bg-white px-4 text-sm text-gray-800 placeholder-gray-500"
              />
            </div>

            {/* Filter Selectors */}
            <div className="grid grid-cols-2 gap-3">
              {/* Category Filter */}
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="h-12 w-full rounded-lg bg-white px-4 text-sm text-gray-800"
              >
                <option value="">{t("Category")}</option>
                <option value="Personal Growth">{t("Personal Growth")}</option>
                <option value="Technology">{t("Technology")}</option>
                <option value="History">{t("History")}</option>
                <option value="Lifestyle">{t("Lifestyle")}</option>
              </select>

              {/* type Filter */}
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="h-12 w-full rounded-lg bg-white px-4 text-sm text-gray-800"
              >
                <option value="">{t("Type")}</option>
                <option value="Non-fiction">{t("Non-fiction")}</option>
                <option value="Fiction">{t("Fiction")}</option>
                <option value="Research">{t("Research")}</option>
                <option value="Documentary">{t("Documentary")}</option>
              </select>

              {/* Language Filter */}
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="h-12 w-full rounded-lg bg-white px-4 text-sm text-gray-800"
              >
                <option value="">{t("Language")}</option>
                <option value="English">{t("English")}</option>
                <option value="Arabic">{t("Arabic")}</option>
                <option value="Turkish">{t("Turkish")}</option>
                <option value="French">{t("French")}</option>
              </select>

              {/* Source Filter */}
              <select
                value={source}
                onChange={(e) => setSource(e.target.value)}
                className="h-12 w-full rounded-lg bg-white px-4 text-sm text-gray-800"
              >
                <option value="">{t("Source")}</option>
                <option value="Harvard Review">{t("Harvard Review")}</option>
                <option value="MIT Press">{t("MIT Press")}</option>
                <option value="Oxford Journal">{t("Oxford Journal")}</option>
              </select>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={clearAllFilters}
                className="h-12 rounded-lg border border-white/30 text-white/90 font-medium hover:bg-white/10 transition-all"
              >
                {t("Clear Filters")}
              </button>
              <button
                onClick={handleSearch}
                className="h-12 rounded-lg bg-white text-[#1f3fb3] font-semibold hover:bg-gray-50 transition-all"
              >
                {t("Search")}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Start Date Filter Modal */}
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
      {/* End Date Filter Modal */}
    </div>
  );
}

export default LearnFilter;
