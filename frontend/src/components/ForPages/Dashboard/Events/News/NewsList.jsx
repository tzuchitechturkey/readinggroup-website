import React, { useState, useEffect } from "react";

import { useTranslation } from "react-i18next";
import { LuArrowUpDown, LuPencil, LuTrash2, LuEye } from "react-icons/lu";
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
import DeleteConfirmation from "@/components/Global/DeleteConfirmation/DeleteConfirmation";
import Loader from "@/components/Global/Loader/Loader";
import { setErrorFn } from "@/Utility/Global/setErrorFn";
import { GetLatestNews, DeleteLatestNewsById } from "@/api/latestNews";
import CustomBreadcrumb from "@/components/ForPages/Dashboard/CustomBreadcrumb/CustomBreadcrumb";
import ImageViewerModal from "@/components/Global/ImageViewerModal/ImageViewerModal";

const NewsList = ({ onSectionChange }) => {
  const { t, i18n } = useTranslation();
  // State management
  const [search, setSearch] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: "happened_at",
    direction: "desc",
  });
  const [selectedNews, setSelectedNews] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [update, setUpdate] = useState(false);
  const [isViewerOpen, setIsViewerOpen] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);
  const [newsData, setNewsData] = useState([]);

  // Fetch News from API
  const getNewsData = async (page = 0, searchVal = search) => {
    setIsLoading(true);
    const offset = page * limit;
    const ordering = sortConfig.direction === "desc" ? `-${sortConfig.key}` : sortConfig.key;

    try {
      const res = await GetLatestNews(limit, offset, searchVal, ordering);
      setTotalRecords(res?.data?.count || 0);
      setNewsData(res?.data?.results || []);
    } catch (error) {
      setErrorFn(error, t);
    } finally {
      setIsLoading(false);
    }
  };

  // Initial load and refetch on dependencies change
  useEffect(() => {
    getNewsData(currentPage - 1, search);
  }, [update, sortConfig]);

  // Sorting functionality
  const sortData = (key) => {
    let direction = "desc";
    if (sortConfig.key === key && sortConfig.direction === "desc") {
      direction = "asc";
    }
    setSortConfig({ key, direction });
  };

  // Get sort icon
  const getSortIcon = (columnKey) => {
    if (sortConfig.key !== columnKey) {
      return <LuArrowUpDown className="h-3 w-3 text-gray-400" />;
    }
    if (sortConfig.direction === "desc") {
      return <LuArrowUpDown className="h-3 w-3 text-blue-600" />;
    }
    if (sortConfig.direction === "asc") {
      return <LuArrowUpDown className="h-3 w-3 text-blue-600 rotate-180" />;
    }
    return <LuArrowUpDown className="h-3 w-3 text-gray-400" />;
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages && !isLoading) {
      setCurrentPage(newPage);
      getNewsData(newPage - 1, search);
    }
  };

  // Clear search
  const clearSearch = () => {
    setSearch("");
    setCurrentPage(1);
    getNewsData(0, "");
  };

  const handleConfirmDelete = async () => {
    if (!selectedNews?.id) return;

    setIsLoading(true);
    try {
      await DeleteLatestNewsById(selectedNews.id);
      toast.success(t("News deleted successfully"));
      setShowDeleteModal(false);
      setSelectedNews(null);
      setUpdate((prev) => !prev);
    } catch (error) {
      setErrorFn(error, t);
    } finally {
      setIsLoading(false);
    }
  };

  // Pagination
  const totalPages = Math.ceil(totalRecords / limit);

  return (
    <div
      className="bg-white rounded-lg border border-gray-200 pt-3 px-3"
      dir={i18n?.language === "ar" ? "rtl" : "ltr"}
    >
      {isLoading && <Loader />}
      
      {/* Breadcrumb */}
      <CustomBreadcrumb
        backTitle={t("Back to Dashboard")}
        onBack={() => onSectionChange("dashboard")}
        page={t("Latest News List")}
      />

      {/* Header */}
      <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b">
        <h2 className="text-lg font-medium text-[#1D2630]">{t("Latest News")}</h2>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">
            {t("Total")}: {totalRecords} {t("news")}
          </span>
          <button
            onClick={() => {
              setSelectedNews(null);
              onSectionChange("createOrEditNews", null);
            }}
            className="text-sm bg-primary border-[1px] border-primary hover:bg-white hover:text-primary transition-all duration-200 text-white px-3 py-1.5 rounded"
          >
            {t("Add New")}
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg p-4 mb-6 shadow-sm">
        <div className="relative max-w-md flex">
          <input
            type="text"
            placeholder={t("Search news...")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={`flex-1 px-4 py-2 border border-gray-300 ${
              i18n?.language === "ar" ? "rounded-r-lg" : "rounded-l-lg"
            } text-sm pr-8`}
          />
          {search && (
            <button
              onClick={clearSearch}
              className={`absolute ${
                i18n?.language === "ar" ? "left-20" : "right-20"
              } top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700`}
            >
              ✕
            </button>
          )}
          <button
            onClick={() => getNewsData(0, search)}
            className={`px-4 py-2 bg-[#4680ff] text-white ${
              i18n?.language === "ar" ? "rounded-l-lg" : "rounded-r-lg"
            } text-sm font-semibold hover:bg-blue-600`}
          >
            {t("Search")}
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-[#5B6B79] text-center font-medium text-xs">
                {t("Image")}
              </TableHead>
              <TableHead className="text-[#5B6B79] text-center font-medium text-xs">
                {t("Title")}
              </TableHead>
              <TableHead className="text-[#5B6B79] text-center font-medium text-xs px-3">
                <button
                  onClick={() => sortData("happened_at")}
                  className="flex items-center gap-1 font-medium"
                >
                  {t("Date")}
                  {getSortIcon("happened_at")}
                </button>
              </TableHead>
              <TableHead className="text-[#5B6B79] text-center font-medium text-xs">
                {t("Description")}
              </TableHead>
              <TableHead className="text-[#5B6B79] text-center font-medium text-xs">
                {t("Images Count")}
              </TableHead>
              <TableHead className="text-center w-[100px]">
                {t("Actions")}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  <div className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600" />
                    {t("Loading News...")}
                  </div>
                </TableCell>
              </TableRow>
            ) : newsData.length > 0 ? (
              newsData.map((news) => (
                <TableRow key={news?.id} className="hover:bg-gray-50">
                  {/* Image */}
                  <TableCell className="text-center py-4">
                    <div className="flex justify-center">
                      {news?.images?.[0]?.image ? (
                        <img
                          src={news.images[0].image}
                          alt={news.title}
                          className="w-16 h-12 object-cover rounded cursor-pointer"
                          onClick={() => {
                            setSelectedNews(news);
                            setIsViewerOpen(true);
                          }}
                        />
                      ) : (
                        <div className="w-16 h-12 bg-gray-200 rounded flex items-center justify-center">
                          <span className="text-xs text-gray-500">{t("No Image")}</span>
                        </div>
                      )}
                    </div>
                  </TableCell>

                  {/* Title */}
                  <TableCell className="text-center py-4 max-w-xs">
                    <p className="font-medium text-gray-900 truncate">
                      {news?.title}
                    </p>
                  </TableCell>

                  {/* Date */}
                  <TableCell className="text-[#1E1E1E] text-center text-[11px] py-4">
                    <span className="font-medium">
                      {news?.happened_at && 
                        new Date(news.happened_at).toLocaleDateString("en-GB", {
                          year: "numeric",
                          month: "2-digit",
                          day: "2-digit",
                        })
                      }
                    </span>
                  </TableCell>

                  {/* Description */}
                  <TableCell className="text-center py-4 max-w-md">
                    <p className="text-sm text-gray-600 truncate">
                      {news?.description}
                    </p>
                  </TableCell>

                  {/* Images Count */}
                  <TableCell className="text-center py-4">
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                      {news?.images?.length || 0} {t("images")}
                    </span>
                  </TableCell>

                  {/* Actions */}
                  <TableCell>
                    <div className="flex items-center gap-2 justify-center">
                      <button
                        onClick={() => {
                          setSelectedNews(news);
                          setIsViewerOpen(true);
                        }}
                        className="p-1 text-green-600 hover:text-green-800 hover:bg-green-100 rounded"
                        title={t("View Images")}
                      >
                        <LuEye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedNews(news);
                          onSectionChange("createOrEditNews", news);
                        }}
                        className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded"
                        title={t("Edit")}
                      >
                        <LuPencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedNews(news);
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
                <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                  {search
                    ? t("No news found matching your search.")
                    : t("No news available.")}
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
                        : "border border-gray-300 hover:bg-gray-50"
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {pageNum}
                  </button>
                );
              })}
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
      <Modal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
        <DeleteConfirmation
          title={t("Delete News")}
          message={t("Are you sure you want to delete this news? This action cannot be undone.")}
          onConfirm={handleConfirmDelete}
          onCancel={() => setShowDeleteModal(false)}
          confirmText={t("Delete")}
          cancelText={t("Cancel")}
        />
      </Modal>

      {/* Image Viewer Modal */}
      <ImageViewerModal
        isOpen={isViewerOpen}
        onClose={() => setIsViewerOpen(false)}
        images={selectedNews?.images || []}
        currentIndex={0}
        onNext={() => {}}
        onPrev={() => {}}
      />
    </div>
  );
};

export default NewsList;