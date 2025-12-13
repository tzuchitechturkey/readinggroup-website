import React, { useState, useCallback, useRef, useEffect } from "react";

import { X, ChevronDown, Search } from "lucide-react";
import { useTranslation } from "react-i18next";

import { cn } from "@/lib/utils";

/**
 * MultiSelect Component - Select multiple items from a list
 * @param {Array} items - List of items to select from
 * @param {Array} selected - Currently selected items
 * @param {Function} onChange - Callback when selection changes
 * @param {String} placeholder - Placeholder text
 * @param {Function} renderLabel - Function to render item label
 * @param {Function} renderValue - Function to render selected value (optional)
 * @param {Boolean} searchable - Enable search functionality
 * @param {String} className - Additional CSS classes
 */
const MultiSelect = ({
  items = [],
  selected = [],
  onChange,
  placeholder = "Select items...",
  renderLabel = (item) => item.name || item,
  renderValue = (item) => item.name || item,
  searchable = true,
  className = "",
  disabled = false,
}) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const containerRef = useRef(null);
  const searchInputRef = useRef(null);

  // Filter items based on search term
  const filteredItems = useCallback(() => {
    if (!searchable || !searchTerm) return items;
    return items.filter((item) =>
      renderLabel(item).toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [items, searchTerm, searchable, renderLabel]);

  // Handle selection toggle
  const handleSelect = (item) => {
    const isSelected = selected.some(
      (s) => renderValue(s) === renderValue(item)
    );

    if (isSelected) {
      onChange(selected.filter((s) => renderValue(s) !== renderValue(item)));
    } else {
      onChange([...selected, item]);
    }
  };

  // Handle removing a selected item
  const handleRemove = (item, e) => {
    e.stopPropagation();
    onChange(selected.filter((s) => renderValue(s) !== renderValue(item)));
  };

  // Handle clicking outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchable && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen, searchable]);

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative w-full border rounded-lg",
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
    >
      {/* Main Button/Display */}
      <button
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className="w-full min-h-10 rounded-md border-0 bg-white px-3 text-sm text-gray-800 outline-none ring-2 ring-transparent focus:ring-white/80 transition-all flex items-center justify-between hover:ring-blue-200 disabled:cursor-not-allowed"
      >
        <div className="flex-1 flex flex-wrap items-center gap-1 text-left ">
          {selected.length > 0 ? (
            <div className="flex flex-wrap gap-1 ">
              {selected.map((item, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs font-medium"
                >
                  {renderValue(item)}
                  <div
                    onClick={(e) => handleRemove(item, e)}
                    className="hover:text-blue-900"
                    type="button"
                  >
                    <X className="h-3 w-3" />
                  </div>
                </span>
              ))}
            </div>
          ) : (
            <span className="text-gray-500">{placeholder}</span>
          )}
        </div>
        <ChevronDown
          className={cn(
            "h-4 w-4 text-gray-400 transition-transform flex-shrink-0",
            isOpen && "rotate-180"
          )}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && !disabled && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-50">
          {/* Search Input */}
          {searchable && (
            <div className="p-2 border-b border-gray-200">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder={t("Search...")}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 text-sm border border-gray-200 text-black rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
            </div>
          )}

          {/* Items List */}
          <div className="max-h-48 overflow-y-auto">
            {filteredItems().length > 0 ? (
              filteredItems().map((item, index) => {
                const isSelected = selected.some(
                  (s) => renderValue(s) === renderValue(item)
                );
                return (
                  <button
                    key={index}
                    onClick={() => handleSelect(item)}
                    className={cn(
                      "w-full px-3 py-2 text-sm text-left hover:bg-gray-100 transition-colors flex items-center gap-2",
                      isSelected && "bg-blue-50"
                    )}
                    type="button"
                  >
                    {/* Checkbox */}
                    <div
                      className={cn(
                        "w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all",
                        isSelected
                          ? "bg-blue-600 border-blue-600"
                          : "border-gray-300 hover:border-blue-400"
                      )}
                    >
                      {isSelected && (
                        <svg
                          className="w-3 h-3 text-white"
                          fill="none"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                    {/* Label */}
                    {item.avatar && (
                      <img
                        src={item.avatar}
                        alt=""
                        className="w-6 h-6 rounded-full"
                      />
                    )}
                    <span
                      className={
                        isSelected
                          ? "font-semibold text-blue-900"
                          : "text-gray-800"
                      }
                    >
                      {renderLabel(item)}
                    </span>
                  </button>
                );
              })
            ) : (
              <div className="px-3 py-8 text-center text-sm text-gray-500">
                {t("No items found")}
              </div>
            )}
          </div>

          {/* Footer with count */}
          {selected.length > 0 && (
            <div className="px-3 py-2 border-t border-gray-200 text-xs text-gray-600 bg-gray-50">
              {selected.length} {t("selected")}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MultiSelect;
