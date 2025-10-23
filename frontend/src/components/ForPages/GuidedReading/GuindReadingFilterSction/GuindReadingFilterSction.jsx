import React, { useState, useEffect } from "react";

import { useTranslation } from "react-i18next";

import LearnFilter from "@/components/Global/LearnFilter/LearnFilter";
import FilteredResults from "@/components/ForPages/GuidedReading/FilteredResults/FilteredResults";
import { GetPosts } from "@/api/posts";
import { setErrorFn } from "@/Utility/Global/setErrorFn";

function GuindReadingFilterSction() {
  const { t, i18n } = useTranslation();

  // Filter states
  const [searchDate, setSearchDate] = useState("");
  const [writer, setWriter] = useState("");
  const [category, setCategory] = useState("");
  const [type, setType] = useState("");
  const [language, setLanguage] = useState("");
  const [titleQuery, setTitleQuery] = useState("");
  // Results state
  const [filteredReadings, setFilteredReadings] = useState([]);
  const [isSearchPerformed, setIsSearchPerformed] = useState(false);
  // Pagination state
  const [currentPage, setCurrentPage] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const limit = 10;

  // Build filters object from current state
  const buildFilters = () => {
    const filters = {};
    
    // Add search query
    if (titleQuery) filters.search = titleQuery;
    
    // Add date filter - need to convert to ISO format if needed
    if (searchDate) filters.published_at = searchDate;
    
    // Add writer filter - send writer ID
    if (writer?.id) filters.writer = writer.id;
    
    // Add category filter
    if (category) filters.category = category;
    
    // Add post type filter
    if (type) filters.post_type = type;
    
    // Add language filter
    if (language) filters.language = language;
    
    return filters;
  };

  const getData = async (page = 0, resetData = false) => {
    setIsLoading(true);
    const offset = page * limit;
    
    try {
      const filters = buildFilters();
      const res = await GetPosts(limit, offset, filters);
      
      const newResults = res.data?.results || [];
      const totalCount = res.data?.count || 0;
      
      if (resetData) {
        // Reset data when applying new filters
        setFilteredReadings(newResults);
      } else {
        // Append data for load more
        setFilteredReadings(prev => [...prev, ...newResults]);
      }
      
      setTotalRecords(totalCount);
      setCurrentPage(page);
      setIsSearchPerformed(true);
      
      // Check if there are more results to load
      const loadedCount = resetData ? newResults.length : filteredReadings.length + newResults.length;
      setHasMore(loadedCount < totalCount);
      
    } catch (err) {
      setErrorFn(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Apply filters function - called when user clicks search or apply filters
  const applyFilters = () => {
    setCurrentPage(0);
    getData(0, true); // Reset data with new filters
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
        searchDate={searchDate}
        setSearchDate={setSearchDate}
        writer={writer}
        setWriter={setWriter}
        category={category}
        setCategory={setCategory}
        type={type}
        setType={setType}
        language={language}
        setLanguage={setLanguage}
        titleQuery={titleQuery}
        setTitleQuery={setTitleQuery}
        onSearch={applyFilters}
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
        />
      </section>
      {/* End Filtered Data */}
    </div>
  );
}

export default GuindReadingFilterSction;
