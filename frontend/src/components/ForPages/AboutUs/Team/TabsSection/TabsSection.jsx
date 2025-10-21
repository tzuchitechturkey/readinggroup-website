import React, { useEffect, useState } from "react";

import { GetAllPositions, GetPositions } from "@/api/aboutUs";

function TabsSection({ activeTab, setActiveTab }) {
  const [positionData, setPositionData] = useState([{ name: "All" }]);
  const getPositions = async () => {
    try {
      const res = await GetAllPositions();
      setPositionData([{ name: "All" }, ...(res?.data?.results || [])]);
    } catch (err) {
      console.error(err);
    }
  };
  useEffect(() => {
    getPositions();
  }, []);
  return (
    <div className="mb-6 md:mb-8">
      {/* Desktop and Tablet Tabs */}
      <div className="hidden sm:flex flex-wrap border-b border-gray-200">
        {positionData.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.name)}
            className={`px-4 md:px-6 py-3 text-sm md:text-base font-bold transition-colors duration-200 border-b-2 ${
              activeTab === tab.name
                ? "text-blue-600 border-blue-600"
                : "text-gray-700 border-transparent hover:text-blue-600 hover:border-blue-300"
            }`}
            style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
          >
            {tab.name}
          </button>
        ))}
      </div>

      {/* Mobile Free Scroll Tabs */}
      <div className="sm:hidden border-b border-gray-200">
        <div className="overflow-x-auto scrollbar-hide scroll-smooth">
          <div className="flex space-x-2 min-w-max px-4 pb-1">
            {positionData.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.name)}
                className={`flex-shrink-0 px-5 py-3 text-sm font-bold transition-all duration-200 border-b-2 whitespace-nowrap rounded-t-lg ${
                  activeTab === tab.name
                    ? "text-blue-600 border-blue-600 bg-blue-50"
                    : "text-gray-700 border-transparent hover:text-blue-600 hover:border-blue-300 hover:bg-gray-50"
                }`}
                style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
              >
                {tab.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default TabsSection;
