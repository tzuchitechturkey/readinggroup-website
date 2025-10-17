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
import { setErrorFn } from "@/Utility/Global/setErrorFn";
import Loader from "@/components/Global/Loader/Loader";
import { GetMediaCards } from "@/api/cardPhoto";

import CreateorEditCardorPhoto from "../CreateorEditCardorPhoto/CreateorEditCardorPhoto";

function CardsList() {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);

  // State management
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
  const [selectedCard, setSelectedCard] = useState(null);
  const [showCreateOrEditModal, setShowCreateOrEditModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [cardData, setCardData] = useState();
  const [update, setUpdate] = useState(false);
  // Pagination state
  const limit = 10;
  const [totalRecords, setTotalRecords] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch Data
  const getCardData = async (page, searchVal = searchTerm) => {
    setIsLoading(true);
    const offset = page * 10;
    try {
      const res = await GetMediaCards(limit, offset, searchVal);
      console.log(res, "res");
      setCardData(res?.data?.results || []);
    } catch (error) {
      setErrorFn(error);
    } finally {
      setIsLoading(false);
    }
  };

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

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const totalPages = Math.ceil(totalRecords / limit);

  useEffect(() => {
    getCardData(0);
  }, [update]);
  return (
    <div className="w-full min-h-screen bg-[#F5F7FB] px-3 relative text-[#1E1E1E] flex flex-col">
      {isLoading && <Loader />}
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
            <span className="text-sm text-gray-500">
              {t("Total")}: {totalRecords} {t("cards")}
            </span>
            <button
              onClick={() => {
                setSelectedCard(null);
                setShowCreateOrEditModal(true);
              }}
              className="flex items-center gap-2 text-sm bg-blue-600 border border-blue-600 hover:bg-blue-700 transition-all duration-200 text-white px-3 py-1.5 rounded"
            >
              <Plus className="h-4 w-4" />
              {t("Add New Card")}
            </button>
          </div>
        </div>

        {/* Start Search */}
        {/* Start Search */}
        <div className="bg-white rounded-lg p-4 mb-6 shadow-sm">
          <div className="relative max-w-md flex">
            <input
              type="text"
              placeholder={t("Search Historical Events")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-l-lg text-sm pr-8"
            />

            {searchTerm && (
              <button
                onClick={() => {
                  setSearchTerm("");
                  getCardData(0, "");
                }}
                className="absolute right-20 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            )}

            <button
              onClick={() => {
                if (searchTerm.trim()) {
                  getCardData(0);
                }
              }}
              className="px-4 py-2 bg-[#4680ff] text-white rounded-r-lg text-sm font-semibold hover:bg-blue-600"
            >
              {t("Search")}
            </button>
          </div>
        </div>
        {/* End Search */}
        {/* <div className="bg-white rounded-lg p-4 mb-6 shadow-sm">
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
        </div> */}
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
              {cardData?.map((card) => (
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
                      src={card.cover_image}
                      alt={`cover`}
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
                        onClick={() => {
                          setSelectedCard(card);
                          setShowCreateOrEditModal(true);
                        }}
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
                {Math.min(currentPage * limit, totalRecords)} {t("of")}{" "}
                {totalRecords} {t("cards")}
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
        </div>

        {/* Start Create Or Edit Modal */}
        <Modal
          isOpen={showCreateOrEditModal}
          onClose={() => setShowCreateOrEditModal(false)}
          title={selectedCard?.id ? t("Edit Card") : t("Add New Card")}
        >
          <CreateorEditCardorPhoto
            isOpen={showCreateOrEditModal}
            onClose={() => setShowCreateOrEditModal(false)}
            setUpdate={setUpdate}
            card={selectedCard}
          />
        </Modal>
        {/* End Craete Or Edit Modal */}

        {/* Start Delete Video Modal */}
        <Modal
          isOpen={showDeleteModal}
          onClose={() => {
            setShowDeleteModal(false);
            setSelectedCard(null);
          }}
          title={t("Confirm Deletion")}
          width="500px"
        >
          <DeleteConfirmation
            isOpen={showDeleteModal}
            onClose={() => {
              setShowDeleteModal(false);
              setSelectedCard(null);
            }}
            onConfirm={() => {
              setShowDeleteModal(false);
            }}
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

//  {
//       id: 2,
//       image: "/testCard.png",
//       cover: "/testCard.png",
//       title: "بطاقة تعليمية رقم 2",
//       description:
//         "وصف تفصيلي للبطاقة التعليمية الثانية مع محتوى تعليمي متقدم ومفيد للطلاب.",
//       theme: "light",
//       language: "en",
//       type: "photo",
//     },
