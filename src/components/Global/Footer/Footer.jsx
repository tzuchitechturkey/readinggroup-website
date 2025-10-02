import React from "react";

import { useTranslation } from "react-i18next";

import { useIsMobile } from "@/hooks/use-mobile";
import LanguageDropdown from "@/components/Global/LanguageDropdown/LanguageDropdown";

function Footer({ authPages }) {
  // تحديد إذا كانت اللغة الحالية RTL
  const isMobile = useIsMobile(1224);

  const rtlLanguages = ["ar", "fa", "he", "ur"];
  const currentLang = localStorage.getItem("I18N_LANGUAGE") || "en";
  const isRTL = rtlLanguages.includes(currentLang);
  const { t } = useTranslation();
  const linkList = [
    { name: t("Guided Reading"), href: "/guided-reading" },
    { name: t("Unit Videos"), href: "/unit-videos" },
    { name: t("Full Videos"), href: "/full-videos" },
    { name: t("Health News"), href: "/health-news" },
    { name: t("DA AI TV"), href: "/da-ai-tv" },
  ];
  // dashboard Color : 999EAD
  const socialLinks = [
    {
      name: "Facebook",
      href: "https://www.facebook.com",
      icon: "fa-brands fa-facebook-f",
    },
    {
      name: "Twitter",
      href: "https://www.twitter.com",
      icon: "fa-brands fa-x-twitter",
    },
    {
      name: "Instagram",
      href: "https://www.instagram.com",
      icon: "fa-brands fa-instagram",
    },
  ];
  return (
    <div
      className={`px-4 sm:px-8 md:px-10 lg:px-20 ${authPages ? "w-full" : ""}`}
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div
        className={`bg-[#fff] border mt-4  ${
          authPages ? "border-[#999EAD] " : "border-[#141414]"
        } w-full  md:w-fit rounded-lg flex md:flex-row  items-center justify-between px-2 py-1 gap-2 transition-all duration-300 ease-out hover:shadow-lg hover:shadow-black/5 hover:-translate-y-0.5  `}
      >
        <div className="flex items-center justify-between w-full gap-2">
          <input
            aria-label={t("Enter your email")}
            className={`w-44 ${
              authPages
                ? " placeholder:text-[#999EAD] text-[#999EAD] "
                : " placeholder:text-[#141414] text-[#141414]"
            }   border-none bg-transparent rounded-lg outline-0 p-2 text-xs sm:text-sm transition-colors duration-300`}
            placeholder={t("Enter your email")}
          />
          <button
            type="button"
            onClick={() => {
              /* subscription stub - implement real submit later */
              // console.log('subscribe clicked')
            }}
            className={` px-3 py-2 border rounded-md text-xs font-medium transition-colors duration-200 ${
              authPages
                ? "bg-[#ffffff] text-[#141414] border border-[#ffffff]/20"
                : "bg-[#141414] text-[#ffffff]"
            } hover:opacity-90    `}
          >
            {t("Subscribe")}
          </button>
        </div>
      </div>
      {/* End Input  */}
      <div className="mt-4">
        <p
          className={`${
            authPages ? "text-[#ffffff] " : "text-[#141414]"
          }  text-sm sm:text-base md:text-lg lg:text-base font-medium text-center lg:text-left`}
        >
          {t(
            "Join us today! Enter your email to access weekly updated content, available in multiple languages, with the latest news and interactive programs."
          )}
        </p>
      </div>

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
          {socialLinks.map((link, index) => (
            <a
              key={index}
              href={link.href}
              className={`text-white group`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <i
                className={`${link.icon} w-5 h-5 text-xl text-text transition-transform duration-300 ease-out group-hover:scale-110 group-hover:-translate-y-0.5`}
                aria-label={link.name}
              />
            </a>
          ))}
          <LanguageDropdown iconColor={authPages ? "#fff" : "#141414"} />
        </div>
        {/* End Social Links */}
      </div>
    </div>
  );
}

export default Footer;
