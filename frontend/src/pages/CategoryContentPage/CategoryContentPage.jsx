import React, { useEffect, useState } from "react";

import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { GetPostsByCategoryId } from "@/api/posts";
import { GetVideosByCategoryId } from "@/api/videos";
import { GetContentsByCategoryId } from "@/api/contents";
import { GetEventsByCategoryId } from "@/api/events";
import DynamicSection from "@/components/Global/DynamicSection/DynamicSection";
import VideoCard from "@/components/Global/VideoCard/VideoCard";
import EventCard from "@/components/Global/EventCard/EventCard";
import Loader from "@/components/Global/Loader/Loader";
import Contentcard from "@/components/Global/Contentcard/Contentcard";

function CategoryContentPage() {
  const { type, id } = useParams();
  const { t, i18n } = useTranslation();
  const [items, setItems] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [offset, setOffset] = useState(0);
  const [hasMoreData, setHasMoreData] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const limit = 8;

  // Map type to appropriate card component
  const cardComponentMap = {
    videos: VideoCard,
    events: EventCard,
    contents: Contentcard,
    posts: VideoCard,
  };

  // Map type to appropriate API function
  const apiFunctionMap = {
    videos: GetVideosByCategoryId,
    events: GetEventsByCategoryId,
    contents: GetContentsByCategoryId,
    posts: GetPostsByCategoryId,
  };

  // Fetch data for the category
  const fetchCategoryData = async (newOffset = 0) => {
    if (!type || !id) return;

    const isLoadMoreCall = newOffset > 0;
    if (!isLoadMoreCall) {
      setIsLoading(true);
    } else {
      setIsLoadingMore(true);
    }

    try {
      const apiFunction = apiFunctionMap[type];
      if (!apiFunction) {
        console.error(`Unknown type: ${type}`);
        return;
      }

      const res = await apiFunction(id, limit, newOffset);

      // Get category name from first item if available
      if (newOffset === 0 && res.data?.results?.length > 0) {
        const firstItem = res.data.results[0];
        if (firstItem.category?.name) {
          setCategoryName(firstItem.category.name);
        } else if (firstItem.category_name) {
          setCategoryName(firstItem.category_name);
        }
      }

      // Update items based on whether it's a load more call
      if (newOffset === 0) {
        setItems(res.data?.results || []);
      } else {
        setItems((prev) => [...prev, ...(res.data?.results || [])]);
      }

      // Calculate if more data exists
      const totalFetched = newOffset + (res.data?.results?.length || 0);
      setHasMoreData(totalFetched < (res.data?.count || 0));
      setOffset(totalFetched);
    } catch (error) {
      console.error(`Error fetching ${type} for category:`, error);
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  };

  // Initial load
  useEffect(() => {
    setOffset(0);
    setItems([]);
    fetchCategoryData(0);
  }, [type, id]);

  // Handle load more
  const handleLoadMore = async () => {
    await fetchCategoryData(offset);
  };

  const CardComponent = cardComponentMap[type] || VideoCard;

  return (
    <div
      className="min-h-screen bg-gray-100"
      dir={i18n?.language === "ar" ? "rtl" : "ltr"}
    >
      {isLoading && <Loader />}

      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-500 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => window.history.back()}
                className="flex items-center justify-center w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 transition-all duration-200 text-white"
                title={t("Back")}
              >
                <span className="text-xl">
                  {i18n?.language === "ar" ? "→" : "←"}
                </span>
              </button>
              <div>
                <p className="text-white/80 text-sm font-medium">{t("Category")}</p>
                <h1 className="text-white text-3xl font-bold">
                  {categoryName || t(type) || "Content"}
                </h1>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {items.length > 0 ? (
          <DynamicSection
            title={categoryName || t(type) || "Category"}
            titleClassName="text-[30px] font-medium mb-6"
            gridClassName="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
            data={items}
            isSlider={false}
            cardName={CardComponent}
            enableLoadMore={hasMoreData}
            onLoadMore={handleLoadMore}
            isLoadingMore={isLoadingMore}
          />
        ) : !isLoading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <p className="text-gray-500 text-lg">
                {t("No items found in this category")}
              </p>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default CategoryContentPage;
