import React, { useState, useEffect } from "react";

import { useTranslation } from "react-i18next";
import { Plus, Edit, Trash2 } from "lucide-react";
import { toast } from "react-toastify";

import Modal from "@/components/Global/Modal/Modal";
import DeleteConfirmation from "@/components/ForPages/Dashboard/Videos/DeleteConfirmation/DeleteConfirmation";
import Loader from "@/components/Global/Loader/Loader";
import {
  GetEventSections,
  AddEventSection,
  EditEventSectionById,
  DeleteEventSection,
} from "@/api/events";
import TableButtons from "@/components/Global/TableButtons/TableButtons";

function EventSectionsContent({ onSectionChange }) {
  const { t, i18n } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [sections, setSections] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingSection, setEditingSection] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedSection, setSelectedSection] = useState(null);
  const [totalRecords, setTotalRecords] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [form, setForm] = useState({ name: "", description: "" });
  const [errors, setErrors] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10;
  const getSectionsData = async (page, searchValue = searchTerm) => {
    setIsLoading(true);
    const offset = page * 10;

    try {
      const res = searchValue
        ? await GetEventSections(limit, offset, searchValue)
        : await GetEventSections(limit, offset);
      setSections(res?.data?.results || []);
      setTotalRecords(res?.data?.count || 0);
    } catch (err) {
      console.error(err);
      toast.error(t("Failed to load sections"));
    } finally {
      setIsLoading(false);
    }
  };
  // Handle Pagination
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    getSectionsData(newPage - 1);
  };

  const openAddModal = () => {
    setEditingSection(null);
    setForm({ name: "", description: "" });
    setErrors({});
    setShowModal(true);
  };

  const openEditModal = (sec) => {
    setEditingSection(sec);
    setForm({ name: sec.name || "", description: sec.description || "" });
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
      if (editingSection && editingSection.id) {
        await EditEventSectionById(editingSection.id, form);
        toast.success(t("Section updated"));
      } else {
        await AddEventSection(form);
        toast.success(t("Section created"));
      }
      setShowModal(false);
      getSectionsData(0);
    } catch (err) {
      console.error(err);
      toast.error(t("Operation failed"));
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedSection?.id) return;
    try {
      await DeleteEventSection(selectedSection.id);
      toast.success(t("Section deleted"));
      setShowDeleteModal(false);
      setSelectedSection(null);
      getSectionsData(0);
    } catch (err) {
      console.error(err);
      toast.error(t("Delete failed"));
    }
  };
  const totalPages = Math.ceil(totalRecords / limit);
  useEffect(() => {
    getSectionsData(0);
  }, []);

  return (
    <div
      className="w-full min-h-screen bg-[#F5F7FB] px-3 relative text-[#1E1E1E] flex flex-col"
      dir={i18n.language === "ar" ? "rtl" : "ltr"}
    >
      {isLoading && <Loader />}
      {/* Start Breadcrumb */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => onSectionChange("eventsList")}
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800"
          >
            ← {t("Go to Events List")}
          </button>
          <div className="h-4 w-px bg-gray-300" />
          <h2 className="text-xl font-semibold text-[#1D2630]">
            {t("Events Sections")}
          </h2>
        </div>
      </div>
      {/* End Breadcrumb */}

      <div className="flex-1">
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b bg-white rounded-lg mb-6">
          <div>
            <h2 className="text-lg font-medium text-[#1D2630]">
              {t("Events Sections")}
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              {t("Manage events sections and classifications")}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">
              {t("Total")}: {sections.length} {t("sections")}
            </span>
            <button
              onClick={openAddModal}
              className="flex items-center gap-2 text-sm bg-primary border border-primary hover:bg-white transition-all duration-200 text-white hover:text-primary px-3 py-1.5 rounded"
            >
              <Plus className="h-4 w-4" />
              {t("Add Section")}
            </button>
          </div>
        </div>

        {/* Start Search */}
        <div className="bg-white rounded-lg p-4 mb-6 shadow-sm">
          <div className="relative max-w-md flex">
            <input
              type="text"
              placeholder={t("Search Sections")}
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
                  getSectionsData(0, "");
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
                  getSectionsData(0);
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
                {sections?.map((sec) => (
                  <tr key={sec.id} className="border-t">
                    <td className="py-3 px-3">{sec.name}</td>
                    <td className="py-3 px-3">{sec.description || "-"}</td>
                    <td className="py-3 px-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => openEditModal(sec)}
                          className="p-1 rounded hover:bg-gray-100"
                          title={t("Edit")}
                        >
                          <Edit className="h-4 w-4 text-green-600" />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedSection(sec);
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
          title={editingSection ? t("Edit Section") : t("Add Section")}
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
                {editingSection ? t("Save Changes") : t("Add Section")}
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
            title={t("Delete Section")}
            message={t(
              "Are you sure you want to delete this section? This action cannot be undone."
            )}
            itemName={selectedSection?.name}
          />
        </Modal>
      </div>
    </div>
  );
}

export default EventSectionsContent;
