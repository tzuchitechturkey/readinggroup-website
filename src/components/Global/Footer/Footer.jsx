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
    <div className="px-10">
      <p className="text-[#989898]">
        {t(
          "Join us today! Enter your email to access weekly updated content, available in multiple languages, with the latest news and interactive programs."
        )}
      </p>

      {/* Start Input  */}
      <div className="bg-[#7c7c7c9f] border-[1px] mt-4 border-[#999EAD] w-fit rounded-lg flex items-center justify-between ">
        <input
          className="w-80  placeholder:text-[#999EAD] border-[px] border-gray-200 bg-transparent rounded-lg outline-none p-2"
          placeholder={t("Enter your email")}
        />
        {/* Start Icon  */}
        <div className="w-10">
          <img
            src="../../../../src/assets/icons/emailIcon.png"
            alt="email"
            className="w-7 h-7 mr-3"
          />
        </div>
        {/* End Icon  */}
      </div>
      {/* End Input  */}

      <div className=" py-6 border-t-[1px] mt-5 border-[#999EAD] flex items-center justify-between">
        <ul className="flex items-enter gap-6">
          {linkList.map((link, index) => (
            <li key={index}>
              <a
                href={link.href}
                className="text-[#999EAD] hover:text-[#FFFFFF]"
              >
                {link.name}
              </a>
            </li>
          ))}
        </ul>
        {/* Start Social Links */}

        {/* End Social Links */}
        <div className="flex items-center gap-4">
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
      </div>
    </div>
  );
}

export default Footer;
