import { useTranslation } from "react-i18next";
import { AlertCircle, X } from "lucide-react";

export const BasicDetailsSection = ({
  formData,
  categoriesList,
  categorySearchValue,
  showCategoryDropdown,
  categoryDropdownRef,
  onInputChange,
  onCategorySelect,
  onCategorySearch,
  onCategoryDropdownToggle,
  errors,
}) => {
  const { t } = useTranslation();

  return (
    <div className="space-y-4">
      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {t("Title")} <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="title"
          value={formData?.title}
          onChange={onInputChange}
          placeholder={t("Enter video title")}
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors?.title ? "border-red-500" : "border-gray-300"
          }`}
        />
        {errors?.title && (
          <div className="flex items-center gap-2 text-red-600 text-sm mt-1">
            <AlertCircle size={16} />
            <span>{errors.title}</span>
          </div>
        )}
      </div>

      {/* Category */}
      <div ref={categoryDropdownRef} className="relative">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {t("Category")} <span className="text-red-500">*</span>
        </label>
        <button
          type="button"
          onClick={() => onCategoryDropdownToggle(!showCategoryDropdown)}
          className={`w-full px-3 py-2 border rounded-lg text-left focus:outline-none focus:ring-2 focus:ring-blue-500 flex justify-between items-center ${
            errors?.category ? "border-red-500" : "border-gray-300"
          }`}
        >
          <span>
            {categoriesList?.find(
              (cat) =>
                cat?.id === (formData?.category?.id || formData?.category),
            )?.name || t("Select category")}
          </span>
          <span className="text-gray-400">▼</span>
        </button>

        {showCategoryDropdown && (
          <div className="absolute z-10 w-full mt-1 border border-gray-300 rounded-lg bg-white shadow-lg">
            <input
              type="text"
              placeholder={t("Search categories")}
              value={categorySearchValue}
              onChange={(e) => onCategorySearch(e.target.value)}
              className="w-full px-3 py-2 border-b border-gray-200 focus:outline-none"
            />
            <div className="max-h-48 overflow-y-auto">
              {categoriesList?.length > 0 ? (
                categoriesList.map((category) => (
                  <button
                    key={category?.id}
                    type="button"
                    onClick={() => onCategorySelect(category)}
                    className="w-full text-left px-3 py-2 hover:bg-gray-100 transition-colors"
                  >
                    {category?.name}
                  </button>
                ))
              ) : (
                <div className="px-3 py-2 text-gray-500 text-sm">
                  {t("No categories found")}
                </div>
              )}
            </div>
          </div>
        )}

        {errors?.category && (
          <div className="flex items-center gap-2 text-red-600 text-sm mt-1">
            <AlertCircle size={16} />
            <span>{errors.category}</span>
          </div>
        )}
      </div>
    </div>
  );
};
