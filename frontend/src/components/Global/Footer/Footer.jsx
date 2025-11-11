import React, { useEffect, useState } from "react";

import { useTranslation } from "react-i18next";

import { socialMediaIcons, socialColors } from "@/constants/constants";
import LanguageDropdown from "@/components/Global/LanguageDropdown/LanguageDropdown";
import { GetWebSiteInfo } from "@/api/info";
import { setErrorFn } from "@/Utility/Global/setErrorFn";

function Footer({ authPages }) {
  const [socialLinks, setSocialLinks] = useState([]);

  const { t, i18n } = useTranslation();
  const linkList = [
    { name: t("Contents"), href: "/contents" },
    { name: t("Videos"), href: "/videos" },
    { name: t("Cards & Photos"), href: "/cards-photos" },
    { name: t("Events & Community"), href: "/events" },
    { name: t("DA AI TV"), href: "https://tzuchiculture.org/EN/da-ai-tv/" },
  ];
  const fetchSocialLinks = async () => {
    try {
      const response = await GetWebSiteInfo(100, 0);
      setSocialLinks(response.data?.results || []);
    } catch (error) {
      setErrorFn(error, t);
    }
  };

  useEffect(() => {
    fetchSocialLinks();
  }, [t]);

  return (
    <div
      className={`px-4 sm:px-8 md:px-10 lg:px-20 ${authPages ? "w-full" : ""}`}
      dir={i18n?.language === "ar" ? "rtl" : "ltr"}
    >
      <div className="py-6 border-t mt-5 border-[#ececec] flex flex-col md:flex-row items-center  justify-between gap-4 md:gap-0">
        <ul className="md:flex md:flex-wrap md:items-center gap-4 sm:gap-6 mb-4 md:mb-0 w-full md:w-auto">
          {linkList.map((link, index) => (
            <li key={index}>
              <a
                href={link.href}
                className={`${
                  authPages ? "text-[#ffffff] " : "text-[#141414]"
                }  relative inline-block group hover:text-[#999EAD] text-xs sm:text-sm transition-colors duration-300 ease-out`}
              >
                {link.name}
                <span
                  aria-hidden
                  className="absolute left-0 -bottom-0.5 h-0.5 w-0 bg-current transition-all duration-300 ease-out group-hover:w-full"
                />
              </a>
            </li>
          ))}
        </ul>
        {/* Start Social Links and Language Dropdown */}
        <div className="flex items-center gap-3 sm:gap-4">
          {socialLinks?.map((link, index) => {
            const platform = link.platform.toLowerCase();
            const Icon = socialMediaIcons[platform];
            if (!Icon) return null;

            return (
              <a
                key={index}
                href={link.url}
                className="text-white group"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Icon size={20} color={socialColors[platform]} />
              </a>
            );
          })}

          <LanguageDropdown iconColor={authPages ? "#fff" : "#141414"} />
        </div>

        {/* End Social Links */}
      </div>
    </div>
  );
}

export default Footer;
