import { useState } from "react";

import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

import { setErrorFn } from "@/Utility/Global/setErrorFn";
import { GetGroups, DeleteGroupById } from "@/api/group";

export const useGroupData = () => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [groupData, setGroupData] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [update, setUpdate] = useState(false);

  const getGroupData = async (page = 0, searchVal = "", limit = 10) => {
    setIsLoading(true);
    const offset = page * limit;

    try {
      const res = await GetGroups();
      // Filter data based on search if needed
      let results = res?.data?.results || [];
      if (searchVal) {
        results = results.filter((group) =>
          group.name.toLowerCase().includes(searchVal.toLowerCase())
        );
      }
      setGroupData(results);
      setTotalRecords(res?.data?.count || results.length);
      return res?.data;
    } catch (error) {
      setErrorFn(error, t);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteGroup = async (groupId) => {
    setIsLoading(true);
    try {
      await DeleteGroupById(groupId);
      toast.success(t("Group deleted successfully"));
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
    groupData,
    totalRecords,
    update,
    getGroupData,
    handleDeleteGroup,
    refreshData,
  };
};
