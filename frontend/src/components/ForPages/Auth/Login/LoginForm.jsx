import { useState, useRef } from "react";

import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";
import { toast } from "react-toastify";

import Loader from "@/components/Global/Loader/Loader";
import { Login } from "@/api/auth";
import { setTokens } from "@/api/setToken";
import { setErrorFn } from "@/Utility/Global/setErrorFn";
import Modal from "@/components/Global/Modal/Modal";

import ResetPasswordModal from "../ResetPassword/ResetPasswordModal";
import FirstLoginResetPasswordModal from "./FirstLoginResetPasswordModal";
import TOTPModal from "./TOTPModal";
import ResetQrModal from "./ResetQrModal";

function LoginForm() {
  const { t, i18n } = useTranslation();
  const [showResetModal, setShowResetModal] = useState(false);
  const [showFirstLoginModal, setShowFirstLoginModal] = useState(false);
  const [isAdminLogin, setIsAdminLogin] = useState(false);
  const rtlLanguages = ["ar", "fa", "he", "ur"];
  const currentLang = i18n.language || "en";
  const isRTL = rtlLanguages.includes(currentLang);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [inputErrors, setInputErrors] = useState({});
  const recaptchaRef = useRef();
  const [captchaToken, setCaptchaToken] = useState("0");
  const [showRecaptch, setShowRecaptch] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showTOTPModal, setShowTOTPModal] = useState(false);
  const [qr, setQr] = useState("");
  const [totpError, setTotpError] = useState(null);
  const [onOpenResendQr, setOnOpenResendQr] = useState(false);
  const [otpCode, setOtpCode] = useState("");

  const recaptchaLangMap = {
    en: "en",
    ar: "ar",
    tr: "tr",
    sp: "es",
    ch: "ch",
    ua: "uk",
  };

  const recaptchaLang = recaptchaLangMap[i18n.language] || "en";
  async function handleSubmit(e) {
    e.preventDefault();

    const errors = {};
    if (!userName) errors.userName = true;
    if (!password) errors.password = true;

    setInputErrors(errors);

    if (Object.keys(errors).length > 0) return;

    // Real API login
    setIsLoading(true);
    try {
      const { data } = await Login({ username: userName, password });
      setTokens({ access: data?.access, refresh: data?.refresh });
      console.log(data);
      toast.success("Login successful");
      if (data?.user?.is_first_login) {
        setShowFirstLoginModal(true);
      } else {
        if (data?.requires_totp) {
          setShowTOTPModal(true);
          if (data?.show_qr) {
            setQr(data?.qr);
          }
        }
      }
    } catch (error) {
      setErrorFn(error);
    } finally {
      setIsLoading(false);
    }
  }
  const handleTotpVerify = async (code) => {
    const verifyTOTP = async ({
      totp,
      user,
      setIsLoading,
      Login,
      setTotpError,
      setOtpCode,
      setShowTOTPModal,
      navigate,
      t,
    }) => {
      if (!totp || totp.trim() === "" || !user?.username || !user?.password)
        return;
      const username = user?.username;
      const password = user?.password;
      setIsLoading(true);
      try {
        const res = await Login({ username, password, totp });
        console.log(res?.data);
        setTokens({ access: res.data?.access, refresh: res.data?.refresh });
        setShowTOTPModal(false);
        if (res?.data.user?.groups.includes("admin")) {
          localStorage.setItem("userType", "admin");
        } else {
          localStorage.setItem("userType", res?.data.user?.groups[0]);
        }

        // if (isAdminLogin) {
        //   if (res?.data?.user?.groups[0] === "admin") {
        //     // if (data?.user?.is_staff) {
        //     navigate("/dashboard");
        //   } else {
        //     toast.error("This account is not an admin");
        //   }
        // } else {
        if (res?.data?.user?.groups.includes("admin")) {
          navigate("/dashboard");
        } else {
          navigate("/");
          // toast.error("This account is not a user");
        }
        // }
      } catch (err) {
        setTotpError(t("TOTP verification failed"));
        setOtpCode("");
      } finally {
        setIsLoading(false);
      }
    };
    verifyTOTP({
      totp: code,
      user: { username: userName, password },
      setIsLoading,
      Login,
      setTotpError,
      setOtpCode,
      setShowTOTPModal,
      navigate,
      t,
    });
  };
  return (
    <div dir={isRTL ? "rtl" : "ltr"}>
      {isLoading && <Loader />}
      <form
        onSubmit={handleSubmit}
        className="max-w-80 max-h-[600px] overflow-auto bg-white mx-auto flex flex-col gap-3 py-6 px-6 rounded-lg shadow-md"
      >
        {/* Form Title */}
        <h1 className="text-xl font-semibold text-center mb-1">
          {isAdminLogin ? t("Admin Sign In") : t("Sign In")}
        </h1>

        {/* Login Type Toggle */}
        {/*
        <div className="flex gap-2 mb-6">
           <button
            type="button"
            onClick={() => setIsAdminLogin(false)}
            className={`flex-1 py-2.5 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
              !isAdminLogin
                ? "bg-primary text-white shadow-sm"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {t("User Login")}
          </button>
          <button
            type="button"
            onClick={() => setIsAdminLogin(true)}
            className={`flex-1 py-2.5 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
              isAdminLogin
                ? "bg-primary text-white shadow-sm"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {t("Admin Login")}
          </button>
        </div>
           */}
        {/* Username Input */}
        <div className="space-y-1 mb-1">
          <input
            type="text"
            value={userName}
            onChange={(e) => {
              setUserName(e.target.value);
              if (inputErrors.userName && e.target.value) {
                setInputErrors((prev) => {
                  const { userName, ...rest } = prev;
                  return rest;
                });
              }
            }}
            placeholder={t("Email")}
            className={`outline-none rounded-lg bg-gray-100 p-2 w-full placeholder:text-black/50 text-xs transition-colors focus:bg-gray-50 focus:ring-2 focus:ring-primary/20 ${
              inputErrors.userName ? "border border-red-500" : ""
            }`}
          />
          {inputErrors.userName && (
            <div className="text-xs text-red-500">
              {t("Username is required")}
            </div>
          )}
        </div>

        {/* Password Input */}
        <div className="relative">
          <div>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (inputErrors.password && e.target.value) {
                  setInputErrors((prev) => {
                    const { password, ...rest } = prev;
                    return rest;
                  });
                }
              }}
              placeholder={t("Password")}
              className={`outline-none rounded-lg bg-gray-100 p-2 w-full placeholder:text-black/50 text-xs transition-colors focus:bg-gray-50 focus:ring-2 focus:ring-primary/20 ${
                inputErrors.password ? "border border-red-500" : ""
              }`}
            />
            {/* Start Toggle show/hide password */}
            <span
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer"
              onClick={() => setShowPassword((prev) => !prev)}
              tabIndex={0}
              role="button"
            >
              {showPassword ? (
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
            {/* End Toggle show/hide password */}
          </div>
          {inputErrors.password && (
            <div className="text-xs text-red-500">
              {t("Password is required")}
            </div>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="bg-primary text-white w-full py-2 rounded-md mt-3 hover:opacity-90 transition-opacity font-medium text-xs"
        >
          {t("Sign In")}
        </button>

        {/* forgot password */}
        <div className="flex items-center justify-between mt-5">
          <div className="">
            <button
              type="button"
              className="text-xs text-primary focus:outline-none"
              onClick={() => setShowResetModal(true)}
            >
              {t("forgot password ?")}
            </button>
          </div>
        </div>
        {/* forgot password*/}
        {/* Reset Password Modal */}
        {showResetModal && (
          <ResetPasswordModal
            open={true}
            onClose={() => setShowResetModal(false)}
          />
        )}

        {/* Start Don't have an account? */}
        <div className="flex items-center justify-center mt-3">
          <span className="text-xs text-gray-400 mr-1">
            {t("Don't have an account?")}
          </span>
          <Link
            to="/auth/register"
            className="text-xs text-primary font-semibold"
          >
            {t("Sign Up")}
          </Link>
        </div>
        {/* End Don't have an account? */}
        {/* Start Recaptch */}
        <div>
          {/* Captcha */}
          {showRecaptch ? (
            <div
              style={{ display: "flex", justifyContent: "center" }}
              className="mb-3"
            >
              <ReCAPTCHA
                ref={recaptchaRef}
                sitekey="6Ld8iSArAAAAAEDhHCZ8HEsn6o9Xf-wqhN5lotbX"
                onChange={(token) => setCaptchaToken(token)}
                hl={recaptchaLang}
              />
            </div>
          ) : (
            <p className="text-center text-[10px] mt-2">
              {t(
                "This page is protected by Google reCAPTCHA to ensure you're not a bot."
              )}
            </p>
          )}
        </div>
        {/* End Recaptch */}
      </form>

      
      {/* Start First Login Reset Password Modal */}
      <Modal
        isOpen={showFirstLoginModal}
        onClose={() => setShowFirstLoginModal(false)}
        title={t("Change Password")}
      >
        <FirstLoginResetPasswordModal
          open={true}
          onClose={() => setShowFirstLoginModal(false)}
        />
      </Modal>
      {/* End First Login Reset Password Modal */}

      {/* Start TOTP Modal */}
      <Modal
        isOpen={showTOTPModal}
        onClose={() => setShowTOTPModal(false)}
        title={t("Two-Factor Authentication")}
      >
        <TOTPModal
          onClose={() => setShowTOTPModal(false)}
          qrUrl={qr}
          error={totpError}
          onVerify={(code) => handleTotpVerify(code)}
          setOnOpenResendQr={setOnOpenResendQr}
          onOpenResendQr={onOpenResendQr}
          otpCode={otpCode}
          setOtpCode={setOtpCode}
        />
      </Modal>
      {/* End TOTP Modal */}

      {/* Start Resend  */}
      <Modal
        isOpen={onOpenResendQr}
        onClose={() => {
          setOnOpenResendQr(false);
          setShowTOTPModal(false);
        }}
        title={t("Resend Qr")}
      >
        <ResetQrModal
          onClose={() => {
            setOnOpenResendQr(false);
            setShowTOTPModal(false);
          }}
        />
      </Modal>
      {/* End Resend  */}
    </div>
  );
}

export default LoginForm;