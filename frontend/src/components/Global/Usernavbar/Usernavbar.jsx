import React, { useState, useEffect, useMemo } from "react";

import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { HiMenuAlt3, HiX } from "react-icons/hi";

import { GetWebSiteInfo } from "@/api/info";
import { setErrorFn } from "@/Utility/Global/setErrorFn";
import defaultLogo from "@/assets/logo.jpg";
import buildNavigationItems from "@/Utility/Navbar/buildNavigationItems";

import UserIcons from "../UserIcons/UserIcons";
import DesktopNavigation from "../DesktopNavigation/DesktopNavigation";
import MobileSidebar from "../MobileSidebar/MobileSidebar";

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
    fetchWebSiteInfo();
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
    [t, siteInfo]
  );

  return (
    <nav className="relative  shadow-sm" dir={i18n.dir()}>
      <div className="  mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 lg:h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center">
              <img
                src={siteInfo?.logo?.logo || defaultLogo}
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
          <DesktopNavigation
            navigationItems={navigationItems}
            handleNavClick={handleNavClick}
            categoryContents={categoryContents}
            loadingContents={loadingContents}
            setLoadingContents={setLoadingContents}
            setCategoryContents={setCategoryContents}
            t={t}
            shouldOpenInNewTab={shouldOpenInNewTab}
          />
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
      />
    </nav>
  );
}

export default Usernavbar;
