import React, { useState, useEffect } from "react";

import CustomyoutubeVideo from "@/components/ForPages/Videos/VideoPage/CustomyoutubeVideo/CustomyoutubeVideo";
import DynamicSection from "@/components/Global/DynamicSection/DynamicSection";
import VideoCard from "@/components/Global/VideoCard/VideoCard";
import CommentsSection from "@/components/Global/CommentsSection/CommentsSection";
import Loader from "@/components/Global/Loader/Loader";
import { GetEventById } from "@/api/events";
import { GetTop5ViewedVideos } from "@/api/videos";

function EventsVideoPage() {
  const [isLoading, setIsLoading] = useState(false);
  const videoId = window.location.pathname.split("/").pop();
  const [videoData, setVideoData] = useState(null);
  const [top5VideoData, setTop5VideoData] = useState(null);
  const getData = async () => {
    setIsLoading(true);
    try {
      const res = await GetEventById(videoId);
      setVideoData(res.data);
    } catch (err) {
      console.error("Failed to fetch video data:", err);
    } finally {
      setIsLoading(false);
    }
  };
  const getTopViewed = async () => {
    setIsLoading(true);
    try {
      const res = await GetTop5ViewedVideos();
      setTop5VideoData(res.data);
    } catch (err) {
      console.error("Failed to fetch video data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getData();
    getTopViewed();
  }, [videoId]);

  return (
    <div className="bg-white">
      {isLoading && <Loader />}
      {/* Start Show Video */}
      <CustomyoutubeVideo videoData={videoData} />
      {/* End Show Video */}

      {/* Start Content of a similar type */}
      <div className="bg-white">
        <DynamicSection
          title={t("Similar Content")}
          titleClassName="text-[21px] sm:text-2xl md:text-3xl font-medium  "
          data={top5VideoData}
          isSlider={false}
          cardName={VideoCard}
          viewMoreUrl="/videos"
        />
      </div>
      {/* End Content of a similar type */}

      {/* Start Comments Section */}
      <div className="w-full">
        <div className="w-full lg:w-3/4 lg:pl-8">
          <CommentsSection itemId={videoId} type={"video"} />
        </div>
      </div>
      {/* End Comments Section */}
    </div>
  );
}

export default EventsVideoPage;
