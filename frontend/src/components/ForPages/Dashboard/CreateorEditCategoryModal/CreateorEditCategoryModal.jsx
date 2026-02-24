import React, { useMemo, useState } from "react";

import { toast } from "react-toastify";
import { ToggleLeft, ToggleRight } from "lucide-react";

import Modal from "@/components/Global/Modal/Modal";
import { languages } from "@/constants/constants";

function CreateorEditCategoryModal({
  // Modal Control
  isOpen,
  onClose,
  title,
  width = "600px",

  // Form Data
  form,
  setForm,
  originalForm,

  // Language & Translation
  selectedLanguage,
  setSelectedLanguage,
  // originalLanguage,
  isAutoTranslated,
  setIsAutoTranslated,

  // API & Loading
  onSubmit,
  isLoading,
  // onFetchTranslation,
  // isLoadingTranslation = false,

  // Form Fields Configuration
  fields = [], // مثال: [{name: "name", label: "Name", type: "text", required: true}, ...]

  // Validation
  onValidate,
  errors = {},
  setErrors,

  // Localization
  t,

  // Optional: Toggle Fields
  toggleFields = [], // مثال: [{name: "is_active", label: "Status", color: "green"}]

  // Optional: Show Language Selector
  showLanguageSelector = true,

  // Optional: Show Auto-Translate
  showAutoTranslate = false,
}) {
  const [localErrors, setLocalErrors] = useState({});
  const errorState = errors || localErrors;
  const setErrorState = setErrors || setLocalErrors;

  // Check if content changed
  const isContentChanged = useMemo(() => {
    if (!originalForm || !form) return false;
    return Object.keys(originalForm).some(
      (key) => form[key] !== originalForm[key],
    );
  }, [form, originalForm]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    if (errorState[name]) {
      setErrorState((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleToggleChange = (fieldName) => {
    const field = toggleFields.find((f) => f.name === fieldName);

    // التحقق من الشروط الإضافية
    if (field?.validation) {
      const validationResult = field.validation(form);
      if (!validationResult.isValid) {
        toast.info(validationResult.message);
        return;
      }
    }

    setForm((prev) => ({ ...prev, [fieldName]: !prev[fieldName] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (onValidate && !onValidate(form)) {
      return;
    }

    await onSubmit(form, selectedLanguage, isAutoTranslated);
    onClose();
  };

  const getToggleColor = (fieldName) => {
    const field = toggleFields.find((f) => f.name === fieldName);
    const isActive = form[fieldName];
    const color = field?.color || "blue";
    const colors = {
      green: isActive
        ? "bg-green-100 text-green-600 hover:bg-green-200"
        : "bg-gray-100 text-gray-400 hover:bg-gray-200",
      blue: isActive
        ? "bg-blue-100 text-blue-600 hover:bg-blue-200"
        : "bg-gray-100 text-gray-400 hover:bg-gray-200",
      purple: isActive
        ? "bg-purple-100 text-purple-600 hover:bg-purple-200"
        : "bg-gray-100 text-gray-400 hover:bg-gray-200",
    };
    return colors[color] || colors.blue;
  };
  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} width={width}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Language Selector */}
        {showLanguageSelector && form?.id && (
          <div className="flex items-center gap-2">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">
                {t("Language")} <span className="text-red-500">*</span>
              </label>
              <select
                value={selectedLanguage || ""}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                // disabled={isLoadingTranslation}
                className="w-full p-2 border border-gray-300 rounded bg-white"
              >
                <option value="" hidden disabled>
                  {t("Select Language")}
                </option>
                {languages.map((lang) => (
                  <option key={lang?.code} value={lang?.code}>
                    {lang?.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Fetch Translation Button */}
            {/* {selectedLanguage && selectedLanguage !== originalLanguage && (
              <button
                type="button"
                onClick={() => onFetchTranslation?.(selectedLanguage)}
                disabled={isLoadingTranslation}
                className="mt-6 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 transition-all"
              >
                {t("Fetch Translation")}
              </button>
            )} */}
          </div>
        )}

        {/* {isLoadingTranslation && (
          <p className="text-sm text-blue-600">{t("Loading translation...")}</p>
        )} */}

        {/* Dynamic Fields */}
        {fields.map((field) => (
          <div key={field.name}>
            <label className="block text-sm font-medium mb-1">
              {field.label}{" "}
              {field.required && <span className="text-red-500">*</span>}
            </label>
            {field.type === "textarea" ? (
              <textarea
                name={field.name}
                value={form[field.name] || ""}
                onChange={handleInputChange}
                // disabled={isLoadingTranslation}
                rows={field.rows || 4}
                className={`w-full p-2 border rounded ${
                  errorState[field.name] ? "border-red-500" : "border-gray-300"
                } 
                `}
                // ${isLoadingTranslation ? "opacity-50 cursor-not-allowed" : ""}
              />
            ) : field.type === "text" ? (
              <input
                type={field.type || "text"}
                name={field.name}
                value={form[field.name] || ""}
                onChange={handleInputChange}
                // disabled={isLoadingTranslation}
                className={`w-full p-2 border rounded ${
                  errorState[field.name] ? "border-red-500" : "border-gray-300"
                }
                `}
                // ${isLoadingTranslation ? "opacity-50 cursor-not-allowed" : ""}
              />
            ) : field.type === "select" ? (
              <select
                name={field.name}
                value={form[field.name] || ""}
                onChange={handleInputChange}
                // disabled={isLoadingTranslation}
                className={`w-full p-2 border rounded ${
                  errorState[field.name] ? "border-red-500" : "border-gray-300"
                }
                `}
                // ${isLoadingTranslation ? "opacity-50 cursor-not-allowed" : ""}
              >
                <option value="" hidden disabled>
                  {t("Select an option")}
                </option>
                {field.options?.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            ) : (
              ""
            )}

            {errorState[field.name] && (
              <p className="text-red-500 text-sm mt-1">
                {errorState[field.name]}
              </p>
            )}
          </div>
        ))}

        {/* Dynamic Toggle Fields */}
        {toggleFields.map((field) => (
          <div key={field.name}>
            <label className="block text-sm font-medium mb-3">
              {field.label}
            </label>
            <button
              type="button"
              onClick={() => handleToggleChange(field.name)}
              // disabled={isLoadingTranslation}
              className={`flex items-center gap-3 px-6 py-3 rounded-lg transition-all ${getToggleColor(field.name)} `}
              // isLoadingTranslation ? "opacity-50 cursor-not-allowed" : ""
            >
              {form[field.name] ? (
                <ToggleRight className="h-8 w-12" />
              ) : (
                <ToggleLeft className="h-8 w-12" />
              )}
              <span className="text-base font-medium">
                {form[field.name]
                  ? t(field.activeLabel || "Active")
                  : t(field.inactiveLabel || "Inactive")}
              </span>
            </button>
          </div>
        ))}

        {/* Auto-Translate */}
        {showAutoTranslate && form?.id && isContentChanged && (
          <div>
            <label className="block text-sm font-medium mb-3">
              {t("Auto-Translate")}
            </label>
            <button
              type="button"
              onClick={() => setIsAutoTranslated(!isAutoTranslated)}
              // disabled={isLoadingTranslation}
              className={`flex items-center gap-3 px-6 py-3 rounded-lg transition-all ${
                isAutoTranslated
                  ? "bg-purple-100 text-purple-600 hover:bg-purple-200"
                  : "bg-gray-100 text-gray-400 hover:bg-gray-200"
              } 
              `}
              // ${isLoadingTranslation ? "opacity-50 cursor-not-allowed" : ""}
            >
              {isAutoTranslated ? (
                <ToggleRight className="h-8 w-12" />
              ) : (
                <ToggleLeft className="h-8 w-12" />
              )}
              <span className="text-base font-medium">
                {t("Generate automatic translation for other languages")}
              </span>
            </button>
          </div>
        )}

        {/* Buttons */}
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            // disabled={isLoadingTranslation || isLoading}
            className="px-4 py-2 border rounded disabled:opacity-50"
          >
            {t("Cancel")}
          </button>
          <button
            type="submit"
            // disabled={isLoadingTranslation || isLoading}
            className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
          >
            {t(form?.id ? "Save Changes" : "Add")}
          </button>
        </div>
      </form>
    </Modal>
  );
}

export default CreateorEditCategoryModal;
