import React from "react";

import { useTranslation } from "react-i18next";

import Loader from "@/components/Global/Loader/Loader";
import CustomBreadcrumb from "@/components/ForPages/Dashboard/CustomBreadcrumb/CustomBreadcrumb";
import { useEventForm } from "@/components/ForPages/Dashboard/_common/hooks/useEventForm";

import {
  ImageSection,
  BasicDetailsSection,
  CategorySection,
  LocationLanguageStatusSection,
  DateAndLinkSection,
  FormActionsSection,
} from "./EventForm";

const CreateOrEditEvent = ({ onSectionChange, event = null }) => {
  const { t } = useTranslation();
  const {
    formData,
    errors,
    imagePreview,
    isLoading,
    showCategoryDropdown,
    setShowCategoryDropdown,
    categoriesList,
    categorySearchValue,
    setCategorySearchValue,
    categoryDropdownRef,
    handleInputChange,
    handleCategorySelect,
    handleThumbnailUpload,
    handleSubmit,
    resetForm,
    getCategories,
  } = useEventForm(event, onSectionChange);

  const handleCancel = () => {
    resetForm();
    onSectionChange("events");
  };

  return (
    <div className="bg-white rounded-lg p-3">
      {isLoading && <Loader />}

      {/* Breadcrumb */}
      <CustomBreadcrumb
        backTitle={t("Back to Events List")}
        onBack={() => onSectionChange("events")}
        page={event?.id ? t("Edit Event") : t("Create New Event")}
      />

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Image Section */}
        <ImageSection
          imagePreview={imagePreview}
          onFileChange={handleThumbnailUpload}
          imageUrl={formData.image_url}
          onImageUrlChange={(e) =>
            handleInputChange({
              target: { name: "image_url", value: e.target.value },
            })
          }
          errors={errors}
        />

        {/* Basic Details Section */}
        <BasicDetailsSection
          title={formData.title}
          reportType={formData.report_type}
          onTitleChange={(value) =>
            handleInputChange({
              target: { name: "title", value },
            })
          }
          onReportTypeChange={(value) =>
            handleInputChange({
              target: { name: "report_type", value },
            })
          }
          errors={errors}
        />

        {/* Category Section */}
        <CategorySection
          category={formData.category}
          categoriesList={categoriesList}
          showDropdown={showCategoryDropdown}
          onShowDropdown={setShowCategoryDropdown}
          searchValue={categorySearchValue}
          onSearchChange={setCategorySearchValue}
          onCategorySelect={handleCategorySelect}
          onSearchSubmit={() => getCategories(categorySearchValue)}
          dropdownRef={categoryDropdownRef}
          errors={errors}
        />

        {/* Location, Language & Status Section */}
        <LocationLanguageStatusSection
          country={formData.country}
          language={formData.language}
          status={formData.status}
          onCountryChange={(value) =>
            handleInputChange({
              target: { name: "country", value },
            })
          }
          onLanguageChange={(value) =>
            handleInputChange({
              target: { name: "language", value },
            })
          }
          onStatusChange={(value) =>
            handleInputChange({
              target: { name: "status", value },
            })
          }
          errors={errors}
        />

        {/* Date & Link Section */}
        <DateAndLinkSection
          happenedAt={formData.happened_at}
          externalLink={formData.external_link}
          onDateChange={(date) =>
            handleInputChange({
              target: { name: "happened_at", value: date },
            })
          }
          onLinkChange={(value) =>
            handleInputChange({
              target: { name: "external_link", value },
            })
          }
          errors={errors}
        />

        {/* Form Actions Section */}
        <FormActionsSection
          isLoading={isLoading}
          isEditing={Boolean(event?.id)}
          onCancel={handleCancel}
          onSubmit={handleSubmit}
        />
      </form>
    </div>
  );
};

export default CreateOrEditEvent;
