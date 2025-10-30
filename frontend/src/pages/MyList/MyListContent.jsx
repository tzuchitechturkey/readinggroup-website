import React, { useEffect, useState } from "react";

import { useTranslation } from "react-i18next";

import { GetMyListedVideos } from "@/api/videos";
import { setErrorFn } from "@/Utility/Global/setErrorFn";
import VideoCard from "@/components/Global/VideoCard/VideoCard";
import { Button } from "@/components/ui/button";
import Loader from "@/components/Global/Loader/Loader";

function MyListContent() {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [myListedVideos, setMyListedVideos] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10;

  const getMyListedVideos = async (page = 1) => {
    setIsLoading(true);
    const offset = (page - 1) * limit;
    try {
      const res = await GetMyListedVideos(limit, offset, "");

      // إذا كانت الصفحة الأولى، استبدل البيانات، وإلا أضف البيانات الجديدة
      if (page === 1) {
        setMyListedVideos(res.data?.results || []);
      } else {
        setMyListedVideos((prev) => [...prev, ...(res.data?.results || [])]);
      }
      setTotalRecords(res.data?.count || 0);
      setCurrentPage(page);
    } catch (err) {
      setErrorFn(err, t);
    } finally {
      setIsLoading(false);
    }
  };
  const handleLoadMore = () => {
    getMyListedVideos(currentPage + 1);
  };

  useEffect(() => {
    getMyListedVideos(1);
  }, []);

  return (
    <div className="w-full px-4 sm:px-6 md:px-8 lg:px-10 py-6">
      {isLoading && <Loader />}

      {/* Start Header */}
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
          {t("My Saved Videos")}
        </h1>
        <p className="text-gray-600">
          {t("Total")}: <span className="font-semibold">{totalRecords}</span>{" "}
          {t("video")}
        </p>
      </div>
      {/* End Header */}

      {/* Start Videos Grid */}
      {myListedVideos.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {myListedVideos.map((video) => (
              <VideoCard key={video.id} item={video} />
            ))}
          </div>

          {/* Load More Button */}
          {myListedVideos.length < totalRecords && (
            <div className="flex justify-center mt-12">
              <Button
                onClick={handleLoadMore}
                disabled={isLoading}
                className="px-8 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-semibold transition-colors"
              >
                {isLoading ? t("Loading...") : t("Load More")}
              </Button>
            </div>
          )}
        </>
      ) : (
        /* Empty State */
        <div className="flex flex-col items-center justify-center min-h-96">
          <div className="text-center">
            <svg
              className="w-16 h-16 mx-auto mb-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M15 10l-4 4m0 0l-4-4m4 4v12m7-13a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {t("No Saved Videos")}
            </h3>
            <p className="text-gray-600 mb-6">
              {t("You haven't saved any videos yet")}
            </p>
            <Button
              onClick={() => (window.location.href = "/videos")}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-semibold transition-colors"
            >
              {t("Browse Videos")}
            </Button>
          </div>
        </div>
      )}
      {/* End Videos Grid */}
    </div>
  );
}

export default MyListContent;
