import React, { useEffect, useState, useCallback, useMemo } from "react";

import { useTranslation } from "react-i18next";

import HomeHeroSlider from "@/components/ForPages/Home/HomeHeroSlider/HomeHeroSlider";
import WeeklyMomentsCard from "@/components/Global/WeeklyMomentsCard/WeeklyMomentsCard";
import WeekPhotosCard from "@/components/Global/WeekPhotosCard/WeekPhotosCard";
import GuidingReadingcard from "@/components/Global/Contentcard/Contentcard";
import VideoCard from "@/components/Global/VideoCard/VideoCard";
import { HomeData } from "@/api/home";
import { setErrorFn } from "@/Utility/Global/setErrorFn";
import { GetStatistics } from "@/api/dashboard";
import DynamicHomeCard from "@/components/ForPages/Home/DynamicHomeCard/DynamicHomeCard";

export default function HomeContent() {
  const { t, i18n } = useTranslation();
  const [sliderData, setSliderData] = useState(null);
  const [top1Data, setTop1Data] = useState(null);

  // استخدام useCallback لتجنب إعادة إنشاء الدوال في كل render
  const getSliderData = useCallback(async () => {
    try {
      const res = await HomeData();
      setSliderData(res.data);
    } catch (error) {
      setErrorFn(error, t);
    }
  }, [t]);

  const getTop1Data = useCallback(async () => {
    try {
      const res = await GetStatistics();
      setTop1Data(res.data?.top_liked);
    } catch (error) {
      setErrorFn(error, t);
    }
  }, [t]);

  // Parallel API calls بدلاً من sequential
  useEffect(() => {
    Promise.all([getSliderData(), getTop1Data()]).catch((err) => {
      setErrorFn(err, t);
    });
    localStorage.removeItem("redirectAfterLogin");
  }, [getSliderData, getTop1Data, t]);

  // مemoized data mapping لتجنب إعادة الحسابات
  const filteredSections = useMemo(() => {
    if (!top1Data) return [];

    return Object.entries(top1Data)
      .filter(
        ([key]) =>
          key !== "top_posts" && key !== "weekly_moment" && key !== "event"
      )
      .map(([key, sec]) => ({
        key,
        sec,
        title:
          key === "video"
            ? t("This Week's Video")
            : key === "content"
            ? t("This Week's Contents")
            : key === "post_card"
            ? t("This Week's Card")
            : key === "post_photo"
            ? t("This Week's Photo")
            : "",
        description:
          key === "video"
            ? t("Watch this week's featured video")
            : key === "content"
            ? t("Master Cheng Yen's Daily Journal")
            : key === "post_card"
            ? t("Explore this week's card")
            : key === "post_photo"
            ? t("Check this week's photo post")
            : "",
        href:
          key === "video"
            ? "/videos"
            : key === "content"
            ? "/contents"
            : key === "post_card" || key === "post_photo"
            ? "/cards-photos"
            : "",
        cardName:
          key === "video"
            ? VideoCard
            : key === "content"
            ? GuidingReadingcard
            : key === "post_card"
            ? WeeklyMomentsCard
            : key === "post_photo"
            ? WeekPhotosCard
            : null,
        propsToCard:
          key === "video" ? { className: "h-full w-full", bigCart: true } : {},
      }));
  }, [top1Data, t]);

  return (
    <div dir={i18n?.language === "ar" ? "rtl" : "ltr"} className="min-h-screen">
      {/* Start Hero Slider */}
      <div>
        <HomeHeroSlider data={sliderData} />
      </div>
      {/* End Hero Slider */}

      {/* Dynamic Sections */}
      {filteredSections.map(
        (
          { key, sec, title, description, href, cardName, propsToCard },
          index
        ) => (
          <div key={`${sec?.id}-${key}`}>
            <DynamicHomeCard
              index={index}
              title={title}
              description={description}
              href={href}
              cardName={cardName}
              item={sec}
              propsToCard={propsToCard}
            />
          </div>
        )
      )}
    </div>
  );
}
