import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import HistoryModal from "./HistoryModal";
import Loader from "@/components/Global/Loader/Loader";
import { GetHistory } from "@/api/history";
import { Minus, Plus } from "lucide-react";

const AboutHistoryContent = () => {
  const { t } = useTranslation();
  const [expandedYears, setExpandedYears] = useState({});
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [historyMetadata, setHistoryMetadata] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const toggleYear = (year) => {
    setExpandedYears((prev) => ({
      ...prev,
      [year]: !prev[year],
    }));
  };

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const res = await GetHistory();

      // Group events by year
      const groupedByYear = {};
      res.data.forEach((event) => {
        const year = event?.year.toString();
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
  // Add a helper function to map month numbers to names
  const getMonthName = (monthNumber) => {
    const date = new Date();
    date.setMonth(monthNumber - 1); // JavaScript months are 0-indexed
    return date.toLocaleString("en-US", { month: "long" });
  };
  return (
    <div className="w-full bg-[#D7EAFF] min-h-screen pt-[60px] pb-32 font-['Noto_Sans',sans-serif] relative">
      {isLoading && <Loader />}
      <div className="max-w-[1199px] mx-auto px-4 md:px-0 relative">
        {/* Header Section */}
        <div className="mb-14 max-w-[850px]">
          <h1 className="text-[32px] md:text-[42px] font-[900] text-[#081945] mb-6 tracking-tight leading-tight">
            {t("Our History")}
          </h1>
          <p className="text-[#081945] text-[15px] md:text-[16.5px] leading-[1.75] font-medium opacity-90">
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
                {/* Vertical line for this year */}
                <div
                  className={`absolute left-[13.5px] w-1 transition-all duration-300 bg-[#8FABCA] ${
                    isExpanded
                      ? "top-[58px] bottom-0"
                      : "top-[58px] h-8"
                  }`}
                ></div>

                {/* Year Header */}
                <div
                  className="flex items-center gap-[24px] py-4 cursor-pointer sticky top-0 z-20"
                  onClick={() => toggleYear(yearData.year)}
                >
                  <div className="w-7 h-7 shrink-0 bg-[#35577D] text-white flex items-center justify-center font-bold leading-none rounded-[4px] shadow-sm relative z-10">
                    {isExpanded ? (
                      <Minus className="text-white size-4" />
                    ) : (
                      <Plus className="text-white size-4" />
                    )}
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-[28px] md:text-[34px] font-[800] text-[#081945] leading-none tracking-tight">
                      {yearData.year}
                    </span>
                    <span className="text-lg text-[#285688] leading-none">
                      {yearData.eventsCount} {t("event(s)")}
                    </span>
                  </div>
                </div>

                {/* Events */}
                {isExpanded && (
                  <div className="pl-[54px] pt-4 pb-12">
                    {yearData.events.map((event) => (
                      <div
                        key={event?.id}
                        className="flex flex-col md:flex-row gap-[24px] mb-14 last:mb-0"
                      >
                        {/* Event Images */}
                        <div className="w-full md:w-[329px] h-[247px]">
                          <img
                            src={event?.images[0]?.image}
                            alt={event?.title}
                            className="w-full h-full object-cover "
                          />
                        </div>

                        {/* Event Details */}
                        <div className="flex-1 mt-[2px]">
                          <p className="text-[#081945] uppercase font-bold text-base md:text-[20px] mb-4">
                            {getMonthName(event?.month)}
                          </p>
                          <p className="text-[#081945] font-bold text-base md:text-[20px] mb-4">
                            {event?.title}
                          </p>

                          <button
                            onClick={() => setSelectedEvent(event)}
                            className="mt-3 bg-[#FCFDFF] border border-[#D1E0EF] rounded-[4px] px-4 py-2 text-[#285688]  text-[14px] hover:bg-gray-50 transition-all"
                          >
                            {t("Read more")} &rarr;
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal for Selected Event */}
      {selectedEvent && (
        <HistoryModal
          isOpen={!!selectedEvent}
          onClose={() => setSelectedEvent(null)}
          event={selectedEvent}
        />
      )}
    </div>
  );
};

export default AboutHistoryContent;
