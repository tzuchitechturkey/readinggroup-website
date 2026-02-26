import React from "react";
import { Link, NavLink } from "react-router-dom";
import { HiX } from "react-icons/hi";
import { useTranslation } from "react-i18next";
import getContentHref from "@/Utility/Navbar/getContentHref";
import fetchCategoryContents from "@/Utility/Navbar/fetchCategoryContents";
import defaultLogo from "@/assets/logo.jpg";
import UserIcons from "../UserIcons/UserIcons";
import LanguageDropdown from "../LanguageDropdown/LanguageDropdown";

function MobileSidebar({
  siteInfo,
  isMenuOpen,
  closeMenu,
  navigationItems,
  t,
  expandedMenus,
  toggleMobileSubmenu,
  categoryContents,
  handleNavClick,
  shouldOpenInNewTab,
  loadingContents,
  setLoadingContents,
  setCategoryContents,
  isHome = false,
}) {
  const { i18n } = useTranslation();
  const isRTL = i18n.dir() === "rtl";
  const [expandedSubItems, setExpandedSubItems] = React.useState({});

  const toggleSubItemExpand = (subItemKey) => {
    setExpandedSubItems((prev) => ({
      ...prev,
      [subItemKey]: !prev[subItemKey],
    }));
  };

  return (
    <div
      className={`lg:hidden  fixed inset-0 z-50 pointer-events-none  border ${
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
        className={`fixed top-0 ${isRTL ? "right-0 border-l" : "left-0 border-r"} h-full flex flex-col bg-[var(--color-primary)] w-80 max-w-[85vw] shadow-2xl border-white/10 transform transition-all duration-300 ease-in-out ${
          isMenuOpen
            ? "translate-x-0 opacity-100"
            : isRTL
              ? "translate-x-full opacity-0"
              : "-translate-x-full opacity-0"
        }`}
        dir={isRTL ? "rtl" : "ltr"}
      >
        {/* Sidebar Header */}
        <div className="flex-shrink-0 flex items-center justify-between p-4 border-b border-white/20">
          <Link to="/" onClick={closeMenu} className="flex items-center">
            <img
              src={siteInfo?.logo?.logo || defaultLogo}
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
            className="p-2 rounded-md transition-colors duration-200 text-white/70 hover:text-white hover:bg-white/10"
          >
            <HiX className="h-6 w-6" />
          </button>
        </div>

        {/* Sidebar Content */}
        <div className="flex-1 flex flex-col min-h-0">
          {/* Navigation Links */}
          <nav className="flex-1 px-6 py-4 space-y-1 overflow-y-auto scrollbar-hide">
            <div className="mb-2">
              <h3 className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">
                {t("Navigation")}
              </h3>
            </div>
            {navigationItems.map((item, idx) => (
              <div key={idx}>
                {item.hasDropdown ? (
                  <>
                    <div className="flex items-center justify-between px-4 py-4 rounded-xl text-base font-medium transition-all duration-200 relative overflow-hidden group">
                      <NavLink
                        to={item.href}
                        onClick={closeMenu}
                        className="flex-1"
                      >
                        {({ isActive }) => (
                          <span
                            className={`block transition-all duration-200 uppercase font-['Noto_Sans'] ${
                              isActive
                                ? "text-white font-semibold"
                                : "text-white/70 group-hover:text-white"
                            }`}
                          >
                            {item.name}
                          </span>
                        )}
                      </NavLink>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleMobileSubmenu(item.name);
                        }}
                        className={`p-2 rounded-lg transition-all duration-200 flex-shrink-0 ${isRTL ? "ml-2" : "ml-2"} ${
                          expandedMenus[item.name]
                            ? "bg-white/20 text-white"
                            : "text-white/70 hover:text-white hover:bg-white/10"
                        }`}
                      >
                        <svg
                          className={`w-5 h-5 transition-transform duration-200 ${
                            expandedMenus[item.name]
                              ? isRTL
                                ? "-rotate-90"
                                : "rotate-90"
                              : isRTL
                                ? "rotate-180"
                                : ""
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d={isRTL ? "M15 19l-7-7 7-7" : "M9 5l7 7-7 7"}
                          />
                        </svg>
                      </button>
                    </div>

                    {/* Mobile Submenu */}
                    {expandedMenus[item.name] && (
                      <div className="mt-2 ml-4 bg-white/5 rounded-lg p-3">
                        {/* Category Navigation Links */}
                        <div className="space-y-2 mb-3">
                          {item.subItems.map((subItem, subIdx) => (
                            <div key={subIdx}>
                              <div className="flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 group">
                                <NavLink
                                  to={subItem.href}
                                  onClick={() => {
                                    handleNavClick(null, subItem);
                                    closeMenu();
                                  }}
                                  className="flex-1"
                                >
                                  {({ isActive }) => (
                                    <span
                                      className={`block transition-all duration-200 uppercase font-['Noto_Sans'] ${
                                        isActive
                                          ? "text-white font-semibold"
                                          : "text-white/70 group-hover:text-white"
                                      }`}
                                    >
                                      {subItem.name}
                                    </span>
                                  )}
                                </NavLink>
                              </div>
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
                            ? "bg-white/10 text-white"
                            : "text-white/70 hover:bg-white/5 hover:text-white"
                        }`}
                      >
                        <span className="relative z-10 uppercase font-['Noto_Sans']">
                          {item.name}
                        </span>
                      </div>
                    )}
                  </NavLink>
                )}
              </div>
            ))}
          </nav>

          {/* Sidebar Footer with Language Dropdown */}
          <div className="border-t border-white/10 bg-white/5 p-6">
            <div className="flex items-center justify-center space-x-4">
              <LanguageDropdown />
            </div>

            <div className="mt-4 flex items-center justify-center space-x-4">
              {/* Currently hidden desktop icons if you want to repurpose user icons or just hide them */}
              {/* <UserIcons /> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MobileSidebar;
