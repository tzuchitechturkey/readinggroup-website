import React, { useEffect, useState } from "react";

import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DynamicSection from "@/components/Global/DynamicSection/DynamicSection";
import GuidingReadingcard from "@/components/Global/GuidingReadingcard/GuidingReadingcard";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  TopCommentedPosts,
  TopLikedPosts,
  WeeklyCardPhotoPosts,
  GetPostCategories,
  GetItemsByCategoryId,
} from "@/api/posts";
import { setErrorFn } from "@/Utility/Global/setErrorFn";
import WeekPhotosCard from "@/components/Global/WeekPhotosCard/WeekPhotosCard";

function CardsAndPhotosTabs({ initialTab }) {
  const isMobile = useIsMobile(1024);
  const { t, i18n } = useTranslation();

  const [categories, setCategories] = useState([]);
  const [activeTab, setActiveTab] = useState(initialTab || "");
  const [loading, setLoading] = useState(false);
  const [tabData, setTabData] = useState({});
  const [categoriesOffset, setCategoriesOffset] = useState(0);
  const [totalCategories, setTotalCategories] = useState(0);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const categoriesLimit = 10;
  const [topViewedData, setTopViewedData] = useState();
  // Fetch all active categories
  const fetchCategories = async (offset = 0, append = false) => {
    try {
      const response = await GetPostCategories(categoriesLimit, offset);
      const activeCategories = (response?.data?.results || []).filter(
        (cat) => cat.is_active === true
      );

      if (append) {
        // Append new categories to existing ones
        setCategories((prev) => [...prev, ...activeCategories]);
      } else {
        // Replace categories (initial load)
        setCategories(activeCategories);

        // Set the first active category as the initial tab and fetch its data
        if (activeCategories.length > 0 && !initialTab) {
          const firstCategoryId = activeCategories[0].id.toString();
          setActiveTab(firstCategoryId);
          // Fetch data for the first category immediately
          await fetchTabData(activeCategories[0].id);
        } else if (initialTab) {
          setActiveTab(initialTab);
        }
      }

      // Initialize tabData for new categories
      const initialTabData = append ? { ...tabData } : {};
      activeCategories.forEach((cat) => {
        if (!initialTabData[cat.id]) {
          initialTabData[cat.id] = [];
        }
      });
      setTabData(initialTabData);

      // Set total count for pagination
      setTotalCategories(response?.data?.count || 0);
      setCategoriesOffset(offset + categoriesLimit);
    } catch (error) {
      console.error("Error fetching categories:", error);
      if (!append) {
        setCategories([]);
      }
    } finally {
      setIsLoadingMore(false);
    }
  };

  const getTopViewed = async () => {
    try {
      const res = await WeeklyCardPhotoPosts();
      setTopViewedData(res?.data);
    } catch (err) {
      setErrorFn(err, t);
    }
  };
  // Load more categories
  const handleLoadMoreCategories = () => {
    setIsLoadingMore(true);
    fetchCategories(categoriesOffset, true);
  };

  // Function to fetch data for a specific category
  const fetchTabData = async (categoryId) => {
    setLoading(true);
    try {
      const response = await GetItemsByCategoryId(categoryId);
      setTabData((prev) => ({
        ...prev,
        [categoryId]: response?.data?.results || [],
      }));
    } catch (error) {
      console.error("Error fetching category items:", error);
      setTabData((prev) => ({
        ...prev,
        [categoryId]: [],
      }));
    } finally {
      setLoading(false);
    }
  };

  // Handle tab change
  const handleTabChange = (categoryId) => {
    setActiveTab(categoryId);
    // Only fetch if data doesn't exist for this category
    if (!tabData[categoryId] || tabData[categoryId].length === 0) {
      fetchTabData(categoryId);
    }
  };

  useEffect(() => {
    // Fetch categories on component mount
    getTopViewed();
    fetchCategories();
  }, []);

  useEffect(() => {
    // When categories are loaded and activeTab changes, fetch data
    if (activeTab && (!tabData[activeTab] || tabData[activeTab].length === 0)) {
      fetchTabData(activeTab);
    }
  }, [activeTab, categories]);
  return (
    <div
      className="border-b-[1px] md:border-0 mb-2 pb-2 md:mb-2 md:pb-2 border-gray-200"
      dir={i18n?.language === "ar" ? "rtl" : "ltr"}
    >
      <Tabs
        value={activeTab}
        className="w-full"
        onValueChange={handleTabChange}
      >
        <div className="mt-6 sm:mt-8 md:mt-10 w-full overflow-hidden px-4 sm:px-6 md:px-8">
          {isMobile ? (
            <div className="relative overflow-x-auto scrollbar-hide">
              <TabsList className="bg-white shadow-none flex h-auto p-0 my-5 w-auto min-w-full justify-start">
                {categories.map((cat) => (
                  <TabsTrigger
                    key={cat.id}
                    value={cat.id.toString()}
                    className="gap-2 pb-3 px-4 rounded-none text-muted-foreground bg-white shadow-none border-0 flex-shrink-0
                     data-[state=active]:text-[#4680FF] 
                     data-[state=active]:border-b-2 
                     data-[state=active]:border-b-[#4680FF] 
                     data-[state=active]:shadow-none
                     whitespace-nowrap hover:bg-gray-50 transition-colors"
                  >
                    <span className="text-sm font-medium">{cat.name}</span>
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>
          ) : (
            <TabsList className="bg-white shadow-none flex justify-center flex-wrap gap-4 sm:gap-6 h-auto p-0 my-5">
              {categories.map((cat) => (
                <TabsTrigger
                  key={cat.id}
                  value={cat.id.toString()}
                  className="gap-2 pb-3 rounded-none text-muted-foreground 
                   data-[state=active]:text-[#4680FF] 
                   data-[state=active]:border-b-2 
                   data-[state=active]:border-b-[#4680FF] 
                   data-[state=active]:shadow-none"
                >
                  <span className="text-sm whitespace-nowrap">{cat.name}</span>
                </TabsTrigger>
              ))}
            </TabsList>
          )}
        </div>

        {/* Show More Categories Button */}
        {categories.length < totalCategories && (
          <div className="flex justify-center mt-4 px-4">
            <button
              onClick={handleLoadMoreCategories}
              disabled={isLoadingMore}
              className="px-6 py-2 bg-[#4680FF] text-white rounded-lg hover:bg-[#3a68d4] transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {isLoadingMore ? t("Loading...") : t("Show More")}
            </button>
          </div>
        )}

        {categories.map((cat) => (
          <TabsContent key={cat.id} value={cat.id.toString()}>
            <DynamicSection
              title={`${t("This Week's")} ${cat.name}`}
              titleClassName="text-lg sm:text-xl md:text-2xl lg:text-3xl mb-2 sm:mb-3 md:mb-4"
              data={tabData[cat.id] || []}
              isSlider={isMobile}
              cardName={GuidingReadingcard}
              viewMore={false}
              viewMoreUrl="/contents"
              loading={loading && activeTab === cat.id.toString()}
            />
          </TabsContent>
        ))}
      </Tabs>
      {/* Start Dynamic Grid  */}

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
      {/* End Dynamic Grid  */}
    </div>
  );
}

export default CardsAndPhotosTabs;
