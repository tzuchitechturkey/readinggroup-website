import React, { useEffect, useState } from "react";

import { useTranslation } from "react-i18next";

import { GetLatestNews } from "@/api/latestNews";
import Pagination from "@/components/Global/PagePagination/PagePagination";
import NewsCard from "@/components/ForPages/LatestNews/NewsCard";
import Loader from "@/components/Global/Loader/Loader";
import { setErrorFn } from "@/Utility/Global/setErrorFn";

const LatestNewsPageContent = () => {
  const { t, i18n } = useTranslation();
  const [newsList, setNewsList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [paginationData, setPaginationData] = useState({
    page: 1,
    limit: 4,
    totalCount: 0,
  });

  // Fetch news on mount or when pagination changes
  const fetchNews = async (page = 1) => {
    setIsLoading(true);
    try {
      const offset = (page - 1) * paginationData.limit;
      const res = await GetLatestNews(
        paginationData.limit,
        offset,
        "",
        "-happened_at",
      );

      setNewsList(res.data.results || []);
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
    fetchNews(1);
  }, []);

  const handlePageChange = (newPage) => {
    fetchNews(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-[#D7EAFF] py-8 md:py-12" dir={i18n.dir()}>
      {isLoading && <Loader />}

      <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-2 md:mb-14">
          <h1 className="font-['Noto_Sans_TC:Black',sans-serif] font-black text-3xl md:text-4xl lg:text-5xl text-[#081945] mb-3">
            {t("Latest News")}
          </h1>
          <p className="text-[#285688] text-base md:text-lg font-normal max-w-2xl">
            {t(
              "Keep up with the latest news and announcements from Study Group",
            )}
          </p>
        </div>

        {/* Featured News Card */}

        {/* Rest of News List */}
        {newsList.length > 0 ? (
          <>
            <div className="flex flex-col gap-3 md:gap-4 mb-10 md:mb-14">
              {newsList.map((news, index) => (
                <NewsCard
                  key={news.id}
                  news={news}
                  t={t}
                  latestItem={index === newsList.length - 1}
                />
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
              <p className="text-[#285688] text-lg">{t("No news found")}</p>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default LatestNewsPageContent;
