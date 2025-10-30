import React, { useEffect, useState } from "react";

import { useTranslation } from "react-i18next";

import WeekPhotosCard from "@/components/Global/WeekPhotosCard/WeekPhotosCard";
import DynamicSection from "@/components/Global/DynamicSection/DynamicSection";
import { setErrorFn } from "@/Utility/Global/setErrorFn";
import { WeeklyCardPhotoPosts } from "@/api/posts";

const WeekPhotos = () => {
  const { t } = useTranslation();
  const [data, setData] = useState([]);
  const getData = async () => {
    try {
      const res = await WeeklyCardPhotoPosts();
      setData(res.data?.card_photo || []);
    } catch (error) {
      setErrorFn(error, t);
    }
  };
  useEffect(() => {
    getData();
  }, []);
  return (
    <div className="mt-12">
      <DynamicSection
        title={t("This Week's Photos")}
        data={data}
        isSlider={true}
        cardName={WeekPhotosCard}
      />
    </div>
  );
};

export default WeekPhotos;
