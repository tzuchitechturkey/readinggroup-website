import React from "react";

import { toast } from "react-toastify";
import { ToggleRight, ToggleLeft } from "lucide-react";

import Modal from "@/components/Global/Modal/Modal";
import { LANGUAGES } from "@/Utility/Posts/constants";
import {
  validateForm,
  validateCategoryStatus,
} from "@/Utility/Posts/validation";

function CategoryModal({
  isOpen,
  onClose,
  onSubmit,
  editingCategory,
  form,
  setForm,
  errors,
  setErrors,
  selectedLanguage,
  setSelectedLanguage,
  isLoadingTranslation,
  onLoadLanguage,
  isLoading,
  t,
}) {
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // Remove error when typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleStatusToggle = () => {
    const validation = validateCategoryStatus(form, t);
    if (!validation.isValid) {
      toast.info(validation.message);
      return;
    }
    setForm((prev) => ({ ...prev, is_active: !prev.is_active }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const validation = validateForm(form, t);

    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    onSubmit(e);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editingCategory ? t("Edit Category") : t("Add Category")}
      width="600px"
    >
      <form onSubmit={handleFormSubmit} className="space-y-4">
        {/* Language Selection - Only for editing */}
        {editingCategory && editingCategory.id && (
          <div>
            <label className="block text-sm font-medium mb-1">
              {t("Language")} <span className="text-red-500">*</span>
            </label>
            <select
              value={selectedLanguage || ""}
              onChange={(e) => {
                const newLanguage = e.target.value;
                setSelectedLanguage(newLanguage);
                onLoadLanguage(editingCategory.id);
              }}
              disabled={isLoadingTranslation}
              className="w-full p-2 border border-gray-300 rounded bg-white"
            >
              <option value="" hidden disabled>
                {t("Select Language")}
              </option>
              {LANGUAGES.map((lang) => (
                <option key={lang?.value} value={lang?.value}>
                  {lang?.label}
                </option>
              ))}
            </select>
          </div>
        )}

        {isLoadingTranslation && (
          <p className="text-sm text-blue-600">{t("Loading translation...")}</p>
        )}

        <div>
          <label className="block text-sm font-medium mb-1">
            {t("Name")} <span className="text-red-500">*</span>
          </label>
          <input
            name="name"
            value={form.name}
            onChange={handleInputChange}
            disabled={isLoadingTranslation}
            className={`w-full p-2 border rounded ${
              errors.name ? "border-red-500" : "border-gray-300"
            } ${isLoadingTranslation ? "opacity-50 cursor-not-allowed" : ""}`}
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            {t("Description")}
          </label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleInputChange}
            disabled={isLoadingTranslation}
            className={`w-full p-2 border border-gray-300 rounded ${
              isLoadingTranslation ? "opacity-50 cursor-not-allowed" : ""
            }`}
            rows={4}
          />
        </div>

        {/* Is Active Toggle */}
        <div>
          <label className="block text-sm font-medium mb-3">
            {t("Status")}
          </label>
          <button
            type="button"
            disabled={isLoadingTranslation}
            onClick={handleStatusToggle}
            className={`flex items-center gap-3 px-6 py-3 rounded-lg transition-all duration-200 ${
              form.is_active
                ? "bg-green-100 text-green-600 hover:bg-green-200"
                : "bg-gray-100 text-gray-400 hover:bg-gray-200"
            } ${isLoadingTranslation ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {form.is_active ? (
              <ToggleRight className="h-8 w-12" />
            ) : (
              <ToggleLeft className="h-8 w-12" />
            )}
            <span className="text-base font-medium">
              {form?.is_active ? t("Active") : t("Inactive")}
            </span>
          </button>
        </div>

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoadingTranslation || isLoading}
            className="px-4 py-2 border rounded disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {t("Cancel")}
          </button>
          <button
            type="submit"
            disabled={isLoadingTranslation || isLoading}
            className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {editingCategory ? t("Save Changes") : t("Add Category")}
          </button>
        </div>
      </form>
    </Modal>
  );
}

export default CategoryModal;
