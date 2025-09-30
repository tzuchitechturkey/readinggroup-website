import { useState, useRef } from "react";

import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";
import { toast } from "react-toastify";

import Loader from "@/components/Global/Loader/Loader";
import { Login } from "@/api/auth";

import ResetPasswordModal from "../ResetPassword/ResetPasswordModal";
import FirstLoginResetPasswordModal from "./FirstLoginResetPasswordModal";

function LoginForm() {
  // تحديد إذا كانت اللغة الحالية RTL
  const [showResetModal, setShowResetModal] = useState(false);
  const [showFirstLoginModal, setShowFirstLoginModal] = useState(false);
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

    if (Object.keys(errors).length > 0) {
      return;
    }
    toast.success(t("Login successful"));
    setShowFirstLoginModal(true);
    // navigate("/");
    // setIsLoading(true);
    // try {
    //   const res = await Login({ email: userName, password });
    //   toast.success(t("Login successful"));
    //   console.log(res?.data);
    // } catch (err) {
    //   toast.error(err?.response?.data?.message || t("Login failed"));
    // } finally {
    //   setIsLoading(false);
    // }
    // setShowRecaptch(true);
    // recaptchaRef.current?.reset();
  }
  return (
    <div dir={isRTL ? "rtl" : "ltr"}>
      {isLoading && <Loader />}
      <form
        onSubmit={handleSubmit}
        className="max-w-80 bg-white mx-auto flex-col gap-4 py-6 px-10  rounded-lg shadow-md"
      >
        <h1 className="text-2xl ">{t("Sign In")}</h1>
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
          className={`outline-none rounded-lg bg-gray-100 p-3 w-full mt-6 placeholder:text-black/50 text-sm ${
            inputErrors.userName ? "border border-red-500" : ""
          }`}
        />
        {inputErrors.userName && (
          <div className="text-xs text-red-500 mt-1">
            {t("Username is required")}
          </div>
        )}

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
          className={`outline-none rounded-lg bg-gray-100 p-3 w-full mt-4  placeholder:text-black/50 text-sm ${
            inputErrors.password ? "border border-red-500" : ""
          }`}
        />
        {inputErrors.password && (
          <div className="text-xs text-red-500 mt-1">
            {t("Password is required")}
          </div>
        )}

        <button
          type="submit"
          className="bg-primary text-white w-full py-3 rounded-md mt-6 hover:opacity-90 transition-opacity"
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
