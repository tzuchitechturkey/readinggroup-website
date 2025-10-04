import React from "react";

// Reusable dynamic input component to use anywhere inside the form
const FormInput = ({
  label,
  type = "text",
  placeholder = "",
  name,
  id,
  value,
  defaultValue,
  onChange,
  fullWidth = false,
  className = "",
  inputClassName = "",
  ...rest
}) => {
  const inputId = id || (name ? `input-${name}` : undefined);
  return (
    <div className={`${fullWidth ? "md:col-span-2" : ""} ${className}`}>
      {label && (
        <label htmlFor={inputId} className="block text-sm text-slate-500 mb-2">
          {label}
        </label>
      )}
      <input
        id={inputId}
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        defaultValue={defaultValue}
        onChange={onChange}
        className={`w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-lg text-slate-700 placeholder:text-[#9FA2AA] focus:outline-none focus:ring-2 focus:ring-slate-200 focus:border-slate-300 ${inputClassName}`}
        {...rest}
      />
    </div>
  );
};

function EditProfile() {
  return (
    <div className="w-full px-4 md:px-8 mt-4">
      <div className="grid grid-cols-1 md:grid-cols-[100px_minmax(0,1fr)] gap-6">
        {/* Start Avatar */}
        <div className="flex items-start md:justify-start justify-center">
          <img
            src="/Beared Guy02-min 1.png"
            alt="editProfile"
            className="w-24 h-24 rounded-full object-contain shadow-sm"
          />
        </div>
        {/* End Avatar */}

        {/* Start Form */}
        <form className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full min-w-0">
          {/* Full Name */}
          <FormInput
            label="Full Name"
            name="fullName"
            placeholder="John Smith"
          />

          {/* Profession */}
          <FormInput
            label="Profession"
            name="profession"
            placeholder="Project Manager"
          />

          {/* Country */}
          <FormInput
            label="Country"
            name="country"
            placeholder="United States"
          />

          {/* Address */}
          <FormInput label="Address" name="address" placeholder="New York" />

          {/* Location */}
          <FormInput label="Location" name="location" placeholder="Location" />

          {/* Phone */}
          <FormInput
            label="Phone"
            name="phone"
            type="tel"
            placeholder="+1 1234567890"
          />

          {/* Email (full width) */}
          <FormInput
            label="Email"
            name="email"
            type="email"
            placeholder="john@gmail.com"
            fullWidth
          />
        </form>
        {/* End Form */}
      </div>
    </div>
  );
}

export default EditProfile;
