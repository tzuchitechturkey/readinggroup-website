import React from "react";

import { Search, X, Tag } from "lucide-react";
import { useTranslation } from "react-i18next";

/**
 * CategorySelectionDropdown Component
 * Reusable dropdown for selecting a category
 */
function CategorySelectionDropdown({
  showDropdown,
  onToggleDropdown,
  selectedCategoryId,
  categoriesList,
  categorySearchValue,
  onSearchChange,
  onSearch,
  onClearSearch,
  onSelect,
  errors,
  dropdownRef,
}) {
  const { t } = useTranslation();

  const selectedCategory = categoriesList.find(
    (cat) => cat.id === selectedCategoryId,
  );

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => onToggleDropdown(!showDropdown)}
        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-left flex items-center gap-3 ${
          errors.category ? "border-red-500" : "border-gray-300"
        }`}
      >
        {selectedCategoryId ? (
          <>
            <Tag className="w-5 h-5 text-blue-600" />
            <div className="flex-1">
              <div className="font-medium text-sm">
                {selectedCategory?.name || t("Select Category")}
              </div>
            </div>
          </>
        ) : (
          <>
            <Tag className="w-5 h-5 text-gray-400" />
            <span className="text-gray-500">{t("Select Category")}</span>
          </>
        )}
      </button>

      {showDropdown && (
        <div className="absolute top-full left-0 right-0 z-10 mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-80 overflow-hidden">
          {/* Search Box */}
          <div className="p-3 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={categorySearchValue}
                  onChange={(e) => onSearchChange(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      onSearch();
                    }
                  }}
                  placeholder={t("Search categories...")}
                  className="w-full px-3 py-1.5 pr-8 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
                {categorySearchValue && (
                  <button
                    type="button"
                    onClick={() => {
                      onClearSearch();
                    }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
              <button
                type="button"
                onClick={onSearch}
                className="p-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                title={t("Search")}
              >
                <Search className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Categories List */}
          <div className="max-h-60 overflow-y-auto">
            {categoriesList.length > 0 ? (
              categoriesList.map((category) => (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => onSelect(category)}
                  className="w-full px-3 py-2 text-left hover:bg-gray-50 flex items-center gap-3"
                >
                  <Tag className="w-5 h-5 text-blue-600" />
                  <div className="flex-1">
                    <div className="font-medium text-sm">
                      {category.name}
                    </div>
                    {category.description && (
                      <div className="text-xs text-gray-500">
                        {category.description}
                      </div>
                    )}
                  </div>
                </button>
              ))
            ) : (
              <div className="px-3 py-4 text-center text-gray-500 text-sm">
                {t("No categories found")}
              </div>
            )}
          </div>
        </div>
      )}

      {errors.category && (
        <p className="text-red-500 text-xs mt-1">{errors.category}</p>
      )}
    </div>
  );
}

export default CategorySelectionDropdown;
