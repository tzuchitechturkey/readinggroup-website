import React, { useState, useEffect } from "react";

import { useTranslation } from "react-i18next";
import { Link, NavLink } from "react-router-dom";
import { HiMenuAlt3, HiX } from "react-icons/hi";

import UserIcons from "../UserIcons/UserIcons";

function Usernavbar() {
  const { t } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const linkList = [
    { name: t("Home"), href: "/" },
    { name: t("Guided Reading"), href: "/guiding-reading" },
    { name: t("Videos"), href: "/videos" },
    { name: t("Cards & Photos"), href: "/cards-photos" },
    { name: t("Events & Community"), href: "/events" },
    { name: t("About Us"), href: "/about" },
  ];

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  // إغلاق القائمة عند تغيير حجم الشاشة إلى أكبر من lg
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        // lg breakpoint
        setIsMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // منع التمرير في الخلفية عندما يكون الـ sidebar مفتوح
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    // تنظيف عند إلغاء المكون
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMenuOpen]);

  // إغلاق الـ sidebar بالـ Escape key
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape" && isMenuOpen) {
        closeMenu();
      }
    };

    if (isMenuOpen) {
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isMenuOpen]);

  return (
    <nav className="relative bg-white shadow-sm">
      <div className="  mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 lg:h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center">
              <img
                src={`../../../../src/assets/logo.png`}
                alt="logo"
                className="w-28 h-10 sm:w-32 sm:h-12 object-contain"
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex lg:items-center lg:justify-center flex-1 mx-8">
            <ul className="flex items-center space-x-8">
              {linkList.map((link, idx) => (
                <li key={idx}>
                  <NavLink
                    to={link.href}
                    className={({ isActive }) =>
                      `hover:text-primary pb-1 transition-all duration-200 text-sm xl:text-base font-medium rounded-sm px-2 py-1 ${
                        isActive
                          ? "border-b-2 border-primary text-primary"
                          : "text-gray-700 hover:text-primary"
                      }`
                    }
                  >
                    {link.name}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Desktop User Icons */}
          <div className="hidden lg:flex lg:items-center">
            <UserIcons />
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden flex items-center space-x-4">
            {/* Mobile User Icons - simplified */}
            <div className=" flex">
              <UserIcons />
            </div>

            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-primary hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary transition-colors duration-200"
              aria-expanded="false"
            >
              <span className="sr-only">{t("Open main menu")}</span>
              {isMenuOpen ? (
                <HiX className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <HiMenuAlt3 className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar Menu */}
      <div
        className={`lg:hidden fixed inset-0 z-50 pointer-events-none ${
          isMenuOpen ? "pointer-events-auto" : ""
        }`}
      >
        {/* Overlay */}
        <div
          className={`fixed inset-0 bg-black transition-all duration-300 ease-in-out ${
            isMenuOpen ? "bg-opacity-50 visible" : "bg-opacity-0 invisible"
          }`}
          onClick={closeMenu}
        />

        {/* Sidebar */}
        <div
          className={`fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-white shadow-2xl border-l border-gray-100 transform transition-all duration-300 ease-in-out ${
            isMenuOpen
              ? "translate-x-0 opacity-100"
              : "translate-x-full opacity-0"
          }`}
        >
          {/* Sidebar Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <Link to="/" onClick={closeMenu} className="flex items-center">
              <img
                src={`../../../../src/assets/logo.png`}
                alt="logo"
                className="w-24 h-8 object-contain"
              />
            </Link>
            <button
              onClick={closeMenu}
              className="p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors duration-200"
            >
              <HiX className="h-6 w-6" />
            </button>
          </div>

          {/* Sidebar Content */}
          <div className="flex flex-col h-full">
            {/* Navigation Links */}
            <nav className="flex-1 px-6 py-8 space-y-3">
              <div className="mb-6">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
                  {t("Navigation")}
                </h3>
              </div>
              {linkList.map((link, idx) => (
                <NavLink key={idx} to={link.href} onClick={closeMenu}>
                  {({ isActive }) => (
                    <div
                      className={`group flex items-center px-4 py-4 rounded-xl text-base font-medium transition-all duration-200 relative overflow-hidden ${
                        isActive
                          ? "bg-gradient-to-r from-primary to-blue-600 text-white shadow-lg shadow-primary/25"
                          : "text-gray-700 hover:bg-gradient-to-r hover:from-gray-50 hover:to-blue-50 hover:text-primary"
                      }`}
                    >
                      <span className="relative z-10">{link.name}</span>
                      {isActive && (
                        <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-white/30 rounded-l-full" />
                      )}
                    </div>
                  )}
                </NavLink>
              ))}
            </nav>

            {/* Sidebar Footer with User Icons */}
            <div className="border-t border-gray-100 bg-gradient-to-r from-gray-50 to-blue-50/30 p-6">
              <div className="text-center mb-4">
                <p className="text-xs text-gray-500 font-medium">
                  {t("Quick Access")}
                </p>
              </div>
              <div className="flex items-center justify-center space-x-4">
                <UserIcons />
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Usernavbar;
