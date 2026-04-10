import React, { useState, useEffect, useRef } from "react";

import { useTranslation } from "react-i18next";
import { DescriptionSection } from "./DescriptionSection";

import { CreateTeam, EditTeamById } from "@/api/team";
import { setErrorFn } from "@/Utility/Global/setErrorFn";
import Loader from "@/components/Global/Loader/Loader";
import { toast } from "react-toastify";

const COUNTRY_OPTIONS = ["Kaohsiung", "Cross-Region", "Transnational"];

const CountryAutocomplete = ({ value, onChange, t }) => {
  const [inputValue, setInputValue] = useState(value || "");
  const [isOpen, setIsOpen] = useState(false);
  const [filtered, setFiltered] = useState(COUNTRY_OPTIONS);
  const containerRef = useRef(null);

  useEffect(() => {
    setInputValue(value || "");
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleInput = (e) => {
    const val = e.target.value;
    setInputValue(val);
    onChange(val);
    setFiltered(
      COUNTRY_OPTIONS.filter((o) =>
        o.toLowerCase().includes(val.toLowerCase()),
      ),
    );
    setIsOpen(true);
  };

  const handleSelect = (option) => {
    setInputValue(option);
    onChange(option);
    setIsOpen(false);
  };

  // Show "Add new" option when typed value is non-empty and not in list
  const showAddNew =
    inputValue.trim() &&
    !COUNTRY_OPTIONS.some(
      (o) => o.toLowerCase() === inputValue.trim().toLowerCase(),
    );

  return (
    <div ref={containerRef} className="relative">
      <input
        type="text"
        value={inputValue}
        onChange={handleInput}
        onFocus={() => setIsOpen(true)}
        placeholder={t("Enter country")}
        className="w-full p-3 border border-gray-300 rounded-lg outline-none"
      />
      {isOpen && (filtered.length > 0 || showAddNew) && (
        <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
          {filtered.map((option) => (
            <li
              key={option}
              onMouseDown={() => handleSelect(option)}
              className={`px-4 py-2 cursor-pointer hover:bg-gray-100 text-sm ${
                inputValue === option ? "bg-gray-50 font-medium" : ""
              }`}
            >
              {option}
            </li>
          ))}
          {showAddNew && (
            <li
              onMouseDown={() => handleSelect(inputValue.trim())}
              className="px-4 py-2 cursor-pointer hover:bg-blue-50 text-sm text-blue-600 border-t border-gray-100"
            >
              {t("Add")} &ldquo;{inputValue.trim()}&rdquo;
            </li>
          )}
        </ul>
      )}
    </div>
  );
};

const CreateOrEditMember = ({ isOpen, onClose, member = null, setUpdate }) => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    country: "",
    is_heart: false,
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      if (member?.id) {
        setFormData({
          title: member.title,
          description: member.description,
          country: member.country || "",
          is_heart: member.is_heart,
        });
      } else {
        setFormData({
          title: "",
          description: "",
          country: "",
          is_heart: false,
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

  // Handle description changes
  const handleDescriptionChange = (data) => {
    setFormData((prev) => ({
      ...prev,
      description: data,
    }));

    // Clear error if exists
    if (errors.description) {
      setErrors((prev) => ({
        ...prev,
        description: "",
      }));
    }
  };

  // Handle description blur
  const handleDescriptionBlur = () => {
    // Add validation logic if needed
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
    submitData.append("is_heart", formData.is_heart);
    submitData.append("description", formData.description);
    if (formData.country) {
      submitData.append("country", formData.country);
    }

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

        {/* Start Country */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t("Country")}
          </label>
          <CountryAutocomplete
            value={formData.country}
            onChange={(val) =>
              setFormData((prev) => ({ ...prev, country: val }))
            }
            t={t}
          />
        </div>
        {/* End Country */}

        {/* Start Description */}
        <DescriptionSection
          formData={formData}
          onBodyChange={handleDescriptionChange}
          onBodyBlur={handleDescriptionBlur}
          error={errors.description}
        />
        {/* End Description */}

        {/* Start Is Heart */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            name="is_heart"
            checked={formData.is_heart}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, is_heart: e.target.checked }))
            }
            className="h-4 w-4 text-primary border-gray-300 rounded"
          />
          <label className="text-sm text-gray-700">{t("Is Heart")}</label>
        </div>
        {/* End Is Heart */}
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
