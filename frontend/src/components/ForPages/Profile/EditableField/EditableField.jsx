import React from "react";

import { Edit3, Check, X } from "lucide-react";

const EditableField = ({
  label,
  value,
  isEditing,
  onEdit,
  onSave,
  onCancel,
  onChange,
  multiline = false,
  placeholder = "",
  disabled = false,
}) => (
  <div className="space-y-1">
    <div className="flex items-center justify-between">
      <div className="text-sm font-normal text-[#5B6B79]">{label}</div>
      {!disabled && (
        <div className="flex items-center gap-1">
          {!isEditing ? (
            <button
              onClick={onEdit}
              className="p-1 text-gray-400 hover:text-blue-500 transition-colors duration-200"
              aria-label={`Edit ${label}`}
            >
              <Edit3 size={14} />
            </button>
          ) : (
            <>
              <button
                onClick={onSave}
                className="p-1 text-green-500 hover:text-green-600 transition-colors duration-200"
                aria-label={`Save ${label}`}
              >
                <Check size={14} />
              </button>
              <button
                onClick={onCancel}
                className="p-1 text-red-500 hover:text-red-600 transition-colors duration-200"
                aria-label={`Cancel edit ${label}`}
              >
                <X size={14} />
              </button>
            </>
          )}
        </div>
      )}
    </div>
    <div className="text-sm text-[#1D2630]">
      <div className="transition-all duration-300 ease-in-out">
        {isEditing ? (
          multiline ? (
            <textarea
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder={placeholder}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all duration-200 animate-in fade-in-0"
              rows={3}
              autoFocus
            />
          ) : (
            <input
              type="text"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder={placeholder}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 animate-in fade-in-0"
              autoFocus
            />
          )
        ) : (
          <span className="transition-all duration-300 ease-in-out cursor-pointer hover:text-gray-700">
            {value || placeholder || "No information provided"}
          </span>
        )}
      </div>
    </div>
  </div>
);
export default EditableField;
