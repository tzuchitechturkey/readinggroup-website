import React from "react";

import { useTranslation } from "react-i18next";

function PostDetails({ post, onClose, onEdit }) {
  const { t } = useTranslation();

  if (!post) return null;

  return (
    <div className="p-6">
      <div className="space-y-6">
        {/* Header Section */}
        <div>
          <h3 className="text-xl font-semibold text-[#1D2630] mb-2">
            {post.title}
          </h3>
          <p className="text-base text-gray-600 mb-2">{post.subtitle}</p>
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span>
              {t("By")} {post.writer}
            </span>
            <span>•</span>
            <span>{post.createdAt}</span>
            {post.readTime && (
              <>
                <span>•</span>
                <span>{post.readTime}</span>
              </>
            )}
          </div>
        </div>

        {/* Status and Category */}
        <div className="flex items-center gap-3">
          <span
            className={`px-3 py-1 rounded-full text-sm ${
              post.active
                ? "bg-green-100 text-green-800"
                : "bg-gray-100 text-gray-800"
            }`}
          >
            {post.active ? t("Active") : t("Inactive")}
          </span>
          <span
            className={`px-3 py-1 rounded-full text-sm ${
              post.status === "Published"
                ? "bg-blue-100 text-blue-800"
                : "bg-yellow-100 text-yellow-800"
            }`}
          >
            {t(post.status)}
          </span>
          <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">
            {post.category}
          </span>
        </div>

        {/* Excerpt */}
        <div>
          <h4 className="font-medium text-[#1D2630] mb-3">{t("Excerpt")}</h4>
          <p className="text-gray-600 leading-relaxed">{post.excerpt}</p>
        </div>

        {/* Statistics */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-medium text-[#1D2630] mb-3">{t("Statistics")}</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {post.views}
              </div>
              <div className="text-sm text-gray-600">{t("Views")}</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {post.active ? "1" : "0"}
              </div>
              <div className="text-sm text-gray-600">{t("Active Status")}</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {post.tags ? post.tags.length : 0}
              </div>
              <div className="text-sm text-gray-600">{t("Tags")}</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {post.readTime ? post.readTime.split(" ")[0] : "0"}
              </div>
              <div className="text-sm text-gray-600">{t("Minutes")}</div>
            </div>
          </div>
        </div>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div>
            <h4 className="font-medium text-[#1D2630] mb-3">{t("Tags")}</h4>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-blue-50 text-blue-700 rounded-md text-sm"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Metadata */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-medium text-[#1D2630] mb-3">{t("Metadata")}</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">{t("Post ID")}: </span>
              <span className="font-medium">#{post.id}</span>
            </div>
            <div>
              <span className="text-gray-600">{t("Category")}: </span>
              <span className="font-medium">{post.category}</span>
            </div>
            <div>
              <span className="text-gray-600">{t("Created Date")}: </span>
              <span className="font-medium">{post.createdAt}</span>
            </div>
            <div>
              <span className="text-gray-600">{t("Last Updated")}: </span>
              <span className="font-medium">{post.updatedAt}</span>
            </div>
            <div>
              <span className="text-gray-600">{t("Author")}: </span>
              <span className="font-medium">{post.writer}</span>
            </div>
            <div>
              <span className="text-gray-600">{t("Read Time")}: </span>
              <span className="font-medium">
                {post.readTime || t("Not specified")}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-3 mt-8 pt-6 border-t">
        <button
          onClick={onClose}
          className="px-6 py-2 text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
        >
          {t("Close")}
        </button>
        <button
          onClick={() => {
            onEdit(post.id);
            onClose();
          }}
          className="px-6 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-md transition-colors"
        >
          {t("Edit Post")}
        </button>
      </div>
    </div>
  );
}

export default PostDetails;
