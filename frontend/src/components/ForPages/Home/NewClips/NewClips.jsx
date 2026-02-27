import React from "react";

import { useNavigate } from "react-router-dom";

import VideoCard from "@/components/Global/VideoCard/VideoCard";

import SectionHeader from "../shared/SectionHeader";

const NewClips = ({ clips, t }) => {
  const navigate = useNavigate();
  const handleMoreClipsClick = () => {
    // Add param to path
    navigate("/videos" + "?type=clip_video");
  };
   return (
    <div className="flex flex-col gap-[16px] sm:gap-[20px] md:gap-[24px] items-start px-4 sm:px-6 md:px-8 lg:px-[120px] w-full sm:w-full md:w-full lg:w-[1440px] mx-auto">
      {/* Section Header */}
      <SectionHeader
        title={t("NEW CLIPS")}
        actionText={t("More Clips")}
        onActionClick={handleMoreClipsClick}
      />

      {/* Videos Grid */}
      <div className="flex flex-col md:flex-row gap-[16px] sm:gap-[20px] md:gap-[24px] items-start justify-center w-full md:w-[1200px]">
        {/* Main Large Video */}
        <VideoCard
          item={clips[0]}
          size="large"
          navigate={navigate}
          rounded={true}
          textClassName="!justify-start gap-[4px] "
        />

        {/* Side Videos Column */}
        <div className="flex flex-col gap-[12px] sm:gap-[14px] md:gap-[16px] items-start justify-center w-full md:w-auto">
          {clips.slice(1).map((video) => (
            <VideoCard
              key={video.id}
              item={video}
              size="small"
              navigate={navigate}
              rounded={true}
              textClassName="!justify-start gap-[4px] "
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default NewClips;
