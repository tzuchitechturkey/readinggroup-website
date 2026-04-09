import { useState } from "react";

import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

import { setErrorFn } from "@/Utility/Global/setErrorFn";
import { DeleteLearnById, GetLearn, GetLearnsByCategoryId } from "@/api/learn";

export const useLearnData = () => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [learnData, setLearnData] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [update, setUpdate] = useState(false);

  const getLearnData = async (page = 0, searchVal = "", limit = 10) => {
    setIsLoading(true);
    const offset = page * limit;
    const params = searchVal ? { search: searchVal } : {};

    try {
      const res = await GetLearn(limit, offset, params);
      setLearnData(res?.data?.results || []);
      setTotalRecords(res?.data?.count || 0);
      return res?.data;
    } catch (error) {
      setErrorFn(error, t);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const getLearnDataByCategory = async (categoryId, page = 0, searchVal = "", limit = 10) => {
    setIsLoading(true);
    const offset = page * limit;
    const params = searchVal ? { search: searchVal } : {};
    try {
      const res = await GetLearnsByCategoryId(categoryId, limit, offset, params);
      setLearnData(res?.data?.results || []);
      setTotalRecords(res?.data?.count || 0);
      return res?.data;
    } catch (error) {
      setErrorFn(error, t);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteLearn = async (learnId) => {
    setIsLoading(true);
    try {
      await DeleteLearnById(learnId);
      toast.success(t("Learn deleted successfully"));
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
    learnData,
    totalRecords,
    update,
    getLearnData,
    getLearnDataByCategory,
    handleDeleteLearn,
    refreshData,
  };
};
