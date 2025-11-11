import React, { useState, useEffect } from "react";

import DynamicSection from "@/components/Global/DynamicSection/DynamicSection";
import { GetPosts } from "@/api/posts";
import { GetContents } from "@/api/contents";
import GuidingReadingcard from "@/components/Global/GuidingReadingcard/GuidingReadingcard";
import WeekPhotosCard from "@/components/Global/WeekPhotosCard/WeekPhotosCard";

const WeeklyList = ({ title, type }) => {
  const [weeklyData, setWeeklyData] = useState([]);

  const getWeeklyData = async () => {
    try {
      let res;
      if (type === "content") {
        // Use GetContents for content type
        res = await GetContents(20, 0,"published", {
          is_weekly_moment: true,
        });
      } else {
        // Use GetPosts for other types (photo, etc.)
        res = await GetPosts(20, 0, "published", {
          post_type: type,
          is_weekly_moment: true,
        });
      }
      setWeeklyData(res.data?.results || []);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    getWeeklyData();
  }, []);
  return (
    <div className="mt-6 md:mt-9 lg:mt-12">
      <DynamicSection
        title={title}
        data={weeklyData}
        cardName={type === "photo" ? WeekPhotosCard : GuidingReadingcard}
        isSlider={true}
        propsToCard={{ showTags: false }}
      />
    </div>
  );
};

export default WeeklyList;
