/* eslint-env node */
/**
 * i18next-parser configuration
 * - Extracts translatable strings from React/JS/TS source files.
 *  Run from inside the frontend folder:
 * 
 *  npm run i18n:extract
 * 
 * Auto watch:
 * 
 *  npm run i18n:watch
 * 
 * - Saves translations under src/i18n/locales/{{lng}}/{{ns}}.json.
 * - Uses "eng" as the default language; other languages remain empty by default.
 */

const SOURCE_GLOBS = ["src/**/*.{js,jsx,ts,tsx}"];
const FILE_EXTENSIONS = [".js", ".jsx", ".ts", ".tsx"];
const SUPPORTED_LANGS = ["ar", "ch", "en", "tr"];

module.exports = {
  input: SOURCE_GLOBS,
  output: "./",
  options: {
    debug: true,
    func: {
      list: ["t", "i18next.t"],
      extensions: FILE_EXTENSIONS,
    },
    trans: {
      component: "Trans",
      i18nKey: "i18nKey",
      defaultsKey: "defaults",
      extensions: FILE_EXTENSIONS,
    },
    lngs: SUPPORTED_LANGS,
    defaultLng: "en",
    defaultNs: "translation",
    keySeparator: false,
    nsSeparator: false,
    defaultValue: (lng, ns, key) => (lng === "en" ? key : ""),
    resource: {
      loadPath: "src/i18n/locales/{{lng}}/{{ns}}.json",
      savePath: "src/i18n/locales/{{lng}}/{{ns}}.json",
      jsonIndent: 2,
    },
  },
};
