import React, { useState, useEffect, useRef } from "react";

import { Trash2, X, Tag, Search } from "lucide-react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

import { CreateTeam, EditTeamById, GetPositions } from "@/api/aboutUs";
import { setErrorFn } from "@/Utility/Global/setErrorFn";
import Loader from "@/components/Global/Loader/Loader";
import { socialPlatforms } from "@/constants/constants";

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
  const [positionsList, setPositionsList] = useState([]);
  const [showPositionDropdown, setShowPositionDropdown] = useState(false);
  const positionDropdownRef = useRef(null);
  const [positionSearchValue, setPositionSearchValue] = useState("");

  const [errors, setErrors] = useState({});
  // Reset form when modal opens/closes or member changes

  const getPositions = async (searchVal) => {
    try {
      const res = await GetPositions(10, 0, searchVal);
      setPositionsList(res?.data?.results || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (isOpen) {
      if (member?.id) {
        setFormData({
          name: member.name,
          position: member.position,
          description: member.description,
          job_title: member.job_title,
          avatar: member.avatar,
          avatar_url: member.avatar,
          social_links: member.social_links || [],
        });
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

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
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

      // Clear avatar error if exists
      if (errors.avatar) {
        setErrors((prev) => ({
          ...prev,
          avatar: "",
        }));
      }
    }
  };

  // Handle position selection
  const handlePositionSelect = (position) => {
    setFormData((prev) => ({
      ...prev,
      position: position.id,
    }));
    setShowPositionDropdown(false);
    setPositionSearchValue("");

    // Clear position error if exists
    if (errors.position) {
      setErrors((prev) => ({
        ...prev,
        position: "",
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

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = t("Name is required");
    }

    if (!formData.position) {
      newErrors.position = t("Position is required");
    }
    if (!formData.job_title.trim()) {
      newErrors.job_title = t("Job title is required");
    }

    if (!formData.avatar && !member?.id) {
      newErrors.avatar = t("Avatar is required");
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
    submitData.append("name", formData.name);
    submitData.append("position", formData.position?.id || formData.position);
    submitData.append("description", formData.description);
    submitData.append("job_title", formData.job_title);

    if (formData.avatar instanceof File) {
      submitData.append("avatar", formData.avatar);
    }

    // Add social media data
    const cleanedSocial = formData.social_links.filter((s) => s.name && s.url);
    submitData.append("social_links", JSON.stringify(cleanedSocial));
    try {
      member?.id
        ? await EditTeamById(member.id, submitData)
        : await CreateTeam(submitData);

      toast.success(
        member?.id
          ? t("Member updated successfully")
          : t("Member created successfully")
      );
      setUpdate((prev) => !prev);
      onClose();
    } catch (error) {
      setErrorFn(error, t);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getPositions();
  }, []);
  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Close writer dropdown if clicked outside

      // Close position dropdown if clicked outside
      if (
        positionDropdownRef.current &&
        !positionDropdownRef.current.contains(event.target)
      ) {
        setShowPositionDropdown(false);
      }
    };

    // Add event listener
    document.addEventListener("mousedown", handleClickOutside);

    // Cleanup
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
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
            name="name"
            placeholder={t("Enter full name")}
            value={formData.name}
            onChange={handleInputChange}
            className={`w-full p-3 border rounded-lg outline-none ${
              errors.name ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.name && (
            <p className="text-red-500 text-xs mt-1">{errors.name}</p>
          )}
        </div>

        {/* Start Position */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {t("Position")} *
          </label>
          <div className="relative" ref={positionDropdownRef}>
            <button
              type="button"
              onClick={() => setShowPositionDropdown(!showPositionDropdown)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-left flex items-center gap-3 ${
                errors.position ? "border-red-500" : "border-gray-300"
              }`}
            >
              {formData?.position ? (
                <>
                  <Tag className="w-5 h-5 text-blue-600" />
                  <div className="flex-1">
                    <div className="font-medium text-sm">
                      {positionsList.find(
                        (pos) =>
                          pos.id ===
                          (formData.position?.id || formData.position)
                      )?.name || t("Select Position")}
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <Tag className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-500">{t("Select Position")}</span>
                </>
              )}
            </button>

            {showPositionDropdown && (
              <div className="absolute top-full left-0 right-0 z-10 mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-80 overflow-hidden">
                {/* Search Box */}
                <div className="p-3 border-b border-gray-200 bg-gray-50">
                  <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <input
                        type="text"
                        value={positionSearchValue}
                        onChange={(e) => setPositionSearchValue(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            getCategories(positionSearchValue);
                          }
                        }}
                        placeholder={t("Search positions...")}
                        className="w-full px-3 py-1.5 pr-8 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      />
                      {positionSearchValue && (
                        <button
                          type="button"
                          onClick={() => {
                            setPositionSearchValue("");
                            getPositions("");
                          }}
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        getPositions(positionSearchValue);
                      }}
                      className="p-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                      title={t("Search")}
                    >
                      <Search className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Categories List */}
                <div className="max-h-60 overflow-y-auto">
                  {positionsList.length > 0 ? (
                    positionsList.map((position) => (
                      <button
                        key={position.id}
                        type="button"
                        onClick={() => handlePositionSelect(position)}
                        className="w-full px-3 py-2 text-left hover:bg-gray-50 flex items-center gap-3"
                      >
                        <Tag className="w-5 h-5 text-blue-600" />
                        <div className="flex-1">
                          <div className="font-medium text-sm">
                            {position.name}
                          </div>
                          {position.description && (
                            <div className="text-xs text-gray-500">
                              {position.description}
                            </div>
                          )}
                        </div>
                      </button>
                    ))
                  ) : (
                    <div className="px-3 py-4 text-center text-gray-500 text-sm">
                      {t("No categories found")}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
          {errors.position && (
            <p className="text-red-500 text-xs mt-1">{errors.position}</p>
          )}
        </div>
        {/* End Position */}
        {/* Start Job Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t("Job Title")} *
          </label>
          <input
            type="text"
            name="job_title"
            value={formData.job_title}
            onChange={handleInputChange}
            placeholder={t("Developer, Manager, etc")}
            className={`w-full p-3 border border-gray-300 rounded-lg  outline-none ${
              errors.job_title ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.job_title && (
            <p className="text-red-500 text-xs mt-1">{errors.job_title}</p>
          )}
        </div>
        {/* End Job Title */}
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
            className={`w-full p-3 border rounded-lg outline-none ${
              errors.avatar ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.avatar && (
            <p className="text-red-500 text-xs mt-1">{errors.avatar}</p>
          )}
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
              <select
                value={social.name || ""}
                onChange={(e) =>
                  handleSocialChange(index, "name", e.target.value)
                }
                className="w-1/2 p-2 border border-gray-300 rounded-lg outline-none placeholder:text-sm"
              >
                <option disabled hidden value="">
                  {t("platform")}
                </option>
                {socialPlatforms.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>

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
