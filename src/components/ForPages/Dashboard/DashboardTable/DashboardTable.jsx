import React, { useState } from "react";

import { Eye, Edit, Trash2 } from "lucide-react";
import { LuArrowUpDown } from "react-icons/lu";
import { useTranslation } from "react-i18next";

import StatusPill from "@/components/ForPages/Dashboard/StatusPill/StatusPill";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const rows = [
  {
    content: "Video",
    id: "1023",
    client: "John Carter",
    email: "hello@johncarter.com",
    date: "2023/02/07 09:05 PM",
    status: "Delivered",
  },
  {
    content: "Card",
    id: "1024",
    client: "John Carter",
    email: "hello@johncarter.com",
    date: "2023/02/01 02:14 PM",
    status: "Canceled",
  },
  {
    content: "News",
    id: "1026",
    client: "John Carter",
    email: "hello@johncarter.com",
    date: "2023/01/22 10:32 AM",
    status: "Pending",
  },
  {
    content: "News",
    id: "1028",
    client: "John Carter",
    email: "hello@johncarter.com",
    date: "2023/01/15 01:45 PM",
    status: "Delivered",
  },
  {
    content: "News",
    id: "1030",
    client: "John Carter",
    email: "hello@johncarter.com",
    date: "2022/12/18 08:20 AM",
    status: "Delivered",
  },
  {
    content: "News",
    id: "1032",
    client: "John Carter",
    email: "hello@johncarter.com",
    date: "2022/10/05 07:24 PM",
    status: "Delivered",
  },
];
function DashboardTable() {
  const { t } = useTranslation();
  // (removed unused menu state)
  // Sorting state
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });

  // Sort function
  const sortData = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    } else if (sortConfig.key === key && sortConfig.direction === "desc") {
      direction = null; // Reset to original order
    }
    setSortConfig({ key, direction });
  };

  // Get sorted data
  const getSortedData = () => {
    if (!sortConfig.key || !sortConfig.direction) {
      return rows; // Return original order
    }

    return [...rows].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      // Handle different data types
      if (sortConfig.key === "date") {
        const aDate = new Date(aValue);
        const bDate = new Date(bValue);
        return sortConfig.direction === "asc" ? aDate - bDate : bDate - aDate;
      }

      if (sortConfig.key === "id") {
        const aNum = parseInt(aValue);
        const bNum = parseInt(bValue);
        return sortConfig.direction === "asc" ? aNum - bNum : bNum - aNum;
      }

      // String comparison for content, client, status
      const aString = aValue.toLowerCase();
      const bString = bValue.toLowerCase();

      if (aString < bString) {
        return sortConfig.direction === "asc" ? -1 : 1;
      }
      if (aString > bString) {
        return sortConfig.direction === "asc" ? 1 : -1;
      }
      return 0;
    });
  };

  // Get sort icon based on current state
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

  const sortedRows = getSortedData();

  return (
    <div className="xl:col-span-3 bg-white rounded-lg border border-gray-200">
      <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b">
        <h3 className="text-lg sm:text-xl font-semibold text-[#1D2630]">
          {t("websites List")}
        </h3>
        <button className="text-sm text-blue-600 hover:underline">
          {t("view All")}
        </button>
      </div>

      <Table>
        <TableHeader className="bg-[#FAFAFA]  h-14">
          <TableRow className="border-b ">
            <TableHead className="text-[#5B6B79] font-medium text-sm px-3">
              <div
                className="flex items-center gap-1 cursor-pointer hover:text-[#1E1E1E]"
                onClick={() => sortData("content")}
              >
                {t("content")}
                {getSortIcon("content")}
              </div>
            </TableHead>
            <TableHead className="text-[#5B6B79] font-medium text-sm">
              <div
                className="flex items-center gap-1 cursor-pointer hover:text-[#1E1E1E]"
                onClick={() => sortData("id")}
              >
                {t("id")}
                {getSortIcon("id")}
              </div>
            </TableHead>
            <TableHead className="text-[#5B6B79] font-medium text-sm">
              <div
                className="flex items-center gap-1 cursor-pointer hover:text-[#1E1E1E]"
                onClick={() => sortData("client")}
              >
                {t("client")}
                {getSortIcon("client")}
              </div>
            </TableHead>
            <TableHead className="text-[#5B6B79] font-medium text-sm">
              <div
                className="flex items-center gap-1 cursor-pointer hover:text-[#1E1E1E]"
                onClick={() => sortData("date")}
              >
                {t("date/time")}
                {getSortIcon("date")}
              </div>
            </TableHead>
            <TableHead className="text-[#5B6B79] font-medium text-sm">
              <div
                className="flex items-center gap-1 cursor-pointer hover:text-[#1E1E1E]"
                onClick={() => sortData("status")}
              >
                {t("status")}
                {getSortIcon("status")}
              </div>
            </TableHead>
            <TableHead className="text-[#5B6B79] font-medium text-sm">
              {t("action")}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className=" text-sm" style={{ padding: "10px" }}>
          {sortedRows.map((r, idx) => {
            const m = r.date.match(
              /(\d{4}\/\d{2}\/\d{2})\s+(\d{1,2}:\d{2})(?:\s*(AM|PM))?/i
            );
            const datePart = m ? m[1] : r.date;
            const timeText = m ? (m[3] ? `${m[2]} ${m[3]}` : m[2]) : "";
            return (
              <TableRow key={idx} className="hover:bg-gray-50/60 border-b ">
                <TableCell className="text-[#1E1E1E] font-bold text-base py-4 px-3">
                  {r.content}
                </TableCell>
                <TableCell className="text-[#1E1E1E] text-base  py-4">
                  {r.id}
                </TableCell>
                <TableCell className="py-4 ">
                  <div className="flex flex-col">
                    <span className="text-[#0057B7] font-bold  text-base ">
                      {r.client}
                    </span>
                    <a
                      href={`mailto:${r.email}`}
                      className="text-sm text-[#6B7280] hover:underline"
                    >
                      {r.email}
                    </a>
                  </div>
                </TableCell>
                <TableCell className=" text-base  py-4">
                  <div className="flex flex-col">
                    <span className="  text-sm">{datePart}</span>
                    <span className="text-[#9FA2AA] font-medium text-sm">
                      {timeText}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="py-4">
                  <StatusPill status={r.status} label={t(r.status)} />
                </TableCell>
                <TableCell className="py-4">
                  <div className="flex items-center gap-3 text-[#5B6B79]">
                    <button
                      title={t("view")}
                      className="p-2 rounded hover:bg-gray-100 hover:text-blue-600"
                    >
                      <Eye className="h-5 w-5" />
                    </button>
                    <button
                      title={t("edit")}
                      className="p-2 rounded hover:bg-gray-100 hover:text-green-600"
                    >
                      <Edit className="h-5 w-5" />
                    </button>
                    <button
                      title={t("delete")}
                      className="p-2 rounded hover:bg-gray-100 hover:text-rose-600"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}

export default DashboardTable;
