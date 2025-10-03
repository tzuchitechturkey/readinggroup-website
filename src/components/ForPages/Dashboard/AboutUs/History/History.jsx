import React, { useState, useMemo } from "react";

import { Edit, Trash2, Plus } from "lucide-react";
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

import HistoryModal from "./HistoryModal";
import { resolveAsset } from "@/utils/assetResolver";

function History() {
  const { t } = useTranslation();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const defaultImage = resolveAsset("authback.jpg");

  const [searchTerm, setSearchTerm] = useState("");

  const [historyItems, setHistoryItems] = useState([
    {
      id: 1,
      from_date: "2020-01-01",
      to_date: "2021-01-01",
      title: "تأسيس الشركة",
      description:
        "تم تأسيس شركتنا في عام 2020 بمهمة إحداث ثورة في صناعة التكنولوجيا وتقديم حلول مبتكرة.",
      image: defaultImage,
    },
    {
      id: 2,
      from_date: "2021-02-01",
      to_date: "2021-12-31",
      title: "إطلاق المنتج الأول",
      description:
        "قمنا بإطلاق منتجنا الأول والذي حقق نجاحاً باهراً في السوق المحلي.",
      image: defaultImage,
    },
    {
      id: 3,
      from_date: "2022-01-01",
      to_date: "2022-06-30",
      title: "التوسع الإقليمي",
      description:
        "بدأنا في التوسع إقليمياً وافتتاح مكاتب جديدة في عدة دول عربية.",
      image: defaultImage,
    },
  ]);

  const [showCreateOrEditModal, setShowCreateOrEditModal] = useState(false);
  const [selectedHistoryItem, setSelectedHistoryItem] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  // فلترة العناصر بناءً على البحث
  const filteredItems = useMemo(() => {
    if (!searchTerm.trim()) {
      return historyItems.sort(
        (a, b) => new Date(a.from_date) - new Date(b.from_date)
      );
    }

    return historyItems
      .filter(
        (item) =>
          item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.from_date.includes(searchTerm) ||
          item.to_date.includes(searchTerm)
      )
      .sort((a, b) => new Date(a.from_date) - new Date(b.from_date));
  }, [historyItems, searchTerm]);

  // إضافة عنصر جديد
  const handleAddItem = () => {
    setSelectedHistoryItem(null);
    setIsEditing(false);
    setShowCreateOrEditModal(true);
  };

  // تعديل عنصر
  const handleEditItem = (item) => {
    setSelectedHistoryItem(item);
    setIsEditing(true);
    setShowCreateOrEditModal(true);
  };

  // حذف عنصر
  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setSelectedHistoryItem(null);
  };
  const handleConfirmDelete = async () => {
    setHistoryItems((prev) =>
      prev.filter((item) => item.id !== selectedHistoryItem.id)
    );
    setShowDeleteModal(false);
  };

  // حفظ العنصر (إضافة أو تعديل)
  const handleSaveItem = (itemData) => {
    if (isEditing) {
      // تعديل عنصر موجود
      setHistoryItems((prev) =>
        prev.map((item) =>
          item.id === selectedHistoryItem.id
            ? { ...itemData, id: selectedHistoryItem.id }
            : item
        )
      );
    } else {
      // إضافة عنصر جديد
      const newId = Math.max(...historyItems.map((item) => item.id), 0) + 1;
      setHistoryItems((prev) => [...prev, { ...itemData, id: newId }]);
    }
  };

  // تنسيق التاريخ للعرض
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ar-SA", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="w-full min-h-screen bg-[#F5F7FB] px-3 relative text-[#1E1E1E] flex flex-col">
      <div className="flex-1">
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b bg-white rounded-lg mb-6">
          <div>
            <h2 className="text-lg font-medium text-[#1D2630]">
              {t("Company History")}
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              {t("Manage your company's historical events and milestones")}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">
              {t("Total")}: {historyItems.length} {t("events")}
            </span>
            <button
              onClick={handleAddItem}
              className="flex items-center gap-2 text-sm bg-primary border border-primary hover:bg-white transition-all duration-200 text-white hover:text-primary px-3 py-1.5 rounded"
            >
              <Plus className="h-4 w-4" />
              {t("Add New Event")}
            </button>
          </div>
        </div>

        {/* شريط البحث */}
        <div className="bg-white rounded-lg p-4 mb-6 shadow-sm">
          <div className="relative max-w-md">
            <input
              type="text"
              placeholder="البحث في الأحداث التاريخية..."
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

        {/* Start Table */}
        {historyItems.length === 0 ? (
          <div className="bg-white rounded-lg p-12 text-center shadow-sm">
            <div className="text-6xl mb-4">📅</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              {t("No Historical Events")}
            </h3>
            <p className="text-gray-600 mb-6">
              {t("Start by adding your first event in the company's history")}
            </p>
            <button
              onClick={handleAddItem}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition-colors"
            >
              {t("Add Your First Event")}
            </button>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="bg-white rounded-lg p-12 text-center shadow-sm">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              {t("No Results Found")}
            </h3>
            <p className="text-gray-600 mb-4">
              {t("No results found for")} "{searchTerm}"
            </p>
            <button
              onClick={() => setSearchTerm("")}
              className="text-blue-500 hover:text-blue-600 underline"
            >
              {t("Clear Search")}
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <Table>
              <TableHeader className="bg-[#FAFAFA] h-14">
                <TableRow className="border-b">
                  <TableHead className="text-[#5B6B79] font-medium text-xs px-3">
                    {t("ID")}
                  </TableHead>
                  <TableHead className="text-[#5B6B79] font-medium text-xs">
                    {t("Image and Title")}
                  </TableHead>
                  <TableHead className="text-[#5B6B79] font-medium text-xs">
                    {t("Time Period")}
                  </TableHead>
                  <TableHead className="text-[#5B6B79] font-medium text-xs">
                    {t("Description")}
                  </TableHead>
                  <TableHead className="text-[#5B6B79] font-medium text-xs">
                    {t("Actions")}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="text-[11px]">
                {filteredItems.map((item) => (
                  <TableRow
                    key={item.id}
                    className="hover:bg-gray-50/60 border-b"
                  >
                    <TableCell className="text-[#1E1E1E] font-bold text-[11px] py-4 px-4">
                      {item.id}
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-24 h-24 rounded object-cover border"
                          onError={(e) => {
                            e.target.src =
                              "https://via.placeholder.com/100/4F46E5/FFFFFF?text=" +
                              item.title.charAt(0);
                          }}
                        />
                        <div className="flex flex-col">
                          <span className="text-[#1E1E1E] font-medium text-sm line-clamp-1">
                            {item.title}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-[#1E1E1E] text-[11px] py-4">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500">من:</span>
                          <span className="text-sm font-medium">
                            {formatDate(item.from_date)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500">إلى:</span>
                          <span className="text-sm font-medium">
                            {formatDate(item.to_date)}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-[#1E1E1E] text-[11px] py-4 max-w-sm">
                      <p
                        className="text-sm text-gray-900 line-clamp-2"
                        title={item.description}
                      >
                        {item.description.length > 80
                          ? `${item.description.substring(0, 80)}...`
                          : item.description}
                      </p>
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="flex items-center gap-2 text-[#5B6B79]">
                        <button
                          title={t("Edit")}
                          onClick={() => {
                            handleEditItem(item);
                          }}
                          className="p-1 rounded hover:bg-gray-100 hover:text-green-600"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          title={t("Delete")}
                          onClick={() => {
                            setSelectedHistoryItem(item);
                            setShowDeleteModal(true);
                            item;
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
          </div>
        )}

        {/* Start Edit Modal */}
        <Modal
          isOpen={showCreateOrEditModal}
          onClose={() => setShowCreateOrEditModal(false)}
          title={
            isEditing
              ? t("Edit Historical Event")
              : t("Add New Historical Event")
          }
        >
          <HistoryModal
            isOpen={showCreateOrEditModal}
            onClose={() => setShowCreateOrEditModal(false)}
            onSave={handleSaveItem}
            historyItem={selectedHistoryItem}
            isEditing={isEditing}
          />
        </Modal>
        {/* End Edit Modal */}
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
            itemName={selectedHistoryItem?.title}
          />
        </Modal>
        {/* End Delete Member Modal */}
      </div>
    </div>
  );
}

export default History;
