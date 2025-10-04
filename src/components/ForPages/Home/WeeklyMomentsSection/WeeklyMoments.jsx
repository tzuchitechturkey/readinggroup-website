import React from "react";

import { useTranslation } from "react-i18next";

import DynamicSection from "@/components/Global/DynamicSection/DynamicSection";
import WeeklyMomentsCard from "@/components/Global/WeeklyMomentsCard/WeeklyMomentsCard";

const WeeklyMoments = () => {
  const { t } = useTranslation();
  const moments = [
    {
      id: 1,
      title: "Report - Community Gathering",
      startTime: "6:00 AM",
      image: "/authback.jpg",
      statusLabel: "147",
      statusColor: "bg-purple-600",
      type: "News",
      source: "Community",
      language: "AR / EN",
    },
    {
      id: 2,
      title: "Report - Community Gathering",
      startTime: "6:00 AM",
      image: "/",
      statusLabel: "SEPT 01",
      statusColor: "bg-green-600",
      type: "News",
      source: "Community",
      language: "AR / EN",
    },
    {
      id: 3,
      title: "Report - Community Gathering",
      startTime: "6:00 AM",
      image: "/",
      statusLabel: "SEPT 01",
      statusColor: "bg-green-600",
      type: "News",
      source: "Community",
      language: "AR / EN",
    },
    {
      id: 4,
      title: "Report - Community Gathering",
      startTime: "6:00 AM",
      image: "/",
      statusLabel: "SEPT 01",
      statusColor: "bg-green-600",
      type: "News",
      source: "Community",
      language: "AR / EN",
    },
    {
      id: 5,
      title: "Report - Community Gathering",
      startTime: "6:00 AM",
      image: "/",
      statusLabel: "SEPT 01",
      statusColor: "bg-green-600",
      type: "News",
      source: "Community",
      language: "AR / EN",
    },
  ];

  return (
    <div className="mt-6 md:mt-9 lg:mt-12">
      <DynamicSection
        title={t("This Weekly Moments")}
        data={moments}
        cardName={WeeklyMomentsCard}
        isSlider={true} // ✅ تأكيد أنه carousel وليس grid
      />
    </div>
  );
};

export default WeeklyMoments;
