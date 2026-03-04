import React from "react";

import { Edit, Trash2, Search, ToggleRight, ToggleLeft } from "lucide-react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { EditRelatedReportCategoryById } from "@/api/relatedReports";
import { setErrorFn } from "@/Utility/Global/setErrorFn";

const RelatedReportsCategoriesTable = ({
  categories,
  search,
  onEdit,
  onDelete,
  onClearSearch,
  getCategoriesData,
}) => {
  const { t } = useTranslation();

  if (categories.length === 0) {
    return (
      <Table>
        <TableHeader className="bg-[#FAFAFA] h-14">
          <TableRow className="border-b">
            <TableHead colSpan="6" className="text-center">
              <div className="flex flex-col items-center justify-center text-gray-500 py-8">
                <Search className="w-8 h-8 mb-2 text-gray-300" />
                <p className="text-sm">
                  {search
                    ? t("No categories found matching your search")
                    : t("No categories available")}
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

  const truncateText = (text, maxLength = 60) => {
    if (!text) return "-";
    return text.length > maxLength
      ? text.substring(0, maxLength) + "..."
      : text;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className=" h-14">
            <TableRow className="border-b">
              <TableHead className="font-semibold">{t("Title")}</TableHead>
              <TableHead className="font-semibold">
                {t("Description")}
              </TableHead>

              <TableHead className="font-semibold">{t("Status")}</TableHead>
              <TableHead className="w-[120px] text-center font-semibold">
                {t("Actions")}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.map((category) => (
              <TableRow key={category.id} className="hover:bg-gray-50">
                <TableCell className="font-medium">{category.title}</TableCell>
                <TableCell className="text-gray-600">
                  {truncateText(category.description) || "-"}
                </TableCell>

                <TableCell>
                  <button
                    onClick={async () => {
                      if (!category.is_active && category.report_count === 0) {
                        toast.info(
                          t(
                            "You cannot activate this category because it does not contain any reports. Please add reports first.",
                          ),
                        );
                        return;
                      }
                      try {
                        await EditRelatedReportCategoryById(category.id, {
                          ...category,
                          is_active: !category.is_active,
                        });
                        toast.success(
                          category.is_active
                            ? t("Category disabled")
                            : t("Category enabled"),
                        );
                        getCategoriesData();
                      } catch (err) {
                        setErrorFn(err, t);
                      }
                    }}
                    className={`p-1 rounded-lg transition-all duration-200 ${
                      category.is_active
                        ? "bg-green-100 text-green-600 hover:bg-green-200"
                        : "bg-gray-100 text-gray-400 hover:bg-gray-200"
                    } ${!category.is_active && category.report_count === 0 ? "opacity-50 " : ""}`}
                    title={
                      !category.is_active && category.report_count === 0
                        ? t("Cannot activate category with no reports.")
                        : category.is_active
                          ? t("Click to disable")
                          : t("Click to enable")
                    }
                  >
                    {category.is_active ? (
                      <ToggleRight className="h-8 w-12" />
                    ) : (
                      <ToggleLeft className="h-8 w-12" />
                    )}
                  </button>
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-center space-x-2">
                    <button
                      onClick={() => onEdit(category)}
                      className="p-1 text-yellow-600 hover:bg-yellow-50 rounded transition-colors"
                      title={t("Edit")}
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(category)}
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
      </div>
    </div>
  );
};

export default RelatedReportsCategoriesTable;
