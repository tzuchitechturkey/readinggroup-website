import { useState, useEffect, useCallback } from "react";

import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

import { setErrorFn } from "@/Utility/Global/setErrorFn";
import { CreateEvent, EditEventById } from "@/api/events";
import { GetLearnsByType } from "@/api/learn";

import { FORM_DATA_INITIAL_STATE } from "../utils/eventForm/constants";
import { validateForm, isFormValid } from "../utils/eventForm/validation";

export const useEventForm = (event = null, onSectionChange) => {
  const { t } = useTranslation();

  const [formData, setFormData] = useState(FORM_DATA_INITIAL_STATE);
  const [errors, setErrors] = useState({});
  const [imagePreview, setImagePreview] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  // const [hasChanges, setHasChanges] = useState(false);
  const [guestSpeakerInput, setGuestSpeakerInput] = useState("");
  const [selectedLearn, setSelectedLearn] = useState(null);
  const [learnsList, setLearnsList] = useState([]);
  const [learnsSearchValue, setLearnsSearchValue] = useState("");
  // Initialize form when editing
  useEffect(() => {
    if (event?.id) {
      setFormData({
        title: event.title || "",
        start_event_date: event.start_event_date
          ? event.start_event_date.split(" ")[0]
          : "",
        start_event_time: event.start_event_time || "",
        duration: event.duration || "",
        guest_speakers: event.guest_speakers || [],
        live_stream_link: event.live_stream_link || "",
        learn: event.learn || null,
      });
      if (event.learn) {
        setSelectedLearn(event.learn);
      }
      // setHasChanges(false);
    } else {
      resetForm();
    }
  }, [event?.id]);

  // Cleanup blob URLs on unmount
  useEffect(() => {
    return () => {
      if (imagePreview && imagePreview.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  // Get learns from API
  const getLearnsList = useCallback(async (searchVal = "") => {
    try {
      const params = searchVal ? { search: searchVal } : {};
      const res = await GetLearnsByType("posters", params);
      setLearnsList(res?.data?.results || []);
    } catch (error) {
      console.error("Error fetching learns:", error);
    }
  }, []);

  // Load learns on component mount
  useEffect(() => {
    getLearnsList();
  }, [getLearnsList]);

  const resetForm = useCallback(() => {
    setFormData(FORM_DATA_INITIAL_STATE);
    setErrors({});
    setImagePreview("");
    setGuestSpeakerInput("");
    // setHasChanges(false);

    if (imagePreview && imagePreview.startsWith("blob:")) {
      URL.revokeObjectURL(imagePreview);
    }
  }, [imagePreview]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "duration") {
      if (!/^\d*$/.test(value)) return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // إزالة الخطأ عند التعديل
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleGuestSpeakersInput = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const trimmedInput = guestSpeakerInput.trim();

      if (trimmedInput) {
        setFormData((prev) => ({
          ...prev,
          guest_speakers: [...prev.guest_speakers, trimmedInput],
        }));
        setGuestSpeakerInput("");
        // setHasChanges(true);

        if (errors.guest_speakers) {
          setErrors((prev) => ({
            ...prev,
            guest_speakers: "",
          }));
        }
      }
    }
  };

  const removeGuestSpeaker = (speaker) => {
    setFormData((prev) => ({
      ...prev,
      guest_speakers: prev.guest_speakers.filter((s) => s !== speaker),
    }));
    // setHasChanges(true);
  };

  const handleLearnSelect = (learn) => {
    setSelectedLearn(learn);
    setFormData((prev) => ({
      ...prev,
      learn,
    }));
  };

  const handleLearnClear = () => {
    setSelectedLearn(null);
    setFormData((prev) => ({
      ...prev,
      learn: null,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = validateForm(formData, t);
    setErrors(newErrors);

    if (!isFormValid(newErrors)) {
      toast.error(t("Please fix the errors in the form"));
      return;
    }

    const submitData = new FormData();
    submitData.append("title", formData.title);
    submitData.append("start_event_date", formData.start_event_date);
    submitData.append("start_event_time", formData.start_event_time);
    submitData.append("duration", formData.duration);
    submitData.append("live_stream_link", formData.live_stream_link);

    if (formData.guest_speakers && formData.guest_speakers.length > 0) {
      submitData.append(
        "guest_speakers",
        JSON.stringify(formData.guest_speakers),
      );
    }

    if (formData.learn?.id) {
      submitData.append("learn", formData.learn.id);
    }

    setIsLoading(true);
    try {
      if (event?.id) {
        await EditEventById(event.id, submitData);
        toast.success(t("Event updated successfully"));
      } else {
        await CreateEvent(submitData);
        toast.success(t("Event created successfully"));
      }

      onSectionChange("liveStreamSchedules");
      resetForm();
    } catch (error) {
      setErrorFn(error, t);
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
    selectedLearn,
    learnsList,
    learnsSearchValue,
    setLearnsSearchValue,
    handleInputChange,
    handleSubmit,
    handleGuestSpeakersInput,
    removeGuestSpeaker,
    handleLearnSelect,
    handleLearnClear,
    getLearnsList,
    resetForm,
  };
};
