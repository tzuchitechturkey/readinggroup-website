import React from "react";

import { useTranslation } from "react-i18next";

import Loader from "@/components/Global/Loader/Loader";
import countries from "@/constants/countries.json";
import { languages, postStatusOptions } from "@/constants/constants";
import { useCreateOrEditContent } from "@/components/ForPages/Dashboard/_common/hooks/Content/useContentForm";
import CustomBreadcrumb from "@/components/ForPages/Dashboard/CustomBreadcrumb/CustomBreadcrumb";

import AttachmentsModal from "./ContentForm/AttachmentsModal";
import {
  BasicDetailsSection,
  SelectFieldsSection,
  WriterSelectionDropdown,
  CategorySelectionDropdown,
  TagsSection,
  ImagesUploadSection,
  AttachmentsSection,
  BodyContentSection,
  MetadataSection,
  FormActionsSection,
  FilePreviewModal,
} from "./ContentForm";

function CreateOrEditContent({ onSectionChange, content = null }) {
  const { t } = useTranslation();
  const {
    formData,
    setFormData,
    errors,
    setErrors,
    tagInput,
    setTagInput,
    imageUrlsInput,
    setImageUrlsInput,
    imagePreviews,
    previewFile,
    previewUrl,
    showAttachmentsModal,
    setShowAttachmentsModal,
    showWriterDropdown,
    setShowWriterDropdown,
    showCategoryDropdown,
    setShowCategoryDropdown,
    writersList,
    categoriesList,
    writerSearchValue,
    setWriterSearchValue,
    categorySearchValue,
    setCategorySearchValue,
    isLoading,
    writerDropdownRef,
    categoryDropdownRef,
    handleMultipleImageUpload,
    handleRemoveImagePreview,
    handleRemoveExistingImage,
    handleAddImageUrl,
    handleRemoveImageUrl,
    handlePreviewFile,
    handleClosePreview,
    handleWriterSelect,
    handleWriterSearch,
    handleClearWriterSearch,
    handleCategorySelect,
    handleTagInput,
    removeTag,
    handleConfirmAttachments,
    handleRemoveAttachment,
    handleInputChange,
    handleSubmit,
    getCategories,
    i18n,
    hasChanges,
  } = useCreateOrEditContent(content, onSectionChange);

  if (isLoading && !content) return <Loader />;

  return (
    <div className="space-y-6">
      <CustomBreadcrumb
        breadcrumbs={[
          { label: t("Dashboard"), href: "#" },
          {
            label: content ? t("Edit Content") : t("Create Content"),
            href: "#",
          },
        ]}
      />

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow">
        {/* Basic Details */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            {t("Basic Details")}
          </h2>
          <BasicDetailsSection
            t={t}
            formData={formData}
            errors={errors}
            handleInputChange={handleInputChange}
            postStatusOptions={postStatusOptions}
          />
        </div>

        {/* Select Fields */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            {t("Content Information")}
          </h2>
          <div className="space-y-4">
            <SelectFieldsSection
              t={t}
              formData={formData}
              errors={errors}
              handleInputChange={handleInputChange}
              languages={languages}
              countries={countries}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <WriterSelectionDropdown
                t={t}
                i18n={i18n}
                formData={formData}
                showWriterDropdown={showWriterDropdown}
                setShowWriterDropdown={setShowWriterDropdown}
                writersList={writersList}
                writerSearchValue={writerSearchValue}
                setWriterSearchValue={setWriterSearchValue}
                handleWriterSelect={handleWriterSelect}
                handleWriterSearch={handleWriterSearch}
                handleClearWriterSearch={handleClearWriterSearch}
                errors={errors}
                writerDropdownRef={writerDropdownRef}
              />

              <CategorySelectionDropdown
                t={t}
                i18n={i18n}
                formData={formData}
                showCategoryDropdown={showCategoryDropdown}
                setShowCategoryDropdown={setShowCategoryDropdown}
                categoriesList={categoriesList}
                categorySearchValue={categorySearchValue}
                setCategorySearchValue={setCategorySearchValue}
                handleCategorySelect={handleCategorySelect}
                getCategories={getCategories}
                errors={errors}
                categoryDropdownRef={categoryDropdownRef}
              />
            </div>
          </div>
        </div>

        {/* Tags Section */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            {t("Tags")}
          </h2>
          <TagsSection
            t={t}
            formData={formData}
            errors={errors}
            tagInput={tagInput}
            setTagInput={setTagInput}
            handleTagInput={handleTagInput}
            removeTag={removeTag}
          />
        </div>

        {/* Images Upload Section */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            {t("Images")}
          </h2>
          <ImagesUploadSection
            t={t}
            imagePreviews={imagePreviews}
            imageUrlsInput={imageUrlsInput}
            setImageUrlsInput={setImageUrlsInput}
            errors={errors}
            formData={formData}
            handleMultipleImageUpload={handleMultipleImageUpload}
            handleRemoveImagePreview={handleRemoveImagePreview}
            handleRemoveExistingImage={handleRemoveExistingImage}
            handleAddImageUrl={handleAddImageUrl}
            handleRemoveImageUrl={handleRemoveImageUrl}
          />
        </div>

        {/* Attachments Section */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            {t("Attachments")}
          </h2>
          <AttachmentsSection
            t={t}
            formData={formData}
            setShowAttachmentsModal={setShowAttachmentsModal}
            handleRemoveAttachment={handleRemoveAttachment}
            handlePreviewFile={handlePreviewFile}
          />
        </div>

        {/* Body Content */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            {t("Content")}
          </h2>
          <BodyContentSection
            t={t}
            i18n={i18n}
            formData={formData}
            setFormData={setFormData}
            errors={errors}
            setErrors={setErrors}
          />
        </div>

        {/* Metadata */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            {t("Metadata")}
          </h2>
          <MetadataSection
            t={t}
            formData={formData}
            handleInputChange={handleInputChange}
          />
        </div>

        {/* Form Actions */}
        <FormActionsSection
          t={t}
          content={content}
          hasChanges={hasChanges}
          isLoading={isLoading}
          onCancel={() => onSectionChange("contents")}
          handleSubmit={handleSubmit}
        />
      </form>

      {/* File Preview Modal */}
      <FilePreviewModal
        isOpen={Boolean(previewFile) && Boolean(previewUrl)}
        previewFile={previewFile}
        previewUrl={previewUrl}
        t={t}
        handleClosePreview={handleClosePreview}
      />

      {/* Attachments Modal */}
      <AttachmentsModal
        isOpen={showAttachmentsModal}
        onClose={() => setShowAttachmentsModal(false)}
        selectedAttachments={formData.attachments}
        onConfirm={handleConfirmAttachments}
      />
    </div>
  );
}

export default CreateOrEditContent;
