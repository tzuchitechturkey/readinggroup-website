import React, { useState, useEffect } from "react";

import { useTranslation } from "react-i18next";

import PostsFilter from "@/components/Global/PostsFilter/PostsFilter";
import FilteredResults from "@/components/ForPages/Contents/FilteredResults/FilteredResults";
import { GetPosts } from "@/api/posts";
import { GetContents } from "@/api/contents";
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
  const [filteredContents, setFilteredContents] = useState([]);
  const [isSearchPerformed, setIsSearchPerformed] = useState(false);
  // Pagination state
  const [currentPage, setCurrentPage] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const limit = 10;
  const [clearFilterResult, setClearFilterResult] = useState(false);
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
  const buildFilters = ({ filter = filters }) => {
    const apiFilters = {};

    // Add search query
    if (filter.titleQuery) apiFilters.search = filter.titleQuery;

    // Add date filter
    if (filter.searchDate !== "") {
      apiFilters.created_at = filter.searchDate;
    }

    // Add writer filter - send writer username(s)
    if (Array.isArray(filter.writer) && filter.writer.length > 0) {
      const writerNames = filter.writer
        .map((w) => w?.username)
        .filter(Boolean)
        .join(",");
      if (writerNames) apiFilters.writer = writerNames;
    } else if (filter.writer?.username) {
      apiFilters.writer = filter.writer.username;
    }

    // Add category filter - convert array of objects to comma-separated string
    if (filter.category) {
      if (Array.isArray(filter.category)) {
        const categoryNames = filter.category
          .map((cat) => cat?.name || cat)
          .filter(Boolean)
          .join(",");
        if (categoryNames) apiFilters.category = categoryNames;
      } else if (typeof filter.category === "string") {
        apiFilters.category = filter.category;
      }
    }

    // Add post type filter - convert array of objects to comma-separated string
    if (cardAndPhoto) {
      // For card & photo page: use selected types if exist
      if (filter.type) {
        if (Array.isArray(filter.type)) {
          const typeNames = filter.type
            .map((t) => t?.name || t)
            .filter(Boolean)
            .join(",");
          if (typeNames) apiFilters.post_type = typeNames;
        } else if (typeof filter.type === "string") {
          apiFilters.post_type = filter.type;
        }
      } else {
        apiFilters.post_type = ["card", "photo"].join(",");
      }
    }

    // Add language filter - convert array of strings to comma-separated string
    if (filter.language) {
      if (Array.isArray(filter.language)) {
        const languageNames = filter.language.filter(Boolean).join(",");
        if (languageNames) apiFilters.language = languageNames;
      } else if (typeof filter.language === "string") {
        apiFilters.language = filter.language;
      }
    }

    return apiFilters;
  };

  const getData = async (page = 0, clearFilter = false, filter) => {
    setIsLoading(true);
    const offset = page * limit;

    try {
      const apiFilters = clearFilter === true ? {} : buildFilters({ filter });
      
      // Use GetContents if cardAndPhoto is false, otherwise use GetPosts
      const res = cardAndPhoto 
        ? await GetPosts(limit, offset, "published", apiFilters)
        : await GetContents(limit, offset, "published", apiFilters);

      const newResults = res.data?.results || [];
      const totalCount = res.data?.count || 0;

      // Always reset data for pagination (not load more pattern)
      setFilteredContents(newResults);
      setClearFilterResult(true);
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
  const applyFilters = (clearFilter, filter = filters) => {
    setCurrentPage(0);
    if (clearFilter) {
      setFilteredContents([]);
      setClearFilterResult(false);
    } else {
      setClearFilterResult(true); // Show results section
      getData(0, clearFilter, filter); // Reset data with new filters
    }
  };

  // Page change function for pagination
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    getData(newPage, false, filters); // Load new page with current filters
    // Scroll to top of results
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    // Load initial data if needed
    // getData(0, true);
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
        cardAndPhoto={cardAndPhoto}
        setClearFilterResult={setClearFilterResult}
      />
      {/* Start Filtered Data */}
      {clearFilterResult && (
        <section className="mt-8 sm:mt-10 md:mt-12 mx-6 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-40">
          <FilteredResults
            data={filteredContents}
            isSearchPerformed={isSearchPerformed}
            totalRecords={totalRecords}
            currentPage={currentPage}
            limit={limit}
            isLoading={isLoading}
            onPageChange={handlePageChange}
            cardAndPhoto={cardAndPhoto}
          />
        </section>
      )}
      {/* End Filtered Data */}
    </div>
  );
}

export default PostsFilterSction;
