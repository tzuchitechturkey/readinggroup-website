import React, { useState, useEffect } from "react";

import { useTranslation } from "react-i18next";

import Modal from "@/components/Global/Modal/Modal";
import DeleteConfirmation from "@/components/Global/DeleteConfirmation/DeleteConfirmation";
import Loader from "@/components/Global/Loader/Loader";
import DashboardSectionHeader from "@/components/ForPages/Dashboard/DashboardSectionHeader/DashboardSectionHeader";
import { usePostsData } from "@/hooks/usePostsData";
import { useSorting } from "@/hooks/useSorting";
import { usePagination } from "@/hooks/usePagination";

import PostDetails from "../PostDetails/PostDetails";
import PostsSearch from "./components/PostsSearch";
import PostsFilters from "./components/PostsFilters";
import PostsTable from "./components/PostsTable";
import PostsPagination from "./components/PostsPagination";

function PostsList({ onSectionChange }) {
  const { t, i18n } = useTranslation();

  // Custom hooks
  const {
    isLoading,
    postData,
    totalRecords,
    getPostData,
    handleWeeklyPostToggle,
    handleDeletePost,
  } = usePostsData();

  const { sortData, getSortedData, sortConfig } = useSorting(postData);
  const { currentPage, handlePageChange, resetPage, getPaginationInfo } =
    usePagination(10);

  // Local state
  const [selectedPost, setSelectedPost] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("published");
  const [isWeeklyMomentFilter, setIsWeeklyMomentFilter] = useState(null);

  // Functions
  const fetchData = (page = 0) => {
    getPostData(page, search, statusFilter, isWeeklyMomentFilter);
  };

  const handleSearch = () => {
    resetPage();
    fetchData(0);
  };

  const clearSearch = () => {
    setSearch("");
    resetPage();
    getPostData(0, "", statusFilter, isWeeklyMomentFilter);
  };

  const handleStatusChange = (newStatus) => {
    setStatusFilter(newStatus);
    setSearch("");
    resetPage();
    getPostData(0, "", newStatus, isWeeklyMomentFilter);
  };

  const handleWeeklyMomentFilterChange = (value) => {
    setIsWeeklyMomentFilter(value);
    setSearch("");
    resetPage();
    getPostData(0, "", statusFilter, value);
  };

  const handlePageChangeWithFetch = (newPage) => {
    handlePageChange(newPage, fetchData);
  };

  const handleView = (post) => {
    setSelectedPost(post);
    setShowDetailsModal(true);
  };

  const handleEdit = (post) => {
    setSelectedPost(post);
    onSectionChange("createOrEditPost", post);
  };

  const handleDeleteClick = (post) => {
    setSelectedPost(post);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    const success = await handleDeletePost(selectedPost?.id);
    if (success) {
      setShowDeleteModal(false);
      setSelectedPost(null);
    }
  };

  // Effects
  useEffect(() => {
    fetchData(currentPage - 1);
  }, [statusFilter, isWeeklyMomentFilter]);

  // Computed values
  const sortedData = getSortedData(postData);
  const paginationInfo = getPaginationInfo(totalRecords);
  return (
    <div
      className="bg-white rounded-lg border border-gray-200 pt-3 px-3"
      dir={i18n?.language === "ar" ? "rtl" : "ltr"}
    >
      {isLoading && <Loader />}

      {/* Header */}
      <DashboardSectionHeader
        title={t("Posts List")}
        subtitle={`${t("Total")}: ${totalRecords} ${t("posts")}`}
        onBack={() => onSectionChange("dashboard")}
        backTitle={t("Back to Dashboard")}
        onAdd={() => onSectionChange("createOrEditPost", null)}
        addTitle={t("Add New")}
      />

      {/* Search */}
      <PostsSearch
        search={search}
        onSearchChange={setSearch}
        onSearch={handleSearch}
        onClear={clearSearch}
      />

      {/* Filters */}
      <PostsFilters
        statusFilter={statusFilter}
        isWeeklyMomentFilter={isWeeklyMomentFilter}
        onStatusChange={handleStatusChange}
        onWeeklyMomentFilterChange={handleWeeklyMomentFilterChange}
      />

      {/* Table */}
      <PostsTable
        posts={sortedData}
        search={search}
        sortConfig={sortConfig}
        sortData={sortData}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDeleteClick}
        onWeeklyToggle={handleWeeklyPostToggle}
        onClearSearch={clearSearch}
      />

      {/* Pagination */}
      <PostsPagination
        paginationInfo={paginationInfo}
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
            onSectionChange("createOrEditPost", selectedPost);
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
          title={t("Delete Post")}
          message={t(
            "Are you sure you want to delete this Post? This action cannot be undone.",
          )}
          itemName={selectedPost?.title}
        />
      </Modal>
    </div>
  );
}

export default PostsList;
