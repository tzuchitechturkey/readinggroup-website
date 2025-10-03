import React from "react";

import { useTranslation } from "react-i18next";
import { resolveAsset } from "@/utils/assetResolver";
// بيانات الأعضاء (يمكن استلامها من props أو API)
const memberData = {
  id: 1,
  name: "Mousa Al-Ahmad",
  position: "Front-End Developer",
  image: resolveAsset("azem.png"),
  bio: "With over a decade of experience in front-end development, Mousa specializes in React and interactive applications. He holds multiple development certifications and is known for his motivational approach. Mousa designs user interfaces that are both challenging and achievable. His passion lies in helping teams build strong and user-friendly digital products through custom software solutions. Outside of work, Mousa is an avid runner and enjoys outdoor adventures.",
  description: [
    "Mousa Al-Ahmad is a professional front-end developer with extensive experience in modern web technologies. He began his programming journey over 8 years ago and specializes in building interactive applications using React and TypeScript.",
    "Mousa excels at transforming complex designs into smooth and appealing user interfaces. He is also skilled in modern development tools such as Next.js, Tailwind CSS, and GraphQL.",
    "In his free time, Mousa enjoys sharing his knowledge with the developer community through writing technical articles and participating in local and international tech conferences.",
  ],
  socialMedia: [
    { platform: "instagram", url: "#" },
    { platform: "facebook", url: "#" },
    { platform: "twitter", url: "#" },
    { platform: "linkedin", url: "#" },
  ],
  previousMember: {
    name: "Emma Rodriguez",
    id: 0,
  },
  nextMember: {
    name: "Maya Lee",
    id: 2,
  },
};

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
  facebook: "fab fa-facebook-f",
  instagram: "fab fa-instagram",
  twitter: "fab fa-twitter",
  linkedin: "fab fa-linkedin-in",
  youtube: "fab fa-youtube",
  tiktok: "fab fa-tiktok",
  snapchat: "fab fa-snapchat-ghost",
  whatsapp: "fab fa-whatsapp",
  telegram: "fab fa-telegram-plane",
  discord: "fab fa-discord",
  github: "fab fa-github",
  behance: "fab fa-behance",
  dribbble: "fab fa-dribbble",
  pinterest: "fab fa-pinterest-p",
};

// مكوّن أيقونة وسائل التواصل الاجتماعي
const SocialMediaIcon = ({ platform, url, className = "" }) => {
  const iconClass = socialMediaIcons[platform.toLowerCase()];

  if (!iconClass) {
    // إذا لم توجد الأيقونة، نعرض أيقونة افتراضية
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className={`text-xl hover:scale-110 transition-all duration-200  ${className}`}
        title={platform}
      >
        <i className="fas fa-link" />
      </a>
    );
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`text-xl hover:scale-110 transition-all duration-200  ${className}`}
      title={platform}
    >
      <i className={iconClass} />
    </a>
  );
};

const MemberCard = ({ member }) => {
  return (
    <div className="flex flex-col items-center mb-8">
      {/* Start Img */}
      <div className="relative w-40 h-40 mb-3">
        <div className="w-full h-full border-2 border-gray-600 rounded-lg overflow-hidden bg-gradient-to-b from-transparent to-black/50">
          <img
            src={member.image}
            alt={member.name}
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
          {member.name}
        </h1>
        <p
          className="text-sm font-light"
          style={{ fontFamily: "Lato, sans-serif" }}
        >
          {member.position}
        </p>
      </div>
      {/* End member Info */}

      {/* Start Social Media Icons */}
      <div className="flex gap-4 mb-8">
        {member.socialMedia.map((social, index) => (
          <SocialMediaIcon
            key={index}
            platform={social.platform}
            url={social.url}
            className="text-primary"
          />
        ))}
      </div>
      {/* End Social Media Icons */}
    </div>
  );
};

const MemberDescription = ({ bio, description }) => {
  return (
    <div className="text-text space-y-8 mb-16">
      {/* Start Bio */}
      <div
        className="text-lg leading-relaxed font-light"
        style={{ fontFamily: "Lato, sans-serif" }}
      >
        {bio}
      </div>
      {/* End Bio */}
      {/* Start Description */}
      <div className="space-y-6">
        {description.map((paragraph, index) => (
          <p
            key={index}
            className="text-lg leading-relaxed font-light"
            style={{ fontFamily: "Lato, sans-serif" }}
          >
            {paragraph}
          </p>
        ))}
      </div>
      {/* End Description */}
    </div>
  );
};

const NavigationButtons = ({ t, previousMember, nextMember, onNavigate }) => {
  return (
    <div className="border-t border-gray-300 pt-8">
      <div className="flex justify-between items-center">
        {/* Start Previous Member Button */}
        <div className="flex flex-col items-start">
          <button
            onClick={() => onNavigate(previousMember.id)}
            className="flex items-center  border border-text text-text px-3 pl-6 py-3 rounded hover:bg-white hover:text-text transition-colors duration-200 mb-3"
            style={{ fontFamily: "Lato, sans-serif" }}
          >
            <ArrowIcon direction="right" />
            {t("Previous")}
          </button>
          <span
            className="text-text font-light"
            style={{ fontFamily: "Lato, sans-serif" }}
          >
            {previousMember.name}
          </span>
        </div>
        {/* End Previous Member Button */}

        {/* Start Next Member Button */}
        <div className="flex flex-col items-end">
          <button
            onClick={() => onNavigate(nextMember.id)}
            className="flex items-center gap-1 border border-text text-text px-3 pr-6 py-3 rounded hover:bg-black hover:text-text transition-colors duration-200 mb-3"
            style={{ fontFamily: "Lato, sans-serif" }}
          >
            {t("Next")}
            <ArrowIcon direction="left" />
          </button>
          <span
            className="text-text font-light text-right"
            style={{ fontFamily: "Lato, sans-serif" }}
          >
            {nextMember.name}
          </span>
        </div>
        {/* End Next Member Button */}
      </div>
    </div>
  );
};

function AboutMemberContent({ memberId, onMemberChange }) {
  const { t } = useTranslation();
  // يمكن استخدام memberId لجلب بيانات العضو المحدد
  const currentMember = memberData; // في التطبيق الحقيقي، ستجلب البيانات بناءً على memberId

  const handleNavigation = (newMemberId) => {
    if (onMemberChange) {
      onMemberChange(newMemberId);
    }
  };

  return (
    <div className="min-h-screen  p-8" dir="rtl">
      <div className="max-w-4xl mx-auto">
        {/* بطاقة العضو */}
        <MemberCard member={currentMember} />

        {/* Start Description */}
        <MemberDescription
          bio={currentMember.bio}
          description={currentMember.description}
        />
        {/* End Description */}

        {/* Start Navigation Buttons */}
        <NavigationButtons
          t={t}
          previousMember={currentMember.previousMember}
          nextMember={currentMember.nextMember}
          onNavigate={handleNavigation}
        />
        {/* End Navigation Buttons */}
      </div>
    </div>
  );
}

export default AboutMemberContent;
