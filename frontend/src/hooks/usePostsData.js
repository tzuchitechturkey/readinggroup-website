import { useState, useEffect } from "react";

import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

import { GetPosts, DeletePostById, PatchPostById } from "@/api/posts";
import { setErrorFn } from "@/Utility/Global/setErrorFn";

export const usePostsData = () => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [postData, setPostData] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [update, setUpdate] = useState(false);

  const getPostData = async (
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
      const res = await GetPosts(limit, offset, status, params);
      setPostData(res?.data?.results || []);
      setTotalRecords(res?.data?.count || 0);
      return res?.data;
    } catch (error) {
      setErrorFn(error, t);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const handleWeeklyPostToggle = async (postId, currentStatus, postStatus) => {
    if (
      !currentStatus &&
      (postStatus === "draft" || postStatus === "archived")
    ) {
      toast.info(
        t(
          "Cannot add post to weekly list. Only published posts can be added to the weekly list."
        )
      );
      return;
    }

    setIsLoading(true);
    try {
      await PatchPostById(postId, { is_weekly_moment: !currentStatus });
      const message = !currentStatus
        ? t("Post added to weekly list successfully")
        : t("Post removed from weekly list successfully");
      toast.success(message);
      setUpdate((prev) => !prev);
    } catch (error) {
      setErrorFn(error, t);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeletePost = async (postId) => {
    setIsLoading(true);
    try {
      await DeletePostById(postId);
      toast.success(t("Post deleted successfully"));
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
    postData,
    totalRecords,
    update,
    getPostData,
    handleWeeklyPostToggle,
    handleDeletePost,
    refreshData,
  };
};