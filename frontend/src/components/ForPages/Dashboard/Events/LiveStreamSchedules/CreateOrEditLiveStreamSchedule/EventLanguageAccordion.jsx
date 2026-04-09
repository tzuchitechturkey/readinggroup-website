import React, { useState, useEffect } from "react";

import {
  ChevronDown,
  ChevronUp,
  Trash2,
  Save,
  Loader2,
  Globe,
  Upload,
  X,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

import { languages } from "@/constants/constants";
import { DeleteEventById } from "@/api/events";
import { setErrorFn } from "@/Utility/Global/setErrorFn";
import { useEventLanguageForm } from "@/hooks/event/useEventLanguageForm";

import {
  DatePickerWithMonthYear,
  TimePickerWithDropdowns,
} from "./LiveStreamForm/DateTimePickers";

const LANGUAGE_LABELS = languages.reduce((acc, l) => {
  acc[l.code] = l.label;
  return acc;
}, {});

/**
 * Accordion panel for one language version of an event.
 *
 * @param {string}      langCode      - language code, e.g. "ar", "en"
 * @param {object|null} langData      - existing event fields for this language, null for a new translation
 * @param {number}      baseEventId   - id of the base event
 * @param {boolean}     isBase        - true if this is the original (base_event == null)
 * @param {function}    onSaved       - called after save; receives API response or null
 * @param {function}    onDeleted     - called after delete with the langCode
 * @param {boolean}     defaultOpen   - whether the accordion starts expanded
 * @param {number}      closeSignal   - increment to close this accordion
 * @param {string[]}    usedLangCodes - already-used language codes
 */
function EventLanguageAccordion({
  langCode,
  langData,
  baseEventId,
  isBase,
  onSaved,
  onDeleted,
  defaultOpen = false,
  closeSignal = 0,
  usedLangCodes = [],
}) {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [isDeleting, setIsDeleting] = useState(false);
  const [openDatePopover, setOpenDatePopover] = useState(false);

  // Close when parent signals
  useEffect(() => {
    if (closeSignal > 0) setIsOpen(false);
  }, [closeSignal]);

  const {
    formData,
    errors,
    isLoading,
    images,
    isUploadingImage,
    guestSpeakerInput,
    setGuestSpeakerInput,
    isNewLang,
    handleInputChange,
    handleGuestSpeakersInput,
    removeGuestSpeaker,
    handleAddImage,
    handleDeleteImage,
    handleSave,
  } = useEventLanguageForm(langData, baseEventId, onSaved);

  // ── Delete language version ──────────────────────────────────────────────

  const handleDelete = async () => {
    if (!langData?.id) {
      onDeleted && onDeleted(langCode);
      return;
    }
    if (!window.confirm(t("Are you sure you want to delete this language version?")))
      return;

    setIsDeleting(true);
    try {
      await DeleteEventById(langData.id);
      toast.success(t("Language version deleted successfully"));
      onDeleted && onDeleted(langCode);
    } catch (err) {
      setErrorFn(err, t);
    } finally {
      setIsDeleting(false);
    }
  };

  // ── Image upload input handler ───────────────────────────────────────────

  const handleImageFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) handleAddImage(file);
    e.target.value = "";
  };

  // Available languages for the select (exclude already-used ones, except current)
  const availableLangs = languages.filter(
    (l) =>
      !usedLangCodes.includes(l.code) ||
      (!isNewLang && l.code === formData.language),
  );

  const langLabel =
    LANGUAGE_LABELS[langCode] || langCode?.toUpperCase() || t("New Language");

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
        <div className="p-4 space-y-4 bg-white">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Title */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                {t("Live Stream Title")} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title || ""}
                onChange={handleInputChange}
                placeholder={t("Enter Live Stream title")}
                className={`w-full px-3 py-2 border ${errors.title ? "border-red-500" : "border-gray-300"} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
              {errors.title && (
                <p className="text-red-600 text-sm">{errors.title}</p>
              )}
            </div>

            {/* Language */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                {t("Language")} <span className="text-red-500">*</span>
              </label>
              <select
                name="language"
                value={formData.language || ""}
                onChange={handleInputChange}
                disabled={!isNewLang}
                className={`w-full px-3 py-2 border ${errors.language ? "border-red-500" : "border-gray-300"} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed`}
              >
                <option value="" disabled hidden>
                  {t("Select Language")}
                </option>
                {availableLangs.map((l) => (
                  <option key={l.code} value={l.code}>
                    {t(l.label)}
                  </option>
                ))}
              </select>
              {errors.language && (
                <p className="text-red-600 text-sm">{errors.language}</p>
              )}
            </div>

            {/* Date */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                {t("Live Stream Date")} <span className="text-red-500">*</span>
              </label>
              <DatePickerWithMonthYear
                value={formData.start_event_date}
                onChange={(date) =>
                  handleInputChange({
                    target: { name: "start_event_date", value: date },
                  })
                }
                error={errors.start_event_date}
                t={t}
                isOpen={openDatePopover}
                onOpenChange={setOpenDatePopover}
              />
              {errors.start_event_date && (
                <p className="text-red-600 text-sm">{errors.start_event_date}</p>
              )}
            </div>

            {/* Start Time */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                {t("Live Stream Start Time")}
              </label>
              <TimePickerWithDropdowns
                value={formData.start_event_time}
                onChange={(time) =>
                  handleInputChange({
                    target: { name: "start_event_time", value: time },
                  })
                }
                error={errors.start_event_time}
                t={t}
              />
              {errors.start_event_time && (
                <p className="text-red-600 text-sm">{errors.start_event_time}</p>
              )}
            </div>

            {/* Duration */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                {t("Event Duration (HOUR)")}
              </label>
              <input
                type="text"
                name="duration"
                value={formData.duration || ""}
                onChange={handleInputChange}
                inputMode="numeric"
                pattern="[0-9]*"
                className={`w-full px-3 py-2 border ${errors.duration ? "border-red-500" : "border-gray-300"} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
              {errors.duration && (
                <p className="text-red-600 text-sm">{errors.duration}</p>
              )}
            </div>

            {/* Live Stream Link */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                {t("Live Stream Link")}
              </label>
              <input
                type="url"
                name="live_stream_link"
                value={formData.live_stream_link || ""}
                onChange={handleInputChange}
                placeholder="https://..."
                className={`w-full px-3 py-2 border ${errors.live_stream_link ? "border-red-500" : "border-gray-300"} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
              {errors.live_stream_link && (
                <p className="text-red-600 text-sm">{errors.live_stream_link}</p>
              )}
            </div>
          </div>

          {/* Guest Speakers */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              {t("Guest Speakers")}
            </label>
            <input
              type="text"
              value={guestSpeakerInput}
              onChange={(e) => setGuestSpeakerInput(e.target.value)}
              onKeyDown={handleGuestSpeakersInput}
              placeholder={t("Enter guest speaker name and press Enter")}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {formData.guest_speakers?.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.guest_speakers.map((speaker, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                  >
                    <span>{speaker}</span>
                    <button
                      type="button"
                      onClick={() => removeGuestSpeaker(speaker)}
                      className="hover:text-blue-600"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Images (only for saved events) */}
          {!isNewLang && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-gray-700">
                  {t("Images")}
                </label>
                <label className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer text-sm transition-colors">
                  {isUploadingImage ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <Upload size={14} />
                  )}
                  {t("Add Image")}
                  <input
                    type="file"
                    accept="image/*,.heic,.heif"
                    className="hidden"
                    onChange={handleImageFileChange}
                    disabled={isUploadingImage}
                  />
                </label>
              </div>

              {images.length === 0 ? (
                <p className="text-sm text-gray-400 italic">
                  {t("No images uploaded yet")}
                </p>
              ) : (
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                  {images.map((img) => (
                    <div key={img.id} className="relative group">
                      <img
                        src={img.image}
                        alt={img.caption || ""}
                        className="w-full aspect-video object-cover rounded-lg border border-gray-200"
                      />
                      <button
                        type="button"
                        onClick={() => handleDeleteImage(img.id)}
                        className="absolute top-1 right-1 p-0.5 bg-red-500 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity"
                        title={t("Delete image")}
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Save button */}
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
    </div>
  );
}

export default EventLanguageAccordion;
