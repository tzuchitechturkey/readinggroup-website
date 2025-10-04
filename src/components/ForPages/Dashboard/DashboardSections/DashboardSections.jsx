import React from "react";

import LatestPosts from "@/components/ForPages/Dashboard/LatestPosts/LatestPosts";
import DashboardTable from "@/components/ForPages/Dashboard/DashboardTable/DashboardTable";
import ChartCards from "@/components/ForPages/Dashboard/ChartCards/ChartCards";

export default function DashboardSections() {
  return (
    <div className="w-full min-h-screen bg-[#F5F7FB] px-3 relative text-[#1E1E1E] flex flex-col">
      <div className="flex-1">
        {/* Start Chart Cards */}
        <ChartCards />
        {/* End Chart Cards */}

        <div className="mt-4 grid grid-cols-1 xl:grid-cols-7 gap-4">
          {/* Start Table */}
          <div className="xl:col-span-5">
            <DashboardTable />
          </div>
          {/* End Table */}

          {/* Start Latest Posts */}
          <div className="xl:col-span-2">
            <LatestPosts />
          </div>
          {/* End Latest Posts */}
        </div>
      </div>
    </div>
  );
}
