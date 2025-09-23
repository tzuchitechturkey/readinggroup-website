import React from "react";

import { useTranslation } from "react-i18next";

function Footer() {
  const { t } = useTranslation();
  const linkList = [
    { name: t("Guided Reading"), href: "/guided-reading" },
    { name: t("Unit Videos"), href: "/unit-videos" },
    { name: t("Full Videos"), href: "/full-videos" },
    { name: t("Health News"), href: "/health-news" },
    { name: t("DA AI TV"), href: "/da-ai-tv" },
  ];

  const socialLinks = [
    {
      name: "Facebook",
      href: "https://www.facebook.com",
      icon: "facebookIcon.png",
    },
    {
      name: "Twitter",
      href: "https://www.twitter.com",
      icon: "twitterIcon.png",
    },
    {
      name: "Instagram",
      href: "https://www.instagram.com",
      icon: "instagramIcon.png",
    },
  ];
  return (
    <div className="px-4 sm:px-8 md:px-10 lg:px-20">
      <p className="text-[#989898] text-sm sm:text-base md:text-lg lg:text-lg text-center lg:text-left">
        {t(
          "Join us today! Enter your email to access weekly updated content, available in multiple languages, with the latest news and interactive programs."
        )}
      </p>

      {/* Start Input  */}
      <div className="bg-[#7c7c7c9f] border mt-4 border-[#999EAD] w-fit rounded-lg flex md:flex-row  items-center justify-between px-2 py-1  gap-7">
        <input
          className="w-60 text-[#999ead] placeholder:text-[#999EAD] border-none bg-transparent rounded-lg outline-none p-2 text-xs sm:text-sm"
          placeholder={t("Enter your email")}
        />
        {/* Start Icon  */}
        <div className="w-10 flex justify-center items-center">
          <img
            src="../../../../src/assets/icons/emailIcon.png"
            alt="email"
            className="w-7 h-7"
          />
        </div>
        {/* End Icon  */}
      </div>
      {/* End Input  */}

      <div className="py-6 border-t mt-5 border-[#999EAD] flex flex-col md:flex-row items-center  justify-between gap-4 md:gap-0">
        <ul className="md:flex md:flex-wrap md:items-center gap-4 sm:gap-6 mb-4 md:mb-0 w-full md:w-auto">
          {linkList.map((link, index) => (
            <li key={index}>
              <a
                href={link.href}
                className="text-[#999EAD] hover:text-[#FFFFFF] text-xs sm:text-sm"
              >
                {link.name}
              </a>
            </li>
          ))}
        </ul>
        {/* Start Social Links */}
        <div className="flex items-center gap-3 sm:gap-4">
          {socialLinks.map((link, index) => (
            <a
              key={index}
              href={link.href}
              className="text-[#999EAD] hover:text-[#FFFFFF]"
            >
              <img
                src={`../../../../src/assets/icons/${link.icon}`}
                alt={link.name}
                className="w-5 h-5"
              />
            </a>
          ))}
        </div>
        {/* End Social Links */}
      </div>
    </div>
  );
}

export default Footer;
