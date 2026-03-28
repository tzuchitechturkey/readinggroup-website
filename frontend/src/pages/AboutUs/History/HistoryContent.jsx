import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import HistoryModal from "./HistoryModal";
import Loader from "@/components/Global/Loader/Loader";
import { GetHistory, GetHistoryByYear } from "@/api/history";

const AboutHistoryContent = () => {
  const { t } = useTranslation();
  const [expandedYears, setExpandedYears] = useState({});
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [historyMetadata, setHistoryMetadata] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const toggleYear = async (year) => {
    setExpandedYears((prev) => ({
      ...prev,
      [year]: !prev[year],
    }));

    if (!expandedYears[year]) {
      setIsLoading(true);
      try {
        const response = await GetHistoryByYear(year);
        setHistoryMetadata((prev) => {
          const updatedMetadata = prev.map((item) =>
            item.year === year
              ? {
                  ...item,
                  events: response.data,
                  eventsCount: response.data.length,
                }
              : item,
          );
          return updatedMetadata;
        });
      } catch (error) {
        console.error("Error fetching history by year:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const res = await GetHistory();
      
      // Group events by year
      const groupedByYear = {};
      res.data.forEach((event) => {
        const year = event.year.toString();
        if (!groupedByYear[year]) {
          groupedByYear[year] = [];
        }
        groupedByYear[year].push(event);
      });

      // Convert to array format
      const formattedData = Object.keys(groupedByYear)
        .sort((a, b) => b - a) // Sort years in descending order
        .map((year) => ({
          year: year,
          events: groupedByYear[year],
          eventsCount: groupedByYear[year].length,
        }));

      setHistoryMetadata(formattedData);

      // Automatically expand the first year
      if (formattedData.length > 0) {
        setExpandedYears({ [formattedData[0].year]: true });
      }

      console.log("Fetched history data:", formattedData);
    } catch (err) {
      console.error("Error fetching history data:", err);
      setErrorFn(err, t);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="w-full bg-[#E5F0FA] min-h-screen pt-[60px] pb-32 font-['Noto_Sans',sans-serif] relative">
      {isLoading && <Loader />}
      <div className="max-w-[1199px] mx-auto px-4 md:px-0 relative">
        {/* Header Section */}
        <div className="mb-14 max-w-[850px]">
          <h1 className="text-[32px] md:text-[42px] font-[800] text-[#081945] mb-6 tracking-tight leading-tight">
            {t("Our History")}
          </h1>
          <p className="text-[#3B5B80] text-[15px] md:text-[16.5px] leading-[1.75] font-medium opacity-90">
            {t(
              "Our study group's history is marked by meaningful milestones and transformative moments that have shaped who we are today. Explore this timeline to discover the key events, achievements, and turning points in our journey from a local gathering to an international community.",
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
                      <div
                        key={ev.id}
                        className="flex flex-col md:flex-row gap-[24px] mb-14 last:mb-0 w-full max-w-[1145px]"
                      >
                        <div className="w-full md:w-[329px] shrink-0">
                          <img
                            src={ev.images[0]?.image}
                            alt={ev.title}
                            className="w-full h-auto object-cover rounded-none"
                          />
                        </div>
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
                              onClick={() =>
                                setSelectedEvent({
                                  event: ev,
                                  year: yearData.year,
                                })
                              }
                              className="bg-[#FCFDFF] border border-[#D1E0EF] rounded-[4px] w-[140px] h-[40px] px-0 py-0 text-[#2C5282] font-semibold text-[14px] inline-flex items-center justify-center gap-[6px] shadow-sm hover:shadow-md hover:bg-gray-50 transition-all"
                            >
                              <span className="pl-0">{t("Read more")}</span>
                              <span
                                className="text-[16px] font-normal leading-none pt-[1px]"
                                aria-hidden="true"
                              >
                                &rarr;
                              </span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Space out closed items */}
                {(!isExpanded ||
                  !yearData.events ||
                  yearData.events.length === 0) && (
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
