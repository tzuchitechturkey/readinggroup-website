import React, { useState, useEffect } from "react";

import { useTranslation } from "react-i18next";

import LearnFilter from "@/components/Global/LearnFilter/LearnFilter";
import WeeklyMoments from "@/components/ForPages/Home/WeeklyMomentsSection/WeeklyMoments";
import FilterSections from "@/components/ForPages/Videos/VideoFilterSections/VideoFilterSections";
import GuidedReading from "@/components/ForPages/Home/GuidedReadingSeciotn/GuidedReading";
import VideoSections from "@/components/ForPages/Home/VideoSections/VideoSections";
import Modal from "@/components/Global/Modal/Modal";
import FilteredResults from "@/components/ForPages/GuidedReading/FilteredResults/FilteredResults";
import { readings } from "@/mock/reading.js";

function GuidedReadingContent() {
  const { t } = useTranslation();

  // Filter states
  const [searchDate, setSearchDate] = useState("");
  const [author, setAuthor] = useState("");
  const [category, setCategory] = useState("");
  const [type, setType] = useState("");
  const [language, setLanguage] = useState("");
  const [source, setSource] = useState("");
  const [titleQuery, setTitleQuery] = useState("");

  // Results state
  const [filteredReadings, setFilteredReadings] = useState([]);
  const [isSearchPerformed, setIsSearchPerformed] = useState(false);

  // Pagination state
  const [currentOffset, setCurrentOffset] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const limit = 10;

  // Apply filters function - simulates API call
  const applyFilters = (offset = 0, appendResults = false) => {
    setIsLoading(true);

    // Simulate API delay
    setTimeout(() => {
      // Filter all data first (this simulates backend filtering)
      const allFiltered = readings.filter((reading) => {
        // Title search
        if (
          titleQuery &&
          !reading.title.toLowerCase().includes(titleQuery.toLowerCase())
        ) {
          return false;
        }

        // Author filter
        if (
          author &&
          !reading.author.toLowerCase().includes(author.toLowerCase())
        ) {
          return false;
        }

        // Category filter
        if (category && reading.category !== category) {
          return false;
        }

        // Genre filter
        if (type && reading.genre !== type) {
          return false;
        }

        // Language filter
        if (language && reading.language !== language) {
          return false;
        }

        // Source filter
        if (source && reading.source !== source) {
          return false;
        }

        // Date filter (simplified - checking if publish date contains the search term)
        if (searchDate && !reading.publishDate.includes(searchDate)) {
          return false;
        }

        return true;
      });

      // Simulate pagination (slice results based on offset and limit)
      const paginatedResults = allFiltered.slice(offset, offset + limit);

      // Update state based on whether we're appending or replacing
      if (appendResults) {
        setFilteredReadings((prev) => [...prev, ...paginatedResults]);
      } else {
        setFilteredReadings(paginatedResults);
        setCurrentOffset(offset);
      }

      setTotalCount(allFiltered.length);
      setHasMore(offset + limit < allFiltered.length);
      setIsSearchPerformed(true);
      setIsLoading(false);
    }, 500); // Simulate 500ms API delay
  };

  // Load more function
  const handleLoadMore = () => {
    const newOffset = currentOffset + limit;
    setCurrentOffset(newOffset);
    applyFilters(newOffset, true);
  };

  // Auto-apply filters when any filter changes (reset pagination)
  useEffect(() => {
    setCurrentOffset(0);
    applyFilters(0, false);
  }, [author, category, type, language, source, titleQuery, searchDate]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Start Header */}
      <div
        className="min-h-[60vh] sm:min-h-[70vh] md:min-h-[80vh] lg:min-h-[85vh] bg-cover bg-center sm:bg-bottom px-4 sm:px-6 md:px-8"
        style={{
          backgroundImage: `url(../../../src/assets/book.gif)`,
        }}
      >
        {/* Start Texts */}
        <div className="text-white flex flex-col items-center justify-center h-full pt-16 sm:pt-20 md:pt-24 lg:pt-32 max-w-xs sm:max-w-lg md:max-w-2xl lg:max-w-3xl xl:max-w-4xl mx-auto">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-center">
            {t("Guided Reading")}
          </h1>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl font-medium sm:font-semibold lg:font-bold mt-4 sm:mt-6 md:mt-8 text-center leading-relaxed sm:leading-loose px-4 sm:px-0">
            {t(
              "Explore inspirational stories, picture cards, and photo albums that connect hearts across the world"
            )}
          </p>
        </div>
        {/* End Texts */}
      </div>
      {/* End Header */}

      {/* Start Filter */}
      <LearnFilter
        t={t}
        searchDate={searchDate}
        setSearchDate={setSearchDate}
        author={author}
        setAuthor={setAuthor}
        category={category}
        setCategory={setCategory}
        type={type}
        setType={setType}
        language={language}
        setLanguage={setLanguage}
        source={source}
        setSource={setSource}
        titleQuery={titleQuery}
        setTitleQuery={setTitleQuery}
        onSearch={() => applyFilters(0, false)}
      />
      {/* End Filter */}

      {/* Main Content Container */}
      <div className="max-w-7xl mx-auto">
        {/* Start Filtered Data */}
        <section className="mt-8 sm:mt-10 md:mt-12 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
          <FilteredResults
            readings={filteredReadings}
            isSearchPerformed={isSearchPerformed}
            totalCount={totalCount}
            hasMore={hasMore}
            isLoading={isLoading}
            onLoadMore={handleLoadMore}
          />
        </section>
        {/* End Filtered Data */}

        {/* Weekly Moments */}
        <section className="mt-8 sm:mt-12 md:mt-16 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
          <WeeklyMoments />
        </section>

        {/* Guided Reading */}
        <section className="mt-8 sm:mt-12 md:mt-16 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
          <GuidedReading />
        </section>

        {/* Video Sections */}
        <section className="mt-8 sm:mt-12 md:mt-16 mb-8 sm:mb-12 md:mb-16 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
          <VideoSections />
        </section>
      </div>
    </div>
  );
}

export default GuidedReadingContent;
