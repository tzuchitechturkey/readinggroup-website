import React, { useState, useEffect } from "react";

import { useTranslation } from "react-i18next";
import { Plus, Edit, Trash2 } from "lucide-react";
import { toast } from "react-toastify";

import Modal from "@/components/Global/Modal/Modal";
import DeleteConfirmation from "@/components/ForPages/Dashboard/Videos/DeleteConfirmation/DeleteConfirmation";
import Loader from "@/components/Global/Loader/Loader";
import {
  GetVideoCategories,
  AddVideoCategory,
  EditVideoCategoryById,
  DeleteVideoCategory,
} from "@/api/videos";
import TableButtons from "@/components/Global/TableButtons/TableButtons";

function VideosCategoriesContent() {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [totalRecords, setTotalRecords] = useState(0);
  const [form, setForm] = useState({ name: "", description: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10;
  const getCategoriesData = async (page) => {
    setIsLoading(true);
    const offset = page * 10;

    try {
      const res = await GetVideoCategories(limit, offset);
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
    getData(newPage - 1);
  };

  const openAddModal = () => {
    setEditingCategory(null);
    setForm({ name: "", description: "" });
    setShowModal(true);
  };

  const openEditModal = (cat) => {
    setEditingCategory(cat);
    setForm({ name: cat.name || "", description: cat.description || "" });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCategory && editingCategory.id) {
        await EditVideoCategoryById(editingCategory.id, form);
        toast.success(t("Category updated"));
      } else {
        await AddVideoCategory(form);
        toast.success(t("Category created"));
      }
      setShowModal(false);
      getCategoriesData();
    } catch (err) {
      console.error(err);
      toast.error(t("Operation failed"));
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedCategory?.id) return;
    try {
      await DeleteVideoCategory(selectedCategory.id);
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
    <div className="bg-white rounded-lg p-4">
      {isLoading && <Loader />}

      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium">{t("Videos Categories")}</h3>
        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white rounded"
        >
          <Plus className="h-4 w-4" /> {t("Add Category")}
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="text-left text-sm text-gray-600">
              <th className="py-2 px-3">{t("Name")}</th>
              <th className="py-2 px-3">{t("Description")}</th>
              <th className="py-2 px-3 w-[160px]">{t("Actions")}</th>
            </tr>
          </thead>
          <tbody>
            {categories?.map((cat) => (
              <tr key={cat.id} className="border-t">
                <td className="py-3 px-3">{cat.name}</td>
                <td className="py-3 px-3">{cat.description}</td>
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
              {t("Name")}
            </label>
            <input
              name="name"
              value={form.name}
              onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
              required
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              {t("Description")}
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={(e) =>
                setForm((p) => ({ ...p, description: e.target.value }))
              }
              className="w-full p-2 border rounded"
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
  );
}

export default VideosCategoriesContent;
