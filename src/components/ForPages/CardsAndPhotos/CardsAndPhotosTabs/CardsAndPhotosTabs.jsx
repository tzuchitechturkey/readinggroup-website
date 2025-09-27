import React, { useState } from "react";

import { useTranslation } from "react-i18next";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DynamicSection from "@/components/Global/DynamicSection/DynamicSection";
import { readings } from "@/mock/reading";
import GuidingReadingcard from "@/components/Global/GuidingReadingcard/GuidingReadingcard";

function CardsAndPhotosTabs() {
  const { t } = useTranslation();

  const tabs = [
    "Suggested for you",
    "Incentive Cards",
    "Good Effect Cards",
    "Needlework Love",
    "Weekly Photos",
  ];
  const [activeTab, setActiveTab] = useState(tabs[0].id);

  return (
    <div>
      <Tabs defaultValue="Suggested for you" className="w-full">
        <div className="mt-10 w-fit mx-auto  ">
          <TabsList className="bg-white shadow-none flex justify-start flex-wrap gap-6 h-auto p-0 my-5 ">
            {tabs.map((c) => (
              <TabsTrigger
                key={c}
                value={c}
                className="gap-2 pb-3 rounded-none text-muted-foreground data-[state=active]:text-[#4680FF] data-[state=active]:border-b-2 data-[state=active]:border-b-[#4680FF] data-[state=active]:shadow-none"
              >
                <span className="text-sm whitespace-nowrap">{c}</span>
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
        <TabsContent value="Suggested for you">
          <DynamicSection
            title="This Week’s Incentive Cards"
            titleClassName="text-[30px]  mb-2"
            data={readings}
            isSlider={false}
            cardName={GuidingReadingcard}
            viewMore={false}
            viewMoreUrl="/guiding-reading"
          />
        </TabsContent>
        <TabsContent value="Incentive Cards">
          <DynamicSection
            title="This Week’s Incentive Cards"
            titleClassName="text-[30px]  mb-2"
            data={readings}
            isSlider={false}
            cardName={GuidingReadingcard}
            viewMore={false}
            viewMoreUrl="/guiding-reading"
          />
        </TabsContent>
        <TabsContent value="Good Effect Cards">
          <DynamicSection
            title="This Week’s Incentive Cards"
            titleClassName="text-[30px]  mb-2"
            data={readings}
            isSlider={false}
            cardName={GuidingReadingcard}
            viewMore={false}
            viewMoreUrl="/guiding-reading"
          />
        </TabsContent>
        <TabsContent value="Needlework Love">
          <DynamicSection
            title="This Week’s Incentive Cards"
            titleClassName="text-[30px]  mb-2"
            data={readings}
            isSlider={false}
            cardName={GuidingReadingcard}
            viewMore={false}
            viewMoreUrl="/guiding-reading"
          />
        </TabsContent>
        <TabsContent value="Weekly Photos">
          <DynamicSection
            title="This Week’s Incentive Cards"
            titleClassName="text-[30px]  mb-2"
            data={readings}
            isSlider={false}
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
