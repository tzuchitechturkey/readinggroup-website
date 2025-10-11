import React, { useState } from "react";

import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
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

const tabs = [
  { id: "all", label: "All members" },
  { id: "programmers", label: "Programmers team" },
  { id: "media", label: "Media team" },
  { id: "photographers", label: "Photographers team" },
  { id: "reading", label: "Reading team" },
];

const MemberCard = ({ member }) => {
  return (
    <Link
      to={`/about/team/${member.id}`}
      className="flex flex-col items-center p-2 sm:p-3 w-40 sm:w-48 md:w-56 hover:transform hover:scale-105 transition-all duration-200"
    >
      {/* Start Image */}
      <div className="relative w-36 h-36 sm:w-44 sm:h-44 md:w-52 md:h-52 mb-2 rounded-lg overflow-hidden">
        <div className="relative w-full h-full border border-gray-300 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-200">
          <img
            src={member.image}
            alt={member.name}
            className="w-full h-full object-cover"
          />
          {/* Blur */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded" />
        </div>
      </div>

      {/* Start Member Info */}
      <div className="text-center">
        <h3
          className="text-base sm:text-lg font-semibold text-gray-900 mb-1 uppercase tracking-wider"
          style={{ fontFamily: "Bebas Neue, sans-serif" }}
        >
          {member.name}
        </h3>
        <p
          className="text-xs sm:text-sm text-gray-600 font-light"
          style={{ fontFamily: "Lato, sans-serif" }}
        >
          {member.position}
        </p>
      </div>
      {/* End Member Info */}
    </Link>
  );
};

// مكوّن قسم الفريق
const TeamSection = ({ team }) => {
  return (
    <div className="mb-6 md:mb-8">
      <h2
        className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 md:mb-6 tracking-tight text-center md:text-start"
        style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
      >
        {team.name}
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 justify-items-center">
        {team.members.map((member) => (
          <MemberCard key={member.id} member={member} />
        ))}
      </div>
    </div>
  );
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
      <div className="mb-6 md:mb-8">
        {/* Desktop and Tablet Tabs */}
        <div className="hidden sm:flex flex-wrap border-b border-gray-200">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 md:px-6 py-3 text-sm md:text-base font-bold transition-colors duration-200 border-b-2 ${
                activeTab === tab.id
                  ? "text-blue-600 border-blue-600"
                  : "text-gray-700 border-transparent hover:text-blue-600 hover:border-blue-300"
              }`}
              style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Mobile Free Scroll Tabs */}
        <div className="sm:hidden border-b border-gray-200">
          <div className="overflow-x-auto scrollbar-hide scroll-smooth">
            <div className="flex space-x-2 min-w-max px-4 pb-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-shrink-0 px-5 py-3 text-sm font-bold transition-all duration-200 border-b-2 whitespace-nowrap rounded-t-lg ${
                    activeTab === tab.id
                      ? "text-blue-600 border-blue-600 bg-blue-50"
                      : "text-gray-700 border-transparent hover:text-blue-600 hover:border-blue-300 hover:bg-gray-50"
                  }`}
                  style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
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
