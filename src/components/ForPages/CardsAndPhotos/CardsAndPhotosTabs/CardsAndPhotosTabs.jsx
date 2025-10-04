import React from "react";

import { useTranslation } from "react-i18next";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DynamicSection from "@/components/Global/DynamicSection/DynamicSection";
import { readings } from "@/mock/reading";
import GuidingReadingcard from "@/components/Global/GuidingReadingcard/GuidingReadingcard";
import { useIsMobile } from "@/hooks/use-mobile";

function CardsAndPhotosTabs() {
  const isMobile = useIsMobile(1024);
  const { t } = useTranslation();

  const tabs = [
    "Suggested for you",
    "Incentive Cards",
    "Good Effect Cards",
    "Needlework Love",
    "Weekly Photos",
  ];

  return (
    <div className="border-b-[1px] md:border-0 mb-2 pb-2 md:mb-2 md:pb-2 border-gray-200">
      <Tabs defaultValue="Suggested for you" className="w-full">
        <div className="mt-6 sm:mt-8 md:mt-10 w-full overflow-hidden px-4 sm:px-6 md:px-8">
          {isMobile ? (
            <div className="relative overflow-x-auto">
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
            data={readings}
            isSlider={isMobile}
            cardName={GuidingReadingcard}
            viewMore={false}
            viewMoreUrl="/guiding-reading"
          />
        </TabsContent>

        <TabsContent value="Incentive Cards">
          <DynamicSection
            title={t("This Week's Incentive Cards")}
            titleClassName="text-lg sm:text-xl md:text-2xl lg:text-3xl mb-2 sm:mb-3 md:mb-4"
            data={readings}
            isSlider={isMobile}
            cardName={GuidingReadingcard}
            viewMore={false}
            viewMoreUrl="/guiding-reading"
          />
        </TabsContent>

        <TabsContent value="Good Effect Cards">
          <DynamicSection
            title={t("This Week's Good Effect Cards")}
            titleClassName="text-lg sm:text-xl md:text-2xl lg:text-3xl mb-2 sm:mb-3 md:mb-4"
            data={readings}
            isSlider={isMobile}
            cardName={GuidingReadingcard}
            viewMore={false}
            viewMoreUrl="/guiding-reading"
          />
        </TabsContent>

        <TabsContent value="Needlework Love">
          <DynamicSection
            title={t("This Week's Needlework Love")}
            titleClassName="text-lg sm:text-xl md:text-2xl lg:text-3xl mb-2 sm:mb-3 md:mb-4"
            data={readings}
            isSlider={isMobile}
            cardName={GuidingReadingcard}
            viewMore={false}
            viewMoreUrl="/guiding-reading"
          />
        </TabsContent>

        <TabsContent value="Weekly Photos">
          <DynamicSection
            title={t("This Week's Weekly Photos")}
            titleClassName="text-lg sm:text-xl md:text-2xl lg:text-3xl mb-2 sm:mb-3 md:mb-4"
            data={readings}
            isSlider={isMobile}
            cardName={GuidingReadingcard}
            viewMore={false}
            viewMoreUrl="/guiding-reading"
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default CardsAndPhotosTabs;
