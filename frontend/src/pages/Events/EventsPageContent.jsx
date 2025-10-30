import React, { useEffect, useState } from "react";

import { useTranslation } from "react-i18next";

import EventHeroSlider from "@/components/ForPages/Events/EventHeroSlider/EventHeroSlider";
import EventsFilterSections from "@/components/ForPages/Events/EventsFilterSections/EventsFilterSections";
import DynamicSection from "@/components/Global/DynamicSection/DynamicSection";
import EventCard from "@/components/Global/EventCard/EventCard";
import { EventsData } from "@/mock/events";
import { GetTop5Event } from "@/api/events";

function EventsPageContent() {
  const { t, i18n } = useTranslation();
  const [data, setData] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const getSuggestionsData = async () => {
    try {
      const res = await GetTop5Event();
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
  useEffect(() => {
    //   getSuggestions();
    getSuggestionsData();
  }, []);
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
        title={t("Suggestions you might like")}
        titleClassName="text-lg sm:text-xl md:text-2xl lg:text-3xl mt-5"
        data={suggestions}
        isSlider={true}
        cardName={EventCard}
        viewMore={false}
        viewMoreUrl="/guiding-reading"
      />
      <DynamicSection
        title={t("Suggestions you might like")}
        titleClassName="text-lg sm:text-xl md:text-2xl lg:text-3xl mt-5 "
        data={EventsData?.breakingNews}
        isSlider={true}
        cardName={EventCard}
        viewMore={false}
      />
      {/* End Suggestions you might like */}
    </div>
  );
}

export default EventsPageContent;
