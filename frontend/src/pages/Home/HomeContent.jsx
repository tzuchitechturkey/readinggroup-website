import React, { useEffect, useState, useCallback, useMemo } from "react";

import { useTranslation } from "react-i18next";

import HomeHeroSlider from "@/components/ForPages/Home/HomeHeroSlider/HomeHeroSlider";
import WeeklyMomentsCard from "@/components/Global/WeeklyMomentsCard/WeeklyMomentsCard";
import WeekPhotosCard from "@/components/Global/WeekPhotosCard/WeekPhotosCard";
import GlobalCard from "@/components/Global/GlobalCard/GlobalCard";
import VideoCard from "@/components/Global/VideoCard/VideoCard";
import { HomeData } from "@/api/home";
import { setErrorFn } from "@/Utility/Global/setErrorFn";
import { GetStatistics } from "@/api/dashboard";
import NewClips from "@/components/ForPages/Home/NewClips/NewClips";
import UpcomingLivestream from "@/components/ForPages/home/UpcomingLivestream/UpcomingLivestream";
import GoodEffectsPoster from "@/components/ForPages/home/GoodEffectsPoster/GoodEffectsPoster";
import RevisitCards from "@/components/ForPages/home/RevisitCards/RevisitCards";

import PhotoCollections from "../../components/ForPages/home/PhotoCollections/PhotoCollections";

export default function HomeContent() {
  const { t, i18n } = useTranslation();
  const [sliderData, setSliderData] = useState(null);
  const [top1Data, setTop1Data] = useState(null);

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

  useEffect(() => {
    Promise.all([getSliderData(), getTop1Data()]).catch((err) => {
      setErrorFn(err, t);
    });
    localStorage.removeItem("redirectAfterLogin");
  }, [getSliderData, getTop1Data, t]);

  return (
    <div
      dir={i18n?.language === "ar" ? "rtl" : "ltr"}
      className="min-h-screen bg-[#C8DDF4]"
    >
      {/* Start Hero Slider */}
      <div>
        <HomeHeroSlider data={sliderData} t={t} />
      </div>
      {/* End Hero Slider */}

      {/* New Clips Section */}
      <div className="py-16">
        <NewClips t={t} />
      </div>

      {/* Upcoming Livestream Section */}
      <div>
        <UpcomingLivestream t={t} />
      </div>

      {/* Good Effects Poster Section */}
      <div className="py-16 pb-10">
        <GoodEffectsPoster t={t} />
      </div>

      {/* Revisit Cards Section */}
      <div>
        <RevisitCards t={t} />
      </div>

      {/* Photo Collections Section */}
      <div className="py-16 pb-12  bg-[#91ADCB]">
        <PhotoCollections t={t} />
      </div>
    </div>
  );
}
