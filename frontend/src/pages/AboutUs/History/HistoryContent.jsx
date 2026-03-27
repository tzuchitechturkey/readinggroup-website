import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import HistoryModal from "./HistoryModal";


const historyMetadata = [
  {
    year: "2009",
    eventsCount: 1,
    events: [
      {
        id: "2009-1",
        date: "",
        title: "Reading the Footprints of the Monk's Footsteps Book Club, held every Thursday evening at the Jing Si Hall Book House in Kaohsiung.",
        image: "https://placehold.co/800x600/e0f2fe/0369a1?text=2009+Cover",
        link: "#",
      },
    ],
  },
  { year: "2011", eventsCount: 0, events: [] },
  {
    year: "2012",
    eventsCount: 2,
    events: [
      {
        id: "2012-1",
        date: "MARCH",
        title: "Established the Southern Taiwan E-Book Reading Club Experimental Class",
        modalDescription: "Reading the Footprints of the Monk's Footsteps Book Club, held every Thursday evening at the Jing Si Hall Book House in Kaohsiung. This beloved weekly gathering has become a cornerstone of our local Tzu Chi community, where members of all ages come together to study the life and teachings of Master Cheng Yen. Participants take turns reading passages aloud, followed by facilitated discussions that help us understand how to embody compassion, wisdom, and selfless service in our own lives. The warm atmosphere of the Jing Si Book House, combined with the dedication of our members, makes each Thursday evening a highlight of the week for many in our community.",
        image: "https://placehold.co/800x600/e0f2fe/0369a1?text=2012+Cover",
        additionalImages: ["https://placehold.co/800x600/e0f2fe/0369a1?text=2012+Cover"],
        additionalText: "As we journey through Master Cheng Yen's footsteps chapter by chapter, participants share personal stories of how the teachings have transformed their perspectives on giving, gratitude, and living with purpose. Whether you're seeking spiritual guidance, community connection, or simply a quiet evening of meaningful study, our Thursday gatherings offer a welcoming home for all.",
        link: "#",
      },
      {
        id: "2012-2",
        date: "APRIL 1ST",
        title: "The e-book reading club, held every Wednesday at the Jing Si Bookstore, was established on the day Teacher Mei Yun retired from elementary school.",
        image: "https://placehold.co/800x600/e0f2fe/0369a1?text=2012+Cover",
        link: "#",
      },
    ],
  },
  { year: "2013", eventsCount: 0, events: [] },
  { year: "2014", eventsCount: 0, events: [] },
  { year: "2016", eventsCount: 0, events: [] },
  { year: "2017", eventsCount: 0, events: [] },
  { year: "2018", eventsCount: 0, events: [] },
  { year: "2019", eventsCount: 0, events: [] },
 
];

const AboutHistoryContent = () => {
  const { t } = useTranslation();
  
  const [expandedYears, setExpandedYears] = useState({ 
    "2009": true,
    "2012": true
  });

  const [selectedEvent, setSelectedEvent] = useState(null);

  const toggleYear = (year) => {
    setExpandedYears((prev) => ({
      ...prev,
      [year]: !prev[year]
    }));
  };

  return (
    <div className="w-full bg-[#E5F0FA] min-h-screen pt-[60px] pb-32 font-['Noto_Sans',sans-serif] relative">
      <div className="max-w-[1199px] mx-auto px-4 md:px-0 relative">
        {/* Header Section */}
        <div className="mb-14 max-w-[850px]">
          <h1 className="text-[32px] md:text-[42px] font-[800] text-[#081945] mb-6 tracking-tight leading-tight">
            {t("Our History")}
          </h1>
          <p className="text-[#3B5B80] text-[15px] md:text-[16.5px] leading-[1.75] font-medium opacity-90">
            {t(
              "Our study group's history is marked by meaningful milestones and transformative moments that have shaped who we are today. Explore this timeline to discover the key events, achievements, and turning points in our journey from a local gathering to an international community."
            )}
          </p>
        </div>

        {/* Timeline Section */}
        <div className="relative">
          {historyMetadata.map((yearData, index) => {
            const isExpanded = expandedYears[yearData.year];

            return (
              <div key={yearData.year} className="relative group">
                
                {/* Timeline Line Context */}
                {index < historyMetadata.length - 1 && (
                  <div className="absolute left-[11px] top-[36px] bottom-[-15px] w-[2px] bg-[#8ba4c3] z-0 pointer-events-none group-last:hidden"></div>
                )}

                {/* Main Year Row Sticky Header */}
                <div className="bg-[#E5F0FA] sticky top-0 md:top-[70px] z-20">
                  <div 
                    className="flex items-center gap-[24px] py-4 cursor-pointer"
                    onClick={() => toggleYear(yearData.year)}
                  >
                    <div className="w-[24px] h-[24px] shrink-0 bg-[#35577D] text-white flex items-center justify-center font-bold text-[18px] leading-none rounded-[4px] shadow-sm z-30 transform transition-transform duration-200">
                      {isExpanded && yearData.events?.length > 0 ? "-" : "+"}
                    </div>
                    <div className="flex items-baseline gap-4">
                      <span className="text-[28px] md:text-[34px] font-[800] text-[#081945] leading-none tracking-tight">
                        {yearData.year}
                      </span>
                      <span className="text-[13px] font-semibold text-[#6285a8] leading-none">
                        {yearData.eventsCount} {t("event(s)")}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Expanded Content */}
                {isExpanded && yearData.events?.length > 0 && (
                  <div className="pl-[54px] pt-4 pb-12 pr-0 relative">
                    {yearData.events.map((ev, i) => (
                      <div key={ev.id} className="flex flex-col md:flex-row gap-[24px] mb-14 last:mb-0 w-full max-w-[1145px]">
                        {ev.image && (
                          <div className="w-full md:w-[329px] shrink-0">
                            <img 
                              src={ev.image} 
                              alt={ev.title}
                              className="w-full h-auto object-cover rounded-none"
                            />
                          </div>
                        )}
                        <div className="flex-1 max-w-[792px] pt-0 flex flex-col items-start gap-0">
                          {ev.date && (
                            <h4 className="text-[#081945] font-black text-[15px] uppercase tracking-[0.15em] mb-3">
                              {ev.date}
                            </h4>
                          )}
                          <p className="text-[#081945] font-[700] text-[20px] md:text-[22px] leading-[1.55] tracking-tight">
                            {ev.title}
                          </p>
                          <div className="mt-[36px]">
                            <button 
                              onClick={() => setSelectedEvent({ event: ev, year: yearData.year })}
                              className="bg-[#FCFDFF] border border-[#D1E0EF] rounded-[4px] w-[140px] h-[40px] px-0 py-0 text-[#2C5282] font-semibold text-[14px] inline-flex items-center justify-center gap-[6px] shadow-sm hover:shadow-md hover:bg-gray-50 transition-all">
                              <span className="pl-0">{t("Read more")}</span>
                              <span className="text-[16px] font-normal leading-none pt-[1px]" aria-hidden="true">&rarr;</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                
                {/* Space out closed items */}
                {(!isExpanded || !yearData.events || yearData.events.length === 0) && (
                  <div className="h-[12px]"></div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <HistoryModal 
        isOpen={!!selectedEvent}
        onClose={() => setSelectedEvent(null)}
        event={selectedEvent?.event}
        year={selectedEvent?.year}
      />
    </div>
  );
};

export default AboutHistoryContent;
