/**
 * Validation functions for post form
 */

export const validateForm = (formData, t, post) => {
  const newErrors = {};

  if (!formData.title.trim()) {
    newErrors.title = t("Title is required");
  }

  if (!formData.subtitle.trim()) {
    newErrors.subtitle = t("Subtitle is required");
  }

  if (!formData.excerpt.trim()) {
    newErrors.excerpt = t("Excerpt is required");
  }

  if (!formData.body.trim()) {
    newErrors.body = t("Body content is required");
  }

  if (!formData.writer.trim()) {
    newErrors.writer = t("Writer is required");
  }

  if (!formData.category) {
    newErrors.category = t("Category is required");
  }

  if (!formData.status) {
    newErrors.status = t("Status is required");
  }

  if (!formData.read_time) {
    newErrors.read_time = t("Read time is required");
  }

  if (!formData.tags || formData.tags.length === 0) {
    newErrors.tags = t("Tags are required");
  }

  if (!formData.language || !formData.language.trim()) {
    newErrors.language = t("Language is required");
  }

  if (!formData.post_type) {
    newErrors.post_type = t("Type is required");
  }

  if (!formData.country) {
    newErrors.country = t("Country is required");
  }

  if (!formData.image && !formData.image_url && !post) {
    newErrors.image = t("Image is required");
  }

  return newErrors;
};

export const isFormValid = (errors) => {
  return Object.keys(errors).length === 0;
};
