import React, { useEffect, useState } from "react";

import { useTranslation } from "react-i18next";

import TabsSection from "@/components/ForPages/AboutUs/Team/TabsSection/TabsSection";
import { filterPositions, GetTeam } from "@/api/aboutUs";
import Loader from "@/components/Global/Loader/Loader";
import MemberCard from "@/components/ForPages/AboutUs/Team/MemberCard/MemberCard";

function AboutTeamContent() {
  const [activeTab, setActiveTab] = useState(() => {
    // استرجاع التاب المحفوظ من localStorage
    return localStorage.getItem("teamActiveTab") || "All";
  });
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation();
  const [groupedData, setGroupedData] = useState({});

  const groupByPosition = (data) => {
    return data.reduce((acc, item) => {
      const key = item.position?.name || "غير محدد";

      if (!acc[key]) {
        acc[key] = [];
      }

      acc[key].push(item);
      return acc;
    }, {});
  };

  const getTeamData = async () => {
    setIsLoading(true);
    try {
      if (activeTab === "All") {
        const res = await GetTeam(100, 0);
        const results = res.data.results || [];

        setGroupedData(groupByPosition(results));
        setIsLoading(false);
        return;
      }

      const res = await filterPositions(activeTab);
      const results = res.data || [];

      setGroupedData(groupByPosition(results));
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // حفظ التاب النشط في localStorage عند التغيير
    localStorage.setItem("teamActiveTab", activeTab);
    getTeamData();
  }, [activeTab]);

  return (
    <div className="max-w-7xl mx-auto lg:p-6 pt-0">
      {isLoading && <Loader />}

      <div className="text-3xl md:text-4xl lg:text-5xl font-semibold text-gray-900 mb-6 md:mb-8 tracking-tight text-center">
        {t("About Us Team Function")}
      </div>

      <TabsSection activeTab={activeTab} setActiveTab={setActiveTab} />

      {Object.keys(groupedData).map((posName) => (
        <div key={posName} className="mb-10 w-full">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">{posName}</h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 justify-items-center">
            {groupedData[posName].map((member) => (
              <MemberCard key={member.id} member={member} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default AboutTeamContent;
