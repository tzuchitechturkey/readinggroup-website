import { useTranslation } from "react-i18next";
import { ToggleLeft, ToggleRight } from "lucide-react";

import Modal from "@/components/Global/Modal/Modal";

const CreateorEditEventCategory = ({
  isOpen,
  onClose,
  isEditing,
  form,
  errors,
  toggleFields,
  onInputChange,
  onToggle,
  onSubmit,
}) => {
  const { t } = useTranslation();

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? t("Edit Category") : t("Add Category")}
      width="600px"
    >
      <form onSubmit={onSubmit} className="space-y-4">
        {/* Name Field */}
        <div>
          <label className="block text-sm font-medium mb-1">
            {t("Name")} <span className="text-red-500">*</span>
          </label>
          <input
            name="name"
            value={form.name}
            onChange={onInputChange}
            className={`w-full p-2 border rounded ${
              errors.name ? "border-red-500" : "border-gray-300"
            }`}
            placeholder={t("Enter category name")}
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name}</p>
          )}
        </div>

        {/* Description Field */}
        <div>
          <label className="block text-sm font-medium mb-1">
            {t("Description")}
          </label>
          <textarea
            name="description"
            value={form.description}
            onChange={onInputChange}
            className="w-full p-2 border border-gray-300 rounded"
            rows={4}
            placeholder={t("Enter category description")}
          />
        </div>

        {/* Status Toggle */}
        {toggleFields?.includes("is_active") && (
          <div>
            <label className="block text-sm font-medium mb-3">
              {t("Status")}
            </label>
            <button
              type="button"
              onClick={() => onToggle("is_active", form.is_active)}
              className={`flex items-center gap-3 px-6 py-3 rounded-lg transition-all duration-200 ${
                form.is_active
                  ? "bg-green-100 text-green-600 hover:bg-green-200"
                  : "bg-gray-100 text-gray-400 hover:bg-gray-200"
              }`}
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
        )}

        {/* Action Buttons */}
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border rounded hover:bg-gray-50"
          >
            {t("Cancel")}
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            {isEditing ? t("Save Changes") : t("Add Category")}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateorEditEventCategory;
