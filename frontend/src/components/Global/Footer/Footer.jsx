import React, { useEffect, useState } from "react";

import { useTranslation } from "react-i18next";

import { GetWebSiteInfo } from "@/api/info";
import { setErrorFn } from "@/Utility/Global/setErrorFn";

import jingSi from "../../../assets/js.png";
import mainLogo from "../../../assets/mainlogo.png";
import daAiTv from "../../../assets/da tv.png";
import youtube from "../../../assets/youtubeChannedLogo.png";
import facebook from "../../../assets/facebook.png";
// Logo placeholders (replace with actual images)
const logoImages = {
  mainLogo,
  jingSi,
  daAiTv,
  youtube,
  facebook,
};

function Footer() {
  const [socialLinks, setSocialLinks] = useState([]);

  const { t, i18n } = useTranslation();

  const communityEventsLinks = [
    { name: t("Livestream Schedule"), href: "/events?type=livestream" },
    { name: t("Photo Collection"), href: "/photo-collections" },
    { name: t("Latest News"), href: "/news" },
    { name: t("Related Reports"), href: "/reports" },
  ];

  const aboutUsLinks = [
    { name: t("Our History"), href: "/about/history" },
    { name: t("Team Functions"), href: "/about/team" },
    { name: t("閱上雲端 Book"), href: "/about/book" },
  ];

  const fetchSocialLinks = async () => {
    try {
      const response = await GetWebSiteInfo(100, 0);
      setSocialLinks(response.data?.socialmedia || []);
    } catch (error) {
      setErrorFn(error, t);
    }
  };

  useEffect(() => {
    fetchSocialLinks();
  }, [t]);

  return (
    <div
      className="bg-[#5E82AB] w-full pt-[24px] sm:pt-[32px] md:pt-[40px] lg:pt-[48px] pb-[20px] sm:pb-[24px] md:pb-[28px] lg:pb-[32px]"
      dir={i18n?.language === "ar" ? "rtl" : "ltr"}
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8 lg:px-[120px]">
        {/* Main Footer Content */}
        <div className="flex flex-col md:flex-row items-start justify-between gap-8 sm:gap-10 md:gap-12 lg:gap-0 mb-[20px] sm:mb-[24px] md:mb-[28px] lg:mb-[32px]">
          {/* Left Column - Community & Events */}
          <div className="flex flex-col gap-[16px] sm:gap-[18px] md:gap-[20px] lg:gap-[24px] items-start leading-[1.5] text-[13px] sm:text-[14px] md:text-[15px] lg:text-[16px] w-full sm:w-auto md:w-[236px]">
            <p className="font-['Noto_Sans_TC:Regular',sans-serif] font-normal text-black">
              COMMUNITY & EVENTS
            </p>
            {communityEventsLinks.map((link, index) => (
              <a
                key={index}
                href={link.href}
                className="font-['Noto_Sans_TC:Bold',sans-serif] font-bold text-white hover:text-[#8FABCA] transition-colors duration-300"
              >
                {link.name}
              </a>
            ))}
          </div>

          {/* Second Column - About Us */}
          <div className="flex flex-col gap-[16px] sm:gap-[18px] md:gap-[20px] lg:gap-[24px] items-start leading-[1.5] text-[13px] sm:text-[14px] md:text-[15px] lg:text-[16px] w-full sm:w-auto md:w-[168px]">
            <p className="font-['Noto_Sans_TC:Regular',sans-serif] font-normal text-black">
              ABOUT US
            </p>
            {aboutUsLinks.map((link, index) => (
              <a
                key={index}
                href={link.href}
                className="font-['Noto_Sans_TC:Bold',sans-serif] font-bold text-white hover:text-[#8FABCA] transition-colors duration-300"
              >
                {link.name}
              </a>
            ))}
          </div>

          {/* Third Column - Brands Logos and Social Media */}
          <div className="flex flex-col gap-[16px] sm:gap-[18px] md:gap-[20px] lg:gap-[24px] items-start md:items-center w-full md:w-auto">
            {/* Jing Si Logo Section */}
            <div className="flex gap-[12px] sm:gap-[16px] md:gap-[20px] lg:gap-[20px] items-center justify-start md:justify-between w-full md:w-[225px]">
              <div className="flex flex-col gap-[2px] sm:gap-[3px] md:gap-[4px] lg:gap-[4px] items-start">
                <p className="font-['Noto_Sans_TC:Regular',sans-serif] font-normal leading-[1.5] text-[11px] sm:text-[12px] md:text-[14px] lg:text-[16px] text-black">
                  JING SI
                </p>
                <a
                  href="https://www.jingsi.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-['Noto_Sans_TC:Bold',sans-serif] font-bold leading-[1.5] text-[11px] sm:text-[12px] md:text-[14px] lg:text-[16px] text-white hover:text-[#8FABCA] transition-colors"
                >
                  靜思淨斯
                </a>
              </div>
              <div className="flex items-center justify-center px-[2px] sm:px-[3px] md:px-[4px] lg:px-[4px] py-[0] rounded-[5px]">
                <img
                  alt="Jing Si Logo"
                  className="w-[80px] sm:w-[100px] md:w-[120px] lg:w-[128px] h-auto"
                  src={logoImages.jingSi}
                />
              </div>
            </div>

            {/* DA AI TV Logo Section */}
            <div className="flex gap-[12px] sm:gap-[16px] md:gap-[20px] lg:gap-[20px] items-center justify-start w-full">
              <div className="flex flex-col gap-[2px] sm:gap-[3px] md:gap-[4px] lg:gap-[4px] items-start text-[11px] sm:text-[12px] md:text-[14px] lg:text-[16px]">
                <p className="font-['Noto_Sans_TC:Regular',sans-serif] font-normal leading-[1.5] text-black">
                  DA AI TV
                </p>
                <p className="font-['Noto_Sans_TC:Bold',sans-serif] font-bold leading-[1.5] text-white">
                  大愛電視
                </p>
              </div>
              <div className="flex items-center justify-center p-[4px] sm:p-[6px] md:p-[8px] lg:p-[8px] rounded-[5px] bg-white">
                <img
                  alt="Da Ai TV Logo"
                  className="w-[80px] sm:w-[100px] md:w-[120px] lg:w-[128px] h-auto"
                  src={logoImages.daAiTv}
                />
              </div>
            </div>
          </div>

          {/* Right Column - Social Media */}
          <div className="flex flex-col gap-[16px] sm:gap-[18px] md:gap-[20px] lg:gap-[24px] items-start justify-center w-full md:w-auto">
            {/* YouTube Section */}
            <div className="flex gap-[12px] sm:gap-[16px] md:gap-[18px] lg:gap-[20px] items-center w-full">
              <div className="border border-solid border-white rounded-full size-[45px] sm:size-[50px] md:size-[54px] lg:size-[57px] overflow-hidden flex-shrink-0">
                <img
                  alt="YouTube"
                  className="w-full h-full object-cover"
                  src={logoImages.youtube}
                />
              </div>
              <div className="flex flex-col font-['Noto_Sans_TC:Bold',sans-serif] font-bold justify-end leading-[1.5] text-[11px] sm:text-[12px] md:text-[14px] lg:text-[16px] text-white">
                <p className="font-['Noto_Sans_TC:Regular',sans-serif] font-normal text-black mb-0.5 sm:mb-1 lg:mb-1">
                  YOUTUBE
                </p>
                <a
                  href={
                    socialLinks.find(
                      (l) => l.platform.toLowerCase() === "youtube",
                    )?.url || "#"
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#8FABCA] transition-colors duration-300 underline break-words"
                >
                  @慈濟高雄線上讀書會
                </a>
              </div>
            </div>

            {/* Facebook Section */}
            <div className="flex gap-[12px] sm:gap-[16px] md:gap-[18px] lg:gap-[20px] items-center w-full">
              <div className="border border-solid border-white rounded-full size-[45px] sm:size-[50px] md:size-[54px] lg:size-[57px] overflow-hidden flex-shrink-0">
                <img
                  alt="Facebook"
                  className="w-full h-full object-cover"
                  src={logoImages.facebook}
                />
              </div>
              <div className="flex flex-col font-['Noto_Sans_TC:Bold',sans-serif] font-bold justify-end leading-[1.5] text-[11px] sm:text-[12px] md:text-[14px] lg:text-[16px] text-white">
                <p className="font-['Noto_Sans_TC:Regular',sans-serif] font-normal text-black mb-0.5 sm:mb-1 lg:mb-1">
                  FACEBOOK
                </p>
                <a
                  href={
                    socialLinks.find(
                      (l) => l.platform.toLowerCase() === "facebook",
                    )?.url || "#"
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#8FABCA] transition-colors duration-300 underline break-words"
                >
                  @閱上雲端 - 慈濟高雄線上讀書會
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Main Logo */}
        <div className="flex justify-center mb-[16px] sm:mb-[20px] md:mb-[24px] lg:mb-[24px]">
          <img
            alt="Main Logo"
            className="w-[280px] sm:w-[380px] md:w-[480px] lg:w-[575px] h-auto"
            src={logoImages.mainLogo}
          />
        </div>

        {/* Copyright and Links */}
        <div className="flex flex-col items-center">
          <div className="text-center">
            <p className="font-['Noto_Sans_TC:Bold',sans-serif] font-bold leading-[1.5] text-[11px] sm:text-[12px] md:text-[14px] lg:text-[16px] text-white whitespace-pre-wrap break-words">
              ©2026 Buddhist Tzu Chi Foundation is a 501(c)(3) nonprofit
              organization. <span className="text-white">Privacy Policy</span> |{" "}
              <span className="text-white">Terms & Conditions</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Footer;
