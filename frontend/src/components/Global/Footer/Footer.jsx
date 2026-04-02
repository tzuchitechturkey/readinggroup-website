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
  const [socialLinks, setSocialLinks] = useState({
    youtube: "https://www.youtube.com/@慈濟高雄線上讀書-v7c",
    facebook:
      "https://www.facebook.com/profile.php?id=100090837282933&rdid=e0KJ25Nt1QDBOoqR&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F1CC79NYUCs%2F ",
    daAiTv: "https://www.daai.tv/",
  });

  const { t, i18n } = useTranslation();

  const communityEventsLinks = [
    { name: t("Livestream Schedule"), href: "/livestream-schedule" },
    { name: t("Photo Collection"), href: "/photo-collections" },
    { name: t("Latest News"), href: "/latest-news" },
    { name: t("Related Reports"), href: "/related-reports" },
  ];

  const aboutUsLinks = [
    { name: t("Our History"), href: "/about/history" },
    { name: t("Team Functions"), href: "/about/team" },
    { name: t("閱上雲端 Book"), href: "/about/book" },
  ];

  return (
    <div
      className="bg-gradient-to-b from-[#D7EAFF] to-white w-full pt-[48px] pb-[32px] font-noto"
      dir={i18n?.language === "ar" ? "rtl" : "ltr"}
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 md:px-8 lg:px-[120px]">
        {/* Main Footer Content */}
        <div className="flex flex-col md:flex-row items-start justify-between gap-12 mb-[24px]">
          {/* Left Column - Community & Events */}
          <div className="flex flex-col gap-[24px] items-start w-full sm:w-auto md:w-[236px]">
            <p className="text-[16px] font-normal text-[#081945] tracking-wide">
              {t("COMMUNITY & EVENTS")}
            </p>
            <div className="flex flex-col gap-[24px]">
              {communityEventsLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  className="text-[16px] font-normal text-[#285688] hover:text-[#285688]/80 transition-colors"
                >
                  {link.name}
                </a>
              ))}
            </div>
          </div>

          {/* Second Column - About Us */}
          <div className="flex flex-col gap-[24px] items-start w-full sm:w-auto md:w-[168px]">
            <p className="text-[16px] font-normal text-[#081945] tracking-wide">
              {t("ABOUT US")}
            </p>
            <div className="flex flex-col gap-[24px]">
              {aboutUsLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  className="text-[16px] font-normal text-[#285688] hover:text-[#285688]/80 transition-colors"
                >
                  {link.name}
                </a>
              ))}
            </div>
          </div>

          {/* Third Column - Brands Logos and Social Media */}
          <div className="flex flex-col gap-[24px] items-start w-full md:w-auto">
            {/* Jing Si Logo Section */}
            <a
              href="https://www.jingsi.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex gap-[20px] items-center lg:justify-between w-full md:w-[225px]"
            >
              <div className="flex flex-col items-start gap-[4px] w-20">
                <p className="text-[16px] font-normal text-[#081945] tracking-wide">
                  {t("JING SI")}
                </p>
                <p
                  rel="noopener noreferrer"
                  className="text-[16px] font-normal text-[#285688] hover:text-[#285688]/80 transition-colors"
                >
                  {t("靜思淨斯")}
                </p>
              </div>
              <div className="w-[128px] flex justify-center py-[4px]">
                <img
                  alt="Jing Si Logo"
                  className="w-full h-auto object-contain"
                  src={logoImages.jingSi}
                />
              </div>
            </a>

            {/* DA AI TV Logo Section */}
            <a
              href={socialLinks.daAiTv}
              target="_blank"
              rel="noopener noreferrer"
              className="flex gap-[20px] items-center lg:justify-between w-full md:w-[225px]"
            >
              <div className="flex flex-col items-start gap-[4px] w-20">
                <p className="text-[16px] font-normal text-[#081945] tracking-wide">
                  {t("DA AI TV")}
                </p>
                <p className="text-[16px] font-normal text-[#285688]">
                  {t("大愛電視")}
                </p>
              </div>
              <div className="bg-white p-[8px] rounded-[5px] w-[128px] flex justify-center">
                <img
                  alt="Da Ai TV Logo"
                  className="w-full h-auto object-contain"
                  src={logoImages.daAiTv}
                />
              </div>
            </a>
          </div>

          {/* Right Column - Social Media */}
          <div className="flex flex-col gap-[24px] items-start w-full md:w-auto">
            {/* YouTube Section */}
            <a
              href={socialLinks.youtube}
              target="_blank"
              className="flex gap-[20px] items-center"
            >
              <div className="border border-solid border-[#285688] rounded-full w-[57px] h-[57px] overflow-hidden flex-shrink-0">
                <img
                  alt="YouTube"
                  className="w-full h-full object-cover"
                  src={logoImages.youtube}
                />
              </div>
              <div className="flex flex-col gap-[4px]">
                <p className="text-[16px] font-normal text-[#081945] tracking-wide">
                  {t("YOUTUBE")}
                </p>
                <p
                  rel="noopener noreferrer"
                  className="text-[16px] font-normal text-[#285688] underline underline-offset-4 hover:text-[#285688]/80 transition-colors"
                >
                  {t("@慈濟高雄線上讀書會")}
                </p>
              </div>
            </a>

            {/* Facebook Section */}
            <a
              href={socialLinks.facebook}
              target="_blank"
              className="flex gap-[20px] items-center"
            >
              <div className="border border-solid border-[#285688] rounded-full w-[57px] h-[57px] overflow-hidden flex-shrink-0">
                <img
                  alt="Facebook"
                  className="w-full h-full object-cover"
                  src={logoImages.facebook}
                />
              </div>
              <div className="flex flex-col gap-[4px]">
                <p className="text-[16px] font-normal text-[#081945] tracking-wide">
                  {t("FACEBOOK")}
                </p>
                <p
                  rel="noopener noreferrer"
                  className="text-[16px] font-normal text-[#285688] underline underline-offset-4 hover:text-[#285688]/80 transition-colors"
                >
                  {t("@閱上雲端 - 慈濟高雄線上讀書會")}
                </p>
              </div>
            </a>
          </div>
        </div>

        {/* Main Logo */}
        <div className="flex justify-center mb-[24px]">
          <img
            alt="Main Logo"
            className="w-full max-w-[688px] h-auto"
            src={logoImages.mainLogo}
          />
        </div>

        {/* Copyright and Links */}
        <div className="text-center w-full">
          <p className="text-[16px] font-normal text-[#285688] leading-relaxed">
            ©2026 Buddhist Tzu Chi Foundation is a 501(c)(3) nonprofit
            organization.{" "}
            <span className="cursor-pointer hover:underline">
              {t("Privacy Policy")}
            </span>{" "}
            |{" "}
            <span className="cursor-pointer hover:underline">
              {t("Terms & Conditions")}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Footer;
