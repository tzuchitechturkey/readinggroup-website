import React, { useState, useEffect } from "react";

import { useTranslation } from "react-i18next";
import {
  LuArrowUpDown,
  LuSearch,
  LuPlus,
  LuPencil,
  LuTrash2,
} from "react-icons/lu";
import { toast } from "react-toastify";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Modal from "@/components/Global/Modal/Modal";
import DeleteConfirmation from "@/components/ForPages/Dashboard/Videos/DeleteConfirmation/DeleteConfirmation";
import Loader from "@/components/Global/Loader/Loader";
import { setErrorFn } from "@/Utility/Global/setErrorFn";
import { GetTvPrograms, DeleteTvProgramById } from "@/api/tvPrograms";

const TVList = ({ onSectionChange }) => {
  const { t } = useTranslation();
  // State management
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "id", direction: "asc" });
  const [selectedNews, setSelectedNews] = useState(null);
  const [showCreateOrEditModal, setShowCreateOrEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [update, setUpdate] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);
  const [newsData, setNewsData] = useState([]);

  // Fetch TV Programs from API
  const getTVData = async (page = 0) => {
    setIsLoading(true);
    const offset = page * limit;
    try {
      const res = await GetTvPrograms(limit, offset, searchTerm);

      setTotalRecords(res?.data?.count || 0);
      setNewsData(res?.data?.results || []);
    } catch (error) {
      setErrorFn(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Local sorting for displayed data
  const getSortedData = () => {
    if (!newsData || !sortConfig.key) return newsData || [];

    const sorted = [...newsData].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (aValue === null || aValue === undefined) return 1;
      if (bValue === null || bValue === undefined) return -1;

      // numeric fields
      if (sortConfig.key === "id") {
        return sortConfig.direction === "asc"
          ? aValue - bValue
          : bValue - aValue;
      }

      // date fields
      if (sortConfig.key === "air_date") {
        const dateA = new Date(aValue);
        const dateB = new Date(bValue);
        return sortConfig.direction === "asc" ? dateA - dateB : dateB - dateA;
      }

      // string fallback
      const strA = String(aValue).toLowerCase();
      const strB = String(bValue).toLowerCase();
      if (strA < strB) return sortConfig.direction === "asc" ? -1 : 1;
      if (strA > strB) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });

    return sorted;
  };

  // Initial load and refetch on dependencies change
  useEffect(() => {
    getTVData(currentPage - 1);
  }, [currentPage, update]);

  // Sorting functionality
  const sortData = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  // Get sort icon
  const getSortIcon = (columnKey) => {
    if (sortConfig.key !== columnKey) {
      return <LuArrowUpDown className="h-3 w-3 text-gray-400" />;
    }

    if (sortConfig.direction === "asc") {
      return <LuArrowUpDown className="h-3 w-3 text-blue-600 rotate-180" />;
    }

    if (sortConfig.direction === "desc") {
      return <LuArrowUpDown className="h-3 w-3 text-blue-600" />;
    }

    return <LuArrowUpDown className="h-3 w-3 text-gray-400" />;
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages && !isLoading) {
      setCurrentPage(newPage);
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedNews?.id) return;

    setIsLoading(true);
    try {
      await DeleteTvProgramById(selectedNews.id);
      toast.success(t("News deleted successfully"));
      setShowDeleteModal(false);
      setSelectedNews(null);
      setUpdate((prev) => !prev);
    } catch (error) {
      setErrorFn(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Pagination
  const totalPages = Math.ceil(totalRecords / limit);

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ar-SA");
  };

  return (
    <div className="p-4">
      {isLoading && <Loader />}
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-gray-800">{t("News")}</h1>

        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          {/* Search */}
          <div className="relative">
            <LuSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder={t("Search News...")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-64"
            />
          </div>

          {/* Add Button */}
          <button
            onClick={() => {
              setSelectedNews(null);
              onSectionChange("createOrEditNews");
            }}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-white border-[1px] border-primary hover:text-primary transition-all duration-200"
          >
            <LuPlus className="h-4 w-4" />
            {t("Add News")}
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="mb-4 text-sm text-gray-600">
        {isLoading ? (
          <div className="flex items-center gap-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600" />
            {t("Loading...")}
          </div>
        ) : (
          `${t("Total")}: ${totalRecords} ${t("programs")} | ${t(
            "Page"
          )} ${currentPage} ${t("of")} ${totalPages}`
        )}
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-[#5B6B79] font-medium text-xs px-3">
                <button
                  onClick={() => sortData("id")}
                  className="flex items-center gap-1 font-medium"
                >
                  #{getSortIcon("id")}
                </button>
              </TableHead>
              <TableHead>
                <button
                  onClick={() => sortData("title")}
                  className="flex items-center gap-1 font-medium"
                >
                  {t("Title")}
                  {getSortIcon("title")}
                </button>
              </TableHead>
              <TableHead>
                <button
                  onClick={() => sortData("title")}
                  className="flex items-center gap-1 font-medium"
                >
                  {t("Image")}
                </button>
              </TableHead>
              <TableHead className="hidden md:table-cell">
                <button
                  onClick={() => sortData("description")}
                  className="flex items-center gap-1 font-medium"
                >
                  {t("Description")}
                  {getSortIcon("description")}
                </button>
              </TableHead>
              <TableHead>
                <button
                  onClick={() => sortData("air_date")}
                  className="flex items-center gap-1 font-medium"
                >
                  {t("Date")}
                  {getSortIcon("air_date")}
                </button>
              </TableHead>
              <TableHead className="hidden sm:table-cell">
                <button
                  onClick={() => sortData("writer")}
                  className="flex items-center gap-1 font-medium"
                >
                  {t("Writer")}
                  {getSortIcon("writer")}
                </button>
              </TableHead>
              <TableHead className="hidden sm:table-cell">
                <button
                  onClick={() => sortData("category")}
                  className="flex items-center gap-1 font-medium"
                >
                  {t("Category")}
                  {getSortIcon("category")}
                </button>
              </TableHead>
              <TableHead className="w-[100px]">{t("Actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  <div className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600" />
                    {t("Loading TV programs...")}
                  </div>
                </TableCell>
              </TableRow>
            ) : getSortedData().length > 0 ? (
              getSortedData().map((tv) => (
                <TableRow key={tv.id} className="hover:bg-gray-50">
                  <TableCell className="text-[#1E1E1E] font-bold text-[11px] py-4 px-4">
                    {tv.id}
                  </TableCell>
                  <TableCell>
                    <div className="min-w-0">
                      <p className="font-medium text-gray-900 truncate">
                        {tv.title}
                      </p>
                      <p className="text-sm text-gray-500 md:hidden truncate">
                        {tv.description.substring(0, 50)}...
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <img
                        src={tv.image}
                        alt={tv.title}
                        className="w-12 h-12 rounded-lg object-cover"
                        onError={(e) => {
                          e.target.src = "/placeholder-image.png";
                        }}
                      />
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <p
                      className="text-gray-600 max-w-xs truncate"
                      title={tv.description}
                    >
                      {tv.description}
                    </p>
                  </TableCell>
                  <TableCell>
                    <span className="text-gray-600">
                      {formatDate(tv.air_date)}
                    </span>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <span className="text-gray-600">{tv.writer}</span>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {tv.category?.name}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setSelectedNews(tv);
                          onSectionChange("createOrEditNews", tv);
                        }}
                        className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded"
                        title={t("Edit")}
                      >
                        <LuPencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedNews(tv);
                          setShowDeleteModal(true);
                        }}
                        className="p-1 text-red-600 hover:text-red-800 hover:bg-red-100 rounded"
                        title={t("Delete")}
                      >
                        <LuTrash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center py-8 text-gray-500"
                >
                  {searchTerm
                    ? t("No TV programs found matching your search.")
                    : t("No TV programs available.")}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-6">
          <div className="text-sm text-gray-600">
            {t("Showing")} {(currentPage - 1) * limit + 1} {t("to")}{" "}
            {Math.min(currentPage * limit, totalRecords)} {t("of")}{" "}
            {totalRecords} {t("results")}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1 || isLoading}
              className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {t("Previous")}
            </button>

            {/* Page Numbers */}
            <div className="flex items-center gap-1">
              {[...Array(Math.min(5, totalPages))].map((_, i) => {
                const pageNum = i + 1;
                const isActive = pageNum === currentPage;

                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    disabled={isLoading}
                    className={`px-3 py-1 text-sm rounded ${
                      isActive
                        ? "bg-blue-600 text-white"
                        : "border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}

              {totalPages > 5 && (
                <>
                  <span className="px-2 text-gray-500">...</span>
                  <button
                    onClick={() => handlePageChange(totalPages)}
                    disabled={currentPage === totalPages || isLoading}
                    className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {totalPages}
                  </button>
                </>
              )}
            </div>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages || isLoading}
              className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {t("Next")}
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        title={t("Confirm Delete")}
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedNews(null);
        }}
      >
        <DeleteConfirmation
          isOpen={showDeleteModal}
          onClose={() => {
            setShowDeleteModal(false);
            setSelectedNews(null);
          }}
          onConfirm={handleConfirmDelete}
          title={t("Delete Post")}
          message={t(
            "Are you sure you want to delete this Post? This action cannot be undone."
          )}
          itemName={selectedNews?.title}
        />
      </Modal>
    </div>
  );
};

export default TVList;
