import React, { useEffect, useState } from "react";

import {
  User as UserIcon,
  Archive as ArchiveIcon,
  MessagesSquare as InteractionsIcon,
  Mail,
  Phone,
  MapPin,
  Edit3,
  Check,
  X,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import userAvatar from "@/assets/Beared Guy02-min 1.png";
import { GetProfile, UpdatePatchProfile, UpdateProfile } from "@/api/auth";
import { setErrorFn } from "@/Utility/Global/setErrorFn";
import Loader from "@/components/Global/Loader/Loader";

// Simple stat item
const Stat = ({ label, value }) => (
  <div className="flex flex-col items-center gap-1">
    <span className="text-xs text-muted-foreground">{label}</span>
    <span className="text-lg font-semibold leading-none">{value}</span>
  </div>
);

// Simple labeled row used on the right details card
const Labeled = ({ label, children }) => (
  <div className="space-y-1">
    <div className="text-sm font-normal text-[#5B6B79]">{label}</div>
    <div className="text-sm text-[#1D2630]">{children}</div>
  </div>
);

// Editable field component
const EditableField = ({
  label,
  value,
  isEditing,
  onEdit,
  onSave,
  onCancel,
  onChange,
  multiline = false,
  placeholder = "",
}) => (
  <div className="space-y-1">
    <div className="flex items-center justify-between">
      <div className="text-sm font-normal text-[#5B6B79]">{label}</div>
      <div className="flex items-center gap-1">
        {!isEditing ? (
          <button
            onClick={onEdit}
            className="p-1 text-gray-400 hover:text-blue-500 transition-colors duration-200"
            aria-label={`Edit ${label}`}
          >
            <Edit3 size={14} />
          </button>
        ) : (
          <>
            <button
              onClick={onSave}
              className="p-1 text-green-500 hover:text-green-600 transition-colors duration-200"
              aria-label={`Save ${label}`}
            >
              <Check size={14} />
            </button>
            <button
              onClick={onCancel}
              className="p-1 text-red-500 hover:text-red-600 transition-colors duration-200"
              aria-label={`Cancel edit ${label}`}
            >
              <X size={14} />
            </button>
          </>
        )}
      </div>
    </div>
    <div className="text-sm text-[#1D2630]">
      <div className="transition-all duration-300 ease-in-out">
        {isEditing ? (
          multiline ? (
            <textarea
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder={placeholder}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all duration-200 animate-in fade-in-0"
              rows={3}
              autoFocus
            />
          ) : (
            <input
              type="text"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder={placeholder}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 animate-in fade-in-0"
              autoFocus
            />
          )
        ) : (
          <span className="transition-all duration-300 ease-in-out cursor-pointer hover:text-gray-700">
            {value || placeholder || "No information provided"}
          </span>
        )}
      </div>
    </div>
  </div>
);
function Profile() {
  const { t } = useTranslation();
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [update, setUpdate] = useState(false);
  const [editingFields, setEditingFields] = useState({
    about_me: false,
    website_address: false,
  });
  const [formData, setFormData] = useState({
    about_me: "",
    website_address: "",
  });
  const getProfileData = async () => {
    setIsLoading(true);
    try {
      const res = await GetProfile();
      const profileData = res?.data;
      setData(profileData);
      // Initialize form data with current values
      setFormData({
        about_me: profileData?.about_me || "",
        website_address: profileData?.website_address || "",
      });
    } catch (error) {
      setErrorFn(error);
    } finally {
      setIsLoading(false);
    }
  };
  // Toggle edit mode for a field
  const toggleEdit = (fieldName) => {
    setEditingFields((prev) => ({
      ...prev,
      [fieldName]: !prev[fieldName],
    }));
  };

  // Handle input change
  const handleInputChange = (fieldName, value) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: value,
    }));
  };

  // Save changes for a field (only update local state, actual save happens on "Update Profile")
  const saveField = (fieldName) => {
    setData((prev) => ({
      ...prev,
      [fieldName]: formData[fieldName],
    }));
    toggleEdit(fieldName);

    // Show a subtle feedback
    toast.info(
      "Changes ready to save. Click 'Update Profile' to save all changes.",
      {
        autoClose: 2000,
        position: "bottom-right",
      }
    );
  };

  // Cancel edit
  const cancelEdit = (fieldName) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: data?.[fieldName] || "",
    }));
    toggleEdit(fieldName);
  };

  const handleEditUserInfo = async () => {
    const updateData = {
      about_me: formData?.about_me,
      website_address: formData?.website_address,
    };
    // console.log(updateData, "updateData ");
    setIsLoading(true);
    try {
      await UpdatePatchProfile(updateData);
      toast.success(t("Profile updated successfully"));
      setUpdate(!update);
    } catch (err) {
      setErrorFn(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getProfileData();
  }, [update]);
  const isButtonDisabled =
    !editingFields.about_me || !editingFields.website_address || isLoading;

  return (
    <div className="space-y-6 my-5 p-1">
      {isLoading && <Loader />}
      <div className="grid grid-cols-12 gap-6">
        {/* Left profile card */}
        <section className="col-span-12 md:col-span-4 lg:col-span-3">
          <div className="rounded-xl border bg-card p-6">
            <div className="flex flex-col items-center text-center">
              <Avatar className="h-16 w-16">
                <AvatarImage src={data?.avatar || userAvatar} alt="avatar" />
                <AvatarFallback>
                  {data?.display_name?.slice(0, 2)?.toUpperCase() || "NA"}
                </AvatarFallback>
              </Avatar>
              <div className="mt-4 text-xs font-semibold">
                {data?.display_name || data?.username || "Unknown"}
              </div>
              <div className="text-[11px] text-[#5B6B79]">
                {data?.profession_name || "Not specified"}
              </div>
            </div>

            <Separator className="my-6" />

            <div className="grid grid-cols-3 gap-3">
              <Stat label="Publications" value={data?.publications || "0"} />
              <Stat label="Followers" value={data?.followers || "0"} />
              <Stat label="Following" value={data?.following || "0"} />
            </div>

            <Separator className="my-6" />

            <dl className="space-y-4 text-sm">
              <div className="flex items-start justify-between gap-4">
                <dt className="flex items-center gap-2 text-[11px] text-[#5B6B79]">
                  <Mail className="h-4 w-4" /> {t("Email")}
                </dt>
                <dd className="text-[11px] truncate text-[#1D2630] text-right">
                  {data?.email}
                </dd>
              </div>

              <div className="flex items-start justify-between gap-4">
                <dt className="flex items-center gap-2 text-[#5B6B79]">
                  <Phone className="h-4 w-4" /> {t("Phone no")}
                </dt>
                <dd className="text-[11px] text-[#1D2630] truncate text-right">
                  {data?.mobile_number}
                </dd>
              </div>

              <div className="flex items-start justify-between gap-4">
                <dt className="flex items-center gap-2 text-[#5B6B79]">
                  <MapPin className="h-4 w-4" /> {t("Location")}
                </dt>
                <dd className="text-[11px] text-[#1D2630] truncate text-right">
                  {data?.country}
                </dd>
              </div>
            </dl>
          </div>
        </section>

        {/* Right content */}
        <section className="col-span-12 md:col-span-8 lg:col-span-9 space-y-4">
          {/* About me */}
          <div className="rounded-xl border bg-card">
            <div className="border-b px-6 py-4 font-semibold">About me</div>
            <div className="px-6 py-5">
              <EditableField
                label=""
                value={
                  editingFields.about_me ? formData.about_me : data?.about_me
                }
                isEditing={editingFields.about_me}
                onEdit={() => toggleEdit("about_me")}
                onSave={() => saveField("about_me")}
                onCancel={() => cancelEdit("about_me")}
                onChange={(value) => handleInputChange("about_me", value)}
                multiline={true}
                placeholder="Tell us about yourself..."
              />
            </div>
          </div>

          {/* Personal details */}
          <div className="rounded-xl border bg-card">
            <div className="border-b px-6 py-4 text-sm font-semibold">
              {t("Personal Details")}
            </div>
            <div className="px-6 py-5">
              <div className="grid grid-cols-12 gap-6">
                <div className="col-span-12 space-y-5">
                  <Labeled label="Full Name">
                    {`${data?.first_name || ""} ${data?.last_name || ""}`}
                  </Labeled>
                  <Separator />

                  <Labeled label="Phone">{data?.mobile_number}</Labeled>
                  <Separator />

                  <div className="grid grid-cols-7 gap-4 items-center">
                    <div className="col-span-3">
                      <EditableField
                        label="Website"
                        value={
                          editingFields.website_address
                            ? formData.website_address
                            : data?.website_address
                        }
                        isEditing={editingFields.website_address}
                        onEdit={() => toggleEdit("website_address")}
                        onSave={() => saveField("website_address")}
                        onCancel={() => cancelEdit("website_address")}
                        onChange={(value) =>
                          handleInputChange("website_address", value)
                        }
                        placeholder="example: https://yourwebsite.com"
                      />
                    </div>
                    <div className="col-span-3">
                      <Labeled label="Email">{data?.email}</Labeled>
                    </div>
                  </div>

                  <Separator />
                  <Labeled label="Address">{data?.address_details}</Labeled>
                </div>
              </div>
            </div>
          </div>

          {/* Show update button only if there are unsaved changes */}
          {(data?.about_me !== formData.about_me ||
            data?.website_address !== formData.website_address) && (
            <div className="mx-5 mb-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-700">
                You have unsaved changes. Click "Update Profile" to save them.
              </p>
            </div>
          )}

          <button
            onClick={handleEditUserInfo}
            disabled={isButtonDisabled}
            aria-disabled={isButtonDisabled}
            className={`block m-5 ml-auto rounded-full p-2 font-semibold px-7 transition-all duration-200 ${
              isButtonDisabled
                ? " bg-gray-300 text-gray-700 cursor-not-allowed opacity-80"
                : "cursor-pointer bg-[#4680FF] text-white hover:bg-[#3d70e0] hover:scale-105 transform"
            }`}
          >
            {isLoading ? "Updating..." : t("Update Profile")}
          </button>
        </section>
      </div>
    </div>
  );
}

export default Profile;
