import React, { use, useEffect, useState } from "react";

import { useTranslation } from "react-i18next";

import { GetRelatedReports } from "@/api/relatedReports";
import Pagination from "@/components/Global/PagePagination/PagePagination";
import ReportLargeCard from "@/components/ForPages/RelatedReports/ReportLargeCard";
import ReportCard from "@/components/ForPages/RelatedReports/ReportCard";
import Loader from "@/components/Global/Loader/Loader";
import { setErrorFn } from "@/Utility/Global/setErrorFn";
import NewClips from "@/components/ForPages/Home/NewClips/NewClips";

const RelatedReportsPageContent = () => {
  const { t, i18n } = useTranslation();
  const [reportsList, setReportsList] = useState([]);
  const [videoData, setVideoData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [paginationData, setPaginationData] = useState({
    page: 1,
    limit: 12,
    totalCount: 0,
  });

  // Fetch reports on mount or when pagination changes
  const fetchReports = async (page = 1) => {
    setIsLoading(true);
    try {
      const offset = (page - 1) * paginationData.limit;
      const res = await GetRelatedReports(
        paginationData.limit,
        offset,
        "",
        "-happened_at",
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

  useEffect(() => {
    // fetchReports(1);
  }, []);

  const handlePageChange = (newPage) => {
    fetchReports(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const fetchVideoData = async () => {
    try {
      const res = await GetVideosByTypeVideo();
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
        <NewClips clips={videoData?.clip_video || []} t={t} fromHomePage={false} />
        {/* End Grid Cards */}

        {/* More Reports Section */}
        {reportsList.length > 0 ? (
          <>
            <div className="mb-8">
              <h2 className="font-['Noto_Sans_TC:Black',sans-serif] font-black text-2xl md:text-3xl text-[#081945] uppercase">
                {t("More Reports")}
              </h2>
            </div>

            {/* Grid of Reports */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4 lg:gap-6 mb-10 md:mb-14">
              {reportsList.map((report) => (
                <ReportCard key={report.id} report={report} />
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
