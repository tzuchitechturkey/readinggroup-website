import React from "react";

import { useTranslation } from "react-i18next";

import CustomBreadcrumb from "@/components/ForPages/Dashboard/CustomBreadcrumb/CustomBreadcrumb";
import { useCreateOrEditVideo } from "@/hooks/video/useVideoForm";
import ImageUploadSection from "@/components/ForPages/Dashboard/Events/RelatedReports/CreateOrEditRelatedReports/ImageUploadSection";

import { BasicDetailsSection } from "./VideoForm/BasicDetailsSection";
import { VideoUrlAndDateSection } from "./VideoForm/VideoUrlAndDateSection";
import { CastSection } from "./VideoForm/CastSection";
import { LanguageAndStatusSection } from "./VideoForm/LanguageAndStatusSection";
import { DescriptionSection } from "./VideoForm/DescriptionSection";
import { AdditionalInfoSection } from "./VideoForm/AdditionalInfoSection";
import { FormActionsSection } from "./VideoForm/FormActionsSection";
import AttachmentsModal from "../../Contents/CreateOrEditContent/ContentForm/AttachmentsModal";
import {
  AttachmentsSection,
  FilePreviewModal,
} from "../../Contents/CreateOrEditContent/ContentForm";

function CreateOrEditVideo({ onSectionChange, video = null }) {
  const { t, i18n } = useTranslation();

  const {
    formData,
    hasChanges,
    errors,
    previewFile,
    previewUrl,
    guestSpeakersInput,
    showAttachmentsModal,
    setShowAttachmentsModal,
    setGuestSpeakersInput,
    showCategoryDropdown,
    setShowCategoryDropdown,
    categoriesList,
    categorySearchValue,
    setCategorySearchValue,
    categoryDropdownRef,
    isLoading,
    isFetchingYoutube,
    handleInputChange,
    handleCategorySelect,
    handleGuestSpeakersInput,
    removeGuestSpeaker,
    handleFetchYouTubeInfo,
    handleSubmit,
    getCategories,
    handleConfirmAttachments,
    handleRemoveAttachment,
    handlePreviewFile,
    handleClosePreview,
  } = useCreateOrEditVideo(video, onSectionChange);
  // console.log("Form Data:", formData); // Debugging line to check form data
  return (
    <div
      className="bg-white rounded-lg p-3 lg:p-6 w-full mx-4 overflow-y-auto"
      dir={i18n?.language === "ar" ? "rtl" : "ltr"}
    >
      {/* Breadcrumb */}
      <CustomBreadcrumb
        backTitle={t("Back to Video List")}
        onBack={() => onSectionChange("videos")}
        page={video ? t("Edit Video") : t("Create New Video")}
      />

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Thumbnail URL Section */}
        <ImageUploadSection formData={formData} t={t} />
        {/* End Thumbnail URL Section */}
        {/* Start Attachments Section */}
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
        {/* Two Column Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-4">
            {/* Basic Details */}
            <BasicDetailsSection
              formData={formData}
              categoriesList={categoriesList}
              categorySearchValue={categorySearchValue}
              showCategoryDropdown={showCategoryDropdown}
              categoryDropdownRef={categoryDropdownRef}
              onInputChange={handleInputChange}
              onCategorySelect={handleCategorySelect}
              onCategorySearch={(val) => {
                setCategorySearchValue(val);
                getCategories(val);
              }}
              onCategoryDropdownToggle={setShowCategoryDropdown}
              errors={errors}
            />
            {/* Start Guest Speakers */}
            <CastSection
              guestSpeakers={formData?.guest_speakers}
              guestSpeakersInput={guestSpeakersInput}
              onGuestSpeakersInputChange={setGuestSpeakersInput}
              onGuestSpeakersInputKeyPress={handleGuestSpeakersInput}
              onGuestSpeakersRemove={removeGuestSpeaker}
              error={errors?.guest_speakers}
            />
            {/* End Guest Speakers */}
          </div>

          {/* Right Column */}
          <div className="space-y-4 ">
            {/* Video URL and Date */}
            <VideoUrlAndDateSection
              formData={formData}
              onInputChange={handleInputChange}
              onFetchYouTube={handleFetchYouTubeInfo}
              isFetchingYoutube={isFetchingYoutube}
              errors={errors}
            />

            {/* Language and Status */}
            <div className="">
              <LanguageAndStatusSection
                formData={formData}
                onInputChange={handleInputChange}
                errors={errors}
              />
            </div>
          </div>
        </div>

        {/* Description - Full Width */}
        <DescriptionSection
          formData={formData}
          onBodyChange={(data) => {
            handleInputChange({
              target: { name: "description", value: data },
            });
            // setErrors((prev) => ({ ...prev, des: "" })); // Clear error on change
          }}
          onBodyBlur={() => {
            // No need to do anything on blur, onChange already handles updates
          }}
          error={errors?.description}
        />

        {/* Additional Info */}
        {(formData?.reference_code ||
          formData?.duration ||
          formData?.is_featured !== false) && (
          <AdditionalInfoSection
            formData={formData}
            onInputChange={handleInputChange}
          />
        )}

        {/* Form Actions */}
        <FormActionsSection
          isLoading={isLoading}
          hasChanges={hasChanges}
          onSubmit={handleSubmit}
          onCancel={() => onSectionChange("videos")}
          isEditMode={Boolean(video)}
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

export default CreateOrEditVideo;
