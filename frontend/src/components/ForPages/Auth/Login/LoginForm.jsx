import { useState, useRef } from "react";

import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";
import { toast } from "react-toastify";

import Loader from "@/components/Global/Loader/Loader";
import { Login } from "@/api/auth";
import { setTokens } from "@/api/setToken";

import ResetPasswordModal from "../ResetPassword/ResetPasswordModal";
import FirstLoginResetPasswordModal from "./FirstLoginResetPasswordModal";

function LoginForm() {
  // تحديد إذا كانت اللغة الحالية RTL
  const [showResetModal, setShowResetModal] = useState(false);
  const [showFirstLoginModal, setShowFirstLoginModal] = useState(false);
  const [isAdminLogin, setIsAdminLogin] = useState(false);
  const { t, i18n } = useTranslation();
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
      // data: { access, refresh, user }
      setTokens({ access: data?.access, refresh: data?.refresh });

      toast.success("Login successful");

      // If admin login requested, verify user.is_staff
      if (isAdminLogin) {
        if (data?.user?.is_staff) {
          navigate("/dashboard");
        } else {
          toast.error("This account is not an admin");
        }
      } else {
        // Preserve existing UX: show first-login password modal
        setShowFirstLoginModal(true);
      }
    } catch (error) {
      const msg =
        error?.response?.data?.detail ||
        error?.response?.data?.non_field_errors?.[0] ||
        error?.response?.data?.message ||
        "Invalid username or password";
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div dir={isRTL ? "rtl" : "ltr"}>
      {isLoading && <Loader />}
      <form
        onSubmit={handleSubmit}
        className="max-w-sm bg-white mx-auto flex flex-col gap-4 py-8 px-8 rounded-lg shadow-md"
      >
        {/* Form Title */}
        <h1 className="text-2xl font-semibold text-center mb-2">
          {isAdminLogin ? t("Admin Sign In") : t("Sign In")}
        </h1>

        {/* Login Type Toggle */}
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
        {/* Username Input */}
        <div className="space-y-2">
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
            placeholder={t("Username")}
            className={`outline-none rounded-lg bg-gray-100 p-3 w-full placeholder:text-black/50 text-sm transition-colors focus:bg-gray-50 focus:ring-2 focus:ring-primary/20 ${
              inputErrors.userName ? "border border-red-500" : ""
            }`}
          />
          {inputErrors.userName && (
            <div className="text-xs text-red-500">
              {t("Username is required")}
            </div>
          )}
          <div className="text-xs text-gray-400">
            {t("Available username For Testing")} :{" "}
            <span className="font-semibold text-primary">test@test.test</span>
          </div>
        </div>

        {/* Password Input */}
        <div className="space-y-2">
          <input
            type="password"
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
            className={`outline-none rounded-lg bg-gray-100 p-3 w-full placeholder:text-black/50 text-sm transition-colors focus:bg-gray-50 focus:ring-2 focus:ring-primary/20 ${
              inputErrors.password ? "border border-red-500" : ""
            }`}
          />
          {inputErrors.password && (
            <div className="text-xs text-red-500">
              {t("Password is required")}
            </div>
          )}
          <div className="text-xs text-gray-400">
            {t("Available Password For Testing")} :{" "}
            <span className="font-semibold text-primary">test.test</span>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="bg-primary text-white w-full py-3 rounded-lg mt-4 hover:opacity-90 transition-opacity font-medium"
        >
          {t("Sign In")}
        </button>

        {/* forgot password */}
        <div className="flex items-center justify-between mt-8">
          <div className="">
            <button
              type="button"
              className="text-sm text-primary focus:outline-none"
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
        {/* First Login Reset Password Modal */}
        {showFirstLoginModal && (
          <FirstLoginResetPasswordModal
            open={true}
            onClose={() => setShowFirstLoginModal(false)}
            onSubmit={() => {
              setShowFirstLoginModal(false);
              navigate("/");
            }}
          />
        )}
        {/* Start Don't have an account? */}
        <div className="flex items-center justify-center mt-4">
          <span className="text-sm text-gray-400 mr-2">
            {t("Don't have an account?")}
          </span>
          <Link
            to="/auth/register"
            className="text-sm text-primary font-semibold"
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
            <p className="text-center text-[11px] mt-3">
              {t(
                "This page is protected by Google reCAPTCHA to ensure you're not a bot."
              )}
            </p>
          )}
        </div>
        {/* End Recaptch */}
      </form>
    </div>
  );
}

export default LoginForm;
