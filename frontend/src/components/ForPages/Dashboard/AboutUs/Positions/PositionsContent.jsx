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

export default function PositionsContent({ onSectionChange }) {
  const { t, i18n } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [positions, setPositions] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingPosition, setEditingPosition] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [form, setForm] = useState({ name: "", description: "" });
  const [errors, setErrors] = useState({});

  const fetchPositions = async (searchValue = searchTerm) => {
    setIsLoading(true);
    try {
      const res = searchValue
        ? await GetPositions(100, 0, searchValue)
        : await GetPositions(100, 0, "");
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
    setErrors({});
    setShowModal(true);
  };

  const openEditModal = (position) => {
    setEditingPosition(position);
    setForm({
      name: position.name || "",
      description: position.description || "",
    });
    setErrors({});
    setShowModal(true);
  };

  const handleInputChange = (field, value) => {
    setForm((p) => ({ ...p, [field]: value }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!form.name.trim()) {
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
    <div
      className="w-full min-h-screen bg-[#F5F7FB] px-3 relative text-[#1E1E1E] flex flex-col"
      dir={i18n?.language === "ar" ? "rtl" : "ltr"}
    >
      {isLoading && <Loader />}
      {/* Start Breadcrumb */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => onSectionChange("dashboard")}
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800"
          >
            ← {t("Back to Dashboard")}
          </button>
          <div className="h-4 w-px bg-gray-300" />
          <h2 className="text-xl font-semibold text-[#1D2630]">
            {t("Positions")}
          </h2>
        </div>
      </div>
      {/* End Breadcrumb */}

      <div className="flex-1">
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b bg-white rounded-lg mb-6">
          <div>
            <h2 className="text-lg font-medium text-[#1D2630]">
              {t("Positions Management")}
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              {t("Manage team positions and roles")}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">
              {t("Total")}: {positions.length} {t("positions")}
            </span>
            <button
              onClick={openAddModal}
              className="flex items-center gap-2 text-sm bg-primary border border-primary hover:bg-white transition-all duration-200 text-white hover:text-primary px-3 py-1.5 rounded"
            >
              <Plus className="h-4 w-4" />
              {t("Add Position")}
            </button>
          </div>
        </div>

        {/* Start Search */}
        {/* <div className="bg-white rounded-lg p-4 mb-6 shadow-sm">
          <div className="relative max-w-md flex">
            <input
              type="text"
              placeholder={t("Search Positions")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-l-lg text-sm pr-8"
            />

            {searchTerm && (
              <button
                onClick={() => {
                  setSearchTerm("");
                  fetchPositions("");
                }}
                className="absolute right-20 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            )}

            <button
              onClick={() => {
                if (searchTerm.trim()) {
                  fetchPositions();
                }
              }}
              className="px-4 py-2 bg-[#4680ff] text-white rounded-r-lg text-sm font-semibold hover:bg-blue-600"
            >
              {t("Search")}
            </button>
          </div>
        </div> */}
        {/* End Search */}

        {/* Start Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr className="text-left text-sm text-gray-600 border-b">
                  <th
                    className={` ${
                      i18n?.language === "ar" ? "text-right " : "  text-left"
                    } py-2 px-3 `}
                  >
                    {t("Name")}
                  </th>
                  <th
                    className={` ${
                      i18n?.language === "ar" ? "text-right " : "  text-left"
                    } py-2 px-3 `}
                  >
                    {t("Description")}
                  </th>
                  <th className={`py-2 px-3   ${
                      i18n?.language === "ar" ? "text-right " : "  text-left"
                    } w-[160px]`}>{t("Actions")}</th>
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
        </div>
        {/* End Table */}

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
                onChange={(e) => handleInputChange("name", e.target.value)}
                className={`w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.name ? "border-red-500" : ""
                }`}
              />
              {errors.name && (
                <p className="text-red-500 text-xs mt-1">{errors.name}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                {t("Description")}
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
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
    </div>
  );
}
