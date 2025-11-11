import React, { useState, useEffect } from "react";

import { useTranslation } from "react-i18next";
import { LuArrowUpDown, LuPencil, LuTrash2 } from "react-icons/lu";
import { toast } from "react-toastify";
import { ToggleLeft, ToggleRight } from "lucide-react";

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
  GetContents,
  DeleteContentById,
  PatchContentById,
} from "@/api/contents";

import CustomBreadcrumb from "../../CustomBreadcrumb/CustomBreadcrumb";

const ContentsList = ({ onSectionChange }) => {
  const { t, i18n } = useTranslation();
  // State management
  const [search, setSearch] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "id", direction: "asc" });
  const [selectedContent, setSelectedContent] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [update, setUpdate] = useState(false);
  const [statusFilter, setStatusFilter] = useState("published"); // State for status filter

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);
  const [ContentsData, setContentsData] = useState([]);
  // Fetch Content from API
  const getContentsData = async (page = 0, searchVal = search, status = statusFilter) => {
    setIsLoading(true);
    const offset = page * limit;

    // params سيكون كائن حتى لو كان فقط search
    const params = searchVal ? { search: searchVal } : {};

    try {
      const res = await GetContents(limit, offset, status, params);

      setTotalRecords(res?.data?.count || 0);
      setContentsData(res?.data?.results || []);
    } catch (error) {
      setErrorFn(error, t);
    } finally {
      setIsLoading(false);
    }
  };

  // Local sorting for displayed data
  const getSortedData = () => {
    if (!ContentsData || !sortConfig.key) return ContentsData || [];

    const sorted = [...ContentsData].sort((a, b) => {
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

      // date fields
      if (sortConfig.key === "happened_at") {
        const dateA = new Date(aValue);
        const dateB = new Date(bValue);
        return sortConfig.direction === "asc" ? dateA - dateB : dateB - dateA;
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
    getContentsData(0, "", statusFilter);
  }, [update, statusFilter]);

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
      getContentsData(newPage - 1, search, statusFilter);
    }
  };

  // Clear search
  const clearSearch = () => {
    setSearch("");
    setCurrentPage(1);
    getContentsData(0, "", statusFilter);
  };

  // Handle status filter change
  const handleStatusChange = (newStatus) => {
    setStatusFilter(newStatus);
    setCurrentPage(1);
    setSearch("");
    getContentsData(0, "", newStatus);
  };
  // دالة التعامل مع تبديل القائمة الأسبوعية
  const handleWeeklyPostToggle = async (contentId, currentStatus) => {
    setIsLoading(true);
    try {
      PatchContentById(contentId, { weekly_event: !currentStatus });
    } catch (error) {
      setErrorFn(error, t);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedContent?.id) return;

    setIsLoading(true);
    try {
      await DeleteContentById(selectedContent.id);
      toast.success(t("Content deleted successfully"));
      setShowDeleteModal(false);
      setSelectedContent(null);
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
      {" "}
      {isLoading && <Loader />}
      {/* Start Breadcrumb */}
      <CustomBreadcrumb
        backTitle={t("Back to Dashboard")}
        onBack={() => {
          onSectionChange("dashboard");
        }}
        page={t("Contents List")}
      />
      {/* End Breadcrumb */}
      {/* Start Header */}
      <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b">
        <h2 className="text-lg font-medium text-[#1D2630]">
          {t("Contents List")}
        </h2>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">
            {t("Total")}: {totalRecords} {t("contents")}
          </span>

          {/* Start Add Button */}
          <div>
            <button
              onClick={() => {
                setSelectedContent(null);
                onSectionChange("createOrEditContent", null);
              }}
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
      <div className="bg-white rounded-lg p-4 mb-6 shadow-sm">
        <div className="relative max-w-md flex">
          <input
            type="text"
            placeholder={t("Search contents...")}
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
            onClick={() => getContentsData(0, search, statusFilter)}
            className={`px-4 py-2 bg-[#4680ff] text-white ${
              i18n?.language === "ar" ? "rounded-l-lg" : "rounded-r-lg"
            }  text-sm font-semibold hover:bg-blue-600`}
          >
            {t("Search")}
          </button>
        </div>
      </div>
      {/* End Search */}

      {/* Start Status Tabs Filter */}
      <div className="bg-white rounded-lg p-4 mb-6 shadow-sm border-b">
        <div className="flex items-center gap-4 flex-wrap">
          <span className="text-sm font-medium text-gray-700">{t("Status")}:</span>
          <div className="flex gap-2 flex-wrap">
            {["published", "draft", "archived"].map((status) => (
              <button
                key={status}
                onClick={() => handleStatusChange(status)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  statusFilter === status
                    ? "bg-primary text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {t(status.charAt(0).toUpperCase() + status.slice(1))}
              </button>
            ))}
          </div>
        </div>
      </div>
      {/* End Status Tabs Filter */}
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
                    onClick={() => sortData("title")}
                    className="flex items-center gap-1 font-medium"
                  >
                    {t("Title")}
                    {getSortIcon("title")}
                  </button>
                </div>
              </TableHead>
              <TableHead>
                <div className="flex items-center justify-center gap-1 cursor-pointer hover:text-[#1E1E1E]">
                  <button
                    onClick={() => sortData("title")}
                    className="flex items-center gap-1 font-medium"
                  >
                    {t("Images")}
                  </button>
                </div>
              </TableHead>
              <TableHead className="hidden md:table-cell">
                <div className="flex items-center justify-center gap-1 cursor-pointer hover:text-[#1E1E1E]">
                  <button className="flex items-center gap-1 font-medium">
                    {t("Section")}
                  </button>
                </div>
              </TableHead>
              <TableHead className="text-[#5B6B79] text-center font-medium text-xs">
                <div className="flex items-center justify-center gap-1 cursor-pointer hover:text-[#1E1E1E]">
                  <button
                    onClick={() => sortData("happened_at")}
                    className="flex items-center gap-1 font-medium"
                  >
                    {t("Date")}
                    {getSortIcon("happened_at")}
                  </button>
                </div>
              </TableHead>
              <TableHead className="hidden sm:table-cell">
                <div className="flex items-center justify-center gap-1 cursor-pointer hover:text-[#1E1E1E]">
                  <button
                    onClick={() => sortData("report_type")}
                    className="flex items-center gap-1 font-medium"
                  >
                    {t("Type")}
                    {getSortIcon("report_type")}
                  </button>
                </div>
              </TableHead>
              <TableHead className="hidden sm:table-cell">
                <div className="flex items-center justify-center gap-1 cursor-pointer hover:text-[#1E1E1E]">
                  <button
                    onClick={() => sortData("category")}
                    className="flex items-center gap-1 font-medium"
                  >
                    {t("Category")}
                    {getSortIcon("category")}
                  </button>
                </div>
              </TableHead>
              <TableHead className=" text-center text-[#5B6B79] font-medium text-xs">
                <div className="flex items-center justify-center gap-1 cursor-pointer hover:text-[#1E1E1E]">
                  {t("Weekly List")}
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
                <TableCell colSpan={7} className="text-center py-8">
                  <div className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600" />
                    {t("Loading Content...")}
                  </div>
                </TableCell>
              </TableRow>
            ) : getSortedData().length > 0 ? (
              getSortedData().map((content) => (
                <TableRow key={content?.id} className="hover:bg-gray-50">
                  <TableCell className="text-[#1E1E1E] font-bold text-[11px] py-4 px-4">
                    {content?.id}
                  </TableCell>
                  <TableCell>
                    <div className="min-w-0 text-center ">
                      <p className="font-medium text-gray-900 truncate">
                        {content?.title}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center gap-3">
                      <img
                        src={content?.images[0]?.image || content?.image_url[0]}
                        alt={content?.title}
                        className="w-12 h-12 rounded-lg object-cover"
                        onError={(e) => {
                          e.target.src = "/placeholder-image.png";
                        }}
                      />
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <p
                      className="text-gray-600 max-w-xs truncate text-center"
                      title={content?.section?.name}
                    >
                      {content?.section?.name}
                    </p>
                  </TableCell>
                  <TableCell className="text-[#1E1E1E] text-center text-[11px] py-4">
                    <div className="flex flex-col items-center ">
                      <span className="font-medium">
                        {new Date(content.happened_at).toLocaleDateString(
                          "en-GB",
                          {
                            year: "numeric",
                            month: "2-digit",
                            day: "2-digit",
                          }
                        )}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell text-center">
                    <span className="text-gray-600 ">
                      {t(content?.report_type)}
                    </span>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell text-center">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {content?.category?.name}
                    </span>
                  </TableCell>
                  <TableCell className="text-center py-4">
                    <button
                      onClick={() =>
                        handleWeeklyPostToggle(
                          content?.id,
                          content?.weekly_post
                        )
                      }
                      className={`py-1 rounded-full text-[10px] font-medium transition-colors ${
                        content?.weekly_post
                          ? "bg-green-100 text-green-800 hover:bg-green-200"
                          : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                      }`}
                    >
                      {content?.weekly_post ? (
                        <ToggleRight className="h-8 w-12" />
                      ) : (
                        <ToggleLeft className="h-8 w-12" />
                      )}
                    </button>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setSelectedContent(content);
                          onSectionChange("createOrEditContent", content);
                        }}
                        className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded"
                        title={t("Edit")}
                      >
                        <LuPencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedContent(content);
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
                  colSpan={7}
                  className="text-center py-8 text-gray-500"
                >
                  {search
                    ? t("No Content found matching your search.")
                    : t("No Content available.")}
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
      {/* Delete Confirmation Modal */}
      <Modal
        title={t("Confirm Delete")}
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedContent(null);
        }}
      >
        <DeleteConfirmation
          isOpen={showDeleteModal}
          onClose={() => {
            setShowDeleteModal(false);
            setSelectedContent(null);
          }}
          onConfirm={handleConfirmDelete}
          title={t("Delete Post")}
          message={t(
            "Are you sure you want to delete this Post? This action cannot be undone."
          )}
          itemName={selectedContent?.title}
        />
      </Modal>
    </div>
  );
};

export default ContentsList;
