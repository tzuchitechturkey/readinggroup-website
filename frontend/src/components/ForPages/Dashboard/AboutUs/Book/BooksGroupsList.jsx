import React, { useState, useEffect } from "react";

import { useTranslation } from "react-i18next";
import { LuArrowUpDown, LuPencil, LuTrash2 } from "react-icons/lu";
import { toast } from "react-toastify";
import { Save, Eye } from "lucide-react";

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
import { setErrorFn } from "@/Utility/Global/setErrorFn";
import {
  GetBooksGroups,
  DeleteBooksGroupById,
  CreateBooksGroup,
  EditBooksGroupById,
  SortBooksGroups,
} from "@/api/books";

import CustomBreadcrumb from "../../CustomBreadcrumb/CustomBreadcrumb";

const BooksGroupsList = ({ onSectionChange }) => {
  const { t, i18n } = useTranslation();
  // State management
  const [search, setSearch] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "id", direction: "asc" });
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showFormModal, setShowFormModal] = useState(false);
  const [showDescriptionModal, setShowDescriptionModal] = useState(false);
  const [selectedDescription, setSelectedDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [update, setUpdate] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });
  const [initialFormData, setInitialFormData] = useState(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [draggedItem, setDraggedItem] = useState(null);
  const [isSorting, setIsSorting] = useState(false);
  const [originalGroupsData, setOriginalGroupsData] = useState([]);
  const [hasOrderChanges, setHasOrderChanges] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);
  const [groupsData, setGroupsData] = useState([]);

  // Fetch Book Groups from API
  const getGroupsData = async (page = 0, searchVal = search) => {
    setIsLoading(true);
    const offset = page * limit;

    // const params = searchVal ? { search: searchVal } : {};

    try {
      const res = await GetBooksGroups(limit, offset, searchVal);
      const results = res?.data?.results || [];
      setTotalRecords(res?.data?.count || 0);
      setGroupsData(results);
      setOriginalGroupsData(JSON.parse(JSON.stringify(results)));
      setHasOrderChanges(false);
    } catch (error) {
      setErrorFn(error, t);
    } finally {
      setIsLoading(false);
    }
  };

  // Local sorting for displayed data
  const getSortedData = () => {
    // لا تقم بالترتيب عند وجود تغييرات في الترتيب
    if (hasOrderChanges) {
      return groupsData || [];
    }

    if (!groupsData || !sortConfig.key) return groupsData || [];

    const sorted = [...groupsData].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (aValue === null || aValue === undefined) return 1;
      if (bValue === null || bValue === undefined) return -1;

      // numeric fields
      if (sortConfig.key === "id") {
        return sortConfig.direction === "asc"
          ? aValue - bValue
          : bValue - aValue;
      }

      // string fallback
      const strA = String(aValue).toLowerCase();
      const strB = String(bValue).toLowerCase();
      if (strA < strB) return sortConfig.direction === "asc" ? -1 : 1;
      if (strA > strB) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });

    return sorted;
  };

  // Initial load and refetch on dependencies change
  useEffect(() => {
    getGroupsData(currentPage - 1, search);
  }, [update]);

  // Sorting functionality
  const sortData = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  // Get sort icon
  const getSortIcon = (columnKey) => {
    if (sortConfig.key !== columnKey) {
      return <LuArrowUpDown className="h-3 w-3 text-gray-400" />;
    }

    if (sortConfig.direction === "asc") {
      return <LuArrowUpDown className="h-3 w-3 text-blue-600 rotate-180" />;
    }

    if (sortConfig.direction === "desc") {
      return <LuArrowUpDown className="h-3 w-3 text-blue-600" />;
    }

    return <LuArrowUpDown className="h-3 w-3 text-gray-400" />;
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages && !isLoading) {
      setCurrentPage(newPage);
      getGroupsData(newPage - 1, search);
    }
  };

  // Clear search
  const clearSearch = () => {
    setSearch("");
    setCurrentPage(1);
    getGroupsData(0, "");
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
    });
    setInitialFormData(null);
    setFormErrors({});
    setSelectedGroup(null);
    setHasChanges(false);
    setShowFormModal(false);
  };

  // Handle form input change
  const handleFormInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (formErrors[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  // Check for changes when editing
  useEffect(() => {
    if (selectedGroup && initialFormData) {
      const hasTextChanges = Object.keys(initialFormData).some((key) => {
        return formData[key] !== initialFormData[key];
      });
      setHasChanges(hasTextChanges);
    }
  }, [formData, selectedGroup, initialFormData]);

  // Drag and Drop handlers
  const handleDragStart = (e, item) => {
    setDraggedItem(item);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e, targetItem) => {
    e.preventDefault();

    if (!draggedItem || draggedItem.id === targetItem.id) {
      setDraggedItem(null);
      return;
    }

    // Reset sorting to avoid re-sorting after drop
    setSortConfig({ key: "id", direction: "asc" });

    const newGroupsData = [...groupsData];
    const draggedIndex = newGroupsData.findIndex(
      (group) => group.id === draggedItem.id
    );
    const targetIndex = newGroupsData.findIndex(
      (group) => group.id === targetItem.id
    );

    if (draggedIndex !== -1 && targetIndex !== -1) {
      [newGroupsData[draggedIndex], newGroupsData[targetIndex]] = [
        newGroupsData[targetIndex],
        newGroupsData[draggedIndex],
      ];

      setGroupsData(newGroupsData);
      setHasOrderChanges(true);
    }

    setDraggedItem(null);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
  };

  const handleSaveOrder = async () => {
    setIsSorting(true);
    try {
      const sortData = groupsData.map((categories, index) => ({
        id: categories.id,
        order: index,
      }));
      // Note: يحتاج API endpoint للترتيب - تأكد من وجود EndPoint
      await SortBooksGroups({ categories: sortData });
      toast.success(t("Book groups reordered successfully"));
      setHasOrderChanges(false);
      setOriginalGroupsData(JSON.parse(JSON.stringify(groupsData)));
    } catch (err) {
      console.error(err);
      toast.error(t("Failed to reorder groups"));
    } finally {
      setIsSorting(false);
    }
  };

  const handleCancelOrder = () => {
    setGroupsData(JSON.parse(JSON.stringify(originalGroupsData)));
    setHasOrderChanges(false);
    toast.info(t("Changes cancelled"));
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = t("Name is required");
    }

    setFormErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      const submitData = {
        name: formData.name,
        description: formData.description,
      };

      if (selectedGroup?.id) {
        await EditBooksGroupById(selectedGroup.id, submitData);
        toast.success(t("Book group updated successfully"));
      } else {
        await CreateBooksGroup(submitData);
        toast.success(t("Book group created successfully"));
      }

      resetForm();
      setUpdate((prev) => !prev);
    } catch (error) {
      setErrorFn(error, t);
    } finally {
      setIsLoading(false);
    }
  };

  // Open create form
  const openCreateForm = () => {
    resetForm();
    setShowFormModal(true);
  };

  // Open edit form
  const openEditForm = (group) => {
    const initialData = {
      name: group?.name || "",
      description: group?.description || "",
    };
    setFormData(initialData);
    setInitialFormData(initialData);
    setSelectedGroup(group);
    setHasChanges(false);
    setShowFormModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedGroup?.id) return;

    setIsLoading(true);
    try {
      await DeleteBooksGroupById(selectedGroup.id);
      toast.success(t("Book group deleted successfully"));
      setShowDeleteModal(false);
      setSelectedGroup(null);
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
      {/* Start Breadcrumb */}
      <CustomBreadcrumb
        backTitle={t("Back to Dashboard")}
        onBack={() => {
          onSectionChange("dashboard");
        }}
        page={t("Book Groups")}
      />
      {/* End Breadcrumb */}

      {/* Start Header */}
      <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b">
        <h2 className="text-lg font-medium text-[#1D2630]">
          {t("Book Groups")}
        </h2>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">
            {t("Total")}: {totalRecords} {t("groups")}
          </span>

          {/* Start Add Button */}
          <div>
            <button
              onClick={openCreateForm}
              className="text-sm bg-primary border-[1px] border-primary hover:bg-white hover:text-primary transition-all duration-200 text-white px-3 py-1.5 rounded"
            >
              {t("Add New")}
            </button>
          </div>
          {/* End Add Button */}
        </div>
      </div>
      {/* End Header */}

      {/* Start Search */}
      <div className="bg-white rounded-lg p-4 shadow-sm mb-6">
        <div className="relative max-w-md flex">
          <input
            type="text"
            placeholder={t("Search groups...")}
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
            }}
            className={`flex-1 px-4 py-2 border border-gray-300 ${
              i18n?.language === "ar" ? "rounded-r-lg" : "rounded-l-lg"
            } text-sm pr-8`}
          />

          {search && (
            <button
              onClick={() => {
                clearSearch();
              }}
              className={` absolute ${
                i18n?.language === "ar" ? " left-20" : " right-20"
              } top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700`}
            >
              ✕
            </button>
          )}

          <button
            onClick={() => getGroupsData(0, search)}
            className={`px-4 py-2 bg-[#4680ff] text-white ${
              i18n?.language === "ar" ? "rounded-l-lg" : "rounded-r-lg"
            } text-sm font-semibold hover:bg-blue-600`}
          >
            {t("Search")}
          </button>
        </div>
      </div>
      {/* End Search */}

      {/* Start Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <Table>
          <TableHeader className="bg-[#FAFAFA] h-14">
            <TableRow>
              <TableHead className="text-[#5B6B79] text-center font-medium text-xs px-3">
                <button
                  onClick={() => sortData("id")}
                  className="flex items-center gap-1 font-medium"
                >
                  #{getSortIcon("id")}
                </button>
              </TableHead>
              <TableHead className="text-[#5B6B79] text-center font-medium text-xs">
                <div className="flex items-center justify-center gap-1 cursor-pointer hover:text-[#1E1E1E]">
                  <button
                    onClick={() => sortData("name")}
                    className="flex items-center gap-1 font-medium"
                  >
                    {t("Name")}
                    {getSortIcon("name")}
                  </button>
                </div>
              </TableHead>
              <TableHead className="text-[#5B6B79] text-center font-medium text-xs">
                <div className="flex items-center justify-center gap-1 cursor-pointer hover:text-[#1E1E1E]">
                  <button
                    onClick={() => sortData("description")}
                    className="flex items-center gap-1 font-medium"
                  >
                    {t("Description")}
                    {getSortIcon("description")}
                  </button>
                </div>
              </TableHead>
              <TableHead className="text-center w-[100px]">
                {t("Actions")}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8">
                  <div className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600" />
                    {t("Loading Groups...")}
                  </div>
                </TableCell>
              </TableRow>
            ) : getSortedData().length > 0 ? (
              getSortedData().map((group) => (
                <TableRow
                  key={group?.id}
                  draggable
                  // onDragStart={(e) => handleDragStart(e, group)}
                  // onDragOver={handleDragOver}
                  // onDrop={(e) => handleDrop(e, group)}
                  // onDragEnd={handleDragEnd}
                  className={`transition-all duration-200 ${
                    draggedItem?.id === group.id
                      ? "opacity-50 bg-blue-50"
                      : "se hover:bg-gray-50"
                  } ${isSorting ? "opacity-75" : ""}`}
                  style={{
                    cursor: isSorting ? "not-allowed" : "moves",
                  }}
                >
                  <TableCell className="text-[#1E1E1E] font-bold text-[11px] py-4 px-4">
                    {group?.id}
                  </TableCell>
                  <TableCell>
                    <div className="min-w-0 text-center">
                      <p className="font-medium text-gray-900 truncate">
                        {group?.name}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center">
                      <button
                        onClick={() => {
                          setSelectedDescription(group?.description || "");
                          setShowDescriptionModal(true);
                        }}
                        className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded transition-colors"
                        title={t("View Description")}
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => openEditForm(group)}
                        className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded"
                        title={t("Edit")}
                      >
                        <LuPencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedGroup(group);
                          setShowDeleteModal(true);
                        }}
                        className="p-1 text-red-600 hover:text-red-800 hover:bg-red-100 rounded"
                        title={t("Delete")}
                      >
                        <LuTrash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="text-center py-8 text-gray-500"
                >
                  {search
                    ? t("No groups found matching your search.")
                    : t("No groups available.")}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Start Pagination */}
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

            {/* Page Numbers */}
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
                        : "border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}

              {totalPages > 5 && (
                <>
                  <span className="px-2 text-gray-500">...</span>
                  <button
                    onClick={() => handlePageChange(totalPages)}
                    disabled={currentPage === totalPages || isLoading}
                    className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {totalPages}
                  </button>
                </>
              )}
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
      {/* End Pagination */}

      {/* Save/Cancel Order Buttons */}
      {hasOrderChanges && (
        <div className="flex gap-3 p-4 bg-yellow-50 border-t border-yellow-200 mt-4 rounded-lg">
          <div className="flex-1 flex items-center gap-2">
            <div className="w-2 h-2 bg-yellow-500 rounded-full" />
            <span className="text-sm text-yellow-700">
              {t("You have unsaved changes in the group order")}
            </span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleCancelOrder}
              disabled={isSorting}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {t("Cancel")}
            </button>
            <button
              onClick={handleSaveOrder}
              disabled={isSorting}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
            >
              {isSorting ? (
                <>
                  <span className="inline-block animate-spin">⟳</span>
                  {t("Saving...")}
                </>
              ) : (
                `✓ ${t("Save Changes")}`
              )}
            </button>
          </div>
        </div>
      )}

      {/* Description Modal */}
      <Modal
        title={t("Group Description")}
        isOpen={showDescriptionModal}
        onClose={() => {
          setShowDescriptionModal(false);
          setSelectedDescription("");
        }}
      >
        <div className="p-4">
          <div
            className="prose max-w-none text-gray-700"
            dangerouslySetInnerHTML={{ __html: selectedDescription }}
          />
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        title={t("Confirm Delete")}
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedGroup(null);
        }}
      >
        <DeleteConfirmation
          isOpen={showDeleteModal}
          onClose={() => {
            setShowDeleteModal(false);
            setSelectedGroup(null);
          }}
          onConfirm={handleConfirmDelete}
          title={t("Delete Group")}
          message={t(
            "Are you sure you want to delete this group? This action cannot be undone."
          )}
          itemName={selectedGroup?.name}
        />
      </Modal>

      {/* Create/Edit Form Modal */}
      <Modal
        title={
          selectedGroup ? t("Edit Book Group") : t("Create New Book Group")
        }
        isOpen={showFormModal}
        onClose={resetForm}
        width="600px"
      >
        <form onSubmit={handleFormSubmit} className="space-y-6">
          {/* Name Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t("Name")} *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleFormInputChange}
              placeholder={t("Enter group name")}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                formErrors.name ? "border-red-500" : "border-gray-300"
              }`}
            />
            {formErrors.name && (
              <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>
            )}
          </div>

          {/* Description Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t("Description")}
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleFormInputChange}
              placeholder={t("Enter group description")}
              rows="4"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-3 justify-end pt-6 border-t">
            <button
              type="button"
              onClick={resetForm}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
            >
              {t("Cancel")}
            </button>
            <button
              type="submit"
              disabled={isLoading || (selectedGroup && !hasChanges)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="h-4 w-4" />
              {selectedGroup ? t("Update Group") : t("Create Group")}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default BooksGroupsList;
