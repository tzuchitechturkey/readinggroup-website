import React from "react";

import { useTranslation } from "react-i18next";

import VideosHeader from "@/components/ForPages/Videos/VideosHeader/VideosHeader";
import FilterSections from "@/components/ForPages/Videos/VideoFilterSections/VideoFilterSections";
import DynamicSection from "@/components/Global/DynamicSection/DynamicSection";
import VideoCard from "@/components/Global/VideoCard/VideoCard";
import { mockVideos } from "@/mock/Viedeos";

function VideosPageContent() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gray-100">
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
          data={mockVideos}
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
          data={mockVideos}
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
