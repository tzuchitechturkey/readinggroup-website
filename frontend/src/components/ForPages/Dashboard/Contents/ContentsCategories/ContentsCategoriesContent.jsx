import React, { useState, useEffect } from "react";

import { useTranslation } from "react-i18next";
import { Plus, Edit, Trash2 } from "lucide-react";
import { toast } from "react-toastify";

import Modal from "@/components/Global/Modal/Modal";
import DeleteConfirmation from "@/components/ForPages/Dashboard/Videos/DeleteConfirmation/DeleteConfirmation";
import Loader from "@/components/Global/Loader/Loader";
import {
  GetContentCategories,
  AddContentCategory,
  EditContentCategoryById,
  DeleteContentCategory,
} from "@/api/contents";
import TableButtons from "@/components/Global/TableButtons/TableButtons";

import CustomBreadcrumb from "../../CustomBreadcrumb/CustomBreadcrumb";

function ContentsCategoriesContent({ onSectionChange }) {
  const { t, i18n } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [totalRecords, setTotalRecords] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [form, setForm] = useState({ name: "", description: "" });
  const [errors, setErrors] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10;
  const getCategoriesData = async (page, searchValue = searchTerm) => {
    setIsLoading(true);
    const offset = page * 10;

    try {
      const res = searchValue
        ? await GetContentCategories(limit, offset, searchValue)
        : await GetContentCategories(limit, offset);
      setCategories(res?.data?.results || []);
      setTotalRecords(res?.data?.count || 0);
    } catch (err) {
      console.error(err);
      toast.error(t("Failed to load categories"));
    } finally {
      setIsLoading(false);
    }
  };
  // Handle Pagination
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    getCategoriesData(newPage - 1);
  };

  const openAddModal = () => {
    setEditingCategory(null);
    setForm({ name: "", description: "" });
    setErrors({});
    setShowModal(true);
  };

  const openEditModal = (cat) => {
    setEditingCategory(cat);
    setForm({ name: cat.name || "", description: cat.description || "" });
    setErrors({});
    setShowModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    // إزالة الخطأ عند الإدخال
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!form.name || !form.name.trim()) {
      newErrors.name = t("Name is required");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      if (editingCategory && editingCategory.id) {
        await EditContentCategoryById(editingCategory.id, form);
        toast.success(t("Category updated"));
      } else {
        await AddContentCategory(form);
        toast.success(t("Category created"));
      }
      setShowModal(false);
      getCategoriesData(0);
    } catch (err) {
      console.error(err);
      toast.error(t("Operation failed"));
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedCategory?.id) return;
    try {
      await DeleteContentCategory(selectedCategory.id);
      toast.success(t("Category deleted"));
      setShowDeleteModal(false);
      setSelectedCategory(null);
      getCategoriesData(0);
    } catch (err) {
      console.error(err);
      toast.error(t("Delete failed"));
    }
  };
  const totalPages = Math.ceil(totalRecords / limit);
  useEffect(() => {
    getCategoriesData(0);
  }, []);

  return (
    <div
      className="w-full min-h-screen bg-[#F5F7FB] px-3 relative text-[#1E1E1E] flex flex-col"
      dir={i18n.language === "ar" ? "rtl" : "ltr"}
    >
      {isLoading && <Loader />}
      {/* Start Breadcrumb */}
      <CustomBreadcrumb
        backTitle={t("Back to Contents List")}
        onBack={() => {
          onSectionChange("contents");
        }}
        page={t("Contents Categories")}
      />
      {/* End Breadcrumb */}

      <div className="flex-1">
        {/* Start Header */}
        <div className="flex items-center justify-between lg:px-4 sm:px-6 py-4 border-b bg-white rounded-lg mb-6">
          <h2 className="text-lg font-medium text-[#1D2630]">
            {t("Contents Categories")}
          </h2>

          <div className="flex justify-end items-center gap-1">
            <span className="text-sm text-gray-500">
              {t("Total")}: {categories.length} {t("categories")}
            </span>
            <button
              onClick={openAddModal}
              className="flex items-center gap-2 text-xs lg:text-sm bg-primary border border-primary hover:bg-white transition-all duration-200 text-white hover:text-primary px-3 py-1.5 rounded"
            >
              <Plus className="h-4 w-4" />
              {t("Add Category")}
            </button>
          </div>
        </div>
        {/* End Header */}

        {/* Start Search */}
        <div className="bg-white rounded-lg p-4 mb-6 shadow-sm">
          <div className="relative max-w-md flex">
            <input
              type="text"
              placeholder={t("Search Categories")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`flex-1 px-4 py-2 border border-gray-300 ${
                i18n?.language === "ar" ? "rounded-r-lg" : "rounded-l-lg"
              } text-sm pr-8`}
            />

            {searchTerm && (
              <button
                onClick={() => {
                  setSearchTerm("");
                  getCategoriesData(0, "");
                }}
                className={` absolute ${
                  i18n?.language === "ar" ? " left-20" : " right-20"
                } top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700`}
              >
                ✕
              </button>
            )}

            <button
              onClick={() => {
                if (searchTerm.trim()) {
                  getCategoriesData(0);
                }
              }}
              className={`px-4 py-2 bg-[#4680ff] text-white ${
                i18n?.language === "ar" ? "rounded-l-lg" : "rounded-r-lg"
              }  text-sm font-semibold hover:bg-blue-600`}
            >
              {t("Search")}
            </button>
          </div>
        </div>
        {/* End Search */}

        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr
                  className={`${
                    i18n?.language === "ar" ? "text-right " : "  text-left"
                  } text-sm text-gray-600`}
                >
                  <th
                    className={` ${
                      i18n?.language === "ar" ? "text-right " : "  text-left"
                    } py-2 px-3 `}
                  >
                    {t("Name")}{" "}
                  </th>
                  <th
                    className={` ${
                      i18n?.language === "ar" ? "text-right " : "  text-left"
                    } py-2 px-3 `}
                  >
                    {t("Description")}
                  </th>
                  <th className="py-2 px-3 w-[160px]">{t("Actions")}</th>
                </tr>
              </thead>
              <tbody>
                {categories?.map((cat) => (
                  <tr key={cat.id} className="border-t">
                    <td className="py-3 px-3">{cat.name}</td>
                    <td className="py-3 px-3">{cat.description || "-"}</td>
                    <td className="py-3 px-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => openEditModal(cat)}
                          className="p-1 rounded hover:bg-gray-100"
                          title={t("Edit")}
                        >
                          <Edit className="h-4 w-4 text-green-600" />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedCategory(cat);
                            setShowDeleteModal(true);
                          }}
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
            <TableButtons
              totalPages={totalPages}
              currentPage={currentPage}
              onPageChange={handlePageChange}
              t={t}
            />
          </div>
        </div>

        {/* Create / Edit Modal */}
        <Modal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          title={editingCategory ? t("Edit Category") : t("Add Category")}
          width="600px"
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                {t("Name")} <span className="text-red-500">*</span>
              </label>
              <input
                name="name"
                value={form.name}
                onChange={handleInputChange}
                className={`w-full p-2 border rounded ${
                  errors.name ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                {t("Description")}
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded"
                rows={4}
              />
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="px-4 py-2 border rounded"
              >
                {t("Cancel")}
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                {editingCategory ? t("Save Changes") : t("Add Category")}
              </button>
            </div>
          </form>
        </Modal>

        {/* Delete Confirmation */}
        <Modal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          title={t("Confirm Deletion")}
          width="500px"
        >
          <DeleteConfirmation
            isOpen={showDeleteModal}
            onClose={() => setShowDeleteModal(false)}
            onConfirm={handleConfirmDelete}
            title={t("Delete Category")}
            message={t(
              "Are you sure you want to delete this category? This action cannot be undone."
            )}
            itemName={selectedCategory?.name}
          />
        </Modal>
      </div>
    </div>
  );
}

export default ContentsCategoriesContent;
