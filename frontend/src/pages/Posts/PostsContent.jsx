import React, { useState, useEffect } from "react";

import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";

import PostsTabs from "@/components/ForPages/Posts/PostsTabs/PostsTabs";
import WeeklyList from "@/components/ForPages/Home/WeeklyListSection/WeeklyList";
import heroImg from "@/assets/eventsHero.png";
import ContentPostsFilterSction from "@/components/Global/ContentPostsFilterSction/ContentPostsFilterSction";
import { GetPostCategories, TopViewedPosts } from "@/api/posts";
import { setErrorFn } from "@/Utility/Global/setErrorFn";
import CustomGridCards from "@/components/ForPages/Posts/CustomGridCards/CustomGridCards";
import Gallery from "@/components/ForPages/Posts/Gallery/Gallery";

function PostsContent() {
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
          alt="Content"
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
          <PostsTabs />
        </div>
        {/* End Tabs */}

        {/* Start Week's Photos */}
        <WeeklyList title={t("This Week's Photos")} type="photo" />
        {/* End Week's Photos */}

        {/* Start Weekly Moments */}
        <WeeklyList title={t("This Week's Cards")} type="card" />
        {/* End Weekly Moments */}

        {/* Start Gallery */}
        <Gallery />
        {/* End Gallery */}

        {/* Start Grid Items */}
        <CustomGridCards topViewedData={topViewedData} i18n={i18n} t={t} />
        {/* End Grid Items */}
      </div>
    </div>
  );
}

export default PostsContent;
