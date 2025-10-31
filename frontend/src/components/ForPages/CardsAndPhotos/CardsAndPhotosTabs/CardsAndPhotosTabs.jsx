import React, { useEffect, useState } from "react";

import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DynamicSection from "@/components/Global/DynamicSection/DynamicSection";
import GuidingReadingcard from "@/components/Global/GuidingReadingcard/GuidingReadingcard";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  weeklyMomentsPosts,
  TopCommentedPosts,
  TopLikedPosts,
  WeeklyCardPhotoPosts,
} from "@/api/posts";

function CardsAndPhotosTabs() {
  const isMobile = useIsMobile(1024);
  const { t, i18n } = useTranslation();

  const tabs = [
    "Suggested for you",
    "Incentive Cards",
    "Needlework Love",
    "Weekly Posts",
  ];

  const [activeTab, setActiveTab] = useState("Suggested for you");
  const [loading, setLoading] = useState(false);
  const [tabData, setTabData] = useState({
    "Suggested for you": [],
    "Incentive Cards": [],
    "Needlework Love": [],
    "Weekly Posts": [],
  });

  // Mapping tabs to API functions
  const tabApiFunctions = {
    "Suggested for you": TopCommentedPosts,
    "Incentive Cards": weeklyMomentsPosts,
    "Needlework Love": TopLikedPosts,
    "Weekly Posts": WeeklyCardPhotoPosts,
  };

  // Function to fetch data for a specific tab
  const fetchTabData = async (tabName) => {
    setLoading(true);
    try {
      const apiFunction = tabApiFunctions[tabName];
      if (apiFunction) {
        const response = await apiFunction();
        console.log(`Data for ${tabName}:`, response);
        setTabData((prev) => ({
          ...prev,
          [tabName]: response?.data?.card_photo || response?.data,
        }));
      }
    } catch {
      // Error fetching data
      setTabData((prev) => ({
        ...prev,
        [tabName]: [],
      }));
    } finally {
      setLoading(false);
    }
  };

  // Handle tab change
  const handleTabChange = (tabName) => {
    setActiveTab(tabName);
    // Only fetch if data doesn't exist for this tab
    if (!tabData[tabName] || tabData[tabName].length === 0) {
      fetchTabData(tabName);
    }
  };

  useEffect(() => {
    // Fetch data for the first tab on component mount
    fetchTabData("Suggested for you");
    // Also fetch data for "Needlework Love" tab which is used in the featured section
    fetchTabData("Needlework Love");
  }, []);
  return (
    <div
      className="border-b-[1px] md:border-0 mb-2 pb-2 md:mb-2 md:pb-2 border-gray-200"
      dir={i18n?.language === "ar" ? "rtl" : "ltr"}
    >
      <Tabs
        defaultValue="Suggested for you"
        className="w-full"
        onValueChange={handleTabChange}
      >
        <div className="mt-6 sm:mt-8 md:mt-10 w-full overflow-hidden px-4 sm:px-6 md:px-8">
          {isMobile ? (
            <div className="relative overflow-x-auto scrollbar-hide">
              <TabsList className="bg-white shadow-none flex h-auto p-0 my-5 w-auto min-w-full justify-start">
                {tabs.map((c) => (
                  <TabsTrigger
                    key={c}
                    value={c}
                    className="gap-2 pb-3 px-4 rounded-none text-muted-foreground bg-white shadow-none border-0 flex-shrink-0
                     data-[state=active]:text-[#4680FF] 
                     data-[state=active]:border-b-2 
                     data-[state=active]:border-b-[#4680FF] 
                     data-[state=active]:shadow-none
                     whitespace-nowrap hover:bg-gray-50 transition-colors"
                  >
                    <span className="text-sm font-medium">{t(c)}</span>
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>
          ) : (
            <TabsList className="bg-white shadow-none flex justify-center flex-wrap gap-4 sm:gap-6 h-auto p-0 my-5">
              {tabs.map((c) => (
                <TabsTrigger
                  key={c}
                  value={c}
                  className="gap-2 pb-3 rounded-none text-muted-foreground 
                   data-[state=active]:text-[#4680FF] 
                   data-[state=active]:border-b-2 
                   data-[state=active]:border-b-[#4680FF] 
                   data-[state=active]:shadow-none"
                >
                  <span className="text-sm whitespace-nowrap">{t(c)}</span>
                </TabsTrigger>
              ))}
            </TabsList>
          )}
        </div>

        <TabsContent value="Suggested for you">
          <DynamicSection
            title={t("This Week's Suggested Cards")}
            titleClassName="text-lg sm:text-xl md:text-2xl lg:text-3xl mb-2 sm:mb-3 md:mb-4"
            data={tabData["Suggested for you"]}
            isSlider={isMobile}
            cardName={GuidingReadingcard}
            viewMore={false}
            viewMoreUrl="/guiding-reading"
            loading={loading && activeTab === "Suggested for you"}
          />
        </TabsContent>

        <TabsContent value="Incentive Cards">
          <DynamicSection
            title={t("This Week's Incentive Cards")}
            titleClassName="text-lg sm:text-xl md:text-2xl lg:text-3xl mb-2 sm:mb-3 md:mb-4"
            data={tabData["Incentive Cards"]}
            isSlider={isMobile}
            cardName={GuidingReadingcard}
            viewMore={false}
            viewMoreUrl="/guiding-reading"
            loading={loading && activeTab === "Incentive Cards"}
          />
        </TabsContent>

        <TabsContent value="Needlework Love">
          <DynamicSection
            title={t("This Week's Needlework Love")}
            titleClassName="text-lg sm:text-xl md:text-2xl lg:text-3xl mb-2 sm:mb-3 md:mb-4"
            data={tabData["Needlework Love"]}
            isSlider={isMobile}
            cardName={GuidingReadingcard}
            viewMore={false}
            viewMoreUrl="/guiding-reading"
            loading={loading && activeTab === "Needlework Love"}
          />
        </TabsContent>

        <TabsContent value="Weekly Posts">
          <DynamicSection
            title={t("This Week's Weekly Posts")}
            titleClassName="text-lg sm:text-xl md:text-2xl lg:text-3xl mb-2 sm:mb-3 md:mb-4"
            data={tabData["Weekly Posts"]}
            isSlider={isMobile}
            cardName={GuidingReadingcard}
            viewMore={false}
            viewMoreUrl="/guiding-reading"
            loading={loading && activeTab === "Weekly Posts"}
          />
        </TabsContent>
      </Tabs>
      {/* Start Dynamic Grid  */}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 px-4 sm:px-6 md:px-8 lg:px-12 my-6 sm:my-8 md:my-10">
        {/* Start Image */}
        <Link
          to={`/cards-photos/card/${tabData["Needlework Love"]?.[0]?.id}`}
          className="order-2 lg:order-1 mt-0 lg:mt-8"
        >
          <img
            src={tabData["Needlework Love"]?.[0]?.image}
            alt="Weekly featured image"
            className="w-full h-64 sm:h-80 md:h-96 lg:h-full object-cover rounded-xl shadow-lg"
          />
        </Link>
        {/* End Image */}

        {/* Start Grid Cards */}
        <div className="order-1 lg:order-2 px-0 sm:px-3 md:px-5 lg:px-7">
          {/* Start Title */}
          <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold mb-4 sm:mb-6 text-center lg:text-left">
            {t("This Week's Top Liked Cards")}
          </h2>
          {/* End Title */}

          {/* Start Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 md:gap-6 lg:gap-7">
            {tabData["Needlework Love"]?.slice(1, 5).map((item, index) => (
              <div
                key={index}
                className="transform hover:scale-105 transition-transform duration-200"
              >
                <GuidingReadingcard item={item} />
              </div>
            ))}
          </div>
          {/* End Cards */}
        </div>
        {/* End Grid Cards */}
      </div>
      {/* End Dynamic Grid  */}
    </div>
  );
}

export default CardsAndPhotosTabs;
