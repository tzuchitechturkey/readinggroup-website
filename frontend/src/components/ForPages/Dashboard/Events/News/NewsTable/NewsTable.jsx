import React from "react";

import { LuPencil, LuTrash2, LuEye } from "react-icons/lu";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

function NewsTable({
  t,
  isLoading,
  newsData,
  sortData,
  getSortIcon,
  setSelectedNews,
  setIsViewerOpen,
  onSectionChange,
  setOpenCreateOrEditModal,
  totalPages,
  currentPage,
  handlePageChange,
  search,
  setShowDeleteModal,
}) {
  return (
    <div className="flex flex-col gap-4">
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-[#5B6B79] text-center font-medium text-xs">
                {t("Image")}
              </TableHead>
              <TableHead className="text-[#5B6B79] text-center font-medium text-xs">
                {t("Title")}
              </TableHead>
              <TableHead className="text-[#5B6B79] text-center font-medium text-xs px-3">
                <button
                  onClick={() => sortData("happened_at")}
                  className="flex items-center gap-1 font-medium"
                >
                  {t("Date")}
                  {getSortIcon("happened_at")}
                </button>
              </TableHead>
              <TableHead className="text-[#5B6B79] text-center font-medium text-xs">
                {t("Description")}
              </TableHead>
              <TableHead className="text-[#5B6B79] text-center font-medium text-xs">
                {t("Images Count")}
              </TableHead>
              <TableHead className="text-center w-[100px]">
                {t("Actions")}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  <div className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600" />
                    {t("Loading News...")}
                  </div>
                </TableCell>
              </TableRow>
            ) : newsData.length > 0 ? (
              newsData.map((news) => (
                <TableRow key={news?.id} className="hover:bg-gray-50">
                  {/* Image */}
                  <TableCell className="text-center py-4">
                    <div className="flex justify-center">
                      {news?.images?.[0]?.image ? (
                        <img
                          src={news.images[0].image}
                          alt={news.title}
                          className="w-16 h-12 object-cover rounded cursor-pointer"
                          onClick={() => {
                            setSelectedNews(news);
                            setIsViewerOpen(true);
                          }}
                        />
                      ) : (
                        <div className="w-16 h-12 bg-gray-200 rounded flex items-center justify-center">
                          <span className="text-xs text-gray-500">
                            {t("No Image")}
                          </span>
                        </div>
                      )}
                    </div>
                  </TableCell>

                  {/* Title */}
                  <TableCell className="text-center py-4 max-w-xs">
                    <p className="font-medium text-gray-900 truncate">
                      {news?.title}
                    </p>
                  </TableCell>

                  {/* Date */}
                  <TableCell className="text-[#1E1E1E] text-center text-[11px] py-4">
                    <span className="font-medium">
                      {news?.happened_at &&
                        new Date(news.happened_at).toLocaleDateString("en-GB", {
                          year: "numeric",
                          month: "2-digit",
                          day: "2-digit",
                        })}
                    </span>
                  </TableCell>

                  {/* Description */}
                  <TableCell className="text-center py-4 max-w-md">
                    <p className="text-sm text-gray-600 truncate">
                      {news?.description}
                    </p>
                  </TableCell>

                  {/* Images Count */}
                  <TableCell className="text-center py-4">
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                      {news?.images?.length || 0} {t("images")}
                    </span>
                  </TableCell>

                  {/* Actions */}
                  <TableCell>
                    <div className="flex items-center gap-2 justify-center">
                      <button
                        onClick={() => {
                          onSectionChange("createOrEditNews", news);
                        }}
                        className="p-1 text-green-600 hover:text-green-800 hover:bg-green-100 rounded"
                        title={t("View Images")}
                      >
                        <LuEye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedNews(news);
                          setOpenCreateOrEditModal(true);
                        }}
                        className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded"
                        title={t("Edit")}
                      >
                        <LuPencil className="h-4 w-4" />
                      </button>
                      {localStorage.getItem("userType") !== "editor" && (
                        <button
                          onClick={() => {
                            setSelectedNews(news);
                            setShowDeleteModal(true);
                          }}
                          className="p-1 text-red-600 hover:text-red-800 hover:bg-red-100 rounded"
                          title={t("Delete")}
                        >
                          <LuTrash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center py-8 text-gray-500"
                >
                  {search
                    ? t("No news found matching your search.")
                    : t("No news available.")}
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
            {Math.min(currentPage * limit, totalRecords)} {t("of")}{" "}
            {totalRecords} {t("results")}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1 || isLoading}
              className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {t("Previous")}
            </button>
            <div className="flex items-center gap-1">
              {[...Array(Math.min(5, totalPages))].map((_, i) => {
                const pageNum = i + 1;
                const isActive = pageNum === currentPage;
                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    disabled={isLoading}
                    className={`px-3 py-1 text-sm rounded ${
                      isActive
                        ? "bg-blue-600 text-white"
                        : "border border-gray-300 hover:bg-gray-50"
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages || isLoading}
              className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {t("Next")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default NewsTable;
