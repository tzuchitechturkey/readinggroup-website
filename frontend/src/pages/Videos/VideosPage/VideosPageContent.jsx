import React, { useEffect, useState } from "react";

import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import VideoCard from "@/components/Global/VideoCard/VideoCard";
import Pagination from "@/components/Global/PagePagination/PagePagination";
import VideoTypeFilter from "@/components/Videos/VideoTypeFilter/VideoTypeFilter";
import DateFilter from "@/components/Videos/DateFilter/DateFilter";
import SortByFilter from "@/components/Videos/SortByFilter/SortByFilter";
import VideoSearchBar from "@/components/Videos/VideoSearchBar/VideoSearchBar";
import CategoryCarousel from "@/components/Videos/CategoryCarousel/CategoryCarousel";
import {
  GetVideoCategories,
  GetVideosByCategoryId,
  GetVideos,
  GetVideosByFilter,
} from "@/api/videos";

function VideosPageContent() {
  const { i18n, t } = useTranslation();
  const navigate = useNavigate();
  // State management
  const [filteredVideos, setFilteredVideos] = useState([]);
  const [activeCategories, setActiveCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [filters, setFilters] = useState({
    videoType: ["all"],
    date: { year: 2025, month: null },
    sortBy: "newest",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [appliedDateFilter, setAppliedDateFilter] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Pagination state
  const [pagination, setPagination] = useState({
    count: 0,
    next: null,
    previous: null,
    currentPage: 1,
    totalPages: 1,
    limit: 8,
  });

  const [openDropdowns, setOpenDropdowns] = useState({
    videoType: false,
    date: false,
    sortBy: false,
  });

  // Apply all filters and fetch videos
  const fetchFilteredVideos = async (page = 1) => {
    try {
      setIsLoading(true);
      const offset = (page - 1) * pagination.limit;

      // Build filter parameters
      const filterParams = {};

      // Only add search if it's not empty
      if (searchTerm && searchTerm.trim() !== "") {
        filterParams.search = searchTerm.trim();
      }

      // Video type filter
      if (filters.videoType.length > 0 && !filters.videoType.includes("all")) {
        // Map video types to API parameters
        const typeMapping = {
          livestream: () => {
            filterParams.video_type = "live_stream";
          },
          clips: () => {
            filterParams.video_type = "clip";
          },
        };

        // Apply the selected type (only one type allowed)
        const selectedType = filters.videoType[0];
        if (typeMapping[selectedType]) {
          typeMapping[selectedType]();
        }
      }

      // Date filter (only if applied)
      if (appliedDateFilter) {
        filterParams.happened_at = appliedDateFilter;
      }

      // Category filter (multiple categories as array)
      if (selectedCategories.length > 0) {
        filterParams.category = selectedCategories;
      }

      console.log("Filter params:", filterParams);

      const res = await GetVideosByFilter(
        pagination.limit,
        offset,
        filterParams,
      );

      // Handle API response structure
      const responseData = res.data || {};
      let videos = responseData.results || [];

      // Apply local sorting
      videos = applySorting(videos);

      setFilteredVideos(videos);

      // Update pagination state
      setPagination((prev) => ({
        ...prev,
        count: responseData.count || 0,
        next: responseData.next || null,
        previous: responseData.previous || null,
        currentPage: page,
        totalPages: Math.ceil((responseData.count || 0) / prev.limit),
      }));
    } catch (err) {
      console.error("Failed to fetch filtered videos:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch active categories
  const getActiveVideoCategories = async () => {
    try {
      const res = await GetVideoCategories(200, 0);
      const allCategories = res.data?.results || res.data || [];
      const active = allCategories.filter((cat) => cat.is_active === true);
      setActiveCategories(active);
    } catch (err) {
      console.error("Failed to fetch video categories:", err);
    }
  };

  // Apply local sorting to videos
  const applySorting = (videos) => {
    const sortedVideos = [...videos];

    switch (filters.sortBy) {
      case "newest":
        return sortedVideos.sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at),
        );
      case "oldest":
        return sortedVideos.sort(
          (a, b) => new Date(a.created_at) - new Date(b.created_at),
        );
      case "most_viewed":
        return sortedVideos.sort(
          (a, b) => (b.views_count || 0) - (a.views_count || 0),
        );
      case "most_liked":
        return sortedVideos.sort(
          (a, b) => (b.likes_count || 0) - (a.likes_count || 0),
        );
      case "alphabetical":
        return sortedVideos.sort((a, b) =>
          (a.title || "").localeCompare(b.title || ""),
        );
      default:
        return sortedVideos;
    }
  };

  // Handle multiple category selection
  const handleCategorySelect = (categoryId) => {
    setSelectedCategories((prev) => {
      const isSelected = prev.includes(categoryId);
      if (isSelected) {
        // Remove category if already selected
        return prev.filter((id) => id !== categoryId);
      }
      // Add category if not selected
      return [...prev, categoryId];
    });
  };

  // Handle pagination
  const handlePageChange = (newPage) => {
    fetchFilteredVideos(newPage);
  };

  // Handle dropdown toggles
  const toggleDropdown = (dropdownName) => {
    setOpenDropdowns((prev) => ({
      videoType: false,
      date: false,
      sortBy: false,
      [dropdownName]: !prev[dropdownName],
    }));
  };

  const closeAllDropdowns = () => {
    setOpenDropdowns({
      videoType: false,
      date: false,
      sortBy: false,
    });
  };

  // Handle video type filter changes (only one type allowed)
  const handleVideoTypeChange = (type) => {
    setFilters((prev) => {
      if (type === "all") {
        return { ...prev, videoType: ["all"] };
      }
      // Only allow one video type at a time
      return { ...prev, videoType: [type] };
    });
  };

  // Handle date filter changes
  const handleDateYearChange = (direction) => {
    const currentYear = new Date().getFullYear(); // 2026

    setFilters((prev) => {
      const newYear = prev.date.year + direction;

      // منع التقدم بعد السنة الحالية
      if (direction > 0 && newYear > currentYear) {
        return prev;
      }

      return {
        ...prev,
        date: {
          ...prev.date,
          year: newYear,
        },
      };
    });
  };

  const handleDateMonthSelect = (month) => {
    setFilters((prev) => ({
      ...prev,
      date: {
        ...prev.date,
        month: prev.date.month === month ? null : month,
      },
    }));
  };

  const applyDateFilter = () => {
    closeAllDropdowns();

    // Apply date filter only when button is pressed
    if (filters.date.year && filters.date.month) {
      const formattedDate = `${filters.date.year}-${String(filters.date.month).padStart(2, "0")}`;
      setAppliedDateFilter(formattedDate);
      // Trigger search with the new date filter
      setTimeout(() => fetchFilteredVideos(1), 0);
    }
  };

  // Handle sort by filter changes
  const handleSortByChange = (sortValue) => {
    setFilters((prev) => ({ ...prev, sortBy: sortValue }));
    closeAllDropdowns();
    // Apply local sorting to current videos
    const sortedVideos = applySorting(filteredVideos);
    setFilteredVideos(sortedVideos);
  };

  // Handle search (triggered on Enter press)
  const handleSearch = (term, shouldSearch = false) => {
    setSearchTerm(term);
    // Only search when Enter is pressed or search is explicitly triggered
    if (shouldSearch) {
      fetchFilteredVideos(1);
    }
  };

  // Reset all filters
  const resetFilters = () => {
    setSearchTerm("");
    setSelectedCategories([]);
    setAppliedDateFilter(null);
    setFilters({
      videoType: ["all"],
      date: { year: 2025, month: null },
      sortBy: "newest",
    });
    fetchFilteredVideos(1);
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      closeAllDropdowns();
    };
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  // Remove auto-search effect - search only happens on Enter press

  // Effect to trigger filtering when categories or video types change
  useEffect(() => {
    fetchFilteredVideos(1);
  }, [selectedCategories, filters.videoType]);

  useEffect(() => {
    fetchFilteredVideos(1);
    getActiveVideoCategories();
  }, []);

  return (
    <div
      className="min-h-screen bg-background"
      dir={i18n?.language === "ar" ? "rtl" : "ltr"}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Title Section */}
        <div className="flex items-end gap-3 mb-8">
          <h1 className="text-4xl font-bold text-[var(--livestream-title)]">
            {t("Watch")}
          </h1>
          <p className="text-sm text-gray-500 mb-1">
            {pagination.count} {t("videos")}
          </p>
        </div>

        <div className="flex items-end  justify-between mb-6 gap-4 flex-wrap">
          <div className="w-full">
            {/* Filters and Search */}
            <div
              className="flex w-full  gap-3 relative justify-between"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Filters */}
              <div className="flex items-center gap-3">
                <VideoTypeFilter
                  filters={filters}
                  openDropdowns={openDropdowns}
                  onToggleDropdown={toggleDropdown}
                  onVideoTypeChange={handleVideoTypeChange}
                />

                <DateFilter
                  filters={filters}
                  openDropdowns={openDropdowns}
                  onToggleDropdown={toggleDropdown}
                  onDateYearChange={handleDateYearChange}
                  onDateMonthSelect={handleDateMonthSelect}
                  onApplyDateFilter={applyDateFilter}
                />

                <SortByFilter
                  filters={filters}
                  openDropdowns={openDropdowns}
                  onToggleDropdown={toggleDropdown}
                  onSortByChange={handleSortByChange}
                />

                {/* Active Filters Display */}
                {(selectedCategories.length > 0 ||
                  !filters.videoType.includes("all") ||
                  appliedDateFilter) && (
                  <div className="flex flex-wrap gap-2 items-end h-full">
                    {/* <span className="text-sm text-gray-600">
                  {t("Active Filters")}:
                </span>

                 Search filter 
                {searchTerm && (
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm flex items-center gap-1">
                    {t("Search")}: "{searchTerm}"
                    <button
                      onClick={() => {
                        setSearchTerm("");
                        fetchFilteredVideos(1);
                      }}
                      className="ml-1 text-blue-600 hover:text-blue-800"
                    >
                      ×
                    </button>
                  </span>
                )}

                 Category filters 
                {selectedCategories.map((catId) => {
                  const category = activeCategories.find(
                    (cat) => cat.id === catId,
                  );
                  return category ? (
                    <span
                      key={catId}
                      className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm flex items-center gap-1"
                    >
                      {category.name}
                      <button
                        onClick={() => handleCategorySelect(catId)}
                        className="ml-1 text-green-600 hover:text-green-800"
                      >
                        ×
                      </button>
                    </span>
                  ) : null;
                })}

                 Video type filters 
                {!filters.videoType.includes("all") && (
                  <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm flex items-center gap-1">
                    {t("Types")}:{" "}
                    {filters.videoType
                      .map((type) =>
                        type === "livestream"
                          ? t("Live Stream")
                          : type === "clips"
                            ? t("Clips")
                            : type,
                      )
                      .join(", ")}
                    <button
                      onClick={() =>
                        setFilters((prev) => ({ ...prev, videoType: ["all"] }))
                      }
                      className="ml-1 text-purple-600 hover:text-purple-800"
                    >
                      ×
                    </button>
                  </span>
                )}

                 Date filter - only show when applied 
                {appliedDateFilter && (
                  <span className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm flex items-center gap-1">
                    {t("Date")}: {appliedDateFilter}
                    <button
                      onClick={() => {
                        setAppliedDateFilter(null);
                        setFilters((prev) => ({
                          ...prev,
                          date: { year: 2025, month: null },
                        }));
                        fetchFilteredVideos(1);
                      }}
                      className="ml-1 text-orange-600 hover:text-orange-800"
                    >
                      ×
                    </button>
                  </span>
                )} */}

                    {/* Reset all button */}
                    <button
                      onClick={resetFilters}
                      className="px-3 py-1  underline  text-base transition-colors"
                    >
                      {t("Reset filters")}
                    </button>
                  </div>
                )}
              </div>

              {/* Search */}
              <VideoSearchBar searchTerm={searchTerm} onSearch={handleSearch} />
            </div>

            {/* Category Carousel */}
            <CategoryCarousel
              activeCategories={activeCategories}
              selectedCategory={selectedCategories[0] || null}
              selectedCategories={selectedCategories}
              onCategorySelect={handleCategorySelect}
            />

            {/* Videos Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
              {isLoading
                ? // Loading skeleton
                  Array.from({ length: 8 }).map((_, index) => (
                    <div key={index} className="animate-pulse">
                      <div className="bg-gray-300 aspect-video rounded-lg mb-2" />
                      <div className="h-4 bg-gray-300 rounded mb-2" />
                      <div className="h-3 bg-gray-200 rounded w-2/3" />
                    </div>
                  ))
                : filteredVideos.map((video, index) => (
                    <VideoCard
                      key={video.id || index}
                      item={video}
                      showDate={true}
                      size="small"
                      navigate={navigate}
                    />
                  ))}
            </div>

            {/* Pagination */}
            {!isLoading && filteredVideos.length > 0 && (
              <div className="flex justify-center mt-8">
                <Pagination
                  currentPage={pagination.currentPage}
                  totalPages={pagination.totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            )}

            {/* Show message if no videos found */}
            {!isLoading && filteredVideos.length === 0 && (
              <div className="text-center py-12">
                <p className="text-[#8E8E8E] text-3xl font-bold">
                  {t("No videos found")}
                </p>
                {(searchTerm ||
                  selectedCategories.length > 0 ||
                  !filters.videoType.includes("all")) && (
                  <button
                    onClick={resetFilters}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    {t("Reset Filters")}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default VideosPageContent;
