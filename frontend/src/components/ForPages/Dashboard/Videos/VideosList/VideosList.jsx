import React, { useState, useEffect } from "react";

import { Eye, Edit, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
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
import { DeleteVideoById, GetVideos } from "@/api/videos";

import ShowVideoDetails from "../ShowVideoDetails/ShowVideoDetails";
import CreateOrEditVideo from "../CreateOrEditVideo/CreateOrEditVideo";

function VideosList({ onSectionChange }) {
  const { t, i18n } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showCreateEditModal, setShowCreateEditModal] = useState(false);
  const [editingVideo, setEditingVideo] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0); // Mock total records
  const limit = 10;
  const [videoData, setVideoData] = useState([]);

  const [update, setUpdate] = useState(false);

  // Fetch Data
  const getVideoData = async (page, searchVal = searchTerm) => {
    setIsLoading(true);
    const offset = page * 10;
    try {
      const res = await GetVideos(limit, offset, searchVal);
      setVideoData(res?.data?.results || []);
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
  };

  // فرز البيانات المعروضة
  const getSortedData = () => {
    if (!sortConfig.key) return videoData;

    const sortedData = [...videoData].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      // Handle null/undefined values
      if (aValue === null || aValue === undefined) return 1;
      if (bValue === null || bValue === undefined) return -1;

      // Handle different data types
      if (sortConfig.key === "views") {
        // Numeric sort
        return sortConfig.direction === "asc"
          ? aValue - bValue
          : bValue - aValue;
      }

      if (sortConfig.key === "published_at") {
        // Date sort
        const dateA = new Date(aValue);
        const dateB = new Date(bValue);
        return sortConfig.direction === "asc" ? dateA - dateB : dateB - dateA;
      }

      // String sort
      const strA = String(aValue).toLowerCase();
      const strB = String(bValue).toLowerCase();

      if (strA < strB) {
        return sortConfig.direction === "asc" ? -1 : 1;
      }
      if (strA > strB) {
        return sortConfig.direction === "asc" ? 1 : -1;
      }
      return 0;
    });

    return sortedData;
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

  // عرض تفاصيل الفيديو
  const handleViewDetails = (video) => {
    setSelectedVideo(video);
    setShowDetailsModal(true);
  };

  // تأكيد حذف الفيديو
  const handleConfirmDelete = async () => {
    if (!selectedVideo.id) return;

    setIsLoading(true);
    try {
      await DeleteVideoById(selectedVideo.id);
      setShowDeleteModal(false);
      setSelectedVideo(null);
      toast.success(t("Video deleted successfully"));
      setUpdate(!update);
    } catch (error) {
      setErrorFn(error);
    } finally {
      setIsLoading(false);
    }
  };

  // إلغاء حذف الفيديو
  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setSelectedVideo(null);
  };

  // تعديل الفيديو
  const handleEdit = (videoId) => {
    const video = videoData.find((v) => v.id === videoId);
    setEditingVideo(video);
    onSectionChange("createOrEditVideo", video);
  };

  useEffect(() => {
    getVideoData(0);
  }, [update]);
  return (
    <div
      className="bg-white rounded-lg border border-gray-200 "
      dir={i18n?.language === "ar" ? "rtl" : "ltr"}
    >
      {isLoading && <Loader />}
      {/* Start Header */}
      <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b">
        <h2 className="text-lg font-medium text-[#1D2630]">
          {t("Videos List")}
        </h2>
        <div className="flex items-center justify-center gap-2">
          <span className="text-sm text-gray-500">
            {t("Total")}: {totalRecords} {t("videos")}
          </span>

          {/* Start Add Button */}
          <div>
            <button
              onClick={() => {
                setSelectedVideo(null);
                onSectionChange("createOrEditVideo");
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
            placeholder={t("Search Historical Events")}
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
                getVideoData(0, "");
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
                getVideoData(0);
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
      {/* Start Table */}
      <Table>
        <TableHeader className="bg-[#FAFAFA] h-14 ">
          <TableRow className="border-b">
            <TableHead className="text-[#5B6B79] text-center font-medium text-xs px-3">
              <div
                className="flex items-center justify-center gap-1 cursor-pointer hover:text-[#1E1E1E]"
                onClick={() => sortData("reference_code")}
              >
                ID
                {/* {t("Reference Code")}
                {getSortIcon("reference_code")} */}
              </div>
            </TableHead>
            <TableHead className="text-[#5B6B79] text-center font-medium text-xs">
              <div className="flex items-center justify-center gap-1 cursor-pointer hover:text-[#1E1E1E]">
                {t("Image")}
              </div>
            </TableHead>
            <TableHead className="text-[#5B6B79] text-center font-medium text-xs">
              <div
                className="flex items-center justify-center gap-1 cursor-pointer hover:text-[#1E1E1E]"
                onClick={() => sortData("title")}
              >
                {t("Title")}
                {getSortIcon("title")}
              </div>
            </TableHead>
            <TableHead className="text-[#5B6B79] text-center font-medium text-xs">
              <div
                className="flex items-center justify-center gap-1 cursor-pointer hover:text-[#1E1E1E]"
                onClick={() => sortData("category")}
              >
                {t("Category")}
                {getSortIcon("category")}
              </div>
            </TableHead>
            <TableHead className="text-[#5B6B79] text-center font-medium text-xs">
              <div
                className="flex items-center justify-center gap-1 cursor-pointer hover:text-[#1E1E1E]"
                onClick={() => sortData("video_type")}
              >
                {t("Type")}
                {getSortIcon("video_type")}
              </div>
            </TableHead>
            <TableHead className="text-[#5B6B79] text-center font-medium text-xs">
              <div
                className="flex items-center justify-center gap-1 cursor-pointer hover:text-[#1E1E1E]"
                onClick={() => sortData("duration")}
              >
                {t("Duration")}
                {getSortIcon("duration")}
              </div>
            </TableHead>
            <TableHead className="text-[#5B6B79] text-center font-medium text-xs">
              <div
                className="flex items-center justify-center gap-1 cursor-pointer hover:text-[#1E1E1E]"
                onClick={() => sortData("views")}
              >
                {t("Views")}
                {getSortIcon("views")}
              </div>
            </TableHead>
            <TableHead className="text-[#5B6B79] text-center font-medium text-xs">
              <div
                className="flex items-center justify-center gap-1 cursor-pointer hover:text-[#1E1E1E]"
                onClick={() => sortData("published_at")}
              >
                {t("Published Date")}
                {getSortIcon("published_at")}
              </div>
            </TableHead>
            <TableHead className="text-[#5B6B79] text-center font-medium text-xs">
              {t("Status")}
            </TableHead>
            <TableHead className="text-[#5B6B79] text-center font-medium text-xs">
              {t("Actions")}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="text-[11px] ">
          {getSortedData().map((video) => (
            <TableRow key={video.id} className=" hover:bg-gray-50/60 border-b">
              <TableCell className="text-[#1E1E1E] text-center font-bold text-[11px] py-4 px-4">
                <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-[10px] font-mono">
                  {video.id}
                </span>
              </TableCell>
              <TableCell className="py-4">
                <div className="flex items-center justify-center gap-3">
                  <img
                    src={video.thumbnail_url || video.thumbnail}
                    alt={video.title}
                    className="w-12 h-12 rounded object-cover bg-gray-100"
                    onError={(e) => {
                      e.target.src = "/placeholder-video.png";
                    }}
                  />
                </div>
              </TableCell>
              <TableCell className="py-4">
                <div className="flex flex-col items-center">
                  <span className="text-[#1E1E1E] font-medium text-[11px] line-clamp-2 max-w-[200px]">
                    {video.title}
                  </span>
                  <span className="text-[#9FA2AA] text-[10px]">
                    {video.language} • {video.subject}
                  </span>
                </div>
              </TableCell>
              <TableCell className="text-center text-[#1E1E1E] text-[11px] py-4">
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-[10px]">
                  {video.category?.name}
                </span>
              </TableCell>
              <TableCell className="text-[#1E1E1E] text-center text-[11px] py-4">
                <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-[10px]">
                  {video.video_type}
                </span>
              </TableCell>
              <TableCell className="text-[#1E1E1E] text-center text-[11px] py-4">
                <span className="font-medium">{video.duration}</span>
              </TableCell>
              <TableCell className="text-[#1E1E1E] text-center text-[11px] py-4">
                <div className="flex flex-col items-center">
                  <span className="font-medium">
                    {video.views ? video.views.toLocaleString() : 0}
                  </span>
                  <span className="text-[#9FA2AA] text-[10px]">
                    {t("views")}
                  </span>
                </div>
              </TableCell>
              <TableCell className="text-[#1E1E1E] text-center text-[11px] py-4">
                <div className="flex flex-col items-center">
                  <span className="font-medium">
                    {new Date(video.published_at).toLocaleDateString("en-GB", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                    })}
                  </span>
                  <span className="text-[#9FA2AA] text-[10px]">
                    {video.published_at
                      ? new Date(video.published_at).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : ""}
                  </span>
                </div>
              </TableCell>
              <TableCell className="py-4">
                <div className="flex items-center justify-center gap-1 flex-wrap">
                  {video.featured && (
                    <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-[10px]">
                      {t("Featured")}
                    </span>
                  )}
                  {video.is_new && (
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-[10px]">
                      {t("New")}
                    </span>
                  )}
                  {!video.featured && !video.is_new && (
                    <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-[10px]">
                      {t("Normal")}
                    </span>
                  )}
                </div>
              </TableCell>
              <TableCell className="py-4">
                <div className="flex items-center justify-center gap-2 text-[#5B6B79]">
                  <button
                    title={t("View Details")}
                    onClick={() => handleViewDetails(video)}
                    className="p-1 rounded hover:bg-gray-100 hover:text-blue-600"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  <button
                    title={t("Edit")}
                    onClick={() => {
                      setSelectedVideo(video);
                      onSectionChange("createOrEditVideo", video);
                    }}
                    className="p-1 rounded hover:bg-gray-100 hover:text-green-600"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    title={t("Delete")}
                    onClick={() => {
                      setSelectedVideo(video);
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
        <div className="flex items-center  justify-between px-4 sm:px-6 py-4 border-t bg-gray-50">
          <div className="text-sm text-gray-700">
            {t("Showing")} {(currentPage - 1) * limit + 1} {t("to")}{" "}
            {Math.min(currentPage * limit, totalRecords)} {t("of")}{" "}
            {totalRecords} {t("videos")}
          </div>

          <div className="flex items-center justify-center gap-2">
            {/* Start Previous Page Button */}
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="flex items-center justify-center gap-1 px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="h-4 w-4" />
              {t("Previous")}
            </button>
            {/* End Previous Page Button */}
            <div className="flex items-center justify-center gap-1">
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
              className="flex items-center justify-center gap-1 px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {t("Next")}
              <ChevronLeft className="h-4 w-4" />
            </button>
            {/* End Next Page Button */}
          </div>
        </div>
      )}
      {/* End Pagination */}

      {/* Start Video Details Modal */}
      <Modal
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        title={t("Video Details")}
        width="700px"
      >
        <ShowVideoDetails
          selectedVideo={selectedVideo}
          setShowDetailsModal={setShowDetailsModal}
          handleEdit={handleEdit}
        />
      </Modal>
      {/* End Video Details Modal */}

      {/* Start Create/Edit Video Modal */}
      <Modal
        isOpen={showCreateEditModal}
        onClose={() => {
          setShowCreateEditModal(false);
          setEditingVideo(null);
        }}
        title={editingVideo ? t("Edit Video") : t("Create New Video")}
        width="900px"
      >
        <CreateOrEditVideo
          video={selectedVideo}
          onClose={() => {
            setShowCreateEditModal(false);
            setEditingVideo(null);
          }}
        />
      </Modal>
      {/* End Create/Edit Video Modal */}

      {/* Start Delete Video Modal */}
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
          title={t("Delete Video")}
          message={t(
            "Are you sure you want to delete this video? This action cannot be undone."
          )}
          itemName={selectedVideo?.title}
        />
      </Modal>
      {/* End Delete Video Modal */}
    </div>
  );
}

export default VideosList;
