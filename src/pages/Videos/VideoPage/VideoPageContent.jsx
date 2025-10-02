import React from "react";

import { useTranslation } from "react-i18next";

import CustomyoutubeVideo from "@/components/ForPages/Videos/VideoPage/CustomyoutubeVideo/CustomyoutubeVideo";
import DynamicSection from "@/components/Global/DynamicSection/DynamicSection";
import VideoCard from "@/components/Global/VideoCard/VideoCard";
import { mockVideos } from "@/mock/Viedeos";
import CommentsSection from "@/components/ForPages/Videos/VideoPage/CommentsSection/CommentsSection";

function VideoPageContent() {
  const { t } = useTranslation();

  return (
    <div className="bg-white">
      {/* Start Show Video */}
      <CustomyoutubeVideo />
      {/* End Show Video */}

      {/* Start Content of a similar type */}
      <div className="bg-white">
        <DynamicSection
          title="Similar Content"
          titleClassName="text-[21px] sm:text-2xl md:text-3xl font-medium  "
          data={mockVideos}
          isSlider={false}
          cardName={VideoCard}
          viewMore={true}
          viewMoreUrl="/videos"
        />
      </div>
      {/* End Content of a similar type */}

      {/* Start Comments Section */}
      <div className="w-full">
        <div className="w-full lg:w-3/4 lg:pl-8">
          <CommentsSection />
        </div>
      </div>
      {/* End Comments Section */}
    </div>
  );
}

export default VideoPageContent;
