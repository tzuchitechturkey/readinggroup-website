import React, { useState } from "react";

import { useTranslation } from "react-i18next";
import {
  FaArrowDown,
  FaArrowUp,
  FaCalendarAlt,
  FaFileAlt,
  FaWallet,
  FaNewspaper,
  FaVideo,
  FaImages,
  FaPen,
} from "react-icons/fa";

import SubMenu from "@/components/Global/SubMenu/SubMenu";

import MiniChart from "./MiniChart";

// Mock data
const generateChartData = (trend = "up") => {
  const baseData = [];
  for (let i = 0; i < 12; i += 1) {
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

const buildKpis = (t) => [
  {
    id: "allEarnings",
    title: t("allEarnings"),
    value: "$30200",
    delta: "+30.6%",
    color: "text-[#4680FF]",
    bg: "bg-[#EDF3FF]",
    chartType: "bar",
    chartColor: "blue",
    chartData: generateChartData("up"),
    icon: FaWallet,
  },
  {
    id: "documents",
    title: t("documents"),
    value: "290+",
    delta: "+30.6%",
    color: "text-[#E58A00]",
    bg: "bg-[#FFF5E5]",
    chartType: "bar",
    chartColor: "orange",
    chartData: generateChartData("mixed"),
    icon: FaFileAlt,
  },
  {
    id: "news",
    title: t("news"),
    value: "14568",
    delta: "+30.6%",
    color: "text-[#4CB592]",
    bg: "bg-[#EBFAF5]",
    chartType: "bar",
    chartColor: "green",
    chartData: generateChartData("up"),
    icon: FaNewspaper,
    items: [{ label: t("time.thisWeek"), url: "#" }],
  },
  {
    id: "posts",
    title: t("posts"),
    value: "$30200",
    delta: "+30.6%",
    color: "text-[#DC2626]",
    bg: "bg-[#FFFAFA]",
    chartType: "bar",
    chartColor: "red",
    chartData: generateChartData("mixed"),
    icon: FaPen,
    items: [{ label: t("time.thisWeek"), url: "#" }],
  },
  {
    id: "Videos",
    title: t("Videos"),
    value: "$30200",
    delta: "+30.6%",
    color: "text-[#2563EB]",
    bg: "bg-[#EEF2FF]",
    chartType: "bar",
    chartColor: "blue",
    chartData: generateChartData("down"),
    icon: FaVideo,
    items: [{ label: t("time.thisWeek"), url: "#" }],
  },
  {
    id: "Cards & Photos",
    title: t("Cards & Photos"),
    value: "$30200",
    delta: "+30.6%",
    color: "text-[#7C3AED]",
    bg: "bg-[#F5F3FF]",
    chartType: "bar",
    chartColor: "purple",
    chartData: generateChartData("up"),
    icon: FaImages,
    items: undefined,
  },
];

function ChartCards() {
  const { t, i18n } = useTranslation();
  const [openMenuIndex, setOpenMenuIndex] = useState(null);
  const kpis = buildKpis(t);

  return (
    <div
      className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-6 gap-4"
      dir={i18n?.language === "ar" ? "rtl" : "ltr"}
    >
      {kpis.map((k, i) => (
        <div
          key={k.id}
          className="bg-white rounded-lg border border-gray-200 p-4"
        >
          {/* Top Section */}
          <div className="flex items-center gap-3">
            <div className={`${k.bg} rounded-lg p-2`}>
              <div className={`size-5 ${k.color}`}>
                {/* Render the icon component (stored in k.icon) */}
                {k.icon
                  ? React.createElement(k.icon, {
                      className: "h-5 w-5",
                      "aria-hidden": true,
                    })
                  : null}
              </div>
            </div>

            <p className="text-primary text-sm font-medium">{k.title}</p>

            {/* Menu */}
            {/* <div className="ml-auto">
              {Array.isArray(k.items) && k.items.length > 0 && (
                <SubMenu
                  isOpen={openMenuIndex === i}
                  onOpenChange={(v) => setOpenMenuIndex(v ? i : null)}
                  items={k.items}
                />
              )}
            </div> */}
          </div>

          {/* Bottom Section */}
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
                {/* Show up/down arrow depending on delta */}
                {k.delta && k.delta.startsWith("+") ? (
                  <FaArrowUp
                    className="h-4 w-4 text-green-500"
                    aria-hidden="true"
                  />
                ) : (
                  <FaArrowDown
                    className="h-4 w-4 text-red-500"
                    aria-hidden="true"
                  />
                )}
                <span className="text-xs">{k.delta}</span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ChartCards;
