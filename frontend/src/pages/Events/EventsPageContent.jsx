import React, { useEffect, useState } from "react";

import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";

import EventHeroSlider from "@/components/ForPages/Events/EventHeroSlider/EventHeroSlider";
import EventsFilterSections from "@/components/ForPages/Events/EventsFilterSections/EventsFilterSections";
import DynamicSection from "@/components/Global/DynamicSection/DynamicSection";
import EventCard from "@/components/Global/EventCard/EventCard";
import {
  GetTopEventsLiked,
  GetEventCategories,
  GetEventsByCategoryId,
  GetEvents,
} from "@/api/events";
import { setErrorFn } from "@/Utility/Global/setErrorFn";

function EventsPageContent() {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const [topLiked, setTopLiked] = useState([]);
  const [weeklyList, setWeeklyList] = useState([]);
  const [activeCategories, setActiveCategories] = useState([]);
  const [categoriesData, setCategoriesData] = useState({});
  const [targetCategoryId, setTargetCategoryId] = useState(null);
  const limit = 10;
  const [hasMoreWeeklyData, setHasMoreWeeklyData] = useState(false);
  const [weeklyOffset, setWeeklyOffset] = useState(0);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [totalWeeklyCount, setTotalWeeklyCount] = useState(0);

  const getWeeklyEventData = async (offset = 0) => {
    const isLoadMore = offset > 0;
    if (isLoadMore) {
      setIsLoadingMore(true);
    }

    try {
      const res = await GetEvents(limit, offset, "published", {
        is_weekly_moment: true,
      });

      if (offset === 0) {
        // Initial load
        setWeeklyList(res?.data?.results || []);
        setTotalWeeklyCount(res?.data?.count || 0);
      } else {
        // Load more
        setWeeklyList((prev) => [...prev, ...(res?.data?.results || [])]);
      }

      // Calculate if there's more data
      const newOffset = offset + (res?.data?.results?.length || 0);
      setWeeklyOffset(newOffset);
      setHasMoreWeeklyData(newOffset < (res?.data?.count || 0));
    } catch (err) {
      setErrorFn(err, t);
    } finally {
      if (isLoadMore) {
        setIsLoadingMore(false);
      }
    }
  };
  const getTopLiked = async () => {
    try {
      const res = await GetTopEventsLiked();
      setTopLiked(res.data);
    } catch (err) {
      setErrorFn(err, t);
    }
  };

  const getActiveEventCategories = async () => {
    try {
      const res = await GetEventCategories(200, 0);
      const allCategories = res.data?.results || res.data || [];
      const active = allCategories.filter((cat) => cat.is_active === true);
      setActiveCategories(active);

      // Fetch items for each active category
      for (const category of active) {
        try {
          const itemsRes = await GetEventsByCategoryId(category.id);
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
      console.error("Failed to fetch event categories:", err);
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
  // Handle load more
  const handleLoadMore = async () => {
    await getWeeklyEventData(weeklyOffset);
  };
  useEffect(() => {
    getTopLiked();
    getWeeklyEventData();
    getActiveEventCategories();
  }, []);
  return (
    <div className="" dir={i18n?.language === "ar" ? "rtl" : "ltr"}>
      {/* Hero Slider */}
      {/* <div>
        <EventHeroSlider />
      </div> */}
      {/* End Hero Slider */}

      {/* Start Filter Section */}
      <EventsFilterSections />
      {/* End Filter Section */}

      <div className="max-w-7xl mx-auto">
        {/* Start This Week's Top Events */}
        {weeklyList?.length ? (
          <DynamicSection
            title={t("This Weekly Events")}
            titleClassName="text-lg sm:text-xl md:text-2xl lg:text-3xl mt-5"
            data={weeklyList}
            isSlider={true}
            cardName={EventCard}
            viewMore={false}
            // viewMoreUrl="/events"
            enableLoadMore={hasMoreWeeklyData}
            onLoadMore={handleLoadMore}
            isLoadingMore={isLoadingMore}
          />
        ) : (
          ""
        )}
        {/* {topLiked?.length && (
          <DynamicSection
            title={t("Most Liked events")}
            titleClassName="text-lg sm:text-xl md:text-2xl lg:text-3xl mt-5 "
            gridClassName="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 px-2"
            data={topLiked}
            isSlider={false}
            cardName={EventCard}
            viewMore={false}
          />
        )} */}
        {/* End Suggestions you might like */}

        {/* Start Show Active Categories */}

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
              cardName={EventCard}
              viewMore={categoriesData[category.id]?.length > 5}
              viewMoreUrl={`/events/category/${category.id}`}
            />
          </div>
        ))}

        {/* End Show Active Categories */}
      </div>
    </div>
  );
}

export default EventsPageContent;
