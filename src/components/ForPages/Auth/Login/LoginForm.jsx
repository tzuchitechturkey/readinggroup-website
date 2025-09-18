import { useState, useRef } from "react";

import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";
import { toast } from "react-toastify";

import Loader from "@/components/Global/Loader/Loader";
import { Login } from "@/api/auth";

function LoginForm() {
  const { t, i18n } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const recaptchaRef = useRef();
  const [captchaToken, setCaptchaToken] = useState("0");
  const [showRecaptch, setShowRecaptch] = useState(false);

  const recaptchaLangMap = {
    en: "en",
    ar: "ar",
    tr: "tr",
    sp: "es",
    ch: "zh-CN",
    ua: "uk",
  };
  const recaptchaLang = recaptchaLangMap[i18n.language] || "en";

  async function handleSubmit(e) {
    e.preventDefault();
    if (!userName || !password) {
      setError("Please fill in all fields");
      return;
    }
    setError("");
    setIsLoading(true);
    try {
      const res = await Login({ userName, password });
      toast.success(t("Login successful"));
      console.log(res?.data);
    } catch (err) {
      toast.error(err?.response?.data?.message || t("Login failed"));
    } finally {
      setIsLoading(false);
    }
    // setShowRecaptch(true);
    // recaptchaRef.current?.reset();
  }

  return (
    <div className="dir-ltr">
      {isLoading && <Loader />}
      <form
        onSubmit={handleSubmit}
        className="max-w-80 bg-white mx-auto flex-col gap-4 py-6 px-10  rounded-lg shadow-md"
      >
        <h1 className="text-2xl font-semibold">{t("Sign In")}</h1>
        <input
          type="username"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          placeholder={t("Username")}
          required
          className="outline-none rounded-lg bg-gray-100 p-3 w-full mt-6 placeholder:text-black text-sm"
        />

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder={t("Password")}
          className="outline-none rounded-lg bg-gray-100 p-3 w-full mt-4  placeholder:text-black text-sm"
          required
        />

        {error && <div style={{ color: "red", fontSize: 14 }}>{error}</div>}

        <button
          type="submit"
          className="bg-primary text-white w-full py-3 rounded-md mt-6 hover:opacity-90 transition-opacity"
        >
          {t("Sign In")}
        </button>

        {/* Start Remember Me && Need Help */}
        <div className="flex items-center justify-between mt-8">
          <div>
            <input type="checkbox" id="rememberMe" className="mr-2" required />
            <label htmlFor="rememberMe" className="text-sm text-gray-400">
              {t("Remember Me")}
            </label>
          </div>
          <div className="">
            <Link to="/help" className="text-sm text-gray-400">
              {t("Need Help?")}
            </Link>
          </div>
        </div>
        {/* End Remember Me && Need Help */}
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
