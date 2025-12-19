import React, { useEffect, useState } from "react";

import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";

import WeeklyList from "@/components/ForPages/Home/WeeklyListSection/WeeklyList";
import ContentPostsFilterSction from "@/components/Global/ContentPostsFilterSction/ContentPostsFilterSction";
import { setErrorFn } from "@/Utility/Global/setErrorFn";
import {
  GetContentCategories,
  // TopLikedContents,
  TopViewedContents,
  GetContentsByCategoryId,
} from "@/api/contents";
import DynamicSection from "@/components/Global/DynamicSection/DynamicSection";
import Contentcard from "@/components/Global/GlobalCard/GlobalCard";

function ContentsPageContent() {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const [activeCategories, setActiveCategories] = useState([]);
  const [categoriesData, setCategoriesData] = useState({});
  const [topViewedData, setTopViewedData] = useState();
  const [targetCategoryId, setTargetCategoryId] = useState(null);
  // const [topLikedData, setTopLikedData] = useState();

  // Check if we need to scroll to a specific category
  useEffect(() => {
    if (location.state?.targetCategoryId) {
      setTargetCategoryId(location.state.targetCategoryId);
    }
  }, [location.state]);

  // Fetch all active categories and their items
  const getActiveCategories = async () => {
    try {
      const res = await GetContentCategories(100, 0);
      // Filter only active categories
      const active = (res?.data?.results || []).filter(
        (cat) => cat.is_active === true
      );
      setActiveCategories(active);

      // Fetch items for each active category
      const itemsMap = {};
      for (const category of active) {
        try {
          const itemsRes = await GetContentsByCategoryId(category.id);
          itemsMap[category.id] = itemsRes?.data?.results || [];
        } catch (error) {
          console.error(
            `Error fetching items for category ${category.id}:`,
            error
          );
          itemsMap[category.id] = [];
        }
      }
      setCategoriesData(itemsMap);
    } catch (err) {
      setErrorFn(err, t);
    }
  };

  const getTopViewed = async () => {
    try {
      const res = await TopViewedContents();
      setTopViewedData(res?.data);
    } catch (err) {
      setErrorFn(err, t);
    }
  };

  // const getTopLiked = async () => {
  //   try {
  //     const res = await TopLikedContents();
  //     setTopLikedData(res?.data);
  //   } catch (err) {
  //     setErrorFn(err, t);
  //   }
  // };

  useEffect(() => {
    getActiveCategories();
    getTopViewed();
    // getTopLiked();
  }, []);

  // Scroll to target category after data is loaded
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
            {t("Contents")}
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
      <ContentPostsFilterSction />
      {/* End Filter */}
      <div className="max-w-7xl mx-auto">
        {/* Start Weekly Moments */}
        <section
          id="week-topic-section"
          className="mt-8 sm:mt-12 md:mt-16 px-4 sm:px-6 "
        >
          <WeeklyList title={t("This Week's Contents")} type="content" />
        </section>
        {/* End Weekly Moments Section */}

        {/* Main Content Container */}
        {/* Start Top Viewed Section */}
        <section
          id="week-topic-section"
          className="mt-8 sm:mt-12 md:mt-16 px-4 sm:px-6  "
        >
          <div className="mt-12">
            <DynamicSection
              title={t("Top Viewed Contents")}
              data={topViewedData}
              isSlider={true}
              cardName={Contentcard}
              propsToCard={{ fromContent: true }}
            />
          </div>
        </section>
        {/* End Top Viewed Section */}

        {/* Start Show Active Categories */}
        <section
          id="week-topic-section"
          className="mt-8 sm:mt-12 md:mt-16 px-4 sm:px-6   "
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
                cardName={Contentcard}
                propsToCard={{ fromContent: true }}
                viewMore={categoriesData[category.id]?.length > 5}
                viewMoreUrl={`/contents/category/${category.id}`}
              />
            </div>
          ))}
        </section>
        {/* End Show Active Categories */}
      </div>
    </div>
  );
}

export default ContentsPageContent;
