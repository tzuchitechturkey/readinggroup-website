import React, { useState, useEffect, useRef } from "react";

import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { FiTrash2, FiPlusCircle } from "react-icons/fi";

import countries from "@/constants/countries.json";
import { GetProfile, UpdateProfile } from "@/api/auth";
import { setErrorFn } from "@/Utility/Global/setErrorFn";
import Loader from "@/components/Global/Loader/Loader";
import { BASE_URL } from "@/configs";

function EditProfile() {
  const { t, i18n } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef(null);
  const [profileImageFile, setProfileImageFile] = useState(null); // Store the actual file

  // State for form data
  const [formData, setFormData] = useState({
    profile_image: "",
    first_name: "",
    username: "",
    last_name: "",
    display_name: "",
    country: "",
    address_details: "",
    profession_name: "",
    email: "",
    mobile_number: "",
  });

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const GetProfileData = async () => {
    setIsLoading(true);
    try {
      const res = await GetProfile();
      const profileData = res?.data;
      setFormData(profileData);
    } catch (error) {
      setErrorFn(error, t);
    } finally {
      setIsLoading(false);
    }
  };

  // Load current profile data
  useEffect(() => {
    GetProfileData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const data = new FormData();

      // Add all form fields except profile_image
      Object.entries(formData).forEach(([key, value]) => {
        if (key !== "profile_image" && value !== null && value !== undefined) {
          data.append(key, value);
        }
      });

      // Only append profile_image if a new file was selected
      if (profileImageFile instanceof File) {
        data.append("profile_image", profileImageFile);
      } else if (profileImageFile === null && formData.profile_image === null) {
        // If profile_image was deleted, send empty file to clear it
        data.append("profile_image", "");
      }

      await UpdateProfile(data);
      toast.success(t("Updated Profile Successfully"));
    } catch (error) {
      setErrorFn(error, t);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div
      className="w-full px-4 md:px-8 mt-4"
      dir={i18n?.language === "ar" ? "rtl" : "ltr"}
    >
      {isLoading && <Loader />}
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-[100px_minmax(0,1fr)] gap-6"
      >
        {/* Start Avatar */}
        <div className="flex items-start md:justify-start justify-center relative">
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            className="hidden"
            onChange={(e) => {
              const file = e.target.files[0];
              if (file) {
                const url = URL.createObjectURL(file);
                setProfileImageFile(file); // Store the actual file
                setFormData((prev) => ({ ...prev, profile_image: url }));
              }
            }}
          />
          <div className="flex flex-col items-center gap-3">
            <img
              src={
                profileImageFile
                  ? formData.profile_image
                  : formData.profile_image && formData.profile_image !== ""
                  ? `${BASE_URL}/${formData.profile_image}`
                  : "/fake-user.png"
              }
              alt="avatar"
              className="w-24 h-24 rounded-full object-cover shadow-md border-2 border-gray-200 cursor-pointer hover:scale-105 transition-transform"
              onClick={() => fileInputRef.current.click()}
              onError={(e) => {
                e.target.src = "/fake-user.png";
              }}
            />

            {profileImageFile || formData.profile_image ? (
              <button
                type="button"
                onClick={() => {
                  setProfileImageFile(null);
                  setFormData((prev) => ({ ...prev, profile_image: null }));
                }}
                className="w-28  flex items-center gap-2 text-red-600 bg-red-50 border border-red-200 px-2 py-2 rounded-lg text-xs font-medium hover:bg-red-100 transition-colors"
              >
                <FiTrash2 size={14} />
                {t("Delete image")}
              </button>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current.click()}
                className="w-28 flex items-center gap-2 text-green-600 bg-green-50 border border-green-200 px-2 py-2 rounded-lg text-sm font-medium hover:bg-green-100 transition-colors"
              >
                <FiPlusCircle size={16} />
                {t("Add image")}
              </button>
            )}
          </div>
        </div>
        {/* End Avatar */}

        {/* Start Form */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full min-w-0">
          {/* User Name */}
          <FormInput
            label={t("User Name")}
            name="username"
            placeholder="JohnDoe"
            value={formData.username}
            onChange={handleInputChange}
          />
          {/* First Name */}
          {/* <FormInput
            label={t("First Name")}
            name="first_name"
            placeholder="John"
            value={formData.first_name}
            onChange={handleInputChange}
          /> */}

          {/* Last Name */}
          {/* <FormInput
            label={t("Last Name")}
            name="last_name"
            placeholder="Smith"
            value={formData.last_name}
            onChange={handleInputChange}
          /> */}

          {/* Display Name */}
          <FormInput
            label={t("Display Name")}
            name="display_name"
            placeholder="JohnS"
            value={formData.display_name}
            onChange={handleInputChange}
          />

          {/* Profession */}
          <FormInput
            label={t("Profession")}
            name="profession_name"
            placeholder="Project Manager"
            value={formData.profession_name}
            onChange={handleInputChange}
          />

          {/* Start Country */}
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">
              {t("Country")}
            </label>
            <select
              name="country"
              value={formData.country}
              onChange={handleInputChange}
              className="w-full p-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option disabled hidden value="">
                {t("Select Country")}
              </option>
              {countries?.map((option) => (
                <option key={option.code} value={option.code}>
                  {t(option.name)}
                </option>
              ))}
            </select>
          </div>
          {/* End Country */}

          {/* Address Details */}
          <FormInput
            label={t("Address Details")}
            name="address_details"
            placeholder="123 Main St, City, State"
            value={formData.address_details}
            onChange={handleInputChange}
          />

          {/* Phone */}
          <FormInput
            label={t("Mobile Number")}
            name="mobile_number"
            type="number"
            placeholder="+1 1234567890"
            value={formData.mobile_number}
            onChange={handleInputChange}
          />

          {/* Email */}
          <FormInput
            label={t("Email")}
            name="email"
            type="email"
            placeholder="john@gmail.com"
            value={formData.email}
            onChange={handleInputChange}
          />

          {/* Submit Button */}
          <div className=" col-span-2 mt-6 ml-auto">
            <button
              type="submit"
              className={`w-44 ml-auto bg-[#4680FF] text-white rounded-full p-2 font-semibold px-7 transition-all duration-300 transform hover:bg-[#2563eb] hover:scale-105 shadow hover:shadow-lg`}
            >
              {t("Save Changes")}
            </button>
          </div>
        </div>
        {/* End Form */}
      </form>
    </div>
  );
}

export default EditProfile;

// Reusable dynamic input component to use anywhere inside the form
const FormInput = ({
  label,
  type = "text",
  placeholder = "",
  name,
  id,
  value,
  defaultValue,
  onChange,
  fullWidth = false,
  className = "",
  inputClassName = "",
  ...rest
}) => {
  const inputId = id || (name ? `input-${name}` : undefined);
  return (
    <div className={`${fullWidth ? "md:col-span-2" : ""} ${className}`}>
      {label && (
        <label htmlFor={inputId} className="block text-sm text-slate-500 mb-2">
          {label}
        </label>
      )}
      <input
        id={inputId}
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        defaultValue={defaultValue}
        onChange={onChange}
        className={`w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-lg text-slate-700 placeholder:text-[#9FA2AA] focus:outline-none focus:ring-2 focus:ring-slate-200 focus:border-slate-300 ${inputClassName}`}
        {...rest}
      />
    </div>
  );
};
