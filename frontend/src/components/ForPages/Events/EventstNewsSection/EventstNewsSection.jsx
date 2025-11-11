import React, { useEffect, useState } from "react";

import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import NewsCard from "@/components/ForPages/Events/NewsCard/NewsCard";
import RecommendationNewsCard from "@/components/ForPages/Events/RecommendationNewsCard/RecommendationNewsCard";
import CategoryTag from "@/components/ForPages/Events/EventsCategoryTag/CategoryTag";
import { setErrorFn } from "@/Utility/Global/setErrorFn";
import {
  GetEventCategories,
  GetTopEventsCommented,
  GetTopEventsLastPosted,
  GetTopEventsViewed,
} from "@/api/events";

const EventstNewsSection = () => {
  const { t, i18n } = useTranslation();
  const [lastPosted, setLastPosted] = useState([]);
  const [topViewed, setTopViewed] = useState([]);
  const [SuggestedData, setSuggestedData] = useState([]);
  const [categoriesList, setCategoriesList] = useState([]);
  const navigate = useNavigate();
  const getSuggestedData = async () => {
    try {
      const res = await GetTopEventsCommented();
      setSuggestedData(res.data);
    } catch (err) {
      setErrorFn(err, t);
    }
  };
  const getLastPosted = async () => {
    try {
      const res = await GetTopEventsLastPosted();
      setLastPosted(res.data);
    } catch (err) {
      setErrorFn(err, t);
    }
  };
  const getTopViewed = async () => {
    try {
      const res = await GetTopEventsViewed();
      setTopViewed(res.data);
    } catch (err) {
      setErrorFn(err, t);
    }
  };

  const getCategories = async () => {
    try {
      const res = await GetEventCategories(100, 0, "");
      setCategoriesList(res.data?.results || []);
    } catch (err) {
      setErrorFn(err, t);
    }
  };

  const SectionHeader = ({ title, ornamentHeight = "h-12" }) => (
    <div className="flex items-center gap-6 mb-2">
      <div className={`w-4 ${ornamentHeight} bg-black`} />
      <h2 className="text-2xl sm:text-3xl lg:text-4xl font-medium text-text tracking-tight leading-tight">
        {title}
      </h2>
    </div>
  );

  const handleCategoryClick = () => {};
  useEffect(() => {
    getLastPosted();
    getTopViewed();
    getSuggestedData();
    getCategories();
  }, []);
  return (
    <div
      className="w-full text-text py-4 sm:py-6 lg:py-8 print:bg-white print:text-black"
      dir={i18n?.language === "ar" ? "rtl" : "ltr"}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Recommendation News Section */}
        <section className="mb-12">
          <SectionHeader title={t("Suggested for you")} />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {SuggestedData?.slice(0, 3)?.map((article) => (
              <RecommendationNewsCard
                t={t}
                key={article?.id}
                article={article}
                onClick={() => {
                  article?.report_type === "videos"
                    ? navigate(`/events/video/${article?.id}`)
                    : navigate(`/events/report/${article?.id}`);
                }}
              />
            ))}
          </div>
        </section>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-12">
          {/* Left Column - Main News (3/5 width) */}
          <div className="lg:col-span-3 space-y-8 lg:space-y-16 order-1">
            {/* Trending Now */}
            <section>
              <SectionHeader title={t("Trending Now")} />
              <div className="  space-y-2 mt-5">
                {topViewed?.map((article) => (
                  <NewsCard
                    t={t}
                    key={article?.id}
                    article={article}
                    onClick={() => {
                      article?.report_type === "videos"
                        ? navigate(`/events/video/${article?.id}`)
                        : navigate(`/events/report/${article?.id}`);
                    }}
                    imgClassName=" md:!w-40 md:!h-28 "
                  />
                ))}
              </div>
            </section>

            {/* Breaking News */}
            {/* <section>
              <SectionHeader title="Breaking News" />
              <div className=" space-y-2 mt-5">
                {data.breakingNews.map((article) => (
                  <NewsCard
                    imgClassName=" md:!w-40 md:!h-28 "
                    t={t}
                    key={article?.id}
                    article={article}
                    onClick={() => {}}
                  />
                ))}
              </div>
            </section> */}
          </div>

          {/* Right Column - Sidebar (2/5 width) */}
          <div className="lg:col-span-2 space-y-2 order-2">
            {/* Latest Updates */}
            <section>
              <SectionHeader title={t("Latest Updates")} ornamentHeight="h-10" />
              <div className="   max-h-screen overflow-y-auto mt-5 scrollbar-thin">
                {lastPosted?.map((article) => (
                  <NewsCard
                    t={t}
                    key={article?.id}
                    article={article}
                    onClick={() => {}}
                  />
                ))}
              </div>
            </section>

            {/* Tags Category */}
            <section className="pt-3">
              <SectionHeader title={t("Tags Category")} ornamentHeight="h-10" />
              <div className="flex flex-wrap gap-2 sm:gap-3 lg:gap-4 mt-5 justify-center lg:justify-start">
                {categoriesList.map((category, index) => (
                  <CategoryTag
                    key={index}
                    category={category}
                    onClick={handleCategoryClick}
                  />
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventstNewsSection;
