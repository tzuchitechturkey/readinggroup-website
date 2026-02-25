import React from "react";

import { useTranslation } from "react-i18next";

import CustomBreadcrumb from "@/components/ForPages/Dashboard/CustomBreadcrumb/CustomBreadcrumb";
import { useCreateOrEditVideo } from "@/hooks/video/useVideoForm";

import { ThumbnailSection } from "./VideoForm/ThumbnailSection";
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
    imagePreview,
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
    handleThumbnailUpload,
    handleFetchYouTubeInfo,
    handleSubmit,
    getCategories,
    handleConfirmAttachments,
    handleRemoveAttachment,
    handlePreviewFile,
    handleClosePreview,
  } = useCreateOrEditVideo(video, onSectionChange);

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
        {/* Thumbnail Section */}
        <div>
          <div className="px-4 py-3 bg-blue-50 border-b border-blue-100">
            <p className="text-xs md:text-sm text-blue-800">
              <strong>{t("Important")}:</strong>{" "}
              {t(
                "Please select an image with minimum dimensions of 300x200 pixels for best quality.",
              )}
            </p>
            <p className="text-xs text-blue-600 mt-1">
              {t("Supported formats")}: PNG, WEBP, JPG, JPEG, HEIC
            </p>
          </div>
          <div className="mt-4">
            <ThumbnailSection
              imagePreview={imagePreview}
              onUpload={handleThumbnailUpload}
              error={errors?.thumbnail}
            />
          </div>
        </div>

        {/* Thumbnail URL Alternative */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t("Thumbnail URL")} ({t("Alternative to file upload")})
          </label>
          <input
            name="thumbnail_url"
            value={formData?.thumbnail_url}
            onChange={handleInputChange}
            placeholder={t("Enter thumbnail URL as alternative to file upload")}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-xs text-gray-500 mt-1">
            {t("You can either upload a file above or provide a URL here")}
          </p>
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
            {/* Tags */}
            {/* <TagsSection
              tags={formData?.tags}
              tagInput={tagInput}
              onTagInputChange={setTagInput}
              onTagInputKeyPress={handleTagsInput}
              onTagRemove={removeTag}
              error={errors?.tags}
            /> */}
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
              target: { name: "body", value: data },
            });
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
