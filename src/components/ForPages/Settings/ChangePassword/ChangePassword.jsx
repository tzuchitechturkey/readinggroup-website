import React, { use, useState } from "react";

import { Eye, EyeOff } from "lucide-react";
import { useTranslation } from "react-i18next";

const PasswordField = ({ label, placeholder = "********", name, userType }) => {
  const [visible, setVisible] = useState(false);
  const id = `input-${name}`;
  return (
    <div className="w-full">
      <label htmlFor={id} className="block text-xl text-[#5B6B79] mb-2">
        {label}
      </label>
      <div className={` relative ${userType === "admin" ? "mt-3" : "mt-1"}`}>
        <input
          id={id}
          name={name}
          type={visible ? "text" : "password"}
          placeholder={placeholder}
          className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 pr-10 text-sm placeholder:text-slate-400  "
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          className="absolute inset-y-0 right-3 flex items-center text-slate-400 hover:text-slate-600"
          aria-label={visible ? "Hide password" : "Show password"}
        >
          {/* Eye icon */}
          {visible ? <EyeOff /> : <Eye />}
        </button>
      </div>
    </div>
  );
};

function ChangePassword({ userType }) {
  const { t } = useTranslation();

  return (
    <div className="w-full">
      <div className="max-w-3xl mx-[52px] p-6">
        <form className={userType === "admin" ? "space-y-8 m-8" : "space-y-2 "}>
          <PasswordField
            label={t("Current Password")}
            name="currentPassword"
            userType={userType}
          />
          <PasswordField
            label={t("New Password")}
            name="newPassword"
            userType={userType}
          />
          <PasswordField
            label={t("Confirm Password")}
            name="confirmPassword"
            userType={userType}
          />
        </form>

        {/* Requirements */}
        <div className={userType === "admin" ? "m-8" : "mt-3"}>
          <h3 className="text-xl  text-[#353535] font-semibold">
            {t("Password requirements")}
          </h3>
          <p className="text-sm text-slate-500 mt-1">
            {t("Ensure that these requirements are met")}:
          </p>
          <ul className="mt-4 space-y-2 text-lg text-[#353535] list-disc pl-6">
            <li>{t("Minimum 8 characters long-the more, the better")}</li>
            <li>{t("At least one lowercase character")}</li>
            <li>{t("At least one uppercase character")}</li>
            <li>{t("At least one number, symbol, or whitespace")}</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default ChangePassword;
