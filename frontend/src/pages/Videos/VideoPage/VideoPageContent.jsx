import React, { useState, useEffect } from "react";

import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";

import CustomyoutubeVideo from "@/components/ForPages/Videos/VideoPage/CustomyoutubeVideo/CustomyoutubeVideo";
import DynamicSection from "@/components/Global/DynamicSection/DynamicSection";
import VideoCard from "@/components/Global/VideoCard/VideoCard";
import CommentsSection from "@/components/Global/CommentsSection/CommentsSection";
import { GetTop5ViewedVideos, GetVideoById } from "@/api/videos";
import Loader from "@/components/Global/Loader/Loader";

function VideoPageContent() {
  const { t, i18n } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const { id: paramId } = useParams();
  const [videoData, setVideoData] = useState(null);
  // const [top5VideoData, setTop5VideoData] = useState(null);

  const getData = async () => {
    setIsLoading(true);
    try {
      const res = await GetVideoById(paramId);
      setVideoData(res.data);
    } catch (err) {
      console.error("Failed to fetch video data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // const getTopViewed = async () => {
  //   setIsLoading(true);
  //   try {
  //     const res = await GetTop5ViewedVideos();
  //     setTop5VideoData(res.data);
  //   } catch (err) {
  //     console.error("Failed to fetch video data:", err);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  useEffect(() => {
    getData();
  }, [paramId]);

  // useEffect(() => {
  //   getTopViewed();
  // }, []);

  return (
    <div className="bg-white" dir={i18n.language === "ar" ? "rtl" : "ltr"}>
      {isLoading && <Loader />}
      {/* Start Show Video */}
      <CustomyoutubeVideo videoData={videoData} />
      {/* End Show Video */}
      <div className="max-w-7xl mx-auto">
        {/* Start Content of a similar type */}
        {/* <div className="bg-white">
          <DynamicSection
            title={t("Similar Content")}
            titleClassName="text-[21px] sm:text-2xl md:text-3xl font-medium  "
            data={top5VideoData}
            isSlider={false}
            cardName={VideoCard}
            viewMoreUrl="/videos"
          />
        </div> */}
        {/* End Content of a similar type */}
      </div>
    </div>
  );
}

export default VideoPageContent;
