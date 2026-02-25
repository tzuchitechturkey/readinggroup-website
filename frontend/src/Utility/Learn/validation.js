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

  return newErrors;
};

export const isFormValid = (errors) => {
  return Object.keys(errors).length === 0;
};
