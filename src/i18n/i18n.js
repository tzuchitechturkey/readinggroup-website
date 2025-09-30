import i18n from "i18next";
import detector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";

import translationCH from "./locales/ch/translation.json";
import translationEN from "./locales/en/translation.json";
 import translationAR from "./locales/ar/translation.json";

const resources = {
  ch: {
    translation: translationCH,
  },
  en: {
    translation: translationEN,
  },
  ar: {
    translation: translationAR,
  },
};

const language = localStorage?.getItem("I18N_LANGUAGE");
if (!language) {
  localStorage.setItem("I18N_LANGUAGE", "en");
}

i18n
  .use(detector)
  .use(initReactI18next)
  .init({
    resources,
    lng: localStorage.getItem("I18N_LANGUAGE") || "en",
    fallbackLng: "en",

    keySeparator: false,

    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
