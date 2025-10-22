import React, { useEffect, useState } from "react";

import { useTranslation } from "react-i18next";

import TabsSection from "@/components/ForPages/AboutUs/Team/TabsSection/TabsSection";
import { filterPositions } from "@/api/aboutUs";
import Loader from "@/components/Global/Loader/Loader";
import MemberCard from "@/components/ForPages/AboutUs/Team/MemberCard/MemberCard";

function AboutTeamContent() {
  const [activeTab, setActiveTab] = useState("all");
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation();
  const [teamData, setTeamData] = useState([]);
  const getTeamData = async () => {
    setIsLoading(true);
    try {
      const res = await filterPositions(activeTab);
      setTeamData(res.data?.results || []);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    getTeamData();
  }, [activeTab]);
  return (
    <div className="max-w-7xl mx-auto lg:p-6 pt-0">
      {isLoading && <Loader />}
      {/* Start Title */}
      <div className="text-3xl md:text-4xl lg:text-5xl font-semibold text-gray-900 mb-6 md:mb-8 tracking-tight text-center">
        {t("About Us Team Function")}
      </div>
      {/* End Title */}

      {/* Start Tabs */}
      <TabsSection activeTab={activeTab} setActiveTab={setActiveTab} />
      {/* End Tabs */}

      {/* Start Tab Content */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 justify-items-center">
        {teamData?.map((member) => (
          <MemberCard key={member.id} member={member} />
        ))}
      </div>
      {/* End Tab Content */}
    </div>
  );
}

export default AboutTeamContent;
