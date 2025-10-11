import React from "react";

import { useTranslation } from "react-i18next";

import PostsList from "@/components/ForPages/Dashboard/Posts/PostsList/PostsList";

function PostsManagement() {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          {t("Posts Management")}
        </h1>
        <p className="mt-1 text-sm text-gray-600">
          {t("Manage your blog posts, articles, and content publications.")}
        </p>
      </div>

      {/* Posts List Component */}
      <PostsList />
    </div>
  );
}

export default PostsManagement;
