import React, { useState } from "react";

import DynamicSection from "@/components/Global/DynamicSection/DynamicSection";
import VideoCard from "@/components/Global/VideoCard/VideoCard";

const TabsSection = () => {
  const [activeTab, setActiveTab] = useState("episodes");

  const tabs = [
    { id: "episodes", label: "Episodes" },
    { id: "reviews", label: "User Reviews" },
  ];
  const allVideos = [
    {
      id: 1,
      title: "Weekly Feature",
      duration: "25:00",
      category: "Health News",
      type: "Unit Video",
      subject: "Health",
      language: "Arabic",
      image: "/src/assets/authback.jpg",
      featured: true,
    },
    {
      id: 2,
      title: "Weekly Feature",
      duration: "25:00",
      category: "Health News",
      type: "Unit Video",
      subject: "Health",
      language: "Arabic",
      image: "/src/assets/authback.jpg",
      featured: false,
    },
    {
      id: 3,
      title: "Weekly Feature",
      duration: "25:00",
      category: "Health News",
      type: "Full Videos",
      subject: "Health",
      language: "Chinese",
      image: "/src/assets/authback.jpg",
      featured: false,
    },
    {
      id: 4,
      title: "Weekly Feature",
      duration: "25:00",
      category: "Health News",
      type: "Unit Video",
      subject: "Environment",
      language: "Arabic",
      image: "/src/assets/authback.jpg",
      featured: false,
    },
    {
      id: 5,
      title: "Weekly Feature",
      duration: "25:00",
      category: "Health News",
      type: "Full Videos",
      subject: "Environment",
      language: "Chinese",
      image: "/src/assets/authback.jpg",
      featured: false,
    },
  ];
  return (
    <div className="w-full">
      {/* Tab Navigation */}
      <div className="flex border-b border-gray-200 mb-4 sm:mb-6 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 sm:px-6 py-2 sm:py-3 font-medium text-sm sm:text-base md:text-lg transition-all duration-300 border-b-2 whitespace-nowrap flex-shrink-0 ${
              activeTab === tab.id
                ? "text-black border-black"
                : "text-gray-500 border-transparent hover:text-gray-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="mb-8 sm:mb-12 md:mb-16">
        {activeTab === "episodes" && (
          <div className="space-y-3 sm:space-y-4">
            <DynamicSection
              title="1-8 Episodes"
              titleClassName="text-xl sm:text-2xl md:text-3xl font-medium mb-4 md:mb-4"
              data={allVideos}
              isSlider={false}
              cardName={VideoCard}
              viewMore={true}
              viewMoreUrl="/videos"
            />
          </div>
        )}

        {activeTab === "reviews" && (
          <div className="space-y-3 sm:space-y-4">
            <DynamicSection
              title="User Reviews"
              titleClassName="text-xl sm:text-2xl md:text-3xl font-medium mb-2 sm:mb-3 md:mb-4"
              data={allVideos}
              isSlider={false}
              cardName={VideoCard}
              viewMore={true}
              viewMoreUrl="/videos"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default TabsSection;
