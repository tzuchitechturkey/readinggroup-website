import React, { useEffect, useState } from "react";

import { useTranslation } from "react-i18next";

import VideosHeader from "@/components/ForPages/Videos/VideosHeader/VideosHeader";
import VideoFilterSections from "@/components/ForPages/Videos/VideoFilterSections/VideoFilterSections";
import DynamicSection from "@/components/Global/DynamicSection/DynamicSection";
import VideoCard from "@/components/Global/VideoCard/VideoCard";
import {
  GetMyListedVideos,
  GetTopLikedVideos,
  GetTopMixVideos,
} from "@/api/videos";

function VideosPageContent() {
  const { i18n } = useTranslation();
  const [topMixVideos, setTopMixVideos] = useState([]);
  const [myListedVideos, setMyListedVideos] = useState([]);
  const [likedVideos, setLikedVideos] = useState([]);
  const getMyListedVideos = async () => {
    try {
      const res = await GetMyListedVideos(10, 0, "");
      setMyListedVideos(res.data?.results || []);
    } catch (err) {
      console.error("Failed to fetch my listed videos:", err);
    }
  };
  const getLikedVideos = async () => {
    try {
      const res = await GetTopLikedVideos();
      setLikedVideos(res.data);
    } catch (err) {
      console.error("Failed to fetch liked videos:", err);
    }
  };
  const getTopMixVideos = async () => {
    try {
      const res = await GetTopMixVideos();
      setTopMixVideos(res.data);
    } catch (err) {
      console.error("Failed to fetch top mix videos:", err);
    }
  };

  useEffect(() => {
    getTopMixVideos();
    getMyListedVideos();
    getLikedVideos();
  }, []);
  return (
    <div
      className="min-h-screen bg-gray-100"
      dir={i18n?.language === "ar" ? "rtl" : "ltr"}
    >
      {/* Hero Section */}
      <VideosHeader top1Video={topMixVideos?.top_1} />

      {/* Start Filter Secion */}
      <VideoFilterSections
        fullVideos={topMixVideos?.top_5_full || []}
        unitVideos={topMixVideos?.top_5_unit || []}
        likedVideos={likedVideos}
      />
      {/* End Filter Secion */}

      {/* Start My LIST */}
      <div className="my-3">
        <DynamicSection
          title="My LIST"
          titleClassName="text-[30px] font-medium mb-2"
          data={myListedVideos}
          isSlider={false}
          viewMore={true}
          cardName={VideoCard}
          viewMoreUrl="/my-list"
        />
      </div>
      {/* End My LIST */}
      {/* Start Full Video */}
      <div className="my-3">
        <DynamicSection
          title="Full Video"
          titleClassName="text-[30px] font-medium mb-2"
          data={topMixVideos?.top_5_full}
          isSlider={false}
          cardName={VideoCard}
          viewMoreUrl="/videos"
        />
      </div>
      {/* End Full Video */}
      {/* Start Unit  Video */}
      <div className="my-3  pb-4">
        <DynamicSection
          title="Unit  Video"
          titleClassName="text-[30px] font-medium mb-2"
          data={topMixVideos?.top_5_unit}
          isSlider={false}
          cardName={VideoCard}
          viewMoreUrl="/videos"
        />
      </div>
      {/* End Unit  Video */}
    </div>
  );
}

export default VideosPageContent;
