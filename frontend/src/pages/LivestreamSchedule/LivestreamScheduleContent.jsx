import React, { useEffect, useState } from "react";

import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import { Radio } from "lucide-react";
import { toast } from "react-toastify";

import MonthYearPicker from "@/components/Global/MonthYearPicker/MonthYearPicker";
import { setErrorFn } from "@/Utility/Global/setErrorFn";
import Loader from "@/components/Global/Loader/Loader";
import { GetEvents } from "@/api/events";
import ImageViewerModal from "@/components/Global/ImageViewerModal/ImageViewerModal";

// Helper function to format date
const formatDate = (dateString) => {
  const date = new Date(dateString);
  const month = date.toLocaleDateString("en-US", { month: "short" });
  const day = date.getDate();
  return `${month}. ${day}`;
};

 
// Helper function to format time range
const formatTimeRange = (startTime, durationHours) => {
  // تحويل البداية إلى ساعة ودقيقة
  const [hourStr] = startTime.split(":");
  const startHour = parseInt(hourStr, 10);

  // حساب النهاية
  let endHour = startHour + parseInt(durationHours, 10);

  // ضبط الساعة إذا تجاوزت 24
  if (endHour >= 24) {
    endHour = endHour - 24;
  }

  // دالة تحويل 24 ساعة إلى 12 ساعة مع AM/PM
  const formatHour = (h) => {
    const ampm = h >= 12 ? "PM" : "AM";
    let hour12 = h % 12;
    if (hour12 === 0) hour12 = 12;
    return `${hour12} ${ampm}`;
  };

  return `${formatHour(startHour)} - ${formatHour(endHour)}`;
};

const getSpeakerDisplayName = (speaker) => {
  if (typeof speaker === "string") return speaker;
  if (speaker && typeof speaker === "object") return speaker.name || "";
  return "";
};

const LivestreamScheduleContent = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const [scheduleData, setScheduleData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Get current date
  const currentDate = new Date();
  const [filters, setFilters] = useState({
    date: {
      year: currentDate.getFullYear(),
      month: currentDate.getMonth() + 1,
    },
  });
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  // Handle navigation state - open modal if coming from home page
  useEffect(() => {
    if (location?.state?.openPosterModal && location?.state?.selectedEvent) {
      setSelectedEvent(location.state.selectedEvent);
      setIsViewerOpen(true);
      // Clear the state after opening to prevent reopening on refresh
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);
  const fetchScheduleData = async (year, month) => {
    setIsLoading(true);
    try {
      // Format month with leading zero (01, 02, etc.)
      const monthStr = String(month).padStart(2, "0");
      const dateFilter = `${year}-${monthStr}`;

      const res = await GetEvents(10, 0, { start_event_date: dateFilter });
      setScheduleData(res.data.results);
    } catch (err) {
      console.error("Error fetching schedule data:", err?.response);
      setErrorFn(err, t);
    } finally {
      setIsLoading(false);
    }
  };
  const handleDateChange = (newDate) => {
    setFilters((prev) => ({
      ...prev,
      date: newDate,
    }));
  };

  useEffect(() => {
    fetchScheduleData(filters.date.year, filters.date.month);
  }, [filters.date]);
  return (
    <div className="min-h-screen bg-background pt-10 lg:pt-[50px] pb-32 px-4 ">
      {isLoading && <Loader />}
      <div className="max-w-[1200px] mx-auto px-0 md:px-0">
        {/* Title Node 1:2309 */}
        <h1 className="text-2xl lg:text-[40px] font-black text-[var(--Page-title)] leading-[1.2] mb-8 lg:mb-[52px]">
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

        {scheduleData?.length > 0 ? (
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
              {scheduleData.map((item, index) => (
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
                        {formatDate(item.start_event_date)}
                      </div>
                      <div className="livestream-schedule-time">
                        {formatTimeRange(item.start_event_time, item.duration)}
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
                        {(item.guest_speakers || []).map((speaker, idx) => (
                          <div key={idx} className="truncate lg:w-[128px]">
                            {getSpeakerDisplayName(speaker)}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Actions Container for Mobile */}
                    <div className="livestream-schedule-actions">
                      {/* Resources Button */}
                      <div className="w-full lg:w-[134px] flex justify-start">
                        <button
                          onClick={() => {
                            if (!item?.learn?.id) {
                              toast.info(
                                t("No resources available for this event"),
                              );
                              return;
                            }
                            setSelectedEvent(item);
                            setIsViewerOpen(true);
                          }}
                          className={
                            item?.learn?.id
                              ? "tzuchi-btn-resources outline-none border-none"
                              : "tzuchi-btn-resources-disabled outline-none border-none"
                          }
                        >
                          {t("View Posters")}
                        </button>
                      </div>

                      {/* Link Button */}
                      <div className="w-full lg:w-[174px] flex justify-start">
                        <button
                          type="button"
                          onClick={() => {
                            if (!item?.live_stream_link) {
                              toast.info(t("No link available for this event"));
                              return;
                            }

                            window.open(
                              item.live_stream_link,
                              "_blank",
                              "noopener,noreferrer",
                            );
                          }}
                          className={`flex items-center gap-1 ${
                            item?.live_stream_link
                              ? "tzuchi-btn-link cursor-pointer"
                              : "tzuchi-btn-link-disabled cursor-not-allowed"
                          }`}
                        >
                          <Radio className="w-4 h-4" />
                          <span>{t("Livestream Link")}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </React.Fragment>
              ))}
            </div>
          </div>
        ) : (
          <div
            className="flex flex-col items-center justify-center py-[290px] w-full"
            data-node-id="1:2411"
          >
            <p
              className="text-2xl lg:text-[40px] font-black text-[var(--livestream-muted-blue)] leading-[1.2] text-center"
              data-node-id="1:2412"
            >
              {t("Nothing scheduled yet.")}
            </p>
          </div>
        )}
      </div>
      {/* Image Viewer Modal */}
      <ImageViewerModal
        isOpen={isViewerOpen}
        onClose={() => setIsViewerOpen(false)}
        images={
          selectedEvent?.learn?.image
            ? [selectedEvent.learn.image]
            : selectedEvent?.learn?.image_url
              ? [selectedEvent.learn.image_url]
              : []
        }
        currentIndex={0}
      />
    </div>
  );
};

export default LivestreamScheduleContent;
