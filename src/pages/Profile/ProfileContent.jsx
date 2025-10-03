import React, { useState } from "react";

import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Profile from "@/components/ForPages/Profile/Profile";
import Archives from "@/components/ForPages//Profile/Archives/Archives";
import Interactions from "@/components/ForPages//Profile/Interactions/Interactions";
import { resolveAsset } from "@/utils/assetResolver";

function ProfileContent() {
  const { t } = useTranslation();
  const [isLoading, setisLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");

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
              value="profile"
              className="gap-2 pb-3 rounded-none data-[state=active]:text-[#4680FF] data-[state=active]:border-b-2 data-[state=active]:border-b-[#4680FF] data-[state=active]:shadow-none"
            >
              <img
                src={resolveAsset("icons/bothColorUser.png")}
                alt="user"
                className="w-3 h-3"
              />
              <span className="text-sm">{t("Profile")}</span>
            </TabsTrigger>
            <TabsTrigger
              value="archives"
              className="gap-2 pb-3 rounded-none data-[state=active]:text-[#4680FF] data-[state=active]:border-b-2 data-[state=active]:border-b-[#4680FF] data-[state=active]:shadow-none"
            >
              <img
                src={resolveAsset("icons/Union.png")}
                alt="user"
                className="w-3 h-3"
              />
              <span className="text-sm">{t("Archives")}</span>
            </TabsTrigger>
            <TabsTrigger
              value="interactions"
              className="gap-2 pb-3 rounded-none data-[state=active]:text-[#4680FF] data-[state=active]:border-b-2 data-[state=active]:border-b-[#4680FF] data-[state=active]:shadow-none"
            >
              <img
                src={resolveAsset("icons/Interactions.png")}
                alt="user"
                className="w-3 h-3"
              />
              <span className="text-sm">{t("Interactions")}</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <Profile />
          </TabsContent>
          <TabsContent value="archives">
            <Archives />
          </TabsContent>
          <TabsContent value="interactions">
            <Interactions />
          </TabsContent>
        </Tabs>
        {/* End Tabs */}
      </div>
    </div>
  );
}

export default ProfileContent;
