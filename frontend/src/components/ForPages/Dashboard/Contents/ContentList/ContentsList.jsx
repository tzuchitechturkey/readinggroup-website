import React, { useState, useEffect } from "react";

import { useTranslation } from "react-i18next";

import Modal from "@/components/Global/Modal/Modal";
import DeleteConfirmation from "@/components/Global/DeleteConfirmation/DeleteConfirmation";
import Loader from "@/components/Global/Loader/Loader";
import DashboardSectionHeader from "@/components/ForPages/Dashboard/DashboardSectionHeader/DashboardSectionHeader";
import { useContentsData } from "@/hooks/useContentsData";
import { useSorting } from "@/hooks/useSorting";
import { usePagination } from "@/hooks/usePagination";

import PostDetails from "../../Learn/PostDetails/PostDetails";
import ContentsSearch from "./components/ContentsSearch";
import ContentsFilters from "./components/ContentsFilters";
import ContentsTable from "./components/ContentsTable";
import ContentsPagination from "./components/ContentsPagination";

const ContentsList = ({ onSectionChange }) => {
  const { t, i18n } = useTranslation();

  // Custom hooks
  const {
    isLoading,
    contentsData,
    totalRecords,
    getContentsData,
    handleWeeklyContentToggle,
    handleDeleteContent,
  } = useContentsData();

  const { sortData, getSortedData, sortConfig } = useSorting(contentsData);
  const { currentPage, handlePageChange, resetPage, getPaginationInfo } =
    usePagination(10);

  // Local state
  const [selectedContent, setSelectedContent] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("published");
  const [isWeeklyMomentFilter, setIsWeeklyMomentFilter] = useState(null);

  // Functions
  const fetchData = (page = 0) => {
    getContentsData(page, search, statusFilter, isWeeklyMomentFilter);
  };

  const handleSearch = () => {
    resetPage();
    fetchData(0);
  };

  const clearSearch = () => {
    setSearch("");
    resetPage();
    getContentsData(0, "", statusFilter, isWeeklyMomentFilter);
  };

  const handleStatusChange = (newStatus) => {
    setStatusFilter(newStatus);
    setSearch("");
    resetPage();
    getContentsData(0, "", newStatus, isWeeklyMomentFilter);
  };

  const handleWeeklyMomentFilterChange = (value) => {
    setIsWeeklyMomentFilter(value);
    setSearch("");
    resetPage();
    getContentsData(0, "", statusFilter, value);
  };

  const handlePageChangeWithFetch = (newPage) => {
    handlePageChange(newPage, fetchData);
  };

  const handleView = (content) => {
    setSelectedContent(content);
    setShowDetailsModal(true);
  };

  const handleEdit = (content) => {
    setSelectedContent(content);
    onSectionChange("createOrEditContent", content);
  };

  const handleDeleteClick = (content) => {
    setSelectedContent(content);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    const success = await handleDeleteContent(selectedContent?.id);
    if (success) {
      setShowDeleteModal(false);
      setSelectedContent(null);
    }
  };

  // Effects
  useEffect(() => {
    fetchData(currentPage - 1);
  }, [statusFilter, isWeeklyMomentFilter]);

  // Computed values
  const sortedData = getSortedData(contentsData);
  const paginationInfo = getPaginationInfo(totalRecords);
  return (
    <div
      className="bg-white rounded-lg border border-gray-200 pt-3 px-3"
      dir={i18n?.language === "ar" ? "rtl" : "ltr"}
    >
      {isLoading && <Loader />}

      {/* Header */}
      <DashboardSectionHeader
        title={t("Contents List")}
        subtitle={`${t("Total")}: ${totalRecords} ${t("contents")}`}
        onBack={() => onSectionChange("dashboard")}
        backTitle={t("Back to Dashboard")}
        onAdd={() => onSectionChange("createOrEditContent", null)}
        addTitle={t("Add New")}
        t={t}
        i18n={i18n}
        showSearch={false}
      />

      {/* Search */}
      <ContentsSearch
        search={search}
        onSearchChange={setSearch}
        onSearch={handleSearch}
        onClear={clearSearch}
      />

      {/* Filters */}
      <ContentsFilters
        statusFilter={statusFilter}
        isWeeklyMomentFilter={isWeeklyMomentFilter}
        onStatusChange={handleStatusChange}
        onWeeklyMomentFilterChange={handleWeeklyMomentFilterChange}
      />

      {/* Table */}
      <ContentsTable
        contents={sortedData}
        search={search}
        isLoading={isLoading}
        sortConfig={sortConfig}
        sortData={sortData}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDeleteClick}
        onWeeklyToggle={handleWeeklyContentToggle}
        onClearSearch={clearSearch}
      />

      {/* Pagination */}
      <ContentsPagination
        paginationInfo={paginationInfo}
        onPageChange={handlePageChangeWithFetch}
        isLoading={isLoading}
      />

      {/* Content Details Modal */}
      <Modal
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        title={t("Post Details")}
        width="800px"
      >
        <PostDetails
          post={selectedContent}
          onClose={() => setShowDetailsModal(false)}
          onEdit={() => {
            onSectionChange("createOrEditContent", selectedContent);
          }}
          fromContent={true}
        />
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        title={t("Confirm Delete")}
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedContent(null);
        }}
      >
        <DeleteConfirmation
          isOpen={showDeleteModal}
          onClose={() => {
            setShowDeleteModal(false);
            setSelectedContent(null);
          }}
          onConfirm={handleConfirmDelete}
          title={t("Delete Post")}
          message={t(
            "Are you sure you want to delete this Post? This action cannot be undone.",
          )}
          itemName={selectedContent?.title}
        />
      </Modal>
    </div>
  );
};

export default ContentsList;
