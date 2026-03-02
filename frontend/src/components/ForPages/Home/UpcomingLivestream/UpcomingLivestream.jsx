import React from "react";

import LivestreamSectionHeader from "../shared/LivestreamSectionHeader";
import LivestreamCard from "../shared/LivestreamCard";

// Mock data for upcoming livestream
const mockLivestreamData = {
  id: 1,
  title: "Neuroscience Education",
  date: "Jan. 28, 2026",
  thumbnail: "/api/placeholder/692/452",
  speakers: [
    {
      name: "Wu Chengyao",
      avatar: "/api/placeholder/30/30",
    },
    {
      name: "Huang Yongcun",
      avatar: "/api/placeholder/30/30",
    },
    {
      name: "Liu Yijun",
      avatar: "/api/placeholder/30/30",
    },
    {
      name: "Group with Boai Long-term Care Center in Kaohsiung",
      avatar: "/api/placeholder/30/30",
    },
  ],
  description:
    "Join our upcoming neuroscience education session with leading experts in the field.",
};

const UpcomingLivestream = ({ t, data }) => {
  const handleViewScheduleClick = () => {
    // Navigate to full schedule page - implement navigation logic here
  };
  return (
    <div className="px-4 sm:px-6 md:px-12 lg:px-[120px] w-full lg:w-[1440px] mx-auto">
      <div className="bg-[#285688] w-full overflow-hidden px-4 sm:px-6 md:px-8 lg:px-8 py-[20px] sm:py-[24px] md:py-[28px] lg:py-[32px]">
        <div className=" ">
          {/* Section Header */}
          <LivestreamSectionHeader
            title="UPCOMING LIVESTREAM"
            actionText="View Schedule"
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
