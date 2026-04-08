import React, { useState, useEffect } from "react";

import {
  ChevronDown,
  ChevronUp,
  Trash2,
  Save,
  Loader2,
  Globe,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

import { DeleteVideoById } from "@/api/videos";
import { setErrorFn } from "@/Utility/Global/setErrorFn";
import { useVideoLanguageForm } from "@/hooks/video/useVideoLanguageForm";

import { BasicDetailsSection } from "./VideoForm/BasicDetailsSection";
import { VideoUrlAndDateSection } from "./VideoForm/VideoUrlAndDateSection";
import { CastSection } from "./VideoForm/CastSection";
import { LanguageAndStatusSection } from "./VideoForm/LanguageAndStatusSection";
import { DescriptionSection } from "./VideoForm/DescriptionSection";
import { AdditionalInfoSection } from "./VideoForm/AdditionalInfoSection";
import {
  AttachmentsSection,
  FilePreviewModal,
} from "../../Contents/CreateOrEditContent/ContentForm";
import AttachmentsModal from "../../Contents/CreateOrEditContent/ContentForm/AttachmentsModal";
import ThumbnailPreview from "./VideoForm/ThumbnailPreview";

const LANGUAGE_LABELS = {
  ar: "العربية",
  en: "English",
  tr: "Türkçe",
};

/**
 * Accordion panel for one language version of a video.
 *
 * @param {string}      langCode      - language code, e.g. "ar", "en"
 * @param {object|null} langData      - existing video fields for this language, null for a new translation
 * @param {number}      baseVideoId   - id of the base video
 * @param {boolean}     isBase        - true if this is the original (base_video == null)
 * @param {function}    onSaved       - called after save; receives new multi-lang data or null
 * @param {function}    onDeleted     - called after delete with the langCode
 * @param {boolean}     defaultOpen   - whether the accordion starts expanded
 */
function VideoLanguageAccordion({
  langCode,
  langData,
  baseVideoId,
  isBase,
  onSaved,
  onDeleted,
  defaultOpen = false,
  closeSignal = 0,
  usedLangCodes = [],
  baseVideoData = null,
}) {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [isDeleting, setIsDeleting] = useState(false);

  // Close this accordion whenever the parent signals that a new one is opening
  useEffect(() => {
    if (closeSignal > 0) setIsOpen(false);
  }, [closeSignal]);

  const {
    formData,
    errors,
    isLoading,
    imagePreview,
    guestSpeakersInput,
    setGuestSpeakersInput,
    isFetchingYoutube,
    showAttachmentsModal,
    setShowAttachmentsModal,
    previewFile,
    previewUrl,
    showCategoryDropdown,
    setShowCategoryDropdown,
    categoriesList,
    categorySearchValue,
    setCategorySearchValue,
    categoryDropdownRef,
    isNewLang,
    handleInputChange,
    handleCategorySelect,
    handleGuestSpeakersInput,
    removeGuestSpeaker,
    handleConfirmAttachments,
    handleRemoveAttachment,
    handlePreviewFile,
    handleClosePreview,
    handleFetchYouTubeInfo,
    handleSave,
    getCategories,
  } = useVideoLanguageForm(langData, baseVideoId, onSaved, baseVideoData, usedLangCodes);

  const handleDelete = async () => {
    // For unsaved new language entries — just remove from UI
    if (!langData?.id) {
      onDeleted && onDeleted(langCode);
      return;
    }

    if (!window.confirm(t("Are you sure you want to delete this language version?")))
      return;

    setIsDeleting(true);
    try {
      await DeleteVideoById(langData.id);
      toast.success(t("Language version deleted successfully"));
      onDeleted && onDeleted(langCode);
    } catch (err) {
      setErrorFn(err, t);
    } finally {
      setIsDeleting(false);
    }
  };

  const langLabel = LANGUAGE_LABELS[langCode] || langCode?.toUpperCase();

  // Resolve the best thumbnail URL from the JSON field for the preview
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

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div
        className={`flex items-center justify-between px-4 py-3 cursor-pointer select-none transition-colors ${
          isOpen
            ? "bg-blue-50 border-b border-blue-100"
            : "bg-gray-50 hover:bg-gray-100"
        }`}
        onClick={() => setIsOpen((v) => !v)}
      >
        <div className="flex items-center gap-3 min-w-0">
          <Globe size={18} className="text-blue-600 flex-shrink-0" />
          <span className="font-medium text-gray-800">{langLabel}</span>

          {isBase && (
            <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium flex-shrink-0">
              {t("Base")}
            </span>
          )}
          {isNewLang && (
            <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium flex-shrink-0">
              {t("New")}
            </span>
          )}

          {formData?.title && (
            <span className="text-sm text-gray-400 truncate hidden sm:block">
              — {formData.title}
            </span>
          )}
        </div>

        <div
          className="flex items-center gap-1 flex-shrink-0"
          onClick={(e) => e.stopPropagation()}
        >
          {!isBase && (
            <button
              type="button"
              onClick={handleDelete}
              disabled={isDeleting}
              title={t("Delete language version")}
              className="p-1.5 rounded hover:bg-red-100 text-gray-400 hover:text-red-600 transition-colors disabled:opacity-50"
            >
              {isDeleting ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <Trash2 size={14} />
              )}
            </button>
          )}

          <button
            type="button"
            onClick={() => setIsOpen((v) => !v)}
            className="p-1 text-gray-400 hover:text-gray-600"
          >
            {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>
        </div>
      </div>

      {/* ── Body ───────────────────────────────────────────────────────── */}
      {isOpen && (
        <div className="p-4 space-y-6 bg-white">
          {/* URL + Date */}
          <VideoUrlAndDateSection
            formData={formData}
            onInputChange={handleInputChange}
            onFetchYouTube={handleFetchYouTubeInfo}
            isFetchingYoutube={isFetchingYoutube}
            errors={errors}
          />

          {/* Thumbnail preview */}
          <ThumbnailPreview thumbnailUrl={resolveThumbnailUrl()} />

          {/* Two-column: Basic Details + Language & Type */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              disableCategory={!isBase}
            />

            <LanguageAndStatusSection
              formData={formData}
              onInputChange={handleInputChange}
              errors={errors}
              usedLangCodes={isNewLang ? usedLangCodes : usedLangCodes.filter((c) => c !== langCode)}
              disableVideoType={!isBase}
            />
          </div>

          {/* Description */}
          <DescriptionSection
            formData={formData}
            onBodyChange={(data) =>
              handleInputChange({ target: { name: "description", value: data } })
            }
            onBodyBlur={() => {}}
            error={errors?.description}
          />

          {/* Duration (read-only, shown only when present) */}
          {formData?.duration && (
            <AdditionalInfoSection
              formData={formData}
              onInputChange={handleInputChange}
            />
          )}

          {/* Cast + Attachments */}
          <div>
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

          {/* ── Save button ─────────────────────────────────────────────── */}
          <div className="flex justify-end pt-2 border-t border-gray-100">
            <button
              type="button"
              onClick={handleSave}
              disabled={isLoading}
              className="flex items-center gap-2 px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors text-sm font-medium"
            >
              {isLoading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Save size={16} />
              )}
              <span>
                {isLoading
                  ? t("Saving...")
                  : isNewLang
                    ? t("Add Language")
                    : t("Save Changes")}
              </span>
            </button>
          </div>
        </div>
      )}

      {/* Modals */}
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

export default VideoLanguageAccordion;
