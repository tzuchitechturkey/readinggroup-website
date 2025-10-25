import React, { useState, useEffect } from "react";

import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaLinkedinIn,
  FaYoutube,
  FaTiktok,
  FaSnapchatGhost,
  FaWhatsapp,
  FaTelegramPlane,
  FaDiscord,
  FaGithub,
  FaBehance,
  FaDribbble,
  FaPinterestP,
} from "react-icons/fa";

import Loader from "@/components/Global/Loader/Loader";
import { GetTeamById } from "@/api/aboutUs";

// مكوّن أيقونة السهم
const ArrowIcon = ({ direction = "right" }) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={direction === "left" ? "rotate-180" : ""}
  >
    <path
      d="M9 18L15 12L9 6"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// خريطة أيقونات وسائل التواصل الاجتماعي
const socialMediaIcons = {
  facebook: FaFacebookF,
  instagram: FaInstagram,
  twitter: FaTwitter,
  linkedin: FaLinkedinIn,
  youtube: FaYoutube,
  tiktok: FaTiktok,
  snapchat: FaSnapchatGhost,
  whatsapp: FaWhatsapp,
  telegram: FaTelegramPlane,
  discord: FaDiscord,
  github: FaGithub,
  behance: FaBehance,
  dribbble: FaDribbble,
  pinterest: FaPinterestP,
};
const socialColors = {
  facebook: "#4267B2",
  instagram: "#E1306C",
  twitter: "#1DA1F2",
  linkedin: "#0077B5",
  youtube: "#FF0000",
  tiktok: "#000000",
  snapchat: "#FFFC00",
  whatsapp: "#25D366",
  telegram: "#0088cc",
  discord: "#5865F2",
  github: "#171515",
  behance: "#1769ff",
  dribbble: "#ea4c89",
  pinterest: "#E60023",
};

const NavigationButtons = ({ t, previousMember, nextMember, onNavigate }) => {
  return (
    <div className="border-t border-gray-300 pt-8">
      <div className="flex justify-between items-center">
        {/* Start Previous Member Button */}
        <div className="flex flex-col items-start">
          <button
            onClick={() => onNavigate(previousMember?.id)}
            className="flex items-center  border border-primary text-primary px-3 pl-6 py-3 rounded hover:bg-primary  hover:text-white transition-colors duration-200 mb-3"
            style={{ fontFamily: "Lato, sans-serif" }}
          >
            <ArrowIcon direction="right" />
            {t("Previous")}
          </button>
          <span
            className="text-text font-light"
            style={{ fontFamily: "Lato, sans-serif" }}
          >
            {previousMember?.name}
          </span>
        </div>
        {/* End Previous Member Button */}

        {/* Start Next Member Button */}
        <div className="flex flex-col items-end">
          <button
            onClick={() => onNavigate(nextMember?.id)}
            className="flex items-center gap-1 border border-primary text-primary px-3 pr-6 py-3 rounded hover:bg-primary hover:text-white transition-colors duration-200 mb-3"
            style={{ fontFamily: "Lato, sans-serif" }}
          >
            {t("Next")}
            <ArrowIcon direction="left" />
          </button>
          <span
            className="text-text font-light text-right"
            style={{ fontFamily: "Lato, sans-serif" }}
          >
            {nextMember?.name}
          </span>
        </div>
        {/* End Next Member Button */}
      </div>
    </div>
  );
};

function AboutMemberContent() {
  const { t, i18n } = useTranslation();
  const { id: paramId } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [memberData, setMemberData] = useState({});
  const getData = async () => {
    setIsLoading(true);
    try {
      const response = await GetTeamById(paramId);
      setMemberData(response.data);
    } catch (error) {
      console.error("Error fetching member data:", error);
    } finally {
      setIsLoading(false);
    }
  };
  const handleNavigation = (newMemberId) => {
    if (onMemberChange) {
      onMemberChange(newMemberId);
    }
  };
  useEffect(() => {
    getData();
  }, [paramId]);
  return (
    <div
      className="min-h-[60vh]  p-8 pb-0"
      dir={i18n?.language === "ar" ? "rtl" : "ltr"}
    >
      {isLoading && <Loader />}
      <div className="max-w-4xl mx-auto">
        {/* بطاقة العضو */}
        <div className="flex flex-col items-center mb-8">
          {/* Start Img */}
          <div className="relative w-40 h-40 mb-3">
            <div className="w-full h-full border-2 border-gray-600 rounded-lg overflow-hidden bg-gradient-to-b from-transparent to-black/50">
              <img
                src={memberData?.avatar}
                alt={memberData?.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          {/* End Img */}

          {/* Start member Info */}
          <div className="text-center text-text mb-4">
            <h1
              className="text-xl font-semibold uppercase mb-1 tracking-widest"
              style={{ fontFamily: "Bebas Neue, sans-serif" }}
            >
              {memberData?.name}
            </h1>
            <p
              className="text-sm font-light"
              style={{ fontFamily: "Lato, sans-serif" }}
            >
              {memberData?.position?.name}
            </p>
          </div>
          {/* End member Info */}

          {/* Start Social Media Icons */}
          <div className="flex gap-4 mb-8">
            {memberData?.social_links?.map((item) => {
              const name = item.name.toLowerCase();
              const Icon = socialMediaIcons[name];
              if (!Icon) return null;

              return (
                <a
                  key={item.name}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mx-2 hover:scale-125 transition-transform duration-200"
                >
                  <Icon size={20} color={socialColors[name]} />
                </a>
              );
            })}
          </div>
          {/* End Social Media Icons */}
        </div>

        {/* Start Description */}
        <div className="text-text space-y-8 mb-16">
          {/* Start Description */}
          <div className="space-y-6">{memberData?.description}</div>
          {/* End Description */}
        </div>
        {/* End Description */}

        {/* Start Navigation Buttons */}
        <NavigationButtons
          t={t}
          previousMember={memberData?.previousMember}
          nextMember={memberData?.nextMember}
          onNavigate={handleNavigation}
        />
        {/* End Navigation Buttons */}
      </div>
    </div>
  );
}

export default AboutMemberContent;
