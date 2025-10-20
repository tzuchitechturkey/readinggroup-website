import React, { useState, useMemo, useEffect, useRef } from "react";

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
import DeleteConfirmation from "@/components/ForPages/Dashboard/Videos/DeleteConfirmation/DeleteConfirmation";
import { setErrorFn } from "@/Utility/Global/setErrorFn";
import { GetTeam, DeleteTeamById, GetPositions } from "@/api/aboutUs";
import Loader from "@/components/Global/Loader/Loader";
import TableButtons from "@/components/Global/TableButtons/TableButtons";

import CreateOrEditMember from "./CreateOrEditMember";

function OurTeam() {
  const { t } = useTranslation();
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
  const getMemberData = async (page = 0) => {
    const offset = page * 10;
    setIsLoading(true);
    try {
      const res = await GetTeam(limit, offset, searchTerm || "");
      setTotalRecords(res.data.count);
      setMembers(res.data.results);
    } catch (error) {
      setErrorFn(error);
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
      setErrorFn(error);
    } finally {
      setIsLoading(false);
    }
  };

  const totalPages = Math.ceil(totalRecords / limit);

  useEffect(() => {
    getMemberData(0);
  }, [update]);

  return (
    <div className="min-h-screen bg-gray-50 pt-1">
      {isLoading && <Loader />}
      {/* Start Header */}
      <div className="bg-white p-3 rounded-lg grid grid-cols-12 items-center gap-4">
        <div className="col-span-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            {"Work Team"}
          </h1>
          <p className="text-gray-600">
            {"Manage team members and their data"}
          </p>
        </div>

        <div className="relative col-span-3">
          <input
            type="text"
            placeholder={t("Search members?...")}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full lg:w-80 px-4 py-2  border border-gray-300 rounded-lg outline-none"
          />
          <div className="absolute -right-3 top-1/2 transform -translate-y-1/2">
            <svg
              className="w-5 h-5 text-gray-400"
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

        <div className="col-span-3 flex justify-end">
          <button
            onClick={() => {
              setSelectedMember(null);
              setShowCreateOrEditModal(true);
            }}
            className="bg-primary hover:text-primary border border-primary hover:bg-white text-white px-2 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <span className="text-xl">+</span>
            {t("Add New Member")}
          </button>
        </div>
      </div>

      {/* End Header */}

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
                  <TableHead className="text-[#5B6B79] font-medium text-xs px-3">
                    {t("Name")}
                  </TableHead>
                  <TableHead className="text-[#5B6B79] font-medium text-xs px-3">
                    {t("Member")}
                  </TableHead>
                  <TableHead className="text-[#5B6B79] font-medium text-xs">
                    {t("Position")}
                  </TableHead>
                  <TableHead className="text-[#5B6B79] font-medium text-xs">
                    {t("job")}
                  </TableHead>
                  <TableHead className="text-[#5B6B79] font-medium text-xs">
                    {t("Description")}
                  </TableHead>
                  <TableHead className="text-[#5B6B79] font-medium text-xs">
                    {t("Social Media")}
                  </TableHead>
                  <TableHead className="text-[#5B6B79] font-medium text-xs">
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
                    <TableCell className="py-4">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                        {member?.name}
                      </span>
                    </TableCell>
                    <TableCell className="text-[#1E1E1E] font-bold text-[11px] py-4 px-4">
                      <div className="flex items-center gap-2">
                        <img
                          src={member.avatar}
                          alt={member.userName}
                          className="w-10 h-10 rounded-full object-cover border-2 border-blue-100 "
                          onError={(e) => {
                            e.target.src =
                              "https://via.placeholder.com/100/4F46E5/FFFFFF?text=" +
                              member.userName.charAt(0);
                          }}
                        />
                        <div>
                          <div className="text-sm mb-2 font-medium text-gray-900">
                            {member.userName}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                        {member.position?.name}
                      </span>
                    </TableCell>
                    <TableCell className="text-[#1E1E1E] text-[11px] py-4">
                      {member.job_title}
                    </TableCell>
                    <TableCell className="text-[#1E1E1E] text-[11px] py-4 max-w-xs">
                      <p
                        className="text-sm text-gray-900 truncate"
                        title={member.description}
                      >
                        {member.description.length > 60
                          ? `${member.description.substring(0, 60)}...`
                          : member.description}
                      </p>
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="flex flex-wrap gap-1">
                        {member?.social_links.length > 0 ? (
                          member?.social_links
                            .slice(0, 2)
                            .map((social, index) => (
                              <a
                                key={index}
                                href={social.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex px-2 py-1 text-xs rounded-full bg-green-100 text-green-800 hover:bg-green-200 transition-colors"
                                title={social.url}
                              >
                                {social.name}
                              </a>
                            ))
                        ) : (
                          <span className="text-xs text-gray-400">لا يوجد</span>
                        )}
                        {member.social && member?.social_links.length > 2 && (
                          <span className="text-xs text-gray-500">
                            +{member?.social_links.length - 2}
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="flex items-center gap-2 text-[#5B6B79]">
                        <button
                          onClick={() => {
                            setSelectedMember(member);
                            setShowCreateOrEditModal(true);
                          }}
                          className="p-1 rounded hover:bg-gray-100 hover:text-green-600"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedMember(member);
                            setShowDeleteMemberModal(true);
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

          {/* Start Mobile View */}
          <div className="lg:hidden">
            <div className="divide-y divide-gray-200">
              {members?.map((member) => (
                <div
                  key={member.id}
                  className="p-6 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start gap-4">
                    <img
                      src={member.avatar}
                      alt={member.userName}
                      className="w-16 h-16 rounded-full object-cover border-2 border-blue-100"
                      onError={(e) => {
                        e.target.src =
                          "https://via.placeholder.com/100/4F46E5/FFFFFF?text=" +
                          member.userName.charAt(0);
                      }}
                    />
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            {member.userName}
                          </h3>
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                            {member.position?.name || member.position}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-2 mb-4">
                        <div>
                          <span className="text-sm font-medium text-gray-600">
                            {t("Job")}:{" "}
                          </span>
                          <span className="text-sm text-gray-900">
                            {member.job}
                          </span>
                        </div>
                        <div>
                          <span className="text-sm font-medium text-gray-600">
                            {t("Description")}:{" "}
                          </span>
                          <p className="text-sm text-gray-900">
                            {member.description.length > 100
                              ? `${member.description.substring(0, 100)}...`
                              : member.description}
                          </p>
                        </div>

                        {member.social_links.length > 0 && (
                          <div>
                            <span className="text-sm font-medium text-gray-600 block mb-1">
                              {t("Social Media")}:{" "}
                            </span>
                            <div className="flex flex-wrap gap-1">
                              {member.social_links.map((social, index) => (
                                <a
                                  key={index}
                                  href={social.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex px-2 py-1 text-xs rounded-full bg-green-100 text-green-800 hover:bg-green-200 transition-colors"
                                >
                                  {social.name}
                                </a>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setSelectedMember(member);
                            setShowCreateOrEditModal(true);
                          }}
                          className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-4 rounded-lg text-sm transition-colors"
                        >
                          {t("Edit")}
                        </button>
                        <button
                          onClick={() => handleDeleteMember(member.id)}
                          className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg text-sm transition-colors"
                        >
                          {t("Delete")}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* End Mobile View */}
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
            "Are you sure you want to delete this member? This action cannot be undone."
          )}
          itemName={selectedMember?.userName}
        />
      </Modal>
      {/* End Delete Member Modal */}
    </div>
  );
}

export default OurTeam;
