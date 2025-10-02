import React, { useState } from "react";

import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

import Modal from "@/components/Global/Modal/Modal";
import Filter from "@/components/ForPages/Videos/Filter/Filter";
import BrokenCarousel from "@/components/Global/BrokenCarousel/BrokenCarousel";
import VideoCard from "@/components/Global/VideoCard/VideoCard";
import { Button } from "@/components/ui/button";
import authback from "@/assets/authback.jpg";

import SearchSecion from "../SearchSecion/SearchSecion";

const allVideos = [
  {
    id: 1,
    title: "The Future of AI",
    duration: "32:15",
    category: "Technology",
    type: "Full Videos",
    subject: "Science",
    language: "English",
    image: authback,
    featured: true,
  },
  {
    id: 2,
    title: "Secrets of the Deep Ocean",
    duration: "45:10",
    category: "Nature",
    type: "Unit Video",
    subject: "Environment",
    language: "Spanish",
    image: authback,
    featured: false,
  },
  {
    id: 3,
    title: "Ancient Civilizations: Rome",
    duration: "55:20",
    category: "History",
    type: "Full Videos",
    subject: "Education",
    language: "Italian",
    image: authback,
    featured: true,
  },
  {
    id: 4,
    title: "Mastering Python in 10 Steps",
    duration: "28:45",
    category: "Programming",
    type: "Unit Video",
    subject: "Technology",
    language: "English",
    image: authback,
    featured: false,
  },
  {
    id: 5,
    title: "The Art of French Cuisine",
    duration: "38:05",
    category: "Cooking",
    type: "Full Videos",
    subject: "Lifestyle",
    language: "French",
    image: authback,
    featured: true,
  },
  {
    id: 6,
    title: "Journey to the Stars",
    duration: "50:00",
    category: "Astronomy",
    type: "Unit Video",
    subject: "Science",
    language: "German",
    image: authback,
    featured: false,
  },
  {
    id: 7,
    title: "Financial Freedom 101",
    duration: "42:30",
    category: "Finance",
    type: "Full Videos",
    subject: "Business",
    language: "Japanese",
    image: authback,
    featured: true,
  },
  {
    id: 8,
    title: "The World of Digital Art",
    duration: "33:50",
    category: "Art",
    type: "Unit Video",
    subject: "Creativity",
    language: "Chinese",
    image: authback,
    featured: false,
  },
  {
    id: 9,
    title: "Sustainable Living",
    duration: "29:55",
    category: "Lifestyle",
    type: "Full Videos",
    subject: "Environment",
    language: "Russian",
    image: authback,
    featured: true,
  },
  {
    id: 10,
    title: "Beginner's Guide to Yoga",
    duration: "22:00",
    category: "Health",
    type: "Unit Video",
    subject: "Wellness",
    language: "Arabic",
    image: authback,
    featured: false,
  },
];
function FilterSections() {
  const { t } = useTranslation();
  const [viewMode, setViewMode] = useState("grid");
  const [openFilterModal, setOpenFilterModal] = useState(false);
  const [selectedDateRange, setSelectedDateRange] = useState({
    startDate: null,
    endDate: null,
  });
  const [contentType, setContentType] = useState(["full_video"]);
  const [indexSubject, setIndexSubject] = useState(["health"]);
  const [languageContent, setLanguageContent] = useState(["en"]);
  const [searchValue, setSearchValue] = useState("");
  const [searchData, setSearchData] = useState({
    count: 10,
    results: allVideos,
  });
  const [displayedVideos, setDisplayedVideos] = useState(allVideos);

  const handleSortData = () => {
    if (searchValue?.length) {
      setSearchData((prevData) => ({
        ...prevData,
        results: [...prevData.results].reverse(),
      }));
    } else {
      // This part is tricky because allVideos is a constant.
      // To make the view update, we need a state for the filtered videos.
      // For now, let's assume we have a state for filtered videos, e.g., `filteredVideos`
      // and a setter `setFilteredVideos`.
      // Since that state doesn't exist, I'll reverse `allVideos` and put it in a new state.
      // Let's create a new state for the videos displayed in the carousels.
      setDisplayedVideos((prevVideos) => [...prevVideos].reverse());
    }
    toast.success(t("Data Sorted!"));
  };

  const handleSearchPagination = (searchTerm) => {
    console.log("searchTerm", searchTerm);
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
            <Filter
              selectedDateRange={selectedDateRange}
              setSelectedDateRange={setSelectedDateRange}
              setContentType={setContentType}
              setIndexSubject={setIndexSubject}
              setLanguageContent={setLanguageContent}
            />
          </div>
          {/* End Sidebar Filters */}

          {/* Start Show Data */}
          <div>
            {/* Start Search Result */}
            {searchValue?.length ? (
              <div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-1">
                  {searchData?.results?.map((video) => (
                    <VideoCard key={video.id} item={video} />
                  ))}
                </div>
                {searchData.count > 9 && (
                  <div className="text-center mt-8">
                    <Button onClick={handleSearchPagination}>
                      {t("Load More")}
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              /* End Search Result */
              /* Start Filter Result */

              <div className="flex-1 min-w-0 ">
                {/* Start This Full Videos . Unit Video Section */}
                {contentType?.length > 0 ? (
                  <div className="flex-1">
                    <div>
                      <div className="mb-2 flex items-center gap-1 ">
                        <p className="font-bold text-2xl text-text">
                          {t("This")}
                        </p>
                        <h2 className="text-2xl text-text ">
                          {contentType.map((type, idx) => (
                            <span key={type}>
                              {type === "full_video"
                                ? t("Full Videos")
                                : type === "unit_video"
                                ? t("Unit Video")
                                : t(type)}
                              {idx < contentType.length - 1 && " ، "}
                            </span>
                          ))}
                        </h2>
                      </div>
                      <div className="">
                        <BrokenCarousel
                          data={displayedVideos}
                          showArrows={false}
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  ""
                )}
                {/* End This Full Videos . Unit Video Section */}
                {/* Start This Full Videos . Unit Video Section */}
                {indexSubject?.length > 0 ? (
                  <div className="flex-1">
                    <div>
                      <div className="my-2 flex items-center ">
                        <p className="font-bold text-2xl text-text">
                          {t("This Index Subject")}
                        </p>
                        <h2 className="text-2xl text-text ">
                          {" "}
                          :{" "}
                          {indexSubject.map((subject, idx) => (
                            <span key={subject}>
                              {subject === "health"
                                ? t("Health")
                                : subject === "environment"
                                ? t("Environment")
                                : subject === "education"
                                ? t("Education")
                                : t(subject)}
                              {idx < indexSubject.length - 1 && " ، "}
                            </span>
                          ))}
                        </h2>
                      </div>
                      <div className="">
                        <BrokenCarousel
                          data={displayedVideos}
                          showArrows={false}
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  ""
                )}
                {/* End This Full Videos . Unit Video Section */}
                {/* Start This Full Videos . Unit Video Section */}
                {languageContent?.length > 0 ? (
                  <div className="flex-1">
                    <div>
                      <div className="my-2 flex items-center  ">
                        <p className="font-bold text-2xl text-text">
                          {t("Language")}
                        </p>
                        <h2 className="text-2xl text-text ">
                          :{" "}
                          {languageContent.map((lang, idx) => (
                            <span key={lang}>
                              {lang === "ar"
                                ? t("Arabic")
                                : lang === "ch"
                                ? t("Chinese")
                                : lang === "en"
                                ? t("English")
                                : lang === "jp"
                                ? t("Japanese")
                                : lang === "fr"
                                ? t("French")
                                : lang === "de"
                                ? t("German")
                                : lang === "ru"
                                ? t("Russian")
                                : lang === "es"
                                ? t("Spanish")
                                : t(lang)}
                              {idx < languageContent.length - 1 && " ، "}
                            </span>
                          ))}
                        </h2>
                      </div>
                      <div className="">
                        <BrokenCarousel
                          data={displayedVideos}
                          showArrows={false}
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  ""
                )}
                {/* End This Full Videos . Unit Video Section */}
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
            <Filter
              selectedDateRange={selectedDateRange}
              setSelectedDateRange={setSelectedDateRange}
              setContentType={setContentType}
              setIndexSubject={setIndexSubject}
              setLanguageContent={setLanguageContent}
            />
          </Modal>
          {/* End DatePicker Modal  */}
        </div>
      </div>
    </>
  );
}

export default FilterSections;
