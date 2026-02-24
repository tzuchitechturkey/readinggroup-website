import React, { useState, useEffect } from "react";

import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { Upload, FileText, Edit, Trash2, X, Search, Check } from "lucide-react";

import Modal from "@/components/Global/Modal/Modal";
import Loader from "@/components/Global/Loader/Loader";
import TableButtons from "@/components/Global/TableButtons/TableButtons";
import DeleteConfirmation from "@/components/Global/DeleteConfirmation/DeleteConfirmation";
import {
  GetAttachments,
  CreateAttachments,
  EditAttachmentById,
  DeleteAttachmentById,
} from "@/api/attachments";
import { setErrorFn } from "@/Utility/Global/setErrorFn";

function AttachmentsModal({
  isOpen,
  onClose,
  selectedAttachments = [],
  onConfirm,
}) {
  const { t, i18n } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [attachments, setAttachments] = useState([]);
  const [tempSelectedIds, setTempSelectedIds] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingAttachment, setEditingAttachment] = useState(null);
  const [deletingAttachment, setDeletingAttachment] = useState(null);
  const [uploadForm, setUploadForm] = useState({
    title: "",
    file: null,
  });
  const [uploadErrors, setUploadErrors] = useState({});
  const [removedCurrentFile, setRemovedCurrentFile] = useState(false);

  const limit = 10;

  // Load attachments
  const loadAttachments = async (page = 0, search = "") => {
    setIsLoading(true);
    try {
      const offset = page * limit;
      const res = await GetAttachments(limit, offset, search);
      setAttachments(res?.data?.results || []);
      setTotalRecords(res?.data?.count || 0);
    } catch (err) {
      setErrorFn(err, t);
    } finally {
      setIsLoading(false);
    }
  };

  // Initialize temp selected IDs from props
  useEffect(() => {
    if (isOpen) {
      setTempSelectedIds(selectedAttachments.map((att) => att.id || att));
      loadAttachments(0, searchTerm);
    }
  }, [isOpen]);

  // Handle search
  const handleSearch = () => {
    setCurrentPage(1);
    loadAttachments(0, searchTerm);
  };

  // Toggle selection
  const toggleSelection = (id) => {
    setTempSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]
    );
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    loadAttachments(newPage - 1, searchTerm);
  };

  // Validate upload form
  const validateUploadForm = () => {
    const errors = {};
    if (!uploadForm.title.trim()) {
      errors.title = t("Title is required");
    }
    if (!uploadForm.file && !editingAttachment) {
      errors.file = t("File is required");
    }
    setUploadErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle create attachment
  const handleCreateAttachment = async (e) => {
    e.preventDefault();
    if (!validateUploadForm()) return;

    const formData = new FormData();
    formData.append("file_name", uploadForm.title);
    formData.append("description", uploadForm.title);
    if (uploadForm.file) {
      formData.append("file", uploadForm.file);
    }

    setIsLoading(true);
    try {
      await CreateAttachments(formData);
      toast.success(t("Attachment created successfully"));
      setShowCreateModal(false);
      setUploadForm({ title: "", file: null });
      loadAttachments(currentPage - 1, searchTerm);
    } catch (err) {
      setErrorFn(err, t);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle edit attachment
  const handleEditAttachment = async (e) => {
    e.preventDefault();
    if (!validateUploadForm()) return;

    const formData = new FormData();
    formData.append("file_name", uploadForm.title);
    formData.append("description", uploadForm.title);
    if (uploadForm.file) {
      formData.append("file", uploadForm.file);
    }

    setIsLoading(true);
    try {
      await EditAttachmentById(editingAttachment.id, formData);
      toast.success(t("Attachment updated successfully"));
      setShowEditModal(false);
      setEditingAttachment(null);
      setUploadForm({ title: "", file: null });
      loadAttachments(currentPage - 1, searchTerm);
    } catch (err) {
      setErrorFn(err, t);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle delete attachment
  const handleDeleteAttachment = async () => {
    setIsLoading(true);
    try {
      await DeleteAttachmentById(deletingAttachment.id);
      toast.success(t("Attachment deleted successfully"));
      setShowDeleteModal(false);
      setDeletingAttachment(null);
      loadAttachments(currentPage - 1, searchTerm);
    } catch (err) {
      setErrorFn(err, t);
    } finally {
      setIsLoading(false);
    }
  };

  // Open edit modal
  const openEditModal = (attachment) => {
    setEditingAttachment(attachment);
    setUploadForm({
      title: attachment.file_name || attachment.title || "",
      file: null,
    });
    setUploadErrors({});
    setRemovedCurrentFile(false);
    setShowEditModal(true);
  };

  // Handle confirm selection
  const handleConfirmSelection = () => {
    const selectedItems = attachments.filter((att) =>
      tempSelectedIds.includes(att.id)
    );
    onConfirm(selectedItems);
    onClose();
  };

  const totalPages = Math.ceil(totalRecords / limit);

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title={t("Select Attachments")}
        width="800px"
      >
        {isLoading && <Loader />}

        <div
          className="space-y-4"
          dir={i18n?.language === "ar" ? "rtl" : "ltr"}
        >
          {/* Search and Add Button */}
          <div className="flex gap-3">
            <div className="relative flex-1 flex">
              <input
                type="text"
                placeholder={t("Search attachments...")}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSearch();
                }}
                className={`flex-1 px-4 py-2 border border-gray-300 ${
                  i18n?.language === "ar" ? "rounded-r-lg" : "rounded-l-lg"
                } text-sm`}
              />
              {searchTerm && (
                <button
                  onClick={() => {
                    setSearchTerm("");
                    loadAttachments(0, "");
                  }}
                  className={`absolute ${
                    i18n?.language === "ar" ? "left-20" : "right-20"
                  } top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700`}
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={handleSearch}
                className={`px-4 py-2 bg-blue-600 text-white ${
                  i18n?.language === "ar" ? "rounded-l-lg" : "rounded-r-lg"
                } text-sm font-semibold hover:bg-blue-700`}
              >
                <Search className="w-4 h-4" />
              </button>
            </div>
            <button
              onClick={() => {
                setUploadForm({ title: "", file: null });
                setUploadErrors({});
                setShowCreateModal(true);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              <Upload className="w-4 h-4" />
              {t("Add New")}
            </button>
          </div>

          {/* Attachments List */}
          <div className="border rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left w-12">
                    <input
                      type="checkbox"
                      checked={
                        attachments.length > 0 &&
                        attachments.every((att) =>
                          tempSelectedIds.includes(att.id)
                        )
                      }
                      onChange={(e) => {
                        if (e.target.checked) {
                          setTempSelectedIds(attachments.map((att) => att.id));
                        } else {
                          setTempSelectedIds([]);
                        }
                      }}
                      className="rounded"
                    />
                  </th>
                  <th
                    className={`px-4 py-2 ${
                      i18n?.language === "ar" ? "text-right" : "text-left"
                    }`}
                  >
                    {t("File Name")}
                  </th>
                  <th
                    className={`px-4 py-2 ${
                      i18n?.language === "ar" ? "text-right" : "text-left"
                    }`}
                  >
                    {t("File")}
                  </th>
                  <th className="px-4 py-2 text-center w-32">{t("Actions")}</th>
                </tr>
              </thead>
              <tbody>
                {attachments.length > 0 ? (
                  attachments.map((attachment) => (
                    <tr
                      key={attachment.id}
                      className={`border-t hover:bg-gray-50 ${
                        tempSelectedIds.includes(attachment.id)
                          ? "bg-blue-50"
                          : ""
                      }`}
                    >
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={tempSelectedIds.includes(attachment.id)}
                          onChange={() => toggleSelection(attachment.id)}
                          className="rounded"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-blue-600" />
                          <span className="font-medium">
                            {attachment.file_name || attachment.title}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        {attachment.file ? (
                          <a
                            href={attachment.file}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline text-sm"
                          >
                            {t("View File")}
                          </a>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => openEditModal(attachment)}
                            className="p-1 rounded hover:bg-gray-100"
                            title={t("Edit")}
                          >
                            <Edit className="w-4 h-4 text-green-600" />
                          </button>
                          <button
                            onClick={() => {
                              setDeletingAttachment(attachment);
                              setShowDeleteModal(true);
                            }}
                            className="p-1 rounded hover:bg-gray-100"
                            title={t("Delete")}
                          >
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="4"
                      className="px-4 py-8 text-center text-gray-500"
                    >
                      {t("No attachments found")}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* Pagination */}
            {totalPages > 1 && (
              <TableButtons
                totalPages={totalPages}
                currentPage={currentPage}
                onPageChange={handlePageChange}
                t={t}
              />
            )}
          </div>

          {/* Selected Count */}
          <div className="text-sm text-gray-600">
            {t("Selected")}: {tempSelectedIds.length} {t("attachments")}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              {t("Cancel")}
            </button>
            <button
              onClick={handleConfirmSelection}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Check className="w-4 h-4" />
              {t("Confirm Selection")}
            </button>
          </div>
        </div>
      </Modal>

      {/* Create Attachment Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title={t("Add New Attachment")}
        width="500px"
      >
        <form
          onSubmit={handleCreateAttachment}
          className="space-y-4"
          dir={i18n?.language === "ar" ? "rtl" : "ltr"}
        >
          <div>
            <label className="block text-sm font-medium mb-1">
              {t("File Name")} *
            </label>
            <input
              type="text"
              value={uploadForm.title}
              onChange={(e) =>
                setUploadForm({ ...uploadForm, title: e.target.value })
              }
              className={`w-full px-3 py-2 border rounded-lg ${
                uploadErrors.title ? "border-red-500" : "border-gray-300"
              }`}
              placeholder={t("Enter attachment Name")}
            />
            {uploadErrors.title && (
              <p className="text-red-500 text-xs mt-1">{uploadErrors.title}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              {t("File")} *
            </label>
            <input
              type="file"
              onChange={(e) =>
                setUploadForm({ ...uploadForm, file: e.target.files[0] })
              }
              className={`w-full px-3 py-2 border rounded-lg ${
                uploadErrors.file ? "border-red-500" : "border-gray-300"
              }`}
              accept=".pdf,.doc,.docx,.ppt,.pptx,.txt"
            />
            {uploadErrors.file && (
              <p className="text-red-500 text-xs mt-1">{uploadErrors.file}</p>
            )}
            {uploadForm.file && (
              <p className="text-sm text-gray-600 mt-1">
                {uploadForm.file.name} (
                {(uploadForm.file.size / 1024 / 1024).toFixed(2)} MB)
              </p>
            )}
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setShowCreateModal(false)}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              {t("Cancel")}
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              {t("Create")}
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit Attachment Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setEditingAttachment(null);
        }}
        title={t("Edit Attachment")}
        width="500px"
      >
        <form
          onSubmit={handleEditAttachment}
          className="space-y-4"
          dir={i18n?.language === "ar" ? "rtl" : "ltr"}
        >
          <div>
            <label className="block text-sm font-medium mb-1">
              {t("File Name")} *
            </label>
            <input
              type="text"
              value={uploadForm.title}
              onChange={(e) =>
                setUploadForm({ ...uploadForm, title: e.target.value })
              }
              className={`w-full px-3 py-2 border rounded-lg ${
                uploadErrors.title ? "border-red-500" : "border-gray-300"
              }`}
              placeholder={t("Enter attachment Name")}
            />
            {uploadErrors.title && (
              <p className="text-red-500 text-xs mt-1">{uploadErrors.title}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              {t("File")}
            </label>
            {editingAttachment?.file && !removedCurrentFile ? (
              <div className="mb-3 p-3 bg-green-50 rounded-lg border border-green-200 flex items-start justify-between">
                <div>
                  <p className="text-sm text-green-700 font-medium mb-2">
                    ✓ {t("Current File")}:
                  </p>
                  <a
                    href={editingAttachment.file}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-600 hover:underline text-sm break-all"
                  >
                    {editingAttachment.file_name || t("View File")}
                  </a>
                </div>
                <button
                  type="button"
                  onClick={() => setRemovedCurrentFile(true)}
                  className="ml-3 px-3 py-1 bg-red-500 text-white text-xs font-medium rounded hover:bg-red-600"
                >
                  {t("Remove")}
                </button>
              </div>
            ) : null}
            {!editingAttachment?.file || removedCurrentFile ? (
              <>
                <input
                  type="file"
                  onChange={(e) =>
                    setUploadForm({ ...uploadForm, file: e.target.files[0] })
                  }
                  className="w-full px-3 py-2 border rounded-lg border-gray-300"
                  accept=".pdf,.doc,.docx,.ppt,.pptx,.txt"
                />
                {uploadForm.file ? (
                  <p className="text-sm text-green-600 mt-2 font-medium">
                    ✓ {t("New File Selected")}: {uploadForm.file.name} (
                    {(uploadForm.file.size / 1024 / 1024).toFixed(2)} MB)
                  </p>
                ) : null}
              </>
            ) : null}
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => {
                setShowEditModal(false);
                setEditingAttachment(null);
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              {t("Cancel")}
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              {t("Update")}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setDeletingAttachment(null);
        }}
        title={t("Confirm Deletion")}
        width="500px"
      >
        <DeleteConfirmation
          isOpen={showDeleteModal}
          onClose={() => {
            setShowDeleteModal(false);
            setDeletingAttachment(null);
          }}
          onConfirm={handleDeleteAttachment}
          title={t("Delete Attachment")}
          message={t(
            "Are you sure you want to delete this attachment? This action cannot be undone."
          )}
          itemName={deletingAttachment?.file_name || deletingAttachment?.title}
        />
      </Modal>
    </>
  );
}

export default AttachmentsModal;
