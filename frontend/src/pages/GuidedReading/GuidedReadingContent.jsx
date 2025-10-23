import React, { useState, useEffect } from "react";

import { useTranslation } from "react-i18next";

import LearnFilter from "@/components/Global/LearnFilter/LearnFilter";
import WeeklyMoments from "@/components/ForPages/Home/WeeklyMomentsSection/WeeklyMoments";
import GuidedReading from "@/components/ForPages/Home/GuidedReadingSeciotn/GuidedReading";
import FilteredResults from "@/components/ForPages/GuidedReading/FilteredResults/FilteredResults";
import { GetPostsbyFilter } from "@/api/posts";
import { setErrorFn } from "@/Utility/Global/setErrorFn";

function GuidedReadingContent() {
  const { t, i18n } = useTranslation();

  // Filter states
  const [searchDate, setSearchDate] = useState("");
  const [writer, setWriter] = useState("");
  const [category, setCategory] = useState("");
  const [type, setType] = useState("");
  const [language, setLanguage] = useState("");
  const [source, setSource] = useState("");
  const [titleQuery, setTitleQuery] = useState("");
  const [data, setData] = useState([]);
  // Results state
  const [filteredReadings, setFilteredReadings] = useState([]);
  const [isSearchPerformed, setIsSearchPerformed] = useState(false);
  const [weeklyMomentData, setWeeklyMomentData] = useState([]);
  const [weeklyGuidData, setWeeklyGuidData] = useState([]);
  // Pagination state
  const [currentPage, setCurrentPage] = useState(0);
  const [totalRecords, setTotalRecords] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const limit = 10;

  const getData = async (page) => {
    setIsLoading(true);
    const offset = page * 10;
    try {
      const res = await GetPostsbyFilter(limit, offset, filter);
      setData(res.data?.results);
      setTotalRecords(res.data?.count);
    } catch (err) {
      setErrorFn(err);
    } finally {
      setIsLoading(false);
    }
  };

  const getWeeklyGuidData = async () => {
    try {
      const res = await GetWeeklyGuidData();
      setWeeklyGuidData(res.data);
    } catch (error) {
      console.error(error);
    }
  };
  const getWeeklyMomentData = async () => {
    try {
      const res = await GetWeeklyMomentData();
      setWeeklyMomentData(res.data);
    } catch (error) {
      console.error(error);
    }
  };
  // Apply filters function - simulates API call
  const applyFilters = () => {
    setIsLoading(true);
  };

  // Load more function
  const handleLoadMore = () => {
    applyFilters();
  };

  useEffect(() => {
    // getData(0)
    // getWeeklyGuidData();
    // getWeeklyMomentData();
  }, []);
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Start Header */}
      <div
        className="min-h-[60vh] sm:min-h-[70vh] md:min-h-[80vh] lg:min-h-[85vh] bg-cover bg-center sm:bg-bottom px-4 sm:px-6 md:px-8"
        style={{
          backgroundImage: `url(/book.gif)`,
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
            totalCount={totalRecords}
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
      </div>
    </div>
  );
}

export default GuidedReadingContent;
