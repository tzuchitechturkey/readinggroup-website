import React, { useState } from "react";

import { useTranslation } from "react-i18next";

import TeamSection from "@/components/ForPages/AboutUs/Team/TeamSection/TeamSection";
import TabsSection from "@/components/ForPages/AboutUs/Team/TabsSection/TabsSection";
// بيانات الفرق والأعضاء
const teamData = {
  all: {
    title: "All Members",
    teams: [
      {
        name: "UI / UX Team",
        members: [
          {
            id: 1,
            name: "Musa Al-Ahmad",
            position: "Frontend Developer",
            image: "/azem.png",
          },
          {
            id: 2,
            name: "Ahmed Mohamed",
            position: "UI/UX Designer",
            image: "/azem.png",
          },
          {
            id: 3,
            name: "Sarah Ahmed",
            position: "Graphic Designer",
            image: "/azem.png",
          },
          {
            id: 4,
            name: "Mohamed Ali",
            position: "Frontend Developer",
            image: "/azem.png",
          },
          {
            id: 5,
            name: "Nour Al-Din",
            position: "Interaction Designer",
            image: "/azem.png",
          },
        ],
      },
      {
        name: "Dev Team",
        members: [
          {
            id: 6,
            name: "Khaled Mahmoud",
            position: "Backend Developer",
            image: "/azem.png",
          },
          {
            id: 7,
            name: "Omar Hassan",
            position: "Software Engineer",
            image: "/azem.png",
          },
          {
            id: 8,
            name: "Laila Ahmed",
            position: "App Developer",
            image: "/azem.png",
          },
          {
            id: 9,
            name: "Yousef Ali",
            position: "Full Stack Developer",
            image: "/azem.png",
          },
          {
            id: 10,
            name: "Mona Salem",
            position: "Systems Analyst",
            image: "/azem.png",
          },
        ],
      },
      {
        name: "Media Team",
        members: [
          {
            id: 11,
            name: "Rania Khaled",
            position: "Content Manager",
            image: "/azem.png",
          },
          {
            id: 12,
            name: "Tarek Mohamed",
            position: "Media Editor",
            image: "/azem.png",
          },
          {
            id: 13,
            name: "Fatima Ahmed",
            position: "Graphic Designer",
            image: "/azem.png",
          },
          {
            id: 14,
            name: "Hossam Ali",
            position: "Video Producer",
            image: "/azem.png",
          },
        ],
      },
    ],
  },
  programmers: {
    title: "Programming Team",
    teams: [
      {
        name: "Programming Team",
        members: [
          {
            id: 6,
            name: "Khaled Mahmoud",
            position: "Backend Developer",
            image: "/azem.png",
          },
          {
            id: 7,
            name: "Omar Hassan",
            position: "Software Engineer",
            image: "/azem.png",
          },
          {
            id: 8,
            name: "Laila Ahmed",
            position: "App Developer",
            image: "/azem.png",
          },
          {
            id: 9,
            name: "Yousef Ali",
            position: "Full Stack Developer",
            image: "/azem.png",
          },
          {
            id: 10,
            name: "Mona Salem",
            position: "Systems Analyst",
            image: "/azem.png",
          },
        ],
      },
    ],
  },
  media: {
    title: "Media Team",
    teams: [
      {
        name: "Media Team",
        members: [
          {
            id: 11,
            name: "Rania Khaled",
            position: "Content Manager",
            image: "/azem.png",
          },
          {
            id: 12,
            name: "Tarek Mohamed",
            position: "Media Editor",
            image: "/azem.png",
          },
          {
            id: 13,
            name: "Fatima Ahmed",
            position: "Graphic Designer",
            image: "/azem.png",
          },
          {
            id: 14,
            name: "Hossam Ali",
            position: "Video Producer",
            image: "/azem.png",
          },
        ],
      },
    ],
  },
  photographers: {
    title: "Photography Team",
    teams: [
      {
        name: "Photography Team",
        members: [
          {
            id: 15,
            name: "Amjad Hassan",
            position: "Photographer",
            image: "/azem.png",
          },
          {
            id: 16,
            name: "Nadia Ahmed",
            position: "Videographer",
            image: "/azem.png",
          },
          {
            id: 17,
            name: "Samer Ali",
            position: "Video Editor",
            image: "/azem.png",
          },
        ],
      },
    ],
  },
  reading: {
    title: "Reading Team",
    teams: [
      {
        name: "Reading Team",
        members: [
          {
            id: 18,
            name: "Doaa Mohamed",
            position: "Reading Programs Coordinator",
            image: "/azem.png",
          },
          {
            id: 19,
            name: "Ahmed Saleh",
            position: "Activity Supervisor",
            image: "/azem.png",
          },
          {
            id: 20,
            name: "Mariam Khaled",
            position: "Review Editor",
            image: "/azem.png",
          },
        ],
      },
    ],
  },
};

function AboutTeamContent() {
  const [activeTab, setActiveTab] = useState("all");
  const { t } = useTranslation();
  const currentTeamData = teamData[activeTab];

  return (
    <div className="max-w-7xl mx-auto lg:p-6 pt-0">
      {/* Start Title */}
      <div className="text-3xl md:text-4xl lg:text-5xl font-semibold text-gray-900 mb-6 md:mb-8 tracking-tight text-center">
        {t("About Us Team Function")}
      </div>
      {/* End Title */}

      {/* Start Tabs */}
      <TabsSection activeTab={activeTab} setActiveTab={setActiveTab} />
      {/* End Tabs */}

      {/* Start Tab Content */}
      <div className="space-y-8 md:space-y-12">
        {currentTeamData.teams.map((team, index) => (
          <TeamSection key={index} team={team} />
        ))}
      </div>
      {/* End Tab Content */}
    </div>
  );
}

export default AboutTeamContent;
