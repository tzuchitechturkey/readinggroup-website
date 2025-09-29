import React, { useState, useEffect } from "react";

import { Eye, Edit, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { LuArrowUpDown } from "react-icons/lu";
import { useTranslation } from "react-i18next";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { mockVideos } from "@/mock/Viedeos";
import Modal from "@/components/Global/Modal/Modal";

import ShowVideoDetails from "../ShowVideoDetails/ShowVideoDetails";
import CreateOrEditVideo from "../CreateOrEditVideo/CreateOrEditVideo";
import DeleteConfirmation from "../DeleteConfirmation/DeleteConfirmation";

function VideosList({ onSectionChange }) {
  const { t } = useTranslation();
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showCreateEditModal, setShowCreateEditModal] = useState(false);
  const [editingVideo, setEditingVideo] = useState(null);
  const [showDeleteVideoModal, setShowDeleteVideoModal] = useState(false);
  const [videoToDelete, setVideoToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(10);
  const [loading, setLoading] = useState(false);
  const [apiData, setApiData] = useState({
    results: [],
    count: 0,
  });

  // محاكاة API call للحصول على البيانات
  const fetchVideos = async (page, limitPerPage, sort = null) => {
    setLoading(true);
    try {
      // حساب offset
      const offset = (page - 1) * limitPerPage;

      // محاكاة delay للـ API
      await new Promise((resolve) => setTimeout(resolve, 500));

      // محاكاة البيانات القادمة من الباك إند
      let sortedData = [...mockVideos];

      // تطبيق الترتيب إذا وُجد
      if (sort) {
        sortedData = sortedData.sort((a, b) => {
          const aValue = a[sort.key];
          const bValue = b[sort.key];

          if (sort.key === "id") {
            return sort.direction === "asc" ? aValue - bValue : bValue - aValue;
          }

          if (sort.key === "views") {
            const aNum = parseInt(aValue.replace(/,/g, ""));
            const bNum = parseInt(bValue.replace(/,/g, ""));
            return sort.direction === "asc" ? aNum - bNum : bNum - aNum;
          }

          const aString = aValue.toLowerCase();
          const bString = bValue.toLowerCase();

          if (aString < bString) {
            return sort.direction === "asc" ? -1 : 1;
          }
          if (aString > bString) {
            return sort.direction === "asc" ? 1 : -1;
          }
          return 0;
        });
      }

      // تطبيق pagination
      const results = sortedData.slice(offset, offset + limitPerPage);

      // تحديث البيانات
      setApiData({
        results,
        count: mockVideos.length, // العدد الكلي
      });
    } catch (error) {
      console.error("خطأ في جلب البيانات:", error);
    } finally {
      setLoading(false);
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
  const totalPages = Math.ceil(apiData.count / limit);

  // تغيير الصفحة
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages && !loading) {
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

  // فتح نموذج تأكيد الحذف
  const handleDelete = (videoId) => {
    const video = apiData.results.find((v) => v.id === videoId);
    setVideoToDelete(video);
    setShowDeleteVideoModal(true);
  };

  // تأكيد حذف الفيديو
  const handleConfirmDelete = async () => {
    if (!videoToDelete) return;

    setDeleteLoading(true);
    try {
      // هنا يتم إرسال طلب الحذف للسيرفر
      // await deleteVideoAPI(videoToDelete.id);

      // إغلاق النموذج
      setShowDeleteVideoModal(false);
      setVideoToDelete(null);

      // عرض رسالة نجاح
      alert(t("Video deleted successfully"));

      // إعادة جلب البيانات
      await fetchVideos(currentPage, limit, sortConfig.key ? sortConfig : null);
    } catch (error) {
      console.error("Error deleting video:", error);
      alert(t("An error occurred while deleting the video"));
    } finally {
      setDeleteLoading(false);
    }
  };

  // إلغاء حذف الفيديو
  const handleCancelDelete = () => {
    setShowDeleteVideoModal(false);
    setVideoToDelete(null);
  };

  // تعديل الفيديو
  const handleEdit = (videoId) => {
    const video = apiData.results.find((v) => v.id === videoId);
    setEditingVideo(video);
    setShowCreateEditModal(true);
  };

  // إنشاء فيديو جديد
  const handleCreateNew = () => {
    setEditingVideo(null);
    setShowCreateEditModal(true);
  };

  // حفظ الفيديو (إنشاء أو تعديل)
  const handleSaveVideo = async (videoData) => {
    try {
      // هنا يتم إرسال البيانات للسيرفر
      // const response = await saveVideoAPI(videoData);
      // Temporarily log the data (remove in production)
      if (videoData) {
        // Video data will be sent to API
      }

      // إغلاق النموذج
      setShowCreateEditModal(false);
      setEditingVideo(null);

      // إعادة جلب البيانات بعد الحفظ
      await fetchVideos(currentPage, limit, sortConfig.key ? sortConfig : null);
    } catch (error) {
      console.error("Error saving video:", error);
    }
  };

  // جلب البيانات عند تحميل المكون أو تغيير الصفحة
  useEffect(() => {
    fetchVideos(currentPage, limit, sortConfig.key ? sortConfig : null);
  }, [currentPage, limit]);

  // جلب البيانات عند تغيير الترتيب
  useEffect(() => {
    if (sortConfig.key) {
      fetchVideos(currentPage, limit, sortConfig);
    }
  }, [sortConfig]);

  return (
    <div className="bg-white rounded-lg border border-gray-200 ">
      {/* Start Header */}
      <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b">
        <h2 className="text-lg font-medium text-[#1D2630]">
          {t("Videos List")}
        </h2>
        <div className="flex items-center gap-2">
          {loading ? (
            <span className="text-sm text-gray-500">{t("Loading")}...</span>
          ) : (
            <span className="text-sm text-gray-500">
              {t("Total")}: {apiData.count} {t("videos")}
            </span>
          )}
          {/* Start Add Button */}
          <div>
            <button
              onClick={() => onSectionChange("createOrEditVideo")}
              className="text-sm bg-primary border-[1px] border-primary hover:bg-white hover:text-primary transition-all duration-200 text-white px-3 py-1.5 rounded"
            >
              {t("Add New")}
            </button>
          </div>
          {/* End Add Button */}
        </div>
      </div>
      {/* End Header */}

      {/* Start Table */}
      <Table>
        <TableHeader className="bg-[#FAFAFA] h-14 ">
          <TableRow className="border-b">
            <TableHead className="text-[#5B6B79] font-medium text-xs px-3">
              <div
                className="flex items-center gap-1 cursor-pointer hover:text-[#1E1E1E]"
                onClick={() => sortData("id")}
              >
                {t("ID")}
                {getSortIcon("id")}
              </div>
            </TableHead>
            <TableHead className="text-[#5B6B79] font-medium text-xs">
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
                onClick={() => sortData("category")}
              >
                {t("Category")}
                {getSortIcon("category")}
              </div>
            </TableHead>
            <TableHead className="text-[#5B6B79] font-medium text-xs">
              <div
                className="flex items-center gap-1 cursor-pointer hover:text-[#1E1E1E]"
                onClick={() => sortData("duration")}
              >
                {t("Duration")}
                {getSortIcon("duration")}
              </div>
            </TableHead>
            <TableHead className="text-[#5B6B79] font-medium text-xs">
              <div
                className="flex items-center gap-1 cursor-pointer hover:text-[#1E1E1E]"
                onClick={() => sortData("views")}
              >
                {t("Views")}
                {getSortIcon("views")}
              </div>
            </TableHead>
            <TableHead className="text-[#5B6B79] font-medium text-xs">
              {t("Status")}
            </TableHead>
            <TableHead className="text-[#5B6B79] font-medium text-xs">
              {t("Actions")}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="text-[11px] ">
          {apiData.results.map((video) => (
            <TableRow key={video.id} className=" hover:bg-gray-50/60 border-b">
              <TableCell className="text-[#1E1E1E]  font-bold text-[11px] py-4 px-4">
                {video.id}
              </TableCell>
              <TableCell className="py-4">
                <div className="flex items-center gap-3">
                  <img
                    src={video.image}
                    alt={video.title}
                    className="w-10 h-8 rounded object-cover"
                  />
                  <div className="flex flex-col">
                    <span className="text-[#1E1E1E] font-medium text-[11px] line-clamp-1">
                      {video.title}
                    </span>
                    <span className="text-[#9FA2AA] text-[10px]">
                      {video.language} • {video.type}
                    </span>
                  </div>
                </div>
              </TableCell>
              <TableCell className="text-[#1E1E1E] text-[11px] py-4">
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-[10px]">
                  {video.category}
                </span>
              </TableCell>
              <TableCell className="text-[#1E1E1E] text-[11px] py-4">
                {video.duration}
              </TableCell>
              <TableCell className="text-[#1E1E1E] text-[11px] py-4">
                <div className="flex flex-col">
                  <span className="font-medium">{video.views}</span>
                  <span className="text-[#9FA2AA] text-[10px]">
                    {video.timeAgo}
                  </span>
                </div>
              </TableCell>
              <TableCell className="py-4">
                <div className="flex items-center gap-1">
                  {video.featured && (
                    <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-[10px]">
                      {t("Featured")}
                    </span>
                  )}
                  {video.isNew && (
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-[10px]">
                      {t("New")}
                    </span>
                  )}
                </div>
              </TableCell>
              <TableCell className="py-4">
                <div className="flex items-center gap-2 text-[#5B6B79]">
                  <button
                    title={t("View Details")}
                    onClick={() => handleViewDetails(video)}
                    className="p-1 rounded hover:bg-gray-100 hover:text-blue-600"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  <button
                    title={t("Edit")}
                    onClick={() => onSectionChange("createOrEditVideo")}
                    className="p-1 rounded hover:bg-gray-100 hover:text-green-600"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    title={t("Delete")}
                    onClick={() => handleDelete(video.id)}
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
            {Math.min(currentPage * limit, apiData.count)} {t("of")}{" "}
            {apiData.count} {t("videos")}
          </div>

          <div className="flex items-center gap-2">
            {/* Start Previous Page Button */}
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1 || loading}
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
                    disabled={loading}
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
              disabled={currentPage === totalPages || loading}
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
          video={editingVideo}
          onClose={() => {
            setShowCreateEditModal(false);
            setEditingVideo(null);
          }}
          onSave={handleSaveVideo}
        />
      </Modal>
      {/* End Create/Edit Video Modal */}

      {/* Start Delete Video Modal */}
      <Modal
        isOpen={showDeleteVideoModal}
        onClose={handleCancelDelete}
        title={t("Confirm Deletion")}
        width="500px"
      >
        <DeleteConfirmation
          isOpen={showDeleteVideoModal}
          onClose={handleCancelDelete}
          onConfirm={handleConfirmDelete}
          title={t("Delete Video")}
          message={t(
            "Are you sure you want to delete this video? This action cannot be undone."
          )}
          itemName={videoToDelete?.title}
          loading={deleteLoading}
        />
      </Modal>
      {/* End Delete Video Modal */}
    </div>
  );
}

export default VideosList;
