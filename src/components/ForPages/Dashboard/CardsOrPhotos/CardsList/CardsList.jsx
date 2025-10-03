import React, { useState, useEffect } from "react";

import { Edit, Trash2, ChevronLeft, ChevronRight, Plus } from "lucide-react";
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
import DeleteConfirmation from "@/components/ForPages/Dashboard/Videos/DeleteConfirmation/DeleteConfirmation";

import CreateorEditCardorPhoto from "../CreateorEditCardorPhoto/CreateorEditCardorPhoto";
import { resolveAsset } from "@/utils/assetResolver";

function CardsList() {
  const { t } = useTranslation();
  const [_isLoading, _setIsLoading] = useState(false);
  const defaultAvatar = resolveAsset("Beared Guy02-min 1.png");
  const defaultImage = resolveAsset("testCard.png");

  // State management
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
  const [selectedCard, setSelectedCard] = useState(null);
  const [showCreateOrEditModal, setShowCreateOrEditModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
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
  const mockCards = [
    {
      id: 1,
      image: defaultAvatar,
      cover: defaultImage,
      title: "بطاقة تعليمية رقم 1",
      description:
        "وصف تفصيلي للبطاقة التعليمية الأولى التي تحتوي على معلومات مفيدة ومحتوى تعليمي قيم.",
      theme: "dark",
      language: "ar",
      type: "article",
    },
    {
      id: 2,
      image: defaultImage,
      cover: defaultImage,
      title: "بطاقة تعليمية رقم 2",
      description:
        "وصف تفصيلي للبطاقة التعليمية الثانية مع محتوى تعليمي متقدم ومفيد للطلاب.",
      theme: "light",
      language: "en",
      type: "photo",
    },
    {
      id: 3,
      image: defaultImage,
      cover: defaultImage,
      title: "بطاقة تعليمية رقم 3",
      description:
        "وصف شامل للبطاقة التعليمية الثالثة التي تغطي موضوعات متنوعة ومهمة.",
      theme: "colorful",
      language: "tr",
      type: "gallery",
    },
    // Add more mock data to test pagination
    ...Array.from({ length: 27 }, (_, i) => {
      const themes = ["dark", "light", "colorful", "minimal", "classic"];
      const languages = ["ar", "en", "tr", "fr", "de"];
      const types = [
        "article",
        "photo",
        "gallery",
        "news",
        "event",
        "announcement",
      ];

      return {
        id: i + 4,
        image: defaultImage,
        cover: defaultImage,
        title: `بطاقة تعليمية رقم ${i + 4}`,
        description: `وصف تفصيلي للبطاقة التعليمية رقم ${
          i + 4
        } مع محتوى تعليمي متميز.`,
        theme: themes[i % themes.length],
        language: languages[i % languages.length],
        type: types[i % types.length],
      };
    }),
  ];

  // Simulate API call for fetching data with pagination
  const fetchCards = async (page, limitPerPage, sort = null, search = "") => {
    setLoading(true);
    try {
      // Simulate delay
      await new Promise((resolve) => setTimeout(resolve, 300));

      // Apply search filter
      let filteredData = [...mockCards];
      if (search.trim()) {
        filteredData = filteredData.filter(
          (card) =>
            card.title.toLowerCase().includes(search.toLowerCase()) ||
            card.description.toLowerCase().includes(search.toLowerCase())
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
      console.error("Error fetching cards:", error);
    } finally {
      setLoading(false);
    }
  };

  // Initial load and refetch on dependencies change
  useEffect(() => {
    fetchCards(currentPage, limit, sortConfig, searchTerm);
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
  const handleAddCard = () => {
    setSelectedCard(null);
    setIsEditing(false);
    setShowCreateOrEditModal(true);
  };

  const handleEditCard = (card) => {
    setSelectedCard(card);
    setIsEditing(true);
    setShowCreateOrEditModal(true);
  };
  // حذف
  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setSelectedCard(null);
  };

  const handleConfirmDelete = async () => {
    fetchCards(currentPage, limit, sortConfig, searchTerm);
    setShowDeleteModal(false);
  };
  const handleSaveCard = async (formData) => {
    try {
      if (isEditing) {
        // Update existing card
        // In real app: await updateCard(selectedCard.id, formData)

        // For demo purposes, extract data from FormData
        const cardData = {
          id: selectedCard.id,
          title: formData.get("title"),
          description: formData.get("description"),
          theme: formData.get("theme"),
          language: formData.get("language"),
          type: formData.get("type"),
          // Handle image files or existing URLs
          image: formData.get("image")
            ? "new-uploaded-image-url"
            : formData.get("existingImage"),
          cover: formData.get("cover")
            ? "new-uploaded-cover-url"
            : formData.get("existingCover"),
        };

        console.warn("Update card data:", cardData);
      } else {
        // Add new card
        // In real app: await createCard(formData)

        // For demo purposes, extract data from FormData
        const cardData = {
          title: formData.get("title"),
          description: formData.get("description"),
          theme: formData.get("theme"),
          language: formData.get("language"),
          type: formData.get("type"),
          image: "new-uploaded-image-url", // This would be the actual uploaded image URL
          cover: "new-uploaded-cover-url", // This would be the actual uploaded cover URL
        };

        console.warn("Create new card data:", cardData);
      }

      // Close modal
      setShowCreateOrEditModal(false);
      setSelectedCard(null);
      setIsEditing(false);

      // Refresh data
      fetchCards(currentPage, limit, sortConfig, searchTerm);
    } catch (error) {
      console.error("Error saving card:", error);
      alert("حدث خطأ أثناء حفظ البطاقة");
    }
  };

  // Handle search with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentPage(1); // Reset to first page when searching
      fetchCards(1, limit, sortConfig, searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  return (
    <div className="w-full min-h-screen bg-[#F5F7FB] px-3 relative text-[#1E1E1E] flex flex-col">
      <div className="flex-1">
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b bg-white rounded-lg mb-6">
          <div>
            <h2 className="text-lg font-medium text-[#1D2630]">
              {t("Cards List")}
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              {t("Manage your educational cards here.")}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {loading ? (
              <span className="text-sm text-gray-500">{t("Loading")}...</span>
            ) : (
              <span className="text-sm text-gray-500">
                {t("Total")}: {apiData.count} {t("cards")}
              </span>
            )}
            <button
              onClick={handleAddCard}
              className="flex items-center gap-2 text-sm bg-blue-600 border border-blue-600 hover:bg-blue-700 transition-all duration-200 text-white px-3 py-1.5 rounded"
            >
              <Plus className="h-4 w-4" />
              {t("Add New Card")}
            </button>
          </div>
        </div>

        {/* Start Search */}
        <div className="bg-white rounded-lg p-4 mb-6 shadow-sm">
          <div className="relative max-w-md">
            <input
              type="text"
              placeholder={t("Search cards...")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <svg
                className="w-4 h-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>
        </div>
        {/* End Search */}

        {/* Start Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
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
                  {t("The Card")}
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
                  {t("Description")}
                </TableHead>
                <TableHead className="text-[#5B6B79] font-medium text-xs">
                  {t("Cover Image")}
                </TableHead>
                <TableHead className="text-[#5B6B79] font-medium text-xs">
                  {t("Actions")}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="text-[11px]">
              {apiData.results.map((card) => (
                <TableRow
                  key={card.id}
                  className="hover:bg-gray-50/60 border-b"
                >
                  <TableCell className="text-[#1E1E1E] font-bold text-[11px] py-4 px-4">
                    {card.id}
                  </TableCell>
                  <TableCell className="py-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={card.image}
                        alt={card.title}
                        className="w-12 h-12 rounded object-cover border"
                        onError={(e) => {
                          e.target.src =
                            "https://via.placeholder.com/100/4F46E5/FFFFFF?text=" +
                            card.title.charAt(0);
                        }}
                      />
                      <div className="flex flex-col">
                        <span className="text-[#1E1E1E] font-medium text-sm line-clamp-1">
                          {card.title}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-[#1E1E1E] text-[11px] py-4">
                    <span className="font-medium">{card.title}</span>
                  </TableCell>
                  <TableCell className="text-[#1E1E1E] text-[11px] py-4 max-w-sm">
                    <p
                      className="text-sm text-gray-900 line-clamp-2"
                      title={card.description}
                    >
                      {card.description.length > 80
                        ? `${card.description.substring(0, 80)}...`
                        : card.description}
                    </p>
                  </TableCell>
                  <TableCell className="py-4">
                    <img
                      src={card.cover}
                      alt={`غلاف ${card.title}`}
                      className="w-16 h-10 rounded object-cover border"
                      onError={(e) => {
                        e.target.src =
                          "https://via.placeholder.com/100/4F46E5/FFFFFF?text=Cover";
                      }}
                    />
                  </TableCell>
                  <TableCell className="py-4">
                    <div className="flex items-center gap-2 text-[#5B6B79]">
                      <button
                        title={t("Edit")}
                        onClick={() => handleEditCard(card)}
                        className="p-1 rounded hover:bg-gray-100 hover:text-green-600"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        title={t("Delete")}
                        onClick={() => {
                          setSelectedCard(card);
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
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-t bg-gray-50">
              <div className="text-sm text-gray-700">
                {t("Showing")} {(currentPage - 1) * limit + 1} {t("to")}{" "}
                {Math.min(currentPage * limit, apiData.count)} {t("of")}{" "}
                {apiData.count} {t("cards")}
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
                  {Array.from({ length: 5 }, (_, i) => {
                    const start = Math.max(1, currentPage - 2);
                    const end = Math.min(totalPages, start + 4);
                    const pageNum = start + i;

                    if (pageNum > end) return null;

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
                  })}
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
          {/* End Pagination */}
        </div>

        {/* Start Create Or Edit Modal */}
        <Modal
          isOpen={showCreateOrEditModal}
          onClose={() => setShowCreateOrEditModal(false)}
          title={isEditing ? t("Edit Card") : t("Add New Card")}
        >
          <CreateorEditCardorPhoto
            isOpen={showCreateOrEditModal}
            onClose={() => setShowCreateOrEditModal(false)}
            onSave={handleSaveCard}
            card={selectedCard}
            isEditing={isEditing}
          />
        </Modal>
        {/* End Craete Or Edit Modal */}

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
            title={t("Delete Member")}
            message={t(
              "Are you sure you want to delete this member? This action cannot be undone."
            )}
            itemName={selectedCard?.title}
          />
        </Modal>
        {/* End Delete Member Modal */}
      </div>
    </div>
  );
}

export default CardsList;
