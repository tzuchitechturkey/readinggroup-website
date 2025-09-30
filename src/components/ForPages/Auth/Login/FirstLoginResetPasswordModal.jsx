import React, { useState } from "react";

import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

function FirstLoginResetPasswordModal({ open, onClose, onSubmit }) {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const { t } = useTranslation();
  // Password requirements for UI
  const requirements = [
    {
      label: t("8+ characters"),
      test: /.{8,}/,
      key: "length",
    },
    {
      label: t("Number"),
      test: /[0-9]/,
      key: "number",
    },
    {
      label: t("Uppercase letter"),
      test: /[A-Z]/,
      key: "upper",
    },
    {
      label: t("Lowercase letter"),
      test: /[a-z]/,
      key: "lower",
    },
  ];
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [retypePassword, setRetypePassword] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Password strength calculation
  function getPasswordStrength(pw) {
    let score = 0;
    if (/.{8,}/.test(pw)) score++;
    if (/[a-z]/.test(pw)) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[0-9\s\W]/.test(pw)) score++;
    return score;
  }

  const passwordStrength = getPasswordStrength(newPassword);
  const strengthLabels = [
    t("Weak password"),
    t("Weak password"),
    t("Moderate password"),
    t("Strong password"),
    t("Very strong password"),
  ];
  const strengthColors = [
    "bg-red-500",
    "bg-orange-400",
    "bg-yellow-400",
    "bg-green-400",
    "bg-green-600",
  ];

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
    // TODO: Call API to change password here
    setTimeout(() => {
      setLoading(false);
      toast.success(t("Password changed successfully!"));
      onSubmit && onSubmit();
      onClose();
    }, 1200);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm relative">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          onClick={onClose}
        >
          &times;
        </button>
        <h2 className="text-xl font-bold mb-2 text-center">
          {t("Change Password")}
        </h2>
        <form onSubmit={handleSubmit}>
          <label className="block mb-2 text-sm font-medium">
            {t("Current password")}
          </label>
          <div className="relative mb-4">
            <input
              type={showCurrentPassword ? "text" : "password"}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="outline-none rounded-lg border border-gray-300 focus:border-primary p-3 w-full text-sm pr-10"
              autoComplete="current-password"
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

          <label className="block mb-2 text-sm font-medium">
            {t("New password")}
          </label>
          <div className="relative mb-2">
            <input
              type={showNewPassword ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="outline-none rounded-lg border border-gray-300 focus:border-primary p-3 w-full text-sm pr-10"
              autoComplete="new-password"
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

          <label className="block mb-2 text-sm font-medium">
            {t("Re-type password")}
          </label>
          <input
            type="password"
            value={retypePassword}
            onChange={(e) => setRetypePassword(e.target.value)}
            className="outline-none rounded-lg bg-gray-100 p-3 w-full mb-2 text-sm"
            autoComplete="new-password"
          />
          {errors.retypePassword && (
            <div className="text-xs text-red-500 mb-2">
              {errors.retypePassword}
            </div>
          )}

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
                  <span>{req.label}</span>
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
    </div>
  );
}

export default FirstLoginResetPasswordModal;
