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

const RelatedReportsTable = ({
  reportsData,
  search,
  sortConfig,
  sortData,
  onView,
  onEdit,
  onDelete,
  onClearSearch,
}) => {
  const { t } = useTranslation();
  if (reportsData.length === 0) {
    return (
      <Table>
        <TableHeader className="bg-[#FAFAFA] h-14">
          <TableRow className="border-b">
            <TableHead colSpan="10" className="text-center">
              <div className="flex flex-col items-center justify-center text-gray-500 py-8">
                <Search className="w-8 h-8 mb-2 text-gray-300" />
                <p className="text-sm">
                  {search
                    ? t("No reports found matching your search")
                    : t("No reports available")}
                </p>
                {search && (
                  <button
                    onClick={onClearSearch}
                    className="text-blue-500 hover:text-blue-700 text-xs mt-1"
                  >
                    {t("Clear search")}
                  </button>
                )}
              </div>
            </TableHead>
          </TableRow>
        </TableHeader>
      </Table>
    );
  }

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const truncateText = (text, maxLength = 50) => {
    if (!text) return "-";
    return text.length > maxLength
      ? text.substring(0, maxLength) + "..."
      : text;
  };

  return (
    <Table>
      <TableHeader className="bg-[#FAFAFA] h-14">
        <TableRow className="border-b">
          <TableHead className="w-[100px] text-center">{t("Image")}</TableHead>
          <TableHead
            className="cursor-pointer"
            onClick={() => sortData("title")}
          >
            <div className="flex items-center">
              {t("Title")}
              <SortIcon column="title" sortConfig={sortConfig} />
            </div>
          </TableHead>
          <TableHead
            className="cursor-pointer"
            onClick={() => sortData("category")}
          >
            <div className="flex items-center">
              {t("Category")}
              <SortIcon column="category" sortConfig={sortConfig} />
            </div>
          </TableHead>

          <TableHead className="w-[150px] text-center">
            {t("Actions")}
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {reportsData.map((report) => (
          <TableRow key={report.id} className="hover:bg-gray-50">
            <TableCell className="text-center">
              {report.image ? (
                <img
                  src={report?.image}
                  alt={report.title}
                  className="w-12 h-12 object-cover rounded-lg mx-auto"
                />
              ) : (
                <div className="w-12 h-12 bg-gray-200 rounded-lg mx-auto flex items-center justify-center">
                  <span className="text-gray-400 text-xs">{t("No Image")}</span>
                </div>
              )}
            </TableCell>
            <TableCell className="font-medium">
              {truncateText(report.title, 40)}
            </TableCell>
            <TableCell>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {report.category?.title || "-"}
              </span>
            </TableCell>

            <TableCell>
              <div className="flex items-center justify-center space-x-2">
                <button
                  onClick={() => onView(report)}
                  className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                  title={t("View Details")}
                >
                  <Eye className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onEdit(report)}
                  className="p-1 text-yellow-600 hover:bg-yellow-50 rounded transition-colors"
                  title={t("Edit")}
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onDelete(report)}
                  className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
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

export default RelatedReportsTable;
