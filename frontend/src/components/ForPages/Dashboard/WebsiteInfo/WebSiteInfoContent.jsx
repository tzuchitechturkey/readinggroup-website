import React, { useState, useEffect } from "react";

import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import {
  Edit2,
  Trash2,
  Plus,
  Save,
  X,
  Upload,
  Image as ImageIcon,
} from "lucide-react";

import {
  socialColors,
  socialMediaIcons,
  socialPlatforms,
} from "@/constants/constants";
import {
  GetWebSiteInfo,
  AddNavbar,
  EditNavbar,
  AddSocialMedia,
  EditSocialMedia,
  DeleteSocialMedia,
} from "@/api/info";
import { setErrorFn } from "@/Utility/Global/setErrorFn";

import CustomBreadcrumb from "../CustomBreadcrumb/CustomBreadcrumb";

function WebsiteInfoContent({ onSectionChange }) {
  const { t, i18n } = useTranslation();
  const [loading, setLoading] = useState(false);

  // Logo State
  const [logo, setLogo] = useState(null);
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [uploadingLogo, setUploadingLogo] = useState(false);

  // Social Media State
  const [socialLinks, setSocialLinks] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({ platform: "", url: "" });

  // Fetch website info (logo + social media)
  const fetchWebsiteInfo = async () => {
    try {
      setLoading(true);
      const response = await GetWebSiteInfo();
      const data = response.data;

      setLogo(data?.logo);
      setSocialLinks(data?.socialmedia || []);
    } catch (error) {
      setErrorFn(error, t);
    } finally {
      setLoading(false);
    }
  };

  // Handle logo file selection
  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast.error(t("Please select an image file"));
        return;
      }

      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        toast.error(t("Image size should not exceed 5MB"));
        return;
      }

      setLogoFile(file);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle logo upload
  const handleLogoUpload = async () => {
    if (!logoFile) {
      toast.error(t("Please select a logo image"));
      return;
    }

    try {
      setUploadingLogo(true);
      const formData = new FormData();
      formData.append("logo", logoFile);

      const response = await AddNavbar(formData);
      setLogo(response?.data);
      setLogoFile(null);
      setLogoPreview(null);
      toast.success(t("Logo uploaded successfully"));
    } catch (error) {
      setErrorFn(error, t);
      toast.error(t("Failed to upload logo"));
    } finally {
      setUploadingLogo(false);
    }
  };

  // Handle cancel logo upload
  const handleCancelLogo = () => {
    setLogoFile(null);
    setLogoPreview(null);
  };

  // Handle add social media link
  const handleAddSocial = async () => {
    if (!formData.platform || !formData.url) {
      toast.error(t("Please fill all fields"));
      return;
    }

    // Check for duplicate platform
    if (socialLinks?.some((link) => link.platform === formData.platform)) {
      toast.error(t("This social media platform is already added"));
      return;
    }

    // Validate URL format
    try {
      new URL(formData.url);
    } catch {
      toast.error(t("Invalid URL format"));
      return;
    }
    try {
      const response = await AddSocialMedia(formData);
      setSocialLinks([...socialLinks, response.data]);
      toast.success(t("Social link added successfully"));
      setFormData({ platform: "", url: "" });
      setIsAdding(false);
    } catch (error) {
      setErrorFn(error, t);
      toast.error(t("Failed to add social link"));
    }
  };

  // Handle update social media link
  const handleUpdateSocial = async (id) => {
    if (!formData.platform || !formData.url) {
      toast.error(t("Please fill all fields"));
      return;
    }

    // Check for duplicate platform (except current one)
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
      const response = await EditSocialMedia(id, formData);
      setSocialLinks(
        socialLinks?.map((link) => (link.id === id ? response.data : link))
      );
      toast.success(t("Social link updated successfully"));
      setEditingId(null);
      setFormData({ platform: "", url: "" });
    } catch (error) {
      setErrorFn(error, t);
      toast.error(t("Failed to update social link"));
    }
  };

  // Handle delete social media link
  const handleDeleteSocial = async (id) => {
    try {
      await DeleteSocialMedia(id);
      setSocialLinks(socialLinks?.filter((link) => link.id !== id));
      toast.success(t("Social link deleted successfully"));
      setDeletingId(null);
    } catch (error) {
      setErrorFn(error, t);
      toast.error(t("Failed to delete social link"));
    }
  };

  // Handle edit social media link
  const handleEditSocial = (link) => {
    setEditingId(link.id);
    setFormData({ platform: link.platform, url: link.url });
  };

  // Handle cancel edit/add
  const handleCancel = () => {
    setEditingId(null);
    setIsAdding(false);
    setFormData({ platform: "", url: "" });
  };

  // Get available platforms (filter already used ones)
  const getAvailablePlatforms = () => {
    return socialPlatforms.filter((platform) => {
      const isUsed = socialLinks?.some((link) => link.platform === platform);
      const isCurrentEditingPlatform =
        editingId && formData.platform === platform;
      return !isUsed || isCurrentEditingPlatform;
    });
  };

  useEffect(() => {
    fetchWebsiteInfo();
  }, []);
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div
      className="w-full space-y-8"
      dir={i18n?.language === "ar" ? "rtl" : "ltr"}
    >
      {/* Breadcrumb */}
      <CustomBreadcrumb
        backTitle={t("Back to Dashboard")}
        onBack={() => {
          onSectionChange("dashboard");
        }}
        page={t("Website Information")}
      />

      {/* Logo Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-medium text-[#1D2630]">
              {t("Website Logo")}
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              {t("Upload and manage your website logo")}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Current Logo Display */}
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">
              {t("Current Logo")}
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 flex items-center justify-center bg-gray-50">
              {logo ? (
                <img
                  src={logo?.logo}
                  alt="Website Logo"
                  className="max-h-32 object-contain"
                />
              ) : (
                <div className="text-center">
                  <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-500">
                    {t("No logo uploaded yet")}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Upload New Logo */}
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">
              {t("Upload New Logo")}
            </label>

            {logoPreview ? (
              <div className="space-y-4">
                <div className="border-2 border-dashed border-blue-300 rounded-lg p-8 flex items-center justify-center bg-blue-50">
                  <img
                    src={logoPreview}
                    alt="Logo Preview"
                    className="max-h-32 object-contain"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleLogoUpload}
                    disabled={uploadingLogo}
                    className="flex-1 flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Save size={18} />
                    {uploadingLogo ? t("Uploading...") : t("Save Logo")}
                  </button>
                  <button
                    onClick={handleCancelLogo}
                    disabled={uploadingLogo}
                    className="flex-1 flex items-center justify-center gap-2 bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <X size={18} />
                    {t("Cancel")}
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <label
                  htmlFor="logo-upload"
                  className="cursor-pointer flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-8 hover:border-primary hover:bg-gray-50 transition-colors"
                >
                  <Upload className="h-12 w-12 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-600 mb-1">
                    {t("Click to upload logo")}
                  </p>
                  <p className="text-xs text-gray-500">
                    {t("PNG, JPG, SVG (max 5MB)")}
                  </p>
                </label>
                <input
                  id="logo-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleLogoChange}
                  className="hidden"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Social Media Section */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-medium text-[#1D2630]">
              {t("Social Media")}
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
            {!isAdding && editingId === null && (
              <button
                onClick={() => setIsAdding(true)}
                className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors font-medium"
              >
                <Plus size={20} />
                {t("Add Social Link")}
              </button>
            )}
          </div>
        </div>

        {/* Add/Edit Form */}
        {(isAdding || editingId) && (
          <div className="mb-6 p-6 bg-blue-50 rounded-lg border border-blue-200">
            <h3 className="text-lg font-bold mb-4 text-gray-900">
              {editingId ? t("Edit Social Link") : t("Add New Social Link")}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
              {/* Platform Select */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t("Platform")} *
                </label>
                <select
                  value={formData.platform}
                  onChange={(e) =>
                    setFormData({ ...formData, platform: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                >
                  <option disabled hidden value="">
                    {t("Select a platform")}
                  </option>
                  {getAvailablePlatforms().map((platform) => (
                    <option key={platform} value={platform}>
                      {platform}
                    </option>
                  ))}
                </select>
              </div>

              {/* URL Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t("URL")} *
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
                    editingId
                      ? handleUpdateSocial(editingId)
                      : handleAddSocial()
                  }
                  className="flex-1 flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors font-medium"
                >
                  <Save size={18} />
                  {t("Save")}
                </button>
                <button
                  onClick={handleCancel}
                  className="flex-1 flex items-center justify-center gap-2 bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500 transition-colors font-medium"
                >
                  <X size={18} />
                  {t("Cancel")}
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
                {t("No social links added yet")}
              </p>
              <p className="text-gray-500 text-sm">
                {t(
                  "Click the button above to add your first social media link"
                )}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {socialLinks?.map((link) => {
                const name = link?.platform.toLowerCase();
                const Icon = socialMediaIcons[name];
                if (!Icon) return null;

                return (
                  <div
                    key={link.id}
                    className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow"
                  >
                    {/* Platform Badge */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <Icon size={20} color={socialColors[name]} />
                        <span className="inline-block bg-primary/10 py-2 rounded-full text-sm font-semibold">
                          {link.platform}
                        </span>
                      </div>
                      {/* Actions */}
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditSocial(link)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title={t("Edit")}
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => setDeletingId(link.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title={t("Delete")}
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
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
              })}
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {Boolean(deletingId) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold mb-2 text-gray-900">
              {t("Delete Social Link")}
            </h3>
            <p className="text-gray-600 mb-4">
              {t("Are you sure you want to delete this social media link?")}
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
                {t("Cancel")}
              </button>
              <button
                onClick={() => handleDeleteSocial(deletingId)}
                className="px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors font-medium"
              >
                {t("Delete")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default WebsiteInfoContent;
