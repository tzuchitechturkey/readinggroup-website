import React from "react";

import Modal from "@/components/Global/Modal/Modal";
import DeleteConfirmation from "@/components/Global/DeleteConfirmation/DeleteConfirmation";
import Loader from "@/components/Global/Loader/Loader";
import CustomBreadcrumb from "@/components/ForPages/Dashboard/CustomBreadcrumb/CustomBreadcrumb";
import { useEventCategories } from "@/components/ForPages/Dashboard/_common/hooks/useEventCategories";

import EventCategoriesHeader from "./EventCategoriesHeader/EventCategoriesHeader";
import EventCategoriesTable from "./EventCategoriesTable/EventCategoriesTable";
import CreateorEditEventCategory from "./CreateorEditEventCategory/CreateorEditEventCategory";
import SortOrderSection from "./SortOrderSection/SortOrderSection";

function EventCategoriesContent({ onSectionChange }) {
  const {
    isLoading,
    categories,
    showModal,
    setShowModal,
    editingCategory,
    showDeleteModal,
    setShowDeleteModal,
    selectedCategory,
    setSelectedCategory,
    totalRecords,
    searchTerm,
    setSearchTerm,
    form,
    errors,
    currentPage,
    draggedItem,
    isSorting,
    hasChanges,
    totalPages,
    getCategoriesData,
    handlePageChange,
    openAddModal,
    openEditModal,
    handleInputChange,
    handleToggle,
    handleDragStart,
    handleDragOver,
    handleDrop,
    handleDragEnd,
    handleSaveOrder,
    handleCancelOrder,
    handleSubmit,
    handleConfirmDelete,
    handleStatusToggle,
    i18n,
    t,
    TOGGLE_FIELDS,
  } = useEventCategories();

  const handleDelete = (category) => {
    setSelectedCategory(category);
    setShowDeleteModal(true);
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
    getCategoriesData(0, value);
  };

  return (
    <div
      className="w-full min-h-screen bg-[#F5F7FB] px-3 relative text-[#1E1E1E] flex flex-col"
      dir={i18n?.language === "ar" ? "rtl" : "ltr"}
    >
      {isLoading && <Loader />}

      {/* Breadcrumb */}
      <CustomBreadcrumb
        backTitle={t("Back to LiveStream List")}
        onBack={() => {
          onSectionChange("liveStreamSchedules");
        }}
        page={t(" LiveStream Categories")}
      />

      <div className="flex-1">
        {/* Header Section */}
        <EventCategoriesHeader
          totalRecords={totalRecords}
          searchTerm={searchTerm}
          onAddClick={openAddModal}
          onSearchChange={setSearchTerm}
          onSearch={handleSearch}
          i18n={i18n}
          t={t}
        />

        {/* Categories Table */}
        <EventCategoriesTable
          categories={categories}
          draggedItem={draggedItem}
          isSorting={isSorting}
          totalPages={totalPages}
          currentPage={currentPage}
          i18n={i18n}
          t={t}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onDragEnd={handleDragEnd}
          onEdit={openEditModal}
          onDelete={handleDelete}
          onStatusToggle={handleStatusToggle}
          onPageChange={handlePageChange}
        />

        {/* Sort Order Section */}
        <SortOrderSection
          hasChanges={hasChanges}
          isSorting={isSorting}
          onCancel={handleCancelOrder}
          onSave={handleSaveOrder}
        />

        {/* Category Form Modal */}
        <CreateorEditEventCategory
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          isEditing={Boolean(editingCategory?.id)}
          form={form}
          errors={errors}
          toggleFields={form?.id ? TOGGLE_FIELDS : []}
          onInputChange={handleInputChange}
          onToggle={handleToggle}
          onSubmit={handleSubmit}
        />

        {/* Delete Confirmation Modal */}
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

export default EventCategoriesContent;
