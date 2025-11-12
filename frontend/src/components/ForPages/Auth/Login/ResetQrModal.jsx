import React, { useState } from "react";

import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

import axiosInstance from "@/api/axios";
import Loader from "@/components/Global/Loader/Loader";
import { setErrorFn } from "@/Utility/Global/setErrorFn";

function ResetQrModal({ onClose, mode = "resend" }) {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    phoneNumber: "",
    email: "",
  });
  const [errors, setErrors] = useState({
    username: false,
    phoneNumber: false,
    email: false,
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((prev) => ({
      ...prev,
      [name]: false,
    }));
  };

  const handleSubmitResendQr = async (e) => {
    e.preventDefault();
    const newErrors = {
      username: mode === "resend" && formData?.username?.trim() === "",
      // phoneNumber: mode === "resend" && formData?.phoneNumber?.trim() === "",
      email: formData?.email?.trim() === "",
    };

    setErrors(newErrors);
    const hasError = Object.values(newErrors).some(Boolean);
    if (hasError) return;

    setIsLoading(true);
    try {
      const payload =
        mode === "resend"
          ? {
              username: formData.username,
              phone_number: formData.phoneNumber,
              email: formData.email,
            }
          : {
              email: formData.email,
            };

      const response = await axiosInstance.post(
        mode === "resend"
          ? "/accounts/reset-totp/"
          : "/accounts/auth/forgot-password/",
        payload
      );

      if (response.status === 200) {
        toast.success(
          t(
            mode === "resend"
              ? "QR code resent successfully! Check your email."
              : "Password reset successfully! Check your email."
          )
        );
        onClose();
      } else {
        toast.error(t("Request failed. Please try again later."));
      }
    } catch (err) {
      console.error(err);
      setErrorFn({ err, t });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-[1050]">
      {isLoading && <Loader />}

      <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-2 p-6 relative">
        {/* العنوان */}
        <div className="text-center mb-4">
          <h5 className="text-blue-500 font-bold text-lg">
            {mode === "resend" ? t("Resend Qr") : t("Reset Password")}
          </h5>
        </div>

        {/* النموذج */}
        <form onSubmit={handleSubmitResendQr} className="space-y-4 text-center">
          {mode === "resend" && (
            <>
              <div>
                <input
                  type="text"
                  name="username"
                  placeholder={t("User Name")}
                  value={formData.username}
                  onChange={handleChange}
                  className={`w-full border rounded-lg px-3 py-2 mt-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                    errors.username ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.username && (
                  <p className="text-red-500 text-xs mt-1">
                    {t("Please enter your username.")}
                  </p>
                )}
              </div>
              {/* 
              <div>
                <input
                  type="text"
                  maxLength="11"
                  name="phoneNumber"
                  placeholder={t("Mobile Number")}
                  value={formData.phoneNumber}
                  onChange={(e) => {
                    const arabicToEnglish = (text) =>
                      text.replace(/[٠-٩]/g, (d) =>
                        String("٠١٢٣٤٥٦٧٨٩".indexOf(d))
                      );
                    const onlyNumbers = arabicToEnglish(e.target.value).replace(
                      /\D/g,
                      ""
                    );
                    handleChange({
                      target: { name: "phoneNumber", value: onlyNumbers },
                    });
                  }}
                  className={`w-full border rounded-lg px-3 py-2 mt-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                    errors.phoneNumber ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.phoneNumber && (
                  <p className="text-red-500 text-xs mt-1">
                    {t("Please enter your Mobile Number.")}
                  </p>
                )}
              </div> */}
            </>
          )}

          <div>
            <input
              type="email"
              name="email"
              placeholder={t("Email")}
              value={formData.email}
              onChange={handleChange}
              className={`w-full border rounded-lg px-3 py-2 mt-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                errors.email ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">
                {t("Please enter your email.")}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-lg transition-colors"
          >
            {t("Send")}
          </button>
        </form>

        {/* زر الإلغاء */}
        <div className="mt-4 border-t pt-3">
          <button
            onClick={onClose}
            className="w-full text-gray-500 hover:text-gray-700 text-sm"
          >
            {t("Cancel")}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ResetQrModal;
