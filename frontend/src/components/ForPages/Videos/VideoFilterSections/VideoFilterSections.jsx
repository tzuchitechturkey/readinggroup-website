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
  
  // Unified filter state object
  const [filters, setFilters] = useState({
    contentType: [],
    indexCategory: [],
    languageContent: [],
    searchValue: "",
    happenedAt: null,
    isFeatured: null,
    isNew: null,
    makingSearch: false,
  });

  // Data states
  const [filteredData, setFilteredData] = useState({ count: 0, results: [] });

  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10;

  // Check if any filter is active
  const hasActiveFilters =
    filters.makingSearch ||
    filters.contentType.length > 0 ||
    filters.indexCategory.length > 0 ||
    filters.languageContent.length > 0 ||
    filters.happenedAt !== null ||
    filters.isFeatured !== null ||
    filters.isNew !== null;

  // Helper function to update filters
  const updateFilter = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

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
  const fetchFilteredVideos = async (page = 1, searchVal = filters.searchValue) => {
    const offset = (page - 1) * limit;
    const params = {};

    if (searchVal) {
      params.search = searchVal;
      updateFilter("makingSearch", true);
    }
    if (filters.contentType.length > 0) params.video_type = filters.contentType.join(",");

    // Extract category names from objects
    if (filters.indexCategory.length > 0) {
      const categoryNames = filters.indexCategory
        .map((cat) => (typeof cat === "object" ? cat.name : cat))
        .filter(Boolean);
      params.category = categoryNames.join(",");
    }

    // Extract language names from objects
    if (filters.languageContent.length > 0) {
      const languageNames = filters.languageContent
        .map((lang) => (typeof lang === "object" ? lang.name : lang))
        .filter(Boolean);
      params.language = languageNames.join(",");
    }

    if (filters.happenedAt) params.happened_at = filters.happenedAt;
    if (filters.isFeatured !== null) params.is_featured = filters.isFeatured;
    if (filters.isNew !== null) params.is_new = filters.isNew;
    
    try {
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
    }
  };
  const handleLoadMore = () => {
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
    fetchFilteredVideos(nextPage);
  };

  const handleSortData = () => {
    if (!hasActiveFilters) return;

    setFilteredData((prevData) => {
      const { results } = prevData;
      if (!results?.length) return prevData;

      const sorted = [...results].sort((a, b) => {
        const titleA = a.title?.toLowerCase() || "";
        const titleB = b.title?.toLowerCase() || "";
        return titleA.localeCompare(titleB, i18n.language, {
          sensitivity: "base",
          numeric: true,
        });
      });

      // مقارنة أول عنصر لمعرفة هل هي مرتبة أصلاً
      const isAlreadyAsc =
        results[0]?.title?.toLowerCase() === sorted[0]?.title?.toLowerCase();

      return {
        ...prevData,
        results: isAlreadyAsc ? sorted.reverse() : sorted,
      };
    });
  };

  const onSearch = (searchVal) => {
    setCurrentPage(1);
    fetchFilteredVideos(1, searchVal);
  };

  // Trigger fetch when filters change
  useEffect(() => {
    setCurrentPage(1);
    fetchFilteredVideos(1);
  }, [
    filters.contentType,
    filters.indexCategory,
    filters.languageContent,
    filters.happenedAt,
    filters.isFeatured,
    filters.isNew,
  ]);

  // Load default videos on mount
  useEffect(() => {
    getCategoriesList();
  }, []);
  return (
    <div rtl={i18n.language === "ar" ? "rtl" : "ltr"} className="w-full ">
      {isLoading && <Loader />}
      {/* Start Search Header */}
      <div className="px-4 sm:px-6 md:px-8 lg:px-10 py-5 ">
        <SearchSecion
          setOpenFilterModal={setOpenFilterModal}
          setSearchValue={(value) => updateFilter("searchValue", value)}
          setMakingSearch={(value) => updateFilter("makingSearch", value)}
          searchValue={filters.searchValue}
          handleSortData={handleSortData}
          onSearch={onSearch}
          hasActiveFilters={hasActiveFilters}
        />
      </div>
      {/* End Search Header */}

      <div className="max-w-7xl mx-auto p-4 sm:px-6 md:px-8 py-4    ">
        <div className="flex flex-col lg:flex-row gap-4 ">
          {/* Start Sidebar Filters */}

          <div className="hidden lg:flex w-full lg:w-80 ">
            <VideoFilter
              filters={filters}
              updateFilter={updateFilter}
              categoriesList={categoriesList}
              hasActiveFilters={hasActiveFilters}
              setCurrentPage={setCurrentPage}
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
              filters={filters}
              updateFilter={updateFilter}
              setOpenFilterModal={setOpenFilterModal}
              categoriesList={categoriesList}
              hasActiveFilters={hasActiveFilters}
              setCurrentPage={setCurrentPage}
              setFilteredData={setFilteredData}
            />
          </Modal>
          {/* End Mobile Modal  */}
        </div>
      </div>
    </div>
  );
}

export default VideoFilterSections;
