import React, { useState } from "react";

import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

function ResetPasswordModal({ open, onClose }) {
  const { t } = useTranslation();
  const [resetEmail, setResetEmail] = useState("");
  const [resetLoading, setResetLoading] = useState(false);
  const [resetError, setResetError] = useState("");

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm relative">
        <h2 className="text-xl font-bold mb-2 text-center">
          {t("Reset Password")}
        </h2>
        <div className="mb-4 text-center text-gray-600">
          {t("Please enter your email to reset your password.")}
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
          onClick={async () => {
            if (!resetEmail) {
              setResetError(t("Email is required"));
              return;
            }
            setResetLoading(true);
            // TODO: Call API to send reset email here
            setTimeout(() => {
              setResetLoading(false);
              onClose();
              toast.success(t("Reset link sent to your email."));
              setResetEmail("");
            }, 1200);
          }}
        >
          {resetLoading ? t("Sending...") : t("Send")}
        </button>
        <button
          className="w-full py-2 mt-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100"
          onClick={onClose}
        >
          {t("Close")}
        </button>
      </div>
    </div>
  );
}

export default ResetPasswordModal;
