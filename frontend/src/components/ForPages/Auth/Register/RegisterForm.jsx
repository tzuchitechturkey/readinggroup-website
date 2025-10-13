import { useState } from "react";

import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import Loader from "@/components/Global/Loader/Loader";
import { Register } from "@/api/auth";
import { setTokens } from "@/api/setToken";
import { setErrorFn } from "@/Utility/Global/setErrorFn";

function RegisterForm() {
  const { t, i18n } = useTranslation();
  const rtlLanguages = ["ar", "fa", "he", "ur"];
  const currentLang = i18n.language || "en";
  const isRTL = rtlLanguages.includes(currentLang);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showReTypePassword, setShowReTypePassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({
    username: "",
    displayName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [inputErrors, setInputErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    // إزالة الخطأ عند تعديل الحقل
    if (inputErrors[name]) {
      setInputErrors((prev) => {
        const { [name]: removed, ...rest } = prev;
        return rest;
      });
    }

    // إزالة خطأ التأكيد إذا تطابق الباسورد
    if (
      name === "password" &&
      inputErrors.confirmPassword &&
      value === form.confirmPassword
    ) {
      setInputErrors((prev) => {
        const { confirmPassword, ...rest } = prev;
        return rest;
      });
    }
    if (
      name === "confirmPassword" &&
      inputErrors.confirmPassword &&
      value === form.password
    ) {
      setInputErrors((prev) => {
        const { confirmPassword, ...rest } = prev;
        return rest;
      });
    }
    setError("");
  };

  async function handleSubmit(e) {
    e.preventDefault();
    const errors = {};
    if (!form.username) errors.username = true;
    if (!form.displayName) errors.displayName = true;
    if (!form.email) errors.email = true;
    if (!form.password) errors.password = true;
    if (!form.confirmPassword) errors.confirmPassword = true;
    if (
      form.password &&
      form.confirmPassword &&
      form.password !== form.confirmPassword
    ) {
      errors.confirmPassword = true;
    }

    setInputErrors(errors);
    if (Object.keys(errors).length > 0) {
      setError(
        !form.username || !form.email || !form.password || !form.confirmPassword
          ? t("Please fill in all fields")
          : t("Passwords do not match")
      );
      return;
    }

    setError("");
    setIsLoading(true);
    try {
      const payload = {
        username: form.username || form.email,
        email: form.email,
        password: form.password,
      };
      const { data } = await Register(payload);
      setTokens({ access: data?.access, refresh: data?.refresh });
      toast.success(t("Registration successful"));
      navigate("/auth/login");
    } catch (err) {
      setErrorFn(err);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div dir={isRTL ? "rtl" : "ltr"}>
      {isLoading && <Loader />}
      <form
        onSubmit={handleSubmit}
        className="max-w-80 bg-white mx-auto flex-col gap-4 py-6 px-8  rounded-lg shadow-md"
      >
        <h1 className="text-2xl ">{t("Sign Up")}</h1>

        <input
          type="text"
          name="username"
          value={form.username}
          onChange={handleChange}
          placeholder={t("Username")}
          className={`outline-none rounded-lg bg-gray-100 p-3 w-full mt-6 placeholder:text-black/50 text-sm ${
            inputErrors.username ? "border border-red-500" : ""
          }`}
        />

        <input
          type="text"
          name="displayName"
          value={form.displayName}
          onChange={handleChange}
          placeholder={t("Display Name")}
          className={`outline-none rounded-lg bg-gray-100 p-3 w-full mt-4 placeholder:text-black/50 text-sm ${
            inputErrors.displayName ? "border border-red-500" : ""
          }`}
        />

        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder={t("Email")}
          className={`outline-none rounded-lg bg-gray-100 p-3 w-full mt-4 placeholder:text-black/50 text-sm ${
            inputErrors.email ? "border border-red-500" : ""
          }`}
        />
        <div className=" relative mt-4">
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder={t("Password")}
            className={`outline-none rounded-lg bg-gray-100 p-3 w-full  placeholder:text-black/50 text-sm ${
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
        <div className=" relative mt-4">
          <input
            type="password"
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
            placeholder={t("Confirm Password")}
            className={`outline-none rounded-lg bg-gray-100 p-3 w-full   placeholder:text-black/50 text-sm ${
              inputErrors.confirmPassword ? "border border-red-500" : ""
            }`}
          />
          {/* Start Toggle show/hide password */}
          <span
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer"
            onClick={() => setShowReTypePassword((prev) => !prev)}
            tabIndex={0}
            role="button"
          >
            {showReTypePassword ? (
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

        {error && <div style={{ color: "red", fontSize: 14 }}>{error}</div>}

        <button
          type="submit"
          className="bg-primary text-white w-full py-3 rounded-md mt-6 hover:opacity-90 transition-opacity"
        >
          {t("Sign Up")}
        </button>

        <div className="flex items-center justify-center mt-8">
          <span className="text-sm text-gray-400 mr-2">
            {t("Do you have an account?")}
          </span>
          <Link to="/auth/login" className="text-sm text-primary font-semibold">
            {t("Sign In")}
          </Link>
        </div>
      </form>
    </div>
  );
}

export default RegisterForm;
