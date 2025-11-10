import React, { useState, useEffect } from "react";

import { Edit, Trash2, Plus } from "lucide-react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

import { DeleteHistoryById, GetHistory } from "@/api/aboutUs";
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
import TableButtons from "@/components/Global/TableButtons/TableButtons";
import { setErrorFn } from "@/Utility/Global/setErrorFn";
import Loader from "@/components/Global/Loader/Loader";
import CustomBreadcrumb from "@/components/ForPages/Dashboard/CustomBreadcrumb/CustomBreadcrumb";

import CreateOrEditHistory from "./CreateOrEditHistory";

function HistoryList({ onSectionChange }) {
  const { t, i18n } = useTranslation();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);
  const [isLaoding, setIsLaoding] = useState(false);
  const [showCreateOrEditModal, setShowCreateOrEditModal] = useState(false);
  const [selectedHistoryItem, setSelectedHistoryItem] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10;
  const [searchTerm, setSearchTerm] = useState("");
  const [update, setUpdate] = useState(false);
  const [historyData, setHistoryData] = useState([]);

  // Get Data
  const getData = async (page, searchValue = searchTerm) => {
    setIsLaoding(true);
    const offset = page * 10;
    try {
      const res = searchValue
        ? await GetHistory(limit, offset, searchValue)
        : await GetHistory(limit, offset);
      setTotalRecords(res.data?.count || 0);
      setHistoryData(res.data?.results);
    } catch (error) {
      setErrorFn(error, t);
    } finally {
      setIsLaoding(false);
    }
  };

  // Handle Pagination
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    getData(newPage - 1);
  };

  const handleConfirmDelete = async () => {
    setIsLaoding(true);
    try {
      await DeleteHistoryById(selectedHistoryItem.id);
      toast.success(t("Event deleted successfully"));
      setHistoryData((prev) =>
        prev.filter((item) => item.id !== selectedHistoryItem.id)
      );
      setShowDeleteModal(false);
    } catch (error) {
      setErrorFn(error, t);
    } finally {
      setIsLaoding(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const totalPages = Math.ceil(totalRecords / limit);

  useEffect(() => {
    getData(0);
  }, [update]);

  return (
    <div
      className="w-full min-h-screen bg-[#F5F7FB] px-3 relative text-[#1E1E1E] flex flex-col"
      dir={i18n.dir()}
    >
      {isLaoding && <Loader />}
      {/* Start Breadcrumb */}
      <CustomBreadcrumb
        onBack={() => {
          onSectionChange("dashboard");
        }}
        backTitle={t("Back to Dashboard")}
        page={t("History")}
      />
      {/* End Breadcrumb */}

      <div className="flex-1">
        {/* Start Header */}
        <div className="lg:flex items-center justify-between px-4 sm:px-6 py-4 border-b bg-white rounded-lg mb-6">
          {/* Start Text */}
          <div>
            <h2 className="text-lg font-medium text-[#1D2630]">
              {t("Company History")}
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              {t("Manage your company's historical events and milestones")}
            </p>
          </div>
          {/* End Text */}
          {/* Start Button && Total */}
          <div className="flex items-center justify-end gap-2 mt-4">
            <span className="text-sm text-gray-500">
              {t("Total")}: {historyData.length} {t("events")}
            </span>
            <button
              onClick={() => {
                setSelectedHistoryItem(null);
                setShowCreateOrEditModal(true);
              }}
              className="flex items-center gap-2 text-sm bg-primary border border-primary hover:bg-white transition-all duration-200 text-white hover:text-primary px-3 py-1.5 rounded"
            >
              <Plus className="h-4 w-4" />
              {t("Add New Event")}
            </button>
          </div>
          {/* End Button && Total */}
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
                  getData(0, "");
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
                  getData(0);
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
        {historyData.length === 0 ? (
          <div className="bg-white rounded-lg p-12 text-center shadow-sm">
            <div className="text-6xl mb-4">📅</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              {t("No Historical Events")}
            </h3>
            <p className="text-gray-600 mb-6">
              {t("Start by adding your first event in the company's history")}
            </p>
          </div>
        ) : historyData.length === 0 ? (
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
                  <TableHead className="text-[#5B6B79] font-medium text-xs px-3 ">
                    {t("ID")}
                  </TableHead>
                  <TableHead className="text-[#5B6B79] font-medium text-xs text-center">
                    {t("Image")}
                  </TableHead>
                  <TableHead className="text-[#5B6B79] font-medium text-xs text-center">
                    {t("Title")}
                  </TableHead>
                  <TableHead className="text-[#5B6B79] font-medium text-xs text-center ">
                    {t("Time Period")}
                  </TableHead>
                  <TableHead className="text-[#5B6B79] text-center font-medium text-xs">
                    {t("Description")}
                  </TableHead>
                  <TableHead className="text-[#5B6B79] font-medium text-xs text-center">
                    {t("Actions")}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="text-[11px]">
                {historyData.map((item) => (
                  <TableRow
                    key={item.id}
                    className="hover:bg-gray-50/60 border-b"
                  >
                    <TableCell className="text-[#1E1E1E] font-bold text-[11px] py-4 px-4">
                      {item.id}
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="flex items-center justify-center gap-3">
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
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="flex items-center justify-center gap-3">
                        <div className="flex flex-col">
                          <span className="text-[#1E1E1E] font-medium text-sm line-clamp-1">
                            {item.title}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-[#1E1E1E] text-[11px] py-4   ">
                      <div className="flex flex-col items-center ">
                        <span className="font-medium">
                          {new Date(item.story_date).toLocaleDateString(
                            "en-GB",
                            {
                              year: "numeric",
                              month: "2-digit",
                              day: "2-digit",
                            }
                          )}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-[#1E1E1E] text-[11px] py-4 max-w-sm">
                      <p
                        className="text-sm text-gray-900 line-clamp-2 text-center"
                        title={item.description}
                      >
                        {item.description.length > 80
                          ? `${item.description.substring(0, 80)}...`
                          : item.description}
                      </p>
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="flex items-center justify-center gap-2 text-[#5B6B79]">
                        <button
                          title={t("Edit")}
                          onClick={() => {
                            setSelectedHistoryItem(item);
                            setShowCreateOrEditModal(true);
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

            <TableButtons
              totalPages={totalPages}
              currentPage={currentPage}
              onPageChange={handlePageChange}
              t={t}
            />
          </div>
        )}

        {/* Start Create Or Edit Modal */}
        <Modal
          isOpen={showCreateOrEditModal}
          onClose={() => setShowCreateOrEditModal(false)}
          title={
            selectedHistoryItem?.id
              ? t("Edit Historical Event")
              : t("Add New Historical Event")
          }
        >
          <CreateOrEditHistory
            isOpen={showCreateOrEditModal}
            onClose={() => setShowCreateOrEditModal(false)}
            historyItem={selectedHistoryItem}
            setUpdate={setUpdate}
          />
        </Modal>
        {/* End Create Or Edit Modal */}
        {/* Start Delete Video Modal */}
        <Modal
          isOpen={showDeleteModal}
          onClose={() => {
            setShowDeleteModal(false);
            setSelectedHistoryItem(null);
          }}
          title={t("Confirm Deletion")}
          width="500px"
        >
          <DeleteConfirmation
            isOpen={showDeleteModal}
            onClose={() => {
              setShowDeleteModal(false);
              setSelectedHistoryItem(null);
            }}
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

export default HistoryList;
