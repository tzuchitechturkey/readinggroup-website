import React from "react";
import { toast } from "react-toastify";
import { SortPostCategories } from "@/api/posts";

function OrderButtons({
  hasChanges,
  isSorting,
  onSaveOrder,
  onCancelOrder,
  t,
}) {
  return (
    hasChanges && (
      <div className="flex gap-3 p-4 bg-yellow-50 border-t border-yellow-200">
        <div className="flex-1 flex items-center gap-2">
          <div className="w-2 h-2 bg-yellow-500 rounded-full" />
          <span className="text-sm text-yellow-700">
            {t("You have unsaved changes in the category order")}
          </span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onCancelOrder}
            disabled={isSorting}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {t("Cancel")}
          </button>
          <button
            onClick={onSaveOrder}
            disabled={isSorting}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
          >
            {isSorting ? (
              <>
                <span className="inline-block animate-spin">⟳</span>
                {t("Saving...")}
              </>
            ) : (
              `✓ ${t("Save Changes")}`
            )}
          </button>
        </div>
      </div>
    )
  );
}

export default OrderButtons;
