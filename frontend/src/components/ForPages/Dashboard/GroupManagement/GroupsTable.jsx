import React from "react";

import {
  Edit,
  Trash2,
  Search,
} from "lucide-react";
import { useTranslation } from "react-i18next";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import SortIcon from "@/components/Global/SortIcon/SortIcon";

const GroupsTable = ({
  groupsData,
  search,
  sortConfig,
  sortData,
  onEdit,
  onDelete,
  onClearSearch,
}) => {
  const { t } = useTranslation();

  if (groupsData.length === 0) {
    return (
      <Table>
        <TableHeader className="bg-[#FAFAFA] h-14">
          <TableRow className="border-b">
            <TableHead colSpan="10" className="text-center">
              <div className="flex flex-col items-center justify-center text-gray-500 py-8">
                <Search className="w-8 h-8 mb-2 text-gray-300" />
                <p className="text-sm">
                  {search
                    ? t("No groups found matching your search")
                    : t("No groups available")}
                </p>
                {search && (
                  <button
                    onClick={onClearSearch}
                    className="mt-2 text-blue-600 text-sm hover:text-blue-800"
                  >
                    {t("Clear Search")}
                  </button>
                )}
              </div>
            </TableHead>
          </TableRow>
        </TableHeader>
      </Table>
    );
  }

  return (
    <Table>
      <TableHeader className="bg-[#FAFAFA] h-14">
        <TableRow className="border-b">
          <TableHead className="text-center text-[#5B6B79] font-medium text-xs px-3">
            <div
              className="flex items-center justify-center gap-1 cursor-pointer hover:text-[#1E1E1E]"
              onClick={() => sortData("id")}
            >
              {t("ID")}
              <SortIcon sortConfig={sortConfig} columnKey="id" />
            </div>
          </TableHead>
          <TableHead className="text-center text-[#5B6B79] font-medium text-xs">
            <div
              className="flex items-center justify-center gap-1 cursor-pointer hover:text-[#1E1E1E]"
              onClick={() => sortData("name")}
            >
              {t("Name")}
              <SortIcon sortConfig={sortConfig} columnKey="name" />
            </div>
          </TableHead>
          <TableHead className="text-center text-[#5B6B79] font-medium text-xs">
            <div className="flex items-center justify-center gap-1 cursor-pointer hover:text-[#1E1E1E]">
              {t("Actions")}
            </div>
          </TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {groupsData.map((group, index) => (
          <TableRow key={group.id} className="border-b hover:bg-gray-50">
            <TableCell className="text-center text-sm text-gray-600 px-3">
              {group.id}
            </TableCell>
            <TableCell className="text-center text-sm text-gray-600">
              {group.name}
            </TableCell>
            <TableCell className="text-center">
              <div className="flex items-center justify-center gap-2">
                <button
                  onClick={() => onEdit(group)}
                  className="p-2 rounded-lg hover:bg-blue-50 text-blue-600 hover:text-blue-800 transition-colors"
                  title={t("Edit")}
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onDelete(group)}
                  className="p-2 rounded-lg hover:bg-red-50 text-red-600 hover:text-red-800 transition-colors"
                  title={t("Delete")}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default GroupsTable;
