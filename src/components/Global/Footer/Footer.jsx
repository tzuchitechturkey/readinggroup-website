import React from "react";

import { useTranslation } from "react-i18next";

function Footer({ authPages }) {
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
      icon: authPages ? "facebookIcon.png" : "black-facebook.png",
    },
    {
      name: "Twitter",
      href: "https://www.twitter.com",
      icon: authPages ? "twitterIcon.png" : "black-x.png",
    },
    {
      name: "Instagram",
      href: "https://www.instagram.com",
      icon: authPages ? "instagramIcon.png" : "black-instegram.png",
    },
  ];
  return (
    <div className="px-4 sm:px-8 md:px-10 lg:px-20">
      <p
        className={`${
          authPages ? "text-[#999EAD] " : "text-[#141414]"
        }  text-sm sm:text-base md:text-lg lg:text-base font-medium text-center lg:text-left`}
      >
        {t(
          "Join us today! Enter your email to access weekly updated content, available in multiple languages, with the latest news and interactive programs."
        )}
      </p>

      {/* Start Input  */}
      <div
        className={`bg-[#fff] border mt-4  ${
          authPages ? "border-[#999EAD] " : "border-[#141414]"
        }   w-fit rounded-lg flex md:flex-row  items-center justify-between px-2 py-1  gap-7 transition-all duration-300 ease-out hover:shadow-lg hover:shadow-black/10 hover:-translate-y-0.5  `}
      >
        <input
          className={`w-60 ${
            authPages
              ? " placeholder:text-[#999EAD] text-[#999EAD] "
              : " placeholder:text-[#141414] text-[#141414]"
          }   border-none bg-transparent rounded-lg outline-0 p-2 text-xs sm:text-sm transition-colors duration-300`}
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
                className={`${
                  authPages ? "text-[#999EAD] " : "text-[#141414]"
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
        {/* Start Social Links */}
        <div className="flex items-center gap-3 sm:gap-4">
          {socialLinks.map((link, index) => (
            <a
              key={index}
              href={link.href}
              className={`${
                authPages ? "text-[#999EAD]" : "text-[#141414]"
              }  hover:text-[#FFFFFF] group`}
            >
              <img
                src={`../../../../src/assets/icons/${link.icon}`}
                alt={link.name}
                className="w-5 h-5 transition-transform duration-300 ease-out group-hover:scale-110 group-hover:-translate-y-0.5"
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
