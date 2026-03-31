import React, { useState, useEffect } from "react";

import { useTranslation } from "react-i18next";

import Modal from "@/components/Global/Modal/Modal";
import DeleteConfirmation from "@/components/Global/DeleteConfirmation/DeleteConfirmation";
import Loader from "@/components/Global/Loader/Loader";
import DashboardSectionHeader from "@/components/ForPages/Dashboard/DashboardSectionHeader/DashboardSectionHeader";
import PagePagination from "@/components/Global/PagePagination/PagePagination";
import { useUserData } from "@/hooks/user/useUserData";
import { useSorting } from "@/hooks/useSorting";
import { usePagination } from "@/hooks/usePagination";

import UsersTable from "./UsersTable";
import CreateOrEditUsers from "./CreateOrEditUsers";

function UsersManagementContent({ onSectionChange }) {
  const { t } = useTranslation();

  // Custom hooks
  const {
    isLoading,
    userData,
    totalRecords,
    update,
    getUserData,
    handleDeleteUser,
  } = useUserData();

  const { sortData, getSortedData, sortConfig } = useSorting(userData);
  const { currentPage, handlePageChange, resetPage, getPaginationInfo } =
    usePagination(10);

  // Local state
  const [selectedUser, setSelectedUser] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showCreateEditModal, setShowCreateEditModal] = useState(false);
  const [search, setSearch] = useState("");

  // Functions
  const fetchData = (page = 0) => {
    getUserData(page, search);
  };

  const clearSearch = () => {
    setSearch("");
    resetPage();
    getUserData(0, "");
  };

  const handlePageChangeWithFetch = (newPage) => {
    handlePageChange(newPage, fetchData);
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setShowCreateEditModal(true);
  };

  const handleCreate = () => {
    setSelectedUser(null);
    setShowCreateEditModal(true);
  };

  const handleCreateEditClose = (dataChanged) => {
    setShowCreateEditModal(false);
    setSelectedUser(null);
    if (dataChanged) {
      // Refresh data if something was changed
      fetchData(0);
      resetPage();
    }
  };

  const handleDeleteClick = (user) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    const success = await handleDeleteUser(selectedUser?.id);
    if (success) {
      setShowDeleteModal(false);
      setSelectedUser(null);
    }
  };

  // Effects
  useEffect(() => {
    fetchData(currentPage - 1);
  }, [update]);

  // Computed values
  const sortedData = getSortedData(userData);
  const paginationInfo = getPaginationInfo(totalRecords);

  return (
    <div className="bg-white rounded-lg border border-gray-200 pt-3 px-3">
      {isLoading && <Loader />}

      {/* Header */}
      <DashboardSectionHeader
        t={t}
        title={t("Users List")}
        subtitle={t("users")}
        totalRecords={totalRecords}
        onAddClick={handleCreate}
        addText={t("Add New")}
        searchTerm={search}
        setSearchTerm={setSearch}
        getData={fetchData}
      />

      {/* Table */}
      <UsersTable
        usersData={sortedData}
        search={search}
        sortConfig={sortConfig}
        sortData={sortData}
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

      {/* Create/Edit User Modal */}
      <Modal
        isOpen={showCreateEditModal}
        onClose={() => handleCreateEditClose(false)}
        title={selectedUser?.id ? t("Edit User") : t("Create New User")}
        width="500px"
      >
        <CreateOrEditUsers
          user={selectedUser}
          onClose={handleCreateEditClose}
        />
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => {
          setSelectedUser(null);
          setShowDeleteModal(false);
        }}
        title={t("Confirm Deletion")}
        width="500px"
      >
        <DeleteConfirmation
          isOpen={showDeleteModal}
          onClose={() => {
            setSelectedUser(null);
            setShowDeleteModal(false);
          }}
          onConfirm={handleConfirmDelete}
          title={t("Delete User")}
          message={t(
            "Are you sure you want to delete this User? This action cannot be undone.",
          )}
          itemName={selectedUser?.username}
        />
      </Modal>
    </div>
  );
}

export default UsersManagementContent;
