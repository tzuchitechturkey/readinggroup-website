import React, { useState, useEffect } from "react";

import { useTranslation } from "react-i18next";

import { GetHistory } from "@/api/aboutUs";
import { setErrorFn } from "@/Utility/Global/setErrorFn";
import Loader from "@/components/Global/Loader/Loader";
import TimelineItem from "@/components/ForPages/AboutUs/History/TimeLineItem/TimeLineItem";

const AboutHistoryContent = () => {
  const { t } = useTranslation();
  const [isLaoding, setIsLaoding] = useState(false);
  const [historyData, setHistoryData] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const limit = 10;

  const getData = async (page) => {
    setIsLaoding(true);
    const offset = page * limit;
    try {
      const response = await GetHistory(limit, offset);
      const results = response?.data?.results || [];

      // إذا الصفحة الأولى => استبدال البيانات
      if (page === 0) {
        setHistoryData(results);
      } else {
        // غير ذلك => إضافة البيانات الجديدة
        setHistoryData((prev) => [...prev, ...results]);
      }

      // إذا البيانات الجديدة أقل من limit => لا يوجد المزيد
      if (results.length < limit) setHasMore(false);
    } catch (error) {
      setErrorFn(error);
    } finally {
      setIsLaoding(false);
    }
  };

  const handleLoadMore = () => {
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
    getData(nextPage);
  };

  useEffect(() => {
    getData(0);
  }, []);

  return (
    <div className="bg-gray-50 py-16">
      {isLaoding && <Loader />}
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            {t("About Us History (Timeline)")}
          </h2>
        </div>

        <div className="relative w-full mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
          {/* الخط العمودي */}
          <div className="hidden md:block absolute left-1/2 top-0 -translate-x-1/2 w-0.5 lg:w-1 bg-blue-600 h-full z-0" />
          <div className="md:hidden absolute left-2 top-0 w-0.5 bg-blue-600 h-full z-0" />

          {/* محتوى العناصر */}
          <div className="max-w-6xl mx-auto">
            <div className="space-y-8 md:space-y-12 lg:space-y-16 relative z-10">
              {historyData?.map((item, index) => (
                <TimelineItem key={item.id} item={item} index={index} />
              ))}
            </div>
          </div>
        </div>

        {/* زر عرض المزيد */}
        {hasMore && (
          <div className="flex justify-center mt-12">
            <button
              onClick={handleLoadMore}
              disabled={isLaoding}
              className="bg-primary hover:bg-white text-white hover:text-primary border-[1px] border-primary px-6 py-3 rounded-full text-sm font-bold transition-colors duration-200"
            >
              {t("Load more")}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AboutHistoryContent;
