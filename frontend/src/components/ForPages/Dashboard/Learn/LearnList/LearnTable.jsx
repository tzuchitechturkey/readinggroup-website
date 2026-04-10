import React from "react";

import {
  Eye,
  Edit,
  Trash2,
  Search,
  ToggleRight,
  ToggleLeft,
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

const LearnTable = ({
  learnData,
  search,
  sortConfig,
  sortData,
  onView,
  onEdit,
  onDelete,
  onClearSearch,
}) => {
  const { t } = useTranslation();

  if (learnData.length === 0) {
    return (
      <Table>
        <TableHeader className="bg-[#FAFAFA] h-14">
          <TableRow className="border-b">
            <TableHead colSpan="10" className="text-center">
              <div className="flex flex-col items-center justify-center text-gray-500 py-8">
                <Search className="w-8 h-8 mb-2 text-gray-300" />
                <p className="text-sm">
                  {search
                    ? t("No posts found matching your search")
                    : t("No posts available")}
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
              onClick={() => sortData("title")}
            >
              {t("Title")}
              <SortIcon sortConfig={sortConfig} columnKey="title" />
            </div>
          </TableHead>
          <TableHead className="text-center text-[#5B6B79] font-medium text-xs">
            <div className="flex items-center justify-center gap-1 cursor-pointer hover:text-[#1E1E1E]">
              {t("Image")}
            </div>
          </TableHead>
          <TableHead className="text-center text-[#5B6B79] font-medium text-xs">
            <div className="flex items-center justify-center gap-1 cursor-pointer hover:text-[#1E1E1E]">
              {t("Date")}
            </div>
          </TableHead>
          <TableHead className="text-center text-[#5B6B79] font-medium text-xs">
            <div
              className="flex items-center justify-center gap-1 cursor-pointer hover:text-[#1E1E1E]"
              onClick={() => sortData("category")}
            >
              {t("Category")}
              <SortIcon sortConfig={sortConfig} columnKey="category" />
            </div>
          </TableHead>
          <TableHead className="text-center text-[#5B6B79] font-medium text-xs">
            <div
              className="flex items-center justify-center gap-1 cursor-pointer hover:text-[#1E1E1E]"
              onClick={() => sortData("type")}
            >
              {t("Type")}
              <SortIcon sortConfig={sortConfig} columnKey="type" />
            </div>
          </TableHead>

          <TableHead className="text-center text-[#5B6B79] font-medium text-xs">
            {t("Actions")}
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody className="text-[11px]">
        {learnData.map((learn) => (
          <TableRow key={learn?.id} className="hover:bg-gray-50/60 border-b">
            <TableCell className="text-center text-[#1E1E1E] font-bold text-[11px] py-4 px-4">
              {learn?.id}
            </TableCell>
            <TableCell className="text-center py-4">
              <div className="flex flex-col">
                <span className="text-[#1E1E1E] font-medium text-[11px] line-clamp-1">
                  {learn?.title || "-"}
                </span>
                <span className="text-[#9FA2AA] text-[10px]">
                  {learn?.subtitle}
                </span>
              </div>
            </TableCell>
            <TableCell className="text-center py-4">
              <img
                src={learn?.image || learn?.image_url}
                alt={learn?.title}
                className="w-12 h-8 object-cover rounded-md mx-auto"
              />
            </TableCell>
            <TableCell className="text-center text-[#1E1E1E] text-[11px] py-4">
              <div className="flex flex-col items-center">
                <span className="font-medium">
                  {new Date(learn?.event_date).toLocaleDateString("en-GB", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                  })}
                </span>
                <span className="text-[#9FA2AA] text-[10px]">
                  {learn?.event_date
                    ? new Date(learn?.event_date).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : ""}
                </span>
              </div>
            </TableCell>
            <TableCell className="text-center text-[#1E1E1E] text-[11px] py-4">
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-[10px]">
                {learn?.category?.name}
              </span>
            </TableCell>
            <TableCell className="text-center text-[#1E1E1E] text-[11px] py-4">
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-[10px]">
                {t(learn?.category?.learn_type)}
              </span>
            </TableCell>

            <TableCell className="text-center py-4">
              <div className="flex justify-center items-center gap-2 text-[#5B6B79]">
                <button
                  title={t("View Details")}
                  onClick={() => onView(learn)}
                  className="p-1 rounded hover:bg-gray-100 hover:text-blue-600"
                >
                  <Eye className="h-4 w-4" />
                </button>
                <button
                  title={t("Edit")}
                  onClick={() => {
                    // console.log(learn, "edit");
                    onEdit(learn);
                  }}
                  className="p-1 rounded hover:bg-gray-100 hover:text-green-600"
                >
                  <Edit className="h-4 w-4" />
                </button>
                {localStorage.getItem("userType") !== "editor" && (
                  <button
                    title={t("Delete")}
                    onClick={() => onDelete(learn)}
                    className="p-1 rounded hover:bg-gray-100 hover:text-rose-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default LearnTable;
