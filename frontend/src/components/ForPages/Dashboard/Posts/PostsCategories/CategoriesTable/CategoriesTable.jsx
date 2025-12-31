import React from "react";

import { Edit, Trash2, ToggleLeft, ToggleRight } from "lucide-react";
import { toast } from "react-toastify";

import { EditPostCategoryById } from "@/api/posts";
import { setErrorFn } from "@/Utility/Global/setErrorFn";

import {
  handleDragStart,
  handleDragOver,
  handleDrop,
  handleDragEnd,
} from "../../../../../../Utility/Posts/dragDropHandler";

function CategoriesTable({
  categories,
  draggedItem,
  isSorting,
  currentPage,
  t,
  i18n,
  onEditCategory,
  onDeleteCategory,
  onRefresh,
  setDraggedItem,
  setCategories,
  setHasChanges,
}) {
  const handleToggleStatus = async (cat) => {
    if (!cat.is_active && cat.post_count === 0) {
      toast.info(
        t(
          "You cannot activate this category because it does not contain any posts. Please add posts first."
        )
      );
      return;
    }
    try {
      await EditPostCategoryById(cat.id, {
        ...cat,
        is_active: !cat.is_active,
      });
      toast.success(
        cat.is_active ? t("Category disabled") : t("Category enabled")
      );
      onRefresh(currentPage - 1);
    } catch (err) {
      setErrorFn(err, t);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr
              className={`${
                i18n?.language === "ar" ? "text-right " : "text-left"
              }text-sm text-gray-600`}
            >
              <th
                className={`${
                  i18n?.language === "ar" ? "text-right " : "  text-left"
                } py-2 px-3`}
              >
                {t("Name")}
              </th>
              <th
                className={`${
                  i18n?.language === "ar" ? "text-right " : "  text-left"
                } py-2 px-3`}
              >
                {t("Description")}
              </th>
              <th
                className={`${
                  i18n?.language === "ar" ? "text-right " : "  text-left"
                } py-2 px-3`}
              >
                {t("Status")}
              </th>
              <th
                className={` ${
                  i18n?.language === "ar" ? "text-right " : "  text-left"
                } py-2 px-3 w-[160px]`}
              >
                {t("Actions")}
              </th>
            </tr>
          </thead>
          <tbody>
            {categories?.map((cat) => (
              <tr
                key={cat.id}
                draggable
                onDragStart={(e) =>
                  handleDragStart(e, cat, setDraggedItem)
                }
                onDragOver={handleDragOver}
                onDrop={(e) =>
                  handleDrop(
                    e,
                    draggedItem,
                    cat,
                    categories,
                    setCategories,
                    setHasChanges,
                    setDraggedItem
                  )
                }
                onDragEnd={() => handleDragEnd(setDraggedItem)}
                className={`border-t transition-all duration-200 ${
                  draggedItem?.id === cat.id
                    ? "opacity-50 bg-blue-50"
                    : "cursor-move hover:bg-gray-50"
                } ${isSorting ? "opacity-75" : ""}`}
                style={{
                  cursor: isSorting ? "not-allowed" : "move",
                }}
              >
                <td className="py-3 px-3">{cat.name}</td>
                <td className="py-3 px-3">{cat.description || "-"}</td>
                <td className="py-3 px-3">
                  <button
                    onClick={() => handleToggleStatus(cat)}
                    className={`p-1 rounded-lg transition-all duration-200 ${
                      cat.is_active
                        ? "bg-green-100 text-green-600 hover:bg-green-200"
                        : "bg-gray-100 text-gray-400 hover:bg-gray-200"
                    } ${
                      !cat.is_active && cat.post_count === 0
                        ? "opacity-50 "
                        : ""
                    }`}
                    title={
                      !cat.is_active && cat.post_count === 0
                        ? t("Cannot activate category with no posts.")
                        : cat.is_active
                        ? t("Click to disable")
                        : t("Click to enable")
                    }
                  >
                    {cat.is_active ? (
                      <ToggleRight className="h-8 w-12" />
                    ) : (
                      <ToggleLeft className="h-8 w-12" />
                    )}
                  </button>
                </td>
                <td className="py-3 px-3">
                  <div className="flex gap-2">
                    <button
                      onClick={() => onEditCategory(cat)}
                      className="p-1 rounded hover:bg-gray-100"
                      title={t("Edit")}
                    >
                      <Edit className="h-4 w-4 text-green-600" />
                    </button>
                    <button
                      onClick={() => onDeleteCategory(cat)}
                      className="p-1 rounded hover:bg-gray-100"
                      title={t("Delete")}
                    >
                      <Trash2 className="h-4 w-4 text-rose-600" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default CategoriesTable;
