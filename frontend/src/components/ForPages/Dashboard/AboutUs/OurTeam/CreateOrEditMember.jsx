import React, { useState, useEffect } from "react";

import { Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

import { CreateTeam, EditTeamById } from "@/api/aboutUs";
import { setErrorFn } from "@/Utility/Global/setErrorFn";
import Loader from "@/components/Global/Loader/Loader";

const CreateOrEditMember = ({ isOpen, onClose, member = null, setUpdate }) => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    position: "",
    description: "",
    job_title: "",
    avatar: "",
    avatar_url: "",
    social_links: [{ name: "", url: "" }],
  });

  // Reset form when modal opens/closes or member changes
  useEffect(() => {
    if (isOpen) {
      if (member?.id) {
        setFormData({ ...member });
      } else {
        setFormData({
          name: "",
          position: "",
          description: "",
          job_title: "",
          avatar: "",
          avatar_url: "",
          social_links: [{ name: "", url: "" }],
        });
      }
    }
  }, [isOpen, member]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Store the file object for upload
      setFormData((prev) => ({
        ...prev,
        avatar: file,
        avatar_url: "", // Clear URL when file is selected
      }));
    }
  };

  const handleSocialChange = (index, field, value) => {
    const newSocial = [...formData.social_links];
    newSocial[index] = { ...newSocial[index], [field]: value };
    setFormData((prev) => ({
      ...prev,
      social_links: newSocial,
    }));
  };

  const addSocialField = () => {
    setFormData((prev) => ({
      ...prev,
      social_links: [...prev.social_links, { name: "", url: "" }],
    }));
  };

  const removeSocialField = (index) => {
    if (formData.social_links.length > 1) {
      const newSocial = formData.social_links.filter((_, i) => i !== index);
      setFormData((prev) => ({
        ...prev,
        social_links: newSocial,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Prepare data for submission
      const hasFileUpload = formData.avatar instanceof File;

      if (hasFileUpload) {
        // Use FormData for file upload
        const submitData = new FormData();
        submitData.append("name", formData.name);
        submitData.append("position", formData.position);
        submitData.append("description", formData.description);
        submitData.append("job_title", formData.job_title);
        submitData.append("avatar", formData.avatar);

        // Add social media data
        const cleanedSocial = formData.social_links.filter(
          (s) => s.name && s.url
        );
        submitData.append("social_links", JSON.stringify(cleanedSocial));

        member?.id
          ? await EditTeamById(member.id, submitData)
          : await CreateTeam(submitData);
      } else {
        // Use regular JSON for URL-based avatar
        const cleanedFormData = {
          ...formData,
          social_links: formData.social_links.filter((s) => s.name && s.url),
          avatar: "", // Clear avatar file field when using URL
        };

        member?.id
          ? await EditTeamById(member.id, cleanedFormData)
          : await CreateTeam(cleanedFormData);
      }

      toast.success(
        member?.id
          ? t("Member updated successfully")
          : t("Member created successfully")
      );
      setUpdate((prev) => !prev);
      onClose();
    } catch (error) {
      setErrorFn(error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="bg-white rounded-lg p-6 w-full   overflow-y-auto">
      {isLoading && <Loader />}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Start Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t("Name")} *
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-lg  outline-none"
            required
          />
        </div>

        {/* Start Position */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t("Position")}
          </label>
          <input
            type="text"
            name="position"
            value={formData.position}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-lg  outline-none"
            required
          />
        </div>
        {/* End Position */}
        {/* Start Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t("Description")}
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows={3}
            className="w-full p-3 border border-gray-300 rounded-lg  outline-none"
            required
          />
        </div>

        {/* Start Job Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t("Job Title")}
          </label>
          <input
            type="text"
            name="job_title"
            value={formData.job_title}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-lg  outline-none"
          />
        </div>
        {/* End Job Title */}
        {/* Start Avatar Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t("Avatar")} *
          </label>
          <input
            type="file"
            name="avatar"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full p-3 border border-gray-300 rounded-lg outline-none"
            required={!member?.id} // Required for new members, optional for editing
          />
          {formData.avatar && typeof formData.avatar === "string" && (
            <div className="mt-2">
              <img
                src={formData.avatar}
                alt="Avatar preview"
                className="w-16 h-16 rounded-full object-cover"
              />
            </div>
          )}
        </div>
        {/* End Avatar Upload */}

        {/* Start Avatar URL (Alternative) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t("Avatar URL")}
          </label>
          <input
            type="url"
            name="avatar_url"
            value={formData.avatar_url}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-lg outline-none"
            placeholder={t("Enter image URL as alternative to file upload")}
          />
        </div>
        {/* End Avatar URL */}
        {/* Start Social Media */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t("Social Media")}
          </label>

          {formData.social_links.map((social, index) => (
            <div key={index} className="flex flex-col gap-2 mb-2 sm:flex-row">
              <input
                type="text"
                placeholder={t("Social Network Name (e.g., Facebook)")}
                value={social.name}
                onChange={(e) =>
                  handleSocialChange(index, "name", e.target.value)
                }
                className="w-1/2 p-2 border border-gray-300 rounded-lg  outline-none"
              />

              <input
                type="url"
                placeholder={t("Social Network URL")}
                value={social.url}
                onChange={(e) =>
                  handleSocialChange(index, "url", e.target.value)
                }
                className="w-full p-2 border border-gray-300 rounded-lg  outline-none"
              />

              {formData.social_links.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeSocialField(index)}
                  className="w-full sm:w-auto px-2 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              )}
            </div>
          ))}

          <button
            type="button"
            onClick={addSocialField}
            className="mt-2 w-full sm:w-auto px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
          >
            {t("Add Social Media Link")}
          </button>
        </div>

        {/* Start Actions */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            {t("Cancel")}
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-primary text-white hover:text-primary border-[1px] border-primary transition-all duration-200 rounded-lg hover:bg-white"
          >
            {member?.id ? t("Save Changes") : t("Add Member")}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateOrEditMember;
