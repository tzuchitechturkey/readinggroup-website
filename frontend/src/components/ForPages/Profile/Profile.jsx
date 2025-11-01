import React, { useEffect, useState } from "react";

import { Mail, MapPin } from "lucide-react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { FiUserPlus, FiUserX } from "react-icons/fi";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  ChangeFriendRequestStatus,
  GetFriendRequests,
  GetUserProfile,
  SendFriendRequest,
  UpdatePatchProfile,
} from "@/api/auth";
import { setErrorFn } from "@/Utility/Global/setErrorFn";
import Loader from "@/components/Global/Loader/Loader";
import { BASE_URL } from "@/configs";

import EditableField from "./EditableField/EditableField";
import Labeled from "./Labeled/Labeled";
import Stat from "./Stat/Stat";

function Profile({ userId, myUserId }) {
  const { t, i18n } = useTranslation();
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [update, setUpdate] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [friendRequests, setFriendRequests] = useState([]);
  const [editingFields, setEditingFields] = useState({
    about_me: false,
    website_address: false,
  });
  const [formData, setFormData] = useState({
    about_me: "",
    website_address: "",
  });

  const getProfileData = async () => {
    if (!userId) return;
    setIsLoading(true);
    try {
      const res = await GetUserProfile(userId);
      const profileData = res?.data;
      setData(profileData);
      // Initialize form data with current values
      setFormData({
        about_me: profileData?.about_me || "",
        website_address: profileData?.website_address || "",
      });
      setHasUnsavedChanges(false);
    } catch (error) {
      // console.log(error);
      setErrorFn(error, t);
    } finally {
      setIsLoading(false);
    }
  };
  const getRequestsData = async () => {
    if (!userId) return;
    try {
      const res = await GetFriendRequests(userId);
      setFriendRequests(res?.data || { incoming: [], outgoing: [] });
    } catch (error) {
      setErrorFn(error, t);
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
    setHasUnsavedChanges(true);

    // Show a subtle feedback
    toast.info(
      t("Changes ready to save. Click 'Update Profile' to save all changes."),
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
    setIsLoading(true);
    try {
      await UpdatePatchProfile(updateData);
      toast.success(t("Profile updated successfully"));
      setHasUnsavedChanges(false);
      setUpdate(!update);
    } catch (err) {
      setErrorFn(err, t);
    } finally {
      setIsLoading(false);
    }
  };
  const handleFollow = async (followUserId) => {
    setIsLoading(true);
    try {
      if (data?.friend_request_status) {
        await SendUnFollowRequest({ to_user: followUserId });
        toast.success(t("Unfollowed successfully"));
      } else {
        await SendFriendRequest({ to_user: followUserId });
        toast.success(t("Friend request sent successfully"));
      }
    } catch (error) {
      setErrorFn(error, t);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Friend Request Action (Accept or Reject)
  const handleFriendRequestAction = async (requestId, action) => {
    setIsLoading(true);
    try {
      await ChangeFriendRequestStatus(requestId, action);

      if (action === "accept") {
        toast.success(t("Friend request accepted"));
      } else if (action === "reject") {
        toast.success(t("Friend request rejected"));
      }

      // Refresh friend requests data
      await getRequestsData();
      setUpdate(!update);
    } catch (error) {
      setErrorFn(error, t);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    getProfileData();
    getRequestsData();
  }, [userId, update]);
  return (
    <div
      className="space-y-6 my-5 p-1"
      dir={i18n?.language === "ar" ? "rtl" : "ltr"}
    >
      {isLoading && <Loader />}
      <div className="grid grid-cols-12 gap-6">
        {/* Left profile card */}
        <section className="col-span-12 md:col-span-4 lg:col-span-3">
          <div className="rounded-xl border bg-card p-6 p">
            <div className="flex flex-col items-center text-center">
              <Avatar className="h-16 w-16">
                <AvatarImage
                  src={
                    data?.profile_image
                      ? `${BASE_URL}/${data.profile_image}`
                      : data?.profile_image_url || "/fake-user.png"
                  }
                  alt="avatar"
                />
                <AvatarFallback>
                  {data?.display_name?.slice(0, 2)?.toUpperCase() || "NA"}
                </AvatarFallback>
              </Avatar>
              <div className="mt-4 text-xs border font-semibold">
                <span>{data?.display_name}</span>
              </div>
              <div className="text-[11px] border text-[#5B6B79] my-2">
                {data?.profession_name || "Not specified"}
              </div>
              {+userId !== +myUserId && (
                <button
                  onClick={() => handleFollow(userId)}
                  className="text-blue-400 hover:text-blue-700 mx-6 transition-all duration-200 flex items-center gap-1 mt-3 border px-3 py-1 rounded-full hover:bg-blue-50"
                >
                  {data?.friend_request_status ? (
                    <>
                      <FiUserX className="w-4 h-4" />
                      <span className="text-sm font-medium">
                        {t("Unfollow")}
                      </span>
                    </>
                  ) : (
                    <>
                      <FiUserPlus className="w-4 h-4" />
                      <span className="text-sm font-medium">{t("Follow")}</span>
                    </>
                  )}
                </button>
              )}
            </div>

            <Separator className="mb-6 mt-4" />

            <div className="grid grid-cols-3 gap-3">
              <Stat
                label={t("Publications")}
                value={data?.posts_count || "0"}
              />
              <Stat
                label={t("Followers")}
                value={data?.followers_count || "0"}
              />
              <Stat
                label={t("Following")}
                value={data?.following_count || "0"}
              />
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
            <div className="border-b px-6 py-4 font-semibold">
              {t("About me")}
            </div>
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
                placeholder={
                  userId !== myUserId ? t("-") : t("Tell us about yourself...")
                }
                disabled={userId !== myUserId}
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
                  <Labeled label={t("User Name")}>{data?.username}</Labeled>
                  <Separator />

                  <Labeled label={t("Phone")}>{data?.mobile_number}</Labeled>
                  <Separator />

                  <div className="grid grid-cols-7 gap-4 items-center">
                    <div className="col-span-3">
                      <EditableField
                        label={t("Website")}
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
                        placeholder={
                          userId !== myUserId
                            ? t("-")
                            : t("example: https://yourwebsite.com")
                        }
                        disabled={userId !== myUserId}
                      />
                    </div>
                    <div className="col-span-3">
                      <Labeled label={t("Email")}>{data?.email}</Labeled>
                    </div>
                  </div>

                  <Separator />
                  <Labeled label={t("Address")}>
                    {data?.address_details}
                  </Labeled>
                </div>
              </div>
            </div>
          </div>

          {/* Show update button only if there are unsaved changes */}
          {hasUnsavedChanges && (
            <div className="mx-5 mb-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-700">
                {t(
                  "You have unsaved changes. Click 'Update Profile' to save them."
                )}
              </p>
            </div>
          )}
          {+userId === +myUserId && (
            <button
              onClick={handleEditUserInfo}
              disabled={!hasUnsavedChanges || isLoading}
              aria-disabled={!hasUnsavedChanges || isLoading}
              className={`block m-5 ml-auto rounded-full p-2 font-semibold px-7 transition-all duration-200 ${
                !hasUnsavedChanges || isLoading
                  ? " bg-gray-300 text-gray-700 cursor-not-allowed opacity-80"
                  : "cursor-pointer bg-[#4680FF] text-white hover:bg-[#3d70e0] hover:scale-105 transform"
              }`}
            >
              {isLoading ? "Updating..." : t("Update Profile")}
            </button>
          )}
          {/* Start Friend Requests Section - Only show for own profile */}
          {+userId === +myUserId &&
            (friendRequests?.incoming?.filter((req) => req.status === "PENDING")
              .length > 0 ||
              friendRequests?.outgoing?.filter(
                (req) => req.status === "PENDING"
              ).length > 0) && (
              <div className="rounded-xl border bg-card mt-6">
                <div className="border-b px-6 py-4 font-semibold">
                  {t("Friend Requests")}
                </div>
                <div className="px-6 py-5 space-y-6">
                  {/* Incoming Requests */}
                  {friendRequests?.incoming?.filter(
                    (req) => req.status === "PENDING"
                  ).length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold text-gray-700 mb-3">
                        {t("Incoming Requests")} (
                        {
                          friendRequests.incoming.filter(
                            (req) => req.status === "PENDING"
                          ).length
                        }
                        )
                      </h4>
                      <div className="space-y-3">
                        {friendRequests.incoming
                          .filter((request) => request.status === "PENDING")
                          .map((request) => (
                            <div
                              key={request.id}
                              className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-100 hover:shadow-sm transition-shadow"
                            >
                              <div className="flex items-center gap-3">
                                <Avatar className="h-10 w-10">
                                  <AvatarImage
                                    src={
                                      request.from_user?.profile_image
                                        ? `${BASE_URL}/${request.from_user.profile_image}`
                                        : request.from_user
                                            ?.profile_image_url ||
                                          "/fake-user.png"
                                    }
                                    alt={
                                      request.from_user?.display_name ||
                                      request.from_user?.username
                                    }
                                  />
                                  <AvatarFallback>
                                    {(
                                      request.from_user?.display_name ||
                                      request.from_user?.username
                                    )
                                      ?.slice(0, 2)
                                      ?.toUpperCase() || "NA"}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="text-sm font-semibold text-gray-900">
                                    {request.from_user?.display_name ||
                                      request.from_user?.first_name ||
                                      request.from_user?.username}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    @{request.from_user?.username}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() =>
                                    handleFriendRequestAction(
                                      request.id,
                                      "accept"
                                    )
                                  }
                                  className="px-3 py-1.5 bg-green-500 text-white text-xs font-medium rounded-lg hover:bg-green-600 transition-colors"
                                >
                                  {t("Accept")}
                                </button>
                                <button
                                  onClick={() =>
                                    handleFriendRequestAction(
                                      request.id,
                                      "reject"
                                    )
                                  }
                                  className="px-3 py-1.5 bg-red-500 text-white text-xs font-medium rounded-lg hover:bg-red-600 transition-colors"
                                >
                                  {t("Reject")}
                                </button>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  )}

                  {/* Outgoing Requests */}
                  {/* {friendRequests?.outgoing?.length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold text-gray-700 mb-3">
                        {t("Sent Requests")} ({friendRequests.outgoing.length})
                      </h4>
                      <div className="space-y-3">
                        {friendRequests.outgoing.map((request) => (
                          <div
                            key={request.id}
                            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200 hover:shadow-sm transition-shadow"
                          >
                            <div className="flex items-center gap-3">
                              <Avatar className="h-10 w-10">
                                <AvatarImage src="/fake-user.png" alt="User" />
                                <AvatarFallback>
                                  {t("User")?.slice(0, 2)?.toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="text-sm font-semibold text-gray-900">
                                  {t("User")} #{request.to_user}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {t("Status")}:{" "}
                                  <span className="font-medium text-yellow-600">
                                    {request.status}
                                  </span>
                                </p>
                              </div>
                            </div>
                            <button
                              onClick={() => {
                              }}
                              className="px-3 py-1.5 bg-red-500 text-white text-xs font-medium rounded-lg hover:bg-red-600 transition-colors"
                            >
                              {t("Cancel")}
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )} */}
                </div>
              </div>
            )}
          {/* End Friend Requests Section - Only show for own profile */}
        </section>
      </div>
    </div>
  );
}

export default Profile;
