import React, { useState, useEffect } from "react";

import { Edit, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { LuArrowUpDown } from "react-icons/lu";
import { useTranslation } from "react-i18next";
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
import DeleteConfirmation from "@/components/ForPages/Dashboard/Videos/DeleteConfirmation/DeleteConfirmation";
import Loader from "@/components/Global/Loader/Loader";
import { setErrorFn } from "@/Utility/Global/setErrorFn";
import { DeleteReadingById, GetReadings } from "@/api/reading";

function GuidedReadingList({ onSectionChange }) {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
  const [selectedReading, setSelectedReading] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const limit = 10;
  const [readingData, setReadingData] = useState([]);

  const [update, setUpdate] = useState(false);

  // Fetch Data
  const getReadingData = async (page, searchVal = searchTerm) => {
    setIsLoading(true);
    const offset = page * 10;
    try {
      const res = await GetReadings(limit, offset, searchVal);
      setReadingData(res?.data?.results || []);
      setTotalRecords(res?.data?.count);
    } catch (error) {
      setErrorFn(error);
    } finally {
      setIsLoading(false);
    }
  };

  // دالة ترتيب البيانات
  const sortData = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
    // إعادة تعيين الصفحة للصفحة الأولى عند الترتيب
    if (currentPage !== 1) {
      setCurrentPage(1);
    }
  };

  // حساب عدد الصفحات
  const totalPages = Math.ceil(totalRecords / limit);

  // تغيير الصفحة
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // أيقونة الترتيب
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

  // تأكيد حذف القراءة
  const handleConfirmDelete = async () => {
    if (!selectedReading.id) return;

    setIsLoading(true);
    try {
      await DeleteReadingById(selectedReading.id);
      setShowDeleteModal(false);
      setSelectedReading(null);
      toast.success(t("Reading deleted successfully"));
      setUpdate(!update);
    } catch (error) {
      setErrorFn(error);
    } finally {
      setIsLoading(false);
    }
  };

  // إلغاء حذف القراءة
  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setSelectedReading(null);
  };

  // جلب البيانات عند تحميل المكون
  useEffect(() => {
    getReadingData(0);
  }, [update]);

  return (
    <div className="bg-white rounded-lg border border-gray-200 ">
      {isLoading && <Loader />}
      {/* Start Header */}
      <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b">
        <h2 className="text-lg font-medium text-[#1D2630]">
          {t("Guided Readings List")}
        </h2>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">
            {t("Total")}: {totalRecords} {t("readings")}
          </span>

          {/* Start Add Button */}
          <div>
            <button
              onClick={() => {
                setSelectedReading(null);
                onSectionChange("createOrEditGuidedReading");
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
            placeholder={t("Search Guided Readings")}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-l-lg text-sm pr-8"
          />

          {searchTerm && (
            <button
              onClick={() => {
                setSearchTerm("");
                getReadingData(0, "");
              }}
              className="absolute right-20 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          )}

          <button
            onClick={() => {
              if (searchTerm.trim()) {
                getReadingData(0);
              }
            }}
            className="px-4 py-2 bg-[#4680ff] text-white rounded-r-lg text-sm font-semibold hover:bg-blue-600"
          >
            {t("Search")}
          </button>
        </div>
      </div>
      {/* End Search */}
      {/* Start Table */}
      <Table>
        <TableHeader className="bg-[#FAFAFA] h-14 ">
          <TableRow className="border-b">
            <TableHead className="text-[#5B6B79] font-medium text-xs px-3">
              <div
                className="flex items-center gap-1 cursor-pointer hover:text-[#1E1E1E]"
                onClick={() => sortData("title")}
              >
                {t("Title")}
                {getSortIcon("title")}
              </div>
            </TableHead>
            <TableHead className="text-[#5B6B79] font-medium text-xs">
              <div
                className="flex items-center gap-1 cursor-pointer hover:text-[#1E1E1E]"
                onClick={() => sortData("author")}
              >
                {t("Author")}
                {getSortIcon("author")}
              </div>
            </TableHead>
            <TableHead className="text-[#5B6B79] font-medium text-xs">
              <div
                className="flex items-center gap-1 cursor-pointer hover:text-[#1E1E1E]"
                onClick={() => sortData("category")}
              >
                {t("Category")}
                {getSortIcon("category")}
              </div>
            </TableHead>
            <TableHead className="text-[#5B6B79] font-medium text-xs">
              <div
                className="flex items-center gap-1 cursor-pointer hover:text-[#1E1E1E]"
                onClick={() => sortData("genre")}
              >
                {t("Genre")}
                {getSortIcon("genre")}
              </div>
            </TableHead>
            <TableHead className="text-[#5B6B79] font-medium text-xs">
              <div
                className="flex items-center gap-1 cursor-pointer hover:text-[#1E1E1E]"
                onClick={() => sortData("language")}
              >
                {t("Language")}
                {getSortIcon("language")}
              </div>
            </TableHead>
            <TableHead className="text-[#5B6B79] font-medium text-xs">
              <div
                className="flex items-center gap-1 cursor-pointer hover:text-[#1E1E1E]"
                onClick={() => sortData("rating")}
              >
                {t("Rating")}
                {getSortIcon("rating")}
              </div>
            </TableHead>
            <TableHead className="text-[#5B6B79] font-medium text-xs">
              <div
                className="flex items-center gap-1 cursor-pointer hover:text-[#1E1E1E]"
                onClick={() => sortData("publish_date")}
              >
                {t("Publish Date")}
                {getSortIcon("publish_date")}
              </div>
            </TableHead>
            <TableHead className="text-[#5B6B79] font-medium text-xs">
              {t("Badge")}
            </TableHead>
            <TableHead className="text-[#5B6B79] font-medium text-xs">
              {t("Actions")}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="text-[11px] ">
          {readingData.map((reading) => (
            <TableRow
              key={reading.id}
              className=" hover:bg-gray-50/60 border-b"
            >
              <TableCell className="py-4">
                <div className="flex items-center gap-3">
                  <img
                    src={reading.image_url || reading.image}
                    alt={reading.title}
                    className="w-12 h-12 rounded object-cover bg-gray-100"
                    onError={(e) => {
                      e.target.src = "/placeholder-image.png";
                    }}
                  />
                  <div className="flex flex-col">
                    <span className="text-[#1E1E1E] font-medium text-[11px] line-clamp-2 max-w-[200px]">
                      {reading.title}
                    </span>
                  </div>
                </div>
              </TableCell>
              <TableCell className="text-[#1E1E1E] text-[11px] py-4">
                <span className="font-medium">{reading.author || "N/A"}</span>
              </TableCell>
              <TableCell className="text-[#1E1E1E] text-[11px] py-4">
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-[10px]">
                  {reading.category || "N/A"}
                </span>
              </TableCell>
              <TableCell className="text-[#1E1E1E] text-[11px] py-4">
                <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-[10px]">
                  {reading.genre || "N/A"}
                </span>
              </TableCell>
              <TableCell className="text-[#1E1E1E] text-[11px] py-4">
                <span className="font-medium">{reading.language || "N/A"}</span>
              </TableCell>
              <TableCell className="text-[#1E1E1E] text-[11px] py-4">
                <div className="flex items-center gap-1">
                  <span className="font-medium">
                    {reading.rating ? Number(reading.rating).toFixed(1) : "N/A"}
                  </span>
                  {reading.rating && (
                    <span className="text-yellow-500">★</span>
                  )}
                </div>
                {reading.reviews > 0 && (
                  <span className="text-[#9FA2AA] text-[10px]">
                    ({reading.reviews} {t("reviews")})
                  </span>
                )}
              </TableCell>
              <TableCell className="text-[#1E1E1E] text-[11px] py-4">
                <div className="flex flex-col">
                  <span className="font-medium">
                    {reading.publish_date
                      ? new Date(reading.publish_date).toLocaleDateString()
                      : "N/A"}
                  </span>
                </div>
              </TableCell>
              <TableCell className="py-4">
                {reading.badge ? (
                  <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-[10px]">
                    {t(reading.badge)}
                  </span>
                ) : (
                  <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-[10px]">
                    {t("None")}
                  </span>
                )}
              </TableCell>
              <TableCell className="py-4">
                <div className="flex items-center gap-2 text-[#5B6B79]">
                  <button
                    title={t("Edit")}
                    onClick={() => {
                      setSelectedReading(reading);
                      onSectionChange("createOrEditGuidedReading", reading);
                    }}
                    className="p-1 rounded hover:bg-gray-100 hover:text-green-600"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    title={t("Delete")}
                    onClick={() => {
                      setSelectedReading(reading);
                      setShowDeleteModal(true);
                    }}
                    className="p-1 rounded hover:bg-gray-100 hover:text-rose-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {/* End Table */}

      {/* Start Pagination */}
      {totalPages >= 1 && (
        <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-t bg-gray-50">
          <div className="text-sm text-gray-700">
            {t("Showing")} {(currentPage - 1) * limit + 1} {t("to")}{" "}
            {Math.min(currentPage * limit, totalRecords)} {t("of")}{" "}
            {totalRecords} {t("readings")}
          </div>

          <div className="flex items-center gap-2">
            {/* Start Previous Page Button */}
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="h-4 w-4" />
              {t("Previous")}
            </button>
            {/* End Previous Page Button */}
            <div className="flex items-center gap-1">
              {/* Start First Page Button */}
              {currentPage > 3 && (
                <>
                  <button
                    onClick={() => handlePageChange(1)}
                    className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    1
                  </button>
                  {currentPage > 4 && (
                    <span className="text-gray-500">...</span>
                  )}
                </>
              )}
              {/* End First Page Button */}
              {/* Start Middle Pages */}
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNum = Math.max(
                  1,
                  Math.min(currentPage - 2 + i, totalPages - 4 + i)
                );
                if (pageNum < 1 || pageNum > totalPages) return null;

                const isActive = pageNum === currentPage;
                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`px-3 py-2 text-sm font-medium rounded-md disabled:opacity-50 ${
                      isActive
                        ? "bg-blue-600 text-white border border-blue-600"
                        : "text-gray-700 bg-white border border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              }).filter(Boolean)}
              {/* End Middle Pages */}
              {/* Start Ellipsis */}
              {currentPage < totalPages - 2 && (
                <>
                  {currentPage < totalPages - 3 && (
                    <span className="text-gray-500">...</span>
                  )}
                  <button
                    onClick={() => handlePageChange(totalPages)}
                    className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    {totalPages}
                  </button>
                </>
              )}
              {/* End Ellipsis */}
            </div>

            {/* Start Next Page Button */}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {t("Next")}
              <ChevronLeft className="h-4 w-4" />
            </button>
            {/* End Next Page Button */}
          </div>
        </div>
      )}
      {/* End Pagination */}

      {/* Start Delete Reading Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={handleCancelDelete}
        title={t("Confirm Deletion")}
        width="500px"
      >
        <DeleteConfirmation
          isOpen={showDeleteModal}
          onClose={handleCancelDelete}
          onConfirm={handleConfirmDelete}
          title={t("Delete Reading")}
          message={t(
            "Are you sure you want to delete this reading? This action cannot be undone."
          )}
          itemName={selectedReading?.title}
        />
      </Modal>
      {/* End Delete Reading Modal */}
    </div>
  );
}

export default GuidedReadingList;