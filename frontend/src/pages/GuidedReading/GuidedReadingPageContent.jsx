import React from "react";

import { useTranslation } from "react-i18next";

import WeeklyMoments from "@/components/ForPages/Home/WeeklyMomentsSection/WeeklyMoments";
import GuidedReading from "@/components/ForPages/Home/GuidedReadingSeciotn/GuidedReading";
import PostsFilterSction from "@/components/Global/PostsFilterSction/PostsFilterSction";

function GuidedReadingPageContent() {
  const { t, i18n } = useTranslation();

  return (
    <div className="min-h-screen bg-gray-50" dir={i18n.dir()}>
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
      <PostsFilterSction />
      {/* End Filter */}

      {/* Main Content Container */}
      <div className="max-w-7xl mx-auto">
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

export default GuidedReadingPageContent;
