import React, { useEffect, useState } from "react";

import { ChevronDown } from "lucide-react";
import { useTranslation } from "react-i18next";

import CommentsSection from "@/components/Global/CommentsSection/CommentsSection";
import { GetVideosBySeasonId } from "@/api/videos";
import { setErrorFn } from "@/Utility/Global/setErrorFn";
import Loader from "@/components/Global/Loader/Loader";

import EpisodeCard from "./EpisodeCard";

const TabsSection = ({ videoData, defaultTab = "reviews" }) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [isLoading, setIsLoading] = useState(false);
  const [episodes, setEpisodes] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 4;

  const getSeasonData = async (page = 1) => {
    if (!videoData?.season_name?.id) return;

    setIsLoading(true);
    const offset = (page - 1) * limit;

    try {
      const res = await GetVideosBySeasonId(
        limit,
        offset,
        videoData?.season_name?.id
      );

      if (page === 1) {
        setEpisodes(res.data?.results || []);
      } else {
        setEpisodes((prev) => [...prev, ...(res.data?.results || [])]);
      }

      setTotalCount(res.data?.count || 0);
    } catch (error) {
      setErrorFn(error, t);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoadMore = () => {
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
    getSeasonData(nextPage);
  };

  useEffect(() => {
    if (videoData?.season_name?.id) {
      setCurrentPage(1);
      setEpisodes([]);
      getSeasonData(1);
    }
  }, [videoData?.season_name?.id]);
  const hasMoreEpisodes = totalCount > episodes.length;
  return (
    <div className="w-full">
      {/* Tab Navigation */}

      <div className="flex border-b border-gray-200 mb-4 sm:mb-6 overflow-x-auto">
          <button
          onClick={() => setActiveTab("reviews")}
          className={`px-4 sm:px-6 py-2 sm:py-3 font-medium text-sm sm:text-base md:text-lg transition-all duration-300 border-b-2 whitespace-nowrap flex-shrink-0 ${
            activeTab === "reviews"
              ? "text-black border-black"
              : "text-gray-500 border-transparent hover:text-gray-700"
          }`}
        >
          {t("User Reviews")}
        </button>
        {episodes?.length > 0 && (
          <button
            onClick={() => setActiveTab("episodes")}
            className={`px-4 sm:px-6 py-2 sm:py-3 font-medium text-sm sm:text-base md:text-lg transition-all duration-300 border-b-2 whitespace-nowrap flex-shrink-0 ${
              activeTab === "episodes"
                ? "text-black border-black"
                : "text-gray-500 border-transparent hover:text-gray-700"
            }`}
          >
            {t("Episodes")}
          </button>
        )}
      
      </div>

      {/* Tab Content */}
      <div className="mb-8 sm:mb-12 md:mb-16">
        {activeTab === "episodes" && (
          <div>
            {isLoading && episodes.length === 0 ? (
              <Loader />
            ) : episodes.length > 0 ? (
              <>
                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                  <div className="p-4 sm:p-6">
                    <div className="space-y-2">
                      {episodes.map((episode, index) => (
                        <EpisodeCard
                          key={episode.id}
                          episode={episode}
                          index={index}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* زر تحميل المزيد */}
                {hasMoreEpisodes && (
                  <div className="flex justify-center -mt-6 relative z-10">
                    <button
                      onClick={handleLoadMore}
                      disabled={isLoading}
                      className="flex items-center justify-center w-12 h-12 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed rounded-full shadow-lg transition-all duration-300 transform hover:scale-105 disabled:hover:scale-100"
                    >
                      {isLoading ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <ChevronDown className="w-6 h-6 text-white" />
                      )}
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 sm:p-12">
                <div className="text-center">
                  <div className="mb-4">
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {t("No episodes available")}
                  </h3>
                  <p className="text-gray-500">
                    {t("There are no episodes for this season yet")}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "reviews" && (
          <CommentsSection itemId={videoData?.id} type={"video"} />
        )}
      </div>
    </div>
  );
};

export default TabsSection;
