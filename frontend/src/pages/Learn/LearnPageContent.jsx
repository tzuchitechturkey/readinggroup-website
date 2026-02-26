import React, { useEffect, useState } from "react";

import { useTranslation } from "react-i18next";

import LearnSidebar from "@/components/ForPages/Learn/LearnSidebar";
import Pagination from "@/components/Global/PagePagination/PagePagination";
import VerticalCard from "@/components/ForPages/Learn/VerticalCard";
import HorizontalCard from "@/components/ForPages/Learn/HorizontalCard";
import ImageViewerModal from "@/components/Global/ImageViewerModal/ImageViewerModal";
import { GetLearnCategories, GetLearnsByCategoryId } from "@/api/learn";
import { setErrorFn } from "@/Utility/Global/setErrorFn";
import Loader from "@/components/Global/Loader/Loader";
import LearnFilterBar from "@/components/ForPages/Learn/LearnFilterBar";
import MobileFilterModal from "@/components/Videos/MobileFilterModal/MobileFilterModal";

const LearnPageContent = () => {
  const { t, i18n } = useTranslation();
  const [activeCategory, setActiveCategory] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [items, setItems] = useState([]);
  // Image Viewer State
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [categories, setCategories] = useState({
    cards: [],
    posters: [],
  });
  // Date Filter State
  const [filters, setFilters] = useState({
    date: { month: null, year: new Date().getFullYear() },
    sort: "newest",
  });
  const [openDropdowns, setOpenDropdowns] = useState({
    date: false,
    sort: false,
  });

  const getCategories = async () => {
    setIsLoading(true);
    try {
      const res = await GetLearnCategories();
      setCategories({
        cards: res.data.results.filter((cat) => cat.learn_type === "cards"),
        posters: res.data.results.filter((cat) => cat.learn_type === "posters"),
      });
      // active category must be from cards if no category is selected, because cards is the default category type
      handleCategoryClick(
        res.data.results.find((cat) => cat.learn_type === "cards") ||
          res.data.results[0],
      );
    } catch (err) {
      setErrorFn(err, t);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    getCategories();
  }, []);

  const handleCategoryClick = (category) => {
    setActiveCategory(category);
    handleGetItemsByCategoryId(category?.id, null);
  };
  const handleGetItemsByCategoryId = async (categoryId, happenedAt = null) => {
    setIsLoading(true);
    try {
      const params = { happened_at: happenedAt };
      const res = await GetLearnsByCategoryId(categoryId, 100, 0, params);
      setItems(res.data.results || []);
    } catch (err) {
      setErrorFn(err, t);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDateYearChange = (value) => {
    setFilters((prev) => {
      const newYear = Math.abs(value) < 100 ? prev.date.year + value : value;
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
        month,
      },
    }));
  };

  const handleApplyDateFilter = () => {
    let happenedAt = null;
    if (filters.date.month && filters.date.year) {
      const month = String(filters.date.month).padStart(2, "0");
      happenedAt = `${filters.date.year}-${month}`;
    }
    handleGetItemsByCategoryId(activeCategory?.id, happenedAt);
    setOpenDropdowns((prev) => ({ ...prev, date: false }));
  };

  // Handle Sort Changes - Local Sorting
  const handleSortChange = (sortValue) => {
    setFilters((prev) => ({ ...prev, sort: sortValue }));
    // Local sorting will be applied to items based on sortValue
  };

  // Toggle Dropdown
  const handleToggleDropdown = (key) => {
    setOpenDropdowns((prev) => {
      const newState = { ...prev };
      // Close other dropdowns when opening one
      if (newState[key]) {
        newState[key] = false;
      } else {
        // Close all dropdowns first
        Object.keys(newState).forEach((k) => {
          newState[k] = false;
        });
        // Then open the selected one
        newState[key] = true;
      }
      return newState;
    });
  };

  const handleApplyFilters = (newFilters) => {
    setFilters({
      date: newFilters.date,
      sort: newFilters.sortBy,
    });

    let happenedAt = null;
    if (newFilters.date.month) {
      const month = String(newFilters.date.month).padStart(2, "0");
      happenedAt = `${newFilters.date.year}-${month}`;
    } else if (newFilters.date.year) {
      happenedAt = `${newFilters.date.year}`;
    }
    handleGetItemsByCategoryId(activeCategory?.id, happenedAt);
  };

  const handleResetFilters = () => {
    const initialFilters = {
      date: { month: null, year: new Date().getFullYear() },
      sort: "newest",
    };
    setFilters(initialFilters);
    handleGetItemsByCategoryId(activeCategory?.id, null);
  };

  // Image Viewer Handlers
  const openViewer = (index) => {
    setCurrentImageIndex(index);
    setIsViewerOpen(true);
  };

  const closeViewer = () => {
    setIsViewerOpen(false);
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === sortedAndFilteredItems.length - 1 ? 0 : prev + 1,
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? sortedAndFilteredItems.length - 1 : prev - 1,
    );
  };

  // Apply Sorting Logic - Local Sorting
  const getSortedItems = () => {
    if (!items || items?.length === 0) return items;
    const itemsCopy = [...items];

    switch (filters.sort) {
      case "newest":
        return itemsCopy.sort((a, b) => {
          const dateA = new Date(a.created_at || a.published_at || 0);
          const dateB = new Date(b.created_at || b.published_at || 0);
          return dateB - dateA;
        });
      case "oldest":
        return itemsCopy.sort((a, b) => {
          const dateA = new Date(a.created_at || a.published_at || 0);
          const dateB = new Date(b.created_at || b.published_at || 0);
          return dateA - dateB;
        });
      default:
        return itemsCopy;
    }
  };

  const sortedAndFilteredItems = getSortedItems();

  return (
    <div
      className="bg-[#D7EAFF] flex flex-col md:flex-row w-full min-h-screen"
      dir={i18n.dir()}
    >
      {isLoading && <Loader />}
      <div className="hidden md:block w-[324px] flex-shrink-0">
        <LearnSidebar
          categories={categories}
          activeCategory={activeCategory}
          onCategoryClick={handleCategoryClick}
        />
      </div>

      {/* Main Content */}
      <main className="flex-1 min-w-0 bg-[#D7EAFF]">
        <div
          className={`pt-[48px] pb-40 px-4 md:px-[24px] ${i18n?.language === "ar" ? "md:pl-[120px]" : "md:pr-[120px]"} min-h-screen`}
        >
          <div className="w-full">
            {/* Header Controls */}
            <LearnFilterBar
              activeCategory={activeCategory}
              categories={categories}
              onCategoryClick={handleCategoryClick}
              filters={filters}
              openDropdowns={openDropdowns}
              onToggleDropdown={handleToggleDropdown}
              onDateYearChange={handleDateYearChange}
              onDateMonthSelect={handleDateMonthSelect}
              onApplyDateFilter={handleApplyDateFilter}
              onSortChange={handleSortChange}
              onOpenFilter={() => setIsFilterModalOpen(true)}
              totalrecord={items.length}
            />

            {/* Grid switching between Horizontal and Vertical layouts */}
            <div
              className={`grid ${
                sortedAndFilteredItems[0]?.direction === "vertical"
                  ? "grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
                  : "grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
              }`}
              style={{ columnGap: "12px", rowGap: "16px" }}
            >
              {sortedAndFilteredItems.map((item, index) =>
                item.direction === "vertical" ? (
                  <VerticalCard
                    key={item.id}
                    card={item}
                    onClick={() => openViewer(index)}
                  />
                ) : (
                  <HorizontalCard
                    key={item.id}
                    card={item}
                    onClick={() => openViewer(index)}
                  />
                ),
              )}
            </div>

            {/* Start Pagination */}
            {sortedAndFilteredItems.length > 0 && (
              <Pagination
                currentPage={1}
                totalPages={Math.ceil(sortedAndFilteredItems.length / 10) || 1}
              />
            )}
            {/* End Pagination */}
          </div>
        </div>
      </main>

      {/* Mobile Filter Modal */}
      <MobileFilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        filters={{
          videoType: ["all"],
          date: filters.date,
          sortBy: filters.sort,
          categories: [],
        }}
        onApplyFilters={handleApplyFilters}
        onResetFilters={handleResetFilters}
        // Learn page categories are handled by the sidebar/tab bar,
        // but if we want them in the modal too:
        activeCategories={[]}
        selectedCategories={[]}
      />

      {/* Image Viewer Modal */}
      <ImageViewerModal
        isOpen={isViewerOpen}
        onClose={closeViewer}
        images={sortedAndFilteredItems}
        currentIndex={currentImageIndex}
        onNext={nextImage}
        onPrev={prevImage}
      />
    </div>
  );
};

export default LearnPageContent;
