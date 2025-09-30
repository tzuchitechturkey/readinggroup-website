import React, { useState } from "react";

import { useTranslation } from "react-i18next";

import LearnFilter from "@/components/Global/LearnFilter/LearnFilter";
import WeeklyMoments from "@/components/ForPages/Home/WeeklyMomentsSection/WeeklyMoments";
import FilterSections from "@/components/ForPages/Videos/FilterSections/FilterSections";
import GuidedReading from "@/components/ForPages/Home/GuidedReadingSeciotn/GuidedReading";
import VideoSections from "@/components/ForPages/Home/VideoSections/VideoSections";
import Modal from "@/components/Global/Modal/Modal";

function GuidedReadingContent() {
  const { t } = useTranslation();
  const [searchDate, setSearchDate] = useState("");
  const [type, setType] = useState("");
  const [theme, setTheme] = useState("");
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Start Header */}
      <div
        className="min-h-[60vh] sm:min-h-[70vh] md:min-h-[80vh] lg:min-h-[85vh] bg-cover bg-center sm:bg-bottom px-4 sm:px-6 md:px-8"
        style={{
          backgroundImage: `url(../../../src/assets/guiding-reading.png)`,
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

      {/* Start FIlter */}
      <LearnFilter
        t={t}
        searchDate={searchDate}
        setSearchDate={setSearchDate}
        type={type}
        setType={setType}
        theme={theme}
        setTheme={setTheme}
      />
      {/* End FIlter */}

      {/* Main Content Container */}
      <div className="max-w-7xl mx-auto">
        {/* Start Filter Section */}
        <section className="mt-8 sm:mt-10 md:mt-12 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
         
          <FilterSections />
        </section>
        {/* End Filter Section */}

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
