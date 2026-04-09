import React, { useEffect, useRef, useState } from "react";

import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import { Radio } from "lucide-react";
import { toast } from "react-toastify";

import MonthYearPicker from "@/components/Global/MonthYearPicker/MonthYearPicker";
import LanguageFilter from "@/components/Videos/LanguageFilter/LanguageFilter";
import { setErrorFn } from "@/Utility/Global/setErrorFn";
import Loader from "@/components/Global/Loader/Loader";
import { GetEvents } from "@/api/events";
import ImageViewerModal from "@/components/Global/ImageViewerModal/ImageViewerModal";
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
  const fetchScheduleData = async (currentFilters) => {
    setIsLoading(true);
    try {
      const { year, month } = currentFilters.date;
      const monthStr = String(month).padStart(2, "0");
      const dateFilter = `${year}-${monthStr}`;

      const res = await GetEvents(10, 0, {
        start_event_date: dateFilter,
        language: currentFilters.language,
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

  const handleDateChange = (newDate) => {
    const newFilters = { ...filters, date: newDate };
    setFilters(newFilters);
    fetchScheduleData(newFilters);
  };

  const handleLanguageChange = (langCode) => {
    const newFilters = { ...filters, language: langCode };
    setFilters(newFilters);
    fetchScheduleData(newFilters);
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
    fetchScheduleData(newFilters);
  }, [i18n.language]);

  return (
    <div className="min-h-screen bg-background pt-10 lg:pt-[50px] pb-32 px-4 ">
      {isLoading && <Loader />}
      <div className="max-w-[1200px] mx-auto px-0 md:px-0">
        {/* Title Node 1:2309 */}
        <h1 className="text-2xl lg:text-[40px] font-black text-[var(--Page-title)] leading-[1.2] mb-8 lg:mb-[52px]">
          {t("Livestream Schedule")}
        </h1>

        {/* Month Navigator + Language Filter */}
        <div className="flex flex-wrap items-center gap-4 mb-[60px]">
          <MonthYearPicker
            month={filters.date.month}
            year={filters.date.year}
            onChange={handleDateChange}
          />
          <LanguageFilter
            filters={filters}
            openDropdowns={openDropdowns}
            onToggleDropdown={toggleDropdown}
            onLanguageChange={handleLanguageChange}
          />
        </div>

        {/* Start Content  */}

      
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
