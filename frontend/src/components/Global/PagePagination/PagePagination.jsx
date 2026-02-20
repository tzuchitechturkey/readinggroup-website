import React from "react";
import { HiOutlineChevronRight } from "react-icons/hi";

const Pagination = ({ currentPage = 1, totalPages = 4, onPageChange }) => {
  return (
    <div className="mt-20 flex justify-center items-center gap-6">
      {[...Array(totalPages)].map((_, i) => {
        const pageNum = i + 1;
        return (
          <button
            key={pageNum}
            onClick={() => onPageChange?.(pageNum)}
            className={`text-sm font-bold transition-colors ${
              currentPage === pageNum
                ? "text-gray-900"
                : "text-gray-500 hover:text-gray-900"
            }`}
          >
            {pageNum}
          </button>
        );
      })}
      <button
        onClick={() => onPageChange?.(currentPage + 1)}
        className="w-8 h-8 flex items-center justify-center border border-gray-900 rounded-full hover:bg-gray-50 transition-all ml-2"
        disabled={currentPage >= totalPages}
      >
        <HiOutlineChevronRight className="w-4 h-4 text-gray-900" />
      </button>
    </div>
  );
};

export default Pagination;
