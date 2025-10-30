import React, { useState } from "react";

import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

import { setErrorFn } from "@/Utility/Global/setErrorFn";
import { SetPasswordFirst } from "@/api/auth";
import {
  getPasswordStrength,
  strengthColors,
  requirements,
} from "@/Utility/Profile/getPasswordStrength";

function FirstLoginResetPasswordModal({ open, onClose }) {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showRetypePassword, setShowRetypePassword] = useState(false);
  const { t } = useTranslation();
  // Password requirements for UI

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [retypePassword, setRetypePassword] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const passwordStrength = getPasswordStrength(newPassword);

  if (!open) return null;

  // Password validation rules
  function validatePassword(pw) {
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
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const newErrors = {};
    if (!currentPassword)
      newErrors.currentPassword = t("Current password is required");
    if (!newPassword) newErrors.newPassword = t("New password is required");
    if (!retypePassword)
      newErrors.retypePassword = t("Re-type password is required");
    if (newPassword && retypePassword && newPassword !== retypePassword) {
      newErrors.retypePassword = t("Passwords do not match");
    }
    const pwErrors = validatePassword(newPassword);
    if (pwErrors.length > 0) newErrors.newPassword = pwErrors.join("\n");
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setLoading(true);
    try {
      await SetPasswordFirst({
        old_password: currentPassword,
        new_password1: newPassword,
        new_password2: retypePassword,
      });
      toast.success(t("Password changed successfully!"));
      onClose();
    } catch (error) {
      setErrorFn(error, t);
    } finally {
      ("");
      setLoading(false);
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 pt-0 w-full max-w-sm relative">
      <form onSubmit={handleSubmit}>
        {/* Start Current Password */}
        <div className="mb-4">
          <label className="block mb-2 text-sm font-medium">
            {t("Current password")}
          </label>
          <div className="relative mb-1">
            <input
              type={showCurrentPassword ? "text" : "password"}
              value={currentPassword}
              onChange={(e) => {
                setErrors((prev) => ({ ...prev, currentPassword: "" }));
                setCurrentPassword(e.target.value);
              }}
              className="outline-none rounded-lg border border-gray-300 focus:border-primary p-3 w-full text-sm pr-10"
              autoComplete="current-password"
              placeholder={t("Enter current password")}
            />
            <span
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer"
              onClick={() => setShowCurrentPassword((prev) => !prev)}
              tabIndex={0}
              role="button"
            >
              {showCurrentPassword ? (
                <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
                  <path
                    stroke="currentColor"
                    strokeWidth="2"
                    d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12Z"
                  />
                  <circle
                    cx="12"
                    cy="12"
                    r="3"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                </svg>
              ) : (
                <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
                  <path
                    stroke="currentColor"
                    strokeWidth="2"
                    d="M3 3l18 18M1 12s4-7 11-7c2.5 0 4.7.7 6.5 1.9M23 12s-4 7-11 7c-2.5 0-4.7-.7-6.5-1.9"
                  />
                  <circle
                    cx="12"
                    cy="12"
                    r="3"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                </svg>
              )}
            </span>
          </div>
          {errors.currentPassword && (
            <div className="text-xs text-red-500 mb-2">
              {errors.currentPassword}
            </div>
          )}
        </div>

        {/* End Current Password */}
        {/* Start New Password */}
        <div className="mb-4">
          <label className="block mb-2 text-sm font-medium">
            {t("New password")}
          </label>
          <div className="relative mb-1">
            <input
              type={showNewPassword ? "text" : "password"}
              value={newPassword}
              onChange={(e) => {
                setErrors((prev) => ({ ...prev, newPassword: "" }));
                setNewPassword(e.target.value);
              }}
              className="outline-none rounded-lg border border-gray-300 focus:border-primary p-3 w-full text-sm pr-10"
              autoComplete="new-password"
              placeholder={t("Enter new password")}
            />
            <span
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer"
              onClick={() => setShowNewPassword((prev) => !prev)}
              tabIndex={0}
              role="button"
            >
              {showNewPassword ? (
                <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
                  <path
                    stroke="currentColor"
                    strokeWidth="2"
                    d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12Z"
                  />
                  <circle
                    cx="12"
                    cy="12"
                    r="3"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                </svg>
              ) : (
                <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
                  <path
                    stroke="currentColor"
                    strokeWidth="2"
                    d="M3 3l18 18M1 12s4-7 11-7c2.5 0 4.7.7 6.5 1.9M23 12s-4 7-11 7c-2.5 0-4.7-.7-6.5-1.9"
                  />
                  <circle
                    cx="12"
                    cy="12"
                    r="3"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                </svg>
              )}
            </span>
          </div>
          {/* Security level bar */}
          {newPassword && (
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs text-gray-500">
                {t("Security level")}
              </span>
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

          {/* Password requirements icons */}
        </div>
        {/* End New Password */}
        {/*  Start Retype Password */}
        <div className="mb-4">
          <label className="block mb-2 text-sm font-medium">
            {t("Re-type password")}
          </label>
          <div className="relative mb-1">
            <input
              type={showRetypePassword ? "text" : "password"}
              value={retypePassword}
              onChange={(e) => {
                setErrors((prev) => ({ ...prev, retypePassword: "" }));
                setRetypePassword(e.target.value);
              }}
              className="outline-none rounded-lg border-[1px] border-gray-300 p-3 w-full mb-2 text-sm"
              autoComplete="new-password"
              placeholder={t("Re-type password")}
            />
            <span
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer"
              onClick={() => setShowRetypePassword((prev) => !prev)}
              tabIndex={0}
              role="button"
            >
              {showRetypePassword ? (
                <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
                  <path
                    stroke="currentColor"
                    strokeWidth="2"
                    d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12Z"
                  />
                  <circle
                    cx="12"
                    cy="12"
                    r="3"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                </svg>
              ) : (
                <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
                  <path
                    stroke="currentColor"
                    strokeWidth="2"
                    d="M3 3l18 18M1 12s4-7 11-7c2.5 0 4.7.7 6.5 1.9M23 12s-4 7-11 7c-2.5 0-4.7-.7-6.5-1.9"
                  />
                  <circle
                    cx="12"
                    cy="12"
                    r="3"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                </svg>
              )}
            </span>
          </div>
          {errors.retypePassword && (
            <div className="text-xs text-red-500 mb-2">
              {errors.retypePassword}
            </div>
          )}
        </div>
        {/* End Retype Password */}

        <div className="mt-4">
          <button
            type="submit"
            className="bg-primary text-white w-full py-2 rounded-md hover:opacity-90 transition-opacity"
            disabled={loading}
          >
            {loading ? t("Saving...") : t("Save")}
          </button>
        </div>
        <div className="flex flex-wrap gap-2 mt-5 mb-2">
          {requirements.map((req) => {
            const passed = req.test.test(newPassword);
            return (
              <div
                key={req.key}
                className={`flex items-center gap-1 px-5 py-1 rounded text-xs font-medium ${
                  passed
                    ? "bg-green-50 text-green-600"
                    : "bg-gray-100 text-gray-400"
                }`}
              >
                {passed ? (
                  <svg width="16" height="16" fill="none" viewBox="0 0 16 16">
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
                  <svg width="16" height="16" fill="none" viewBox="0 0 16 16">
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
        {errors.newPassword && (
          <div className="text-xs text-red-500 mb-2 whitespace-pre-line">
            {errors.newPassword}
          </div>
        )}
      </form>
    </div>
  );
}

export default FirstLoginResetPasswordModal;
