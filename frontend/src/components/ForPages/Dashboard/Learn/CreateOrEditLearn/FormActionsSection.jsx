import React from "react";

import { Save } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";

function FormActionsSection({
  isLoading,
  hasChanges,
  learn,
  onCancel,
  onSubmit,
}) {
  const { t } = useTranslation();

  return (
    <div className="flex items-center justify-end gap-3 pt-6 border-t">
      <Button type="button" variant="outline" onClick={onCancel}>
        {t("Cancel")}
      </Button>
      <Button
        type="submit"
        className="flex items-center gap-2"
        disabled={learn && !hasChanges}
        onClick={onSubmit}
      >
        <Save className="h-4 w-4" />
        {isLoading
          ? t("Saving...")
          : learn
            ? t("Update Learn")
            : t("Create Learn")}
      </Button>
    </div>
  );
}

export default FormActionsSection;
