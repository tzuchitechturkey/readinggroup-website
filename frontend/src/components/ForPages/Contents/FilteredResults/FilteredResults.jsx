import React from "react";

import { useTranslation } from "react-i18next";
import { BookOpen, ChevronLeft, ChevronRight } from "lucide-react";

import GlobalCard from "@/components/Global/GlobalCard/GlobalCard";

function FilteredResults({
  data,
  isSearchPerformed,
  totalRecords,
  isLoading,
  currentPage,
  limit,
  onPageChange,
}) {
  const { t } = useTranslation();

  // Calculate pagination info
  const totalPages = Math.ceil(totalRecords / limit);
  const startRecord = currentPage * limit + 1;
  const endRecord = Math.min((currentPage + 1) * limit, totalRecords);

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 10;

    if (totalPages <= maxPagesToShow) {
      // Show all pages if total is less than max
      for (let i = 0; i < totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(0);

      let startPage = Math.max(1, currentPage - 1);
      let endPage = Math.min(totalPages - 2, currentPage + 1);

      // Adjust if we're near the start
      if (currentPage <= 2) {
        endPage = 3;
      }

      // Adjust if we're near the end
      if (currentPage >= totalPages - 3) {
        startPage = totalPages - 4;
      }

      // Add ellipsis if needed
      if (startPage > 1) {
        pages.push("ellipsis-start");
      }

      // Add middle pages
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      // Add ellipsis if needed
      if (endPage < totalPages - 2) {
        pages.push("ellipsis-end");
      }

      // Always show last page
      pages.push(totalPages - 1);
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  if (!isSearchPerformed) {
    return null;
  }

  return (
    <div className="w-full">
      {/* Results Header */}
      {/* <div className="mb-6">
        <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
          {t("Search Results")}
        </h2>
        <p className="text-gray-600">
          {t("Showing")} {data.length} {t("of")} {totalCount || data.length} {t("reading(s)")}
        </p>
      </div> */}

      {/* Results Grid */}
      {data?.length > 0 ? (
        <div className="space-y-8">
          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {data?.map((item) => (
              <div key={item.id}>
                <GlobalCard item={item} />
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex flex-col items-center gap-4 pt-8">
              {/* Pagination Info */}
              <p className="text-sm text-gray-600">
                {t("Showing")} {startRecord} {t("to")} {endRecord} {t("of")}{" "}
                {totalRecords} {t("results")}
              </p>

              {/* Pagination Controls */}
              <div className="flex items-center gap-2">
                {/* Previous Button */}
                <button
                  onClick={() => onPageChange(currentPage - 1)}
                  disabled={currentPage === 0 || isLoading}
                  className={`
                    inline-flex items-center gap-1 px-3 py-2 rounded-lg font-medium text-sm
                    transition-all duration-200
                    ${
                      currentPage === 0 || isLoading
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-white text-gray-700 hover:bg-blue-50 hover:text-blue-600 border border-gray-300"
                    }
                  `}
                >
                  <ChevronLeft className="w-4 h-4" />
                  {t("Previous")}
                </button>

                {/* Page Numbers */}
                <div className="flex items-center gap-1">
                  {pageNumbers.map((page) => {
                    if (typeof page === "string") {
                      // Ellipsis
                      return (
                        <span key={page} className="px-2 text-gray-400">
                          ...
                        </span>
                      );
                    }

                    return (
                      <button
                        key={page}
                        onClick={() => onPageChange(page)}
                        disabled={isLoading}
                        className={`
                          w-10 h-10 rounded-lg font-medium text-sm
                          transition-all duration-200
                          ${
                            currentPage === page
                              ? "bg-blue-600 text-white shadow-md"
                              : "bg-white text-gray-700 hover:bg-blue-50 hover:text-blue-600 border border-gray-300"
                          }
                          ${isLoading ? "cursor-not-allowed opacity-50" : ""}
                        `}
                      >
                        {page + 1}
                      </button>
                    );
                  })}
                </div>

                {/* Next Button */}
                <button
                  onClick={() => onPageChange(currentPage + 1)}
                  disabled={currentPage >= totalPages - 1 || isLoading}
                  className={`
                    inline-flex items-center gap-1 px-3 py-2 rounded-lg font-medium text-sm
                    transition-all duration-200
                    ${
                      currentPage >= totalPages - 1 || isLoading
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-white text-gray-700 hover:bg-blue-50 hover:text-blue-600 border border-gray-300"
                    }
                  `}
                >
                  {t("Next")}
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <>
          {/* No Results Found */}
          <div className="text-center py-12">
            <div className="mb-4">
              <BookOpen className="w-16 h-16 text-gray-300 mx-auto" />
            </div>
            <h3 className="text-xl font-medium text-gray-600 mb-2">
              {t("No results found")}
            </h3>
            <p className="text-gray-500">
              {t("Try adjusting your search criteria or filters")}
            </p>
          </div>
        </>
      )}
    </div>
  );
}

export default FilteredResults;
