import React, { useState, useEffect } from "react";

import { Edit, Trash2 } from "lucide-react";
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
import DeleteConfirmation from "@/components/Global/DeleteConfirmation/DeleteConfirmation";
import { setErrorFn } from "@/Utility/Global/setErrorFn";
import { GetTeam, DeleteTeamById } from "@/api/team";
import Loader from "@/components/Global/Loader/Loader";
import TableButtons from "@/components/Global/TableButtons/TableButtons";

import CreateOrEditMember from "./CreateOrEditMember";
import CustomBreadcrumb from "@/components/ForPages/Dashboard/CustomBreadcrumb/CustomBreadcrumb";

function OurTeamList({ onSectionChange }) {
  const { t, i18n } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [members, setMembers] = useState([]);
  const [showDeleteMemberModal, setShowDeleteMemberModal] = useState(false);
  const limit = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [showCreateOrEditModal, setShowCreateOrEditModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [update, setUpdate] = useState(false);

  // Handle Pagination
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    getMemberData(newPage - 1);
  };

  // Fetch Members from API
  const getMemberData = async (page = 0, searchValue = searchTerm) => {
    const offset = page * 10;
    setIsLoading(true);
    try {
      const res = await GetTeam(limit, offset, searchValue);
      setTotalRecords(res.data.count);
      setMembers(res.data.results);
    } catch (error) {
      setErrorFn(error, t);
    } finally {
      setIsLoading(false);
    }
  };

  // Delete Member
  const handleConfirmDelete = async () => {
    setIsLoading(true);
    try {
      await DeleteTeamById(selectedMember?.id);
      toast.success(t("Member deleted successfully"));
      setShowDeleteMemberModal(false);
      setUpdate(!update);
    } catch (error) {
      setErrorFn(error, t);
    } finally {
      setIsLoading(false);
    }
  };

  const totalPages = Math.ceil(totalRecords / limit);

  useEffect(() => {
    getMemberData(0);
  }, [update]);

  return (
    <div
      className="w-full min-h-screen bg-[#F5F7FB] px-3 relative text-[#1E1E1E] flex flex-col"
      dir={i18n.dir()}
    >
      {isLoading && <Loader />}
      {/* Start Breadcrumb */}
      <CustomBreadcrumb
        backTitle={t("Back to Dashboard")}
        onBack={() => {
          onSectionChange("dashboard");
        }}
        page={t("Our Team")}
      />

      {/* End Breadcrumb */}

      <div className="flex-1">
        {/* Header */}
        <div className="flex items-center justify-between lg:px-4 sm:px-6 py-4 border-b bg-white rounded-lg mb-6">
          <h2 className="text-lg font-medium text-[#1D2630]">
            {t("Work Team")}
          </h2>

          <div className="flex items-center justify-between gap-1">
            <span className="text-sm text-gray-500">
              {t("Total")}: {members.length} {t("members")}
            </span>
            <button
              onClick={() => {
                setSelectedMember(null);
                setShowCreateOrEditModal(true);
              }}
              className="flex items-center  gap-2 text-sm bg-primary border border-primary hover:bg-white transition-all duration-200 text-white hover:text-primary px-3 py-1.5 rounded"
            >
              <span className="text-xl">+</span>
              {t("Add New Member")}
            </button>
          </div>
        </div>

        {/* Start Search */}
        <div className="bg-white rounded-lg p-4 mb-6 shadow-sm">
          <div className="relative max-w-md flex">
            <input
              type="text"
              placeholder={t("Search Team Members")}
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
                  getMemberData(0, "");
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
                  getMemberData(0);
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
        {members?.length === 0 ? (
          <div className="bg-white rounded-lg p-12 text-center shadow-sm">
            <div className="text-6xl mb-4">👤</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              {t("No team members yet")}
            </h3>
            <p className="text-gray-600 mb-6">
              {t("Start by adding the first team member")}
            </p>
            <button
              onClick={() => {
                setSelectedMember(null);
                setShowCreateOrEditModal(true);
              }}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition-colors"
            >
              {t("Add First Member")}
            </button>
          </div>
        ) : members?.length === 0 ? (
          <div className="bg-white rounded-lg p-12 text-center shadow-sm">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              {t("No results found")}
            </h3>
            <p className="text-gray-600 mb-4">
              {t("No results matching search")} "{searchTerm}"
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
            <div className="hidden lg:block overflow-x-auto">
              {/* جدول shadcn-ui */}
              <Table>
                <TableHeader className="bg-[#FAFAFA] h-14">
                  <TableRow className="border-b">
                    <TableHead className="text-[#5B6B79] text-center font-medium text-xs px-3">
                      {t("Title")}
                    </TableHead>

                    <TableHead className="text-[#5B6B79] text-center font-medium text-xs">
                      {t("Image")}
                    </TableHead>
                    <TableHead className="text-[#5B6B79] text-center font-medium text-xs">
                      {t("Description")}
                    </TableHead>
                    <TableHead className="text-[#5B6B79] text-center font-medium text-xs">
                      {t("Is Heart")}
                    </TableHead>

                    <TableHead className="text-[#5B6B79] text-center font-medium text-xs">
                      {t("Actions")}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="text-[11px]">
                  {members?.map((member) => (
                    <TableRow
                      key={member.id}
                      className="hover:bg-gray-50/60 border-b"
                    >
                      {/* Start Title */}
                      <TableCell className="py-4">
                        <span className="block w-fit  px-2 py-1 text-xs  mx-auto text-center font-semibold rounded-full bg-blue-100 text-blue-800">
                          {member?.title}
                        </span>
                      </TableCell>
                      {/* End Title */}
                      {/* Start Image */}
                      <TableCell className="text-[#1E1E1E] font-bold text-[11px] py-4 px-4">
                        <div className="flex items-center justify-center gap-2">
                          <img
                            src={member.images[0]?.image}
                            alt={member.title}
                            className="w-10 h-10 rounded-full object-cover border-2 border-blue-100 "
                            onError={(e) => {
                              e.target.src =
                                "https://via.placeholder.com/100/4F46E5/FFFFFF?text=" +
                                member.title.charAt(0);
                            }}
                          />
                        </div>
                      </TableCell>
                      {/* End Image */}
                      {/* Start Description */}
                      <TableCell className="text-[#1E1E1E] text-[11px] py-4 max-w-xs">
                        <p
                          className="text-sm text-center text-gray-900 line-clamp-2"
                          dangerouslySetInnerHTML={{
                            __html:
                              member.description.length > 120
                                ? member.description.substring(0, 120) + "..."
                                : member.description,
                          }}
                        />
                      </TableCell>
                      {/* End Description */}
                      {/* Start Is Heart */}
                      <TableCell className="text-[#1E1E1E] text-[11px] py-4 text-center">
                        {member.is_heart ? t("Active") : t("Inactive")}
                      </TableCell>
                      {/* End Is Heart */}
                      {/* Start Actions */}
                      <TableCell className="py-4">
                        <div className="flex items-center justify-center gap-2 text-[#5B6B79]">
                          <button
                            onClick={() => {
                              setSelectedMember(member);
                              setShowCreateOrEditModal(true);
                            }}
                            className="p-1 rounded hover:bg-gray-100 hover:text-green-600"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          {localStorage.getItem("userType") !== "editor" && (
                            <button
                              onClick={() => {
                                setSelectedMember(member);
                                setShowDeleteMemberModal(true);
                              }}
                              className="p-1 rounded hover:bg-gray-100 hover:text-rose-600"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          )}
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
          </div>
        )}
        {/* End Table */}

        {/* Start Create or Edit Modal */}
        <Modal
          isOpen={showCreateOrEditModal}
          onClose={() => setShowCreateOrEditModal(false)}
          title={selectedMember?.id ? t("Edit Member") : t("Create New Member")}
        >
          <CreateOrEditMember
            isOpen={showCreateOrEditModal}
            onClose={() => setShowCreateOrEditModal(false)}
            member={selectedMember}
            setUpdate={setUpdate}
          />
        </Modal>
        {/* ENd Create or Edit Modal */}
        {/* Start Delete Member Modal */}
        <Modal
          isOpen={showDeleteMemberModal}
          onClose={() => {
            setShowDeleteMemberModal(false);
            setSelectedMember(null);
          }}
          title={t("Confirm Deletion")}
          width="500px"
        >
          <DeleteConfirmation
            isOpen={showDeleteMemberModal}
            onClose={() => {
              setShowDeleteMemberModal(false);
              setSelectedMember(null);
            }}
            onConfirm={handleConfirmDelete}
            title={t("Delete Member")}
            message={t(
              "Are you sure you want to delete this member? This action cannot be undone.",
            )}
            itemName={selectedMember?.userName}
          />
        </Modal>
        {/* End Delete Member Modal */}
      </div>
    </div>
  );
}

export default OurTeamList;
