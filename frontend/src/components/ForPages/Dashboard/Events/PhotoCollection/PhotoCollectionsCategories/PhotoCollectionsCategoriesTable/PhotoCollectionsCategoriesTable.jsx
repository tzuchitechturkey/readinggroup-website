import React, { useState } from "react";

import { toast } from "react-toastify";
import { Edit, Trash2, ToggleLeft, ToggleRight, Eye } from "lucide-react";

import DraggableTable from "@/components/ForPages/Dashboard/DraggableTable/DraggableTable";
import { EditCollectionById } from "@/api/photoCollections";

function PhotoCollectionsCategoriesTable({
  t,
  i18n,
  categories,
  setCategories,
  setOriginalForm,
  setIsAutoTranslated,
  setShowCreateEditModal,
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
  onSectionChange,
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10;

  const openEditModal = (cat) => {
    const formData = {
      image: null,
      title: cat.title || "",
      happened_at: cat.happened_at || "",
      is_active: cat.is_active !== undefined ? cat.is_active : false,
      id: cat.id,
    };
    setForm(formData);
    setOriginalForm({
      title: cat.title || "",
      happened_at: cat.happened_at || "",
    });
    setIsAutoTranslated(false);
    setShowCreateEditModal(true);
  };

  // Handle Pagination
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    getCategoriesData(newPage - 1);
  };

  // Define table columns
  const columns = [
    {
      title: t("Image"),
      key: "image",
      render: (item) => (
        <div className="w-12 h-12 rounded overflow-hidden bg-gray-100">
          {item.image ? (
            <img
              src={item.image}
              alt={item.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
              {t("No Image")}
            </div>
          )}
        </div>
      ),
    },
    {
      title: t("Title"),
      key: "title",
    },
    {
      title: t("Date"),
      key: "happened_at",
      render: (item) => {
        if (!item.happened_at) return "-";
        return new Date(item.happened_at).toLocaleDateString(
          i18n?.language === "ar" ? "ar-EG" : "en-US",
        );
      },
    },
    {
      title: t("Status"),
      key: "is_active",
      render: (item) => (
        <button
          onClick={async () => {
            try {
              await EditCollectionById(item.id, {
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
          }`}
          title={item.is_active ? t("Click to disable") : t("Click to enable")}
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
    {
      title: "Show",
      icon: <Eye className="h-4 w-4 text-blue-600" />,
      onClick: (item) => {
         onSectionChange("createOrEditPhotoCollection", item);
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
      totalRecords={totalRecords}
      currentPage={currentPage}
      onPageChange={handlePageChange}
      limit={limit}
      isDraggable={false}
    />
  );
}

export default PhotoCollectionsCategoriesTable;
