import React, { useState, useEffect } from "react";

import { useTranslation } from "react-i18next";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { HiMenuAlt3, HiX } from "react-icons/hi";

import { GetWebSiteInfo } from "@/api/info";
import { GetContentsByCategoryId } from "@/api/contents";
import { GetPostsByCategoryId } from "@/api/posts";
import { GetVideosByCategoryId } from "@/api/videos";
import { GetEventsByCategoryId } from "@/api/events";
import { setErrorFn } from "@/Utility/Global/setErrorFn";
import defaultLogo from "@/assets/logo.jpg";

import UserIcons from "../UserIcons/UserIcons";

function Usernavbar() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [siteInfo, setSiteInfo] = useState({});
  const [expandedMenus, setExpandedMenus] = useState({});
  const [categoryContents, setCategoryContents] = useState({});
  const [loadingContents, setLoadingContents] = useState({});

  const fetchWebSiteInfo = async () => {
    try {
      const response = await GetWebSiteInfo();
      setSiteInfo(response.data);
    } catch (error) {
      setErrorFn(error, t);
    }
  };
  // Fetch category contents dynamically
  const fetchCategoryContents = async (categoryId, categoryType) => {
    const cacheKey = `${categoryType}-${categoryId}`;

    // If already loaded, don't fetch again
    if (categoryContents[cacheKey]) return;

    // If currently loading, don't fetch again
    if (loadingContents[cacheKey]) return;

    setLoadingContents((prev) => ({ ...prev, [cacheKey]: true }));

    try {
      let response;
      const limit = 8;
      const offset = 0;

      switch (categoryType) {
        case "content":
          response = await GetContentsByCategoryId(categoryId, limit, offset);
          break;
        case "video":
          response = await GetVideosByCategoryId(categoryId, limit, offset);
          break;
        case "post":
          response = await GetPostsByCategoryId(categoryId, limit, offset);
          break;
        case "event":
          response = await GetEventsByCategoryId(categoryId, limit, offset);
          break;
        default:
          return;
      }

      setCategoryContents((prev) => ({
        ...prev,
        [cacheKey]: response?.data?.results || [],
      }));
    } catch (error) {
      console.error(
        `Error fetching ${categoryType} for category ${categoryId}:`,
        error
      );
    } finally {
      setLoadingContents((prev) => ({ ...prev, [cacheKey]: false }));
    }
  };

  // Build content item href based on type
  const getContentHref = (item, categoryType) => {
    switch (categoryType) {
      case "content":
        return `/contents/content/${item.id}`;
      case "video":
        return `/videos/${item.id}`;
      case "post":
        return `/cards-photos/card/${item.id}`;
      case "event":
        // Use external link if available, otherwise use event detail page
        return item.external_link || `/events/${item.id}`;
      default:
        return "#";
    }
  };

  // Check if item should open in new tab (for external links)
  const shouldOpenInNewTab = (item, categoryType) => {
    return categoryType === "event" && item.external_link;
  };

  // Get item size class based on number of items
  const getItemSizeClass = (itemCount) => {
    if (itemCount <= 2) {
      // 1-2 items: larger
      return "w-40 h-48";
    }
    if (itemCount <= 4) {
      // 3-4 items: medium
      return "w-32 h-40";
    }
    if (itemCount <= 6) {
      // 5-6 items: small-medium
      return "w-28 h-32";
    }
    // 7-8 items: normal
    return "w-24 h-28";
  };

  // Get image container class based on item count
  const getImageSizeClass = (itemCount) => {
    if (itemCount <= 2) {
      return "h-32";
    }
    if (itemCount <= 4) {
      return "h-24";
    }
    if (itemCount <= 6) {
      return "h-20";
    }
    return "h-16";
  };

  // Get title text size based on item count
  const getTitleSizeClass = (itemCount) => {
    if (itemCount <= 2) {
      return "text-sm";
    }
    if (itemCount <= 4) {
      return "text-xs";
    }
    return "text-xs";
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
        categoryType: "content",
        subItems: (siteInfo?.content_categories || []).map((category) => ({
          name: category.name,
          href: `/contents/category/${category.id}`,
          categoryId: category.id,
          content_count: category.content_count || 0,
        })),
      },
      {
        name: t("Videos"),
        href: "/videos",
        hasDropdown: true,
        categoryType: "video",
        subItems: (siteInfo?.video_categories || []).map((category) => ({
          name: category.name,
          categoryId: category.id,
          href: `/videos/category/${category.id}`,
          content_count: category.video_count || 0,
        })),
      },
      {
        name: t("Cards & Photos"),
        href: "/cards-photos",
        hasDropdown: true,
        categoryType: "post",
        subItems: (siteInfo?.post_categories || []).map((category) => ({
          name: category.name,
          categoryId: category.id,
          href: `/cards-photos/category/${category.id}`,
          content_count: category.post_count || 0,
        })),
      },
      {
        name: t("Events & Community"),
        href: "/events",
        hasDropdown: true,
        categoryType: "event",
        subItems: (siteInfo?.event_categories || []).map((category) => ({
          name: category.name,
          categoryId: category.id,
          href: `/events/category/${category.id}`,
          content_count: category.event_count || 0,
        })),
      },
      {
        name: t("About Us"),
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
          {
            name: t("Book of Study"),
            href: "/about/books",
            tab: "book_of_study",
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
    setExpandedMenus((prev) => {
      if (prev[menuName]) {
        return {};
      }
      return { [menuName]: true };
    });
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
  // الشعار مع fallback
  console.log(navigationItems);

  const logoSrc = siteInfo?.logo?.logo || defaultLogo;
  return (
    <nav className="relative bg-white shadow-sm" dir={i18n.dir()}>
      <div className="  mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 lg:h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center">
              <img
                src={logoSrc}
                alt="logo"
                className="w-28 h-10 sm:w-36 sm:h-12 object-cover"
                onError={(e) => {
                  if (e.currentTarget.src !== defaultLogo) {
                    e.currentTarget.src = defaultLogo;
                  }
                }}
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
                                onMouseEnter={() => {
                                  if (
                                    subItem.content_count > 0 &&
                                    item.categoryType
                                  ) {
                                    fetchCategoryContents(
                                      subItem.categoryId,
                                      item.categoryType
                                    );
                                  }
                                }}
                              >
                                <Link
                                  to={subItem.href}
                                  onClick={(e) => handleNavClick(e, subItem)}
                                  className="px-4 py-3 text-sm text-gray-700 hover:text-primary hover:bg-gradient-to-r hover:from-blue-50 hover:to-primary/5 rounded-lg transition-all duration-200 group/item relative flex items-center justify-between"
                                >
                                  <span className="flex items-center">
                                    {subItem.name}
                                  </span>
                                  {/* Show arrow if has nested content */}
                                  {subItem.content_count > 0 && (
                                    <svg
                                      className="w-4 h-4 -rotate-90"
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
                                  )}
                                </Link>

                                {/* Nested Dropdown for content items - Horizontal Grid */}
                                {subItem.content_count > 0 &&
                                  item.categoryType && (
                                    <div className="absolute left-full top-0 ml-2 opacity-0 invisible group-hover/submenu:opacity-100 group-hover/submenu:visible transition-all duration-200 z-50">
                                      <div className="bg-white rounded-xl shadow-xl border border-gray-200 p-4">
                                        {loadingContents[
                                          `${item.categoryType}-${subItem.categoryId}`
                                        ] ? (
                                          <div className="px-4 py-8 text-sm text-gray-500 text-center">
                                            {t("Loading...")}
                                          </div>
                                        ) : (
                                          <div
                                            className={`grid ${
                                              subItem?.content_count < 4
                                                ? `grid-cols-${subItem?.content_count}`
                                                : "grid-cols-4"
                                            }  gap-3 w-max max-w-3xl`}
                                          >
                                            {(
                                              categoryContents[
                                                `${item.categoryType}-${subItem.categoryId}`
                                              ] || []
                                            ).map((contentItem, contentIdx) => {
                                              const itemCount =
                                                categoryContents[
                                                  `${item.categoryType}-${subItem.categoryId}`
                                                ]?.length || 0;
                                              const sizeClass =
                                                getItemSizeClass(itemCount);
                                              const imageSizeClass =
                                                getImageSizeClass(itemCount);
                                              const titleSizeClass =
                                                getTitleSizeClass(itemCount);

                                              return (
                                                <div
                                                  key={contentIdx}
                                                  className={`${sizeClass} rounded-lg overflow-hidden hover:shadow-lg transition-all duration-200 flex flex-col bg-gray-50 hover:bg-white border border-gray-100`}
                                                >
                                                  {shouldOpenInNewTab(
                                                    contentItem,
                                                    item.categoryType
                                                  ) ? (
                                                    <a
                                                      href={getContentHref(
                                                        contentItem,
                                                        item.categoryType
                                                      )}
                                                      target="_blank"
                                                      rel="noopener noreferrer"
                                                      className="flex flex-col h-full hover:no-underline"
                                                    >
                                                      {/* Start Image Container */}
                                                      <div
                                                        className={`${imageSizeClass} bg-gray-200 overflow-hidden flex-shrink-0 relative group`}
                                                      >
                                                        {contentItem?.image ||
                                                        contentItem?.thumbnail ||
                                                        contentItem?.image_url ? (
                                                          <img
                                                            src={
                                                              contentItem?.image ||
                                                              contentItem?.thumbnail ||
                                                              contentItem?.image_url
                                                            }
                                                            alt={
                                                              contentItem?.title ||
                                                              contentItem?.name
                                                            }
                                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                                          />
                                                        ) : (
                                                          <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                                                            <svg
                                                              className="w-8 h-8 text-gray-400"
                                                              fill="none"
                                                              stroke="currentColor"
                                                              viewBox="0 0 24 24"
                                                            >
                                                              <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth={2}
                                                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                                              />
                                                            </svg>
                                                          </div>
                                                        )}
                                                        {/* External link icon */}
                                                        <div className="absolute top-1 right-1 bg-white/80 rounded-full p-1">
                                                          <svg
                                                            className="w-3 h-3 text-primary"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            viewBox="0 0 24 24"
                                                          >
                                                            <path
                                                              strokeLinecap="round"
                                                              strokeLinejoin="round"
                                                              strokeWidth={2}
                                                              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                                            />
                                                          </svg>
                                                        </div>
                                                      </div>
                                                      {/* End  Image Container */}

                                                      {/* Start Title Container */}
                                                      <div className="flex-1 p-2 flex flex-col justify-center">
                                                        <p
                                                          className={`${titleSizeClass} text-gray-700 font-medium line-clamp-2`}
                                                        >
                                                          {contentItem?.title ||
                                                            contentItem?.name}
                                                        </p>
                                                      </div>
                                                      {/* End Title Container */}
                                                    </a>
                                                  ) : (
                                                    <Link
                                                      to={getContentHref(
                                                        contentItem,
                                                        item.categoryType
                                                      )}
                                                      className="flex flex-col h-full hover:no-underline"
                                                    >
                                                      {/* Start Image Container */}
                                                      <div
                                                        className={`${imageSizeClass} bg-gray-200 overflow-hidden flex-shrink-0 relative group`}
                                                      >
                                                        <img
                                                          src={
                                                            contentItem?.images
                                                              ?.length > 0
                                                              ? contentItem
                                                                  ?.images[0]
                                                                  ?.image
                                                              : contentItem?.image ||
                                                                contentItem?.thumbnail ||
                                                                contentItem?.image_url
                                                          }
                                                          alt={
                                                            contentItem?.title ||
                                                            contentItem?.name
                                                          }
                                                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                                        />
                                                      </div>
                                                      {/* End Image Container */}

                                                      {/* Start Title Container */}
                                                      <div className="flex-1 p-2 flex flex-col justify-center">
                                                        <p
                                                          className={`${titleSizeClass} text-gray-700 font-medium line-clamp-2`}
                                                        >
                                                          {contentItem?.title ||
                                                            contentItem?.name}
                                                        </p>
                                                      </div>
                                                      {/* End Title Container */}
                                                    </Link>
                                                  )}
                                                </div>
                                              );
                                            })}
                                          </div>
                                        )}
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
              <img
                src={logoSrc}
                alt="logo"
                className="w-24 h-8 object-contain"
                onError={(e) => {
                  if (e.currentTarget.src !== defaultLogo) {
                    e.currentTarget.src = defaultLogo;
                  }
                }}
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
                        <div className="mt-2 ml-4 bg-gray-50 rounded-lg p-3">
                          {/* Category Navigation Links */}
                          <div className="space-y-2 mb-3">
                            {item.subItems.map((subItem, subIdx) => (
                              <div key={subIdx}>
                                <NavLink
                                  to={subItem.href}
                                  onClick={(e) => {
                                    // Load contents if has content_count > 0 and not already loaded
                                    if (
                                      subItem.content_count > 0 &&
                                      item.categoryType
                                    ) {
                                      fetchCategoryContents(
                                        subItem.categoryId,
                                        item.categoryType
                                      );
                                    }
                                    // Only navigate and close if clicking the main link
                                    if (!subItem.content_count) {
                                      handleNavClick(e, subItem);
                                      closeMenu();
                                    } else {
                                      e.preventDefault();
                                      handleNavClick(e, subItem);
                                    }
                                  }}
                                >
                                  {({ isActive }) => (
                                    <div
                                      className={`px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-between ${
                                        isActive
                                          ? "bg-primary/10 text-primary"
                                          : "text-gray-700"
                                      }`}
                                    >
                                      <span>{subItem.name}</span>
                                      {subItem.content_count > 0 && (
                                        <span className="text-xs text-gray-500 ml-2">
                                          ({subItem.content_count})
                                        </span>
                                      )}
                                    </div>
                                  )}
                                </NavLink>

                                {/* Nested content items for mobile - Horizontal Grid */}
                                {subItem.content_count > 0 &&
                                  item.categoryType &&
                                  categoryContents[
                                    `${item.categoryType}-${subItem.categoryId}`
                                  ] && (
                                    <div className="mt-2 ml-4 px-3 py-2 bg-white rounded-lg ">
                                      <div className="grid grid-cols-4 gap-2">
                                        {(
                                          categoryContents[
                                            `${item.categoryType}-${subItem.categoryId}`
                                          ] || []
                                        ).map((contentItem, contentIdx) => {
                                          const itemCount =
                                            categoryContents[
                                              `${item.categoryType}-${subItem.categoryId}`
                                            ]?.length || 0;
                                          const sizeClass =
                                            getItemSizeClass(itemCount);
                                          const imageSizeClass =
                                            getImageSizeClass(itemCount);
                                          const titleSizeClass =
                                            getTitleSizeClass(itemCount);

                                          return (
                                            <div
                                              key={contentIdx}
                                              className={`${sizeClass} rounded-lg overflow-hidden hover:shadow-lg transition-all duration-200 flex flex-col bg-gray-50 hover:bg-white border border-gray-100`}
                                            >
                                              {shouldOpenInNewTab(
                                                contentItem,
                                                item.categoryType
                                              ) ? (
                                                <a
                                                  href={getContentHref(
                                                    contentItem,
                                                    item.categoryType
                                                  )}
                                                  target="_blank"
                                                  rel="noopener noreferrer"
                                                  onClick={closeMenu}
                                                  className="flex flex-col h-full hover:no-underline"
                                                >
                                                  {/* Image Container */}
                                                  <div
                                                    className={`${imageSizeClass} bg-gray-200 overflow-hidden flex-shrink-0 relative group`}
                                                  >
                                                    {contentItem?.image ||
                                                    contentItem?.thumbnail ||
                                                    contentItem?.image_url ? (
                                                      <img
                                                        src={
                                                          contentItem?.image ||
                                                          contentItem?.thumbnail ||
                                                          contentItem?.image_url
                                                        }
                                                        alt={
                                                          contentItem?.title ||
                                                          contentItem?.name
                                                        }
                                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                                      />
                                                    ) : (
                                                      <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                                                        <svg
                                                          className="w-6 h-6 text-gray-400"
                                                          fill="none"
                                                          stroke="currentColor"
                                                          viewBox="0 0 24 24"
                                                        >
                                                          <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                                          />
                                                        </svg>
                                                      </div>
                                                    )}
                                                  </div>

                                                  {/* Title Container */}
                                                  <div className="flex-1 p-1.5 flex flex-col justify-center">
                                                    <p
                                                      className={`${titleSizeClass} text-gray-700 font-medium line-clamp-2`}
                                                    >
                                                      {contentItem?.title ||
                                                        contentItem?.name}
                                                    </p>
                                                  </div>
                                                </a>
                                              ) : (
                                                <Link
                                                  to={getContentHref(
                                                    contentItem,
                                                    item.categoryType
                                                  )}
                                                  onClick={closeMenu}
                                                  className="flex flex-col h-full hover:no-underline"
                                                >
                                                  {/* Image Container */}
                                                  <div
                                                    className={`${imageSizeClass} bg-gray-200 overflow-hidden flex-shrink-0 relative group`}
                                                  >
                                                    {contentItem?.image ||
                                                    contentItem?.thumbnail ||
                                                    contentItem?.image_url ? (
                                                      <img
                                                        src={
                                                          contentItem?.image ||
                                                          contentItem?.thumbnail ||
                                                          contentItem?.image_url
                                                        }
                                                        alt={
                                                          contentItem?.title ||
                                                          contentItem?.name
                                                        }
                                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                                      />
                                                    ) : (
                                                      <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                                                        <svg
                                                          className="w-6 h-6 text-gray-400"
                                                          fill="none"
                                                          stroke="currentColor"
                                                          viewBox="0 0 24 24"
                                                        >
                                                          <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                                          />
                                                        </svg>
                                                      </div>
                                                    )}
                                                  </div>

                                                  {/* Title Container */}
                                                  <div className="flex-1 p-1.5 flex flex-col justify-center">
                                                    <p
                                                      className={`${titleSizeClass} text-gray-700 font-medium line-clamp-2`}
                                                    >
                                                      {contentItem?.title ||
                                                        contentItem?.name}
                                                    </p>
                                                  </div>
                                                </Link>
                                              )}
                                            </div>
                                          );
                                        })}
                                      </div>
                                    </div>
                                  )}
                              </div>
                            ))}
                          </div>
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
