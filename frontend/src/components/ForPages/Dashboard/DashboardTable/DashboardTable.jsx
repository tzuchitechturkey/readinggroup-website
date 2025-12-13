import React, { useState, useMemo } from "react";

import { Eye, Edit, Trash2 } from "lucide-react";
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

function DashboardTable({ data, onSectionChange }) {
  const { t, i18n } = useTranslation();
  // Sorting state
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
  // Transform API data into table rows
  const rows = useMemo(() => {
    if (!data) return [];

    const items = [];
    // Add video
    if (data?.video) {
      const cast = data?.video.cast || [];
      const castNames = cast.map((c) => c.name || c).join(", ");
      items.push({
        type: "Video",
        id: data?.video.id,
        image: data?.video.thumbnail || data?.video.thumbnail_url,
        writer: castNames || t("No cast"),
        category: data?.video.category?.name,
        date: data?.video.created_at || data?.video.published_at || "",
        views: data?.video.views || 0,
        likes_count: data?.video.likes_count || 0,
        comment: data?.video.comments || [],
        originData: data?.video,
        link: "createOrEditVideo",
      });
    }

    // Add card photo
    if (data?.post_card) {
      items.push({
        type: "Card",
        id: data?.post_card.id,
        image: data?.post_card.image || data?.post_card.image_url,
        writer:
          data?.post_card.writer || data?.post_card.author || t("Unknown"),
        category: data?.post_card.category?.name,
        date: data?.post_card.created_at || data?.post_card.published_at || "",
        views: data?.post_card.views || 0,
        likes_count: data?.post_card.likes_count || 0,
        comment: data?.post_card.comments || [],
        originData: data?.post_card,
        link: "createOrEditPost",
      });
    }

    // Add photo
    if (data?.post_photo) {
      items.push({
        type: "Photo",
        id: data?.post_photo.id,
        image: data?.post_photo.image || data?.post_photo.image_url,
        writer:
          data?.post_photo.writer || data?.post_photo.author || t("Unknown"),
        category: data?.post_photo.category?.name,
        date:
          data?.post_photo.created_at || data?.post_photo.published_at || "",
        views: data?.post_photo.views || 0,
        likes_count: data?.post_photo.likes_count || 0,
        comment: data?.post_photo.comments || [],
        originData: data?.post_photo,
        link: "createOrEditPost",
      });
    }

    // Add contents
    if (data?.content) {
      items.push({
        type: "Content",
        id: data?.content?.id,
        image:
          data?.content?.images[0]?.image || data?.content?.image_url[0]?.image,
        writer: data?.content?.writer || data?.content?.author || t("Unknown"),
        category: data?.content?.category?.name,
        date: data?.content?.created_at || data?.content?.published_at || "",
        views: data?.content?.views || 0,
        likes_count: data?.content?.likes_count || 0,
        comment: data?.content?.comments || [],
        originData: data?.content,
        link: "createOrEditContent",
      });
    }

    // Add event
    if (data?.event) {
      items.push({
        type: "Event",
        id: data?.event.id,
        image: data?.event.image || data?.event.image_url,
        writer: data?.event.writer || data?.event.author || t("Unknown"),
        category: data?.event.category?.name,
        date: data?.event.created_at || data?.event.published_at || "",
        views: data?.event.views || 0,
        likes_count: data?.event.likes_count || 0,
        comment: data?.event.comments || [],
        originData: data?.event,
        link: "createOrEditEvent",
      });
    }

    return items;
  }, [data, t]);
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

      // String comparison for type, writer
      const aString = String(aValue || "").toLowerCase();
      const bString = String(bValue || "").toLowerCase();

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
    <div
      className="xl:col-span-3 bg-white rounded-lg border border-gray-200"
      dir={i18n?.language === "ar" ? "rtl" : "ltr"}
    >
      <div className="flex items-center justify-between px-4 py-4 border-b">
        <h3 className="text-lg sm:text-xl font-semibold text-[#1D2630]">
          {t("Website Statistics")}
        </h3>
      </div>

      <Table>
        <TableHeader className="bg-[#FAFAFA]  h-14">
          <TableRow className="border-b ">
            <TableHead className="text-[#5B6B79] font-medium text-sm px-3">
              <div
                className="flex items-center gap-1 cursor-pointer hover:text-[#1E1E1E]"
                onClick={() => sortData("type")}
              >
                {t("The Section")}
                {getSortIcon("type")}
              </div>
            </TableHead>
            <TableHead className="text-[#5B6B79] font-medium text-sm">
              <div className="flex items-center gap-1 cursor-pointer justify-center ">
                {t("Image")}
              </div>
            </TableHead>
            <TableHead className="text-[#5B6B79] font-medium text-sm">
              <div className="flex items-center justify-center gap-1 cursor-pointer hover:text-[#1E1E1E]">
                {t("Writer/Cast")}
              </div>
            </TableHead>
            <TableHead className="text-[#5B6B79] font-medium text-sm">
              <div
                className="flex items-center justify-center gap-1 cursor-pointer hover:text-[#1E1E1E]"
                onClick={() => sortData("category")}
              >
                {t("Category")}
                {getSortIcon("category")}
              </div>
            </TableHead>

            <TableHead className="text-[#5B6B79] font-medium text-sm">
              <div
                className="flex items-center gap-1 justify-center cursor-pointer hover:text-[#1E1E1E]"
                onClick={() => sortData("date")}
              >
                {t("Date")}
                {getSortIcon("date")}
              </div>
            </TableHead>
            <TableHead className="text-[#5B6B79] text-center font-medium text-sm">
              {t("Views")}
            </TableHead>
            <TableHead className="text-[#5B6B79] text-center font-medium text-sm">
              {t("Likes Count")}
            </TableHead>
            <TableHead className="text-[#5B6B79] text-center font-medium text-sm">
              {t("Comment Count")}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className=" text-sm" style={{ padding: "10px" }}>
          {sortedRows.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                {t("No data available")}
              </TableCell>
            </TableRow>
          ) : (
            sortedRows.map((r, idx) => {
              // Parse date - format: "2025-10-30 06:13" or "2025-10-30T06:13:00"
              const dateStr = r.date || "";
              let datePart = "";

              if (dateStr) {
                const dateMatch = dateStr.match(
                  /(\d{4}-\d{2}-\d{2})\s*(?:T|\s)?(\d{2}:\d{2})/
                );
                if (dateMatch) {
                  datePart = dateMatch[1]; // YYYY-MM-DD
                } else {
                  datePart = dateStr;
                }
              }

              return (
                <TableRow
                  key={`${r.type}-${r.id}-${idx}`}
                  className="hover:bg-gray-50/60 border-b cursor-pointer"
                  onClick={() => {
                    onSectionChange(r.link, r.originData);
                  }}
                >
                  <TableCell className="text-[#1E1E1E] font-semibold text-base py-4 px-3">
                    {t(r.type)}
                  </TableCell>
                  <TableCell className="text-[#1E1E1E] text-base  py-4">
                    <div className="flex items-center text-center justify-center gap-3 text-[#5B6B79]">
                      <img
                        src={r.image || r?.image_url}
                        alt={r.type}
                        className="w-12 h-12 object-cover"
                      />
                    </div>
                  </TableCell>
                  <TableCell className="py-4 ">
                    <div className="flex items-center text-center justify-center gap-3 text-[#5B6B79]">
                      {r.writer}
                    </div>
                  </TableCell>
                  <TableCell className=" text-base  py-4">
                    <div className="flex items-center text-center justify-center gap-3 text-[#5B6B79]">
                      {r?.category}
                    </div>
                  </TableCell>

                  <TableCell className=" text-base  py-4">
                    <div className="flex items-center text-center justify-center gap-3 text-[#5B6B79]">
                      {datePart}
                    </div>
                  </TableCell>
                  <TableCell className="py-4">
                    <div className="flex items-center text-center justify-center gap-3 text-[#5B6B79]">
                      {r.views}
                    </div>
                  </TableCell>
                  <TableCell className="py-4">
                    <div className="flex items-center text-center justify-center gap-3 text-[#5B6B79]">
                      {r.comment?.length}
                    </div>
                  </TableCell>
                  <TableCell className="py-4">
                    <div className="flex items-center text-center justify-center gap-3 text-[#5B6B79]">
                      {r.likes_count}
                    </div>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
}

export default DashboardTable;
