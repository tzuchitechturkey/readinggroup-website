import React from "react";

import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";

function DeleteSeasonConfirmation({ onCancel, onConfirm, itemName }) {
  const { t } = useTranslation();

  return (
    <div className="space-y-4">
      <p className="text-gray-700">
        {t("Are you sure you want to delete this season?")}
      </p>
      {itemName && (
        <p className="text-sm text-gray-600">
          <span className="font-semibold">{t("Season")}:</span> {itemName}
        </p>
      )}
      <p className="text-sm text-red-600 font-medium">
        {t("This action cannot be undone.")}
      </p>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          {t("Cancel")}
        </Button>
        <Button
          type="button"
          className="bg-red-600 hover:bg-red-700 text-white"
          onClick={onConfirm}
        >
          {t("Delete")}
        </Button>
      </div>
    </div>
  );
}

export default DeleteSeasonConfirmation;
