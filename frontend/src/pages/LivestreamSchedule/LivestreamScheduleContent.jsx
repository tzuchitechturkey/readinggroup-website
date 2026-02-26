import React, { useState } from "react";

import { useTranslation } from "react-i18next";
import { Radio } from "lucide-react";

import MonthYearPicker from "@/components/Global/MonthYearPicker/MonthYearPicker";

const LivestreamScheduleContent = () => {
  const { t } = useTranslation();

  const [filters, setFilters] = useState({
    date: { year: 2026, month: 1 },
  });

  const handleDateChange = (newDate) => {
    setFilters((prev) => ({
      ...prev,
      date: newDate,
    }));
  };

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
    <div className="min-h-screen bg-background pt-[110px] pb-32 px-4 select-none">
      <div className="max-w-[1200px] mx-auto px-0 md:px-0">
        {/* Title Node 1:2309 */}
        <h1 className="text-[40px] font-black text-[var(--Page-title)] leading-[1.2] mb-[52px]">
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

        {/* Content  */}
        <div className="flex flex-col gap-[16px] w-full items-start">
          {/* Header  */}
          <div className="livestream-schedule-header">
            <div className="w-[111px] livestream-schedule-header-col">
              {t("Date / Time")}
            </div>
            <div className="w-[275px] livestream-schedule-header-col">
              {t("Title")}
            </div>
            <div className="w-[169px] livestream-schedule-header-col">
              {t("Guest Speaker(s)")}
            </div>
            <div className="w-[134px] livestream-schedule-header-col">
              {t("Resources")}
            </div>
            <div className="w-[174px] livestream-schedule-header-col">
              {t("Link")}
            </div>
          </div>

          {/* Schedule Container  */}
          <div className="livestream-schedule-list">
            {scheduleData.length > 0 ? (
              scheduleData.map((item, index) => (
                <React.Fragment key={item.id}>
                  {index > 0 && (
                    <div className="livestream-schedule-divider">
                      <div className="livestream-schedule-divider-line" />
                    </div>
                  )}
                  {/* Livestream Row  */}
                  <div className="livestream-schedule-row">
                    {/* Date / Time */}
                    <div className="livestream-schedule-col-datetime">
                      <div className="livestream-schedule-date">
                        {item.date}
                      </div>
                      <div className="livestream-schedule-time">
                        {item.time}
                      </div>
                    </div>

                    {/* Title Column */}
                    <div className="livestream-schedule-col-title">
                      {item.title}
                    </div>

                    {/* Guest Speaker Column*/}
                    <div className="livestream-schedule-col-speakers">
                      <div className="flex lg:hidden text-[14px] font-bold text-[var(--Page-text)]/60 mb-1 uppercase tracking-wider">
                        {t("Guest Speaker(s)")}
                      </div>
                      <div className="livestream-schedule-speakers-list">
                        {item.speakers.map((speaker, idx) => (
                          <div key={idx} className="truncate lg:w-[128px]">
                            {speaker}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Actions Container for Mobile */}
                    <div className="livestream-schedule-actions">
                      {/* Resources Button */}
                      <div className="w-full lg:w-[134px] flex justify-start">
                        <button
                          className={
                            item.isLive
                              ? "tzuchi-btn-resources"
                              : "tzuchi-btn-resources-disabled"
                          }
                        >
                          {item.resourcesText}
                        </button>
                      </div>

                      {/* Link Button */}
                      <div className="w-full lg:w-[174px] flex justify-start">
                        <button
                          className={
                            item.isLive
                              ? "tzuchi-btn-link"
                              : "tzuchi-btn-link-disabled"
                          }
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
                  className="text-[40px] font-black text-[var(--livestream-muted-blue)] leading-[1.2] text-center"
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
