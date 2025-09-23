import React from "react";

import LatestPosts from "@/components/ForPages/Dashboard/LatestPosts/LatestPosts";
import DashboardFooter from "@/components/ForPages/Dashboard/DashboardFooter/DashboardFooter";
import DashboardTable from "@/components/ForPages/Dashboard/DashboardTable/DashboardTable";
import ChartCards from "@/components/ForPages/Dashboard/ChartCards/ChartCards";

export default function NexaDashboard() {
  return (
    <div className="w-full min-h-screen bg-[#F5F7FB] p-3 relative text-[#1E1E1E] flex flex-col">
      <div className="flex-1">
        {/* Start Chart Cards */}
        <ChartCards />
        {/* End Chart Cards */}

        <div className="mt-4 grid grid-cols-1 xl:grid-cols-4 gap-4">
          {/* Start Table */}
          <DashboardTable />
          {/* End Table */}

          {/* Start Latest Posts */}
          <LatestPosts />
          {/* End Latest Posts */}
        </div>
      </div>

      {/* Start Footer small note */}
      <div className=" ">
        <DashboardFooter />
      </div>
      {/* Start Footer small note */}
    </div>
  );
}
