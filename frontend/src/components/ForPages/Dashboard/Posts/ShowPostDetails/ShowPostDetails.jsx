import React from "react";

import { Calendar, Clock, User, Tag, FileText, Eye, Edit3 } from "lucide-react";
import { useTranslation } from "react-i18next";

function PostDetails({ post, onClose, onEdit }) {
  const { t } = useTranslation();

  if (!post) return null;

  const formatDate = (dateString) => {
    if (!dateString) return t("Not published yet");
    const date = new Date(dateString);
    return (
      date.toLocaleDateString() +
      " " +
      date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    );
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "published":
        return "bg-green-100 text-green-800";
      case "draft":
        return "bg-yellow-100 text-yellow-800";
      case "archived":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-blue-100 text-blue-800";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "published":
        return t("Published");
      case "draft":
        return t("Draft");
      case "archived":
        return t("Archived");
      default:
        return t(status);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="space-y-6">
        {/* Header Section with Writer Info */}
        <div className="flex items-start gap-4">
          {post.writer_avatar && (
            <img
              src={post.writer_avatar}
              alt={post.writer}
              className="w-12 h-12 rounded-full object-cover bg-gray-100"
              onError={(e) => {
                e.target.src = "/blur-weekly-images.png";
              }}
            />
          )}
          <div className="flex-1">
            <h3 className="text-2xl font-bold text-[#1D2630] mb-2 leading-tight">
              {post.title}
            </h3>
            {post.subtitle && (
              <p className="text-lg text-gray-600 mb-3">{post.subtitle}</p>
            )}
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <User className="w-4 h-4" />
                <span>
                  {t("By")} {post.writer?.name || t("Unknown Writer")}
                </span>
              </div>
              {post.read_time && (
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{post.read_time}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Status and Category */}
        <div className="flex items-center gap-3 flex-wrap">
          <span
            className={`px-3 py-1.5 rounded-full text-sm font-medium ${
              post.is_active
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {post.is_active ? t("Active") : t("Inactive")}
          </span>
          <span
            className={`px-3 py-1.5 rounded-full text-sm font-medium ${getStatusColor(
              post.status
            )}`}
          >
            {getStatusText(post.status)}
          </span>
          {post.category?.id && (
            <span className="bg-purple-100 text-purple-800 px-3 py-1.5 rounded-full text-sm font-medium">
              {post.category?.name}
            </span>
          )}
        </div>

        {/* Excerpt */}
        {post.excerpt && (
          <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
            <h4 className="font-semibold text-[#1D2630] mb-2 flex items-center gap-2">
              <FileText className="w-4 h-4" />
              {t("Excerpt")}
            </h4>
            <p className="text-gray-700 leading-relaxed">{post.excerpt}</p>
          </div>
        )}

        {/* Body Content Preview */}
        {post.body && (
          <div>
            <h4 className="font-semibold text-[#1D2630] mb-3 flex items-center gap-2">
              <Edit3 className="w-4 h-4" />
              {t("Content Preview")}
            </h4>
            <div className="bg-gray-50 p-4 rounded-lg max-h-40 overflow-y-auto">
              <p className="text-gray-700 leading-relaxed text-sm">
                {post.body.length > 300
                  ? post.body.substring(0, 300) + "..."
                  : post.body}
              </p>
            </div>
          </div>
        )}

        {/* Statistics */}
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-5 rounded-lg">
          <h4 className="font-semibold text-[#1D2630] mb-4 flex items-center gap-2">
            <Eye className="w-4 h-4" />
            {t("Post Statistics")}
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center bg-white p-3 rounded-lg shadow-sm">
              <div className="text-2xl font-bold text-blue-600">
                {post.status === "published" ? "📝" : "✏️"}
              </div>
              <div className="text-sm text-gray-600 mt-1">{t("Status")}</div>
              <div className="text-xs font-medium">
                {getStatusText(post.status)}
              </div>
            </div>
            <div className="text-center bg-white p-3 rounded-lg shadow-sm">
              <div className="text-2xl font-bold text-green-600">
                {post.is_active ? "✅" : "❌"}
              </div>
              <div className="text-sm text-gray-600 mt-1">{t("Active")}</div>
              <div className="text-xs font-medium">
                {post.is_active ? t("Yes") : t("No")}
              </div>
            </div>
            <div className="text-center bg-white p-3 rounded-lg shadow-sm">
              <div className="text-2xl font-bold text-purple-600">
                {post.tags ? post.tags.length : 0}
              </div>
              <div className="text-sm text-gray-600 mt-1">{t("Tags")}</div>
            </div>
            <div className="text-center bg-white p-3 rounded-lg shadow-sm">
              <div className="text-2xl font-bold text-orange-600">
                {post.read_time ? post.read_time.split(" ")[0] : "0"}
              </div>
              <div className="text-sm text-gray-600 mt-1">{t("Read Time")}</div>
            </div>
          </div>
        </div>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div>
            <h4 className="font-semibold text-[#1D2630] mb-3 flex items-center gap-2">
              <Tag className="w-4 h-4" />
              {t("Tags")}
            </h4>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium border border-blue-200 hover:bg-blue-100 transition-colors"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Metadata */}
        <div className="bg-gray-50 p-5 rounded-lg">
          <h4 className="font-semibold text-[#1D2630] mb-4">
            {t("Post Information")}
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            {post.id && (
              <div className="flex justify-between">
                <span className="text-gray-600">{t("Post ID")}:</span>
                <span className="font-medium">#{post.id}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-gray-600">{t("Category")}:</span>
              <span className="font-medium">
                {post.category?.name || t("Uncategorized")}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">{t("Status")}:</span>
              <span className="font-medium">{getStatusText(post.status)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">{t("Active")}:</span>
              <span className="font-medium">
                {post.is_active ? t("Yes") : t("No")}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">{t("Writer")}:</span>
              <span className="font-medium">
                {post.writer?.name || t("Unknown")}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">{t("Read Time")}:</span>
              <span className="font-medium">
                {post.read_time || t("Not specified")}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-600">{t("Content Length")}:</span>
              <span className="font-medium">
                {post.body
                  ? `${post.body.length} ${t("characters")}`
                  : t("No content")}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-3 mt-8 pt-6 border-t">
        <button
          onClick={onClose}
          className="px-6 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
        >
          {t("Close")}
        </button>
        <button
          onClick={() => {
            onEdit(post.id || post);
            onClose();
          }}
          className="px-6 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors flex items-center gap-2"
        >
          <Edit3 className="w-4 h-4" />
          {t("Edit Post")}
        </button>
      </div>
    </div>
  );
}

export default PostDetails;
