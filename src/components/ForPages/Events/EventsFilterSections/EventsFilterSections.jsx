import React, { useState, useEffect } from "react";

import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

import Modal from "@/components/Global/Modal/Modal";
import BrokenCarousel from "@/components/Global/BrokenCarousel/BrokenCarousel";
import ExternalNewsCard from "@/components/Global/ExternalNewsCard/ExternalNewsCard";
import SearchSecion from "@/components/Global/SearchSecion/SearchSecion";
import EventsFilter from "@/components/ForPages/Events/EventsFilter/EventsFilter";
import { EventsData } from "@/mock/events";

function EventsFilterSections() {
  const { t } = useTranslation();
  const [viewMode, setViewMode] = useState("grid");
  const [openFilterModal, setOpenFilterModal] = useState(false);
  const [selectedDateRange, setSelectedDateRange] = useState({
    startDate: null,
    endDate: null,
  });
  const [selectedAuthor, setSelectedAuthor] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedContentType, setSelectedContentType] = useState(""); // video or report
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [selectedDuration, setSelectedDuration] = useState(""); // for videos only
  const [searchValue, setSearchValue] = useState("");
  // دمج جميع البيانات في مصفوفة واحدة للفلترة الموحدة
  const allData = [
    ...(EventsData.warmDiscussion || []),
    ...(EventsData.dramaData || []),
    ...(EventsData.eventReports || []),
    ...(EventsData.breakingNews || []),
    ...(EventsData.recommendationNews || []),
    ...(EventsData.trendingNews || []),
  ];

  const [filteredData, setFilteredData] = useState([]);
  const [displayedData, setDisplayedData] = useState({
    warm_discussion: [],
    drama: [],
    event_reports: [],
  });
  const [searchData, setSearchData] = useState({
    count: 10,
    results: {
      warm_discussion: [],
      drama: [],
      event_reports: [],
    },
  });

  // دالة الفلترة الجديدة
  const applyFilters = () => {
    let filtered = [...allData];

    // فلترة حسب التاريخ
    if (selectedDateRange.startDate && selectedDateRange.endDate) {
      filtered = filtered.filter((item) => {
        const itemDate = new Date(item.date);
        return (
          itemDate >= selectedDateRange.startDate &&
          itemDate <= selectedDateRange.endDate
        );
      });
    }

    // فلترة حسب الكاتب
    if (selectedAuthor) {
      filtered = filtered.filter((item) =>
        item.author?.toLowerCase().includes(selectedAuthor.toLowerCase())
      );
    }

    // فلترة حسب البلد
    if (selectedCountry) {
      filtered = filtered.filter((item) =>
        item.country?.toLowerCase().includes(selectedCountry.toLowerCase())
      );
    }

    // فلترة حسب نوع المحتوى
    if (selectedContentType) {
      filtered = filtered.filter(
        (item) => item.report_type === selectedContentType
      );
    }

    // فلترة حسب اللغة
    if (selectedLanguage) {
      filtered = filtered.filter((item) => item.language === selectedLanguage);
    }

    // فلترة حسب مدة الفيديو (للفيديوهات فقط)
    if (selectedDuration && selectedContentType === "video") {
      filtered = filtered.filter((item) => {
        if (item.report_type !== "video") return false;
        const duration = item.duration || 0;
        switch (selectedDuration) {
          case "short":
            return duration <= 5; // أقل من 5 دقائق
          case "medium":
            return duration > 5 && duration <= 20; // 5-20 دقيقة
          case "long":
            return duration > 20; // أكثر من 20 دقيقة
          default:
            return true;
        }
      });
    }

    setFilteredData(filtered);

    // تقسيم البيانات المفلترة إلى المجموعات الثلاث
    const categorizedData = {
      warm_discussion: filtered.filter(
        (item) =>
          EventsData.warmDiscussion &&
          EventsData.warmDiscussion.some((original) => original.id === item.id)
      ),
      drama: filtered.filter(
        (item) =>
          EventsData.dramaData &&
          EventsData.dramaData.some((original) => original.id === item.id)
      ),
      event_reports: filtered.filter(
        (item) =>
          EventsData.eventReports &&
          EventsData.eventReports.some((original) => original.id === item.id)
      ),
    };

    setDisplayedData(categorizedData);
  };

  // تحميل البيانات الأولية
  useEffect(() => {
    const initialData = {
      warm_discussion: EventsData.warmDiscussion || [],
      drama: EventsData.dramaData || [],
      event_reports: EventsData.eventReports || [],
    };
    setDisplayedData(initialData);
    setFilteredData(allData);
  }, []);

  // تطبيق الفلاتر عند تغيير أي فلتر
  useEffect(() => {
    applyFilters();
  }, [
    selectedDateRange,
    selectedAuthor,
    selectedCountry,
    selectedContentType,
    selectedLanguage,
    selectedDuration,
  ]);

  const handleSortData = () => {
    if (searchValue?.length) {
      setSearchData((prevData) => ({
        ...prevData,
        results: {
          warm_discussion: [...prevData.results.warm_discussion].reverse(),
          drama: [...prevData.results.drama].reverse(),
          event_reports: [...prevData.results.event_reports].reverse(),
        },
      }));
    } else {
      setDisplayedData((prevData) => ({
        warm_discussion: [...prevData.warm_discussion].reverse(),
        drama: [...prevData.drama].reverse(),
        event_reports: [...prevData.event_reports].reverse(),
      }));
    }
    toast.success(t("Data Sorted!"));
  };

  // البحث في البيانات المفلترة
  useEffect(() => {
    if (searchValue?.length) {
      const searchResults = filteredData.filter(
        (item) =>
          item.title?.toLowerCase().includes(searchValue.toLowerCase()) ||
          item.author?.toLowerCase().includes(searchValue.toLowerCase()) ||
          item.category?.toLowerCase().includes(searchValue.toLowerCase())
      );

      // تقسيم نتائج البحث إلى المجموعات الثلاث
      const categorizedSearchResults = {
        warm_discussion: searchResults.filter(
          (item) =>
            EventsData.warmDiscussion &&
            EventsData.warmDiscussion.some(
              (original) => original.id === item.id
            )
        ),
        drama: searchResults.filter(
          (item) =>
            EventsData.dramaData &&
            EventsData.dramaData.some((original) => original.id === item.id)
        ),
        event_reports: searchResults.filter(
          (item) =>
            EventsData.eventReports &&
            EventsData.eventReports.some((original) => original.id === item.id)
        ),
      };

      setSearchData({
        count: searchResults.length,
        results: categorizedSearchResults,
      });
    } else {
      setSearchData({
        count: 0,
        results: {
          warm_discussion: [],
          drama: [],
          event_reports: [],
        },
      });
    }
  }, [searchValue, filteredData]);

  // eslint-disable-next-line no-unused-vars
  const handleSearchPagination = () => {
    // إمكانية إضافة المزيد من النتائج هنا
    toast.success(t("Load More Clicked!"));
  };

  return (
    <>
      {/* Start Search Header */}
      <div className="px-4 sm:px-6 md:px-8 lg:px-10 py-5 ">
        <SearchSecion
          setOpenFilterModal={setOpenFilterModal}
          setViewMode={setViewMode}
          viewMode={viewMode}
          setSearchValue={setSearchValue}
          handleSortData={handleSortData}
        />
      </div>
      {/* End Search Header */}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-4 sm:py-0   ">
        <div className="flex flex-col lg:flex-row gap-4 ">
          {/* Start Sidebar Filters */}
          <div className="hidden lg:flex w-full lg:w-80 ">
            <EventsFilter
              selectedDateRange={selectedDateRange}
              setSelectedDateRange={setSelectedDateRange}
              selectedAuthor={selectedAuthor}
              setSelectedAuthor={setSelectedAuthor}
              selectedCountry={selectedCountry}
              setSelectedCountry={setSelectedCountry}
              selectedContentType={selectedContentType}
              setSelectedContentType={setSelectedContentType}
              selectedLanguage={selectedLanguage}
              setSelectedLanguage={setSelectedLanguage}
              selectedDuration={selectedDuration}
              setSelectedDuration={setSelectedDuration}
            />
          </div>
          {/* End Sidebar Filters */}

          {/* Start Show Data */}
          <div>
            {/* Start Search Result */}
            {searchValue?.length ? (
              <div className="flex-1 min-w-0">
                {/* Warm Discussion Results */}
                {searchData.results.warm_discussion?.length > 0 && (
                  <div className="mb-8">
                    <div className="mb-4 flex items-center gap-1">
                      <p className="font-bold text-2xl text-text">
                        {t("Warm discussion")} (
                        {searchData.results.warm_discussion.length})
                      </p>
                    </div>
                    <BrokenCarousel
                      data={searchData.results.warm_discussion}
                      showArrows={false}
                      cardName={ExternalNewsCard}
                    />
                  </div>
                )}

                {/* Drama Results */}
                {searchData.results.drama?.length > 0 && (
                  <div className="mb-8">
                    <div className="mb-4 flex items-center gap-1">
                      <p className="font-bold text-2xl text-text">
                        {t("Drama")} ({searchData.results.drama.length})
                      </p>
                    </div>
                    <BrokenCarousel
                      data={searchData.results.drama}
                      showArrows={false}
                      cardName={ExternalNewsCard}
                    />
                  </div>
                )}

                {/* Event Reports Results */}
                {searchData.results.event_reports?.length > 0 && (
                  <div className="mb-8">
                    <div className="mb-4 flex items-center gap-1">
                      <p className="font-bold text-2xl text-text">
                        {t("Event Reports")} (
                        {searchData.results.event_reports.length})
                      </p>
                    </div>
                    <BrokenCarousel
                      data={searchData.results.event_reports}
                      showArrows={false}
                      cardName={ExternalNewsCard}
                    />
                  </div>
                )}

                {/* No Search Results */}
                {searchData.count === 0 && (
                  <div className="flex-1 text-center py-8">
                    <p className="text-gray-500 text-lg">
                      {t("No search results found")}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              /* End Search Result */
              /* Start Filter Result */
              <div className="flex-1 min-w-0">
                {/* Warm Discussion */}
                {displayedData.warm_discussion?.length > 0 && (
                  <div className="mb-8">
                    <div className="mb-4 flex items-center gap-1">
                      <p className="font-bold text-2xl text-text">
                        {t("Warm discussion")} (
                        {displayedData.warm_discussion.length})
                      </p>
                    </div>
                    <BrokenCarousel
                      data={displayedData.warm_discussion}
                      cardName={ExternalNewsCard}
                      showArrows={displayedData.warm_discussion?.length > 4}
                      nextArrowClassname={"-right-5"}
                      prevArrowClassname={"-left-5 "}
                    />
                  </div>
                )}

                {/* Drama */}
                {displayedData.drama?.length > 0 && (
                  <div className="mb-8">
                    <div className="mb-4 flex items-center gap-1">
                      <p className="font-bold text-2xl text-text">
                        {t("Drama")} ({displayedData.drama.length})
                      </p>
                    </div>
                    <BrokenCarousel
                      data={displayedData.drama}
                      showArrows={displayedData.drama?.length > 4}
                      cardName={ExternalNewsCard}
                      nextArrowClassname={"-right-5"}
                      prevArrowClassname={"-left-5 "}
                    />
                  </div>
                )}

                {/* Event Reports */}
                {displayedData.event_reports?.length > 0 && (
                  <div className="mb-8">
                    <div className="mb-4 flex items-center gap-1">
                      <p className="font-bold text-2xl text-text">
                        {t("Event Reports")} (
                        {displayedData.event_reports.length})
                      </p>
                    </div>
                    <BrokenCarousel
                      data={displayedData.event_reports}
                      showArrows={displayedData.event_reports?.length > 4}
                      cardName={ExternalNewsCard}
                      nextArrowClassname={"-right-5"}
                      prevArrowClassname={"-left-5 "}
                    />
                  </div>
                )}

                {/* No Filter Results */}
                {displayedData.warm_discussion?.length === 0 &&
                  displayedData.drama?.length === 0 &&
                  displayedData.event_reports?.length === 0 && (
                    <div className="flex-1 text-center py-8">
                      <p className="text-gray-500 text-lg">
                        {t("No results found")}
                      </p>
                    </div>
                  )}
              </div>
              /* End Filter Result */
            )}
          </div>
          {/* End Show Data */}

          {/* DatePicker Modal  */}
          <Modal
            isOpen={openFilterModal}
            onClose={() => setOpenFilterModal(false)}
            title={t("Filter")}
          >
            <EventsFilter
              selectedDateRange={selectedDateRange}
              setSelectedDateRange={setSelectedDateRange}
              selectedAuthor={selectedAuthor}
              setSelectedAuthor={setSelectedAuthor}
              selectedCountry={selectedCountry}
              setSelectedCountry={setSelectedCountry}
              selectedContentType={selectedContentType}
              setSelectedContentType={setSelectedContentType}
              selectedLanguage={selectedLanguage}
              setSelectedLanguage={setSelectedLanguage}
              selectedDuration={selectedDuration}
              setSelectedDuration={setSelectedDuration}
              setOpenFilterModal={setOpenFilterModal}
            />
          </Modal>
          {/* End DatePicker Modal  */}
        </div>
      </div>
    </>
  );
}

export default EventsFilterSections;
