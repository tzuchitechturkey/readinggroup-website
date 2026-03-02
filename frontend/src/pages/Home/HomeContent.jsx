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
import { GetCarsdsForHome, GetTopOnePoster } from "@/api/learn";
import { GetEvents } from "@/api/events";

export default function HomeContent() {
  const { t } = useTranslation();
  const [videoData, setVideoData] = useState(null);
  const [cardsData, setCardsData] = useState(null);
  const [posterData, setPosterData] = useState({});
  const [upcomingLivestreamData, setUpcomingLivestreamData] = useState([]);

  const fetchVideoData = async () => {
    try {
      const res = await GetVideosByTypeVideo();
      setVideoData(res.data);
    } catch (error) {
      setErrorFn(error, t);
    }
  };

  const fetchCardsData = async () => {
    try {
      const res = await GetCarsdsForHome();
      setCardsData(res.data);
    } catch (error) {
      setErrorFn(error, t);
    }
  };
  const fetchPosterData = async () => {
    try {
      const res = await GetTopOnePoster();
      setPosterData(res.data);
    } catch (error) {
      setErrorFn(error, t);
    }
  };
  const fetchUpcomingLivestream = async () => {
    try {
      const res = await GetEvents(4, 0);
      setUpcomingLivestreamData(res.data?.results || []);
    } catch (error) {
      setErrorFn(error, t);
    }
  };
  useEffect(() => {
    fetchVideoData();
    fetchPosterData();
    fetchCardsData();
    fetchUpcomingLivestream();
  }, []);
  return (
    <div className="min-h-screen bg-[#C8DDF4]">
      {/* Start Hero Slider */}
      <div>
        <HomeHeroSlider t={t} fullLiveStream={videoData?.full_video[0]} />
      </div>
      {/* End Hero Slider */}

      {/* New Clips Section */}
      <div className="py-16">
        <NewClips clips={videoData?.clip_video || []} t={t} />
      </div>

      {/* Upcoming Livestream Section */}
      <div>
        <UpcomingLivestream t={t} data={upcomingLivestreamData} />
      </div>

      {/* Good Effects Poster Section */}
      <div className="py-16 pb-10">
        {posterData?.id && <GoodEffectsPoster poster={posterData} t={t} />}
      </div>

      {/* Revisit Cards Section */}
      <div>
        <RevisitCards data={cardsData?.cards || []} t={t} />
      </div>

      {/* Photo Collections Section */}
      <div className="py-16 pb-12  bg-[#91ADCB]">
        <PhotoCollections t={t} />
      </div>
    </div>
  );
}
