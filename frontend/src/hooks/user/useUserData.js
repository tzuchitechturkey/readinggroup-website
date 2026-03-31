import { useState } from "react";

import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

import { setErrorFn } from "@/Utility/Global/setErrorFn";
import { GetUsers, DeleteUserById } from "@/api/user";

export const useUserData = () => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [userData, setUserData] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [update, setUpdate] = useState(false);

  const getUserData = async (page = 0, searchVal = "", limit = 10) => {
    setIsLoading(true);
    const offset = page * limit;

    try {
      const res = await GetUsers();
      // Filter data based on search if needed
      let results = res?.data?.results || [];
      if (searchVal) {
        results = results.filter(
          (user) =>
            user.username.toLowerCase().includes(searchVal.toLowerCase()) ||
            user.email.toLowerCase().includes(searchVal.toLowerCase())
        );
      }
      setUserData(results);
      setTotalRecords(res?.data?.count || results.length);
      return res?.data;
    } catch (error) {
      setErrorFn(error, t);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    setIsLoading(true);
    try {
      await DeleteUserById(userId);
      toast.success(t("User deleted successfully"));
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
    userData,
    totalRecords,
    update,
    getUserData,
    handleDeleteUser,
    refreshData,
  };
};
