import React from "react";

function CustomBreadcrumb({ backTitle, onBack, page }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2 ">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => onBack()}
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800"
          >
            ← {backTitle}
          </button>
          <div className="h-4 w-px bg-gray-300" />
          <h2 className="text-xl font-semibold text-[#1D2630]">{page}</h2>
        </div>
      </div>
    </div>
  );
}

export default CustomBreadcrumb;
