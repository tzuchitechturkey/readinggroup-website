import React, { useState } from "react";

import { useTranslation } from "react-i18next";
import { ChevronLeft, ChevronRight, Radio } from "lucide-react";

import { cn } from "@/lib/utils";
import MonthYearPicker from "@/components/Global/MonthYearPicker/MonthYearPicker";

const LivestreamScheduleContent = () => {
  const { t, i18n } = useTranslation();

  const [filters, setFilters] = useState({
    date: { year: 2026, month: 1 },
  });

  const handleDateChange = (newDate) => {
    setFilters((prev) => ({
      ...prev,
      date: newDate,
    }));
  };

  // Example dummy data based on the screenshot
  const [scheduleData] = useState([
    {
      id: 1,
      date: "JAN. 7",
      time: "9 AM - 12 PM",
      title: "Main Discussion in Livestream that takes up two lines",
      speakers: ["Speaker name 1", "Speaker name 2"],
      resourcesText: t("View Posters"),
      linkText: t("Livestream Link"),
      isLive: true,
    },
    {
      id: 2,
      date: "JAN. 14",
      time: "9 AM - 12 PM",
      title: "Main Discussion in Livestream",
      speakers: [
        "Speaker name 1",
        "Speaker name 2",
        "Speaker name 3",
        "Speaker name 4",
      ],
      resourcesText: t("View Posters"),
      linkText: t("Livestream Link"),
      isLive: true,
    },
    {
      id: 3,
      date: "JAN. 21",
      time: "9 AM - 12 PM",
      title: "Main Discussion in Livestream that takes up two lines",
      speakers: [
        "Speaker name 1",
        "Speaker name 2",
        "Speaker name 3",
        "Speaker name 4",
        "Speaker name 5",
      ],
      resourcesText: t("View Posters"),
      linkText: t("Livestream Link"),
      isLive: false,
    },
    {
      id: 4,
      date: "JAN. 28",
      time: "9 AM - 12 PM",
      title: "Main Discussion in Livestream",
      speakers: ["Speaker name 1", "Speaker name 2", "Speaker name 3"],
      resourcesText: t("View Posters"),
      linkText: t("Livestream Link"),
      isLive: false,
    },
  ]);

  return (
    <div className="min-h-screen bg-[#D7EAFF] pt-[110px] pb-32 px-4 select-none">
      <div className="max-w-[1200px] mx-auto px-0 md:px-0">
        {/* Title Node 1:2309 */}
        <h1 className="text-[40px] font-black text-[#1B2D58] leading-[1.2] mb-[52px]">
          {t("Livestream Schedule")}
        </h1>

        {/* Month Navigator Node 1:2308 */}
        <div className="flex mb-[60px]">
          <MonthYearPicker
            month={filters.date.month}
            year={filters.date.year}
            onChange={handleDateChange}
          />
        </div>

        {/* Content Node 1:2293 */}
        <div className="flex flex-col gap-[16px] w-full items-start">
          {/* Header (Reference) Node 1:2294 */}
          <div className="hidden lg:flex items-end justify-between px-[16px] py-[8px] border-b border-[#5E82AB] w-full mb-0">
            <div className="w-[111px] text-[16px] font-bold text-[#081945]">
              {t("Date / Time")}
            </div>
            <div className="w-[275px] text-[16px] font-bold text-[#081945]">
              {t("Title")}
            </div>
            <div className="w-[169px] text-[16px] font-bold text-[#081945]">
              {t("Guest Speaker(s)")}
            </div>
            <div className="w-[134px] text-[16px] font-bold text-[#081945]">
              {t("Resources")}
            </div>
            <div className="w-[174px] text-[16px] font-bold text-[#081945]">
              {t("Link")}
            </div>
          </div>

          {/* Schedule Container Node 1:2300 */}
          <div className="flex flex-col gap-[24px] lg:p-[16px] rounded-[12px] w-full">
            {scheduleData.length > 0 ? (
              scheduleData.map((item, index) => (
                <React.Fragment key={item.id}>
                  {index > 0 && (
                    <div className="h-0 relative shrink-0 w-full mb-4 lg:mb-0">
                      <div className="absolute inset-[-0.5px_0] border-t border-[#5E82AB]/20" />
                    </div>
                  )}
                  {/* Livestream Row Node 1:2301, 1:2305, 1:2307 */}
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between min-h-[100px] w-full gap-6 lg:gap-0 bg-white/30 lg:bg-transparent p-4 lg:p-0 rounded-lg lg:rounded-none">
                    {/* Date / Time Column Node 1:1802 */}
                    <div className="w-full lg:w-[111px] flex flex-row lg:flex-col gap-4 lg:gap-[16px] items-baseline lg:items-start">
                      <div className="text-[24px] font-bold text-[#081945] uppercase leading-[1.5]">
                        {item.date}
                      </div>
                      <div className="text-[16px] font-normal text-[#081945] leading-[1.5]">
                        {item.time}
                      </div>
                    </div>

                    {/* Title Column Node 1:1805 */}
                    <div className="w-full lg:w-[275px] text-[18px] font-bold text-[#081945] leading-[1.5] lg:line-clamp-2 lg:h-[74px] flex items-center">
                      {item.title}
                    </div>

                    {/* Guest Speaker Column Node 1:1806 */}
                    <div className="w-full lg:w-[169px] self-stretch py-0 lg:py-2">
                      <div className="flex lg:hidden text-[14px] font-bold text-[#081945]/60 mb-1 uppercase tracking-wider">
                        {t("Guest Speaker(s)")}
                      </div>
                      <div className="text-[16px] font-normal text-[#081945] flex flex-col gap-[4px] leading-[1.5]">
                        {item.speakers.map((speaker, idx) => (
                          <div key={idx} className="truncate lg:w-[128px]">
                            {speaker}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Actions Container for Mobile */}
                    <div className="flex flex-col sm:flex-row lg:contents gap-4">
                      {/* Resources Button Node 1:1815 */}
                      <div className="w-full lg:w-[134px] flex justify-start">
                        <button
                          className={cn(
                            "w-full lg:w-auto px-[24px] py-[12px] rounded-[4px] text-[14px] font-normal transition-colors leading-[16px] text-center whitespace-nowrap border lg:border-none",
                            item.isLive
                              ? "bg-[#FCFDFF] text-[#285688] shadow-sm hover:bg-gray-50 border-[#285688]"
                              : "bg-[#ECF5FF] text-[#9FB3E1] cursor-not-allowed border-transparent",
                          )}
                        >
                          {item.resourcesText}
                        </button>
                      </div>

                      {/* Link Button Node 1:1816 */}
                      <div className="w-full lg:w-[174px] flex justify-start">
                        <button
                          className={cn(
                            "w-full lg:w-auto flex items-center gap-[6px] justify-center px-[24px] py-[12px] rounded-[4px] text-[14px] font-normal transition-colors leading-[16px] text-center whitespace-nowrap",
                            item.isLive
                              ? "bg-[#285688] text-[#FCFDFF] hover:bg-[#1E4066]"
                              : "bg-[#C2DCF7] text-[#92A5B8] cursor-not-allowed",
                          )}
                        >
                          <Radio className="w-4 h-4" />
                          {item.linkText}
                        </button>
                      </div>
                    </div>
                  </div>
                </React.Fragment>
              ))
            ) : (
              <div
                className="flex flex-col items-center justify-center py-[100px] w-full"
                data-node-id="1:2411"
              >
                <p
                  className="text-[40px] font-black text-[#9FB3E1] leading-[1.2] text-center"
                  data-node-id="1:2412"
                >
                  {t("Nothing scheduled yet.")}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LivestreamScheduleContent;
