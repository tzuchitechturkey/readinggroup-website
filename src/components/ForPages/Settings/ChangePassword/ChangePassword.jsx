import React, { useState } from "react";

import { Eye, EyeOff } from "lucide-react";

// Reusable password input with show/hide toggle
const PasswordField = ({ label, placeholder = "********", name }) => {
  const [visible, setVisible] = useState(false);
  const id = `input-${name}`;
  return (
    <div className="w-full">
      <label htmlFor={id} className="block text-xl text-[#5B6B79] mb-2">
        {label}
      </label>
      <div className="relative mt-3">
        <input
          id={id}
          name={name}
          type={visible ? "text" : "password"}
          placeholder={placeholder}
          className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 pr-10 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200 focus:border-slate-300"
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

function ChangePassword() {
  return (
    <div className="w-full">
      <div className="max-w-3xl mx-[52px] p-6">
        <form className="space-y-6">
          <PasswordField label="Current Password" name="currentPassword" />
          <PasswordField label="New Password" name="newPassword" />
          <PasswordField label="Confirm Password" name="confirmPassword" />
        </form>

        {/* Requirements */}
        <div className="mt-8">
          <h3 className="text-xl font-medium text-[#353535] font-semibold">
            Password requirements
          </h3>
          <p className="text-sm text-slate-500 mt-1">
            Ensure that these requirements are met:
          </p>
          <ul className="mt-4 space-y-2 text-lg text-[#353535] list-disc pl-6">
            <li>Minimum 8 characters long-the more, the better</li>
            <li>At least one lowercase character</li>
            <li>At least one uppercase character</li>
            <li>At least one number, symbol, or whitespace</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default ChangePassword;
