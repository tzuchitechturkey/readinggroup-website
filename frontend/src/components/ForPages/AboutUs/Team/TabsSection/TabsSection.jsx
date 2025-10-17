import React from "react";

function TabsSection({ activeTab, setActiveTab }) {
  const tabs = [
    { id: "all", label: "All members" },
    { id: "programmers", label: "Programmers team" },
    { id: "media", label: "Media team" },
    { id: "photographers", label: "Photographers team" },
    { id: "reading", label: "Reading team" },
  ];
  return (
    <div className="mb-6 md:mb-8">
      {/* Desktop and Tablet Tabs */}
      <div className="hidden sm:flex flex-wrap border-b border-gray-200">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 md:px-6 py-3 text-sm md:text-base font-bold transition-colors duration-200 border-b-2 ${
              activeTab === tab.id
                ? "text-blue-600 border-blue-600"
                : "text-gray-700 border-transparent hover:text-blue-600 hover:border-blue-300"
            }`}
            style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Mobile Free Scroll Tabs */}
      <div className="sm:hidden border-b border-gray-200">
        <div className="overflow-x-auto scrollbar-hide scroll-smooth">
          <div className="flex space-x-2 min-w-max px-4 pb-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-shrink-0 px-5 py-3 text-sm font-bold transition-all duration-200 border-b-2 whitespace-nowrap rounded-t-lg ${
                  activeTab === tab.id
                    ? "text-blue-600 border-blue-600 bg-blue-50"
                    : "text-gray-700 border-transparent hover:text-blue-600 hover:border-blue-300 hover:bg-gray-50"
                }`}
                style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default TabsSection;
