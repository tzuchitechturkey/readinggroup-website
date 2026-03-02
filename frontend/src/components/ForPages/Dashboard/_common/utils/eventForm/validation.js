const isValidUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export const validateForm = (formData, t) => {
  const newErrors = {};

  if (!formData.title.trim()) {
    newErrors.title = t("Event Title is required");
  }

  if (!formData.start_event_date) {
    newErrors.start_event_date = t("Event Date is required");
  }

  if (!formData.start_event_time) {
    newErrors.start_event_time = t("Event Start Time is required");
  }

  if (!formData.duration) {
    newErrors.duration = t("Event Duration is required");
  }

  if (!formData.learn || !formData.learn?.id) {
    newErrors.learn = t("Event Learn is required");
  }

  if (!formData.guest_speakers || formData.guest_speakers.length === 0) {
    newErrors.guest_speakers = t("At least one guest speaker is required");
  }
  if (formData.live_stream_link && !isValidUrl(formData.live_stream_link)) {
    newErrors.live_stream_link = t("Please enter a valid URL");
  }

  return newErrors;
};

export const isFormValid = (errors) => {
  return Object.keys(errors).length === 0;
};
