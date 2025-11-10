import React, { useState, useEffect } from "react";

import { useTranslation } from "react-i18next";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { HiMenuAlt3, HiX } from "react-icons/hi";

import { GetWebSiteInfo } from "@/api/info";

import UserIcons from "../UserIcons/UserIcons";

function Usernavbar() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [logo, setlogo] = useState({});

  const linkList = [
    { name: t("Home"), href: "/" },
    { name: t("Contents"), href: "/contents" },
    { name: t("Videos"), href: "/videos" },
    { name: t("Cards"), href: "/cards-photos" },
    { name: t("Events & Community"), href: "/events" },
    { name: t("About Us"), href: "/about" },
  ];
  const fetchWebSiteInfo = async () => {
    try {
      const response = await GetWebSiteInfo();
      setlogo(response.data?.logo?.logo);
    } catch (error) {
      setErrorFn(error, t);
    }
  };

  // Navigation items with dropdowns
  const navigationItems = [
    {
      name: t("Home"),
      href: "/",
      hasDropdown: false,
    },
    {
      name: t("Contents"),
      href: "/contents",
      hasDropdown: true,
      subItems: [
        {
          name: t("Guidning Reading"),
          href: "/guiding-reading",
          hasSubmenu: true,
          submenu: [
            {
              name: t("Week's Topic"),
              href: "/contents",
              scrollToId: "week-topic-section",
            },
            {
              name: t("Project Guide to Excellence"),
              href: "/contents",
              scrollToId: "week-moments-section",
            },
          ],
        },

        {
          name: t("Janet & Victor Great Love"),
          href: "/contents",
          scrollToId: "week-health-section",
        },
        {
          name: t("Health"),
          href: "/contents",
          scrollToId: "week-health-section",
        },
        {
          name: t("Others Sessions"),
          href: "/contents",
          scrollToId: "week-other-section",
        },
      ],
    },
    {
      name: t("Videos"),
      scrollToId: "",
      href: "/videos",
      hasDropdown: true,
      subItems: [
        { name: t("Unit Videos"), scrollToId: "unit-videos", href: "/videos" },
        { name: t("Full Videos"), scrollToId: "full-videos", href: "/videos" },
      ],
    },
    {
      name: t("Cards & Photos"),
      scrollToId: "",
      href: "/cards-photos",
      hasDropdown: true,
      subItems: [
        {
          name: t("Good effects"),
          tab: "Suggested for you",
          scrollToId: "cards-tabs-section",
          href: "/cards-photos",
        },
        {
          name: t("Incentive Card"),
          tab: "Incentive Cards",
          scrollToId: "cards-tabs-section",
          href: "/cards-photos",
        },
        {
          name: t("Needlework connects love"),
          tab: "Needlework Love",
          scrollToId: "cards-tabs-section",
          href: "/cards-photos",
        },
        {
          name: t("Week's Photos"),
          tab: "Weekly Posts",
          scrollToId: "cards-tabs-section",
          href: "/cards-photos",
        },
      ],
    },
    {
      name: t("Events & Community"),
      scrollToId: "",
      href: "/events",
      hasDropdown: true,
      subItems: [
        { name: t("News"), scrollToId: "", href: "/events" },
        { name: t("DAAI TV"), scrollToId: "", href: "/events" },
        { name: t("Community Area"), scrollToId: "", href: "/events" },
      ],
    },
    {
      name: t("About Us"),
      scrollToId: "",
      href: "/about",
      hasDropdown: true,
      subItems: [
        {
          name: t("History"),
          tab: "history",
          scrollToId: "about-tabs-section",
          href: "/about",
        },
        {
          name: t("Team Function"),
          tab: "our_team",
          scrollToId: "about-tabs-section",
          href: "/about",
        },
        {
          name: t("Special book for ten years"),
          tab: "history",
          scrollToId: "about-tabs-section",
          href: "/about",
        },
      ],
    },
  ];

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const handleNavClick = (e, item) => {
    e.preventDefault();

    // Navigate to the page with tab parameter if exists
    if (item.tab) {
      navigate(item.href, { state: { activeTab: item.tab } });
    } else {
      navigate(item.href);
    }

    // Scroll to element after navigation
    if (item.scrollToId) {
      setTimeout(() => {
        const el = document.getElementById(item.scrollToId);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 300);
    }
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

  useEffect(() => {
    fetchWebSiteInfo();
  }, []);
  return (
    <nav className="relative bg-white shadow-sm" dir={i18n.dir()}>
      <div className="  mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 lg:h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center">
              <img
                src={logo?.logo || logo}
                alt="logo"
                className="w-28 h-10 sm:w-36 sm:h-12 object-cover"
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex lg:items-center lg:justify-center flex-1 mx-8">
            <ul className="flex items-center ">
              {navigationItems.map((item, idx) => (
                <li key={idx} className="relative group">
                  {item.hasDropdown ? (
                    <>
                      <NavLink
                        to={item.href}
                        onClick={(e) => {
                          if (item.href === "/about") {
                            localStorage.removeItem("aboutUsMainTab");
                          }
                          if (item.scrollToId) {
                            handleNavClick(e, item);
                          }
                        }}
                        className={({ isActive }) =>
                          `hover:text-primary transition-all duration-200 text-sm xl:text-base font-medium px-4 py-2 rounded-sm flex items-center ${
                            isActive
                              ? "border-b-2 border-primary text-primary"
                              : "text-gray-700"
                          }`
                        }
                      >
                        {item.name}
                        <svg
                          className="w-4 h-4 ml-1 transition-transform group-hover:rotate-180"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </NavLink>
                      {/* Dropdown Menu */}
                      <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                        <div className="min-w-[240px] bg-white rounded-xl shadow-xl border border-gray-200 py-3 px-2 animate-in fade-in-0 zoom-in-95">
                          <ul className="space-y-1">
                            {item.subItems.map((subItem, subIdx) => (
                              <li
                                key={subIdx}
                                className={`relative group/submenu ${
                                  subItem.hasSubmenu ? "group/submenu" : ""
                                }`}
                              >
                                <Link
                                  to={subItem.href}
                                  onClick={(e) => handleNavClick(e, subItem)}
                                  className="px-4 py-3 text-sm text-gray-700 hover:text-primary hover:bg-gradient-to-r hover:from-blue-50 hover:to-primary/5 rounded-lg transition-all duration-200 group/item relative flex items-center justify-between"
                                >
                                  <span className="flex items-center">
                                    {subItem.name}
                                  </span>
                                  {subItem.hasSubmenu && (
                                    <svg
                                      className="w-3 h-3 text-gray-400 group-hover/item:text-primary transition-all group-hover/submenu:rotate-90"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 5l7 7-7 7"
                                      />
                                    </svg>
                                  )}
                                </Link>

                                {/* SubMenu */}
                                {subItem.hasSubmenu && (
                                  <div className="absolute left-full top-0 ml-2 opacity-0 invisible group-hover/submenu:opacity-100 group-hover/submenu:visible transition-all duration-200">
                                    <div className="min-w-[220px] bg-white rounded-xl shadow-xl border border-gray-200 py-3 px-2 animate-in fade-in-0 zoom-in-95">
                                      <ul className="space-y-1">
                                        {subItem.submenu.map(
                                          (menuItem, menuIdx) => (
                                            <li key={menuIdx}>
                                              <Link
                                                to={menuItem.href}
                                                onClick={(e) =>
                                                  handleNavClick(e, menuItem)
                                                }
                                                className="block px-4 py-3 text-sm text-gray-700 hover:text-primary hover:bg-gradient-to-r hover:from-blue-50 hover:to-primary/5 rounded-lg transition-all duration-200"
                                              >
                                                {menuItem.name}
                                              </Link>
                                            </li>
                                          )
                                        )}
                                      </ul>
                                    </div>
                                  </div>
                                )}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </>
                  ) : (
                    <NavLink
                      to={item.href}
                      className={({ isActive }) =>
                        `hover:text-primary transition-all duration-200 text-sm xl:text-base font-medium rounded-sm px-4 py-2 block ${
                          isActive
                            ? "border-b-2 border-primary text-primary"
                            : "text-gray-700 hover:text-primary"
                        }`
                      }
                    >
                      {item.name}
                    </NavLink>
                  )}
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
              className="inline-flex items-center justify-center rounded-md text-gray-700 hover:text-primary hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary transition-colors duration-200"
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
              <img src={logo} alt="logo" className="w-24 h-8 object-contain" />
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
