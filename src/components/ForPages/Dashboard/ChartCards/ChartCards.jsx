import React, { useState } from "react";

import iconArrowborsa from "@/assets/icons/icon-wrapper-16px.png";
import SubMenu from "@/components/Global/SubMenu/SubMenu";
import blueChartIcon from "@/assets/blueChaty.png";
import redChartIcon from "@/assets/icons/redchart.png";
import secoundryChartIcon from "@/assets/icons/secoundrychart.png";
import arrowDown from "@/assets/icons/arrow-down.png";
import calendarIcon from "@/assets/icons/calendar.png";
import documentIcon from "@/assets/icons/document-text.png";
import walletIcon from "@/assets/icons/wallet-2.png";

const kpis = [
  {
    title: "All Earnings",
    value: "$30200",
    delta: "+30.6%",
    color: "text-[#4680FF]",
    bg: "bg-[#EDF3FF]",
    chartIcon: blueChartIcon,
    icon: walletIcon,
  },
  {
    title: "Documents",
    value: "290+",
    delta: "+30.6%",
    color: "text-[#E58A00]",
    bg: "bg-[#FFF5E5]",
    icon: documentIcon,
    chartIcon: secoundryChartIcon,
  },
  {
    title: "News",
    value: "14568",
    delta: "+30.6%",
    color: "text-[#4CB592]",
    bg: "bg-[#EBFAF5]",
    chartIcon: redChartIcon,
    icon: calendarIcon,
    items: [
      {
        label: "This Week",
        url: "#",
      },
    ],
  },
  {
    title: "Posts",
    value: "$30200",
    delta: "+30.6%",
    color: "text-[#DC2626]",
    bg: "bg-[#FFFAFA]",
    chartIcon: redChartIcon,
    icon: arrowDown,
    items: [
      {
        label: "This Week",
        url: "#",
      },
    ],
  },
  {
    title: "Posts",
    value: "$30200",
    delta: "+30.6%",
    color: "text-[#DC2626]",
    bg: "bg-[#FFFAFA]",
    chartIcon: redChartIcon,
    icon: arrowDown,
    items: [
      {
        label: "This Week",
        url: "#",
      },
    ],
  },
  {
    title: "Posts",
    value: "$30200",
    delta: "+30.6%",
    color: "text-[#DC2626]",
    bg: "bg-[#FFFAFA]",
    items: [{}],
    chartIcon: redChartIcon,
    icon: arrowDown,
  },
];

function ChartCards() {
  const [openMenuIndex, setOpenMenuIndex] = useState(null);
  return (
    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-6 gap-4">
      {kpis.map((k, i) => (
        <div key={i} className="bg-white rounded-lg border border-gray-200 p-4">
          {/* Start Top Section */}
          <div className="flex items-center gap-3">
            <div className={`${k.bg} rounded-lg p-2`}>
              <div className={`size-5 ${k.color}`}>
                <img src={k.icon} alt="chart icon" />
              </div>
            </div>

            <p className="text-primary text-sm font-medium">{k.title}</p>

            {/* Start Menu */}
            <div className="ml-auto">
              {k?.items?.length && (
                <SubMenu
                  isOpen={openMenuIndex === i}
                  onOpenChange={(v) => setOpenMenuIndex(v ? i : null)}
                  items={k.items}
                />
              )}
            </div>
            {/* End Menu */}
          </div>

          {/* Ens Top Section */}
          {/* Start Bottom Section */}
          <div className="mt-5 flex p-[12px] rounded-lg bg-[#F8F9FA] justify-between gap-5 items-center">
            <div>
              <img src={k.chartIcon} alt="chart icon " className="w-14 h-10" />
            </div>
            <div className="flex flex-col items-end">
              <p className="text-sm font-semibold text-[#1D2630]">{k.value}</p>
              <div className="text-xs text-[#5B6B79] flex items-center gap-1">
                <img
                  src={iconArrowborsa}
                  alt="arrow icon"
                  className="h-4 w-4 dark:[filter:invert(39%)_sepia(85%)_saturate(3000%)_hue-rotate(200deg)]"
                />
                <span className="text-xs">{k.delta}</span>
              </div>
            </div>
          </div>
          {/* End Bottom Section */}
        </div>
      ))}
    </div>
  );
}

export default ChartCards;
