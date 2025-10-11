import React from "react";

import { AlertTriangle, X } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";

function DeleteConfirmation({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  itemName,
}) {
  const { t } = useTranslation();

  if (!isOpen) return null;

  return (
    <div className="bg-white rounded-lg p-6 pt-0 max-w-md w-full mx-4">
      {/* Start Warning Icon */}
      <div className="mx-auto w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
        <AlertTriangle className="h-6 w-6 text-red-600" />
      </div>
      {/* End Warning Icon */}

      <div className="flex items-start gap-4">
        {/* Content */}
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {title || t("Confirm Deletion")}
          </h3>

          <div className="text-sm text-gray-600 space-y-2">
            <p>
              {message ||
                t(
                  "This action cannot be undone. This will permanently delete the selected item."
                )}
            </p>

            {itemName && (
              <div className="bg-gray-50 p-3 rounded-md border-l-4 border-red-400">
                <p className="font-medium text-gray-900">
                  {t("Item to be deleted")}:
                </p>
                <p className="text-gray-700 mt-1">"{itemName}"</p>
              </div>
            )}

            <div className="bg-yellow-50 p-3 rounded-md border-l-4 border-yellow-400 mt-4">
              <div className="flex items-center">
                <AlertTriangle className="h-4 w-4 text-yellow-600 mr-2" />
                <p className="text-sm font-medium text-yellow-800">
                  {t("Warning")}
                </p>
              </div>
              <p className="text-sm text-yellow-700 mt-1">
                {t("This action is permanent and cannot be reversed.")}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          className="px-4 py-2"
        >
          {t("Cancel")}
        </Button>

        <Button
          type="button"
          onClick={onConfirm}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white border-red-600 hover:border-red-700"
        >
          {t("Delete")}
        </Button>
      </div>
    </div>
  );
}

export default DeleteConfirmation;
