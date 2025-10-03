import React from "react";

import HeroSlider from "@/components/ForPages/Home/HeroSliderSection/HeroSlider";
import EventsFilterSections from "@/components/ForPages/Connect/EventsFilterSections/EventsFilterSections";
import DynamicSection from "@/components/Global/DynamicSection/DynamicSection";
import ExternalNewsCard from "@/components/Global/ExternalNewsCard/ExternalNewsCard";
import { EventsData } from "@/mock/events";

function EventsContent() {
  return (
    <div className="">
      {/* Hero Slider */}
      <div dir="ltr">
        <HeroSlider newsPage={true} />
      </div>
      {/* End Hero Slider */}
      {/* Start Filter Section */}
      <EventsFilterSections />
      {/* End Filter Section */}
      {/* Start Suggestions you might like */}
      <DynamicSection
        title="Suggestions you might like"
        titleClassName="text-lg sm:text-xl md:text-2xl lg:text-3xl mt-5"
        data={EventsData?.breakingNews}
        isSlider={true}
        cardName={ExternalNewsCard}
        viewMore={false}
        viewMoreUrl="/guiding-reading"
      />
      <DynamicSection
        title="Suggestions you might like"
        titleClassName="text-lg sm:text-xl md:text-2xl lg:text-3xl mt-5 "
        data={EventsData?.breakingNews}
        isSlider={true}
        cardName={ExternalNewsCard}
        viewMore={false}
      />
      {/* End Suggestions you might like */}
    </div>
  );
}

export default EventsContent;
