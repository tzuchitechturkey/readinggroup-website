import React from "react";
import { LuArrowUpDown } from "react-icons/lu";

const SortIcon = ({ sortConfig, columnKey }) => {
  if (sortConfig.key !== columnKey) {
    return <LuArrowUpDown className="h-3 w-3 text-gray-400" />;
  }

  if (sortConfig.direction === "asc") {
    return <LuArrowUpDown className="h-3 w-3 text-blue-600 rotate-180" />;
  }

  if (sortConfig.direction === "desc") {
    return <LuArrowUpDown className="h-3 w-3 text-blue-600" />;
  }

  return <LuArrowUpDown className="h-3 w-3 text-gray-400" />;
};

export default SortIcon;