import React, { useState } from "react";

import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EditProfile from "@/components/ForPages/Settings/EditProfile/EditProfile";
import ChangePassword from "@/components/ForPages/Settings/ChangePassword/ChangePassword";
import { resolveAsset } from "@/utils/assetResolver";

function SettingsContent() {
  const { t } = useTranslation();
  const [isLoading, setisLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("editProfile");
  const [userType, setUserType] = useState("user");
  const handleChangePassword = async () => {
    toast.success(t("Updated Profile Successfuly"));

    // setisLoading(true);
    // try {
    //   // const res = await EditUserInfo()
    //   // console.log(res?.data?.data)
    //   toast.success(t("Updated Profile Successfuly"));
    // } catch (err) {
    //   console.log(err);
    //   toast.error(t("Field Updated Profile"));
    // } finally {
    //   setisLoading(false);
    // }
  };
  const handleEditUserInfo = async () => {
    toast.success(t("Updated Profile Successfuly"));

    // setisLoading(true);
    // try {
    //   // const res = await EditUserInfo()
    //   // console.log(res?.data?.data)
    //   toast.success(t("Updated Profile Successfuly"));
    // } catch (err) {
    //   console.log(err);
    //   toast.error(t("Field Updated Profile"));
    // } finally {
    //   setisLoading(false);
    // }
  };
  return (
    <div>
      <div className="w-full bg-[#fff] rounded-lg p-3 pb-6 relative text-[#1E1E1E] flex flex-col">
        {/* Start Tabs */}
        <Tabs
          value={activeTab}
          onValueChange={(val) => setActiveTab(val)}
          className=" "
        >
          <TabsList className="bg-white shadow-none">
            <TabsTrigger
              value="editProfile"
              className="gap-2 2 pb-3  rounded-none data-[state=active]:text-[#4680FF] data-[state=active]:border-b-2 data-[state=active]:border-b-[#4680FF] data-[state=active]:shadow-none"
            >
              <img
                src={resolveAsset("icons/bothColorUser.png")}
                alt="user"
                className="w-3 h-3"
              />
              <span className="text-sm">{t("Edit Profile")}</span>
            </TabsTrigger>
            <TabsTrigger
              value="changePassword"
              className="gap-2 2 pb-3  rounded-none data-[state=active]:text-[#4680FF] data-[state=active]:border-b-2 data-[state=active]:border-b-[#4680FF] data-[state=active]:shadow-none"
            >
              <img
                src={resolveAsset("icons/security-safe.png")}
                alt="user"
                className="w-3 h-3"
              />
              <span className="text-sm">{t("Change Password")}</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="editProfile">
            <EditProfile />
          </TabsContent>
          <TabsContent value="changePassword">
            <ChangePassword userType={userType} />
          </TabsContent>
        </Tabs>
        {/* End Tabs */}
      </div>

      <button
        onClick={() => {
          if (activeTab === "editProfile") {
            handleEditUserInfo();
          } else {
            handleChangePassword();
          }
        }}
        className={`block ${
          userType === "admin" && "m-5"
        }  ml-auto bg-[#4680FF] text-white rounded-full p-2 font-semibold px-7`}
      >
        {activeTab === "editProfile" ? t("Save") : t("Save Password")}
      </button>
    </div>
  );
}

export default SettingsContent;
