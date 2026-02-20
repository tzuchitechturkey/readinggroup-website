import React from "react";
import { Save } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";

/**
 * FormActionsSection Component
 * Handles form submit and cancel actions
 */
function FormActionsSection({ isLoading, hasChanges, post, onCancel, onSubmit }) {
  const { t } = useTranslation();

  return (
    <div className="flex items-center justify-end gap-3 pt-6 border-t">
      <Button type="button" variant="outline" onClick={onCancel}>
        {t("Cancel")}
      </Button>
      <Button
        type="submit"
        className="flex items-center gap-2"
        disabled={post && !hasChanges}
        onClick={onSubmit}
      >
        <Save className="h-4 w-4" />
        {isLoading
          ? t("Saving...")
          : post
            ? t("Update Post")
            : t("Create Post")}
      </Button>
    </div>
  );
}

export default FormActionsSection;
