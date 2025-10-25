import React, { useEffect, useState } from "react";

import { useTranslation } from "react-i18next";

import EventHeroSlider from "@/components/ForPages/Events/EventHeroSlider/EventHeroSlider";
import EventsFilterSections from "@/components/ForPages/Events/EventsFilterSections/EventsFilterSections";
import DynamicSection from "@/components/Global/DynamicSection/DynamicSection";
import ExternalNewsCard from "@/components/Global/ExternalNewsCard/ExternalNewsCard";
import { EventsData } from "@/mock/events";

function EventsPageContent() {
  const { i18n } = useTranslation();
  const [data, setData] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const getSuggestionsData = async () => {
    try {
      const res = await getSuggestions();
      setSuggestions(res.data);
    } catch (err) {
      console.log("Error fetching data", err);
    }
  };
  const getSuggestions = async () => {
    try {
      const res = await getSuggestions();
      setData(res.data);
    } catch (err) {
      console.log("Error fetching data", err);
    }
  };
  // useEffect(() => {
  //   getSuggestions();
  //   getSuggestionsData();
  // }, []);
  return (
    <div className="" dir={i18n?.language === "ar" ? "rtl" : "ltr"}>
      {/* Hero Slider */}
      <div>
        <EventHeroSlider newsPage={true} />
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

export default EventsPageContent;
