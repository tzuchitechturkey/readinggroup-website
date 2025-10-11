import React from "react";

import VideoCard from "@/components/Global/VideoCard/VideoCard";
import DynamicSection from "@/components/Global/DynamicSection/DynamicSection";

const VideoSections = () => {
  const fullVideos = [
    {
      id: 1,
      title: "Complete Reading Session",
      duration: "1h 15min",
      views: "1.2K",
      image: "/authback.jpg",
      isNew: true,
    },
    {
      id: 2,
      title: "Literature Discussion",
      duration: "45min",
      views: "856",
      image: "/authback.jpg",
      isNew: false,
    },
    {
      id: 3,
      title: "Book Review Session",
      duration: "35min",
      views: "643",
      image: "/authback.jpg",
      isNew: false,
    },
    {
      id: 4,
      title: "Reading Workshop",
      duration: "1h 30min",
      views: "934",
      image: "/authback.jpg",
      isNew: true,
    },
    {
      id: 5,
      title: "Story Analysis",
      duration: "50min",
      views: "712",
      image: "/authback.jpg",
      isNew: false,
    },
  ];

  const unitVideos = [
    {
      id: 1,
      title: "Unit 1: Introduction",
      duration: "25min",
      views: "2.1K",
      image: "/authback.jpg",
      unit: "Unit 1",
    },
    {
      id: 2,
      title: "Unit 2: Basics",
      duration: "30min",
      views: "1.8K",
      image: "/authback.jpg",
      unit: "Unit 2",
    },
    {
      id: 3,
      title: "Unit 3: Advanced",
      duration: "40min",
      views: "1.5K",
      image: "/authback.jpg",
      unit: "Unit 3",
    },
    {
      id: 4,
      title: "Unit 4: Practice",
      duration: "35min",
      views: "1.3K",
      image: "/authback.jpg",
      unit: "Unit 4",
    },
    {
      id: 5,
      title: "Unit 5: Review",
      duration: "28min",
      views: "1.1K",
      image: "/authback.jpg",
      unit: "Unit 5",
    },
  ];

  return (
    <div className="mt-12">
      <DynamicSection
        title="This Week's Full Videos"
        data={fullVideos}
        cardName={VideoCard}
        isSlider={true} // ✅ تأكيد أنه carousel وليس grid
      />
      <div className="mt-12">
        <DynamicSection
          title="This Week's Unit Videos"
          data={unitVideos}
          cardName={VideoCard}
          isSlider={true} // ✅ تأكيد أنه carousel وليس grid
        />
      </div>
    </div>
  );
};

export default VideoSections;
