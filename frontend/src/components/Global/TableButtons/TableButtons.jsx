import React from "react";

const TableButtons = ({ totalPages, currentPage, onPageChange, t }) => {
  const pages = [];

  let startPage = Math.max(1, currentPage - 1);
  let endPage = Math.min(totalPages, currentPage + 1);

  if (currentPage === 1) {
    endPage = Math.min(totalPages, 3);
  } else if (currentPage === totalPages) {
    startPage = Math.max(1, totalPages - 2);
  }

  const baseClass =
    "px-3 py-1 border rounded cursor-pointer text-sm font-semibold";

  const activeClass = "bg-[#4680FF] text-[#ffffff] border-[#4680FF]";

  const inactiveClass =
    "bg-[#edf3ff] text-[#292d32] border-[#4680FF] hover:bg-[#4680FF] hover:text-[#ffffff]";

  for (let i = startPage; i <= endPage; i++) {
    pages.push(
      <button
        key={i}
        onClick={() => onPageChange(i)}
        className={`${baseClass} ${
          i === currentPage ? activeClass : inactiveClass
        }`}
      >
        {i}
      </button>
    );
  }

  return (
    <div className="flex flex-wrap justify-center gap-2 mt-4">
      {/* Previous */}
      <button
        onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`${baseClass} ${
          currentPage === 1 ? "opacity-50 cursor-not-allowed" : inactiveClass
        }`}
      >
        « {t("Previous")}
      </button>

      {/* First page + dots */}
      {startPage > 2 && (
        <>
          <button
            onClick={() => onPageChange(1)}
            className={`${baseClass} ${inactiveClass}`}
          >
            1
          </button>
          <span className="px-3 py-1">{`...`}</span>
        </>
      )}

      {pages}

      {/* Last page + dots */}
      {endPage < totalPages - 1 && (
        <>
          <span className="px-3 py-1">{`...`}</span>
          <button
            onClick={() => onPageChange(totalPages)}
            className={`${baseClass} ${inactiveClass}`}
          >
            {totalPages}
          </button>
        </>
      )}

      {/* Next */}
      <button
        onClick={() =>
          currentPage < totalPages && onPageChange(currentPage + 1)
        }
        disabled={currentPage === totalPages}
        className={`${baseClass} ${
          currentPage === totalPages
            ? "opacity-50 cursor-not-allowed"
            : inactiveClass
        }`}
      >
        {t("Next")} »
      </button>
    </div>
  );
};

export default TableButtons;
