import React, { useState } from "react";

import { useTranslation } from "react-i18next";

import AboutTeamContent from "./Team/TeamContent";
import AboutHistoryContent from "./History/HistoryContent";

function AboutUsContent() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("history");

  const tabs = [
    { id: "history", label: "History" },
    { id: "our_team", label: "Our Team" },
  ];

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Start Tabs */}
      <div className="mb-8">
        <div className="flex flex-wrap border-b border-gray-200">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 text-base font-bold transition-colors duration-200 border-b-2 ${
                activeTab === tab.id
                  ? "text-blue-600 border-blue-600"
                  : "text-gray-700 border-transparent hover:text-blue-600 hover:border-blue-300"
              }`}
              style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
            >
              {t(tab.label, { defaultValue: tab.label })}
            </button>
          ))}
        </div>
      </div>
      {/* End Tabs */}

      {/* Start Tab Content */}
      <div className="space-y-12">
        {activeTab === "history" && <AboutHistoryContent />}
        {activeTab === "our_team" && <AboutTeamContent />}
      </div>
      {/* End Tab Content */}
    </div>
  );
}

export default AboutUsContent;
