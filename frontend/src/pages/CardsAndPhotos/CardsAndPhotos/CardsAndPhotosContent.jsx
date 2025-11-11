import React, { useState, useEffect } from "react";

import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";

import CardsAndPhotosTabs from "@/components/ForPages/CardsAndPhotos/CardsAndPhotosTabs/CardsAndPhotosTabs";
import WeeklyMoments from "@/components/ForPages/Home/WeeklyMomentsSection/WeeklyMoments";
import WeekPhotos from "@/components/ForPages/Home/WeekPhotosSection/WeekPhotos";
import DynamicSection from "@/components/Global/DynamicSection/DynamicSection";
import GuidingReadingcard from "@/components/Global/GuidingReadingcard/GuidingReadingcard";
import heroImg from "@/assets/eventsHero.png";
import PostsFilterSction from "@/components/Global/PostsFilterSction/PostsFilterSction";
import { GetPostCategories, GetItemsByCategoryId } from "@/api/posts";

function CardsAndPhotosContent() {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const activeTabFromNav = location.state?.activeTab;
  const [activeCategories, setActiveCategories] = useState([]);
  const [categoriesData, setCategoriesData] = useState({});
  const [targetCategoryId, setTargetCategoryId] = useState(null);

  const getActivePostCategories = async () => {
    try {
      const res = await GetPostCategories();
      const allCategories = res.data?.results || res.data || [];
      const active = allCategories.filter((cat) => cat.is_active === true);
      setActiveCategories(active);

      // Fetch items for each active category
      for (const category of active) {
        try {
          const itemsRes = await GetItemsByCategoryId(category.id);
          setCategoriesData((prev) => ({
            ...prev,
            [category.id]: itemsRes.data?.results || itemsRes.data || [],
          }));
        } catch (err) {
          console.error(
            `Failed to fetch items for category ${category.id}:`,
            err
          );
        }
      }
    } catch (err) {
      console.error("Failed to fetch post categories:", err);
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

        {/* Start Show Active Categories */}
        <section
          id="week-topic-section"
          className="mt-8 sm:mt-12 md:mt-16 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16"
        >
          {activeCategories.map((category) => (
            <div
              key={category.id}
              id={`category-${category.id}`}
              className="mt-12"
            >
              <DynamicSection
                title={category.name}
                data={categoriesData[category.id] || []}
                isSlider={true}
                cardName={GuidingReadingcard}
              />
            </div>
          ))}
        </section>
        {/* End Show Active Categories */}
      </div>
    </div>
  );
}

export default CardsAndPhotosContent;
