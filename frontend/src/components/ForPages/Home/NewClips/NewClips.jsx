import React from "react";

import VideoCard from "@/components/Global/VideoCard/VideoCard";

import SectionHeader from "../shared/SectionHeader";
import videoCard from "../../../../assets/videoCard.png";
// Mock data for new clips
const mockClipsData = {
  mainVideo: {
    id: 1,
    title: "GUIDED READING",
    category: "GUIDED READING",
    duration: "15:38",
    thumbnail: videoCard,
    description: "Latest guided reading session",
    publishDate: "2025-01-21",
  },
  sideVideos: [
    {
      id: 2,
      title: "EDUCATION",
      category: "EDUCATION",
      duration: "12:45",
      thumbnail: videoCard,
      description: "Educational content",
      publishDate: "2025-01-20",
    },
    {
      id: 3,
      title: "HEALTH",
      category: "HEALTH",
      duration: "10:32",
      thumbnail: videoCard,
      description: "Health and wellness tips",
      publishDate: "2025-01-19",
    },
  ],
};

const NewClips = () => {
  const handleMoreClipsClick = () => {
    // Navigate to full clips page - implement navigation logic here
  };

  return (
    <div className="flex flex-col gap-[16px] sm:gap-[20px] md:gap-[24px] items-start px-4 sm:px-6 md:px-8 lg:px-[120px] w-full sm:w-full md:w-full lg:w-[1440px] mx-auto">
      {/* Section Header */}
      <SectionHeader
        title="NEW CLIPS"
        actionText="More Clips"
        onActionClick={handleMoreClipsClick}
      />

      {/* Videos Grid */}
      <div className="flex flex-col md:flex-row gap-[16px] sm:gap-[20px] md:gap-[24px] items-start justify-center w-full md:w-[1200px]">
        {/* Main Large Video */}
        <VideoCard video={mockClipsData.mainVideo} size="large" />

        {/* Side Videos Column */}
        <div className="flex flex-col gap-[12px] sm:gap-[14px] md:gap-[16px] items-start justify-center w-full md:w-auto">
          {mockClipsData.sideVideos.map((video) => (
            <VideoCard key={video.id} video={video} size="small" />
          ))}
        </div>
      </div>
    </div>
  );
};

export default NewClips;
