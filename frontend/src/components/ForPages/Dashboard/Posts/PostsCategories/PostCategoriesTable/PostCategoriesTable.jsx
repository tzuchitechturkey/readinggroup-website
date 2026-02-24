import React, { useState } from "react";

import { toast } from "react-toastify";
import { Edit, Trash2, ToggleLeft, ToggleRight } from "lucide-react";

import { EditPostCategoryById, SortPostCategories } from "@/api/posts";
import DraggableTable from "@/components/ForPages/Dashboard/DraggableTable/DraggableTable";

function PostCategoriesTable({
  t,
  i18n,
  categories,
  setCategories,
  setOriginalForm,
  setIsAutoTranslated,
  setShowCreateEditModal,
  setSelectedLanguage,
  setOriginalLanguage,
  setForm,
  totalRecords,
  originalCategories,
  setOriginalCategories,
  hasChanges,
  setHasChanges,
  getCategoriesData,
  setErrorFn,
  setSelectedCategory,
  setShowDeleteModal,
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10;

  const openEditModal = (cat) => {
    const currentLanguage = i18n?.language || "en";
    setSelectedLanguage(currentLanguage);
    setOriginalLanguage(currentLanguage);
    const formData = {
      name: cat.name || "",
      description: cat.description || "",
      is_active: cat.is_active !== undefined ? cat.is_active : false,
      post_count: cat.post_count !== undefined ? cat.post_count : 0,
      id: cat.id,
    };
    setForm(formData);
    setOriginalForm({
      name: cat.name || "",
      description: cat.description || "",
    });
    setIsAutoTranslated(false);
    setShowCreateEditModal(true);
  };

  // Handle Pagination
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    getCategoriesData(newPage - 1);
  };

  // Handle Save Order
  const handleSaveOrder = async (sortData) => {
    await SortPostCategories({ categories: sortData });
  };

  // Define table columns
  const columns = [
    {
      title: "Name",
      key: "name",
    },
    {
      title: "Description",
      key: "description",
      render: (item) => item.description || "-",
    },
    {
      title: "Status",
      key: "is_active",
      render: (item) => (
        <button
          onClick={async () => {
            if (!item.is_active && item.post_count === 0) {
              toast.info(
                t(
                  "You cannot activate this category because it does not contain any posts. Please add posts first.",
                ),
              );
              return;
            }
            try {
              await EditPostCategoryById(item.id, {
                ...item,
                is_active: !item.is_active,
              });
              toast.success(
                item.is_active ? t("Category disabled") : t("Category enabled"),
              );
              getCategoriesData(currentPage - 1);
            } catch (err) {
              setErrorFn(err, t);
            }
          }}
          className={`p-1 rounded-lg transition-all duration-200 ${
            item.is_active
              ? "bg-green-100 text-green-600 hover:bg-green-200"
              : "bg-gray-100 text-gray-400 hover:bg-gray-200"
          } ${!item.is_active && item.post_count === 0 ? "opacity-50 " : ""}`}
          title={
            !item.is_active && item.post_count === 0
              ? t("Cannot activate category with no posts.")
              : item.is_active
                ? t("Click to disable")
                : t("Click to enable")
          }
        >
          {item.is_active ? (
            <ToggleRight className="h-8 w-12" />
          ) : (
            <ToggleLeft className="h-8 w-12" />
          )}
        </button>
      ),
    },
  ];

  // Define table actions
  const actions = [
    {
      title: "Edit",
      icon: <Edit className="h-4 w-4 text-green-600" />,
      onClick: openEditModal,
      className: "p-1 rounded hover:bg-gray-100",
    },
    {
      title: "Delete",
      icon: <Trash2 className="h-4 w-4 text-rose-600" />,
      onClick: (item) => {
        setSelectedCategory(item);
        setShowDeleteModal(true);
      },
      className: "p-1 rounded hover:bg-gray-100",
    },
  ];

  return (
    <DraggableTable
      t={t}
      i18n={i18n}
      data={categories}
      setData={setCategories}
      columns={columns}
      actions={actions}
      originalData={originalCategories}
      setOriginalData={setOriginalCategories}
      hasChanges={hasChanges}
      setHasChanges={setHasChanges}
      onSaveOrder={handleSaveOrder}
      totalRecords={totalRecords}
      currentPage={currentPage}
      onPageChange={handlePageChange}
      limit={limit}
      isDraggable={true}
    />
  );
}

export default PostCategoriesTable;
