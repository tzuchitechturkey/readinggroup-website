import React, { useEffect, useRef, useState } from "react";

import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import {
  Radio,
  ArrowUp,
  ArrowDown,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { toast } from "react-toastify";

import MonthYearPicker from "@/components/Global/MonthYearPicker/MonthYearPicker";
import LanguageFilter from "@/components/Videos/LanguageFilter/LanguageFilter";
import { setErrorFn } from "@/Utility/Global/setErrorFn";
import Loader from "@/components/Global/Loader/Loader";
import { GetEvents } from "@/api/events";
import ImageViewerModal from "@/components/Global/ImageViewerModal/ImageViewerModal";
import VideoSearchBar from "@/components/Videos/VideoSearchBar/VideoSearchBar";

// Map i18n language code → allLanguages code (constants.js)
const I18N_TO_EVENT_LANG = {
  en: "en",
  tr: "tr",
  ch: "zh-hant",
  chsi: "zh-hans",
  jp: "ja",
};

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
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const [scheduleData, setScheduleData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const initialLoadRef = useRef(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeSearchTerm, setActiveSearchTerm] = useState("");
  // Get current date
  const currentDate = new Date();
  const defaultLanguage = I18N_TO_EVENT_LANG[i18n.language] || "en";
  const [filters, setFilters] = useState({
    date: {
      year: currentDate.getFullYear(),
      month: currentDate.getMonth() + 1,
    },
    language: defaultLanguage,
  });
  const [openDropdowns, setOpenDropdowns] = useState({ language: false });
  const [sortOrder, setSortOrder] = useState("asc"); // "asc" | "desc"

  const toggleSort = () =>
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));

  const toggleDropdown = (name) => {
    setOpenDropdowns((prev) => ({ language: false, [name]: !prev[name] }));
  };

  const closeAllDropdowns = () => setOpenDropdowns({ language: false });
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [viewerIndex, setViewerIndex] = useState(0);

  // Handle navigation state - open modal if coming from home page
  useEffect(() => {
    if (location?.state?.openPosterModal && location?.state?.selectedEvent) {
      setSelectedEvent(location.state.selectedEvent);
      setIsViewerOpen(true);
      // Clear the state after opening to prevent reopening on refresh
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);
  const fetchScheduleData = async (currentFilters, search = "") => {
    setIsLoading(true);
    try {
      const { year, month } = currentFilters.date;
      const monthStr = String(month).padStart(2, "0");
      const dateFilter = `${year}-${monthStr}`;

      const res = await GetEvents(10, 0, {
        start_event_date: dateFilter,
        language: currentFilters.language,
        ...(search ? { search } : {}),
      });
      setScheduleData(res.data.results);
    } catch (err) {
      console.error("Error fetching schedule data:", err?.response);
      setErrorFn(err, t);
    } finally {
      setIsLoading(false);
      initialLoadRef.current = true;
    }
  };

  const handleSearch = (value, shouldTrigger) => {
    setSearchTerm(value);
    if (shouldTrigger) {
      setActiveSearchTerm(value);
      fetchScheduleData(filters, value);
    }
  };

  const handleDateChange = (newDate) => {
    const newFilters = { ...filters, date: newDate };
    setFilters(newFilters);
    fetchScheduleData(newFilters, activeSearchTerm);
  };

  const handleLanguageChange = (langCode) => {
    const newFilters = { ...filters, language: langCode };
    setFilters(newFilters);
    fetchScheduleData(newFilters, activeSearchTerm);
    closeAllDropdowns();
  };

  useEffect(() => {
    fetchScheduleData(filters);
  }, []);

  // مزامنة لغة الفلتر مع تغيير لغة الموقع
  useEffect(() => {
    if (!initialLoadRef.current) return;
    const newLang = I18N_TO_EVENT_LANG[i18n.language] || "en";
    if (newLang === filters.language) return;
    const newFilters = { ...filters, language: newLang };
    setFilters(newFilters);
    fetchScheduleData(newFilters, activeSearchTerm);
  }, [i18n.language]);

  const sortedData = [...scheduleData].sort((a, b) => {
    const diff = new Date(a.start_event_date) - new Date(b.start_event_date);
    return sortOrder === "asc" ? diff : -diff;
  });

  return (
    <div className="min-h-screen bg-background pt-10 lg:pt-[50px] pb-32 px-4 ">
      {isLoading && <Loader />}
      <div className="max-w-[1200px] mx-auto px-0 md:px-0">
        <div className="flex items-center justify-between">
          <div className="">
            {/* Start Title */}
            <h1 className="text-2xl lg:text-[40px] font-black text-[var(--Page-title)] leading-[1.2] mb-8 lg:mb-[52px]">
              {t("Livestream Schedule")}
            </h1>
            {/* End Title */}
            {/* Start Month */}
            <MonthYearPicker
              month={filters.date.month}
              year={filters.date.year}
              language={filters.language}
              onChange={handleDateChange}
            />
            {/* End Month */}
          </div>

          <div className="flex items-end flex-col justify-between">
            {/* Start Search  */}
            <div className="mb-8 w-full lg:w-[380px] md:mb-14 px-4 md:px-0">
              <VideoSearchBar
                searchTerm={searchTerm}
                activeSearchTerm={activeSearchTerm}
                onSearch={handleSearch}
                placeholderText={t("Search for day, speaker, or title")}
              />
            </div>
            {/* End Search  */}
            {/* Start Language Filter */}
            <div className="w-fit">
              <LanguageFilter
                filters={filters}
                openDropdowns={openDropdowns}
                onToggleDropdown={toggleDropdown}
                onLanguageChange={handleLanguageChange}
                fromLiveStream={true}
                title={t("Livestream Translation")}
              />
            </div>
            {/* End Language Filter */}
          </div>
        </div>

        {/* Start Content  */}
        {scheduleData?.length > 0 ? (
          <div className="flex flex-col gap-[16px] w-full items-start">
            {/* Header  */}
            <div className="livestream-schedule-header">
              <button
                onClick={toggleSort}
                className="w-[111px] livestream-schedule-header-col flex items-center gap-1"
              >
                {t("Date / Time")}
                {sortOrder === "asc" ? (
                  <ChevronDown className="w-4 h-4 font-bold text-[#081945]" />
                ) : (
                  <ChevronUp className="w-4 h-4 font-bold text-[#081945]" />
                )}
              </button>
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
              {sortedData.map((item, index) => (
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
                      <p className="livestream-schedule-date mb-0 pb-0">
                        {formatDate(item.start_event_date)}
                      </p>
                      {/* Start Year */}
                      <p className=" text-lg text-[#081945] font-bold mb-0 pb-0">
                        {new Date(item.start_event_date).getFullYear()}
                      </p>
                      {/* End Year */}
                      {/* Start Time */}
                      <p className="text-[#081945] mt-6">
                        {formatTimeRange(item.start_event_time, item.duration)}
                      </p>
                      {/* End Time */}
                    </div>

                    {/* Start Title */}
                    <div className="livestream-schedule-col-title">
                      {item.title}
                    </div>
                    {/* End Title */}

                    {/* Start Guest Speaker */}
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
                        {(item.guest_speakers || []).map((speaker, idx) => (
                          <div key={idx} className="truncate lg:w-[128px]">
                            {getSpeakerDisplayName(speaker)}
                          </div>
                        ))}
                      </div>
                    </div>
                    {/* End Guest Speaker */}

                    {/* Start Actions Container for Mobile */}
                    <div className="flex flex-col items-center justify-center sm:flex-row lg:contents gap-4">
                      {/* Start Poster */}
                      <div className="w-full lg:w-[134px] flex justify-start items-center mb-5">
                        <button
                          onClick={() => {
                            if (!item?.images?.length) {
                              toast.info(
                                t("No resources available for this event"),
                              );
                              return;
                            }
                            setSelectedEvent(item);
                            setViewerIndex(0);
                            setIsViewerOpen(true);
                          }}
                          className={
                            item?.images?.length > 0
                              ? "tzuchi-btn-resources h-10 outline-none border-none"
                              : "tzuchi-btn-resources-disabled h-10 outline-none border-none"
                          }
                        >
                          {t("View Posters")}
                        </button>
                      </div>
                      {/* End Poster */}
                      {/* Start Link */}
                      <div className="w-full lg:w-[174px] flex justify-start items-center mb-5">
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
                              ? "tzuchi-btn-link h-10 cursor-pointer"
                              : "tzuchi-btn-link-disabled h-10 cursor-not-allowed"
                          }`}
                        >
                          <Radio className="w-4 h-4" />
                          <span>{t("Livestream Link")}</span>
                        </button>
                      </div>
                      {/* End Link */}
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
        images={selectedEvent?.images || []}
        currentIndex={viewerIndex}
        onNext={() =>
          setViewerIndex((prev) =>
            prev < (selectedEvent?.images?.length ?? 1) - 1 ? prev + 1 : prev,
          )
        }
        onPrev={() => setViewerIndex((prev) => (prev > 0 ? prev - 1 : prev))}
      />
    </div>
  );
};

export default LivestreamScheduleContent;
