import React, { useState, useEffect } from "react";

import {
  Eye,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Plus,
} from "lucide-react";
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
import Modal from "@/components/Global/Modal/Modal";
import { mockPosts } from "@/mock/Posts";

import ShowPostDetails from "../ShowPostDetails/ShowPostDetails";

function PostsList({ onSectionChange }) {
  const { t } = useTranslation();
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
  const [selectedPost, setSelectedPost] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [postToDelete, setPostToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(10);
  const [loading, setLoading] = useState(false);
  const [apiData, setApiData] = useState({
    results: [],
    count: 0,
  });

  // محاكاة API call للحصول على البيانات
  const fetchPosts = async (page, limitPerPage, sort = null) => {
    setLoading(true);
    try {
      // حساب offset
      const offset = (page - 1) * limitPerPage;

      // محاكاة delay للـ API
      await new Promise((resolve) => setTimeout(resolve, 300));

      // محاكاة البيانات القادمة من الباك إند
      let sortedData = [...mockPosts];

      // تطبيق الترتيب إذا وُجد
      if (sort) {
        sortedData = sortedData.sort((a, b) => {
          const aValue = a[sort.key];
          const bValue = b[sort.key];

          if (sort.key === "id" || sort.key === "views") {
            return sort.direction === "asc" ? aValue - bValue : bValue - aValue;
          }

          const aString = String(aValue).toLowerCase();
          const bString = String(bValue).toLowerCase();

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
        count: mockPosts.length,
      });
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  // جلب البيانات عند تحميل المكون أو تغيير الصفحة
  useEffect(() => {
    fetchPosts(currentPage, limit, sortConfig.key ? sortConfig : null);
  }, [currentPage, limit]);

  // جلب البيانات عند تغيير الترتيب
  useEffect(() => {
    if (sortConfig.key) {
      fetchPosts(currentPage, limit, sortConfig);
    }
  }, [sortConfig]);

  // دالة ترتيب البيانات
  const sortData = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
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

  // عرض تفاصيل المنشور
  const handleViewDetails = (post) => {
    setSelectedPost(post);
    setShowDetailsModal(true);
  };

  // تعديل المنشور
  const handleEdit = (postId) => {
    // هنا يتم فتح صفحة التعديل أو modal التعديل
    alert(`${t("Edit post")}: ${postId}`);
  };

  // فتح نموذج تأكيد الحذف
  const handleDelete = (postId) => {
    const post = apiData.results.find((p) => p.id === postId);
    setPostToDelete(post);
    setShowDeleteModal(true);
  };

  // تأكيد حذف المنشور
  const handleConfirmDelete = async () => {
    if (!postToDelete) return;

    setDeleteLoading(true);
    try {
      // هنا يتم إرسال طلب الحذف للسيرفر
      // await deletePostAPI(postToDelete.id);

      setShowDeleteModal(false);
      setPostToDelete(null);

      alert(t("Post deleted successfully"));

      await fetchPosts(currentPage, limit, sortConfig.key ? sortConfig : null);
    } catch (error) {
      console.error("Error deleting post:", error);
      alert(t("An error occurred while deleting the post"));
    } finally {
      setDeleteLoading(false);
    }
  };

  // إلغاء حذف المنشور
  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setPostToDelete(null);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b">
        <h2 className="text-lg font-medium text-[#1D2630]">
          {t("Posts List")}
        </h2>
        <div className="flex items-center gap-2">
          {loading ? (
            <span className="text-sm text-gray-500">{t("Loading")}...</span>
          ) : (
            <span className="text-sm text-gray-500">
              {t("Total")}: {apiData.count} {t("posts")}
            </span>
          )}
          <button
            onClick={() => onSectionChange("createOrEditPost")}
            className="flex items-center gap-2 text-sm bg-blue-600 border border-blue-600 hover:bg-blue-700 transition-all duration-200 text-white px-3 py-1.5 rounded"
          >
            <Plus className="h-4 w-4" />
            {t("Add New Post")}
          </button>
        </div>
      </div>

      {/* Table */}
      <Table>
        <TableHeader className="bg-[#FAFAFA] h-14">
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
                onClick={() => sortData("writer")}
              >
                {t("Writer")}
                {getSortIcon("writer")}
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
        <TableBody className="text-[11px]">
          {apiData.results.map((post) => (
            <TableRow key={post.id} className="hover:bg-gray-50/60 border-b">
              <TableCell className="text-[#1E1E1E] font-bold text-[11px] py-4 px-4">
                {post.id}
              </TableCell>
              <TableCell className="py-4">
                <div className="flex flex-col">
                  <span className="text-[#1E1E1E] font-medium text-[11px] line-clamp-1">
                    {post.title}
                  </span>
                  <span className="text-[#9FA2AA] text-[10px]">
                    {post.subtitle}
                  </span>
                  <span className="text-[#9FA2AA] text-[10px] mt-1 line-clamp-2">
                    {post.excerpt}
                  </span>
                </div>
              </TableCell>
              <TableCell className="text-[#1E1E1E] text-[11px] py-4">
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-[10px]">
                  {post.category}
                </span>
              </TableCell>
              <TableCell className="text-[#1E1E1E] text-[11px] py-4">
                <div className="flex flex-col">
                  <span className="font-medium">{post.writer}</span>
                  <span className="text-[#9FA2AA] text-[10px]">
                    {post.createdAt}
                  </span>
                </div>
              </TableCell>
              <TableCell className="text-[#1E1E1E] text-[11px] py-4">
                <span className="font-medium">{post.views}</span>
              </TableCell>
              <TableCell className="py-4">
                <div className="flex items-center gap-1">
                  <span
                    className={`px-2 py-1 rounded-full text-[10px] ${
                      post.active
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {post.active ? t("Active") : t("Inactive")}
                  </span>
                  <span
                    className={`px-2 py-1 rounded-full text-[10px] ${
                      post.status === "Published"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {t(post.status)}
                  </span>
                </div>
              </TableCell>
              <TableCell className="py-4">
                <div className="flex items-center gap-2 text-[#5B6B79]">
                  <button
                    title={t("View Details")}
                    onClick={() => handleViewDetails(post)}
                    className="p-1 rounded hover:bg-gray-100 hover:text-blue-600"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  <button
                    title={t("Edit")}
                    onClick={() => handleEdit(post.id)}
                    className="p-1 rounded hover:bg-gray-100 hover:text-green-600"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    title={t("Delete")}
                    onClick={() => handleDelete(post.id)}
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

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-t bg-gray-50">
          <div className="text-sm text-gray-700">
            {t("Showing")} {(currentPage - 1) * limit + 1} {t("to")}{" "}
            {Math.min(currentPage * limit, apiData.count)} {t("of")}{" "}
            {apiData.count} {t("posts")}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1 || loading}
              className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="h-4 w-4" />
              {t("Previous")}
            </button>

            <div className="flex items-center gap-1">
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
            </div>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages || loading}
              className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {t("Next")}
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Post Details Modal */}
      <Modal
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        title={t("Post Details")}
        width="800px"
      >
        <ShowPostDetails
          post={selectedPost}
          onClose={() => setShowDetailsModal(false)}
          onEdit={handleEdit}
        />
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={handleCancelDelete}
        title={t("Confirm Deletion")}
        width="500px"
      >
        <div className="p-6">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
              <Trash2 className="h-6 w-6 text-red-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {t("Delete Post")}
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                {t(
                  "Are you sure you want to delete this post? This action cannot be undone."
                )}
              </p>
              {postToDelete && (
                <div className="bg-gray-50 p-3 rounded-md border-l-4 border-red-400">
                  <p className="font-medium text-gray-900">
                    {t("Post to be deleted")}:
                  </p>
                  <p className="text-gray-700 mt-1">"{postToDelete.title}"</p>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t">
            <button
              onClick={handleCancelDelete}
              disabled={deleteLoading}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md disabled:opacity-50"
            >
              {t("Cancel")}
            </button>
            <button
              onClick={handleConfirmDelete}
              disabled={deleteLoading}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md disabled:opacity-50"
            >
              {deleteLoading ? t("Deleting...") : t("Delete")}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default PostsList;
