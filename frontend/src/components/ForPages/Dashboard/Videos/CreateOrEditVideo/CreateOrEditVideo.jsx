import React, { useState, useEffect } from "react";

import { Plus } from "lucide-react";
import { useTranslation } from "react-i18next";

import CustomBreadcrumb from "@/components/ForPages/Dashboard/CustomBreadcrumb/CustomBreadcrumb";
import { useCreateOrEditVideo } from "@/hooks/video/useVideoForm";

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
import VideoLanguageAccordion from "./VideoLanguageAccordion";
import ThumbnailPreview from "./VideoForm/ThumbnailPreview";

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Returns true when `video` is in VideoMultiLangSerializer format:
 *   { id: 5, ar: { ...videoFields }, en: { ...videoFields } }
 * rather than a plain VideoSerializer object.
 */
function isMultiLangFormat(video) {
  if (!video || typeof video !== "object") return false;
  return video.id !== undefined && !video.title && !video.video_url;
}

/**
 * Ensures data is always in VideoMultiLangSerializer format.
 * Handles both:
 *   - Already multilang: { id, ar: {...}, en: {...} }
 *   - Flat VideoSerializer: { id, title, language: "ar", ... }
 */
function normalizeToMultiLang(data) {
  if (!data) return null;
  if (isMultiLangFormat(data)) return data;
  // Flat format — wrap it using the language field
  const lang = data.language;
  if (!lang) return null;
  return { id: data.id, [lang]: { ...data } };
}

/**
 * Parse `{ id, ar: {...}, en: {...} }` into a stable array:
 *   [{ langCode: "ar", langData: {...} }, ...]
 * Base language (base_video == null) is sorted first.
 */
function parseMultiLangData(data) {
  if (!data) return [];
  const entries = [];
  for (const [key, value] of Object.entries(data)) {
    if (key === "id") continue;
    // Must be a plain object (not an array) that looks like a video record
    if (
      value === null ||
      typeof value !== "object" ||
      Array.isArray(value) ||
      !value.id ||
      !value.title
    )
      continue;
    entries.push({ langCode: key, langData: value });
  }
  // Base version first (base_video == null)
  return entries.sort((a, b) => {
    const aBase = a.langData.base_video == null;
    const bBase = b.langData.base_video == null;
    if (aBase && !bBase) return -1;
    if (!aBase && bBase) return 1;
    return 0;
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// MultiLangManager — shown after base creation or when editing
// ─────────────────────────────────────────────────────────────────────────────

function MultiLangManager({ multiLangData }) {
  const { t } = useTranslation();
  const baseVideoId = multiLangData?.id;

  const [languages, setLanguages] = useState(() =>
    parseMultiLangData(multiLangData),
  );
  const [showAddNew, setShowAddNew] = useState(false);
  // Incremented each time we open a new-language form → signals existing accordions to close
  const [closeSignal, setCloseSignal] = useState(0);

  const usedLangCodes = languages.map((l) => l.langCode);

  const handleAddLanguage = () => {
    setCloseSignal((s) => s + 1);
    setShowAddNew(true);
  };

  const handleSaved = (newMultiLangData) => {
    if (newMultiLangData) {
      // Normalize in case backend returns flat VideoSerializer format
      const normalized = normalizeToMultiLang(newMultiLangData);
      if (normalized) {
        // Merge with existing languages so we don't lose previously saved versions
        setLanguages((prev) => {
          const freshFromApi = parseMultiLangData(normalized);
          const freshCodes = new Set(freshFromApi.map((l) => l.langCode));
          const kept = prev.filter((l) => !freshCodes.has(l.langCode));
          return parseMultiLangData(
            Object.assign(
              { id: baseVideoId },
              ...kept.map((l) => ({ [l.langCode]: l.langData })),
              ...freshFromApi.map((l) => ({ [l.langCode]: l.langData })),
            ),
          );
        });
      }
      setShowAddNew(false);
      // Close all existing accordions after a new language is saved
      setCloseSignal((s) => s + 1);
    }
    // null = a PATCH was saved — no list refresh needed
  };

  const handleDeleted = (langCode) => {
    setLanguages((prev) => prev.filter((l) => l.langCode !== langCode));
    if (langCode === "new") setShowAddNew(false);
  };

  return (
    <div className="space-y-3 mt-2">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold text-gray-800">
          {t("Language Versions")}
          <span className="ml-2 text-xs font-normal text-gray-400">
            ({languages.length})
          </span>
        </h3>

        <button
          type="button"
          onClick={handleAddLanguage}
          disabled={showAddNew}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-sm transition-colors"
        >
          <Plus size={15} />
          {t("Add Language")}
        </button>
      </div>

      {/* Existing language accordions */}
      {languages.map((lang, index) => (
        <VideoLanguageAccordion
          key={lang.langData.id ?? lang.langCode}
          langCode={lang.langCode}
          langData={lang.langData}
          baseVideoId={baseVideoId}
          isBase={lang.langData.base_video == null}
          onSaved={handleSaved}
          onDeleted={handleDeleted}
          defaultOpen={closeSignal === 0 && index === 0}
          closeSignal={closeSignal}
          usedLangCodes={usedLangCodes}
        />
      ))}

      {/* Add-new language accordion (draft, no langData) */}
      {showAddNew && (
        <VideoLanguageAccordion
          key="new"
          langCode="new"
          langData={null}
          baseVideoId={baseVideoId}
          isBase={false}
          onSaved={handleSaved}
          onDeleted={handleDeleted}
          defaultOpen={true}
          usedLangCodes={usedLangCodes}
          baseVideoData={
            languages.find((l) => l.langData.base_video == null)?.langData ??
            null
          }
        />
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main component
// ─────────────────────────────────────────────────────────────────────────────

function CreateOrEditVideo({ onSectionChange, video = null }) {
  const { t, i18n } = useTranslation();
  // Detect if the passed `video` is already in multi-lang format and normalize it
  const [multiLangData, setMultiLangData] = useState(() =>
    normalizeToMultiLang(video),
  );

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
    createdVideoData,
    imagePreview,
  } = useCreateOrEditVideo(null, onSectionChange);

  const resolveThumbnailUrl = () => {
    if (imagePreview && typeof imagePreview === "string") return imagePreview;
    if (!formData.thumbnail_url) return null;
    try {
      const thumbs =
        typeof formData.thumbnail_url === "string"
          ? JSON.parse(formData.thumbnail_url)
          : formData.thumbnail_url;
      const order = ["maxres", "high", "standard", "medium", "default"];
      for (const key of order) {
        if (thumbs?.[key]?.url) return thumbs[key].url;
      }
    } catch {
      return null;
    }
    return null;
  };

  // After base video creation, normalize API response to VideoMultiLangSerializer format
  // (handles both flat VideoSerializer and VideoMultiLangSerializer responses)
  useEffect(() => {
    if (createdVideoData) {
      setMultiLangData(normalizeToMultiLang(createdVideoData));
    }
  }, [createdVideoData]);

  return (
    <div
      className="bg-white rounded-lg p-3 lg:p-6 w-full mx-4 overflow-y-auto"
      dir={i18n?.language === "ar" ? "rtl" : "ltr"}
    >
      <CustomBreadcrumb
        backTitle={t("Back to Video List")}
        onBack={() => onSectionChange("videos")}
        page={multiLangData ? t("Edit Video Languages") : t("Create New Video")}
      />

      {/* ── Phase 2: Multi-language manager ───────────────────────────── */}
      {multiLangData ? (
        <MultiLangManager
          multiLangData={multiLangData}
          onSectionChange={onSectionChange}
        />
      ) : (
        /* ── Phase 1: Base video creation form ───────────────────────── */
        <form onSubmit={handleSubmit} className="space-y-6">
          <VideoUrlAndDateSection
            formData={formData}
            onInputChange={handleInputChange}
            onFetchYouTube={handleFetchYouTubeInfo}
            isFetchingYoutube={isFetchingYoutube}
            errors={errors}
          />
          {/* Thumbnail preview */}
          <ThumbnailPreview thumbnailUrl={resolveThumbnailUrl()} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
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
            </div>

            <div className="space-y-4">
              <LanguageAndStatusSection
                formData={formData}
                onInputChange={handleInputChange}
                errors={errors}
              />
            </div>
          </div>

          <DescriptionSection
            formData={formData}
            onBodyChange={(data) =>
              handleInputChange({
                target: { name: "description", value: data },
              })
            }
            onBodyBlur={() => {}}
            error={errors?.description}
          />

          {formData?.duration && (
            <AdditionalInfoSection
              formData={formData}
              onInputChange={handleInputChange}
            />
          )}

          <div className="mb-8">
            <CastSection
              guestSpeakers={formData?.guest_speakers}
              guestSpeakersInput={guestSpeakersInput}
              onGuestSpeakersInputChange={setGuestSpeakersInput}
              onGuestSpeakersInputKeyPress={handleGuestSpeakersInput}
              onGuestSpeakersRemove={removeGuestSpeaker}
              error={errors?.guest_speakers}
            />

            <h2 className="text-xl font-semibold text-gray-800 my-4">
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

          <FormActionsSection
            isLoading={isLoading}
            hasChanges={hasChanges}
            onSubmit={handleSubmit}
            onCancel={() => onSectionChange("videos")}
            isEditMode={false}
          />
        </form>
      )}

      {/* File Preview Modal (used by base creation form) */}
      <FilePreviewModal
        isOpen={Boolean(previewFile) && Boolean(previewUrl)}
        previewFile={previewFile}
        previewUrl={previewUrl}
        t={t}
        handleClosePreview={handleClosePreview}
      />
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
