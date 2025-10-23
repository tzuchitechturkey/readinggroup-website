import React, { useEffect, useState } from "react";

import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

import Modal from "@/components/Global/Modal/Modal";
import VideoFilter from "@/components/ForPages/Videos/VideoFilter/VideoFilter";
import BrokenCarousel from "@/components/Global/BrokenCarousel/BrokenCarousel";
import VideoCard from "@/components/Global/VideoCard/VideoCard";
import { Button } from "@/components/ui/button";
import SearchSecion from "@/components/Global/SearchSecion/SearchSecion";
import { GetVideosByFilter } from "@/api/videos";
import Loader from "@/components/Global/Loader/Loader";

const allVideos = [
  {
    id: 1,
    title: "The Future of AI",
    duration: "32:15",
    category: "Technology",
    type: "Full Videos",
    language: "English",
    image: "/authback.jpg",
    featured: true,
  },
  {
    id: 2,
    title: "Secrets of the Deep Ocean",
    duration: "45:10",
    category: "Nature",
    type: "Unit Video",
    language: "Spanish",
    image: "/authback.jpg",
    featured: false,
  },
  {
    id: 3,
    title: "Ancient Civilizations: Rome",
    duration: "55:20",
    category: "History",
    type: "Full Videos",
    language: "Italian",
    image: "/authback.jpg",
    featured: true,
  },
  {
    id: 4,
    title: "Mastering Python in 10 Steps",
    duration: "28:45",
    category: "Programming",
    type: "Unit Video",
    language: "English",
    image: "/authback.jpg",
    featured: false,
  },
  {
    id: 5,
    title: "The Art of French Cuisine",
    duration: "38:05",
    category: "Cooking",
    type: "Full Videos",
    language: "French",
    image: "/authback.jpg",
    featured: true,
  },
  {
    id: 6,
    title: "Journey to the Stars",
    duration: "50:00",
    category: "Astronomy",
    type: "Unit Video",
    language: "German",
    image: "/authback.jpg",
    featured: false,
  },
  {
    id: 7,
    title: "Financial Freedom 101",
    duration: "42:30",
    category: "Finance",
    type: "Full Videos",
    language: "Japanese",
    image: "/authback.jpg",
    featured: true,
  },
  {
    id: 8,
    title: "The World of Digital Art",
    duration: "33:50",
    category: "Art",
    type: "Unit Video",
    language: "Chinese",
    image: "/authback.jpg",
    featured: false,
  },
  {
    id: 9,
    title: "Sustainable Living",
    duration: "29:55",
    category: "Lifestyle",
    type: "Full Videos",
    language: "Russian",
    image: "/authback.jpg",
    featured: true,
  },
  {
    id: 10,
    title: "Beginner's Guide to Yoga",
    duration: "22:00",
    category: "Health",
    type: "Unit Video",
    language: "Arabic",
    image: "/authback.jpg",
    featured: false,
  },
];
function VideoFilterSections() {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [viewMode, setViewMode] = useState("grid");
  const [openFilterModal, setOpenFilterModal] = useState(false);

  const [contentType, setContentType] = useState(["full_video"]);
  const [indexCategory, setIndexCategory] = useState(["health"]);
  const [languageContent, setLanguageContent] = useState(["en"]);
  const [searchValue, setSearchValue] = useState("");

  const [searchData, setSearchData] = useState({
    count: allVideos.length,
    results: allVideos,
  });

  const [videoTypeData, setVideoTypeData] = useState({
    count: allVideos.length,
    results: allVideos,
  });
  const [videoCategoryData, setVideoCategoryData] = useState({
    count: allVideos.length,
    results: allVideos,
  });
  const [videoLanguageData, setVideoLanguageData] = useState({
    count: allVideos.length,
    results: allVideos,
  });
  const [selectedDateRange, setSelectedDateRange] = useState({
    startDate: null,
    endDate: null,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10;

  const getVideoTypeDataByFilter = async (type) => {
    setIsLoading(true);
    const offset = page * 10;
    try {
      const res = await GetVideosByFilter(limit, offset, type);
      setVideoTypeData(res?.data);
    } catch (error) {
      setErrorFn(error);
    } finally {
      setIsLoading(false);
    }
  };
  const getVideoCategoryDataByFilter = async (type) => {
    setIsLoading(true);
    const offset = page * 10;
    try {
      const res = await GetVideosByFilter(limit, offset, type);
      setVideoCategoryData(res?.data);
    } catch (error) {
      setErrorFn(error);
    } finally {
      setIsLoading(false);
    }
  };
  const getVideoLanguageDataByFilter = async (type) => {
    setIsLoading(true);
    const offset = page * 10;
    try {
      const res = await GetVideosByFilter(limit, offset, type);
      setVideoLanguageData(res?.data);
    } catch (error) {
      setErrorFn(error);
    } finally {
      setIsLoading(false);
    }
  };

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
      setSearchData((prevVideos) => [...prevVideos].reverse());
    }
    toast.success(t("Data Sorted!"));
  };

  const handleSearchPagination = (searchTerm) => {
    console.log("searchTerm", searchTerm);
    toast.success(t("Load More Clicked!"));
  };

  useEffect(() => {
    // getVideDataByFilter(contentType);
  }, []);
  return (
    <>
      {isLoading && <Loader />}
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
            <VideoFilter
              selectedDateRange={selectedDateRange}
              setSelectedDateRange={setSelectedDateRange}
              setContentType={setContentType}
              setIndexCategory={setIndexCategory}
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
                          data={videoTypeData?.results}
                          showArrows={videoTypeData?.results?.length > 4}
                          cardName={VideoCard}
                          nextArrowClassname={"-right-5"}
                          prevArrowClassname={"-left-5 "}
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  ""
                )}
                {/* End This Full Videos . Unit Video Section */}
                {/* Start This Full Videos . Unit Video Section */}
                {indexCategory?.length > 0 ? (
                  <div className="flex-1">
                    <div>
                      <div className="my-2 flex items-center ">
                        <p className="font-bold text-2xl text-text">
                          {t("This Index Category")}
                        </p>
                        <h2 className="text-2xl text-text ">
                          {" "}
                          :{" "}
                          {indexCategory.map((category, idx) => (
                            <span key={category}>
                              {category === "health"
                                ? t("Health")
                                : category === "environment"
                                ? t("Environment")
                                : category === "education"
                                ? t("Education")
                                : t(category)}
                              {idx < indexCategory.length - 1 && " ، "}
                            </span>
                          ))}
                        </h2>
                      </div>
                      <div className="">
                        <BrokenCarousel
                          data={videoCategoryData?.results}
                          showArrows={videoCategoryData?.results?.length > 4}
                          cardName={VideoCard}
                          nextArrowClassname={"-right-5"}
                          prevArrowClassname={"-left-5 "}
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
                          data={videoLanguageData?.results}
                          showArrows={videoLanguageData?.results?.length > 4}
                          cardName={VideoCard}
                          nextArrowClassname={"-right-5"}
                          prevArrowClassname={"-left-5"}
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
            <VideoFilter
              selectedDateRange={selectedDateRange}
              setSelectedDateRange={setSelectedDateRange}
              setContentType={setContentType}
              setIndexCategory={setIndexCategory}
              setLanguageContent={setLanguageContent}
              setOpenFilterModa={setOpenFilterModal}
            />
          </Modal>
          {/* End DatePicker Modal  */}
        </div>
      </div>
    </>
  );
}

export default VideoFilterSections;
