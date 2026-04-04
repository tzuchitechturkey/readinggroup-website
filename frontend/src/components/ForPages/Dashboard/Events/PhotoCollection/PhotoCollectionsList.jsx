import React, { useState, useEffect } from "react";

import { useTranslation } from "react-i18next";
import { LuArrowUpDown, LuPencil, LuTrash2, LuEye } from "react-icons/lu";
import { toast } from "react-toastify";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Modal from "@/components/Global/Modal/Modal";
import DeleteConfirmation from "@/components/Global/DeleteConfirmation/DeleteConfirmation";
import Loader from "@/components/Global/Loader/Loader";
import AutoComplete from "@/components/Global/AutoComplete/AutoComplete";
import { setErrorFn } from "@/Utility/Global/setErrorFn";
import {
  GetCollections,
  DeleteCollectionById,
  EditCollectionById,
  GetAllImages,
} from "@/api/photoCollections";
import CustomBreadcrumb from "@/components/ForPages/Dashboard/CustomBreadcrumb/CustomBreadcrumb";

const PhotoCollectionsList = ({ onSectionChange }) => {
  const { t, i18n } = useTranslation();
  // State management
  const [search, setSearch] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: "happened_at",
    direction: "desc",
  });
  const [selectedCollection, setSelectedCollection] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [update, setUpdate] = useState(false);

  // Edit Modal State
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingCollection, setEditingCollection] = useState(null);
  const [editFormData, setEditFormData] = useState({
    image: null,
    imageFile: null,
    collection_id: null,
  });
  const [availableCollections, setAvailableCollections] = useState([]);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);
  const [collectionsData, setCollectionsData] = useState([]);

  // Fetch Collections from API
  const getCollectionsData = async (page = 0, searchVal = search) => {
    setIsLoading(true);
    const offset = page * limit;
    const ordering =
      sortConfig.direction === "desc" ? `-${sortConfig.key}` : sortConfig.key;

    try {
      const res = await GetAllImages(limit, offset, searchVal, ordering);
      setTotalRecords(res?.data?.count || 0);
      setCollectionsData(res?.data?.results || []);
    } catch (error) {
      setErrorFn(error, t);
    } finally {
      setIsLoading(false);
    }
  };

  // Get available collections for the editing modal
  const getAvailableCollections = async (search = "") => {
    try {
      const res = await GetCollections(100, 0, search);
      const collectionsData = res.data.results.map((collection) => ({
        id: collection.id,
        title: collection.title,
      }));
      setAvailableCollections(collectionsData);
    } catch (err) {
      console.error("Error fetching collections:", err);
      setErrorFn(err, t);
    }
  };

  useEffect(() => {
    getAvailableCollections();
  }, []);

  const handleEditClick = (collection) => {
    setEditingCollection(collection);
    setEditFormData({
      image: collection.image || null,
      imageFile: null,
      collection_id: collection.id || null,
    });
    setShowEditModal(true);
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setEditFormData((prev) => ({
        ...prev,
        imageFile: file,
        image: URL.createObjectURL(file),
      }));
    }
  };

  const handleEditSubmit = async () => {
    if (!editingCollection?.id) return;

    setIsLoading(true);
    try {
      const submitData = new FormData();

      if (editFormData.imageFile) {
        submitData.append("image", editFormData.imageFile);
      }

      if (editFormData.collection_id) {
        submitData.append("collection_id", editFormData.collection_id);
      }

      await EditCollectionById(editingCollection.id, submitData);
      toast.success(t("Photo collection updated successfully"));
      setShowEditModal(false);
      setEditingCollection(null);
      setUpdate((prev) => !prev);
    } catch (error) {
      setErrorFn(error, t);
    } finally {
      setIsLoading(false);
    }
  };

  // Sorting functionality
  const sortData = (key) => {
    let direction = "desc";
    if (sortConfig.key === key && sortConfig.direction === "desc") {
      direction = "asc";
    }
    setSortConfig({ key, direction });
  };

  // Get sort icon
  const getSortIcon = (columnKey) => {
    if (sortConfig.key !== columnKey) {
      return <LuArrowUpDown className="h-3 w-3 text-gray-400" />;
    }
    if (sortConfig.direction === "desc") {
      return <LuArrowUpDown className="h-3 w-3 text-blue-600" />;
    }
    if (sortConfig.direction === "asc") {
      return <LuArrowUpDown className="h-3 w-3 text-blue-600 rotate-180" />;
    }
    return <LuArrowUpDown className="h-3 w-3 text-gray-400" />;
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages && !isLoading) {
      setCurrentPage(newPage);
      getCollectionsData(newPage - 1, search);
    }
  };

  // Clear search
  const clearSearch = () => {
    setSearch("");
    setCurrentPage(1);
    getCollectionsData(0, "");
  };

  const handleConfirmDelete = async () => {
    if (!selectedCollection?.id) return;

    setIsLoading(true);
    try {
      await DeleteCollectionById(selectedCollection.id);
      toast.success(t("Photo collection deleted successfully"));
      setShowDeleteModal(false);
      setSelectedCollection(null);
      setUpdate((prev) => !prev);
    } catch (error) {
      setErrorFn(error, t);
    } finally {
      setIsLoading(false);
    }
  };

  // Pagination
  const totalPages = Math.ceil(totalRecords / limit);

  return (
    <div
      className="bg-white rounded-lg border border-gray-200 pt-3 px-3"
      dir={i18n?.language === "ar" ? "rtl" : "ltr"}
    >
      {isLoading && <Loader />}

      {/* Breadcrumb */}
      <CustomBreadcrumb
        backTitle={t("Back to Dashboard")}
        onBack={() => onSectionChange("dashboard")}
        page={t("Photo Collections List")}
      />

      {/* Header */}
      <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b">
        <h2 className="text-lg font-medium text-[#1D2630]">
          {t("Photo Collections")}
        </h2>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">
            {t("Total")}: {totalRecords} {t("collections")}
          </span>
          <button
            onClick={() => {
              setSelectedCollection(null);
              onSectionChange("createOrEditPhotoCollection", null);
            }}
            className="text-sm bg-primary border-[1px] border-primary hover:bg-white hover:text-primary transition-all duration-200 text-white px-3 py-1.5 rounded"
          >
            {t("Add New")}
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg p-4 mb-6 shadow-sm">
        <div className="relative max-w-md flex">
          <input
            type="text"
            placeholder={t("Search collections...")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={`flex-1 px-4 py-2 border border-gray-300 ${
              i18n?.language === "ar" ? "rounded-r-lg" : "rounded-l-lg"
            } text-sm pr-8`}
          />
          {search && (
            <button
              onClick={clearSearch}
              className={`absolute ${
                i18n?.language === "ar" ? "left-20" : "right-20"
              } top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700`}
            >
              ✕
            </button>
          )}
          <button
            onClick={() => getCollectionsData(0, search)}
            className={`px-4 py-2 bg-[#4680ff] text-white ${
              i18n?.language === "ar" ? "rounded-l-lg" : "rounded-r-lg"
            } text-sm font-semibold hover:bg-blue-600`}
          >
            {t("Search")}
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-[#5B6B79] text-center font-medium text-xs">
                {t("Image")}
              </TableHead>

              <TableHead className="text-[#5B6B79] text-center font-medium text-xs px-3">
                <button
                  onClick={() => sortData("happened_at")}
                  className="flex items-center gap-1 font-medium"
                >
                  {t("Date")}
                  {getSortIcon("happened_at")}
                </button>
              </TableHead>
              <TableHead className="text-center w-[100px]">
                {t("Actions")}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">
                  <div className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600" />
                    {t("Loading Collections...")}
                  </div>
                </TableCell>
              </TableRow>
            ) : collectionsData.length > 0 ? (
              collectionsData.map((collection) => (
                <TableRow key={collection?.id} className="hover:bg-gray-50">
                  {/* Image */}
                  <TableCell className="text-center py-4">
                    <div className="flex justify-center">
                      {collection?.image || collection?.image_url ? (
                        <img
                          src={collection.image || collection.image_url}
                          alt={collection.title}
                          className="w-16 h-12 object-cover rounded"
                        />
                      ) : (
                        <div className="w-16 h-12 bg-gray-200 rounded flex items-center justify-center">
                          <span className="text-xs text-gray-500">
                            {t("No Image")}
                          </span>
                        </div>
                      )}
                    </div>
                  </TableCell>

                  {/* Date */}
                  <TableCell className="text-[#1E1E1E] text-center text-[11px] py-4">
                    <span className="font-medium">
                      {collection?.happened_at &&
                        new Date(collection.happened_at).toLocaleDateString(
                          "en-GB",
                          {
                            year: "numeric",
                            month: "2-digit",
                            day: "2-digit",
                          },
                        )}
                    </span>
                  </TableCell>

                  {/* Actions */}
                  <TableCell>
                    <div className="flex items-center gap-2 justify-center">
                      <button
                        onClick={() => {
                          // Navigate to photos management page
                          // onSectionChange("manageCollectionPhotos", collection);
                        }}
                        className="p-1 text-green-600 hover:text-green-800 hover:bg-green-100 rounded"
                        title={t("Manage Photos")}
                      >
                        <LuEye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleEditClick(collection)}
                        className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded"
                        title={t("Edit")}
                      >
                        <LuPencil className="h-4 w-4" />
                      </button>
                      {localStorage.getItem("userType") !== "editor" && (
                        <button
                          onClick={() => {
                            setSelectedCollection(collection);
                            setShowDeleteModal(true);
                          }}
                          className="p-1 text-red-600 hover:text-red-800 hover:bg-red-100 rounded"
                          title={t("Delete")}
                        >
                          <LuTrash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center py-8 text-gray-500"
                >
                  {search
                    ? t("No collections found matching your search.")
                    : t("No collections available.")}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-6">
          <div className="text-sm text-gray-600">
            {t("Showing")} {(currentPage - 1) * limit + 1} {t("to")}{" "}
            {Math.min(currentPage * limit, totalRecords)} {t("of")}{" "}
            {totalRecords} {t("results")}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1 || isLoading}
              className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {t("Previous")}
            </button>
            <div className="flex items-center gap-1">
              {[...Array(Math.min(5, totalPages))].map((_, i) => {
                const pageNum = i + 1;
                const isActive = pageNum === currentPage;
                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    disabled={isLoading}
                    className={`px-3 py-1 text-sm rounded ${
                      isActive
                        ? "bg-blue-600 text-white"
                        : "border border-gray-300 hover:bg-gray-50"
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages || isLoading}
              className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {t("Next")}
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <Modal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
        <DeleteConfirmation
          title={t("Delete Photo Collection")}
          message={t(
            "Are you sure you want to delete this photo collection? This action cannot be undone.",
          )}
          onConfirm={handleConfirmDelete}
          onCancel={() => setShowDeleteModal(false)}
          confirmText={t("Delete")}
          cancelText={t("Cancel")}
        />
      </Modal>

      {/* Edit Collection Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setEditingCollection(null);
        }}
        title={t("Edit Photo Collection")}
        width="600px"
      >
        <div className="space-y-4">
          {/* Image Section */}
          <div>
            <label className="block text-sm font-medium mb-2">
              {t("Collection Image")}
            </label>
            <div className="flex flex-col gap-4">
              {/* Image Preview */}
              {editFormData.image ? (
                <div className="relative">
                  <img
                    src={editFormData.image}
                    alt={editingCollection?.title}
                    className="w-full h-48 object-cover rounded"
                  />
                </div>
              ) : (
                <div className="w-full h-48 bg-gray-200 rounded flex items-center justify-center">
                  <span className="text-gray-500">{t("No Image")}</span>
                </div>
              )}

              {/* File Input */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  {t("Change Image")}
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
            </div>
          </div>

          {/* Collection Category */}
          <div>
            <AutoComplete
              label={t("Collection Category")}
              placeholder={t("Select a collection category")}
              selectedItem={
                availableCollections.find(
                  (c) => c.id === editFormData.collection_id,
                ) || null
              }
              onSelect={(item) =>
                setEditFormData((prev) => ({
                  ...prev,
                  collection_id: item?.id || null,
                }))
              }
              onClear={() =>
                setEditFormData((prev) => ({
                  ...prev,
                  collection_id: null,
                }))
              }
              list={availableCollections}
              searchMethod={getAvailableCollections}
              searchApi={true}
              searchPlaceholder={t("Search collections...")}
              required={true}
              renderItemLabel={(item) => item.title || item.name || ""}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-2 pt-4">
            <button
              type="button"
              onClick={() => {
                setShowEditModal(false);
                setEditingCollection(null);
              }}
              disabled={isLoading}
              className="px-4 py-2 border rounded disabled:opacity-50"
            >
              {t("Cancel")}
            </button>
            <button
              type="button"
              onClick={handleEditSubmit}
              disabled={isLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
            >
              {isLoading ? t("Saving...") : t("Save Changes")}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default PhotoCollectionsList;
