export const languages = [
  { label: "Arabic", value: "ar" },
  { label: "English", value: "en" },
  { label: "Turkish", value: "tr" },
  { label: "Chinese (Simp)", value: "zh-hans" },
  { label: "Chinese (Trad)", value: "zh-hant" },
  { label: "Spanish", value: "es" },
  { label: "French", value: "fr" },
];

// Map language names to language codes
export const languageCodeMap = {
  ar: "ar",
  en: "en",
  tr: "tr",
  ch: "ch",
  chsi: "chsi",
  fr: "fr",
};

// Get language label by code
export const getLanguageLabel = (code) => {
  const language = languages.find(lang => lang.value === code);
  return language ? language.label : code;
};

// Get current language or default
export const getCurrentLanguage = (i18n) => {
  return i18n?.language || "en";
};