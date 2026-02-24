import { useState } from "react";

export const usePagination = (initialLimit = 10) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(initialLimit);

  const handlePageChange = (newPage, callback) => {
    setCurrentPage(newPage);
    if (callback) {
      callback(newPage - 1); // Convert to 0-based for API
    }
  };

  const resetPage = () => {
    setCurrentPage(1);
  };

  const getTotalPages = (totalRecords) => {
    return Math.ceil(totalRecords / limit);
  };

  const getPaginationInfo = (totalRecords) => {
    const totalPages = getTotalPages(totalRecords);
    const startRecord = (currentPage - 1) * limit + 1;
    const endRecord = Math.min(currentPage * limit, totalRecords);
    
    return {
      currentPage,
      totalPages,
      startRecord,
      endRecord,
      totalRecords,
      limit,
    };
  };

  return {
    currentPage,
    limit,
    handlePageChange,
    resetPage,
    getTotalPages,
    getPaginationInfo,
  };
};