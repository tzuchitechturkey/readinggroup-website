import React from "react";

import { useTranslation } from "react-i18next";
import { Link, NavLink } from "react-router-dom";

import UserIcons from "../UserIcons/UserIcons";

function Usernavbar() {
  const { t } = useTranslation();
  const linkList = [
    { name: t("Home"), href: "/" },
    { name: t("Guided Reading"), href: "/guiding-reading" },
    { name: t("Videos"), href: "/videos" },
    { name: t("Cards & Photos"), href: "/cards-photos" },
    { name: t("Connect"), href: "/connect" },
    { name: t("About Us"), href: "/about/history" },
  ];
  return (
    <div className="grid grid-cols-1 md:grid-cols-[30%_57%_12%]  items-center ">
      {/* Start Logo */}
      <Link to={"/"} className="py-4">
        <img
          src={`../../../../src/assets/logo.png`}
          alt="logo"
          className="w-32 h-12 object-contain"
        />
      </Link>
      {/* End Logo */}
      {/* Start Links */}
      <div>
        <ul className="flex items-center gap-6">
          {linkList.map((link, idx) => (
            <li key={idx} className="inline-block mx-4">
              <NavLink
                to={link.href}
                className={({ isActive }) =>
                  `hover:text-gray-600 pb-1 transition-all duration-200 ${
                    isActive ? "border-b-2 border-text" : ""
                  }`
                }
              >
                {link.name}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
      {/* End Links */}
      {/* Start User Icons*/}
      <UserIcons />
      {/* End User Icons */}
    </div>
  );
}

export default Usernavbar;
