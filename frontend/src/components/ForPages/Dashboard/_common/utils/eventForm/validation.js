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

  if (!formData.category) {
    newErrors.category = t("Category is required");
  }

  if (!formData.title.trim()) {
    newErrors.title = t("Title is required");
  }

  if (!formData.image && !formData.image_url) {
    newErrors.image = t("Image is required");
  }

  if (!formData.status) {
    newErrors.status = t("Status is required");
  }

  if (!formData.country) {
    newErrors.country = t("Country is required");
  }

  if (!formData.language) {
    newErrors.language = t("Language is required");
  }

  if (!formData.happened_at) {
    newErrors.happened_at = t("Happened At is required");
  }

  if (!formData.external_link.trim()) {
    newErrors.external_link = t("External Link is required");
  } else if (!isValidUrl(formData.external_link)) {
    newErrors.external_link = t("Please enter a valid URL");
  }

  if (!formData.report_type) {
    newErrors.report_type = t("Report type is required");
  }

  return newErrors;
};

export const isFormValid = (errors) => {
  return Object.keys(errors).length === 0;
};
