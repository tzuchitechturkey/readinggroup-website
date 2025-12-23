import React, { useState, useEffect } from "react";

import { Plus, Edit, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

import Modal from "@/components/Global/Modal/Modal";
import DeleteConfirmation from "@/components/Global/DeleteConfirmation/DeleteConfirmation";
import Loader from "@/components/Global/Loader/Loader";
import {
  GetDepartments,
  CreateDepartment,
  EditDepartmentById,
  DeleteDepartmentById,
} from "@/api/aboutUs";

import CustomBreadcrumb from "../../CustomBreadcrumb/CustomBreadcrumb";

export default function DepartmentsContent({ onSectionChange }) {
  const { t, i18n } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingDepartment, setEditingDepartments] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [form, setForm] = useState({ name: "", description: "" });
  const [errors, setErrors] = useState({});

  const fetchDepartments = async (searchValue = searchTerm) => {
    setIsLoading(true);
    try {
      const res = searchValue
        ? await GetDepartments(100, 0, searchValue)
        : await GetDepartments(100, 0, "");
      setDepartments(res?.data?.results || []);
    } catch (err) {
      console.error(err);
      toast.error(t("Failed to load departments"));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const openAddModal = () => {
    setEditingDepartments(null);
    setForm({ name: "", description: "" });
    setErrors({});
    setShowModal(true);
  };

  const openEditModal = (department) => {
    setEditingDepartments(department);
    setForm({
      name: department.name || "",
      description: department.description || "",
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
      if (editingDepartment && editingDepartment.id) {
        await EditDepartmentById(editingDepartment.id, form);
        toast.success(t("Department updated"));
      } else {
        await CreateDepartment(form);
        toast.success(t("Department created"));
      }
      setShowModal(false);
      fetchDepartments();
    } catch (err) {
      console.error(err);
      toast.error(t("Operation failed"));
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedDepartment?.id) return;
    try {
      await DeleteDepartmentById(selectedDepartment.id);
      toast.success(t("Department deleted"));
      setShowDeleteModal(false);
      setSelectedDepartment(null);
      fetchDepartments();
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
      <CustomBreadcrumb
        backTitle={t("Back to Dashboard")}
        onBack={() => {
          onSectionChange("dashboard");
        }}
        page={t("Departments")}
      />

      {/* End Breadcrumb */}

      <div className="flex-1">
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b bg-white rounded-lg mb-6">
          <h2 className="text-lg font-medium text-[#1D2630]">
            {t("Departments Management")}
          </h2>
          <div className="flex items-center justify-between gap-1">
            <span className="text-xs md:text-sm text-gray-500">
              {t("Total")}: {departments.length} {t("departments")}
            </span>
            <button
              onClick={openAddModal}
              className="flex items-center gap-2 text-xs md:text-sm bg-primary border border-primary hover:bg-white transition-all duration-200 text-white hover:text-primary px-3 py-1.5 rounded"
            >
              <Plus className="h-4 w-4" />
              {t("Add Department")}
            </button>
          </div>
        </div>

        {/* Start Search */}
        <div className="bg-white rounded-lg p-4 mb-6 shadow-sm">
          <div className="relative max-w-md flex">
            <input
              type="text"
              placeholder={t("Search Departments...")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`flex-1 px-4 py-2 border border-gray-300 ${i18n?.language === "ar" ? "rounded-r-lg " : "rounded-l-lg "} text-sm pr-8`}
            />

            {searchTerm && (
              <button
                onClick={() => {
                  setSearchTerm("");
                  fetchDepartments("");
                }}
                className="absolute right-20 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            )}

            <button
              onClick={() => {
                if (searchTerm.trim()) {
                  fetchDepartments();
                }
              }}
              className={` px-4 py-2 bg-[#4680ff] text-white ${i18n?.language === "ar" ? "rounded-l-lg " : "rounded-r-lg " } text-sm font-semibold hover:bg-blue-600`}
            >
              {t("Search")}
            </button>
          </div>
        </div>
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
                  <th
                    className={`py-2 px-3   ${
                      i18n?.language === "ar" ? "text-right " : "  text-left"
                    } w-[160px]`}
                  >
                    {t("Actions")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {departments.length > 0 ? (
                  departments.map((department) => (
                    <tr
                      key={department.id}
                      className="border-b hover:bg-gray-50"
                    >
                      <td className="py-3 px-3 font-medium">
                        {department.name}
                      </td>
                      <td className="py-3 px-3 text-gray-600">
                        {department.description}
                      </td>
                      <td className="py-3 px-3">
                        <div className="flex gap-2">
                          <button
                            onClick={() => openEditModal(department)}
                            className="p-1 rounded hover:bg-gray-100"
                            title={t("Edit")}
                          >
                            <Edit className="h-4 w-4 text-green-600" />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedDepartment(department);
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
                      {t("No departments found")}
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
          title={editingDepartment ? t("Edit Department") : t("Add Department")}
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
                {editingDepartment ? t("Save Changes") : t("Add Department")}
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
            title={t("Delete Department")}
            message={t(
              "Are you sure you want to delete this department? This action cannot be undone."
            )}
            itemName={selectedDepartment?.name}
          />
        </Modal>
      </div>
    </div>
  );
}
