import React, { useState, useEffect } from "react";

import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

import Modal from "@/components/Global/Modal/Modal";
import DeleteConfirmation from "@/components/Global/DeleteConfirmation/DeleteConfirmation";
import Loader from "@/components/Global/Loader/Loader";
import { setErrorFn } from "@/Utility/Global/setErrorFn";
import CustomBreadcrumb from "@/components/ForPages/Dashboard/CustomBreadcrumb/CustomBreadcrumb";
import DashboardSectionHeader from "@/components/ForPages/Dashboard/DashboardSectionHeader/DashboardSectionHeader";
import { DeleteLearnCategory, GetLearnCategories } from "@/api/learn";

import CreateorEditLearnCategory from "./CreateorEditLearnCategory/CreateorEditPostCategory";
import LearnCategoriesTable from "./LearnCategoriesTable/LearnCategoriesTable";

function LearnCategoriesContent({ onSectionChange }) {
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
  const [hasChanges, setHasChanges] = useState(false);
  const [form, setForm] = useState({
    name: "",
    description: "",
    is_active: false,
    direction: "vertical",
    learn_type: "",
    post_count: 0,
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
        ? await GetLearnCategories(limit, offset, searchValue)
        : await GetLearnCategories(limit, offset);
      const results = res?.data?.results || [];
      setCategories(results);
      setOriginalCategories(JSON.parse(JSON.stringify(results)));
      setHasChanges(false);
      setTotalRecords(res?.data?.count || 0);
    } catch (err) {
      setErrorFn(err, t);
    } finally {
      setIsLoading(false);
    }
  };

  const openAddModal = () => {
    setSelectedLanguage(i18n?.language || "en");
    setOriginalLanguage(i18n?.language || "en");
    setForm({ name: "", description: "", is_active: false, post_count: 0 });
    setShowCreateEditModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedCategory?.id) return;
    setIsLoading(true);
    try {
      await DeleteLearnCategory(selectedCategory.id);
      toast.success(t("Category deleted"));
      setShowDeleteModal(false);
      setSelectedCategory(null);
      getCategoriesData(0);
    } catch (err) {
      console.error(err);
      toast.error(t("Delete failed"));
    } finally {
      setIsLoading(false);
    }
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
        backTitle={t("Back to Learn List")}
        onBack={() => {
          onSectionChange("learn");
        }}
        page={t("Learn Categories")}
      />
      {/* End Breadcrumb */}

      <div className="flex-1">
        {/* Start Header */}
        <DashboardSectionHeader
          title={t("Learn Categories")}
          subtitle={t("categories")}
          addText={t("Add Category")}
          totalRecords={totalRecords}
          onAddClick={openAddModal}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          getData={getCategoriesData}
          t={t}
          i18n={i18n}
        />
        {/* End Header */}

        {/* Start Table */}
        <LearnCategoriesTable
          t={t}
          i18n={i18n}
          categories={categories}
          setCategories={setCategories}
          setOriginalForm={setOriginalForm}
          setIsAutoTranslated={setIsAutoTranslated}
          setShowCreateEditModal={setShowCreateEditModal}
          setSelectedLanguage={setSelectedLanguage}
          setOriginalLanguage={setOriginalLanguage}
          setForm={setForm}
          totalRecords={totalRecords}
          originalCategories={originalCategories}
          setOriginalCategories={setOriginalCategories}
          hasChanges={hasChanges}
          setErrorFn={setErrorFn}
          getCategoriesData={getCategoriesData}
          setHasChanges={setHasChanges}
          setSelectedCategory={setSelectedCategory}
          setShowDeleteModal={setShowDeleteModal} 
        />
        {/* End Table */}

        {/* Create / Edit Modal */}
        <CreateorEditLearnCategory
          showModal={showCreateEditModal}
          setShowModal={setShowCreateEditModal}
          t={t}
          selectedLanguage={selectedLanguage}
          originalLanguage={originalLanguage}
          form={form}
          originalForm={originalForm}
          isAutoTranslated={isAutoTranslated}
          setSelectedLanguage={setSelectedLanguage}
          setIsAutoTranslated={setIsAutoTranslated}
          setForm={setForm}
          setIsLoading={setIsLoading}
          setUpdate={setUpdate}
        />
        {/* Delete Confirmation */}
        <Modal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          title={t("Confirm Deletion")}
          width="500px"
        >
          <DeleteConfirmation
            isOpen={showDeleteModal}
            onClose={() => setShowDeleteModal(false)}
            onConfirm={handleConfirmDelete}
            title={t("Delete Category")}
            message={t(
              "Are you sure you want to delete this category? This action cannot be undone.",
            )}
            itemName={selectedCategory?.name}
          />
        </Modal>
      </div>
    </div>
  );
}

export default LearnCategoriesContent;
