import React from "react";

import { useTranslation } from "react-i18next";

import Loader from "@/components/Global/Loader/Loader";
import { useCreateOrEditLearn } from "@/components/ForPages/Dashboard/_common/hooks/Content/useLearnForm";
import CustomBreadcrumb from "@/components/ForPages/Dashboard/CustomBreadcrumb/CustomBreadcrumb";

import ImageUploadSection from "./components/ImageUploadSection";
import BasicDetailsSection from "./components/BasicDetailsSection";
import FormActionsSection from "./components/FormActionsSection";

function CreateOrEditLearn({ onSectionChange, learn = null }) {
  const {
    // Form state
    formData,
    setFormData,
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
    t,
    i18n,
  } = useCreateOrEditLearn(learn, onSectionChange);

  // Handler for learn type change (resets writer selection)
  const handleLearnTypeChange = (e) => {
    handleInputChange(e);
    setFormData((prev) => ({
      ...prev,
      writer: "",
    }));
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
