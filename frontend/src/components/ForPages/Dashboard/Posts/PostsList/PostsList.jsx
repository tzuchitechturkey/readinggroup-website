import React, { useState, useEffect } from "react";

import {
  Eye,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Plus,
  Search,
  X,
} from "lucide-react";
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
import { DeletePostById, GetPosts } from "@/api/posts";
import Loader from "@/components/Global/Loader/Loader";
import { setErrorFn } from "@/Utility/Global/setErrorFn";
import TableButtons from "@/components/Global/TableButtons/TableButtons";

import ShowPostDetails from "../ShowPostDetails/ShowPostDetails";

function PostsList({ onSectionChange }) {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
  const [selectedPost, setSelectedPost] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const limit = 10;
  const [totalRecords, setTotalRecords] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [postData, setPostData] = useState([]);
  const [search, setSearch] = useState("");
  const [update, setUpdate] = useState(false);

  // Handle Pagination
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    getPostData(newPage - 1, search);
  };

  const getPostData = async (page, searchVal = search) => {
    setIsLoading(true);
    const offset = page * 10;
    try {
      const res = await GetPosts(limit, offset, searchVal);
      setPostData(res?.data?.results || []);
      setTotalRecords(res?.data?.count || 0);
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
    if (currentPage !== 1) {
      setCurrentPage(1);
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

  // تأكيد حذف المنشور
  const handleConfirmDelete = async () => {
    setIsLoading(true);
    try {
      await DeletePostById(selectedPost?.id);
      toast.success(t("Post deleted successfully"));
      setShowDeleteModal(false);
      setSelectedPost(null);
      setUpdate(!update);
    } catch (error) {
      setErrorFn(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Clear search
  const clearSearch = () => {
    setSearch("");
    setCurrentPage(1);
    getPostData(0, "");
  };

  // حساب عدد الصفحات
  const totalPages = Math.ceil(totalRecords / limit);

  useEffect(() => {
    getPostData(0);
  }, [update]);

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      {isLoading && <Loader />}
      {/* Start Header */}
      <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b">
        <h2 className="text-lg font-medium text-[#1D2630]">
          {t("Posts List")}
        </h2>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">
            {t("Total")}: {totalRecords} {t("posts")}
          </span>
          <button
            onClick={() => {
              setSelectedPost(null);
              onSectionChange("createOrEditPost", null);
            }}
            className="flex items-center gap-2 text-sm bg-blue-600 border border-blue-600 hover:bg-blue-700 transition-all duration-200 text-white px-3 py-1.5 rounded"
          >
            <Plus className="h-4 w-4" />
            {t("Add New Post")}
          </button>
        </div>
      </div>
      {/* End Header */}

      {/* Start Search */}
      <div className="bg-white rounded-lg p-4 mb-6 shadow-sm">
        <div className="relative max-w-md flex">
          <input
            type="text"
            placeholder={t("Search posts...")}
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
            }}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-l-lg text-sm pr-8"
          />

          {search && (
            <button
              onClick={() => {
                setSearch("");
                getPostData(0, "");
              }}
              className="absolute right-20 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          )}

          <button
            onClick={getPostData}
            className="px-4 py-2 bg-[#4680ff] text-white rounded-r-lg text-sm font-semibold hover:bg-blue-600"
          >
            {t("Search")}
          </button>
        </div>
      </div>

      {/* <div className="px-4 sm:px-6 py-3 border-b bg-gray-50">
        <div className="flex items-center justify-between">
          <div className="relative max-w-md">
            <input
              type="text"
              placeholder={t("Search posts...")}
              value={search}
              onChange={handleSearch}
              className="w-full pl-10 pr-16 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm bg-white"
            />
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
              <Search className="w-4 h-4 text-gray-400" />
            </div>
            {search && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <button
                  onClick={clearSearch}
                  className="text-gray-400 hover:text-gray-600 p-1 rounded"
                  title={t("Clear Search")}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
          {search && (
            <div className="text-sm text-gray-500">
              {t("Found")} {totalRecords} {t("results for")} "{search}"
            </div>
          )}
        </div>
      </div> */}
      {/* End Search */}

      {/* Start Table */}
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
          {postData.length === 0 ? (
            <TableRow>
              <TableCell colSpan="7" className="text-center py-8">
                <div className="flex flex-col items-center justify-center text-gray-500">
                  <Search className="w-8 h-8 mb-2 text-gray-300" />
                  <p className="text-sm">
                    {search
                      ? t("No posts found matching your search")
                      : t("No posts available")}
                  </p>
                  {search && (
                    <button
                      onClick={clearSearch}
                      className="mt-2 text-blue-600 text-sm hover:text-blue-800"
                    >
                      {t("Clear Search")}
                    </button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ) : (
            postData.map((post) => (
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
                      onClick={() => {
                        setSelectedPost(post);
                        setShowDetailsModal(true);
                      }}
                      className="p-1 rounded hover:bg-gray-100 hover:text-blue-600"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      title={t("Edit")}
                      onClick={() => {
                        setSelectedPost(post);
                        onSectionChange("createOrEditPost", post);
                      }}
                      className="p-1 rounded hover:bg-gray-100 hover:text-green-600"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      title={t("Delete")}
                      onClick={() => {
                        setSelectedPost(post);
                        setShowDeleteModal(true);
                      }}
                      className="p-1 rounded hover:bg-gray-100 hover:text-rose-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {/* Start Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-t bg-gray-50">
          <div className="text-sm text-gray-700">
            {t("Showing")} {(currentPage - 1) * limit + 1} {t("to")}{" "}
            {Math.min(currentPage * limit, totalRecords)} {t("of")}{" "}
            {totalRecords} {t("posts")}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="h-4 w-4" />
              {t("Previous")}
            </button>

            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNum = i + 1; // يبدأ من 1 ويزيد
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
              })}
            </div>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {t("Next")}
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
      {/* End Pagination */}

      {/* Start Post Details Modal */}
      <Modal
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        title={t("Post Details")}
        width="800px"
      >
        <ShowPostDetails
          post={selectedPost}
          onClose={() => setShowDetailsModal(false)}
          onEdit={() => {
            onSectionChange("createOrEditPost", selectedPost);
          }}
        />
      </Modal>
      {/* End Post Details Modal */}

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => {
          setSelectedPost(null);
          setShowDeleteModal(false);
        }}
        title={t("Confirm Deletion")}
        width="500px"
      >
        <DeleteConfirmation
          isOpen={showDeleteModal}
          onClose={() => {
            setSelectedPost(null);
            setShowDeleteModal(false);
          }}
          onConfirm={handleConfirmDelete}
          title={t("Delete Post")}
          message={t(
            "Are you sure you want to delete this Post? This action cannot be undone."
          )}
          itemName={selectedPost?.title}
        />
      </Modal>
    </div>
  );
}

export default PostsList;
