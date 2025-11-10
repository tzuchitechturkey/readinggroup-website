import React, { useEffect, useState } from "react";

import { useTranslation } from "react-i18next";

import LatestPosts from "@/components/ForPages/Dashboard/LatestPosts/LatestPosts";
import DashboardTable from "@/components/ForPages/Dashboard/DashboardTable/DashboardTable";
import ChartCards from "@/components/ForPages/Dashboard/ChartCards/ChartCards";
import { setErrorFn } from "@/Utility/Global/setErrorFn";
import { GetStatistics } from "@/api/dashboard";
import Loader from "@/components/Global/Loader/Loader";

export default function DashboardSections({ onSectionChange }) {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState();
  const getData = async () => {
    setIsLoading(true);
    try {
      const response = await GetStatistics();
      setData(response.data);
    } catch (error) {
      setErrorFn(error, t);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    getData();
  }, []);
  return (
    <div
      className="w-full min-h-screen bg-[#F5F7FB] px-3 relative text-[#1E1E1E] flex flex-col"
      // dir={i18n?.language === "ar" ? "rtl" : "ltr"}
    >
      {isLoading && <Loader />}
      <div className="flex-1">
        {/* Start Chart Cards */}
        <ChartCards />
        {/* End Chart Cards */}

        <div className="mt-4 grid grid-cols-1 xl:grid-cols-7 gap-4">
          {/* Start Table */}
          <div className="xl:col-span-5">
            <DashboardTable
              data={data?.top_liked}
              onSectionChange={onSectionChange}
            />
          </div>
          {/* End Table */}

          {/* Start Latest Posts */}
          <div className="  xl:col-span-2">
            <LatestPosts
              data={data?.top_liked?.top_posts}
              onSectionChange={onSectionChange}
            />
          </div>
          {/* End Latest Posts */}
        </div>
      </div>
    </div>
  );
}
