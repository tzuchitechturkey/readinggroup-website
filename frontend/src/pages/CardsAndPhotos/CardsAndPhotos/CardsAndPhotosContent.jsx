import React from "react";

import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";

import CardsAndPhotosTabs from "@/components/ForPages/CardsAndPhotos/CardsAndPhotosTabs/CardsAndPhotosTabs";
import WeeklyMoments from "@/components/ForPages/Home/WeeklyMomentsSection/WeeklyMoments";
import WeekPhotos from "@/components/ForPages/Home/WeekPhotosSection/WeekPhotos";
import heroImg from "@/assets/guiding-image.png";
import PostsFilterSction from "@/components/Global/PostsFilterSction/PostsFilterSction";

function CardsAndPhotosContent() {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const activeTabFromNav = location.state?.activeTab;

  return (
    <div
      className="min-h-screen w-full bg-white text-gray-900"
      dir={i18n?.language === "ar" ? "rtl" : "ltr"}
    >
      {/* Header with hero image */}
      <div className="relative">
        <img
          src={heroImg}
          alt="Guiding"
          className="h-[40vh] sm:h-[50vh] md:h-[60vh] lg:h-[70vh] w-full object-cover"
        />
      </div>
      <div className="max-w-7xl mx-auto">
        {/* Start Filter */}
        <PostsFilterSction cardAndPhoto={true} />
        {/* End Filter */}

        {/* Content container */}
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          {/* Page Title */}
          <h1 className="text-center text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mt-4 sm:mt-5 md:mt-6 leading-tight">
            {t("Browse Our Top Courses")}
          </h1>
        </div>

        {/* Start Tabs */}
        <div id="cards-tabs-section">
          <CardsAndPhotosTabs initialTab={activeTabFromNav} />
        </div>
        {/* End Tabs */}

        {/* Start Weekly Moments */}
        <WeeklyMoments />
        {/* End Weekly Moments */}

        {/* Start Week's Photos */}
        <WeekPhotos />
        {/* End Week's Photos */}
      </div>
    </div>
  );
}

export default CardsAndPhotosContent;
