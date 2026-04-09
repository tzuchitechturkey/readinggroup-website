import { useState } from "react";

import { X, Plus } from "lucide-react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

import Loader from "@/components/Global/Loader/Loader";
import { CreateEvent } from "@/api/events";
import { setErrorFn } from "@/Utility/Global/setErrorFn";
import { allLanguages } from "@/constants/constants";

import {
  DatePickerWithMonthYear,
  TimePickerWithDropdowns,
} from "./LiveStreamForm/DateTimePickers";
import EventLanguageAccordion from "./EventLanguageAccordion";

// ─────────────────────────────────────────────────────────────────────────────
// Helpers — normalize event data to multilang format
// ─────────────────────────────────────────────────────────────────────────────

function isMultiLangFormat(event) {
  if (!event || typeof event !== "object") return false;
  return event.id !== undefined && !event.title && !event.live_stream_link;
}

function normalizeToMultiLang(data) {
  if (!data) return null;
  if (isMultiLangFormat(data)) return data;
  const lang = data.language;
  if (!lang) return null;
  return { id: data.id, [lang]: { ...data } };
}

function parseMultiLangData(data) {
  if (!data) return [];
  const entries = [];
  for (const [key, value] of Object.entries(data)) {
    if (key === "id") continue;
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
  // Base version (base_event == null) first
  return entries.sort((a, b) => {
    const aBase = a.langData.base_event == null;
    const bBase = b.langData.base_event == null;
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
  const baseEventId = multiLangData?.id;

  const [langList, setLangList] = useState(() =>
    parseMultiLangData(multiLangData),
  );
  const [showAddNew, setShowAddNew] = useState(false);
  const [closeSignal, setCloseSignal] = useState(0);

  const usedLangCodes = langList.map((l) => l.langCode);

  const handleAddLanguage = () => {
    setCloseSignal((s) => s + 1);
    setShowAddNew(true);
  };

  const handleSaved = (newData) => {
    if (newData) {
      const normalized = normalizeToMultiLang(newData);
      if (normalized) {
        setLangList((prev) => {
          const fresh = parseMultiLangData(normalized);
          const freshCodes = new Set(fresh.map((l) => l.langCode));
          const kept = prev.filter((l) => !freshCodes.has(l.langCode));
          return parseMultiLangData(
            Object.assign(
              { id: baseEventId },
              ...kept.map((l) => ({ [l.langCode]: l.langData })),
              ...fresh.map((l) => ({ [l.langCode]: l.langData })),
            ),
          );
        });
      }
      setShowAddNew(false);
      setCloseSignal((s) => s + 1);
    }
    // null = PATCH was saved — no list refresh needed
  };

  const handleDeleted = (langCode) => {
    setLangList((prev) => prev.filter((l) => l.langCode !== langCode));
    if (langCode === "new") setShowAddNew(false);
  };

  return (
    <div className="space-y-3 mt-2">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold text-gray-800">
          {t("Language Versions")}
          <span className="ml-2 text-xs font-normal text-gray-400">
            ({langList.length})
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

      {langList.map((lang, index) => (
        <EventLanguageAccordion
          key={lang.langData.id ?? lang.langCode}
          langCode={lang.langCode}
          langData={lang.langData}
          baseEventId={baseEventId}
          isBase={lang.langData.base_event == null}
          onSaved={handleSaved}
          onDeleted={handleDeleted}
          defaultOpen={closeSignal === 0 && index === 0}
          closeSignal={closeSignal}
          usedLangCodes={usedLangCodes}
        />
      ))}

      {showAddNew && (
        <EventLanguageAccordion
          key="new"
          langCode="new"
          langData={null}
          baseEventId={baseEventId}
          isBase={false}
          onSaved={handleSaved}
          onDeleted={handleDeleted}
          defaultOpen={true}
          usedLangCodes={usedLangCodes}
        />
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// useBaseEventForm — local hook for Phase 1 base creation form
// ─────────────────────────────────────────────────────────────────────────────

const INITIAL_FORM = {
  title: "",
  language: "",
  start_event_date: "",
  start_event_time: "",
  duration: "",
  guest_speakers: [],
  live_stream_link: "",
};

function useBaseEventForm(onCreated) {
  const { t } = useTranslation();
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [guestSpeakerInput, setGuestSpeakerInput] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "duration" && !/^\d*$/.test(value)) return;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleGuestSpeakersInput = (e) => {
    if (e.key === "Enter" && guestSpeakerInput.trim()) {
      e.preventDefault();
      const trimmed = guestSpeakerInput.trim();
      if (!formData.guest_speakers.includes(trimmed)) {
        setFormData((prev) => ({
          ...prev,
          guest_speakers: [...prev.guest_speakers, trimmed],
        }));
      }
      setGuestSpeakerInput("");
    }
  };

  const removeGuestSpeaker = (speaker) => {
    setFormData((prev) => ({
      ...prev,
      guest_speakers: prev.guest_speakers.filter((s) => s !== speaker),
    }));
  };

  const validate = () => {
    const errs = {};
    if (!formData.title?.trim()) errs.title = t("Title is required");
    if (!formData.language) errs.language = t("Language is required");
    if (!formData.start_event_date)
      errs.start_event_date = t("Date is required");
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) {
      toast.error(t("Please fix the errors in the form"));
      return;
    }

    const fd = new FormData();
    fd.append("title", formData.title);
    fd.append("language", formData.language);
    fd.append("start_event_date", formData.start_event_date);
    if (formData.start_event_time)
      fd.append("start_event_time", formData.start_event_time);
    if (formData.duration) fd.append("duration", formData.duration);
    fd.append("live_stream_link", formData.live_stream_link || "");
    if (formData.guest_speakers?.length > 0) {
      fd.append("guest_speakers", JSON.stringify(formData.guest_speakers));
    }

    setIsLoading(true);
    try {
      const res = await CreateEvent(fd);
      toast.success(t("Event created successfully"));
      onCreated(res.data);
    } catch (err) {
      setErrorFn(err, t);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    formData,
    errors,
    isLoading,
    guestSpeakerInput,
    setGuestSpeakerInput,
    handleInputChange,
    handleGuestSpeakersInput,
    removeGuestSpeaker,
    handleSubmit,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Main component
// ─────────────────────────────────────────────────────────────────────────────

const CreateOrEditLiveStreamSchedule = ({
  liveStream = null,
  onClose,
  setUpdate,
}) => {
  const { t } = useTranslation();
  const [openDatePopover, setOpenDatePopover] = useState(false);
  console.log("Initial liveStream prop:", liveStream);
  // Normalize incoming event data to multilang format
  const [multiLangData, setMultiLangData] = useState(() =>
    normalizeToMultiLang(liveStream),
  );

  const handleCreated = (data) => {
    setMultiLangData(normalizeToMultiLang(data));
    if (setUpdate) setUpdate((prev) => !prev);
  };

  const {
    formData,
    errors,
    isLoading,
    guestSpeakerInput,
    setGuestSpeakerInput,
    handleInputChange,
    handleGuestSpeakersInput,
    removeGuestSpeaker,
    handleSubmit,
  } = useBaseEventForm(handleCreated);

  return (
    <div className="bg-white rounded-lg p-3">
      {isLoading && <Loader />}

      {multiLangData ? (
        /* ── Phase 2: Multi-language manager ─────────────────────────── */
        <MultiLangManager multiLangData={multiLangData} />
      ) : (
        /* ── Phase 1: Base event creation form ───────────────────────── */
        <form
          onSubmit={handleSubmit}
          className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          {/* Title */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              {t("Live Stream Title")} <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
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
              value={formData.language}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border ${errors.language ? "border-red-500" : "border-gray-300"} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
            >
              <option value="" disabled hidden>
                {t("Select Language")}
              </option>
              {allLanguages.map((l) => (
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
          </div>

          {/* Duration */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              {t("Event Duration (HOUR)")}
            </label>
            <input
              type="text"
              name="duration"
              value={formData.duration}
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
              value={formData.live_stream_link}
              onChange={handleInputChange}
              placeholder="https://..."
              className={`w-full px-3 py-2 border ${errors.live_stream_link ? "border-red-500" : "border-gray-300"} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            {errors.live_stream_link && (
              <p className="text-red-600 text-sm">{errors.live_stream_link}</p>
            )}
          </div>

          {/* Guest Speakers — full width */}
          <div className="space-y-2 md:col-span-2">
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
            {formData.guest_speakers.length > 0 && (
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
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Actions — full width */}
          <div className="md:col-span-2 flex justify-end gap-3 pt-2 border-t border-gray-100">
            <button
              type="button"
              onClick={() => onClose && onClose()}
              className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              {t("Cancel")}
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center gap-2 px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors text-sm font-medium"
            >
              {isLoading ? t("Creating...") : t("Create Event")}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default CreateOrEditLiveStreamSchedule;
