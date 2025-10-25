import React, { useState, useEffect } from "react";

import { useTranslation } from "react-i18next";

import GuidingReadingcard from "@/components/Global/GuidingReadingcard/GuidingReadingcard";
import { readings } from "@/mock/reading";
import DynamicSection from "@/components/Global/DynamicSection/DynamicSection";

const GuidedReading = () => {
  const { t } = useTranslation();
  const [weeklyGuidData, setWeeklyGuidData] = useState([]);

  const getWeeklyGuidData = async () => {
    try {
      const res = await GetWeeklyGuidData();
      setWeeklyGuidData(res.data);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    // getWeeklyGuidData();
  }, []);
  return (
    <div className="mt-12">
      <DynamicSection
        title={t("This Week's Guided Reading")}
        data={readings}
        isSlider={true}
        cardName={GuidingReadingcard}
      />
    </div>
  );
};

export default GuidedReading;
