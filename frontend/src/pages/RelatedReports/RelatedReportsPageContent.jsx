import React, { useEffect, useState } from "react";

import { useTranslation } from "react-i18next";

import {
  GetRelatedReports,
  GetRelatedReportsByCategoryId,
  GetTopViewedRelatedReports,
} from "@/api/relatedReports";
import Pagination from "@/components/Global/PagePagination/PagePagination";
import Loader from "@/components/Global/Loader/Loader";
import { setErrorFn } from "@/Utility/Global/setErrorFn";
import NewClips from "@/components/ForPages/Home/NewClips/NewClips";
import VideoCard from "@/components/Global/VideoCard/VideoCard";

const RelatedReportsPageContent = () => {
  const { t, i18n } = useTranslation();
  const [reportsList, setReportsList] = useState([]);
  const [videoData, setVideoData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [paginationData, setPaginationData] = useState({
    page: 1,
    limit: 16,
    totalCount: 0,
  });
  console.log(reportsList);

  // Fetch reports on mount or when pagination changes
  const fetchReports = async (page = 1) => {
    setIsLoading(true);
    try {
      const offset = (page - 1) * paginationData.limit;
      const res = await GetRelatedReports(paginationData.limit, offset);

      setReportsList(res.data.results || []);
      setPaginationData((prev) => ({
        ...prev,
        page,
        totalCount: res.data.count || 0,
      }));
    } catch (err) {
      setErrorFn(err, t);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch reports filtered by category
  const fetchReportsByCategory = async (categoryId, page = 1) => {
    setIsLoading(true);
    try {
      const offset = (page - 1) * paginationData.limit;
      const res = await GetRelatedReportsByCategoryId(
        categoryId,
        paginationData.limit,
        offset,
      );

      setReportsList(res.data.results || []);
      setPaginationData((prev) => ({
        ...prev,
        page,
        totalCount: res.data.count || 0,
      }));
    } catch (err) {
      setErrorFn(err, t);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await GetRelatedReports(16, 0);

      setCategories(res?.data?.results || []);
    } catch (err) {
      setErrorFn(err, t);
    }
  };

  useEffect(() => {
    fetchReports(1);
    fetchCategories();
  }, []);

  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId);
    setPaginationData((prev) => ({
      ...prev,
      page: 1,
    }));
    if (categoryId) {
      fetchReportsByCategory(categoryId, 1);
    } else {
      fetchReports(1);
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePageChange = (newPage) => {
    if (selectedCategory) {
      fetchReportsByCategory(selectedCategory, newPage);
    } else {
      fetchReports(newPage);
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const fetchVideoData = async () => {
    try {
      const res = await GetTopViewedRelatedReports();
      setVideoData(res.data);
    } catch (error) {
      setErrorFn(error, t);
    }
  };
  useEffect(() => {
    fetchVideoData();
  }, []);
  return (
    <div className="min-h-screen bg-[#D7EAFF] py-8 md:py-12" dir={i18n.dir()}>
      {isLoading && <Loader />}

      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-10 md:mb-14">
          <h1 className="font-['Noto_Sans_TC:Black',sans-serif] font-black text-3xl md:text-4xl lg:text-5xl text-[#081945] mb-3">
            {t("Related Reports")}
          </h1>
          <p className="text-[#285688] text-base md:text-lg font-normal max-w-2xl">
            {t(
              "Watch the latest reports and find out how we can be a part of our community.",
            )}
          </p>
        </div>

        {/* Start Grid Cards */}
        <NewClips clips={videoData || []} t={t} fromHomePage={false} />
        {/* End Grid Cards */}

        <hr className="h-[1px] border-none bg-[#9FB3E1] max-w-7xl mx-auto my-12 " />

        {/* Categories Filter Section */}
        {categories.length > 0 && (
          <div className="mb-10">
            <div className="mb-4">
              <h2 className="font-['Noto_Sans_TC:Black',sans-serif] font-bold  lg:text-xl text-[#081945] uppercase">
                {t("More Reports")}
              </h2>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleCategorySelect(null)}
                className={`px-4 py-2 rounded-full transition-all ${
                  selectedCategory === null
                    ? "bg-[#285688] text-white"
                    : "bg-white text-[#285688] hover:bg-[#285688] hover:text-white"
                }`}
              >
                {t("All")}
              </button>
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleCategorySelect(category.id)}
                  className={`px-4 py-2 rounded-full transition-all ${
                    selectedCategory === category.id
                      ? "bg-[#285688] text-white"
                      : "bg-white text-[#285688]  hover:bg-[#285688] hover:text-white"
                  }`}
                >
                  {category.title}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* More Reports Section */}
        {reportsList.length > 0 ? (
          <>
            {/* Grid of Reports */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4  gap-3 md:gap-4 lg:gap-6 mb-10 md:mb-14">
              {reportsList?.map((report) => (
                <>
                  <VideoCard
                    item={report}
                    navigate={() => {
                      console.log("sasd");
                    }}
                    size="small"
                    fromHomePage={false}
                    rounded={true}
                    reportCard={true}
                    showDate={true}
                  />
                </>
              ))}
            </div>

            {/* Pagination */}
            {Math.ceil(paginationData.totalCount / paginationData.limit) >
              1 && (
              <div className="flex justify-center">
                <Pagination
                  currentPage={paginationData.page}
                  totalPages={Math.ceil(
                    paginationData.totalCount / paginationData.limit,
                  )}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </>
        ) : (
          !isLoading && (
            <div className="text-center py-20">
              <p className="text-[#285688] text-lg">{t("No reports found")}</p>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default RelatedReportsPageContent;
