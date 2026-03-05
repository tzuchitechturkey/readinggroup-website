import React from "react";

import { X } from "lucide-react";

import Loader from "@/components/Global/Loader/Loader";
import { useCreateOrEditRelatedReports } from "@/hooks/relatedReports/useRelatedReportsForm";
import CustomBreadcrumb from "@/components/ForPages/Dashboard/CustomBreadcrumb/CustomBreadcrumb";

import ImageUploadSection from "./ImageUploadSection";
import BasicDetailsSection from "./BasicDetailsSection";
import FormActionsSection from "./FormActionsSection";

function CreateOrEditRelatedReports({ onSectionChange, report = null }) {
  const {
    // Form state
    formData,
    hasChanges,
    errors,
    // Dropdown state
    showCategoryDropdown,
    setShowCategoryDropdown,
    categoriesList,
    categorySearchValue,
    setCategorySearchValue,
    // Loading state
    isLoading,
    isFetchingYoutube,
    // Refs
    categoryDropdownRef,
    // Handlers
    handleInputChange,
    handleCategorySelect,
    handleFetchYouTubeInfo,
    handleSubmit,
    // API Functions
    getCategories,
    t,
  } = useCreateOrEditRelatedReports(report, onSectionChange);
  // Handler for category search clear
  const handleCategoryClearSearch = () => {
    setCategorySearchValue("");
    getCategories("");
  };

  return (
    <div className="bg-white rounded-lg p-6 mx-4 min-h-screen pb-10 overflow-y-auto">
      {isLoading && <Loader />}

      {/* Breadcrumb */}
      <CustomBreadcrumb
        backTitle={t("Back to Related Reports List")}
        onBack={() => {
          onSectionChange("relatedReportsList");
        }}
        page={report ? t("Edit Related Report") : t("Add New Related Report")}
      />

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Image Upload Section - Display only */}
        <ImageUploadSection formData={formData} t={t} />

        {/* Basic Details Section */}
        <BasicDetailsSection
          formData={formData}
          errors={errors}
          onInputChange={handleInputChange}
          showCategoryDropdown={showCategoryDropdown}
          setShowCategoryDropdown={setShowCategoryDropdown}
          categoriesList={categoriesList}
          categorySearchValue={categorySearchValue}
          setCategorySearchValue={setCategorySearchValue}
          categoryDropdownRef={categoryDropdownRef}
          onCategorySelect={handleCategorySelect}
          onCategoryClearSearch={handleCategoryClearSearch}
          onFetchYouTube={handleFetchYouTubeInfo}
          isFetchingYoutube={isFetchingYoutube}
          getCategories={getCategories}
          t={t}
        />

        {/* Form Actions */}
        <FormActionsSection
          hasChanges={hasChanges}
          isLoading={isLoading}
          isEdit={Boolean(report)}
          onCancel={() => onSectionChange("relatedReportsList")}
          t={t}
        />
      </form>
    </div>
  );
}

export default CreateOrEditRelatedReports;
