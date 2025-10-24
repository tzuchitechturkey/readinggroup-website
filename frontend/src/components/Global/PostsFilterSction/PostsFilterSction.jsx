import React, { useState, useEffect } from "react";

import { useTranslation } from "react-i18next";

import LearnFilter from "@/components/Global/LearnFilter/LearnFilter";
import FilteredResults from "@/components/ForPages/GuidedReading/FilteredResults/FilteredResults";
import { GetPosts } from "@/api/posts";
import { setErrorFn } from "@/Utility/Global/setErrorFn";

function PostsFilterSction({ cardAndPhoto = false }) {
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
  // Pagination state
  const [currentPage, setCurrentPage] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(false);
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
  const buildFilters = () => {
    const apiFilters = {};

    // Add search query
    if (filters.titleQuery) apiFilters.search = filters.titleQuery;

    // Add date filter - need to convert to ISO format if needed
    if (filters.searchDate) apiFilters.published_at = filters.searchDate;

    // Add writer filter - send writer ID
    if (filters.writer?.name) apiFilters.writer = filters.writer.name;

    // Add category filter - category is stored as string directly
    if (filters.category) apiFilters.category = filters.category;

    // Add post type filter
    if (cardAndPhoto) {
      // For card & photo page: use selected type if exists
      if (filters.type) apiFilters.post_type = filters.type;
    } else {
      // For guided reading page: always filter by 'reading'
      apiFilters.post_type = "reading";
    }

    // Add language filter
    if (filters.language) apiFilters.language = filters.language;

    return apiFilters;
  };

  const getData = async (page = 0, resetData = false, clearFilter = false) => {
    setIsLoading(true);
    const offset = page * limit;

    try {
      const apiFilters = clearFilter === true ? {} : buildFilters();
      const res = await GetPosts(limit, offset, apiFilters);

      const newResults = res.data?.results || [];
      const totalCount = res.data?.count || 0;

      if (resetData) {
        // Reset data when applying new filters
        setFilteredReadings(newResults);
      } else {
        // Append data for load more
        setFilteredReadings((prev) => [...prev, ...newResults]);
      }

      setTotalRecords(totalCount);
      setCurrentPage(page);
      setIsSearchPerformed(true);

      // Check if there are more results to load
      const loadedCount = resetData
        ? newResults.length
        : filteredReadings.length + newResults.length;
      setHasMore(loadedCount < totalCount);
    } catch (err) {
      setErrorFn(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Apply filters function - called when user clicks search or apply filters
  const applyFilters = (clearFilter) => {
    setCurrentPage(0);
    console.log("clearFilter:", clearFilter);
    if (clearFilter) {
      setFilteredReadings([]);
    } else {
      getData(0, true, clearFilter); // Reset data with new filters
    }
  };

  // Load more function
  const handleLoadMore = () => {
    const nextPage = currentPage + 1;
    getData(nextPage, false);
  };

  useEffect(() => {
    // Load initial data if needed
    // getData(0, true);
  }, []);

  return (
    <div>
      <LearnFilter
        t={t}
        i18n={i18n}
        filters={filters}
        updateFilter={updateFilter}
        onSearch={applyFilters}
        onResetFilters={resetFilters}
        cardAndPhoto={cardAndPhoto}
      />
      {/* Start Filtered Data */}
      <section className="mt-8 sm:mt-10 md:mt-12 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
        <FilteredResults
          data={filteredReadings}
          isSearchPerformed={isSearchPerformed}
          totalCount={totalRecords}
          hasMore={hasMore}
          isLoading={isLoading}
          onLoadMore={handleLoadMore}
          cardAndPhoto={cardAndPhoto}
        />
      </section>
      {/* End Filtered Data */}
    </div>
  );
}

export default PostsFilterSction;
