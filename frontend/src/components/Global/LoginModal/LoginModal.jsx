import React from "react";

import { useTranslation } from "react-i18next";
import { X } from "lucide-react";
import { useNavigate } from "react-router-dom";

function LoginModal({ isOpen, onClose }) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleLogin = () => {
    onClose();
    navigate("/auth/login");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96 max-w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            {t("Authentication Required")}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <p className="text-gray-600 mb-6">
          {t("You need to log in to interact. Please log in to continue.")}
        </p>
        <div className="flex gap-3">
          <button
            onClick={handleLogin}
            className="flex-1 bg-primary text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
          >
            {t("Log In")}
          </button>
          <button
            onClick={onClose}
            className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors"
          >
            {t("Cancel")}
          </button>
        </div>
      </div>
    </div>
  );
}

export default LoginModal;
