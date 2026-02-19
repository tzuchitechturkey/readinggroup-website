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
      className="bg-[#5E82AB] w-full pt-[40px] pb-[32px] font-noto"
      dir={i18n?.language === "ar" ? "rtl" : "ltr"}
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8 lg:px-[120px]">
        {/* Main Footer Content */}
        <div className="flex flex-col md:flex-row items-start justify-between gap-12 mb-[32px]">
          {/* Left Column - Community & Events */}
          <div className="flex flex-col gap-[16px] items-start w-full sm:w-auto md:w-[236px]">
            <p className="text-[14px] font-normal text-black tracking-wide">
              COMMUNITY & EVENTS
            </p>
            <div className="flex flex-col gap-[12px]">
              {communityEventsLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  className="text-[16px] font-bold text-white hover:text-white/80 transition-colors"
                >
                  {link.name}
                </a>
              ))}
            </div>
          </div>

          {/* Second Column - About Us */}
          <div className="flex flex-col gap-[16px] items-start w-full sm:w-auto md:w-[168px]">
            <p className="text-[14px] font-normal text-black tracking-wide">
              ABOUT US
            </p>
            <div className="flex flex-col gap-[12px]">
              {aboutUsLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  className="text-[16px] font-bold text-white hover:text-white/80 transition-colors"
                >
                  {link.name}
                </a>
              ))}
            </div>
          </div>

          {/* Third Column - Brands Logos and Social Media */}
          <div className="flex flex-col gap-[24px] items-start w-full md:w-auto">
            {/* Jing Si Logo Section */}
            <div className="flex gap-[20px] items-center justify-between w-full md:w-[250px]">
              <div className="flex flex-col items-start">
                <p className="text-[14px] font-normal text-black tracking-wide">
                  JING SI
                </p>
                <a
                  href="https://www.jingsi.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[16px] font-bold text-white hover:text-white/80 transition-colors"
                >
                  靜思淨斯
                </a>
              </div>
              <img
                alt="Jing Si Logo"
                className="w-[110px] h-auto"
                src={logoImages.jingSi}
              />
            </div>

            {/* DA AI TV Logo Section */}
            <div className="flex gap-[20px] items-center justify-between w-full md:w-[250px]">
              <div className="flex flex-col items-start">
                <p className="text-[14px] font-normal text-black tracking-wide">
                  DA AI TV
                </p>
                <p className="text-[16px] font-bold text-white">大愛電視</p>
              </div>
              <div className="bg-white p-1 rounded-sm">
                <img
                  alt="Da Ai TV Logo"
                  className="w-[110px] h-auto"
                  src={logoImages.daAiTv}
                />
              </div>
            </div>
          </div>

          {/* Right Column - Social Media */}
          <div className="flex flex-col gap-[24px] items-start w-full md:w-auto">
            {/* YouTube Section */}
            <div className="flex gap-[16px] items-center">
              <div className="border-[1.5px] border-solid border-white rounded-full w-[54px] h-[54px] overflow-hidden flex-shrink-0">
                <img
                  alt="YouTube"
                  className="w-full h-full object-cover"
                  src={logoImages.youtube}
                />
              </div>
              <div className="flex flex-col">
                <p className="text-[14px] font-normal text-black tracking-wide">
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
                  className="text-[16px] font-bold text-white underline underline-offset-4 hover:text-white/80 transition-colors"
                >
                  @慈濟高雄線上讀書會
                </a>
              </div>
            </div>

            {/* Facebook Section */}
            <div className="flex gap-[16px] items-center">
              <div className="border-[1.5px] border-solid border-white rounded-full w-[54px] h-[54px] overflow-hidden flex-shrink-0">
                <img
                  alt="Facebook"
                  className="w-full h-full object-cover"
                  src={logoImages.facebook}
                />
              </div>
              <div className="flex flex-col">
                <p className="text-[14px] font-normal text-black tracking-wide">
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
                  className="text-[16px] font-bold text-white underline underline-offset-4 hover:text-white/80 transition-colors"
                >
                  @閱上雲端 - 慈濟高雄線上讀書會
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Main Logo */}
        <div className="flex justify-center mb-[24px]">
          <img
            alt="Main Logo"
            className="w-full max-w-[650px] h-auto"
            src={logoImages.mainLogo}
          />
        </div>

        {/* Copyright and Links */}
        <div className="text-center">
          <p className="text-[15px] font-bold text-white leading-relaxed">
            ©2026 Buddhist Tzu Chi Foundation is a 501(c)(3) nonprofit
            organization.{" "}
            <span className="cursor-pointer hover:underline">
              Privacy Policy
            </span>{" "}
            |{" "}
            <span className="cursor-pointer hover:underline">
              Terms & Conditions
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Footer;
