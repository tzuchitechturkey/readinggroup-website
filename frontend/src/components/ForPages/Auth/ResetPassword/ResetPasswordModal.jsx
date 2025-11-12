import React, { useState } from "react";

import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

import { setErrorFn } from "@/Utility/Global/setErrorFn";
import { ForgetPassword } from "@/api/auth";

function ResetPasswordModal({ open, onClose }) {
  const { t } = useTranslation();
  const [resetEmail, setResetEmail] = useState("");
  const [resetLoading, setResetLoading] = useState(false);
  const [resetError, setResetError] = useState("");
  if (!open) return null;

  const SendEmail = async () => {
    if (!resetEmail) {
      setResetError(t("Email is required"));
      return;
    }
    setResetLoading(true);
    try {
      await ForgetPassword({ email: resetEmail });
      toast.success(t("Reset link sent to your email."));
      onClose();
      setResetEmail("");
    } catch (error) {
      setErrorFn(error, t);
    } finally {
      setResetLoading(false);
    }
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm relative">
        <h2 className="text-xl font-bold mb-2 text-center text-blue-500">
          {t("Reset Password")}
        </h2>
        <hr className="mb-4 border-gray-200" />
        <div className="mb-4 text-center text-gray-600 whitespace-nowrap">
          {t("Please enter your email to reset your password")}
        </div>
        <input
          type="email"
          value={resetEmail}
          onChange={(e) => {
            setResetEmail(e.target.value);
            setResetError("");
          }}
          placeholder={t("Email Address")}
          className="outline-none rounded-lg bg-gray-100 p-3 w-full mb-2 text-sm"
        />
        {resetError && (
          <div className="text-xs text-red-500 mb-2">{resetError}</div>
        )}
        <button
          className="bg-primary text-white w-full py-2 rounded-md mt-2 hover:opacity-90 transition-opacity"
          disabled={resetLoading}
          onClick={SendEmail}
        >
          {resetLoading ? t("Sending...") : t("Send")}
        </button>
        <hr className="mt-6 mb-2 border-gray-200" />
        <div className="flex flex-row justify-between items-center w-full px-1">
          <div />
          <button
            className="text-gray-700 px-2 py-1 font-medium hover:text-gray-900"
            onClick={onClose}
          >
            {t("Cancel")}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ResetPasswordModal;
