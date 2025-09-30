import React, { useState } from "react";

import { useTranslation } from "react-i18next";
import { Search, ArrowUp, Grid2x2, List } from "lucide-react";

import Modal from "@/components/Global/Modal/Modal";
import FilterDatePickerModal from "@/components/ForPages/Videos/FilterDatePickerModal/FilterDatePickerModal";
import Filter from "@/components/ForPages/Videos/Filter/Filter";
import BrokenCarousel from "@/components/Global/BrokenCarousel/BrokenCarousel";
import { Input } from "@/components/ui/input";

function FilterSections() {
  const { t } = useTranslation();
  const [viewMode, setViewMode] = useState("grid");
  const [openFilterModal, setOpenFilterModal] = useState(false);
  const [isDateModalOpen, setIsDateModalOpen] = useState(false);
  const [selectedDateRange, setSelectedDateRange] = useState({
    startDate: null,
    endDate: null,
  });

  const allVideos = [
    {
      id: 1,
      title: "Weekly Feature",
      duration: "25:00",
      category: "Health News",
      type: "Unit Video",
      subject: "Health",
      language: "Arabic",
      image: "/src/assets/authback.jpg",
      featured: true,
    },
    {
      id: 2,
      title: "Weekly Feature",
      duration: "25:00",
      category: "Health News",
      type: "Unit Video",
      subject: "Health",
      language: "Arabic",
      image: "/src/assets/authback.jpg",
      featured: false,
    },
    {
      id: 3,
      title: "Weekly Feature",
      duration: "25:00",
      category: "Health News",
      type: "Full Videos",
      subject: "Health",
      language: "Arabic",
      image: "/src/assets/authback.jpg",
      featured: false,
    },
    {
      id: 4,
      title: "Environment Update",
      duration: "18:30",
      category: "Environment News",
      type: "Unit Video",
      subject: "Environment",
      language: "Chinese",
      image: "/src/assets/authback.jpg",
      featured: true,
    },
    {
      id: 5,
      title: "Environment Update",
      duration: "18:30",
      category: "Environment News",
      type: "Full Videos",
      subject: "Environment",
      language: "Chinese",
      image: "/src/assets/authback.jpg",
      featured: false,
    },
  ];

  const clearDateFilter = () => {
    setSelectedDateRange({ startDate: null, endDate: null });
  };

  const handleDateSelection = (dateSelection) => {
    if (dateSelection.selection) {
      setSelectedDateRange({
        startDate: dateSelection.selection.startDate,
        endDate: dateSelection.selection.endDate,
      });
    }
  };

  // Filter videos by type
  const fullVideos = allVideos.filter((video) => video.type === "Full Videos");
  const healthVideos = allVideos.filter((video) => video.subject === "Health");
  const arabicVideos = allVideos.filter((video) => video.language === "Arabic");

  return (
    <>
      {/* Start Search Header */}
      <div className="p-4 sm:p-6 md:p-8 lg:p-10">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:grid lg:grid-cols-7 items-start lg:items-center gap-4 lg:gap-6">
            {/* Start Search */}
            <div className="w-full lg:col-span-5 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
              <Input
                type="text"
                placeholder="Search items, collections, and accounts"
                className="pl-8 sm:pl-10 pr-4 py-3 sm:py-4 lg:py-5 w-full border border-primary rounded-lg sm:rounded-xl lg:rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
              />
            </div>
            {/* End Search */}

            {/* Start Sort && View Options */}
            <div className="w-full lg:col-span-2 flex  sm:flex-row lg:flex-row items-start sm:items-center lg:items-center gap-3 sm:gap-4 lg:gap-8">
              {/* Start Filter Icon  */}
              <button
                onClick={() => {
                  setOpenFilterModal(true);
                }}
                className="border-[1px] border-primary rounded-lg p-2 hover:bg-gray-50 transition-colors"
              >
                <i
                  className="fa-solid fa-filter"
                  style={{ color: "#4680ff" }}
                />
              </button>

              {/* End Filter Icon  */}

              <button className="outline-none flex items-center gap-2 px-3 sm:px-4 lg:px-5 py-2 sm:py-[6px] border border-primary rounded-lg sm:rounded-xl lg:rounded-2xl cursor-pointer hover:bg-gray-50 transition-colors">
                <span className="text-sm sm:text-base lg:text-xl text-primary font-medium">
                  {t("Sort by")}
                </span>
                <ArrowUp className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
              </button>

              {/* View Mode Toggle */}
              <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded transition-all duration-200 ${
                    viewMode === "grid"
                      ? "bg-blue-600 text-white shadow-sm"
                      : "text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  <Grid2x2
                    className={`w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 ${
                      viewMode === "grid" ? "text-white" : "text-primary"
                    }`}
                  />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded transition-all duration-200 ${
                    viewMode === "list"
                      ? "bg-blue-600 text-white shadow-sm"
                      : "text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  <List
                    className={`w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 ${
                      viewMode === "list" ? "text-white" : "text-primary"
                    }`}
                  />
                </button>
              </div>
            </div>
            {/* End Sort && View Options */}
          </div>
        </div>
      </div>
      {/* End Search Header */}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-4 sm:py-6 md:py-8">
        <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 md:gap-8">
          {/* Sidebar Filters */}
          <div className="hidden lg:flex w-full lg:w-80 xl:w-96 flex-shrink-0">
            <Filter
              setIsDateModalOpen={setIsDateModalOpen}
              selectedDateRange={selectedDateRange}
              setSelectedDateRange={setSelectedDateRange}
            />
          </div>

          {/* Video Grid */}
          <div className="flex-1 min-w-0">
            {/* Start This Full Videos . Unit Video Section */}
            <div className="flex-1">
              <div>
                <div className="mb-4 flex items-center gap-1 ">
                  <p className="font-bold text-2xl text-text">This</p>
                  <h2 className="text-2xl text-text ">
                    Full Videos . Unit Video
                  </h2>
                </div>
                <div className="-mb-1">
                  <BrokenCarousel data={allVideos} showArrows={false} />
                </div>
              </div>
            </div>
            {/* End This Full Videos . Unit Video Section */}
            {/* Start This Full Videos . Unit Video Section */}
            <div className="flex-1">
              <div>
                <div className="mb-4 flex items-center ">
                  <p className="font-bold text-2xl text-text">
                    This Index Subject{" "}
                  </p>
                  <h2 className="text-2xl text-text ">: Health</h2>
                </div>
                <div className="-mb-1">
                  <BrokenCarousel data={allVideos} showArrows={false} />
                </div>
              </div>
            </div>
            {/* End This Full Videos . Unit Video Section */}
            {/* Start This Full Videos . Unit Video Section */}
            <div className="flex-1">
              <div>
                <div className="mb-4 flex items-center  ">
                  <p className="font-bold text-2xl text-text">Language</p>
                  <h2 className="text-2xl text-text ">: Arabic ، Chinese </h2>
                </div>
                <div className="-mb-1">
                  <BrokenCarousel data={allVideos} showArrows={false} />
                </div>
              </div>
            </div>
            {/* End This Full Videos . Unit Video Section */}
          </div>
        </div>

        {/* DatePicker Modal  */}
        <Modal
          isOpen={isDateModalOpen}
          onClose={() => setIsDateModalOpen(false)}
          title={t("Are you sure you want to send the data?")}
        >
          <FilterDatePickerModal
            setIsDateModalOpen={setIsDateModalOpen}
            selectedDateRange={selectedDateRange}
            setSelectedDateRange={setSelectedDateRange}
            clearDateFilter={clearDateFilter}
            handleDateSelection={handleDateSelection}
          />
        </Modal>
        {/* End DatePicker Modal  */}
        {/* DatePicker Modal  */}
        <Modal
          isOpen={openFilterModal}
          onClose={() => setOpenFilterModal(false)}
          title={t("Filter")}
        >
          <Filter
            setIsDateModalOpen={setIsDateModalOpen}
            selectedDateRange={selectedDateRange}
            setSelectedDateRange={setSelectedDateRange}
          />
        </Modal>
        {/* End DatePicker Modal  */}
      </div>
    </>
  );
}

export default FilterSections;
