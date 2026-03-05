import React, { useState, useEffect } from "react";

import { useTranslation } from "react-i18next";

import Modal from "@/components/Global/Modal/Modal";
import DeleteConfirmation from "@/components/Global/DeleteConfirmation/DeleteConfirmation";
import Loader from "@/components/Global/Loader/Loader";
import DashboardSectionHeader from "@/components/ForPages/Dashboard/DashboardSectionHeader/DashboardSectionHeader";
import PagePagination from "@/components/Global/PagePagination/PagePagination";
import { useRelatedReportsData } from "@/hooks/relatedReports/useRelatedReportsData";
import { useSorting } from "@/hooks/useSorting";
import { usePagination } from "@/hooks/usePagination";

import RelatedReportsDetails from "./RelatedReportsDetails/RelatedReportsDetails";
import RelatedReportsTable from "./RelatedReportsTable";

function RelatedReportsList({ onSectionChange }) {
  const { t } = useTranslation();

  // Custom hooks
  const {
    isLoading,
    reportsData,
    totalRecords,
    update,
    getReportsData,
    handleDeleteReport,
  } = useRelatedReportsData();

  const { sortData, getSortedData, sortConfig } = useSorting(reportsData);
  const { currentPage, handlePageChange, resetPage, getPaginationInfo } =
    usePagination(10);

  // Local state
  const [selectedReport, setSelectedReport] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [search, setSearch] = useState("");

  // Functions
  const fetchData = (page = 0) => {
    getReportsData(page, search);
  };

  const clearSearch = () => {
    setSearch("");
    resetPage();
    getReportsData(0, "");
  };

  const handlePageChangeWithFetch = (newPage) => {
    handlePageChange(newPage, fetchData);
  };

  const handleView = (report) => {
    setSelectedReport(report);
    setShowDetailsModal(true);
  };

  const handleEdit = (report) => {
    setSelectedReport(report);
    console.log(report);
    onSectionChange("createOrEditRelatedReports", report);
  };

  const handleDeleteClick = (report) => {
    setSelectedReport(report);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    const success = await handleDeleteReport(selectedReport?.id);
    if (success) {
      setShowDeleteModal(false);
      setSelectedReport(null);
    }
  };

  // Effects
  useEffect(() => {
    fetchData(currentPage - 1);
  }, [update]);

  // Computed values
  const sortedData = getSortedData(reportsData);
  const paginationInfo = getPaginationInfo(totalRecords);

  return (
    <div className="bg-white rounded-lg border border-gray-200 pt-3 px-3">
      {isLoading && <Loader />}

      {/* Header */}
      <DashboardSectionHeader
        t={t}
        title={t("Related Reports List")}
        subtitle={`${t("Total")}: ${totalRecords} ${t("reports")}`}
        onBack={() => onSectionChange("dashboard")}
        backTitle={t("Back to Dashboard")}
        onAdd={() => onSectionChange("createOrEditRelatedReports", null)}
        addText={t("Add New Report")}
        onAddClick={() => onSectionChange("createOrEditRelatedReports", null)}
        searchTerm={search}
        setSearchTerm={setSearch}
        getData={fetchData}
      />

      {/* Table */}
      <RelatedReportsTable
        reportsData={sortedData}
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

      {/* Report Details Modal */}
      <Modal
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        title={t("Report Details")}
        width="800px"
      >
        <RelatedReportsDetails
          report={selectedReport}
          onClose={() => setShowDetailsModal(false)}
          onEdit={() => {
            onSectionChange("createOrEditRelatedReports", selectedReport);
          }}
        />
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => {
          setSelectedReport(null);
          setShowDeleteModal(false);
        }}
        title={t("Confirm Deletion")}
        width="500px"
      >
        <DeleteConfirmation
          isOpen={showDeleteModal}
          onClose={() => {
            setSelectedReport(null);
            setShowDeleteModal(false);
          }}
          onConfirm={handleConfirmDelete}
          title={t("Delete Related Report")}
          message={t(
            "Are you sure you want to delete this Related Report? This action cannot be undone.",
          )}
          itemName={selectedReport?.title}
        />
      </Modal>
    </div>
  );
}

export default RelatedReportsList;
