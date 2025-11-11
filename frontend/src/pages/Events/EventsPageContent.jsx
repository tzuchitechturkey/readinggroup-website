import React, { useEffect, useState } from "react";

import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";

import EventHeroSlider from "@/components/ForPages/Events/EventHeroSlider/EventHeroSlider";
import EventsFilterSections from "@/components/ForPages/Events/EventsFilterSections/EventsFilterSections";
import DynamicSection from "@/components/Global/DynamicSection/DynamicSection";
import EventCard from "@/components/Global/EventCard/EventCard";
import { EventsData } from "@/mock/events";
import {
  GetTop5Event,
  GetTopEventsLiked,
  GetEventCategories,
  GetItemsByCategoryId,
} from "@/api/events";

function EventsPageContent() {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const [topLiked, setTopLiked] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [activeCategories, setActiveCategories] = useState([]);
  const [categoriesData, setCategoriesData] = useState({});
  const [targetCategoryId, setTargetCategoryId] = useState(null);
  const getSuggestionsData = async () => {
    try {
      const res = await GetTop5Event();
      setSuggestions(res.data);
    } catch (err) {
      console.log("Error fetching data", err);
    }
  };
  const getTopLiked = async () => {
    try {
      const res = await GetTopEventsLiked();
      setTopLiked(res.data);
    } catch (err) {
      console.error("Error fetching data", err);
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
  useEffect(() => {
    getTopLiked();
    getSuggestionsData();
    getActiveEventCategories();
  }, []);
  return (
    <div className="" dir={i18n?.language === "ar" ? "rtl" : "ltr"}>
      {/* Hero Slider */}
      <div>
        <EventHeroSlider newsPage={true} />
      </div>
      {/* End Hero Slider */}

      {/* Start Filter Section */}
      <EventsFilterSections />
      {/* End Filter Section */}
      
      <div className="max-w-7xl mx-auto">
        {/* Start Suggestions you might like */}
        <DynamicSection
          title={t("Suggestions you might like")}
          titleClassName="text-lg sm:text-xl md:text-2xl lg:text-3xl mt-5"
          data={suggestions}
          isSlider={true}
          cardName={EventCard}
          viewMore={false}
          viewMoreUrl="/contents"
        />
        <DynamicSection
          title={t("Most Liked events")}
          titleClassName="text-lg sm:text-xl md:text-2xl lg:text-3xl mt-5 "
          data={topLiked}
          isSlider={true}
          cardName={EventCard}
          viewMore={false}
        />
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
            />
          </div>
        ))}

        {/* End Show Active Categories */}
      </div>
    </div>
  );
}

export default EventsPageContent;
