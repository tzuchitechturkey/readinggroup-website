import React from "react";

import { HiOutlineChevronRight } from "react-icons/hi";

const Pagination = ({ currentPage = 1, totalPages = 1, onPageChange }) => {
  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 4;

    if (totalPages <= maxVisiblePages) {
      // Show all pages if total is less than maxVisiblePages
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show first maxVisiblePages pages and ellipsis
      for (let i = 1; i <= maxVisiblePages; i++) {
        pages.push(i);
      }
      if (totalPages > maxVisiblePages) {
        pages.push("...");
      }
    }
    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="mt-20 flex justify-center items-center gap-2">
      {/* Page Numbers */}
      {pageNumbers.map((pageNum, index) => (
        <React.Fragment key={index}>
          {pageNum === "..." ? (
            <div className="w-6 h-6 flex items-center justify-center text-[#081945] text-base font-normal">
              ...
            </div>
          ) : (
            <button
              onClick={() => onPageChange?.(pageNum)}
              className={`w-6 h-6 flex items-center justify-center text-base font-normal transition-colors rounded ${
                currentPage === pageNum
                  ? "bg-[#285688] text-white"
                  : "text-[#212121] hover:bg-gray-100"
              }`}
            >
              {pageNum}
            </button>
          )}
        </React.Fragment>
      ))}

      {/* Chevron Right Button */}
      <button
        onClick={() => onPageChange?.(Math.min(currentPage + 1, totalPages))}
        className="w-6 h-6 flex items-center justify-center ml-2 text-[#081945] hover:bg-gray-100 transition-colors rounded"
        disabled={currentPage >= totalPages}
        title="Next page"
      >
        <HiOutlineChevronRight className="w-6 h-6" />
      </button>
    </div>
  );
};

export default Pagination;
