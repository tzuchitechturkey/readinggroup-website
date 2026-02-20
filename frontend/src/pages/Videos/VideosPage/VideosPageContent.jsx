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
} from "@/api/videos";

function VideosPageContent() {
  const { i18n, t } = useTranslation();
  const navigate = useNavigate();
  // State management
  const [allVideos, setAllVideos] = useState([]);
  const [filteredVideos, setFilteredVideos] = useState([]);
  const [activeCategories, setActiveCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [filters, setFilters] = useState({
    videoType: ["all"],
    date: { year: 2025, month: null },
    sortBy: "newest",
  });
  const [searchTerm, setSearchTerm] = useState("");
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

  // Fetch all videos with pagination
  const fetchAllVideos = async (page = 1) => {
    try {
      setIsLoading(true);
      const offset = (page - 1) * pagination.limit;
      const res = await GetVideos(
        pagination.limit,
        offset,
        "published",
        "",
        {},
      );

      // Handle new API response structure
      const responseData = res.data || {};
      const videos = responseData.results || [];

      setAllVideos(videos);
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
      console.error("Failed to fetch videos:", err);
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

  // Filter videos based on selected category
  const filterByCategory = async (categoryId) => {
    if (!categoryId) {
      setFilteredVideos(allVideos);
      return;
    }

    try {
      const res = await GetVideosByCategoryId(categoryId);
      const categoryVideos = res.data?.results || res.data || [];
      setFilteredVideos(categoryVideos);
    } catch (err) {
      console.error(`Failed to fetch videos for category ${categoryId}:`, err);
    }
  };

  // Handle category selection
  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId === selectedCategory ? null : categoryId);
    filterByCategory(categoryId === selectedCategory ? null : categoryId);
  };

  // Handle pagination
  const handlePageChange = (newPage) => {
    if (selectedCategory) {
      // If a category is selected, we need to implement category-specific pagination
      // TODO: Implement category-specific pagination
      console.log("Category pagination not implemented yet");
    } else {
      fetchAllVideos(newPage);
    }
  };

  const handlePreviousPage = () => {
    if (pagination.currentPage > 1) {
      handlePageChange(pagination.currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (pagination.currentPage < pagination.totalPages) {
      handlePageChange(pagination.currentPage + 1);
    }
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

  // Handle video type filter changes
  const handleVideoTypeChange = (type) => {
    setFilters((prev) => {
      let newTypes = [...prev.videoType];
      if (type === "all") {
        newTypes = ["all"];
      } else {
        if (newTypes.includes("all")) {
          newTypes = newTypes.filter((t) => t !== "all");
        }
        if (newTypes.includes(type)) {
          newTypes = newTypes.filter((t) => t !== type);
        } else {
          newTypes.push(type);
        }
        if (newTypes.length === 0) {
          newTypes = ["all"];
        }
      }
      return { ...prev, videoType: newTypes };
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

    // Generate date format yyyy-mm if both year and month are selected
    if (filters.date.year && filters.date.month) {
      const formattedDate = `${filters.date.year}-${String(filters.date.month).padStart(2, "0")}`;
      console.log("Applied date filter:", formattedDate);
      // TODO: Implement actual filtering logic with formattedDate
    }
  };

  // Handle sort by filter changes
  const handleSortByChange = (sortValue) => {
    setFilters((prev) => ({ ...prev, sortBy: sortValue }));
    closeAllDropdowns();
  };

  // Handle search
  const handleSearch = (term) => {
    setSearchTerm(term);
    // TODO: Implement search functionality
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

  useEffect(() => {
    fetchAllVideos(1);
    getActiveVideoCategories();
  }, []);

  return (
    <div
      className="min-h-screen bg-white"
      dir={i18n?.language === "ar" ? "rtl" : "ltr"}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Title Section */}
        <div className="flex items-end gap-3 mb-8">
          <h1 className="text-4xl font-bold text-black">{t("Watch")}</h1>
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
              </div>

              {/* Search */}
              <VideoSearchBar searchTerm={searchTerm} onSearch={handleSearch} />
            </div>

            {/* Category Carousel */}
            <CategoryCarousel
              activeCategories={activeCategories}
              selectedCategory={selectedCategory}
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
                <p className="text-[#8E8E8E] text-3xl font-bold">{t("No videos found")}</p>
                {searchTerm && (
                  <button className="p-2 ">{t("Reset Search")}</button>
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
