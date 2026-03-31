import React, { useState, useEffect } from "react";

import { useTranslation } from "react-i18next";

import Modal from "@/components/Global/Modal/Modal";
import DeleteConfirmation from "@/components/Global/DeleteConfirmation/DeleteConfirmation";
import Loader from "@/components/Global/Loader/Loader";
import DashboardSectionHeader from "@/components/ForPages/Dashboard/DashboardSectionHeader/DashboardSectionHeader";
import PagePagination from "@/components/Global/PagePagination/PagePagination";
import { useGroupData } from "@/hooks/group/useGroupData";
import { useSorting } from "@/hooks/useSorting";
import { usePagination } from "@/hooks/usePagination";

import GroupsTable from "./GroupsTable";
import CreateOrEditGroup from "./CreateOrEditGroup";

function GroupssManagementContent({ onSectionChange }) {
  const { t } = useTranslation();

  // Custom hooks
  const {
    isLoading,
    groupData,
    totalRecords,
    update,
    getGroupData,
    handleDeleteGroup,
  } = useGroupData();

  const { sortData, getSortedData, sortConfig } = useSorting(groupData);
  const { currentPage, handlePageChange, resetPage, getPaginationInfo } =
    usePagination(10);

  // Local state
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showCreateEditModal, setShowCreateEditModal] = useState(false);
  const [search, setSearch] = useState("");

  // Functions
  const fetchData = (page = 0) => {
    getGroupData(page, search);
  };

  const clearSearch = () => {
    setSearch("");
    resetPage();
    getGroupData(0, "");
  };

  const handlePageChangeWithFetch = (newPage) => {
    handlePageChange(newPage, fetchData);
  };

  const handleEdit = (group) => {
    setSelectedGroup(group);
    setShowCreateEditModal(true);
  };

  const handleCreate = () => {
    setSelectedGroup(null);
    setShowCreateEditModal(true);
  };

  const handleCreateEditClose = (dataChanged) => {
    setShowCreateEditModal(false);
    setSelectedGroup(null);
    if (dataChanged) {
      // Refresh data if something was changed
      fetchData(0);
      resetPage();
    }
  };

  const handleDeleteClick = (group) => {
    setSelectedGroup(group);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    const success = await handleDeleteGroup(selectedGroup?.id);
    if (success) {
      setShowDeleteModal(false);
      setSelectedGroup(null);
    }
  };

  // Effects
  useEffect(() => {
    fetchData(currentPage - 1);
  }, [update]);

  // Computed values
  const sortedData = getSortedData(groupData);
  const paginationInfo = getPaginationInfo(totalRecords);

  return (
    <div className="bg-white rounded-lg border border-gray-200 pt-3 px-3">
      {isLoading && <Loader />}

      {/* Header */}
      <DashboardSectionHeader
        t={t}
        title={t("Groups List")}
        subtitle={t("groups")}
        totalRecords={totalRecords}
        onAddClick={handleCreate}
        addText={t("Add New")}
        searchTerm={search}
        setSearchTerm={setSearch}
        getData={fetchData}
      />

      {/* Table */}
      <GroupsTable
        groupsData={sortedData}
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

      {/* Create/Edit Group Modal */}
      <Modal
        isOpen={showCreateEditModal}
        onClose={() => handleCreateEditClose(false)}
        title={selectedGroup?.id ? t("Edit Group") : t("Create New Group")}
        width="500px"
      >
        <CreateOrEditGroup
          group={selectedGroup}
          onClose={handleCreateEditClose}
        />
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => {
          setSelectedGroup(null);
          setShowDeleteModal(false);
        }}
        title={t("Confirm Deletion")}
        width="500px"
      >
        <DeleteConfirmation
          isOpen={showDeleteModal}
          onClose={() => {
            setSelectedGroup(null);
            setShowDeleteModal(false);
          }}
          onConfirm={handleConfirmDelete}
          title={t("Delete Group")}
          message={t(
            "Are you sure you want to delete this Group? This action cannot be undone.",
          )}
          itemName={selectedGroup?.name}
        />
      </Modal>
    </div>
  );
}

export default GroupssManagementContent;
