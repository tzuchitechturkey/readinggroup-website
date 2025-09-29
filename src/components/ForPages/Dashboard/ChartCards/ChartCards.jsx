import React, { useState } from "react";

import arrowDown from "@/assets/icons/arrow-down.png";
import calendarIcon from "@/assets/icons/calendar.png";
import documentIcon from "@/assets/icons/document-text.png";
import iconArrowborsa from "@/assets/icons/icon-wrapper-16px.png";
import walletIcon from "@/assets/icons/wallet-2.png";
import SubMenu from "@/components/Global/SubMenu/SubMenu";

import MiniChart from "./MiniChart";

//  Mock data
const generateChartData = (trend = "up") => {
  const baseData = [];
  for (let i = 0; i < 12; i++) {
    let value;
    if (trend === "up") {
      value = 20 + i * 3 + Math.random() * 10;
    } else if (trend === "down") {
      value = 50 - i * 2 + Math.random() * 8;
    } else {
      value = 30 + Math.sin(i) * 15 + Math.random() * 5;
    }
    baseData.push({ name: i, value: Math.max(5, value) });
  }
  return baseData;
};

const kpis = [
  {
    title: "All Earnings",
    value: "$30200",
    delta: "+30.6%",
    color: "text-[#4680FF]",
    bg: "bg-[#EDF3FF]",
    chartType: "bar",
    chartColor: "blue",
    chartData: generateChartData("up"),
    icon: walletIcon,
  },
  {
    title: "Documents",
    value: "290+",
    delta: "+30.6%",
    color: "text-[#E58A00]",
    bg: "bg-[#FFF5E5]",
    chartType: "bar",
    chartColor: "orange",
    chartData: generateChartData("mixed"),
    icon: documentIcon,
  },
  {
    title: "News",
    value: "14568",
    delta: "+30.6%",
    color: "text-[#4CB592]",
    bg: "bg-[#EBFAF5]",
    chartType: "bar",
    chartColor: "green",
    chartData: generateChartData("up"),
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
    chartType: "bar",
    chartColor: "red",
    chartData: generateChartData("mixed"),
    icon: arrowDown,
    items: [
      {
        label: "This Week",
        url: "#",
      },
    ],
  },
  {
    title: "Incentive",
    value: "$30200",
    delta: "+30.6%",
    color: "text-[#DC2626]",
    bg: "bg-[#FFFAFA]",
    chartType: "bar",
    chartColor: "red",
    chartData: generateChartData("down"),
    icon: arrowDown,
    items: [
      {
        label: "This Week",
        url: "#",
      },
    ],
  },
  {
    title: "Incentive",
    value: "$30200",
    delta: "+30.6%",
    color: "text-[#DC2626]",
    bg: "bg-[#FFFAFA]",
    chartType: "bar",
    chartColor: "red",
    chartData: generateChartData("up"),
    items: [{}],
    icon: arrowDown,
  },
];

function ChartCards() {
  const [openMenuIndex, setOpenMenuIndex] = useState(null);
  return (
    <div className="  grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-6 gap-4">
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
            <div className="w-14 h-10">
              <MiniChart
                type={k.chartType}
                data={k.chartData}
                color={k.chartColor}
              />
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
