import React, { useState, useEffect } from "react";

import { useTranslation } from "react-i18next";

import DynamicSection from "@/components/Global/DynamicSection/DynamicSection";
import WeeklyMomentsCard from "@/components/Global/WeeklyMomentsCard/WeeklyMomentsCard";
import { WeeklyReadingPosts } from "@/api/posts";

const WeeklyMoments = () => {
  const { t } = useTranslation();
  const [weeklyMomentData, setWeeklyMomentData] = useState([]);

  const getWeeklyMomentData = async () => {
    try {
      const res = await WeeklyReadingPosts();
      setWeeklyMomentData(res.data?.reading);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    getWeeklyMomentData();
  }, []);
  return (
    <div className="mt-6 md:mt-9 lg:mt-12">
      <DynamicSection
        title={t("This Weekly Moments")}
        data={weeklyMomentData}
        cardName={WeeklyMomentsCard}
        isSlider={true}
      />
    </div>
  );
};

export default WeeklyMoments;
