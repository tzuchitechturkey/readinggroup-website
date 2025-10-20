import React, { useState, useEffect } from "react";

import { Plus, Edit, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

import Modal from "@/components/Global/Modal/Modal";
import DeleteConfirmation from "@/components/ForPages/Dashboard/Videos/DeleteConfirmation/DeleteConfirmation";
import Loader from "@/components/Global/Loader/Loader";
import {
  GetPositions,
  CreatePosition,
  EditPositionById,
  DeletePositionsById,
} from "@/api/aboutUs";

export default function PositionsContent() {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [positions, setPositions] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingPosition, setEditingPosition] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState(null);

  const [form, setForm] = useState({ name: "", description: "" });

  const fetchPositions = async () => {
    setIsLoading(true);
    try {
      const res = await GetPositions(100, 0, "");
      setPositions(res?.data?.results || []);
    } catch (err) {
      console.error(err);
      toast.error(t("Failed to load positions"));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPositions();
  }, []);

  const openAddModal = () => {
    setEditingPosition(null);
    setForm({ name: "", description: "" });
    setShowModal(true);
  };

  const openEditModal = (position) => {
    setEditingPosition(position);
    setForm({
      name: position.name || "",
      description: position.description || "",
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingPosition && editingPosition.id) {
        await EditPositionById(editingPosition.id, form);
        toast.success(t("Position updated"));
      } else {
        await CreatePosition(form);
        toast.success(t("Position created"));
      }
      setShowModal(false);
      fetchPositions();
    } catch (err) {
      console.error(err);
      toast.error(t("Operation failed"));
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedPosition?.id) return;
    try {
      await DeletePositionsById(selectedPosition.id);
      toast.success(t("Position deleted"));
      setShowDeleteModal(false);
      setSelectedPosition(null);
      fetchPositions();
    } catch (err) {
      console.error(err);
      toast.error(t("Delete failed"));
    }
  };

  return (
    <div className="bg-white rounded-lg p-4">
      {isLoading && <Loader />}

      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium">{t("Positions")}</h3>
        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4" /> {t("Add Position")}
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="text-left text-sm text-gray-600 border-b">
              <th className="py-2 px-3">{t("Name")}</th>
              <th className="py-2 px-3">{t("Description")}</th>
              <th className="py-2 px-3 w-[160px]">{t("Actions")}</th>
            </tr>
          </thead>
          <tbody>
            {positions.length > 0 ? (
              positions.map((position) => (
                <tr key={position.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-3 font-medium">{position.name}</td>
                  <td className="py-3 px-3 text-gray-600">
                    {position.description}
                  </td>
                  <td className="py-3 px-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => openEditModal(position)}
                        className="p-1 rounded hover:bg-gray-100"
                        title={t("Edit")}
                      >
                        <Edit className="h-4 w-4 text-green-600" />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedPosition(position);
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
              ))
            ) : (
              <tr>
                <td colSpan="3" className="py-8 text-center text-gray-500">
                  {t("No positions found")}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Create / Edit Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingPosition ? t("Edit Position") : t("Add Position")}
        width="600px"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              {t("Name")} *
            </label>
            <input
              name="name"
              value={form.name}
              onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
              required
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={4}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="px-4 py-2 border rounded hover:bg-gray-50"
            >
              {t("Cancel")}
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              {editingPosition ? t("Save Changes") : t("Add Position")}
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
          title={t("Delete Position")}
          message={t(
            "Are you sure you want to delete this position? This action cannot be undone."
          )}
          itemName={selectedPosition?.name}
        />
      </Modal>
    </div>
  );
}
