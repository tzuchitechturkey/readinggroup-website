export const validateForm = (formData, t, post) => {
  const newErrors = {};

  if (!formData.title.trim()) {
    newErrors.title = t("Title is required");
  }

  if (!formData.subtitle.trim()) {
    newErrors.subtitle = t("Subtitle is required");
  }

  if (!formData.category) {
    newErrors.category = t("Category is required");
  }
  if (!formData.learn_type) {
    newErrors.learn_type = t("Type is required");
  }

  if (!formData.image && !formData.image_url && !post) {
    newErrors.image = t("Image is required");
  }

  // Validation for event fields (when is_event is true and learn_type is posters)
  if (formData.learn_type === "posters" && formData.is_event) {
    if (!formData.date) {
      newErrors.date = t("Event date is required");
    }

    if (!formData.event_title || !formData.event_title.trim()) {
      newErrors.event_title = t("Event title is required");
    }

    if (!formData.guest_speakers || formData.guest_speakers.length === 0) {
      newErrors.guest_speakers = t("At least one guest speaker is required");
    }

    if (!formData.live_stream_link || !formData.live_stream_link.trim()) {
      newErrors.live_stream_link = t("Live stream link is required");
    } else if (!isValidUrl(formData.live_stream_link)) {
      newErrors.live_stream_link = t("Please enter a valid URL");
    }
  }
  console.log("Validation errors:", newErrors);
  return newErrors;
};

export const isFormValid = (errors) => {
  return Object.keys(errors).length === 0;
};

// Helper function to validate URLs
const isValidUrl = (string) => {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
};
