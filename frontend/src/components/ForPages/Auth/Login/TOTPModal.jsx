import React, { useState } from "react";

import { useTranslation } from "react-i18next";

const TOTPModal = ({
  show,
  onClose,
  onVerify,
  qrUrl,
  error,
  setOnOpenResendQr,
  otpCode,
  setOtpCode,
}) => {
  const { t } = useTranslation();
  const [inputError, setInputError] = useState(false);
  const handleSubmit = (e) => {
    e.preventDefault();
    if (otpCode.length !== 6) {
      setInputError(true);
      return;
    }
    setInputError(false);
    onVerify(otpCode);
  };
  const arabicToEnglish = (text) =>
    text.replace(/[٠-٩]/g, (d) => "٠١٢٣٤٥٦٧٨٩".indexOf(d));

  return (
    <div className="bg-white rounded-lg shadow-lg w-full max-w-md   p-6">
      {/* العنوان */}
      <h5 className="text-center text-green-600 font-bold text-lg mb-4">
        {t("Two-Factor Authentication")}
      </h5>

      {/* صورة الـ QR */}
      {qrUrl && (
        <div className="text-center mb-4">
          <img src={qrUrl} alt="Scan QR" className="w-48 h-48 mx-auto" />
          <p className="text-gray-500 text-sm mt-2">
            {t("Scan this code in your Google Authenticator app.")}
          </p>
          <p className="mt-2">
            <a
              href="/auth/totp-setup"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline"
            >
              {t("Need help setting up the app? Click here.")}
            </a>
          </p>
        </div>
      )}

      {/* النموذج */}
      <form onSubmit={handleSubmit} className="text-center">
        <input
          type="text"
          maxLength={6}
          value={otpCode}
          onChange={(e) => {
            let val = arabicToEnglish(e.target.value);
            val = val.replace(/[^0-9]/g, "");
            setOtpCode(val);
          }}
          placeholder="● ● ● ● ● ●"
          className={`w-full text-center text-3xl tracking-widest py-2 border rounded-md focus:outline-none ${
            inputError ? "border-red-500" : "border-gray-300"
          }`}
        />

        {inputError && (
          <p className="text-red-500 text-sm mt-2">
            {t("Please enter a valid 6-digit code.")}
          </p>
        )}

        {error && (
          <div className="bg-red-100 text-red-700 p-2 rounded-md mt-3">
            {error}
          </div>
        )}

        <button
          type="submit"
          className="bg-blue-600 text-white w-full py-2 rounded-md mt-4 hover:bg-blue-700 transition"
        >
          {t("Verify")}
        </button>
      </form>

      {/* زر الإلغاء */}
      <div className="mt-4 border-t pt-3">
        <button
          onClick={onClose}
          className="w-full text-gray-500 hover:text-gray-700"
        >
          {t("Cancel")}
        </button>
      </div>

      {/* زر إعادة إرسال QR */}
      <div className="mt-2 text-center">
        <button
          onClick={() => setOnOpenResendQr(true)}
          className="text-blue-600 underline hover:text-blue-800"
        >
          {t("resend Qr")}
        </button>
      </div>
    </div>
  );
};
export default TOTPModal;
