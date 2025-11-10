import React, { useState, useEffect } from "react";

import { useTranslation } from "react-i18next";

import PostsFilter from "@/components/Global/PostsFilter/PostsFilter";
import FilteredResults from "@/components/ForPages/Contents/FilteredResults/FilteredResults";
import { GetPosts } from "@/api/posts";
import { setErrorFn } from "@/Utility/Global/setErrorFn";

function ContentsFilterSction() {
  const { t, i18n } = useTranslation();

  // Filter states - all in one object
  const [filters, setFilters] = useState({
    searchDate: "",
    writer: "",
    category: "",
    type: "",
    language: "",
    titleQuery: "",
  });

  // Results state
  const [filteredReadings, setFilteredReadings] = useState([]);
  const [isSearchPerformed, setIsSearchPerformed] = useState(false);
  const [clearFilterResult, setClearFilterResult] = useState(false);
  // Pagination state
  const [currentPage, setCurrentPage] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const limit = 10;

  // Helper function to update a single filter
  const updateFilter = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  // Helper function to reset all filters
  const resetFilters = () => {
    setFilters({
      searchDate: "",
      writer: "",
      category: "",
      type: "",
      language: "",
      titleQuery: "",
    });
  };

  // Build filters object from current state
  const buildFilters = (customFilters = filters) => {
    const apiFilters = {};

    // Add search query
    if (customFilters.titleQuery) apiFilters.search = customFilters.titleQuery;

    // Add date filter
    if (customFilters.searchDate)
      apiFilters.created_at = customFilters.searchDate;

    // Add writer filter - send writer username(s)
    if (
      Array.isArray(customFilters.writer) &&
      customFilters.writer.length > 0
    ) {
      const writerNames = customFilters.writer
        .map((w) => w?.username)
        .filter(Boolean)
        .join(",");
      if (writerNames) apiFilters.writer = writerNames;
    } else if (customFilters.writer?.username) {
      apiFilters.writer = customFilters.writer.username;
    }

    // Add category filter - category is stored as string directly
    if (customFilters.category) apiFilters.category = customFilters.category;

    // Always filter by 'reading' for guided reading page
    apiFilters.post_type = "reading";

    // Add language filter
    if (customFilters.language) apiFilters.language = customFilters.language;

    return apiFilters;
  };

  const getData = async (
    page = 0,
    clearFilter = false,
    customFilters = filters
  ) => {
    setIsLoading(true);
    const offset = page * limit;

    try {
      const apiFilters =
        clearFilter === true ? {} : buildFilters(customFilters);
      const res = await GetPosts(limit, offset, "published", apiFilters);

      const newResults = res.data?.results || [];
      const totalCount = res.data?.count || 0;

      // Always reset data for pagination (not load more pattern)
      setFilteredReadings(newResults);
      setTotalRecords(totalCount);
      setCurrentPage(page);
      setIsSearchPerformed(true);
    } catch (err) {
      setErrorFn(err, t);
    } finally {
      setIsLoading(false);
    }
  };

  // Apply filters function - called when user clicks search or apply filters
  const applyFilters = (clearFilter, customFilters = filters) => {
    setCurrentPage(0);
    setClearFilterResult(true); // Show results section
    getData(0, clearFilter, customFilters); // Reset data with new filters
  };

  // Page change function for pagination
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    getData(newPage, false); // Load new page with current filters
    // Scroll to top of results
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    // Load initial data if needed
    getData(0, true);
  }, []);

  return (
    <div>
      <PostsFilter
        t={t}
        i18n={i18n}
        filters={filters}
        updateFilter={updateFilter}
        onSearch={applyFilters}
        onResetFilters={resetFilters}
        setClearFilterResult={setClearFilterResult}
      />
      {/* Start Filtered Data */}
      {clearFilterResult && (
        <section className="mt-8 sm:mt-10 md:mt-12 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
          <FilteredResults
            data={filteredReadings}
            isSearchPerformed={isSearchPerformed}
            totalCount={totalRecords}
            currentPage={currentPage}
            limit={limit}
            totalRecords={totalRecords}
            isLoading={isLoading}
            onPageChange={handlePageChange}
          />
        </section>
      )}
      {/* End Filtered Data */}
    </div>
  );
}

export default ContentsFilterSction;
