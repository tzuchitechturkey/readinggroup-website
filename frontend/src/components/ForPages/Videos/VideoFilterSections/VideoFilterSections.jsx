import React, { useEffect, useState } from "react";

import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

import Modal from "@/components/Global/Modal/Modal";
import VideoFilter from "@/components/ForPages/Videos/VideoFilter/VideoFilter";
import BrokenCarousel from "@/components/Global/BrokenCarousel/BrokenCarousel";
import VideoCard from "@/components/Global/VideoCard/VideoCard";
import { Button } from "@/components/ui/button";
import SearchSecion from "@/components/Global/SearchSecion/SearchSecion";
import { GetVideosByFilter, GetVideoCategories } from "@/api/videos";
import Loader from "@/components/Global/Loader/Loader";

function VideoFilterSections({ fullVideos, unitVideos, likedVideos }) {
  const { t, i18n } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [openFilterModal, setOpenFilterModal] = useState(false);
  const [categoriesList, setCategoriesList] = useState([]);
  // Filter states
  const [contentType, setContentType] = useState([]);
  const [indexCategory, setIndexCategory] = useState([]);
  const [languageContent, setLanguageContent] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [happenedAt, setHappenedAt] = useState(null);
  const [makingSearch, setMakingSearch] = useState(false);
  // Data states
  const [filteredData, setFilteredData] = useState({ count: 0, results: [] });

  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10;

  // Check if any filter is active
  const hasActiveFilters =
    makingSearch ||
    contentType.length > 0 ||
    indexCategory.length > 0 ||
    languageContent.length > 0 ||
    happenedAt !== null;

  const setErrorFn = (error) => {
    const errorMessage =
      error?.response?.data?.message || t("An error occurred");
    toast.error(errorMessage);
  };
  const getCategoriesList = async () => {
    try {
      const res = await GetVideoCategories(100, 0, "");
      if (res?.data) {
        // Transform data to include id, name and count
        const categories = res.data?.results?.map((category) => ({
          id: category.id,
          name: category.name,
          count: category.video_count || 0,
        }));
        setCategoriesList(categories);
      }
    } catch (error) {
      setErrorFn(error, t);
    }
  };

  // Fetch filtered videos based on all active filters
  const fetchFilteredVideos = async (page = 1, searchVal = searchValue) => {
    // setIsLoading(true);
    const offset = (page - 1) * limit;
    const params = {};

    if (searchVal) {
      params.search = searchVal;
      setMakingSearch(true);
    }
    if (contentType.length > 0) params.video_type = contentType.join(",");

    // Extract category names from objects
    if (indexCategory.length > 0) {
      const categoryNames = indexCategory
        .map((cat) => (typeof cat === "object" ? cat.name : cat))
        .filter(Boolean);
      params.category = categoryNames.join(",");
    }

    // Extract language names from objects
    if (languageContent.length > 0) {
      const languageNames = languageContent
        .map((lang) => (typeof lang === "object" ? lang.name : lang))
        .filter(Boolean);
      params.language = languageNames.join(",");
    }

    if (happenedAt) params.happened_at = happenedAt;
    try {
      // console.log("Fetching videos with params:", params)
      const res = await GetVideosByFilter(limit, offset, params);

      if (page === 1) {
        setFilteredData(res?.data);
      } else {
        // Append results for pagination
        setFilteredData((prev) => ({
          count: res?.data?.count || 0,
          results: [...prev.results, ...(res?.data?.results || [])],
        }));
      }
    } catch (error) {
      setErrorFn(error, t);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoadMore = () => {
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
    fetchFilteredVideos(nextPage);
  };

  const handleSortData = () => {
    if (hasActiveFilters) {
      setFilteredData((prevData) => ({
        ...prevData,
        results: [...prevData.results].reverse(),
      }));
    } else {
      // setDefaultVideos((prev) => ({
      //   videoTypeData: {
      //     ...prev.videoTypeData,
      //     results: [...prev.videoTypeData.results].reverse(),
      //   },
      //   videoCategoryData: {
      //     ...prev.videoCategoryData,
      //     results: [...prev.videoCategoryData.results].reverse(),
      //   },
      //   videoLanguageData: {
      //     ...prev.videoLanguageData,
      //     results: [...prev.videoLanguageData.results].reverse(),
      //   },
      // }));
    }
    toast.success(t("Data Sorted!"));
  };
  const onSearch = (searchVal) => {
    setCurrentPage(1);
    fetchFilteredVideos(1, searchVal);
  };

  // Trigger fetch when filters change
  useEffect(() => {
    // if (hasActiveFilters) {
    setCurrentPage(1);
    fetchFilteredVideos(1);
    // }
  }, [contentType, indexCategory, languageContent, happenedAt]);

  // Load default videos on mount
  useEffect(() => {
    // loadDefaultVideos();
    getCategoriesList();
  }, []);
  return (
    <div rtl={i18n.language === "ar" ? "rtl" : "ltr"} className="w-full ">
      {isLoading && <Loader />}
      {/* Start Search Header */}
      <div className="px-4 sm:px-6 md:px-8 lg:px-10 py-5 ">
        <SearchSecion
          setOpenFilterModal={setOpenFilterModal}
          setSearchValue={setSearchValue}
          setMakingSearch={setMakingSearch}
          searchValue={searchValue}
          handleSortData={handleSortData}
          onSearch={onSearch}
        />
      </div>
      {/* End Search Header */}

      <div className="max-w-7xl mx-auto p-4 sm:px-6 md:px-8 py-4    ">
        <div className="flex flex-col lg:flex-row gap-4 ">
          {/* Start Sidebar Filters */}

          <div className="hidden lg:flex w-full lg:w-80 ">
            <VideoFilter
              happenedAt={happenedAt}
              setHappenedAt={setHappenedAt}
              setContentType={setContentType}
              setIndexCategory={setIndexCategory}
              setLanguageContent={setLanguageContent}
              contentType={contentType}
              indexCategory={indexCategory}
              languageContent={languageContent}
              categoriesList={categoriesList}
              hasActiveFilters={hasActiveFilters}
              setSearchValue={setSearchValue}
              setCurrentPage={setCurrentPage}
              setMakingSearch={setMakingSearch}
              setFilteredData={setFilteredData}
            />
          </div>
          {/* End Sidebar Filters */}

          {/* Start Show Data */}
          <div className="flex-1 min-w-0">
            {/* Start Filtered Results (Grid View) */}
            {hasActiveFilters ? (
              <div>
                <div className="mb-4">
                  <h2 className="text-2xl font-bold text-text">
                    {t("Search Results")} ({filteredData.count})
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-1">
                  {filteredData?.results?.map((video) => (
                    <VideoCard key={video.id} item={video} />
                  ))}
                </div>

                {filteredData?.results?.length === 0 && !isLoading && (
                  <div className="text-center py-10">
                    <p className="text-gray-500 text-lg">
                      {t("No videos found")}
                    </p>
                  </div>
                )}

                {filteredData.count > filteredData?.results?.length && (
                  <div className="text-center mt-8">
                    <Button onClick={handleLoadMore} disabled={isLoading}>
                      {isLoading ? t("Loading...") : t("Load More")}
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              /* End Filtered Results */
              /* Start Default Carousels */
              <div className="flex-1 min-w-0 space-y-2">
                {/* Full Videos Section */}
                {[...fullVideos, ...unitVideos]?.length > 0 && (
                  <div>
                    <div className="mb-2">
                      <h2 className="text-2xl font-bold text-text">
                        {t("Mix Videos")}
                      </h2>
                    </div>
                    <BrokenCarousel
                      data={[...fullVideos, ...unitVideos]}
                      showArrows={[...fullVideos, ...unitVideos]?.length > 4}
                      cardName={VideoCard}
                      nextArrowClassname={"-right-5"}
                      prevArrowClassname={"-left-5"}
                    />
                  </div>
                )}

                {/* Category Section */}
                {likedVideos.length > 0 && (
                  <div className="">
                    <div className="mb-2">
                      <h2 className="text-2xl font-bold text-text">
                        {t("Top 5 in your like")}
                      </h2>
                    </div>
                    <BrokenCarousel
                      data={likedVideos}
                      showArrows={likedVideos.length > 4}
                      cardName={VideoCard}
                      nextArrowClassname={"-right-5"}
                      prevArrowClassname={"-left-5"}
                    />
                  </div>
                )}
              </div>
              /* End Default Carousels */
            )}
          </div>
          {/* End Show Data */}

          {/* Start Mobile Modal  */}
          <Modal
            isOpen={openFilterModal}
            onClose={() => setOpenFilterModal(false)}
            title={t("Filter")}
          >
            <VideoFilter
              happenedAt={happenedAt}
              setHappenedAt={setHappenedAt}
              setContentType={setContentType}
              setIndexCategory={setIndexCategory}
              setLanguageContent={setLanguageContent}
              setOpenFilterModal={setOpenFilterModal}
              contentType={contentType}
              indexCategory={indexCategory}
              languageContent={languageContent}
              categoriesList={categoriesList}
            />
          </Modal>
          {/* End Mobile Modal  */}
        </div>
      </div>
    </div>
  );
}

export default VideoFilterSections;
