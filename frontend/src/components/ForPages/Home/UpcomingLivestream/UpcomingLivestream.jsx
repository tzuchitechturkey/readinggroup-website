import React from "react";

import LivestreamSectionHeader from "../shared/LivestreamSectionHeader";
import LivestreamCard from "../shared/LivestreamCard";

// Mock data for upcoming livestream
 
const UpcomingLivestream = ({ t, data }) => {
  const handleViewScheduleClick = () => {
    // Navigate to full schedule page - implement navigation logic here
  };
  return (
    <div className="md:px-12 lg:px-[120px] w-full lg:w-[1440px] mx-auto">
      <div className="bg-[#285688] w-full overflow-hidden px-4 md:px-8 lg:px-8 py-8 md:py-[28px] lg:py-[32px]">
        <div className=" ">
          {/* Section Header */}
          <LivestreamSectionHeader
            title={t("UPCOMING LIVESTREAM")}
            actionText={t("See schedule")}
            onActionClick={handleViewScheduleClick}
          />

          {/* Livestream Content */}
          <LivestreamCard data={data} t={t} />
        </div>
      </div>
    </div>
  );
};

export default UpcomingLivestream;
