import { useState } from "react";

import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import Loader from "@/components/Global/Loader/Loader";
import { Register } from "@/api/auth";

function RegisterForm() {
  const { t, i18n } = useTranslation();
  const rtlLanguages = ["ar", "fa", "he", "ur"];
  const currentLang = i18n.language || "en";
  const isRTL = rtlLanguages.includes(currentLang);
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [inputErrors, setInputErrors] = useState({});

  async function handleSubmit(e) {
    e.preventDefault();
    toast.success(t("Registration successful"));

    navigate("/");
    // const errors = {};
    // if (!userName) errors.userName = true;
    // if (!email) errors.email = true;
    // if (!password) errors.password = true;
    // if (!confirmPassword) errors.confirmPassword = true;
    // if (password && confirmPassword && password !== confirmPassword) {
    //   errors.confirmPassword = true;
    // }
    // setInputErrors(errors);
    // if (Object.keys(errors).length > 0) {
    //   setError(
    //     !userName || !email || !password || !confirmPassword
    //       ? "Please fill in all fields"
    //       : "Passwords do not match"
    //   );
    //   return;
    // }
    // setError("");
    // setIsLoading(true);
    // try {
    //   const res = await Register({ userName, email, password });
    //   toast.success(t("Registration successful"));
    //   console.log(res?.data);
    // } catch (err) {
    //   toast.error(err?.response?.data?.message || t("Registration failed"));
    // } finally {
    //   setIsLoading(false);
    // }
  }

  return (
    <div dir={isRTL ? "rtl" : "ltr"}>
      {isLoading && <Loader />}
      <form
        onSubmit={handleSubmit}
        className="max-w-80 bg-white mx-auto flex-col gap-4 py-6 px-10  rounded-lg shadow-md"
      >
        <h1 className="text-2xl ">{t("Sign Up")}</h1>

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
          className={`outline-none rounded-lg bg-gray-100 p-3 w-full mt-6 placeholder:text-black text-sm ${
            inputErrors.userName ? "border border-red-500" : ""
          }`}
        />

        <input
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (inputErrors.email && e.target.value) {
              setInputErrors((prev) => {
                const { email, ...rest } = prev;
                return rest;
              });
            }
          }}
          placeholder={t("Email")}
          className={`outline-none rounded-lg bg-gray-100 p-3 w-full mt-4 placeholder:text-black text-sm ${
            inputErrors.email ? "border border-red-500" : ""
          }`}
        />

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
            // Remove confirmPassword error if passwords now match
            if (
              inputErrors.confirmPassword &&
              confirmPassword &&
              e.target.value === confirmPassword
            ) {
              setInputErrors((prev) => {
                const { confirmPassword, ...rest } = prev;
                return rest;
              });
            }
          }}
          placeholder={t("Password")}
          className={`outline-none rounded-lg bg-gray-100 p-3 w-full mt-4  placeholder:text-black text-sm ${
            inputErrors.password ? "border border-red-500" : ""
          }`}
        />

        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => {
            setConfirmPassword(e.target.value);
            if (
              inputErrors.confirmPassword &&
              password &&
              e.target.value === password
            ) {
              setInputErrors((prev) => {
                const { confirmPassword, ...rest } = prev;
                return rest;
              });
            } else if (inputErrors.confirmPassword && e.target.value) {
              // Remove error if not empty and password matches
              if (password === e.target.value) {
                setInputErrors((prev) => {
                  const { confirmPassword, ...rest } = prev;
                  return rest;
                });
              }
            }
          }}
          placeholder={t("Confirm Password")}
          className={`outline-none rounded-lg bg-gray-100 p-3 w-full mt-4  placeholder:text-black text-sm ${
            inputErrors.confirmPassword ? "border border-red-500" : ""
          }`}
        />

        {error && <div style={{ color: "red", fontSize: 14 }}>{error}</div>}

        <button
          type="submit"
          className="bg-primary text-white w-full py-3 rounded-md mt-6 hover:opacity-90 transition-opacity"
        >
          {t("Sign Up")}
        </button>

        {/* Do you have an account? */}
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
