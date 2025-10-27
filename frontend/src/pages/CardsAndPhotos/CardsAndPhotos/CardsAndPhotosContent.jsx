import React from "react";

import { useTranslation } from "react-i18next";

import { readings } from "@/mock/reading";
import GuidingReadingcard from "@/components/Global/GuidingReadingcard/GuidingReadingcard";
import CardsAndPhotosTabs from "@/components/ForPages/CardsAndPhotos/CardsAndPhotosTabs/CardsAndPhotosTabs";
import WeeklyMoments from "@/components/ForPages/Home/WeeklyMomentsSection/WeeklyMoments";
import WeekPhotos from "@/components/ForPages/Home/WeekPhotosSection/WeekPhotos";
import heroImg from "@/assets/guiding-image.png";
import PostsFilterSction from "@/components/Global/PostsFilterSction/PostsFilterSction";

function CardsAndPhotosContent() {
  const { t, i18n } = useTranslation();

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

        {/* Start Filter */}
        <PostsFilterSction cardAndPhoto={true} />
        {/* End Filter */}
      </div>

      {/* Content container */}
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Page Title */}
        <h1 className="text-center text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mt-4 sm:mt-5 md:mt-6 leading-tight">
          {t("Browse Our Top Courses")}
        </h1>
      </div>

      {/* Start Tabs */}
      <CardsAndPhotosTabs />
      {/* End Tabs */}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 px-4 sm:px-6 md:px-8 lg:px-12 my-6 sm:my-8 md:my-10">
        {/* Start Image */}
        <div className="order-2 lg:order-1 mt-0 lg:mt-8">
          <img
            src="/authback.jpg"
            alt="Weekly featured image"
            className="w-full h-64 sm:h-80 md:h-96 lg:h-full object-cover rounded-xl shadow-lg"
          />
        </div>
        {/* End Image */}

        {/* Start Grid Cards */}
        <div className="order-1 lg:order-2 px-0 sm:px-3 md:px-5 lg:px-7">
          {/* Start Title */}
          <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold mb-4 sm:mb-6 text-center lg:text-left">
            {t("This Week's Good Effect Cards")}
          </h2>
          {/* End Title */}

          {/* Start Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 md:gap-6 lg:gap-7">
            {readings?.slice(0, 4).map((item, index) => (
              <div
                key={index}
                className="transform hover:scale-105 transition-transform duration-200"
              >
                <GuidingReadingcard item={item} />
              </div>
            ))}
          </div>
          {/* End Cards */}
        </div>
        {/* End Grid Cards */}
      </div>

      {/* Start Weekly Moments */}
      <WeeklyMoments />
      {/* End Weekly Moments */}

      {/* Start Week's Photos */}
      <WeekPhotos />
      {/* End Week's Photos */}
    </div>
  );
}

export default CardsAndPhotosContent;
