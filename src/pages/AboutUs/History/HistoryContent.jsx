import React from "react";

import { useTranslation } from "react-i18next";

import Timeline from "@/components/ForPages/AboutUs/History/Timeline/Timeline";
// بيانات التاريخ المخصصة للتاريخ
const historyTimelineData = [
  {
    id: 1,
    year: "2010",
    title: "Group Foundation",
    description:
      "The Reading Group was founded as a small initiative to encourage the love of reading in the community. We started with a small group of volunteers who believed in the power of books to change lives.",
    image: "/src/assets/1-top5.jpg",
    hasButton: true,
    alignment: "right",
  },
  {
    id: 2,
    year: "2012",
    title: "First Community Library",
    description:
      "We opened the first free community library, which became a gathering point for reading enthusiasts. The library included more than 1,000 books in various fields.",
    image: null,
    hasButton: false,
    alignment: "left",
  },
  {
    id: 3,
    year: "2015",
    title: "Children’s Reading Program",
    description:
      "We launched a specialized program to encourage children to read, which included interactive workshops and illustrated stories. More than 500 children benefited from the program in its first year.",
    image: null,
    hasButton: false,
    alignment: "right",
  },
  {
    id: 4,
    year: "2018",
    title: "Digital Expansion",
    description:
      "We entered the digital era by launching our online platform, enabling members to access thousands of e-books and share their reading experiences.",
    image: "/src/assets/2-top5.jpg",
    hasButton: true,
    alignment: "left",
  },
  {
    id: 5,
    year: "2020",
    title: "Facing Challenges",
    description:
      "During the COVID-19 pandemic, we succeeded in maintaining our activities by fully shifting to virtual events, allowing us to reach a wider audience.",
    image: "/src/assets/3-top5.jpg",
    hasButton: false,
    alignment: "right",
  },
  {
    id: 6,
    year: "2023",
    title: "The Future is Now",
    description:
      "Today, we are proud to be the largest reading community in the region with more than 10,000 active members and 50 community libraries across different cities.",
    image: "/src/assets/4-top5.jpg",
    hasButton: true,
    alignment: "left",
  },
];

const AboutHistoryContent = () => {
  const { t } = useTranslation();
  return (
    <div className="bg-gray-50 py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            {t("About Us History (Timeline)")}
          </h2>
        </div>

        <Timeline data={historyTimelineData} className="rtl" />
      </div>
    </div>
  );
};

export default AboutHistoryContent;
