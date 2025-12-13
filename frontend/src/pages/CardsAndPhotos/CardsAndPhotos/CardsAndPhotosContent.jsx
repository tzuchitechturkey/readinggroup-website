import React, { useState, useEffect } from "react";

import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";

import CardsAndPhotosTabs from "@/components/ForPages/CardsAndPhotos/CardsAndPhotosTabs/CardsAndPhotosTabs";
import WeeklyList from "@/components/ForPages/Home/WeeklyListSection/WeeklyList";
import heroImg from "@/assets/eventsHero.png";
import ContentPostsFilterSction from "@/components/Global/ContentPostsFilterSction/ContentPostsFilterSction";
import { GetPostCategories, TopViewedPosts } from "@/api/posts";
import WeekPhotosCard from "@/components/Global/WeekPhotosCard/WeekPhotosCard";
import { setErrorFn } from "@/Utility/Global/setErrorFn";
import GuidingReadingcard from "@/components/Global/Contentcard/Contentcard";

function CardsAndPhotosContent() {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const [activeCategories, setActiveCategories] = useState([]);
  const [targetCategoryId, setTargetCategoryId] = useState(null);
  const [topViewedData, setTopViewedData] = useState();
  const getTopViewed = async () => {
    try {
      const res = await TopViewedPosts();
      setTopViewedData(res?.data);
    } catch (err) {
      setErrorFn(err, t);
    }
  };
  const getActivePostCategories = async () => {
    try {
      const res = await GetPostCategories(200, 0);
      const allCategories = res.data?.results || res.data || [];
      const active = allCategories.filter((cat) => cat.is_active === true);
      setActiveCategories(active);
    } catch (err) {
      setErrorFn(err, t);
    }
  };

  useEffect(() => {
    if (location.state?.targetCategoryId) {
      setTargetCategoryId(location.state.targetCategoryId);
    }
  }, [location.state]);

  useEffect(() => {
    if (targetCategoryId && activeCategories.length > 0) {
      const categoryExists = activeCategories.some(
        (cat) => cat.id === targetCategoryId
      );
      if (categoryExists) {
        setTimeout(() => {
          const el = document.getElementById(`category-${targetCategoryId}`);
          if (el) {
            el.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        }, 500);
      }
    }
  }, [targetCategoryId, activeCategories]);

  useEffect(() => {
    getActivePostCategories();
    getTopViewed();
  }, []);

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
        <ContentPostsFilterSction cardAndPhoto={true} />
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
          <CardsAndPhotosTabs />
        </div>
        {/* End Tabs */}

        {/* Start Week's Photos */}
        <WeeklyList title={t("This Week's Photos")} type="photo" />
        {/* End Week's Photos */}

        {/* Start Weekly Moments */}
        <WeeklyList title={t("This Week's Cards")} type="card" />
        {/* End Weekly Moments */}

        {/* Start Show Active Categories */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 px-4 sm:px-6 md:px-8 lg:px-12 my-6 sm:my-8 md:my-10">
          {/* Start Image */}
          <div className="order-2 lg:order-1 mt-0 lg:mt-8">
            {topViewedData?.[0] && <WeekPhotosCard item={topViewedData[0]} />}
          </div>
          {/* End Image */}

          {/* Start Grid Cards */}
          <div className="order-1 lg:order-2 px-0 sm:px-3 md:px-5 lg:px-7">
            {/* Start Title */}
            <h2
              className={`text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold mb-4 sm:mb-6 text-center ${
                i18n?.language === "ar" ? "lg:text-right" : "lg:text-left"
              } `}
            >
              {t("This Week's Top Cards")}
            </h2>
            {/* End Title */}

            {/* Start Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 md:gap-10 lg:gap-12">
              {topViewedData?.slice(1, 5).map((item, index) => (
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
        {/* End Show Active Categories */}
      </div>
    </div>
  );
}

export default CardsAndPhotosContent;
