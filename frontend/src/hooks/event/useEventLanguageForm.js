/**
 * Hook for managing a single language version of an event.
 * Handles both PATCH (edit existing) and POST (add new translation).
 */

import { useState } from "react";

import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

import {
  CreateEvent,
  PatchEventById,
  AddEventImage,
  DeleteEventImageByEventId,
} from "@/api/events";
import { setErrorFn } from "@/Utility/Global/setErrorFn";

const EMPTY_FORM = {
  title: "",
  language: "",
  start_event_date: "",
  start_event_time: "",
  duration: "",
  guest_speakers: [],
  live_stream_link: "",
};

function buildInitialFormData(data) {
  if (!data) return { ...EMPTY_FORM };
  return {
    id: data.id,
    title: data.title || "",
    language: data.language || "",
    start_event_date: data.start_event_date
      ? data.start_event_date.split(" ")[0]
      : "",
    start_event_time: data.start_event_time || "",
    duration: data.duration || "",
    guest_speakers: data.guest_speakers || [],
    live_stream_link: data.live_stream_link || "",
  };
}

/**
 * @param {object|null} initialData  - existing event fields for this language, or null for a new translation
 * @param {number}      baseEventId  - id of the base event (used when POSTing a new translation)
 * @param {function}    onSaved      - called with the API response after a successful save (null if PATCH)
 */
export const useEventLanguageForm = (initialData, baseEventId, onSaved) => {
  const { t } = useTranslation();

  const [formData, setFormData] = useState(() =>
    buildInitialFormData(initialData),
  );
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [images, setImages] = useState(initialData?.images || []);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [guestSpeakerInput, setGuestSpeakerInput] = useState("");

  const isNewLang = !initialData?.id;

  // ── Form handlers ────────────────────────────────────────────────────────

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
      if (!(formData.guest_speakers || []).includes(trimmed)) {
        setFormData((prev) => ({
          ...prev,
          guest_speakers: [...(prev.guest_speakers || []), trimmed],
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

  // ── Image handlers ───────────────────────────────────────────────────────

  const handleAddImage = async (file) => {
    if (!formData.id) return;
    const fd = new FormData();
    fd.append("image", file);
    setIsUploadingImage(true);
    try {
      const res = await AddEventImage(formData.id, fd);
      setImages((prev) => [...prev, res.data]);
      toast.success(t("Image uploaded successfully"));
    } catch (err) {
      setErrorFn(err, t);
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleDeleteImage = async (imageId) => {
    if (!formData.id) return;
    try {
      await DeleteEventImageByEventId(formData.id, imageId);
      setImages((prev) => prev.filter((img) => img.id !== imageId));
      toast.success(t("Image deleted successfully"));
    } catch (err) {
      setErrorFn(err, t);
    }
  };

  // ── Save ─────────────────────────────────────────────────────────────────

  const validate = () => {
    const errs = {};
    if (!formData.title?.trim()) errs.title = t("Title is required");
    if (!formData.language) errs.language = t("Language is required");
    if (!formData.start_event_date)
      errs.start_event_date = t("Date is required");
    return errs;
  };

  const buildPayload = () => {
    const fd = new FormData();
    fd.append("title", formData.title);
    fd.append("language", formData.language);
    if (formData.start_event_date)
      fd.append("start_event_date", formData.start_event_date);
    if (formData.start_event_time)
      fd.append("start_event_time", formData.start_event_time);
    if (formData.duration) fd.append("duration", formData.duration);
    fd.append("live_stream_link", formData.live_stream_link || "");
    if (formData.guest_speakers?.length > 0) {
      fd.append("guest_speakers", JSON.stringify(formData.guest_speakers));
    }
    return fd;
  };

  const handleSave = async () => {
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) {
      toast.error(t("Please fix the errors in the form"));
      return;
    }

    const fd = buildPayload();
    setIsLoading(true);
    try {
      if (isNewLang) {
        fd.append("base_event", baseEventId);
        const res = await CreateEvent(fd);
        toast.success(t("Language version added successfully"));
        onSaved && onSaved(res.data);
      } else {
        const res = await PatchEventById(formData.id, fd);
        setFormData(buildInitialFormData(res.data));
        toast.success(t("Language version updated successfully"));
        onSaved && onSaved(null);
      }
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
  };
};
