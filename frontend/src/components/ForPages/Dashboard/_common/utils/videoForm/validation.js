/**
 * Video Form Validation Functions
 */

export const isValidYouTubeUrl = (url) => {
  const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/;
  return youtubeRegex.test(url);
};

export const validateForm = (formData, t) => {
  const newErrors = {};

  if (!formData?.title.trim()) {
    newErrors.title = t("Title is required");
  }

  if (!formData?.category) {
    newErrors.category = t("Category is required");
  }

  if (!formData?.language) {
    newErrors.language = t("Language is required");
  }

  if (!formData?.video_url.trim()) {
    newErrors.video_url = t("Video URL is required");
  } else if (!isValidYouTubeUrl(formData?.video_url)) {
    newErrors.video_url = t("Please enter a valid YouTube URL");
  }

  if (!formData?.happened_at) {
    newErrors.happened_at = t("Happened At is required");
  }

  if (!formData?.description.trim()) {
    newErrors.description = t("Description is required");
  }

  return newErrors;
};

export const isFormValid = (errors) => Object.keys(errors).length === 0;
