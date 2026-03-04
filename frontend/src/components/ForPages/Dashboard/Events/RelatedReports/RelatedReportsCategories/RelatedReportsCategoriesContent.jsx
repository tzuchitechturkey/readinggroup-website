import React, { useState, useEffect } from "react";

import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

import Modal from "@/components/Global/Modal/Modal";
import DeleteConfirmation from "@/components/Global/DeleteConfirmation/DeleteConfirmation";
import Loader from "@/components/Global/Loader/Loader";
import { setErrorFn } from "@/Utility/Global/setErrorFn";
import CustomBreadcrumb from "@/components/ForPages/Dashboard/CustomBreadcrumb/CustomBreadcrumb";
import DashboardSectionHeader from "@/components/ForPages/Dashboard/DashboardSectionHeader/DashboardSectionHeader";
import {
  DeleteRelatedReportCategoryById,
  GetRelatedReportCategories,
} from "@/api/relatedReports";

import CreateOrEditRelatedReportsCategory from "./CreateOrEditRelatedReportsCategory/CreateOrEditRelatedReportsCategory";
import RelatedReportsCategoriesTable from "./RelatedReportsCategoriesTable/RelatedReportsCategoriesTable";

function RelatedReportsCategoriesContent({ onSectionChange }) {
  const { t, i18n } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [showCreateEditModal, setShowCreateEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [totalRecords, setTotalRecords] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const limit = 10;
  const [originalCategories, setOriginalCategories] = useState([]);
  const [form, setForm] = useState({
    name: "",
    description: "",
    is_active: false,
    report_count: 0,
  });
  const [originalForm, setOriginalForm] = useState({
    name: "",
    description: "",
  });
  const [selectedLanguage, setSelectedLanguage] = useState(null);
  const [originalLanguage, setOriginalLanguage] = useState(null);
  const [isAutoTranslated, setIsAutoTranslated] = useState(false);
  const [update, setUpdate] = useState(0);

  const getCategoriesData = async (page, searchValue = searchTerm) => {
    setIsLoading(true);
    const offset = page * 10;
    try {
      const res = searchValue
        ? await GetRelatedReportCategories(limit, offset, searchValue)
        : await GetRelatedReportCategories(limit, offset);

      setCategories(res?.data?.results || []);
      setOriginalCategories(res?.data?.results || []);
      setTotalRecords(res?.data?.count || 0);
    } catch (error) {
      setErrorFn(error, t);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (category) => {
    setSelectedCategory(category);
    setForm({
      title: category.title || "",
      description: category.description || "",
      is_active: category.is_active || false,
      report_count: category.report_count || 0,
    });
    setOriginalForm({
      title: category.title || "",
      description: category.description || "",
    });
    setShowCreateEditModal(true);
  };

  const handleAdd = () => {
    setSelectedCategory(null);
    setForm({
      title: "",
      description: "",
      is_active: false,
      report_count: 0,
    });
    setOriginalForm({
      title: "",
      description: "",
    });
    setShowCreateEditModal(true);
  };

  const handleDelete = (category) => {
    setSelectedCategory(category);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    setIsLoading(true);
    try {
      await DeleteRelatedReportCategoryById(selectedCategory.id);
      toast.success(t("Category deleted successfully"));
      setUpdate(update + 1);
      setShowDeleteModal(false);
      setSelectedCategory(null);
    } catch (error) {
      setErrorFn(error, t);
    } finally {
      setIsLoading(false);
    }
  };

  const clearSearch = () => {
    setSearchTerm("");
    getCategoriesData(0, "");
  };

  useEffect(() => {
    getCategoriesData(0);
  }, [update]);

  return (
    <div
      className="w-full min-h-screen bg-[#F5F7FB] px-3 relative text-[#1E1E1E] flex flex-col"
      dir={i18n?.language === "ar" ? "rtl" : "ltr"}
    >
      {isLoading && <Loader />}
      {/* Start Breadcrumb */}
      <CustomBreadcrumb
        backTitle={t("Back to Reports List")}
        onBack={() => {
          onSectionChange("relatedReportsList");
        }}
        page={t("Related Reports Categories")}
      />
      {/* End Breadcrumb */}
      {/* Header */}
      <DashboardSectionHeader
        t={t}
        title={t("Related Reports Categories")}
        subtitle={`${t("Total")}: ${totalRecords} ${t("categories")}`}
        onBack={() => onSectionChange("dashboard")}
        backTitle={t("Back to Dashboard")}
        onAdd={handleAdd}
        addText={t("Add Category")}
        onAddClick={handleAdd}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        getData={getCategoriesData}
      />

      {/* Categories Table */}
      <RelatedReportsCategoriesTable
        categories={categories}
        search={searchTerm}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onClearSearch={clearSearch}
        getCategoriesData={getCategoriesData}
      />

      <CreateOrEditRelatedReportsCategory
        showModal={showCreateEditModal}
        setShowModal={setShowCreateEditModal}
        t={t}
        originalForm={originalForm}
        selectedLanguage={selectedLanguage}
        originalLanguage={originalLanguage}
        form={form}
        isAutoTranslated={isAutoTranslated}
        setSelectedLanguage={setSelectedLanguage}
        setIsAutoTranslated={setIsAutoTranslated}
        setForm={setForm}
        setIsLoading={setIsLoading}
        setUpdate={setUpdate}
        selectedCategory={selectedCategory}
      />

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedCategory(null);
        }}
        title={t("Confirm Deletion")}
        width="500px"
      >
        <DeleteConfirmation
          isOpen={showDeleteModal}
          onClose={() => {
            setShowDeleteModal(false);
            setSelectedCategory(null);
          }}
          onConfirm={confirmDelete}
          title={t("Delete Category")}
          message={t(
            "Are you sure you want to delete this category? This action cannot be undone.",
          )}
          itemName={selectedCategory?.name}
        />
      </Modal>
    </div>
  );
}

export default RelatedReportsCategoriesContent;
