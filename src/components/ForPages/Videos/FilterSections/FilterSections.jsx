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
      language: "Chinese",
      image: "/src/assets/authback.jpg",
      featured: false,
    },
    {
      id: 4,
      title: "Weekly Feature",
      duration: "25:00",
      category: "Health News",
      type: "Unit Video",
      subject: "Environment",
      language: "Arabic",
      image: "/src/assets/authback.jpg",
      featured: false,
    },
    {
      id: 5,
      title: "Weekly Feature",
      duration: "25:00",
      category: "Health News",
      type: "Full Videos",
      subject: "Environment",
      language: "Chinese",
      image: "/src/assets/authback.jpg",
      featured: false,
    },
    {
      id: 6,
      title: "Weekly Feature",
      duration: "25:00",
      category: "Health News",
      type: "Unit Video",
      subject: "Health",
      language: "Arabic",
      image: "/src/assets/authback.jpg",
      featured: false,
    },
  ];

  // Handle date selection
  const handleDateSelection = () => {
    setIsDateModalOpen(false);
  };

  const clearDateFilter = () => {
    setSelectedDateRange({ startDate: null, endDate: null });
  };
  return (
    <>
      {/* Start Search */}
      <div className="  p-[10px] ">
        <div className="max-w-6xl border mx-auto grid grid-cols-7 items-center gap-6">
          {/* Start Search */}
          <div className="col-span-5 max-w-full relative ">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Search items, collections, and accounts"
              className="pl-10 pr-4 py-5 w-full border border-primary rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 "
            />
          </div>
          {/* End Search */}

          {/* Start Sort && View Options */}
          <div className="col-span-2   border-red-400 w-full flex items-center  gap-8">
            <div className="flex items-center gap-2 px-5 py-[6px] border border-primary rounded-2xl cursor-pointer">
              <span className="text-xl text-primary">{t("Sort by")}</span>
              <ArrowUp className="w-5 h-5 text-primary" />
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-4 bg-gray-100 rounded-lg  ">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded ${
                  viewMode === "grid"
                    ? "bg-blue-600 text-white"
                    : "text-gray-600 hover:bg-gray-200"
                }`}
              >
                <Grid2x2
                  className={`w-6 h-6 ${
                    viewMode === "grid" ? "text-white" : "text-primary"
                  }`}
                />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded ${
                  viewMode === "list"
                    ? "bg-blue-600 text-white"
                    : "text-gray-600 hover:bg-gray-200"
                }`}
              >
                <List
                  className={`w-6 h-6 ${
                    viewMode === "list" ? "text-white" : "text-primary"
                  }`}
                />
              </button>
            </div>
          </div>
          {/* End Sort && View Options */}
        </div>
      </div>
      {/* ENd Search Header */}
      <div className=" mx-auto p-8 py-4">
        <div className="flex gap-4">
          {/* Sidebar Filters */}
          <Filter
            setIsDateModalOpen={setIsDateModalOpen}
            selectedDateRange={selectedDateRange}
            setSelectedDateRange={setSelectedDateRange}
          />

          {/* Video Grid */}
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

            {/* Health & Environment Section */}
            <div>
              <div className="mb-4 flex items-center gap-1 ">
                <p className="font-bold text-2xl text-text">
                  This Index Subject{" "}
                </p>
                <h2 className="text-xl font-semibold text-gray-900  ">
                  : Health . Environment
                </h2>
              </div>
              <div className="-mb-1">
                <BrokenCarousel data={allVideos} showArrows={false} />
              </div>
            </div>

            {/* Arabic & Chinese Section */}
            <div>
              <div className="mb-4 flex items-center gap-1 ">
                <p className="font-bold text-2xl text-text">Language :</p>
                <h2 className="text-xl font-semibold text-gray-900  ">
                  Arabic . Chinese
                </h2>
              </div>
              <div className="-mb-1">
                <BrokenCarousel data={allVideos} showArrows={false} />
              </div>
            </div>
          </div>
        </div>
        {/* End Filter Secion */}

        {/* Start DatePicker Modal  */}
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
      </div>
    </>
  );
}

export default FilterSections;
