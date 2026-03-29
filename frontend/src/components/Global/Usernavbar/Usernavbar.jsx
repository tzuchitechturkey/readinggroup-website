import React, { useState, useEffect, useMemo } from "react";

import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { HiMenuAlt3, HiX } from "react-icons/hi";
import { UserIcon } from "lucide-react";

import { GetWebSiteInfo } from "@/api/info";
import { setErrorFn } from "@/Utility/Global/setErrorFn";
import defaultLogo from "@/assets/icons/newlogo.png";
import buildNavigationItems from "@/Utility/Navbar/buildNavigationItems";

import LanguageDropdown from "../LanguageDropdown/LanguageDropdown";
import DesktopNavigation from "../DesktopNavigation/DesktopNavigation";
import MobileSidebar from "../MobileSidebar/MobileSidebar";
import UserIcons from "../UserIcons/UserIcons";

function Usernavbar({ isHome = false }) {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [siteInfo, setSiteInfo] = useState({});
  const [expandedMenus, setExpandedMenus] = useState({});
  const [categoryContents, setCategoryContents] = useState({});
  const [loadingContents, setLoadingContents] = useState({});

  // Check if item should open in new tab (for external links)
  const shouldOpenInNewTab = (item, categoryType) => {
    return categoryType === "event" && item.external_link;
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
    // fetchWebSiteInfo();
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

  const navigationItems = useMemo(
    () => buildNavigationItems(t, siteInfo),
    [t, siteInfo],
  );

  return (
    <nav
      className="w-full relative shadow-[0px_5px_8.9px_0px_rgba(0,0,0,0.25)] h-[62px] flex items-center justify-center z-50 bg-[#5e82ab]"
      dir={i18n.dir()}
    >
      {/* Desktop Navbar */}
      <div className="hidden lg:flex w-[1440px] px-[120px] h-full items-center bg-[#5e82ab]">
        {/* Logo */}
        <div className="flex-shrink-0 h-full flex items-center mr-[31px]">
          <Link to="/" className="flex items-center h-full">
            <img
              // src={siteInfo?.logo?.logo || defaultLogo}
              src={defaultLogo}
              alt="logo"
              className="h-[40px] w-auto object-contain"
              onError={(e) => {
                if (e.currentTarget.src !== defaultLogo) {
                  e.currentTarget.src = defaultLogo;
                }
              }}
            />
          </Link>
        </div>
        {/* Desktop Navigation */}
        <div className="flex-1 flex justify-center h-full">
          <DesktopNavigation
            navigationItems={navigationItems}
            handleNavClick={handleNavClick}
            categoryContents={categoryContents}
            loadingContents={loadingContents}
            setLoadingContents={setLoadingContents}
            setCategoryContents={setCategoryContents}
            t={t}
            shouldOpenInNewTab={shouldOpenInNewTab}
            isHome={isHome}
          />
        </div>
        {/* Desktop User Icons & Lang */}
        <div className="flex items-center justify-end h-full ml-[31px]">
          {/* <LanguageDropdown /> */}
          <UserIcons />
        </div>
      </div>

      {/* Mobile Navbar */}
      <div className="lg:hidden flex w-full h-full items-center justify-between px-4 bg-[#5e82ab]">
        {/* Logo (left for LTR, right for RTL) */}
        {i18n.dir() === "rtl" ? (
          <div className="flex-1 flex items-center justify-end">
            <Link to="/" className="flex items-center h-full">
              <img
                src={siteInfo?.logo?.logo || defaultLogo}
                alt="logo"
                className="h-[32px] w-auto object-contain"
                onError={(e) => {
                  if (e.currentTarget.src !== defaultLogo) {
                    e.currentTarget.src = defaultLogo;
                  }
                }}
              />
            </Link>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-start">
            <Link to="/" className="flex items-center h-full">
              <img
                src={siteInfo?.logo?.logo || defaultLogo}
                alt="logo"
                className="h-[32px] w-auto object-contain"
                onError={(e) => {
                  if (e.currentTarget.src !== defaultLogo) {
                    e.currentTarget.src = defaultLogo;
                  }
                }}
              />
            </Link>
          </div>
        )}
        {/* Hamburger (left for RTL, right for LTR) */}
        {i18n.dir() === "rtl" ? (
          <div className="flex items-center justify-start">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center rounded-md text-white hover:text-white/80 focus:outline-none transition-colors duration-200 ml-2"
              aria-expanded="false"
            >
              <span className="sr-only">{t("Open main menu")}</span>
              {isMenuOpen ? (
                <HiX className="block h-8 w-8" aria-hidden="true" />
              ) : (
                <HiMenuAlt3 className="block h-8 w-8" aria-hidden="true" />
              )}
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-end">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center rounded-md text-white hover:text-white/80 focus:outline-none transition-colors duration-200 ml-2"
              aria-expanded="false"
            >
              <span className="sr-only">{t("Open main menu")}</span>
              {isMenuOpen ? (
                <HiX className="block h-8 w-8" aria-hidden="true" />
              ) : (
                <HiMenuAlt3 className="block h-8 w-8" aria-hidden="true" />
              )}
            </button>
          </div>
        )}
      </div>
      {/* Mobile Sidebar Menu */}
      <MobileSidebar
        siteInfo={siteInfo}
        isMenuOpen={isMenuOpen}
        closeMenu={closeMenu}
        navigationItems={navigationItems}
        t={t}
        expandedMenus={expandedMenus}
        toggleMobileSubmenu={toggleMobileSubmenu}
        categoryContents={categoryContents}
        handleNavClick={handleNavClick}
        shouldOpenInNewTab={shouldOpenInNewTab}
        loadingContents={loadingContents}
        setLoadingContents={setLoadingContents}
        setCategoryContents={setCategoryContents}
        isHome={isHome}
      />
    </nav>
  );
}

export default Usernavbar;
