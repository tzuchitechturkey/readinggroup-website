// Languages list for dropdown selection
export const LANGUAGES = [
  { label: "Arabic", value: "ar" },
  { label: "English", value: "en" },
  { label: "Turkish", value: "tr" },
  { label: "Chinese (Simp)", value: "zh-hans" },
  { label: "Chinese (Trad)", value: "zh-hant" },
  { label: "Spanish", value: "es" },
  { label: "French", value: "fr" },
];

// Language code mapping
export const LANGUAGE_CODE_MAP = {
  ar: "ar",
  eng: "en",
  tr: "tr",
  ch: "ch",
  chsi: "chsi",
  fr: "fr",
};

// Pagination limit
export const ITEMS_PER_PAGE = 10;

// Default form state
export const DEFAULT_FORM_STATE = {
  name: "",
  description: "",
  is_active: false,
  post_count: 0,
};
