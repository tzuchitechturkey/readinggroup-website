import React, { useState, useEffect } from "react";

import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

import Modal from "@/components/Global/Modal/Modal";
import BrokenCarousel from "@/components/Global/BrokenCarousel/BrokenCarousel";
import ExternalNewsCard from "@/components/Global/ExternalNewsCard/ExternalNewsCard";
import SearchSecion from "@/components/Global/SearchSecion/SearchSecion";
import EventsFilter from "@/components/ForPages/Events/EventsFilter/EventsFilter";
import {
  GetEventSections,
  GetTop5EventsBySectionId,
  GetEvents,
} from "@/api/events";
import Loader from "@/components/Global/Loader/Loader";
import { Button } from "@/components/ui/button";

function EventsFilterSections() {
  const { t, i18n } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [viewMode, setViewMode] = useState("grid");
  const [openFilterModal, setOpenFilterModal] = useState(false);

  const [sectionsList, setSectionsList] = useState([]);
  const [defaultSections, setDefaultSections] = useState({
    section1: { id: null, name: "", events: [] },
    section2: { id: null, name: "", events: [] },
    section3: { id: null, name: "", events: [] },
  });

  const [filters, setFilters] = useState({
    search: "",
    section: [],
    category: [],
    country: [],
    writer: "",
    language: [],
    happened_at: null,
  });

  const [filteredData, setFilteredData] = useState({ count: 0, results: [] });
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10;

  const hasActiveFilters =
    filters.search.length > 0 ||
    (Array.isArray(filters.section) && filters.section.length > 0) ||
    (Array.isArray(filters.category) && filters.category.length > 0) ||
    (Array.isArray(filters.country) && filters.country.length > 0) ||
    (filters.writer && Object.keys(filters.writer).length > 0) ||
    (Array.isArray(filters.language) && filters.language.length > 0) ||
    filters.happened_at !== null;

  const setErrorFn = (error) => {
    const errorMessage =
      error?.response?.data?.message || t("An error occurred");
    toast.error(errorMessage);
  };

  const updateFilter = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };
  console.log(filteredData, "filtersfiltersfiltersfilters");
  const handleClearFilters = () => {
    setFilters({
      search: "",
      section: [],
      category: [],
      country: [],
      writer: "",
      language: [],
      happened_at: null,
    });
    setCurrentPage(1);
    setFilteredData({ count: 0, results: [] });
    toast.success(t("Filters cleared"));
  };

  const loadSectionsList = async () => {
    try {
      const res = await GetEventSections(100, 0, "");
      setSectionsList(res.data?.results || []);
      return res.data?.results || [];
    } catch (error) {
      setErrorFn(error);
      return [];
    }
  };

  const loadDefaultSections = async () => {
    setIsLoading(true);
    try {
      const sections = await loadSectionsList();

      if (sections.length >= 3) {
        const [section1Data, section2Data, section3Data] = await Promise.all([
          GetTop5EventsBySectionId(sections[0].id),
          GetTop5EventsBySectionId(sections[1].id),
          GetTop5EventsBySectionId(sections[2].id),
        ]);

        setDefaultSections({
          section1: {
            id: sections[0].id,
            name: sections[0].name,
            events: section1Data?.data || [],
          },
          section2: {
            id: sections[1].id,
            name: sections[1].name,
            events: section2Data?.data || [],
          },
          section3: {
            id: sections[2].id,
            name: sections[2].name,
            events: section3Data?.data || [],
          },
        });
      }
    } catch (error) {
      setErrorFn(error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchFilteredEvents = async (page = 1) => {
    setIsLoading(true);
    const offset = (page - 1) * limit;

    try {
      const params = {};

      if (filters.search) params.search = filters.search;

      // Convert section array to comma-separated string
      if (Array.isArray(filters.section) && filters.section.length > 0) {
        params.section = filters.section
          .map((item) => item?.name || item)
          .join(",");
      }

      // Convert category array to comma-separated string
      if (Array.isArray(filters.category) && filters.category.length > 0) {
        params.category = filters.category
          .map((item) => item?.name || item)
          .join(",");
      }

      // Convert country array to comma-separated string
      if (Array.isArray(filters.country) && filters.country.length > 0) {
        params.country = filters.country
          .map((item) => item?.name || item)
          .join(",");
      }

      // Handle writer (can be object with username or string)
      if (filters.writer) {
        if (typeof filters.writer === "object" && filters.writer.username) {
          params.writer = filters.writer.username;
        } else if (typeof filters.writer === "string") {
          params.writer = filters.writer;
        }
      }

      // Convert language array to comma-separated string
      if (Array.isArray(filters.language) && filters.language.length > 0) {
        params.language = filters.language.join(",");
      }

      if (filters.happened_at) params.happened_at = filters.happened_at;

      const res = await GetEvents(limit, offset, params);

      if (page === 1) {
        setFilteredData(res?.data);
      } else {
        setFilteredData((prev) => ({
          count: res?.data?.count || 0,
          results: [...prev.results, ...(res?.data?.results || [])],
        }));
      }
    } catch (error) {
      setErrorFn(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoadMore = () => {
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
    fetchFilteredEvents(nextPage);
  };

  const handleSortData = () => {
    if (hasActiveFilters) {
      setFilteredData((prevData) => ({
        ...prevData,
        results: [...prevData.results].reverse(),
      }));
    } else {
      setDefaultSections((prev) => ({
        section1: {
          ...prev.section1,
          events: [...prev.section1.events].reverse(),
        },
        section2: {
          ...prev.section2,
          events: [...prev.section2.events].reverse(),
        },
        section3: {
          ...prev.section3,
          events: [...prev.section3.events].reverse(),
        },
      }));
    }
    toast.success(t("Data Sorted!"));
  };

  useEffect(() => {
    if (hasActiveFilters) {
      setCurrentPage(1);
      fetchFilteredEvents(1);
    }
  }, [
    filters.search,
    filters.section,
    filters.category,
    filters.country,
    filters.writer,
    filters.language,
    filters.happened_at,
  ]);

  useEffect(() => {
    loadDefaultSections();
  }, []);

  return (
    <div rtl={i18n.language === "ar" ? "rtl" : "ltr"} className="w-full">
      {isLoading && <Loader />}

      <div className="px-4 sm:px-6 md:px-8 lg:px-10 py-5 ">
        <SearchSecion
          setOpenFilterModal={setOpenFilterModal}
          setViewMode={setViewMode}
          viewMode={viewMode}
          setSearchValue={(value) => updateFilter("search", value)}
          searchValue={filters.search}
          handleSortData={handleSortData}
        />

        {hasActiveFilters && (
          <div className="mt-4">
            <Button
              variant="outline"
              onClick={handleClearFilters}
              className="text-red-600 border-red-600 hover:bg-red-50"
            >
              {t("Clear All Filters")}
            </Button>
          </div>
        )}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-4 sm:py-0">
        <div className="flex flex-col lg:flex-row gap-4 ">
          <div className="hidden lg:flex w-full lg:w-80 ">
            <EventsFilter
              filters={filters}
              updateFilter={updateFilter}
              sectionsList={sectionsList}
            />
          </div>

          <div className="flex-1 min-w-0">
            {hasActiveFilters ? (
              <div>
                <div className="mb-4">
                  <h2 className="text-2xl font-bold text-text">
                    {t("Search Results")} ({filteredData.count})
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-1">
                  {filteredData?.results?.map((event) => {
                    console.log(event, "eeeeeeeeeeeeeeeeeeeee");
                    return <ExternalNewsCard key={event.id} item={event} />;
                  })}
                </div>

                {filteredData?.results?.length === 0 && !isLoading && (
                  <div className="text-center py-10">
                    <p className="text-gray-500 text-lg">
                      {t("No events found")}
                    </p>
                  </div>
                )}

                {filteredData.count > filteredData?.results?.length && (
                  <div className="text-center mt-8">
                    <Button onClick={handleLoadMore} disabled={isLoading}>
                      {isLoading ? t("Loading...") : t("Load More")}
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-8">
                {defaultSections.section1.events?.length > 0 && (
                  <div>
                    <div className="mb-4">
                      <h2 className="text-2xl font-bold text-text">
                        {defaultSections.section1.name}
                      </h2>
                    </div>
                    <BrokenCarousel
                      data={defaultSections.section1.events}
                      showArrows={defaultSections.section1.events.length > 4}
                      cardName={ExternalNewsCard}
                      nextArrowClassname={"-right-5"}
                      prevArrowClassname={"-left-5"}
                    />
                  </div>
                )}

                {defaultSections.section2.events?.length > 0 && (
                  <div>
                    <div className="mb-4">
                      <h2 className="text-2xl font-bold text-text">
                        {defaultSections.section2.name}
                      </h2>
                    </div>
                    <BrokenCarousel
                      data={defaultSections.section2.events}
                      showArrows={defaultSections.section2.events.length > 4}
                      cardName={ExternalNewsCard}
                      nextArrowClassname={"-right-5"}
                      prevArrowClassname={"-left-5"}
                    />
                  </div>
                )}

                {defaultSections.section3.events?.length > 0 && (
                  <div>
                    <div className="mb-4">
                      <h2 className="text-2xl font-bold text-text">
                        {defaultSections.section3.name}
                      </h2>
                    </div>
                    <BrokenCarousel
                      data={defaultSections.section3.events}
                      showArrows={defaultSections.section3.events.length > 4}
                      cardName={ExternalNewsCard}
                      nextArrowClassname={"-right-5"}
                      prevArrowClassname={"-left-5"}
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default EventsFilterSections;
