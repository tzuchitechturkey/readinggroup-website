import React from "react";

import Loader from "@/components/Global/Loader/Loader";
import { useCreateOrEditLearn } from "@/hooks/learn/useLearnForm";
import CustomBreadcrumb from "@/components/ForPages/Dashboard/CustomBreadcrumb/CustomBreadcrumb";

import ImageUploadSection from "./ImageUploadSection";
import BasicDetailsSection from "./BasicDetailsSection";
import FormActionsSection from "./FormActionsSection";

function CreateOrEditLearn({ onSectionChange, learn = null }) {
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
    // Refs
    categoryDropdownRef,
    // Handlers
    handleInputChange,
    handleImageUpload,
    handleCategorySelect,
    handleSubmit,
    // API Functions
    getCategories,
    i18n,
  } = useCreateOrEditLearn(learn, onSectionChange);
  // Handler for learn type change (resets writer selection)
  const handleLearnTypeChange = (e) => {
    handleInputChange(e);
  };

  // Handler for category search clear
  const handleCategoryClearSearch = () => {
    setCategorySearchValue("");
    getCategories("");
  };

  return (
    <div
      className="bg-white rounded-lg p-6 mx-4 overflow-y-auto"
      dir={i18n?.language === "ar" ? "rtl" : "ltr"}
    >
      {isLoading && <Loader />}

      {/* Breadcrumb */}
      <CustomBreadcrumb
        backTitle="Back to Learn List"
        onBack={() => {
          onSectionChange("learn");
        }}
        page={learn ? "Edit Learn" : "Create New Learn"}
      />

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Image Upload Section */}
        <ImageUploadSection
          formData={formData}
          errors={errors}
          imageFile={null}
          onImageUpload={handleImageUpload}
          onImageUrlChange={handleInputChange}
        />

        {/* Basic Details Section */}
        <BasicDetailsSection
          formData={formData}
          errors={errors}
          onInputChange={handleInputChange}
          onLearnTypeChange={handleLearnTypeChange}
          showCategoryDropdown={showCategoryDropdown}
          setShowCategoryDropdown={setShowCategoryDropdown}
          categoriesList={categoriesList}
          categorySearchValue={categorySearchValue}
          setCategorySearchValue={setCategorySearchValue}
          getCategories={getCategories}
          handleCategoryClearSearch={handleCategoryClearSearch}
          handleCategorySelect={handleCategorySelect}
          categoryDropdownRef={categoryDropdownRef}
        />

        {/* Form Actions */}
        <FormActionsSection
          isLoading={isLoading}
          hasChanges={hasChanges}
          learn={learn}
          onCancel={() => onSectionChange("learn")}
          onSubmit={handleSubmit}
        />
      </form>
    </div>
  );
}

export default CreateOrEditLearn;
