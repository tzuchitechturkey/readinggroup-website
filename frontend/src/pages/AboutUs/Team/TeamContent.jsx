import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { GetTeam } from "@/api/team";
import Loader from "@/components/Global/Loader/Loader";
import TeamFunctionsSection from "@/components/ForPages/AboutUs/Team/TeamFunctionsSection/TeamFunctionsSection";

const heartMaskStyle = {
  WebkitMaskImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z'/%3E%3C/svg%3E")`,
  WebkitMaskSize: "120% 100%", // Ensure the mask scales dynamically
  WebkitMaskRepeat: "no-repeat",
  WebkitMaskPosition: "center",
  maskImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z'/%3E%3C/svg%3E")`,
  maskSize: "120% 100%", // Ensure the mask scales dynamically
  maskRepeat: "no-repeat",
  maskPosition: "center",
};

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
    <div className="w-full bg-[#D7EAFF] min-h-screen py-14 px-4 sm:px-8 lg:px-12 overflow-hidden">
      {isLoading && <Loader />}

      <div className="max-w-6xl mx-auto">
        {/* Top Header */}
        <div className="mb-12">
          <h1 className="text-xl md:text-[40px] font-black text-[#112344]">
            {t("Our Team")}
          </h1>
        </div>

        {/* Sister Section */}
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-center mb-16">
          <div className="lg:w-1/3 flex justify-center lg:justify-start">
            <div
              className="relative w-64 h-64 sm:w-[650px] sm:h-[450px] p-2"
              style={heartMaskStyle}
            >
              <img
                src={groupedData[0]?.images[0]?.image}
                alt={groupedData[0]?.name}
                className="w-[450px] h-[450px] object-cover"
                style={heartMaskStyle}
              />
            </div>
          </div>
          <div className="">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#112344] mb-2 leading-tight">
              {t(groupedData[0]?.title)}
            </h2>

            <p className="text-[#4a6288] leading-relaxed text-sm sm:text-base mb-4 font-medium">
              {t(groupedData[0]?.description)}
            </p>
          </div>
        </div>

        {/* Team Functions Header */}
        <div className="mb-6">
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#112344]">
            {t("All our Team Functions")}
          </h2>
        </div>

        {/* Reusable Section Component */}
        {groupedData?.length > 0 && (
          <TeamFunctionsSection data={groupedData.slice(1)} />
        )}
      </div>
    </div>
  );
}

export default AboutTeamContent;
