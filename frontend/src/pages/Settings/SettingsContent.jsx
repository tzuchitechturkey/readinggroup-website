import React, { useEffect, useState } from "react";

import { useTranslation } from "react-i18next";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EditProfile from "@/components/ForPages/Settings/EditProfile/EditProfile";
import ChangePassword from "@/components/ForPages/Settings/ChangePassword/ChangePassword";

function SettingsContent() {
  const { t, i18n } = useTranslation();
  const [activeTab, setActiveTab] = useState("editProfile");
  const [userType, setUserType] = useState("user");
  useEffect(() => {
    const storedUserType = localStorage.getItem("userType");
    if (storedUserType) {
      setUserType(storedUserType);
    }
  }, []);
  return (
    <div>
      <div
        className="w-full bg-[#fff] rounded-lg p-3 pb-6 relative text-[#1E1E1E] flex flex-col"
        dir={i18n?.language === "ar" ? "rtl" : "ltr"}
      >
        {/* Start Tabs */}
        <Tabs
          value={activeTab}
          onValueChange={(val) => setActiveTab(val)}
          className=" "
          dir={i18n?.language === "ar" ? "rtl" : "ltr"}
        >
          <TabsList className="bg-white shadow-none">
            <TabsTrigger
              value="editProfile"
              className="gap-2 2 pb-3  rounded-none data-[state=active]:text-[#4680FF] data-[state=active]:border-b-2 data-[state=active]:border-b-[#4680FF] data-[state=active]:shadow-none transition-colors duration-200 hover:text-[#2563eb]"
            >
              <img
                src="/icons/bothColorUser.png"
                alt="user"
                className="w-3 h-3"
              />
              <span className="text-sm">{t("Edit Profile")}</span>
            </TabsTrigger>
            <TabsTrigger
              value="changePassword"
              className="gap-2 2 pb-3  rounded-none data-[state=active]:text-[#4680FF] data-[state=active]:border-b-2 data-[state=active]:border-b-[#4680FF] data-[state=active]:shadow-none transition-colors duration-200 hover:text-[#2563eb]"
            >
              <img
                src="/icons/security-safe.png"
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
    </div>
  );
}

export default SettingsContent;
