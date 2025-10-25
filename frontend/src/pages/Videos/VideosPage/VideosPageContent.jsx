import React, { useEffect, useState } from "react";

import { useTranslation } from "react-i18next";

import VideosHeader from "@/components/ForPages/Videos/VideosHeader/VideosHeader";
import FilterSections from "@/components/ForPages/Videos/VideoFilterSections/VideoFilterSections";
import DynamicSection from "@/components/Global/DynamicSection/DynamicSection";
import VideoCard from "@/components/Global/VideoCard/VideoCard";
import { mockVideos } from "@/mock/Viedeos";
import { GetMyListedVideos, GetTopViewedVideos } from "@/api/videos";

function VideosPageContent() {
  const { i18n } = useTranslation();
  const [topViewedVideos, setTopViewedVideos] = useState([]);
  const [myListedVideos, setMyListedVideos] = useState([]);
  const getMyListedVideos = async () => {
    try {
      const res = await GetMyListedVideos();
      setMyListedVideos(res.data);
    } catch (err) {
      console.error("Failed to fetch my listed videos:", err);
    }
  };
  const getTopViewedVideos = async () => {
    try {
      const res = await GetTopViewedVideos();
      setTopViewedVideos(res.data);
    } catch (err) {
      console.error("Failed to fetch top viewed videos:", err);
    }
  };
  useEffect(() => {
    getTopViewedVideos();
    getMyListedVideos();
  }, []);
  return (
    <div
      className="min-h-screen bg-gray-100"
      dir={i18n?.language === "ar" ? "rtl" : "ltr"}
    >
      {/* Hero Section */}
      <VideosHeader />

      {/* Start Filter Secion */}
      <FilterSections />
      {/* End Filter Secion */}

      {/* Start TOP 5 */}
      <div className="">
        <DynamicSection
          title="Top 5 in your like"
          titleClassName="text-[30px] font-medium mb-2"
          data={topViewedVideos}
          isSlider={false}
          cardName={VideoCard}
          viewMore={true}
          viewMoreUrl="/videos"
        />
      </div>
      {/* End TOP 5 */}
      {/* Start My LIST */}
      <div className="my-3">
        <DynamicSection
          title="My LIST"
          titleClassName="text-[30px] font-medium mb-2"
          data={myListedVideos}
          isSlider={false}
          cardName={VideoCard}
          viewMore={true}
          viewMoreUrl="/videos"
        />
      </div>
      {/* End My LIST */}
      {/* Start Full Video */}
      <div className="my-3">
        <DynamicSection
          title="Full Video"
          titleClassName="text-[30px] font-medium mb-2"
          data={mockVideos}
          isSlider={false}
          cardName={VideoCard}
          viewMore={true}
          viewMoreUrl="/videos"
        />
      </div>
      {/* End Full Video */}
      {/* Start Unit  Video */}
      <div className="my-3">
        <DynamicSection
          title="Unit  Video"
          titleClassName="text-[30px] font-medium mb-2"
          data={mockVideos}
          isSlider={false}
          cardName={VideoCard}
          viewMore={true}
          viewMoreUrl="/videos"
        />
      </div>
      {/* End Unit  Video */}
    </div>
  );
}

export default VideosPageContent;
