// Form validation utilities

export const validateForm = (form, t) => {
  const newErrors = {};

  if (!form.name || !form.name.trim()) {
    newErrors.name = t("Name is required");
  }

  return {
    isValid: Object.keys(newErrors).length === 0,
    errors: newErrors,
  };
};

export const validateCategoryStatus = (form, t) => {
  // Check if trying to activate category with no posts
  if (!form.is_active && form.post_count === 0) {
    return {
      isValid: false,
      message: t(
        "You cannot activate this category because it does not contain any posts. Please add posts first."
      ),
    };
  }
  return { isValid: true };
};
