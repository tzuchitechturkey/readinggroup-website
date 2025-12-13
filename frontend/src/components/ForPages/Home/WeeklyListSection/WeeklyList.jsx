import React, { useState, useEffect } from "react";

import DynamicSection from "@/components/Global/DynamicSection/DynamicSection";
import { GetPosts, WeeklyMomentPosts } from "@/api/posts";
import { GetContents } from "@/api/contents";
import Contentcard from "@/components/Global/Contentcard/Contentcard";
import WeekPhotosCard from "@/components/Global/WeekPhotosCard/WeekPhotosCard";

const WeeklyList = ({ title, type }) => {
  const [weeklyData, setWeeklyData] = useState([]);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [limit] = useState(8);
  const [offset, setOffset] = useState(0);
  const [hasMoreData, setHasMoreData] = useState(true);

  const getWeeklyData = async (newOffset = 0) => {
    try {
      let res;
      if (type === "content") {
        // Use GetContents for content type
        res = await GetContents(limit, newOffset, "published", {
          is_weekly_moment: true,
        });
      } else {
        // Use GetPosts for other types (photo, etc.)
        res = await WeeklyMomentPosts(type, limit, newOffset);
      }
      const results = res.data?.results || [];

      // تحديد ما إذا كانت هناك بيانات إضافية
      if (newOffset === 0) {
        setWeeklyData(results);
      } else {
        setWeeklyData((prev) => [...prev, ...results]);
      }

      // تحديد ما إذا كانت هناك بيانات أكثر للجلب
      setHasMoreData(results.length === limit);
      setOffset(newOffset + limit);
    } catch (error) {
      console.error(error);
      setHasMoreData(false);
    }
  };

  const handleLoadMore = async () => {
    setIsLoadingMore(true);
    try {
      await getWeeklyData(offset);
    } finally {
      setIsLoadingMore(false);
    }
  };

  useEffect(() => {
    getWeeklyData(0);
  }, [type]);

  return (
    <div className="mt-6 md:mt-9 lg:mt-12">
      <DynamicSection
        title={title}
        data={weeklyData}
        cardName={type === "photo" ? WeekPhotosCard : Contentcard}
        isSlider={true}
        propsToCard={{ showTags: false }}
        enableLoadMore={hasMoreData}
        onLoadMore={handleLoadMore}
        isLoadingMore={isLoadingMore}
      />
    </div>
  );
};

export default WeeklyList;
