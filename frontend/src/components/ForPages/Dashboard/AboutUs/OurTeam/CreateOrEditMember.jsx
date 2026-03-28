import React, { useState, useEffect } from "react";

import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

import { CreateTeam, EditTeamById } from "@/api/team";
import { setErrorFn } from "@/Utility/Global/setErrorFn";
import Loader from "@/components/Global/Loader/Loader";

const CreateOrEditMember = ({ isOpen, onClose, member = null, setUpdate }) => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      if (member?.id) {
        setFormData({
          title: member.title,
          description: member.description,
        });
      } else {
        setFormData({
          title: "",
          description: "",
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

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = t("Title is required");
    }

    if (!formData.description.trim()) {
      newErrors.description = t("Description is required");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    // Prepare data for submission
    const submitData = new FormData();
    submitData.append("title", formData.title);

    submitData.append("description", formData.description);

    try {
      member?.id
        ? await EditTeamById(member.id, submitData)
        : await CreateTeam(submitData);

      toast.success(
        member?.id
          ? t("Member updated successfully")
          : t("Member created successfully"),
      );
      setUpdate((prev) => !prev);
      onClose();
    } catch (error) {
      setErrorFn(error, t);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;
  return (
    <div className="bg-white rounded-lg p-6 px-1 w-full   overflow-y-auto">
      {isLoading && <Loader />}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Start Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t("Name")} *
          </label>
          <input
            type="text"
            name="title"
            placeholder={t("Enter full name")}
            value={formData.title}
            onChange={handleInputChange}
            className={`w-full p-3 border rounded-lg outline-none ${
              errors.title ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.title && (
            <p className="text-red-500 text-xs mt-1">{errors.title}</p>
          )}
        </div>

        {/* Start Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t("Description")}
          </label>
          <textarea
            name="description"
            placeholder={t("Enter a brief description or bio")}
            value={formData.description}
            onChange={handleInputChange}
            rows={3}
            className="w-full p-3 border border-gray-300 rounded-lg  outline-none"
          />
        </div>
        {/* End Description */}
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
