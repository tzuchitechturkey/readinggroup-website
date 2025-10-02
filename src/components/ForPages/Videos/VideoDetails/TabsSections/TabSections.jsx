import React, { useState } from "react";

import { ChevronDown } from "lucide-react";

import CommentsSection from "@/components/ForPages/Videos/VideoPage/CommentsSection/CommentsSection";

import EpisodeCard from "./EpisodeCard";

const TabsSection = () => {
  const [activeTab, setActiveTab] = useState("episodes");
  const [showAllEpisodes, setShowAllEpisodes] = useState(false);

  const tabs = [
    { id: "episodes", label: "Episodes" },
    { id: "reviews", label: "User Reviews" },
  ];
  const allVideos = [
    {
      id: 1,
      title: "The Offer",
      description:
        "While Haru Tawara develops a crush on a mysterious young woman at work, an unusual opportunity arises at his father's financially struggling brewery.",
      duration: "55m",
      category: "Health News",
      type: "Unit Video",
      subject: "Health",
      language: "Arabic",
      image: "/src/assets/authback.jpg",
      featured: true,
    },
    {
      id: 2,
      title: "The Trail",
      description:
        "Haru accompanies Karen to investigate a whistleblower's apartment. Meanwhile, several other Tawaras are tempted to step out of their ordinary lives.",
      duration: "52m",
      category: "Health News",
      type: "Unit Video",
      subject: "Health",
      language: "Arabic",
      image: "/src/assets/authback.jpg",
      featured: true,
    },
    {
      id: 3,
      title: "The Trail",
      description:
        "Haru accompanies Karen to investigate a whistleblower's apartment. Meanwhile, several other Tawaras are tempted to step out of their ordinary lives.",
      duration: "52m",
      category: "Health News",
      type: "Full Videos",
      subject: "Health",
      language: "Chinese",
      image: "/src/assets/authback.jpg",
      featured: false,
    },
    {
      id: 4,
      title: "The Trail",
      description:
        "Haru accompanies Karen to investigate a whistleblower's apartment. Meanwhile, several other Tawaras are tempted to step out of their ordinary lives.",
      duration: "52m",
      category: "Health News",
      type: "Unit Video",
      subject: "Environment",
      language: "Arabic",
      image: "/src/assets/authback.jpg",
      featured: false,
    },
    {
      id: 5,
      title: "The Trail",
      description:
        "Haru accompanies Karen to investigate a whistleblower's apartment. Meanwhile, several other Tawaras are tempted to step out of their ordinary lives.",
      duration: "52m",
      category: "Health News",
      type: "Full Videos",
      subject: "Environment",
      language: "Chinese",
      image: "/src/assets/authback.jpg",
      featured: false,
    },
  ];

  // عرض 3 فيديوهات فقط في البداية
  const videosToShow = showAllEpisodes ? allVideos : allVideos.slice(0, 3);
  const hasMoreVideos = allVideos.length > 3;

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
          <>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-4 sm:p-6">
                <div className="space-y-2">
                  {videosToShow.map((episode, index) => (
                    <EpisodeCard
                      key={episode.id}
                      episode={episode}
                      index={index}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* زر أظهر المزيد / أظهر أقل */}
            {hasMoreVideos && (
              <div className="flex justify-center -mt-6 relative z-10">
                <button
                  onClick={() => setShowAllEpisodes(!showAllEpisodes)}
                  className="flex items-center justify-center w-12 h-12 bg-blue-500 hover:bg-blue-600 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105"
                >
                  <ChevronDown
                    className={`w-6 h-6 text-white transition-transform duration-300 ${
                      showAllEpisodes ? "rotate-180" : "rotate-0"
                    }`}
                  />
                </button>
              </div>
            )}
          </>
        )}

        {activeTab === "reviews" && <CommentsSection />}
      </div>
    </div>
  );
};

export default TabsSection;
