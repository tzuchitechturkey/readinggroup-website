import React, { useState, useEffect } from "react";

import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";

import AboutTeamContent from "./Team/TeamContent";
import AboutHistoryContent from "./History/HistoryContent";
import BookContent from "./Book/BookContent";

function AboutUsContent({ activeTab: initialTab }) {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const tabFromNav = location.state?.activeTab || initialTab;

  const [activeTab, setActiveTab] = useState(() => {
    if (tabFromNav) {
      return tabFromNav;
    }
    return localStorage.getItem("aboutUsMainTab") || "history";
  });

  const tabs = [
    { id: "history", label: "History" },
    { id: "our_team", label: "Our Team" },
    { id: "functions", label: "Team Functions" },
    { id: "book", label: "Book" },
  ];

  useEffect(() => {
    localStorage.setItem("aboutUsMainTab", activeTab);
  }, [activeTab]);

  useEffect(() => {
    if (tabFromNav && tabFromNav !== activeTab) {
      setActiveTab(tabFromNav);
    }
  }, [tabFromNav]);

  return (
    <div
      className="min-h-screen bg-slate-50 overflow-hidden"
      dir={i18n?.language === "ar" ? "rtl" : "ltr"}
    >
      {activeTab !== "history" && activeTab !== "our_team" && activeTab !== "book" && (
        <>
          {/* Premium Hero Section */}
          <div className="relative h-[300px] md:h-[400px] bg-[#5e82ab] flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-[#5e82ab] to-[#3a5a7d] opacity-90" />
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
              <div className="absolute top-[-10%] right-[-5%] w-[400px] h-[400px] bg-white/10 rounded-full blur-3xl animate-pulse" />
              <div className="absolute bottom-[-15%] left-[-10%] w-[500px] h-[500px] bg-blue-400/10 rounded-full blur-3xl animate-pulse delay-700" />
            </div>
            
            <div className="relative z-10 text-center px-4">
              <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-4 tracking-tight drop-shadow-lg">
                {t("About Us")}
              </h1>
              <p className="text-blue-100 text-lg md:text-xl max-w-2xl mx-auto font-light">
                {t("Learn more about our mission, history, and the dedicated team driving our platform.")}
              </p>
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-4 md:px-6 -mt-12 md:-mt-16 relative z-20">
            {/* Glassmorphic Tabs Container */}
            <div className="bg-white/80 backdrop-blur-xl border border-white/40 shadow-2xl rounded-3xl p-2 mb-12">
              <div className="flex flex-wrap items-center justify-center gap-2">
                {tabs.map((tab) => (activeTab === tab.id ? (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className="px-8 py-4 bg-[#5e82ab] text-white rounded-2xl font-bold shadow-lg shadow-blue-500/30 transition-all duration-300 scale-105"
                  >
                    {t(tab.label)}
                  </button>
                ) : (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className="px-8 py-4 text-gray-600 hover:text-[#5e82ab] hover:bg-blue-50 rounded-2xl font-semibold transition-all duration-300"
                  >
                    {t(tab.label)}
                  </button>
                )))}
              </div>
            </div>
          </div>
        </>
      )}

      {/* When our_team or book is active, it renders outside the padded wrapper to allow full width */}
      {activeTab === "our_team" ? (
         <div className="w-full">
            <AboutTeamContent />
         </div>
      ) : activeTab === "book" ? (
         <div className="w-full">
            <BookContent />
         </div>
      ) : activeTab === "history" ? (
         <div className="w-full">
            <AboutHistoryContent />
         </div>
      ) : (
        <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-20 pb-20">
          {/* Dynamic Content Section with Fade-in Animation */}
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
            {activeTab === "functions" && (
              <div className="py-10 text-center">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">{t("Team Functions")}</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {/* Visualizing some placeholders for Team Functions based on Figma titles */}
                  <div className="bg-white p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-shadow duration-300 border border-slate-100">
                    <div className="w-16 h-16 bg-blue-100 text-[#5e82ab] rounded-2xl flex items-center justify-center mb-6 mx-auto">
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                    </div>
                    <h3 className="text-xl font-bold mb-3">{t("Our Team")}</h3>
                    <p className="text-gray-600">{t("Dedicated professionals working together to achieve excellence.")}</p>
                  </div>
                  <div className="bg-white p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-shadow duration-300 border border-slate-100">
                    <div className="w-16 h-16 bg-blue-100 text-[#5e82ab] rounded-2xl flex items-center justify-center mb-6 mx-auto">
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                    </div>
                    <h3 className="text-xl font-bold mb-3">{t("Team Functions")}</h3>
                    <p className="text-gray-600">{t("Defining roles and responsibilities to ensure smooth operations.")}</p>
                  </div>
                  <div className="bg-white p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-shadow duration-300 border border-slate-100">
                    <div className="w-16 h-16 bg-blue-100 text-[#5e82ab] rounded-2xl flex items-center justify-center mb-6 mx-auto">
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                    </div>
                    <h3 className="text-xl font-bold mb-3">{t("Special Programs")}</h3>
                    <p className="text-gray-600">{t("Innovative historical books and research initiatives.")}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default AboutUsContent;
