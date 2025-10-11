import React, { useRef } from "react";

import { MoreVertical } from "lucide-react";

export default function SubMenu({
  isOpen,
  onOpenChange,
  items,
  iconSize = 20,
}) {
  const ref = useRef(null);
  // Close when focus leaves the menu container
  const handleBlur = (e) => {
    const current = ref.current;
    if (!current) return;
    if (!current.contains(e.relatedTarget)) {
      onOpenChange(false);
    }
  };

  return (
    <div className="relative" ref={ref} onBlur={handleBlur}>
      <button
        type="button"
        className="p-2 rounded hover:bg-gray-200"
        onClick={() => onOpenChange(!isOpen)}
        aria-haspopup="menu"
        aria-expanded={isOpen}
      >
        <MoreVertical size={iconSize} />
      </button>
      {isOpen && (
        <div
          className="absolute top-1 -right-10 mt-4 w-48 bg-white border rounded shadow-lg z-10"
          tabIndex={-1}
        >
          <ul className="py-1 text-sm text-[#1E1E1E]">
            {items?.map((item, index) => (
              <li
                key={index}
                className="px-4 py-2 mx-1 hover:bg-gray-100 cursor-pointer"
              >
                {item?.label}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
