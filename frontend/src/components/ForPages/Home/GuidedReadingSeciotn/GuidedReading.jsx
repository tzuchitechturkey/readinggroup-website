import React, { useState, useEffect } from "react";

import { useTranslation } from "react-i18next";

import GuidingReadingcard from "@/components/Global/GuidingReadingcard/GuidingReadingcard";
import DynamicSection from "@/components/Global/DynamicSection/DynamicSection";
import { TopLikedPosts } from "@/api/posts";

const GuidedReading = ({ data }) => {
  const { t } = useTranslation();
  // const [weeklyGuidData, setWeeklyGuidData] = useState([]);

  // const getWeeklyGuidData = async () => {
  //   try {
  //     const res = await TopLikedPosts();
  //     setWeeklyGuidData(res.data?.reading);
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };
  // useEffect(() => {
  //   getWeeklyGuidData();
  // }, []);

  return (
    <div className="mt-12">
      <DynamicSection
        title={t("Top Viewed Contents")}
        data={data}
        isSlider={true}
        cardName={GuidingReadingcard}
      />
    </div>
  );
};

export default GuidedReading;
