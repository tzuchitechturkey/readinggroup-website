import React, { useState, useEffect } from "react";

import { useTranslation } from "react-i18next";
import {
  LuArrowUpDown,
  LuSearch,
  LuPlus,
  LuPencil,
  LuTrash2,
} from "react-icons/lu";
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

import CreateOrEditNews from "../CreateOrEditNews/CreateOrEditNews";

const TVList = () => {
  const { t } = useTranslation();

  // State management
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "id", direction: "asc" });
  const [selectedNews, setSelectedNews] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showCreateOrEditModal, setShowCreateOrEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(10);
  const [loading, setLoading] = useState(false);
  const [apiData, setApiData] = useState({
    results: [],
    count: 0,
  });

  // Mock data - replace with actual API call
  const mockTVData = [
    {
      id: 1,
      title: "برنامج قراءة الأطفال",
      description:
        "برنامج تعليمي مخصص للأطفال لتعلم القراءة والكتابة بطريقة ممتعة وتفاعلية",
      date: "2024-01-15",
      image: "/authback.jpg",
      writer: "أحمد محمد",
      category: "تعليمي",
    },
    {
      id: 2,
      title: "حلقة خاصة - القراءة والتفكير",
      description:
        "حلقة تناقش أهمية القراءة في تنمية مهارات التفكير النقدي والإبداعي",
      date: "2024-01-20",
      image: "/authback.jpg",
      writer: "فاطمة العلي",
      category: "ثقافي",
    },
    {
      id: 3,
      title: "مقابلة مع كاتب مشهور",
      description:
        "مقابلة حصرية مع كاتب مشهور حول تجربته في الكتابة ونصائحه للكتاب الجدد",
      date: "2024-01-25",
      image: "/authback.jpg",
      writer: "محمد صالح",
      category: "مقابلات",
    },
    // Add more mock data to test pagination
    ...Array.from({ length: 27 }, (_, i) => {
      const categories = ["تعليمي", "ثقافي", "مقابلات", "أخبار", "ترفيهي"];
      const writers = [
        "أحمد محمد",
        "فاطمة العلي",
        "محمد صالح",
        "سارة أحمد",
        "عمر حسن",
      ];

      return {
        id: i + 4,
        title: `برنامج تلفزيوني رقم ${i + 4}`,
        description: `وصف تفصيلي للبرنامج التلفزيوني رقم ${
          i + 4
        } مع محتوى مفيد ومتميز`,
        date: `2024-0${((i % 12) + 1).toString().padStart(2, "0")}-${(
          (i % 28) +
          1
        )
          .toString()
          .padStart(2, "0")}`,
        image: "/authback.jpg",
        writer: writers[i % writers.length],
        category: categories[i % categories.length],
      };
    }),
  ];

  // Simulate API call for fetching data with pagination
  const fetchTVData = async (page, limitPerPage, sort = null, search = "") => {
    setLoading(true);
    try {
      // Simulate delay
      await new Promise((resolve) => setTimeout(resolve, 300));

      // Apply search filter
      let filteredData = [...mockTVData];
      if (search.trim()) {
        filteredData = filteredData.filter(
          (item) =>
            item.title.toLowerCase().includes(search.toLowerCase()) ||
            item.description.toLowerCase().includes(search.toLowerCase()) ||
            item.writer.toLowerCase().includes(search.toLowerCase()) ||
            item.category.toLowerCase().includes(search.toLowerCase())
        );
      }

      // Apply sorting
      if (sort) {
        filteredData = filteredData.sort((a, b) => {
          const aValue = a[sort.key];
          const bValue = b[sort.key];

          if (sort.key === "id") {
            return sort.direction === "asc" ? aValue - bValue : bValue - aValue;
          }

          if (sort.key === "date") {
            const aDate = new Date(aValue);
            const bDate = new Date(bValue);
            return sort.direction === "asc" ? aDate - bDate : bDate - aDate;
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

      // Apply pagination
      const offset = (page - 1) * limitPerPage;
      const paginatedResults = filteredData.slice(
        offset,
        offset + limitPerPage
      );

      setApiData({
        results: paginatedResults,
        count: filteredData.length,
      });
    } catch (error) {
      console.error("Error fetching TV data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Initial load and refetch on dependencies change
  useEffect(() => {
    fetchTVData(currentPage, limit, sortConfig, searchTerm);
  }, [currentPage, limit, sortConfig, searchTerm]);

  // Sorting functionality
  const sortData = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
    setCurrentPage(1); // Reset to first page when sorting
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

  // Pagination
  const totalPages = Math.ceil(apiData.count / limit);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages && !loading) {
      setCurrentPage(newPage);
    }
  };

  // CRUD operations
  const handleAddTV = () => {};

  const handleEditTV = (tv) => {
    setSelectedNews(tv);
    setIsEditing(true);
    setShowCreateOrEditModal(true);
  };

  const handleDeleteTV = (tv) => {
    setSelectedNews(tv);
    setShowDeleteModal(true);
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setSelectedNews(null);
  };

  const handleConfirmDelete = async () => {
    toast.success(t("News deleted successfully"));
    setShowDeleteModal(false);
  };

  const handleSaveTV = async (formData) => {
    try {
      if (isEditing) {
        // Update existing TV program
        // In real app: await updateTV(selectedTV.id, formData)

        // For demo purposes, extract data from FormData
        const tvData = {
          id: selectedNews.id,
          title: formData.get("title"),
          description: formData.get("description"),
          date: formData.get("date"),
          writer: formData.get("writer"),
          category: formData.get("category"),
          // Handle image files or existing URLs
          image: formData.get("image")
            ? "new-uploaded-image-url"
            : formData.get("existingImage"),
        };

        console.warn("Update TV data:", tvData);
      } else {
        // Add new TV program
        // In real app: await createTV(formData)

        // For demo purposes, extract data from FormData
        const tvData = {
          title: formData.get("title"),
          description: formData.get("description"),
          date: formData.get("date"),
          writer: formData.get("writer"),
          category: formData.get("category"),
          image: "new-uploaded-image-url", // This would be the actual uploaded image URL
        };

        console.warn("Create new TV data:", tvData);
      }

      // Close modal
      setShowCreateOrEditModal(false);
      setSelectedNews(null);
      setIsEditing(false);

      // Refresh data
      fetchTVData(currentPage, limit, sortConfig, searchTerm);
    } catch (error) {
      console.error("Error saving TV program:", error);
      alert("حدث خطأ أثناء حفظ البرنامج التلفزيوني");
    }
  };

  // Handle search with debounce
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      setCurrentPage(1); // Reset to first page when searching
      fetchTVData(1, limit, sortConfig, searchTerm);
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [searchTerm, limit, sortConfig]);

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ar-SA");
  };

  return (
    <div className="p-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-gray-800">{t("News")}</h1>

        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          {/* Search */}
          <div className="relative">
            <LuSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder={t("Search News...")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-64"
            />
          </div>

          {/* Add Button */}
          <button
            onClick={() => {
              setSelectedNews(null);
              setShowCreateOrEditModal(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-white border-[1px] border-primary hover:text-primary transition-all duration-200"
          >
            <LuPlus className="h-4 w-4" />
            {t("Add News")}
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="mb-4 text-sm text-gray-600">
        {loading ? (
          <div className="flex items-center gap-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600" />
            {t("Loading...")}
          </div>
        ) : (
          `${t("Total")}: ${apiData.count} ${t("programs")} | ${t(
            "Page"
          )} ${currentPage} ${t("of")} ${totalPages}`
        )}
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">
                <button
                  onClick={() => sortData("id")}
                  className="flex items-center gap-1 font-medium"
                >
                  #{getSortIcon("id")}
                </button>
              </TableHead>
              <TableHead>
                <button
                  onClick={() => sortData("title")}
                  className="flex items-center gap-1 font-medium"
                >
                  {t("Title")}
                  {getSortIcon("title")}
                </button>
              </TableHead>
              <TableHead className="hidden md:table-cell">
                <button
                  onClick={() => sortData("description")}
                  className="flex items-center gap-1 font-medium"
                >
                  {t("Description")}
                  {getSortIcon("description")}
                </button>
              </TableHead>
              <TableHead>
                <button
                  onClick={() => sortData("date")}
                  className="flex items-center gap-1 font-medium"
                >
                  {t("Date")}
                  {getSortIcon("date")}
                </button>
              </TableHead>
              <TableHead className="hidden sm:table-cell">
                <button
                  onClick={() => sortData("writer")}
                  className="flex items-center gap-1 font-medium"
                >
                  {t("Writer")}
                  {getSortIcon("writer")}
                </button>
              </TableHead>
              <TableHead className="hidden sm:table-cell">
                <button
                  onClick={() => sortData("category")}
                  className="flex items-center gap-1 font-medium"
                >
                  {t("Category")}
                  {getSortIcon("category")}
                </button>
              </TableHead>
              <TableHead className="w-[100px]">{t("Actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  <div className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600" />
                    {t("Loading TV programs...")}
                  </div>
                </TableCell>
              </TableRow>
            ) : apiData.results.length > 0 ? (
              apiData.results.map((tv) => (
                <TableRow key={tv.id} className="hover:bg-gray-50">
                  <TableCell className="font-medium">{tv.id}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <img
                        src={tv.image}
                        alt={tv.title}
                        className="w-12 h-12 rounded-lg object-cover"
                        onError={(e) => {
                          e.target.src = "/placeholder-image.png";
                        }}
                      />
                      <div className="min-w-0">
                        <p className="font-medium text-gray-900 truncate">
                          {tv.title}
                        </p>
                        <p className="text-sm text-gray-500 md:hidden truncate">
                          {tv.description.substring(0, 50)}...
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <p
                      className="text-gray-600 max-w-xs truncate"
                      title={tv.description}
                    >
                      {tv.description}
                    </p>
                  </TableCell>
                  <TableCell>
                    <span className="text-gray-600">{formatDate(tv.date)}</span>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <span className="text-gray-600">{tv.writer}</span>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {tv.category}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEditTV(tv)}
                        className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded"
                        title={t("Edit")}
                      >
                        <LuPencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteTV(tv)}
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
                  {searchTerm
                    ? t("No TV programs found matching your search.")
                    : t("No TV programs available.")}
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
            {Math.min(currentPage * limit, apiData.count)} {t("of")}{" "}
            {apiData.count} {t("results")}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1 || loading}
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
                    disabled={loading}
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
                    disabled={currentPage === totalPages || loading}
                    className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {totalPages}
                  </button>
                </>
              )}
            </div>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages || loading}
              className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {t("Next")}
            </button>
          </div>
        </div>
      )}

      {/* Create/Edit Modal */}
      <Modal
        isOpen={showCreateOrEditModal}
        onClose={() => setShowCreateOrEditModal(false)}
        title={isEditing ? t("Edit TV Program") : t("Add TV Program")}
      >
        <CreateOrEditNews
          isOpen={showCreateOrEditModal}
          onClose={() => setShowCreateOrEditModal(false)}
          onSave={handleSaveTV}
          news={selectedNews}
          isEditing={selectedNews?.id ? true : false}
        />
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        title={t("Confirm Delete")}
        isOpen={showDeleteModal}
        onClose={handleCancelDelete}
      >
        <DeleteConfirmation
          isOpen={showDeleteModal}
          onClose={() => {
            setShowDeleteModal(false);
            setSelectedNews(null);
          }}
          onConfirm={handleConfirmDelete}
          title={t("Delete Post")}
          message={t(
            "Are you sure you want to delete this Post? This action cannot be undone."
          )}
          itemName={selectedNews?.title}
        />
      </Modal>
    </div>
  );
};

export default TVList;
