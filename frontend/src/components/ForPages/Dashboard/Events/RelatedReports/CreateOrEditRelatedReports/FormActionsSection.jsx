import React from "react";

import { Save, X } from "lucide-react";

const FormActionsSection = ({ hasChanges, isLoading, isEdit, onCancel, t }) => {
  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200">
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600">
          {hasChanges ? (
            <span className="text-amber-600 font-medium">
              {t("You have unsaved changes")}
            </span>
          ) : (
            <span>{t("No changes made")}</span>
          )}
        </div>

        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            <X className="w-4 h-4 mr-2 inline" />
            {t("Cancel")}
          </button>

          <button
            type="submit"
            disabled={isLoading || !hasChanges}
            className={`px-6 py-2 text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors inline-flex items-center ${
              isLoading || !hasChanges
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                {isEdit ? t("Updating...") : t("Creating...")}
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                {isEdit ? t("Update Report") : t("Create Report")}
              </>
            )}
          </button>
        </div>
      </div>

      {!hasChanges && (
        <p className="text-xs text-gray-500 mt-2">
          {t("Make changes to enable the save button")}
        </p>
      )}
    </div>
  );
};
export default FormActionsSection;
