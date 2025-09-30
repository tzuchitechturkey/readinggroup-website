import React, { useState, useEffect } from "react";

import { Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";

const MemberModal = ({
  isOpen,
  onClose,
  onSave,
  member = null,
  isEditing = false,
}) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    userName: "",
    position: "",
    description: "",
    career: "",
    avatar: "",
    social: [{ name: "", url: "" }],
  });

  // Reset form when modal opens/closes or member changes
  useEffect(() => {
    if (isOpen) {
      if (member && isEditing) {
        setFormData({ ...member });
      } else {
        setFormData({
          userName: "",
          position: "",
          description: "",
          career: "",
          avatar: "",
          social: [{ name: "", url: "" }],
        });
      }
    }
  }, [isOpen, member, isEditing]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSocialChange = (index, field, value) => {
    const newSocial = [...formData.social];
    newSocial[index] = { ...newSocial[index], [field]: value };
    setFormData((prev) => ({
      ...prev,
      social: newSocial,
    }));
  };

  const addSocialField = () => {
    setFormData((prev) => ({
      ...prev,
      social: [...prev.social, { name: "", url: "" }],
    }));
  };

  const removeSocialField = (index) => {
    if (formData.social.length > 1) {
      const newSocial = formData.social.filter((_, i) => i !== index);
      setFormData((prev) => ({
        ...prev,
        social: newSocial,
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Filter out empty social entries
    const cleanedFormData = {
      ...formData,
      social: formData.social.filter((s) => s.name && s.url),
    };
    onSave(cleanedFormData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="bg-white rounded-lg p-6 w-full   overflow-y-auto">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Start UserName */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t("User Name")}
          </label>
          <input
            type="text"
            name="userName"
            value={formData.userName}
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

        {/* Start Job */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t("Job")}
          </label>
          <input
            type="text"
            name="career"
            value={formData.career}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-lg  outline-none"
            required
          />
        </div>
        {/* End Job */}
        {/* Start Avatar */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t("Avatar URL")}
          </label>
          <input
            type="url"
            name="avatar"
            value={formData.avatar}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-lg  outline-none"
            required
          />
        </div>
        {/* End Avatar */}
        {/* Start Social Media */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t("Social Media")}
          </label>

          {formData.social.map((social, index) => (
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

              {formData.social.length > 1 && (
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
            {isEditing ? t("Save Changes") : t("Add Member")}
          </button>
        </div>
      </form>
    </div>
  );
};

export default MemberModal;
