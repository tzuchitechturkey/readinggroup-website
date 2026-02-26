import React, { useEffect, useState } from "react";

import { useTranslation } from "react-i18next";

import HomeHeroSlider from "@/components/ForPages/Home/HomeHeroSlider/HomeHeroSlider";
// import { HomeData } from "@/api/home";
import { setErrorFn } from "@/Utility/Global/setErrorFn";
import NewClips from "@/components/ForPages/Home/NewClips/NewClips";
import RevisitCards from "@/components/ForPages/Home/RevisitCards/RevisitCards";
import GoodEffectsPoster from "@/components/ForPages/Home/GoodEffectsPoster/GoodEffectsPoster";
import UpcomingLivestream from "@/components/ForPages/Home/UpcomingLivestream/UpcomingLivestream";
import PhotoCollections from "@/components/ForPages/Home/PhotoCollections/PhotoCollections";
import { GetVideosByTypeVideo } from "@/api/videos";

export default function HomeContent() {
  const { t, i18n } = useTranslation();
  const [data, setData] = useState(null);

  const fetchData = async () => {
    try {
      const res = await GetVideosByTypeVideo();
      setData(res.data);
    } catch (error) {
      setErrorFn(error, t);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);
  return (
    <div
      dir={i18n?.language === "ar" ? "rtl" : "ltr"}
      className="min-h-screen bg-[#C8DDF4]"
    >
      {/* Start Hero Slider */}
      <div>
        <HomeHeroSlider t={t} fullLiveStream={data?.full_video[0]} />
      </div>
      {/* End Hero Slider */}

      {/* New Clips Section */}
      <div className="py-16">
        <NewClips clips={data?.clip_video || []} t={t} />
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
