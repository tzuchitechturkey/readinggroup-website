import React from "react";

import { 
  Eye, 
  ToggleRight, 
  ToggleLeft 
} from "lucide-react";
import { LuPencil, LuTrash2 } from "react-icons/lu";
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

const ContentsTable = ({
  contents,
  search,
  isLoading,
  sortConfig,
  sortData,
  onView,
  onEdit,
  onDelete,
  onWeeklyToggle,
  onClearSearch,
}) => {
  const { t } = useTranslation();

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <Table>
          <TableHeader className="bg-[#FAFAFA] h-14">
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8">
                <div className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600" />
                  {t("Loading Content...")}
                </div>
              </TableCell>
            </TableRow>
          </TableHeader>
        </Table>
      </div>
    );
  }

  if (contents.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <Table>
          <TableHeader className="bg-[#FAFAFA] h-14">
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                {search
                  ? t("No Content found matching your search.")
                  : t("No Content available.")}
                {search && (
                  <button
                    onClick={onClearSearch}
                    className="mt-2 text-blue-600 text-sm hover:text-blue-800 block mx-auto"
                  >
                    {t("Clear Search")}
                  </button>
                )}
              </TableCell>
            </TableRow>
          </TableHeader>
        </Table>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <Table>
        <TableHeader className="bg-[#FAFAFA] h-14">
          <TableRow>
            <TableHead className="text-[#5B6B79] text-center font-medium text-xs px-3">
              <button
                onClick={() => sortData("id")}
                className="flex items-center gap-1 font-medium"
              >
                #{getSortIcon("id") && <SortIcon sortConfig={sortConfig} columnKey="id" />}
              </button>
            </TableHead>
            <TableHead className="text-[#5B6B79] text-center font-medium text-xs">
              <div className="flex items-center justify-center gap-1 cursor-pointer hover:text-[#1E1E1E]">
                <button
                  onClick={() => sortData("title")}
                  className="flex items-center gap-1 font-medium"
                >
                  {t("Title")}
                  <SortIcon sortConfig={sortConfig} columnKey="title" />
                </button>
              </div>
            </TableHead>
            <TableHead>
              <div className="flex items-center justify-center gap-1 cursor-pointer hover:text-[#1E1E1E]">
                <span className="font-medium">{t("Images")}</span>
              </div>
            </TableHead>
            <TableHead className="text-[#5B6B79] text-center font-medium text-xs">
              <div className="flex items-center justify-center gap-1 cursor-pointer hover:text-[#1E1E1E]">
                <button
                  onClick={() => sortData("created_at")}
                  className="flex items-center gap-1 font-medium"
                >
                  {t("Date")}
                  <SortIcon sortConfig={sortConfig} columnKey="created_at" />
                </button>
              </div>
            </TableHead>
            <TableHead className="hidden sm:table-cell">
              <div className="flex items-center justify-center gap-1 cursor-pointer hover:text-[#1E1E1E]">
                <button
                  onClick={() => sortData("category")}
                  className="flex items-center gap-1 font-medium"
                >
                  {t("Category")}
                  <SortIcon sortConfig={sortConfig} columnKey="category" />
                </button>
              </div>
            </TableHead>
            <TableHead className="text-center text-[#5B6B79] font-medium text-xs">
              <div className="flex items-center justify-center gap-1 cursor-pointer hover:text-[#1E1E1E]">
                {t("Weekly List")}
              </div>
            </TableHead>
            <TableHead className="text-center w-[100px]">
              {t("Actions")}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {contents.map((content) => (
            <TableRow key={content?.id} className="hover:bg-gray-50">
              <TableCell className="text-[#1E1E1E] font-bold text-[11px] py-4 px-4">
                {content?.id}
              </TableCell>
              <TableCell>
                <div className="min-w-0 text-center">
                  <p className="font-medium text-gray-900 truncate">
                    {content?.title}
                  </p>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center justify-center gap-3">
                  <img
                    src={content?.images?.[0]?.image || content?.image_url?.[0]}
                    alt={content?.title}
                    className="w-12 h-12 rounded-lg object-cover"
                    onError={(e) => {
                      e.target.src = "/placeholder-image.png";
                    }}
                  />
                </div>
              </TableCell>
              <TableCell className="text-[#1E1E1E] text-center text-[11px] py-4">
                <div className="flex flex-col items-center">
                  <span className="font-medium">
                    {new Date(content.created_at).toLocaleDateString("en-GB", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                    })}
                  </span>
                </div>
              </TableCell>
              <TableCell className="hidden sm:table-cell text-center">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {content?.category?.name}
                </span>
              </TableCell>
              <TableCell className="text-center py-4">
                <button
                  onClick={() =>
                    onWeeklyToggle(content?.id, content?.is_weekly_moment, content?.status)
                  }
                  className={`py-1 rounded-full text-[10px] font-medium transition-colors ${
                    content?.is_weekly_moment
                      ? "bg-green-100 text-green-800 hover:bg-green-200"
                      : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                  }`}
                >
                  {content?.is_weekly_moment ? (
                    <ToggleRight className="h-8 w-12" />
                  ) : (
                    <ToggleLeft className="h-8 w-12" />
                  )}
                </button>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <button
                    title={t("View Details")}
                    onClick={() => onView(content)}
                    className="p-1 rounded hover:bg-gray-100 hover:text-blue-600"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => onEdit(content)}
                    className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded"
                    title={t("Edit")}
                  >
                    <LuPencil className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => onDelete(content)}
                    className="p-1 text-red-600 hover:text-red-800 hover:bg-red-100 rounded"
                    title={t("Delete")}
                  >
                    <LuTrash2 className="h-4 w-4" />
                  </button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ContentsTable;