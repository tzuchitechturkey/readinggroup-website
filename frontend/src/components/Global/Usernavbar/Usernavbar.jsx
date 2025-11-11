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
  const [siteInfo, setSiteInfo] = useState({});
  const [expandedMenus, setExpandedMenus] = useState({});

  const fetchWebSiteInfo = async () => {
    try {
      const response = await GetWebSiteInfo();
      setSiteInfo(response.data);
    } catch (error) {
      setErrorFn(error, t);
    }
  };

  // Navigation items with dropdowns - built dynamically from siteInfo
  const buildNavigationItems = () => {
    const items = [
      {
        name: t("Home"),
        href: "/",
        hasDropdown: false,
      },
      {
        name: t("Contents"),
        href: "/contents",
        hasDropdown: true,
        subItems: (siteInfo?.content_categories || []).map((category) => ({
          name: category.name,
          href: "/contents",
          categoryId: category.id,
          scrollToId: `category-${category.id}`,
        })),
      },
      {
        name: t("Videos"),
        scrollToId: "",
        href: "/videos",
        hasDropdown: true,
        subItems: (siteInfo?.video_categories || []).map((category) => ({
          name: category.name,
          categoryId: category.id,
          scrollToId: `category-${category.id}`,
          href: "/videos",
        })),
      },
      {
        name: t("Cards & Photos"),
        scrollToId: "",
        href: "/cards-photos",
        hasDropdown: true,
        subItems: (siteInfo?.post_categories || []).map((category) => ({
          name: category.name,
          categoryId: category.id,
          scrollToId: `category-${category.id}`,
          href: "/cards-photos",
        })),
      },
      {
        name: t("Events & Community"),
        scrollToId: "",
        href: "/events",
        hasDropdown: true,
        subItems: (siteInfo?.event_categories || []).map((category) => ({
          name: category.name,
          categoryId: category.id,
          scrollToId: `category-${category.id}`,
          href: "/events",
        })),
      },
      {
        name: t("About Us"),
        scrollToId: "",
        href: "/about",
        hasDropdown: true,
        subItems: [
          {
            name: t("History"),
            href: "/about",
            tab: "history",
          },
          {
            name: t("Our Team"),
            href: "/about",
            tab: "our_team",
          },
        ],
      },
    ];

    return items;
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  // Toggle submenu expansion for mobile
  const toggleMobileSubmenu = (menuName) => {
    setExpandedMenus((prev) => ({
      ...prev,
      [menuName]: !prev[menuName],
    }));
  };

  const handleNavClick = (e, item) => {
    e.preventDefault();

    // Prepare state for navigation
    const state = {};
    if (item.categoryId) {
      state.targetCategoryId = item.categoryId;
      state.scrollToId = item.scrollToId;
    }
    if (item.tab) {
      state.activeTab = item.tab;
    }

    // Navigate with state if we have one
    if (Object.keys(state).length > 0) {
      navigate(item.href, { state });
    } else {
      navigate(item.href);
    }

    // Scroll to element after navigation (if on same page)
    if (item.scrollToId && window.location.pathname === item.href) {
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

  // Get navigation items dynamically
  const navigationItems = buildNavigationItems();
  return (
    <nav className="relative bg-white shadow-sm" dir={i18n.dir()}>
      <div className="  mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 lg:h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center">
              <img
                src={siteInfo?.logo?.logo}
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
                          `hover:text-primary transition-all duration-200 text-sm xl:text-base font-medium px-4 py-2 rounded-sm flex gap-[2px] items-center ${
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
                                className="relative group/submenu"
                              >
                                <Link
                                  to={subItem.href}
                                  onClick={(e) => handleNavClick(e, subItem)}
                                  className="px-4 py-3 text-sm text-gray-700 hover:text-primary hover:bg-gradient-to-r hover:from-blue-50 hover:to-primary/5 rounded-lg transition-all duration-200 group/item relative flex items-center justify-between"
                                >
                                  <span className="flex items-center">
                                    {subItem.name}
                                  </span>
                                </Link>
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
              <img
                src={siteInfo?.logo?.logo}
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
              {navigationItems.map((item, idx) => (
                <div key={idx}>
                  {item.hasDropdown ? (
                    <>
                      <button
                        onClick={() => toggleMobileSubmenu(item.name)}
                        className={`w-full flex items-center justify-between px-4 py-4 rounded-xl text-base font-medium transition-all duration-200 relative overflow-hidden ${
                          expandedMenus[item.name]
                            ? "bg-gradient-to-r from-primary to-blue-600 text-white shadow-lg shadow-primary/25"
                            : "text-gray-700 hover:bg-gradient-to-r hover:from-gray-50 hover:to-blue-50 hover:text-primary"
                        }`}
                      >
                        <span>{item.name}</span>
                        <svg
                          className={`w-5 h-5 transition-transform duration-200 ${
                            expandedMenus[item.name] ? "rotate-180" : ""
                          }`}
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
                      </button>

                      {/* Mobile Submenu */}
                      {expandedMenus[item.name] && (
                        <div className="mt-2 ml-4 space-y-2 bg-gray-50 rounded-lg p-3">
                          {item.subItems.map((subItem, subIdx) => (
                            <NavLink
                              key={subIdx}
                              to={subItem.href}
                              onClick={(e) => {
                                handleNavClick(e, subItem);
                                closeMenu();
                              }}
                            >
                              {({ isActive }) => (
                                <div
                                  className={`px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                                    isActive
                                      ? "bg-primary text-white"
                                      : "text-gray-700 hover:bg-white hover:text-primary"
                                  }`}
                                >
                                  {subItem.name}
                                </div>
                              )}
                            </NavLink>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <NavLink to={item.href} onClick={closeMenu}>
                      {({ isActive }) => (
                        <div
                          className={`group flex items-center px-4 py-4 rounded-xl text-base font-medium transition-all duration-200 relative overflow-hidden ${
                            isActive
                              ? "bg-gradient-to-r from-primary to-blue-600 text-white shadow-lg shadow-primary/25"
                              : "text-gray-700 hover:bg-gradient-to-r hover:from-gray-50 hover:to-blue-50 hover:text-primary"
                          }`}
                        >
                          <span className="relative z-10">{item.name}</span>
                          {isActive && (
                            <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-white/30 rounded-l-full" />
                          )}
                        </div>
                      )}
                    </NavLink>
                  )}
                </div>
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
