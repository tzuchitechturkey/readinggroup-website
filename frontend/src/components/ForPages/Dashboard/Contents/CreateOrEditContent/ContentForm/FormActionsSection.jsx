import { Save } from "lucide-react";
import { Button } from "@/components/ui/button";

export const FormActionsSection = ({
  t,
  content,
  hasChanges,
  isLoading,
  onCancel,
  handleSubmit,
}) => {
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Hidden submit for accessibility */}
      <button type="submit" className="hidden" />
      
      <div className="flex items-center justify-end gap-3 pt-6 border-t">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
        >
          {t("Cancel")}
        </Button>
        <Button
          type="submit"
          className="flex items-center gap-2"
          disabled={content && !hasChanges}
        >
          <Save className="h-4 w-4" />
          {isLoading
            ? t("Saving...")
            : content
              ? t("Update Content")
              : t("Create Content")}
        </Button>
      </div>
    </form>
  );
};
