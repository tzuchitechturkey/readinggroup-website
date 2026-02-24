import { useState, useEffect } from "react";

import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

import { GetContents, DeleteContentById, PatchContentById } from "@/api/contents";
import { setErrorFn } from "@/Utility/Global/setErrorFn";

export const useContentsData = () => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [contentsData, setContentsData] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [update, setUpdate] = useState(false);

  const getContentsData = async (
    page = 0,
    searchVal = "",
    status = "published",
    isWeekly = null,
    limit = 10
  ) => {
    setIsLoading(true);
    const offset = page * limit;
    const params = searchVal ? { search: searchVal } : {};

    if (isWeekly !== null) {
      params.is_weekly_moment = isWeekly;
    }

    try {
      const res = await GetContents(limit, offset, status, params);
      setContentsData(res?.data?.results || []);
      setTotalRecords(res?.data?.count || 0);
      return res?.data;
    } catch (error) {
      setErrorFn(error, t);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const handleWeeklyContentToggle = async (contentId, currentStatus, contentStatus) => {
    if (
      !currentStatus &&
      (contentStatus === "draft" || contentStatus === "archived")
    ) {
      toast.info(
        t(
          "Cannot add content to weekly list. Only published content can be added to the weekly list."
        )
      );
      return;
    }

    setIsLoading(true);
    try {
      await PatchContentById(contentId, { is_weekly_moment: !currentStatus });
      const message = !currentStatus
        ? t("Content added to weekly list successfully")
        : t("Content removed from weekly list successfully");
      toast.success(message);
      setUpdate((prev) => !prev);
    } catch (error) {
      setErrorFn(error, t);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteContent = async (contentId) => {
    setIsLoading(true);
    try {
      await DeleteContentById(contentId);
      toast.success(t("Content deleted successfully"));
      setUpdate(!update);
      return true;
    } catch (error) {
      setErrorFn(error, t);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const refreshData = () => {
    setUpdate(!update);
  };

  return {
    isLoading,
    contentsData,
    totalRecords,
    update,
    getContentsData,
    handleWeeklyContentToggle,
    handleDeleteContent,
    refreshData,
  };
};