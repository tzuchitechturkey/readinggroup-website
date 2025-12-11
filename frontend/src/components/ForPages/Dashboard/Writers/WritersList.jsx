import React, { useState, useEffect } from "react";

import { useTranslation } from "react-i18next";
import { LuArrowUpDown, LuPencil, LuTrash2 } from "react-icons/lu";
import { Eye, Loader, ToggleLeft, ToggleRight, X } from "lucide-react";
import { toast } from "react-toastify";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DeleteAuthorById, GetAuthors } from "@/api/authors";
import Modal from "@/components/Global/Modal/Modal";
import { setErrorFn } from "@/Utility/Global/setErrorFn";
import DeleteConfirmation from "@/components/Global/DeleteConfirmation/DeleteConfirmation";

import CustomBreadcrumb from "../CustomBreadcrumb/CustomBreadcrumb";

function WritersList({ onSectionChange }) {
  const { t, i18n } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(10); // Records per page
  const [search, setSearch] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "id", direction: "asc" });
  const [writersData, setWritersData] = useState([]);
  const totalPages = Math.ceil(totalRecords / limit);
  const [selectedWriter, setSelectedWriter] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [update, setUpdate] = useState(false);

  const getWritersData = async (searchVal = search) => {
    setIsLoading(true);
    try {
      const res = await GetAuthors(limit, (currentPage - 1) * limit, searchVal);
      setWritersData(res.data.results);
      setTotalRecords(res.data.total);
    } catch (error) {
      toast.error(t("Failed to fetch writers data."));
    } finally {
      setIsLoading(false);
    }
    // Replace with your API call
  };
  // Local sorting for displayed data
  const getSortedData = () => {
    if (!writersData || !sortConfig.key) return writersData || [];

    const sorted = [...writersData].sort((a, b) => {
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

  const handleConfirmDelete = async () => {
    if (!selectedWriter?.id) return;

    setIsLoading(true);
    try {
      await DeleteAuthorById(selectedWriter.id);
      toast.success(t("Writer deleted successfully"));
      setShowDeleteModal(false);
      setSelectedWriter(null);
      setUpdate((prev) => !prev);
    } catch (error) {
      setErrorFn(error, t);
    } finally {
      setIsLoading(false);
    }
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

  useEffect(() => {
    getWritersData();
  }, [update]);

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
        page={t("Writers List")}
      />
      {/* End Breadcrumb */}
      {/* Start Header */}
      <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b">
        <h2 className="text-lg font-medium text-[#1D2630]">{t("Writers")}</h2>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">
            {t("Total")}: {totalRecords} {t("writers")}
          </span>

          {/* Start Add Button */}
          <div>
            <button
              onClick={() => {
                onSectionChange("createOrEditWriter", null);
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
            placeholder={t("Search writers...")}
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
                setSearch("");
                getWritersData("");
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
              getWritersData(search);
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
      {/* Start Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-[#5B6B79] text-center font-medium text-xs px-3">
                <button className="flex items-center gap-1 font-medium">
                  #{"id"}
                </button>
              </TableHead>
              <TableHead className="text-[#5B6B79] text-center font-medium text-xs">
                <div className="flex items-center justify-center gap-1 cursor-pointer hover:text-[#1E1E1E]">
                  <button
                    onClick={() => sortData("name")}
                    className="flex items-center gap-1 font-medium"
                  >
                    {t("Name")}
                  </button>
                </div>
              </TableHead>
              <TableHead>
                <div className="flex items-center justify-center gap-1 cursor-pointer hover:text-[#1E1E1E]">
                  <button className="flex items-center gap-1 font-medium">
                    {t("Avatar")}
                  </button>
                </div>
              </TableHead>

              <TableHead className="text-[#5B6B79] text-center font-medium text-xs">
                <div className="flex items-center justify-center gap-1 cursor-pointer hover:text-[#1E1E1E]">
                  <button className="flex items-center gap-1 font-medium">
                    {t("Position")}
                  </button>
                </div>
              </TableHead>
              <TableHead className="text-[#5B6B79] text-center font-medium text-xs">
                <div className="flex items-center justify-center gap-1 cursor-pointer hover:text-[#1E1E1E]">
                  <button className="flex items-center gap-1 font-medium">
                    {t("Description")}
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
                <TableCell colSpan={7} className="text-center py-8">
                  <div className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600" />
                    {t("Loading Writers...")}
                  </div>
                </TableCell>
              </TableRow>
            ) : getSortedData().length > 0 ? (
              getSortedData().map((writer) => (
                <TableRow key={writer?.id} className="hover:bg-gray-50">
                  <TableCell className="text-[#1E1E1E] font-bold text-[11px] py-4 px-4">
                    {writer?.id}
                  </TableCell>
                  <TableCell>
                    <div className="min-w-0 text-center ">
                      <p className="font-medium text-gray-900 truncate">
                        {writer?.name}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center gap-3">
                      <img
                        src={writer?.avatar || writer?.avatar_url}
                        alt={writer?.name}
                        className="w-12 h-12 rounded-lg object-cover"
                        onError={(e) => {
                          e.target.src = "/placeholder-image.png";
                        }}
                      />
                    </div>
                  </TableCell>

                  <TableCell className="text-[#1E1E1E] text-center text-[11px] py-4">
                    <span className="text-gray-600 ">
                      {t(writer?.position)}
                    </span>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell text-center">
                    <span className="text-gray-600 ">
                      {t(writer?.description)}
                    </span>
                  </TableCell>

                  <TableCell>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setSelectedWriter(writer);
                          onSectionChange("createOrEditWriter", writer);
                        }}
                        className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded"
                        title={t("Edit")}
                      >
                        <LuPencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedWriter(writer);
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
                    ? t("No Writers found matching your search.")
                    : t("No Writers available.")}
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

      {/* Start Delete Confirmation Modal */}
      <Modal
        title={t("Confirm Delete")}
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedWriter(null);
        }}
      >
        <DeleteConfirmation
          isOpen={showDeleteModal}
          onClose={() => {
            setShowDeleteModal(false);
            setSelectedWriter(null);
          }}
          onConfirm={handleConfirmDelete}
          title={t("Delete Writer")}
          message={t(
            "Are you sure you want to delete this Writer? This action cannot be undone."
          )}
          itemName={selectedWriter?.name}
        />
      </Modal>
    </div>
  );
}

export default WritersList;
