import React, { useState, useEffect } from "react";

import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { Edit2, Trash2, Plus, Save, X } from "lucide-react";

import {
  socialColors,
  socialMediaIcons,
  socialPlatforms,
} from "@/constants/constants";
import {
  GetWebSiteInfo,
  AddWebSiteInfo,
  EditWebSiteInfo,
  DeleteWebSiteInfo,
} from "@/api/info";
import { setErrorFn } from "@/Utility/Global/setErrorFn";

import CustomBreadcrumb from "../../CustomBreadcrumb/CustomBreadcrumb";

function SocialMediaContent({ onSectionChange }) {
  const { t, i18n } = useTranslation();
  const [socialLinks, setSocialLinks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({ platform: "", url: "" });

  // محاكاة جلب البيانات من الباك - استبدلها بـ API الفعلي
  const fetchSocialLinks = async () => {
    try {
      setLoading(true);
      const response = await GetWebSiteInfo(100, 0);
      setSocialLinks(response.data?.results || []);
    } catch (error) {
      setErrorFn(error, t);
    } finally {
      setLoading(false);
    }
  };

  // التعامل مع إضافة رابط جديد
  const handleAdd = async () => {
    if (!formData.platform || !formData.url) {
      toast.error(t("Please fill all fields"));
      return;
    }

    // التحقق من وجود منصة مكررة
    if (socialLinks?.some((link) => link.platform === formData.platform)) {
      toast.error(t("This social media platform is already added"));
      return;
    }

    // التحقق من صيغة الـ URL
    try {
      new URL(formData.url);
    } catch {
      toast.error(t("Invalid URL format"));
      return;
    }

    try {
      const response = await AddWebSiteInfo(formData);
      setSocialLinks([...socialLinks, response.data]);
      toast.success(t("Social link added successfully"));
      setFormData({ platform: "", url: "" });
      setIsAdding(false);
    } catch (error) {
      toast.error(t("Failed to add social link"));
      console.error("Error adding social link:", error);
    }
  };

  // التعامل مع تعديل رابط
  const handleUpdate = async (id) => {
    if (!formData.platform || !formData.url) {
      toast.error(t("Please fill all fields"));
      return;
    }

    // التحقق من وجود منصة مكررة (ما عدا المنصة الحالية المراد تعديلها)
    if (
      socialLinks?.some(
        (link) => link.platform === formData.platform && link.id !== id
      )
    ) {
      toast.error(t("This social media platform is already added"));
      return;
    }

    try {
      new URL(formData.url);
    } catch {
      toast.error(t("Invalid URL format"));
      return;
    }

    try {
      const response = await EditWebSiteInfo(id, formData);
      setSocialLinks(
        socialLinks?.map((link) => (link.id === id ? response.data : link))
      );
      toast.success(t("Social link updated successfully"));
      setEditingId(null);
      setFormData({ platform: "", url: "" });
    } catch (error) {
      toast.error(t("Failed to update social link"));
      console.error("Error updating social link:", error);
    }
  };

  // التعامل مع حذف رابط
  const handleDelete = async (id) => {
    try {
      await DeleteWebSiteInfo(id);
      setSocialLinks(socialLinks?.filter((link) => link.id !== id));
      toast.success(t("Social link deleted successfully"));
      setDeletingId(null);
    } catch (error) {
      toast.error(t("Failed to delete social link"));
      console.error("Error deleting social link:", error);
    }
  };

  // التعامل مع فتح form للتعديل
  const handleEdit = (link) => {
    setEditingId(link.id);
    setFormData({ platform: link.platform, url: link.url });
  };

  // التعامل مع إلغاء التعديل
  const handleCancel = () => {
    setEditingId(null);
    setIsAdding(false);
    setFormData({ platform: "", url: "" });
  };

  // تصفية الأنظمة المستخدمة بالفعل
  const getAvailablePlatforms = () => {
    return socialPlatforms.filter((platform) => {
      // إذا كان هناك منصة مستخدمة بالفعل
      const isUsed = socialLinks?.some((link) => link.platform === platform);

      // إذا كان قيد التعديل والمنصة نفسها
      const isCurrentEditingPlatform =
        editingId && formData.platform === platform;

      // نسمح بالمنصة إذا لم تكن مستخدمة أو كانت هي المنصة الحالية تحت التعديل
      return !isUsed || isCurrentEditingPlatform;
    });
  };
  useEffect(() => {
    fetchSocialLinks();
  }, [t]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="w-full" dir={i18n?.language === "ar" ? "rtl" : "ltr"}>
      {/* Start Breadcrumb */}
      <CustomBreadcrumb
        backTitle={t("Back to Dashboard")}
        onBack={() => {
          onSectionChange("dashboard");
        }}
        page={t("Social Media")}
      />
      {/* End Breadcrumb */}
      {/* Start Header */}
      <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b bg-white rounded-lg mb-6">
        <div>
          <h2 className="text-lg font-medium text-[#1D2630]">
            {t("Manage Social Media")}
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            {t(
              "Add, edit, and remove social media links for your organization"
            )}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">
            {t("Total")}: {socialLinks?.length} {t("link")}
          </span>
          {/* Start Add Button */}
          {!isAdding && editingId === null && (
            <button
              onClick={() => setIsAdding(true)}
              className=" flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors font-medium"
            >
              <Plus size={20} />
              {t("Add Social Link", { defaultValue: "Add Social Link" })}
            </button>
          )}
          {/* End Add Button */}
        </div>
      </div>
      {/* End Header */}

      {/* Add/Edit Form */}
      {(isAdding || editingId) && (
        <div className="mb-8 p-6 bg-blue-50 rounded-lg border border-blue-200">
          <h2 className="text-xl font-bold mb-4 text-gray-900">
            {editingId
              ? t("Edit Social Link", { defaultValue: "Edit Social Link" })
              : t("Add New Social Link", {
                  defaultValue: "Add New Social Link",
                })}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            {/* Platform Select */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t("Platform", { defaultValue: "Platform" })} *
              </label>
              <select
                value={formData.platform}
                onChange={(e) =>
                  setFormData({ ...formData, platform: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
              >
                <option disabled hidden value="">
                  {t("Select a platform", {
                    defaultValue: "Select a platform",
                  })}
                </option>
                {getAvailablePlatforms().map((platform) => (
                  <option key={platform} value={platform}>
                    {t(platform)}
                  </option>
                ))}
              </select>
            </div>

            {/* URL Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t("URL", { defaultValue: "URL" })} *
              </label>
              <input
                type="url"
                value={formData.url}
                onChange={(e) =>
                  setFormData({ ...formData, url: e.target.value })
                }
                placeholder="https://example.com/profile"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <button
                onClick={() =>
                  editingId ? handleUpdate(editingId) : handleAdd()
                }
                className="flex-1 flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors font-medium"
              >
                <Save size={18} />
                {t("Save", { defaultValue: "Save" })}
              </button>
              <button
                onClick={handleCancel}
                className="flex-1 flex items-center justify-center gap-2 bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500 transition-colors font-medium"
              >
                <X size={18} />
                {t("Cancel", { defaultValue: "Cancel" })}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Social Links List */}
      <div>
        {socialLinks?.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-gray-600 text-lg mb-4">
              {t("No social links added yet", {
                defaultValue: "No social links added yet",
              })}
            </p>
            <p className="text-gray-500 text-sm">
              {t("Click the button above to add your first social media link", {
                defaultValue:
                  "Click the button above to add your first social media link",
              })}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {socialLinks?.map((link) => {
              {
                const name = link?.platform.toLowerCase();
                const Icon = socialMediaIcons[name];
                if (!Icon) return null;

                return (
                  <div
                    key={link.id}
                    className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow"
                  >
                    {/* Platform Badge */}
                    <div className="flex items-center justify-between  mb-4">
                      <div className="flex items-center  mb-4 gap-3">
                        <Icon size={20} color={socialColors[name]} />
                        <span className="inline-block bg-primary/10  py-2 rounded-full text-sm font-semibold">
                          {t(link.platform)}
                        </span>
                      </div>
                      {/* Start Actions */}
                      <div className="flex gap-2 ">
                        <button
                          onClick={() => handleEdit(link)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title={t("Edit", { defaultValue: "Edit" })}
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => setDeletingId(link.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title={t("Delete", { defaultValue: "Delete" })}
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                      {/* End Actions */}
                    </div>

                    {/* URL Link */}
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline text-sm break-all"
                    >
                      {link.url}
                    </a>
                  </div>
                );
              }
            })}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {Boolean(deletingId) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold mb-2 text-gray-900">
              {t("Delete Social Link", { defaultValue: "Delete Social Link" })}
            </h3>
            <p className="text-gray-600 mb-4">
              {t("Are you sure you want to delete this social media link?", {
                defaultValue:
                  "Are you sure you want to delete this social media link?",
              })}
            </p>
            <div className="bg-gray-100 p-3 rounded-lg my-4 max-h-24 overflow-y-auto">
              <p className="text-sm text-gray-700 break-all">
                {socialLinks?.find((link) => link.id === deletingId)?.url}
              </p>
            </div>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setDeletingId(null)}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors font-medium"
              >
                {t("Cancel", { defaultValue: "Cancel" })}
              </button>
              <button
                onClick={() => handleDelete(deletingId)}
                className="px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors font-medium"
              >
                {t("Delete", { defaultValue: "Delete" })}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SocialMediaContent;
