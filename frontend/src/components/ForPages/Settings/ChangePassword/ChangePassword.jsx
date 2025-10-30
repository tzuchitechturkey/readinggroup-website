import React, { useState } from "react";

import { Eye, EyeOff } from "lucide-react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

import { setErrorFn } from "@/Utility/Global/setErrorFn";
import { ChangePassword as ChangePasswordAPI } from "@/api/auth";
import {
  getPasswordStrength,
  strengthColors,
  requirements,
} from "@/Utility/Profile/getPasswordStrength";

function ChangePassword({ userType }) {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [matchPasswords, set_matchPasswords] = useState(false);

  const passwordStrength = getPasswordStrength(formData.newPassword);

  // Password validation rules
  const validatePassword = (pw) => {
    const rules = [
      {
        regex: /.{8,}/,
        message: t("Minimum 8 characters long-the more, the better"),
      },
      { regex: /[a-z]/, message: t("At least one lowercase character") },
      { regex: /[A-Z]/, message: t("At least one uppercase character") },
      {
        regex: /[0-9\s\W]/,
        message: t("At least one number, symbol, or whitespace"),
      },
    ];
    return rules
      .filter((rule) => !rule.regex.test(pw))
      .map((rule) => rule.message);
  };

  const handleInputChange = (name, value) => {
    const newFormData = {
      ...formData,
      [name]: value,
    };

    setFormData(newFormData);

    // Clear errors when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }

    // Check if passwords match when either newPassword or confirmPassword changes
    if (name === "newPassword" || name === "confirmPassword") {
      const newPassword = name === "newPassword" ? value : formData.newPassword;
      const confirmPassword =
        name === "confirmPassword" ? value : formData.confirmPassword;

      if (newPassword && confirmPassword && newPassword === confirmPassword) {
        set_matchPasswords(true);
      } else {
        set_matchPasswords(false);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    const newErrors = {};

    if (!formData.currentPassword) {
      newErrors.currentPassword = t("Current password is required");
    }

    if (!formData.newPassword) {
      newErrors.newPassword = t("New password is required");
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = t("Confirm password is required");
    }

    // Check if passwords match
    if (
      formData.newPassword &&
      formData.confirmPassword &&
      formData.newPassword !== formData.confirmPassword
    ) {
      newErrors.confirmPassword = t("Passwords do not match");
    }

    // Validate new password strength
    const pwErrors = validatePassword(formData.newPassword);
    if (pwErrors.length > 0) {
      newErrors.newPassword = pwErrors.join("\n");
    }

    setErrors(newErrors);

    // If there are errors, don't submit
    if (Object.keys(newErrors).length > 0) {
      return;
    }

    setIsLoading(true);
    try {
      await ChangePasswordAPI({
        current_password: formData.currentPassword,
        new_password: formData.newPassword,
        confirm_password: formData.confirmPassword,
      });
      toast.success(t("Password changed successfully!"));

      // Reset form
      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      setErrorFn(err, t);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="w-full">
      <div className="max-w-3xl mx-[52px] p-6">
        <form
          onSubmit={handleSubmit}
          className={userType === "admin" ? "space-y-8 m-8" : "space-y-2 "}
        >
          <PasswordField
            label={t("Current Password")}
            name="currentPassword"
            value={formData.currentPassword}
            onChange={handleInputChange}
            error={errors.currentPassword}
            userType={userType}
          />
          <PasswordField
            label={t("New Password")}
            name="newPassword"
            value={formData.newPassword}
            onChange={handleInputChange}
            error={errors.newPassword}
            userType={userType}
            showStrength={true}
            passwordStrength={passwordStrength}
            isMatching={
              matchPasswords && formData.newPassword && formData.confirmPassword
            }
          />
          <PasswordField
            label={t("Confirm Password")}
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            error={errors.confirmPassword}
            userType={userType}
            isMatching={
              matchPasswords && formData.newPassword && formData.confirmPassword
            }
          />

          {/* Requirements */}
          <div className={userType === "admin" ? "m-8" : "mt-3"}>
            <h3 className="text-xl text-[#353535] font-semibold">
              {t("Password requirements")}
            </h3>
            <p className="text-sm text-slate-500 mt-1">
              {t("Ensure that these requirements are met")}:
            </p>
            <div className="flex flex-wrap gap-2 mt-4 mb-2">
              {requirements.map((req) => {
                const passed = req.test.test(formData.newPassword);
                return (
                  <div
                    key={req.key}
                    className={`flex items-center gap-1 px-3 py-1 rounded text-sm font-medium ${
                      passed
                        ? "bg-green-50 text-green-600"
                        : "bg-gray-100 text-gray-400"
                    }`}
                  >
                    {passed ? (
                      <svg
                        width="16"
                        height="16"
                        fill="none"
                        viewBox="0 0 16 16"
                      >
                        <circle cx="8" cy="8" r="8" fill="#22C55E" />
                        <path
                          d="M5 8.5l2 2 4-4"
                          stroke="#fff"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    ) : (
                      <svg
                        width="16"
                        height="16"
                        fill="none"
                        viewBox="0 0 16 16"
                      >
                        <circle cx="8" cy="8" r="8" fill="#D1D5DB" />
                        <path
                          d="M6 10l4-4M10 10L6 6"
                          stroke="#9CA3AF"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                        />
                      </svg>
                    )}
                    <span>{t(req.label)}</span>
                  </div>
                );
              })}
            </div>
          </div>
          {/* Submit Button */}
          <div className="col-span-2 mt-6 flex justify-end">
            <button
              type="submit"
              disabled={
                isLoading ||
                Object.keys(errors).length > 0 ||
                !formData.currentPassword ||
                !formData.newPassword ||
                !formData.confirmPassword ||
                !matchPasswords
              }
              className={`w-44 ml-auto bg-[#4680FF] text-white rounded-full p-2 font-semibold px-7 transition-all duration-300 transform hover:bg-[#2563eb] hover:scale-105 shadow hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100`}
            >
              {isLoading ? t("Saving...") : t("Save Changes")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ChangePassword;

const PasswordField = ({
  label,
  placeholder = "********",
  name,
  value = "",
  onChange,
  error,
  userType,
  showStrength = false,
  passwordStrength = 0,
  isMatching = false,
}) => {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);
  const id = `input-${name}`;

  const handleChange = (e) => {
    if (onChange) {
      onChange(name, e.target.value);
    }
  };

  // Get border color based on state
  const getBorderColor = () => {
    if (error) return "border-red-500";
    if (isMatching) return "border-green-500";
    return "border-slate-200";
  };

  // Get focus ring color based on state
  const getFocusColor = () => {
    if (error) return "focus:ring-red-500";
    if (isMatching) return "focus:ring-green-500";
    return "focus:ring-blue-500";
  };

  return (
    <div className="w-full">
      <label htmlFor={id} className="block text-xl text-[#5B6B79] mb-2">
        {label}
      </label>
      <div className={`relative ${userType === "admin" ? "mt-3" : "mt-1"}`}>
        <input
          id={id}
          name={name}
          type={visible ? "text" : "password"}
          placeholder={placeholder}
          value={value}
          onChange={handleChange}
          className={`w-full rounded-lg border ${getBorderColor()} bg-white px-4 py-3 pr-10 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 ${getFocusColor()} focus:border-transparent transition-colors duration-200`}
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          className="absolute inset-y-0 right-3 flex items-center text-slate-400 hover:text-slate-600"
          aria-label={visible ? "Hide password" : "Show password"}
        >
          {visible ? <EyeOff /> : <Eye />}
        </button>
      </div>

      {/* Password strength indicator */}
      {showStrength && value && (
        <div className="flex items-center gap-2 mt-2">
          <span className="text-xs text-gray-500">{t("Security level")}</span>
          <div className="flex gap-1">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className={`block w-6 h-2 rounded ${
                  passwordStrength > i
                    ? strengthColors[passwordStrength]
                    : "bg-gray-200"
                }`}
              />
            ))}
          </div>
        </div>
      )}

      {/* Success message for matching passwords */}
      {isMatching && name === "confirmPassword" && (
        <div className="flex items-center gap-2 text-xs text-green-600 mt-1">
          <svg width="14" height="14" fill="none" viewBox="0 0 16 16">
            <circle cx="8" cy="8" r="8" fill="#22C55E" />
            <path
              d="M5 8.5l2 2 4-4"
              stroke="#fff"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span>{t("Passwords match!")}</span>
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="text-xs text-red-500 mt-1 whitespace-pre-line">
          {error}
        </div>
      )}
    </div>
  );
};
