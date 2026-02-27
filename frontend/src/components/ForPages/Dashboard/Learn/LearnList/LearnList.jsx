import React, { useState, useEffect } from "react";

import { useTranslation } from "react-i18next";

import Modal from "@/components/Global/Modal/Modal";
import DeleteConfirmation from "@/components/Global/DeleteConfirmation/DeleteConfirmation";
import Loader from "@/components/Global/Loader/Loader";
import DashboardSectionHeader from "@/components/ForPages/Dashboard/DashboardSectionHeader/DashboardSectionHeader";
import PagePagination from "@/components/Global/PagePagination/PagePagination";
import { useLearnData } from "@/hooks/learn/useLearnData";
import { useSorting } from "@/hooks/useSorting";
import { usePagination } from "@/hooks/usePagination";

import PostDetails from "../LearnDetails/LearnDetails";
import LearnTable from "./LearnTable";

function LearnList({ onSectionChange }) {
  const { t, i18n } = useTranslation();

  // Custom hooks
  const {
    isLoading,
    learnData,
    totalRecords,
    update,
    getLearnData,
    handleDeleteLearn,
  } = useLearnData();

  const { sortData, getSortedData, sortConfig } = useSorting(learnData);
  const { currentPage, handlePageChange, resetPage, getPaginationInfo } =
    usePagination(10);

  // Local state
  const [selectedPost, setSelectedPost] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [search, setSearch] = useState("");

  // Functions
  const fetchData = (page = 0) => {
    getLearnData(page, search);
  };

  const clearSearch = () => {
    setSearch("");
    resetPage();
    getLearnData(0, "");
  };

  const handlePageChangeWithFetch = (newPage) => {
    handlePageChange(newPage, fetchData);
  };

  const handleView = (post) => {
    setSelectedPost(post);
    setShowDetailsModal(true);
  };

  const handleEdit = (learn) => {
    setSelectedPost(learn);
    onSectionChange("createOrEditLearn", learn);
  };

  const handleDeleteClick = (post) => {
    setSelectedPost(post);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    const success = await handleDeleteLearn(selectedPost?.id);
    if (success) {
      setShowDeleteModal(false);
      setSelectedPost(null);
    }
  };

  // Effects
  useEffect(() => {
    fetchData(currentPage - 1);
  }, [update]);

  // Computed values
  const sortedData = getSortedData(learnData);
  const paginationInfo = getPaginationInfo(totalRecords);
  return (
    <div
      className="bg-white rounded-lg border border-gray-200 pt-3 px-3"
      dir={i18n?.language === "ar" ? "rtl" : "ltr"}
    >
      {isLoading && <Loader />}

      {/* Header */}
      <DashboardSectionHeader
        t={t}
        title={t("Learn List")}
        subtitle={`${t("Total")}: ${totalRecords} ${t("learn")}`}
        onBack={() => onSectionChange("dashboard")}
        backTitle={t("Back to Dashboard")}
        onAdd={() => onSectionChange("createOrEditLearn", null)}
        addText={t("Add New")}
        onAddClick={() => onSectionChange("createOrEditLearn", null)}
        searchTerm={search}
        setSearchTerm={setSearch}
        getData={fetchData}
      />

      {/* Table */}
      <LearnTable
        learnData={sortedData}
        search={search}
        sortConfig={sortConfig}
        sortData={sortData}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDeleteClick}
        onClearSearch={clearSearch}
      />

      {/* Pagination */}
      <PagePagination
        currentPage={paginationInfo.currentPage}
        totalPages={paginationInfo.totalPages}
        onPageChange={handlePageChangeWithFetch}
      />

      {/* Post Details Modal */}
      <Modal
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        title={t("Post Details")}
        width="800px"
      >
        <PostDetails
          post={selectedPost}
          onClose={() => setShowDetailsModal(false)}
          onEdit={() => {
            onSectionChange("createOrEditLearn", selectedPost);
          }}
        />
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => {
          setSelectedPost(null);
          setShowDeleteModal(false);
        }}
        title={t("Confirm Deletion")}
        width="500px"
      >
        <DeleteConfirmation
          isOpen={showDeleteModal}
          onClose={() => {
            setSelectedPost(null);
            setShowDeleteModal(false);
          }}
          onConfirm={handleConfirmDelete}
          title={t("Delete Learn")}
          message={t(
            "Are you sure you want to delete this Learn? This action cannot be undone.",
          )}
          itemName={selectedPost?.title}
        />
      </Modal>
    </div>
  );
}

export default LearnList;
