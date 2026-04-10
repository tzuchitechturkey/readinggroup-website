import React, { useEffect, useState, useRef } from "react";

import { useTranslation } from "react-i18next";
import { useNavigate, useSearchParams } from "react-router-dom";
import { SlidersVertical } from "lucide-react";

import { useIsMobile } from "@/hooks/global/use-mobile";
import VideoCard from "@/components/Global/VideoCard/VideoCard";
import Pagination from "@/components/Global/PagePagination/PagePagination";
import VideoTypeFilter from "@/components/Videos/VideoTypeFilter/VideoTypeFilter";
import DateFilter from "@/components/Videos/DateFilter/DateFilter";
import SortByFilter from "@/components/Videos/SortByFilter/SortByFilter";
import VideoSearchBar from "@/components/Videos/VideoSearchBar/VideoSearchBar";
import CategoryCarousel from "@/components/Videos/CategoryCarousel/CategoryCarousel";
import MobileFilterModal from "@/components/Videos/MobileFilterModal/MobileFilterModal";
import { GetVideoCategories, GetVideosByFilter } from "@/api/videos";
import LanguageFilter from "@/components/Videos/LanguageFilter/LanguageFilter";

// Map i18n language code → allLanguages code (constants.js)
const I18N_TO_VIDEO_LANG = {
  en: "en",
  tr: "tr",
  ch: "zh-hant",
  chsi: "zh-hans",
  jp: "ja",
};

/**
 * Extract the flat video object for the requested language from the multi-lang
 * API response shape: { id, [lang]: { ...videoFields } }
 */
function normalizeVideoByLang(item, lang) {
  if (!item || typeof item !== "object") return null;
  // Already flat (pre-migration format)
  if (item.title !== undefined) return item;
  const langData = item[lang];
  if (langData && typeof langData === "object") return langData;
  // Fallback: first non-id key that is an object
  const fallbackKey = Object.keys(item).find(
    (k) => k !== "id" && item[k] && typeof item[k] === "object",
  );
  return fallbackKey ? item[fallbackKey] : null;
}

function VideosPageContent() {
  const { i18n, t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isMobile = useIsMobile(991);
  const initialLoadRef = useRef(false);
  const allowUrlUpdateRef = useRef(false);

  // Resolve default language from i18n
  const defaultLanguage = I18N_TO_VIDEO_LANG[i18n.language] || "en";

  // State management
  const [filteredVideos, setFilteredVideos] = useState([]);
  const [activeCategories, setActiveCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [openFilter, setOpenFilter] = useState(false);
  const [filters, setFilters] = useState({
    videoType: ["all"],
    date: { year: 2026, month: null },
    sortBy: "newest",
    language: defaultLanguage,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [activeSearchTerm, setActiveSearchTerm] = useState("");
  const [appliedDateFilter, setAppliedDateFilter] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Pagination state
  const [pagination, setPagination] = useState({
    count: 0,
    next: null,
    previous: null,
    currentPage: 1,
    totalPages: 1,
    limit: 24,
  });

  const [openDropdowns, setOpenDropdowns] = useState({
    videoType: false,
    date: false,
    sortBy: false,
    language: false,
  });

  // Helper function to fetch with explicit parameters
  const fetchFilteredVideosWithParams = async (
    page = 1,
    passedFilters = {},
    dateFilter = null,
    categoriesOverride = null,
    saearchTermOverride = searchTerm,
  ) => {
    try {
      setIsLoading(true);
      const offset = (page - 1) * pagination.limit;

      // Build filter parameters
      const filterParams = {};

      // Only add search if it's not empty
      if (saearchTermOverride && saearchTermOverride.trim() !== "") {
        filterParams.search = saearchTermOverride.trim();
      }

      // Video type filter
      if (
        passedFilters.videoType &&
        passedFilters.videoType.length > 0 &&
        !passedFilters.videoType.includes("all")
      ) {
        // Map video types to API parameters
        const typeMapping = {
          full_video: () => {
            filterParams.video_type = "full_video";
          },
          clips: () => {
            filterParams.video_type = "clip_video";
          },
        };

        // Apply the selected type (only one type allowed)
        const selectedType = passedFilters.videoType[0];
        if (typeMapping[selectedType]) {
          typeMapping[selectedType]();
        }
      }

      // Date filter (only if applied)
      if (dateFilter) {
        filterParams.happened_at = dateFilter;
      }

      // Category filter (multiple categories as array)
      const categoriesToUse = categoriesOverride || selectedCategories;
      if (categoriesToUse.length > 0) {
        filterParams.category = categoriesToUse;
      }

      // Language filter — always send (has a default value)
      const langToUse =
        passedFilters.language || filters.language || defaultLanguage;
      filterParams.language = langToUse;

      const res = await GetVideosByFilter(
        pagination.limit,
        offset,
        filterParams,
      );

      // Handle API response structure
      const responseData = res.data || {};
      const rawResults = responseData.results || [];

      // Normalize multi-lang format: { id, [lang]: {...} } → flat video object
      const videos = rawResults
        .map((item) => normalizeVideoByLang(item, langToUse))
        .filter(Boolean);

      // Apply local sorting
      const sortedVideos =
        passedFilters.sortBy === "newest"
          ? [...videos].sort(
              (a, b) => new Date(b.happened_at) - new Date(a.happened_at),
            )
          : passedFilters.sortBy === "oldest"
            ? [...videos].sort(
                (a, b) => new Date(a.happened_at) - new Date(b.happened_at),
              )
            : passedFilters.sortBy === "most_popular"
              ? [...videos].sort((a, b) => (b.views || 0) - (a.views || 0))
              : videos;

      setFilteredVideos(sortedVideos);

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
      const res = await GetVideoCategories(200, 0, "", "True");
      const allCategories = res.data?.results || res.data || [];
      const active = allCategories.filter((cat) => cat.is_active === true);
      setActiveCategories(active);
    } catch (err) {
      console.error("Failed to fetch video categories:", err);
    }
  };

  // Handle multiple category selection
  const handleCategorySelect = (categoryId) => {
    // Ensure URL updates are allowed for user interactions
    allowUrlUpdateRef.current = true;

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
    fetchFilteredVideosWithParams(
      newPage,
      filters,
      appliedDateFilter,
      selectedCategories,
    );
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
      language: false,
    });
  };

  // Handle language filter change
  const handleLanguageChange = (langCode) => {
    allowUrlUpdateRef.current = true;
    const newFilters = { ...filters, language: langCode };
    setFilters(newFilters);
    fetchFilteredVideosWithParams(
      1,
      newFilters,
      appliedDateFilter,
      selectedCategories,
    );
    closeAllDropdowns();
  };

  // Handle video type filter changes (only one type allowed)
  const handleVideoTypeChange = (type) => {
    // Ensure URL updates are allowed for user interactions
    allowUrlUpdateRef.current = true;

    setFilters((prev) => {
      if (type === "all") {
        return { ...prev, videoType: ["all"] };
      }
      // Only allow one video type at a time
      return { ...prev, videoType: [type] };
    });
  };

  // Handle date filter changes
  const handleDateYearChange = (value) => {
    const currentYear = new Date().getFullYear(); // 2026

    setFilters((prev) => {
      const isAbsolute = Math.abs(value) > 100;
      const newYear = isAbsolute ? value : prev.date.year + value;

      // منع التقدم بعد السنة الحالية
      if (!isAbsolute && value > 0 && newYear > currentYear) {
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
      // Ensure URL updates are allowed for user interactions
      allowUrlUpdateRef.current = true;
      // Pass the formatted date directly with current filters
      fetchFilteredVideosWithParams(
        1,
        filters,
        formattedDate,
        selectedCategories,
      );
    }
  };

  // Handle sort by filter changes
  const handleSortByChange = (sortValue) => {
    // Ensure URL updates are allowed for user interactions
    allowUrlUpdateRef.current = true;

    setFilters((prev) => ({ ...prev, sortBy: sortValue }));
    closeAllDropdowns();
  };

  // Handle search (triggered on Enter press)
  const handleSearch = (term, shouldSearch = false) => {
    setSearchTerm(term);
    console.log("Search term updated:", term);
    // Only search when Enter is pressed or search is explicitly triggered
    if (shouldSearch) {
      setActiveSearchTerm(term); // Update active search term
      // Ensure URL updates are allowed for user interactions
      allowUrlUpdateRef.current = true;
      fetchFilteredVideosWithParams(
        1,
        filters,
        appliedDateFilter,
        selectedCategories,
        term,
      );
    }
  };

  // Reset all filters (language is intentionally excluded from reset)
  const resetFilters = () => {
    setSearchTerm("");
    setSelectedCategories([]);
    setAppliedDateFilter(null);
    const defaultFilters = {
      videoType: ["all"],
      date: { year: 2026, month: null },
      sortBy: "newest",
      language: filters.language, // preserve current language
    };
    setFilters(defaultFilters);
    // reset searchParams by navigating without query parameters
    navigate("/videos", { replace: true });
    // Allow URL updates for user interactions
    allowUrlUpdateRef.current = true;
    fetchFilteredVideosWithParams(1, defaultFilters, null, []);
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

  // Load filters from URL on initial mount only
  useEffect(() => {
    if (initialLoadRef.current) return; // Prevent re-runs

    const typeParam = searchParams.get("type");
    const dateParam = searchParams.get("date");
    const categoriesParam = searchParams.get("categories");
    const sortParam = searchParams.get("sort");

    // Map type from URL format to internal format
    const typeMapping = {
      clip_video: "clips",
      full_video: "full_video",
      all: "all",
    };
    const filterType = typeMapping[typeParam] || "all";

    // Build filters object to pass to fetch
    const newFilters = {
      videoType: [filterType],
      date: { year: 2026, month: null },
      sortBy: sortParam || "newest",
      language: defaultLanguage,
    };

    // Parse and set date if present
    let appliedDate = null;
    if (dateParam) {
      const [year, month] = dateParam.split("-");
      newFilters.date = { year: parseInt(year), month: parseInt(month) };
      appliedDate = dateParam;
      setAppliedDateFilter(dateParam);
    }

    // Parse and set categories if present
    let cats = [];
    if (categoriesParam) {
      cats = categoriesParam.split(",").map((c) => parseInt(c));
      setSelectedCategories(cats);
    }

    // Set filters state
    setFilters(newFilters);

    // Mark as initial load complete
    initialLoadRef.current = true;

    // Fetch videos directly with the new filters
    fetchFilteredVideosWithParams(1, newFilters, appliedDate, cats);
    getActiveVideoCategories();

    // Allow URL updates only after initial load is complete
    // Using setTimeout to ensure state updates are processed first
    setTimeout(() => {
      allowUrlUpdateRef.current = true;
    }, 100);
  }, [searchParams]); // Only depend on searchParams

  // Update URL when filters change (only after initial load)
  useEffect(() => {
    if (!allowUrlUpdateRef.current) {
      console.log("Skipping URL update - initial load in progress");
      return; // Don't update URL during initial load
    }

    const params = new URLSearchParams();
    console.log("Updating URL with filters:", filters);

    // Add video type if not "all"
    if (filters.videoType[0] !== "all") {
      const typeMap = {
        clips: "clip_video",
        full_video: "full_video",
      };
      params.set("type", typeMap[filters.videoType[0]]);
    }

    // Add date if applied
    if (appliedDateFilter) {
      params.set("date", appliedDateFilter);
    }

    // Add categories if selected
    if (selectedCategories.length > 0) {
      params.set("categories", selectedCategories.join(","));
    }

    // Add sort if not default
    if (filters.sortBy !== "newest") {
      params.set("sort", filters.sortBy);
    }

    // Navigate to new URL
    const queryString = params.toString();
    const newPath = `/videos${queryString ? "?" + queryString : ""}`;
    navigate(newPath, { replace: true });
  }, [
    filters.videoType,
    appliedDateFilter,
    selectedCategories,
    filters.sortBy,
  ]);

  // Sync language filter when i18n language changes
  useEffect(() => {
    if (!initialLoadRef.current) return;

    const newLang = I18N_TO_VIDEO_LANG[i18n.language] || "en";
    if (newLang === filters.language) return;

    const newFilters = { ...filters, language: newLang };
    setFilters(newFilters);
    fetchFilteredVideosWithParams(
      1,
      newFilters,
      appliedDateFilter,
      selectedCategories,
    );
  }, [i18n.language]);

  // Trigger filtering when filters change (only after initial load)
  useEffect(() => {
    if (!allowUrlUpdateRef.current) {
      console.log("Skipping filter fetch - initial load in progress");
      return; // Don't fetch during initial load
    }

    // Pass filters explicitly to avoid closure issues
    fetchFilteredVideosWithParams(
      1,
      filters,
      appliedDateFilter,
      selectedCategories,
    );
  }, [
    filters.videoType,
    filters.sortBy,
    appliedDateFilter,
    selectedCategories,
  ]);

  return (
    <div
      className="min-h-screen bg-[#D7EAFF]"
      dir={i18n?.language === "ar" ? "rtl" : "ltr"}
    >
      <MobileFilterModal
        isOpen={openFilter}
        onClose={() => setOpenFilter(false)}
        filters={filters}
        onVideoTypeChange={handleVideoTypeChange}
        onDateYearChange={handleDateYearChange}
        onDateMonthSelect={handleDateMonthSelect}
        onApplyDateFilter={applyDateFilter}
        onSortByChange={handleSortByChange}
        activeCategories={activeCategories}
        selectedCategories={selectedCategories}
        onCategorySelect={handleCategorySelect}
        appliedDateFilter={appliedDateFilter}
        onResetFilters={resetFilters}
        onLanguageChange={handleLanguageChange}
      />
      <div className="max-w-7xl mx-auto md:px-6 lg:px-8 py-6">
        {/* Title Section */}
        <div className="flex items-end gap-3 mb-8 px-4 md:px-0 mt-6">
          <h1 className="text-4xl font-extrabold text-[#081945]">
            {t("Watch")}
          </h1>
          <p className="text-base text-[#081945] ">
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
              <div className="hidden lg:flex items-center gap-3">
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

                <LanguageFilter
                  filters={filters}
                  openDropdowns={openDropdowns}
                  onToggleDropdown={toggleDropdown}
                  onLanguageChange={handleLanguageChange}
                  fromLiveStream={false}
                />

                {/* Active Filters Display */}
                {(selectedCategories.length > 0 ||
                  !filters.videoType.includes("all") ||
                  appliedDateFilter) && (
                  <div className="flex flex-wrap gap-2 items-end h-full">
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
              <div className="mb-8 w-full lg:max-w-[280px] md:mb-0 px-4 md:px-0">
                <VideoSearchBar
                  searchTerm={searchTerm}
                  activeSearchTerm={activeSearchTerm}
                  onSearch={handleSearch}
                />
              </div>
            </div>

            <div className="flex lg:hidden w-full items-center justify-between mb-4 px-4 md:px-0">
              <p className="text-[#081945] text-lg font-bold">
                {t("ALL VIDEOS")}
              </p>
              <button
                className=" flex items-center gap-1 px-3 py-1 bg-white rounded-lg hover:bg-[#8E8E8E] transition-colors"
                onClick={() => {
                  setOpenFilter(true);
                }}
              >
                <p className="text-[#285688]">{t("Filter")}</p>
                <SlidersVertical className="text-[#285688]" />
              </button>
            </div>
            {/* Category Carousel */}
            <div className="hidden lg:block">
              <CategoryCarousel
                activeCategories={activeCategories}
                selectedCategories={selectedCategories}
                onCategorySelect={handleCategorySelect}
              />
            </div>
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
                    <div key={video.id || index} className="mb-2">
                      <VideoCard
                        item={video}
                        showDate={true}
                        size="small"
                        navigate={navigate}
                        rounded={isMobile ? false : true}
                        t={t}
                      />
                    </div>
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
              <div className="text-center py-40">
                <p className="text-[#9FB3E1] text-3xl font-bold">
                  {t("No results found.")}
                </p>
                {(activeSearchTerm ||
                  selectedCategories.length > 0 ||
                  !filters.videoType.includes("all")) && (
                  <button
                    onClick={resetFilters}
                    className="px-6 py-2 mt-6 bg-[#285688] rounded-lg text-white  transition-colors"
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
