import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { GetTeam } from "@/api/aboutUs";
import Loader from "@/components/Global/Loader/Loader";
import TeamFunctionsSection from "@/components/ForPages/AboutUs/Team/TeamFunctionsSection/TeamFunctionsSection";

const heartMaskStyle = {
  WebkitMaskImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z'/%3E%3C/svg%3E")`,
  WebkitMaskSize: "contain",
  WebkitMaskRepeat: "no-repeat",
  WebkitMaskPosition: "center",
  maskImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z'/%3E%3C/svg%3E")`,
  maskSize: "contain",
  maskRepeat: "no-repeat",
  maskPosition: "center",
};

const SISTER_SECTION_METADATA = {
  mainTitle: "Our Team",
  sectionTitle: "Meet the Sister that runs all the livestreams!",
  sisterName: "美雲老師",
  sisterAvatar: "https://placehold.co/400x400/ffe4e6/e11d48?text=Sister",
  description:
    "美雲老師 serves as the principal teacher And host of our weekly livestream gatherings. With [X] years of dedication to Tzu Chi's mission, she brings profound understanding and compassionate insight to every session. Her leadership has shaped our study group into a thriving community where students from around the world gather to explore Buddhist teachings and cultivate wisdom together. Her commitment to sharing the Dharma continues to inspire all who join us.",
};

const TEAM_FUNCTIONS_METADATA = [
  {
    title: "Guest Hosting Team",
    images: [
      "https://placehold.co/800x400/f1f5f9/475569?text=Guest+Hosting+Banner+1",
      "https://placehold.co/800x400/f1f5f9/475569?text=Guest+Hosting+Banner+2",
      "https://placehold.co/800x400/f1f5f9/475569?text=Guest+Hosting+Banner+3",
    ],
    description:
      "Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper vel class aptent taciti sociosqu. Ad litora torquent per conubia nostra inceptos himenaeos.",
  },
  {
    title: "Broadcasting Team",
    images: [
      "https://placehold.co/800x400/e0f2fe/0369a1?text=Broadcasting+Banner",
    ],
    description:
      "Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper vel class aptent taciti sociosqu. Ad litora torquent per conubia nostra inceptos himenaeos.",
  },
  {
    title: "Video Creation Team",
    images: [
      "https://placehold.co/800x400/f0f9ff/075985?text=Video+Creation+Banner",
    ],
    description:
      "Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper vel class aptent taciti sociosqu. Ad litora torquent per conubia nostra inceptos himenaeos.",
  },
  {
    title: "Steering Team",
    images: ["https://placehold.co/800x400/ecfdf5/065f46?text=Steering+Banner"],
    description:
      "Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper vel class aptent taciti sociosqu. Ad litora torquent per conubia nostra inceptos himenaeos.",
  },
  {
    title: "Documentation Design Team",
    images: ["https://placehold.co/800x400/fff7ed/9a3412?text=Design+Banner"],
    description:
      "Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper vel class aptent taciti sociosqu. Ad litora torquent per conubia nostra inceptos himenaeos.",
  },
  {
    title: "Steering Team ",
    images: [
      "https://placehold.co/800x400/f8fafc/334155?text=Steering+Banner+2",
    ],
    description:
      "Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper vel class aptent taciti sociosqu. Ad litora torquent per conubia nostra inceptos himenaeos.",
  },
  {
    title: "Video Creation Team ",
    images: [
      "https://placehold.co/800x400/f1f5f9/475569?text=Video+Banner+2",
      "https://placehold.co/800x400/f1f5f9/475569?text=Video+Banner+3",
    ],
    description:
      "Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper vel class aptent taciti sociosqu. Ad litora torquent per conubia nostra inceptos himenaeos.",
  },
];

function AboutTeamContent() {
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation();
  const [groupedData, setGroupedData] = useState({});

  const getTeamData = async () => {
    setIsLoading(true);
    try {
      const res = await GetTeam(100, 0);
      const results = res.data.results || [];

      setGroupedData(results);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getTeamData();
  }, []);

  return (
    <div className="w-full bg-[#e6effb] min-h-screen py-12 px-4 sm:px-8 lg:px-12 overflow-hidden">
      {isLoading && <Loader />}

      <div className="max-w-6xl mx-auto">
        {/* Top Header */}
        <div className="mb-12">
          <h1 className="text-3xl md:text-5xl font-extrabold text-[#112344]">
            {t("Our Team")}
          </h1>
        </div>

        {/* Sister Section */}
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 items-center mb-24">
          <div className="lg:w-1/3 flex justify-center lg:justify-start">
            <div
              className="relative w-64 h-64 sm:w-80 sm:h-80 bg-gradient-to-tr from-[#ffe4e6] to-[#ffedd5] p-2"
              style={heartMaskStyle}
            >
              <img
                src={groupedData[0]?.images[0]?.image}
                alt={groupedData[0]?.name}
                className="w-full h-full object-cover"
                style={heartMaskStyle}
              />
            </div>
          </div>
          <div className="lg:w-2/3">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#112344] mb-2 leading-tight">
              {t(groupedData[0]?.title)}
            </h2>

            <p className="text-[#4a6288] leading-relaxed text-sm sm:text-base mb-4 font-medium">
              {t(groupedData[0]?.description)}
            </p>
          </div>
        </div>

        {/* Team Functions Header */}
        <div className="mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#112344]">
            {t("All our Team Functions")}
          </h2>
        </div>

        {/* Reusable Section Component */}
        {groupedData?.length > 0 && <TeamFunctionsSection data={groupedData} />}
      </div>
    </div>
  );
}

export default AboutTeamContent;
