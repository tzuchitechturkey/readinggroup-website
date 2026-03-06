import React, { useState, useEffect } from "react";

import { useTranslation } from "react-i18next";
import { LuArrowUpDown } from "react-icons/lu";
import { toast } from "react-toastify";

import Modal from "@/components/Global/Modal/Modal";
import DeleteConfirmation from "@/components/Global/DeleteConfirmation/DeleteConfirmation";
import Loader from "@/components/Global/Loader/Loader";
import { setErrorFn } from "@/Utility/Global/setErrorFn";
import { GetLatestNews, DeleteLatestNewsById } from "@/api/latestNews";
import CustomBreadcrumb from "@/components/ForPages/Dashboard/CustomBreadcrumb/CustomBreadcrumb";
import ImageViewerModal from "@/components/Global/ImageViewerModal/ImageViewerModal";

import NewsTable from "./NewsTable/NewsTable";
import CreateOrEditNews from "./CreateOrEditNews/CreateOrEditNews";

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
  const [openCreateOrEditModal, setOpenCreateOrEditModal] = useState(false);
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);
  const [newsData, setNewsData] = useState([]);

  // Fetch News from API
  const getNewsData = async (page = 0, searchVal = search) => {
    setIsLoading(true);
    const offset = page * limit;
    const ordering =
      sortConfig.direction === "desc" ? `-${sortConfig.key}` : sortConfig.key;

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
        <h2 className="text-lg font-medium text-[#1D2630]">
          {t("Latest News")}
        </h2>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">
            {t("Total")}: {totalRecords} {t("news")}
          </span>
          <button
            onClick={() => {
              setSelectedNews(null);
              setOpenCreateOrEditModal(true);
              // onSectionChange("createOrEditNews", null);
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

      {/* Start Table */}
      <NewsTable
        t={t}
        isLoading={isLoading}
        newsData={newsData}
        sortData={sortData}
        getSortIcon={getSortIcon}
        setSelectedNews={setSelectedNews}
        setIsViewerOpen={setIsViewerOpen}
        onSectionChange={onSectionChange}
        setOpenCreateOrEditModal={setOpenCreateOrEditModal}
        totalPages={totalPages}
        currentPage={currentPage}
        handlePageChange={handlePageChange}
        search={search}
        setShowDeleteModal={setShowDeleteModal}
      />
      {/* End Table */}

      {/* Delete Confirmation Modal */}
      <Modal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
        <DeleteConfirmation
          isOpen={showDeleteModal}
          title={t("Delete News")}
          message={t(
            "Are you sure you want to delete this news? This action cannot be undone.",
          )}
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
      <Modal
        isOpen={openCreateOrEditModal}
        onClose={() => setOpenCreateOrEditModal(false)}
        title={selectedNews ? t("Edit News") : t("Create News")}
        width={"400px"}
      >
        <CreateOrEditNews
          selectedNews={selectedNews}
          onSectionChange={onSectionChange}
          setOpenCreateOrEditModal={setOpenCreateOrEditModal}
          setUpdate={setUpdate}
        />
      </Modal>
    </div>
  );
};

export default NewsList;
