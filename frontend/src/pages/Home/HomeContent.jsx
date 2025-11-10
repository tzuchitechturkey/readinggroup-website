import React, { useEffect, useState } from "react";

import { useTranslation } from "react-i18next";

import HeroSlider from "@/components/ForPages/Home/HeroSliderSection/HeroSlider";
import WeeklyMomentsCard from "@/components/Global/WeeklyMomentsCard/WeeklyMomentsCard";
import WeekPhotosCard from "@/components/Global/WeekPhotosCard/WeekPhotosCard";
import GuidingReadingcard from "@/components/Global/GuidingReadingcard/GuidingReadingcard";
import VideoCard from "@/components/Global/VideoCard/VideoCard";
import { HomeData } from "@/api/home";
import { setErrorFn } from "@/Utility/Global/setErrorFn";
import { GetStatistics } from "@/api/dashboard";
import DynamicHomeCard from "@/components/ForPages/Home/DynamicHomeCard/DynamicHomeCard";

export default function HomeContent() {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === "ar";
  const direction = isRtl ? "rtl" : "ltr";
  const [sliderData, setSliderData] = useState(null);
  const [top1Data, setTop1Data] = useState(null);

  const getSliderData = async () => {
    try {
      const res = await HomeData();
      setSliderData(res.data);
    } catch (error) {
      setErrorFn(error, t);
    }
  };

  const getTop1Data = async () => {
    try {
      const res = await GetStatistics();
      setTop1Data(res.data?.top_liked);
    } catch (error) {
      setErrorFn(error, t);
    }
  };

  useEffect(() => {
    getSliderData();
    getTop1Data();
    localStorage.removeItem("redirectAfterLogin");
  }, []);

  return (
    <div dir={direction} className="min-h-screen">

      {/* Start Hero Slider */}
      <div dir="ltr">
        <HeroSlider data={sliderData} />
      </div>
      {/* End Hero Slider */}

      {Object.entries(top1Data || {})
        .filter(
          ([key]) =>
            key !== "top_posts" && key !== "weekly_moment" && key !== "event"
        )
        .map(([key, sec], index) => (
          <div key={sec?.id}>
            <DynamicHomeCard
              index={index}
              title={
                key === "video"
                  ? t("This Week's Video")
                  : key === "post_reading"
                  ? t("This Week’s Guided Reading")
                  : key === "post_card"
                  ? t("This Week's Card")
                  : key === "post_photo"
                  ? t("This Week's Photo")
                  : ""
              }
              description={
                key === "video"
                  ? t("Watch this week's featured video")
                  : key === "post_reading"
                  ? t("Master Cheng Yen's Daily Journal")
                  : key === "post_card"
                  ? t("Explore this week's card")
                  : key === "post_photo"
                  ? t("Check this week's photo post")
                  : ""
              }
              href={
                key === "video"
                  ? "/videos"
                  : key === "post_reading"
                  ? "/guiding-reading"
                  : key === "post_card" || key === "post_photo"
                  ? "/cards-photos"
                  : ""
              }
              cardName={
                key === "video"
                  ? VideoCard
                  : key === "post_reading"
                  ? GuidingReadingcard
                  : key === "post_card"
                  ? WeeklyMomentsCard
                  : key === "post_photo"
                  ? WeekPhotosCard
                  : null
              }
              item={sec}
              propsToCard={
                key === "video"
                  ? { className: "h-full w-full", bigCart: true }
                  : {}
              }
            />
          </div>
        ))}
    </div>
  );
}
