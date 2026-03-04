import { useState } from "react";

import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

import { setErrorFn } from "@/Utility/Global/setErrorFn";
import {
  DeleteRelatedReportById,
  GetRelatedReports,
} from "@/api/relatedReports";

export const useRelatedReportsData = () => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [reportsData, setReportsData] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [update, setUpdate] = useState(false);
  const getReportsData = async (page = 0, searchVal = "", limit = 10) => {
    setIsLoading(true);
    const offset = page * limit;
    const params = searchVal ? { search: searchVal } : {};
    try {
      const res = await GetRelatedReports(limit, offset, params);
      setReportsData(res?.data?.results || []);
      setTotalRecords(res?.data?.count || 0);
      return res?.data;
    } catch (error) {
      setErrorFn(error, t);
      return null;
    } finally {
      setIsLoading(false);
    }
  };
  const handleDeleteReport = async (reportId) => {
    setIsLoading(true);
    try {
      await DeleteRelatedReportById(reportId);
      toast.success(t("Related report deleted successfully"));
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
    reportsData,
    totalRecords,
    update,
    getReportsData,
    handleDeleteReport,
    refreshData,
  };
};
