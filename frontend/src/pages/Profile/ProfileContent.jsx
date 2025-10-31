import React, { useState, useEffect } from "react";

import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Profile from "@/components/ForPages/Profile/Profile";
import Archives from "@/components/ForPages//Profile/Archives/Archives";
import Interactions from "@/components/ForPages//Profile/Interactions/Interactions";

function ProfileContent() {
  const { t, i18n } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const { id: paramId } = useParams();
  const [userId, setUserId] = useState(null);
  useEffect(() => {
    const user = localStorage.getItem("userId");
    setUserId(user);
  }, [paramId]);
  console.log(userId);
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
              value="profile"
              className="gap-2 pb-3 rounded-none data-[state=active]:text-[#4680FF] data-[state=active]:border-b-2 data-[state=active]:border-b-[#4680FF] data-[state=active]:shadow-none"
            >
              <img
                src="/icons/bothColorUser.png"
                alt="user"
                className="w-3 h-3"
              />
              <span className="text-sm">{t("Profile")}</span>
            </TabsTrigger>
            {/* <TabsTrigger
              value="archives"
              className="gap-2 pb-3 rounded-none data-[state=active]:text-[#4680FF] data-[state=active]:border-b-2 data-[state=active]:border-b-[#4680FF] data-[state=active]:shadow-none"
            >
              <img src="/icons/Union.png" alt="user" className="w-3 h-3" />
              <span className="text-sm">{t("Archives")}</span>
            </TabsTrigger>
            <TabsTrigger
              value="interactions"
              className="gap-2 pb-3 rounded-none data-[state=active]:text-[#4680FF] data-[state=active]:border-b-2 data-[state=active]:border-b-[#4680FF] data-[state=active]:shadow-none"
            >
              <img
                src="/icons/Interactions.png"
                alt="user"
                className="w-3 h-3"
              />
              <span className="text-sm">{t("Interactions")}</span>
            </TabsTrigger> */}
          </TabsList>

          <TabsContent value="profile">
            <Profile userId={paramId || userId} myUserId={userId} />
          </TabsContent>
          {/* <TabsContent value="archives">
            <Archives />
          </TabsContent>
          <TabsContent value="interactions">
            <Interactions />
          </TabsContent> */}
        </Tabs>
        {/* End Tabs */}
      </div>
    </div>
  );
}

export default ProfileContent;
