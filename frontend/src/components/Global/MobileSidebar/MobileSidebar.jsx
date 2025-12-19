import React from "react";

import { Link, NavLink } from "react-router-dom";
import { HiX } from "react-icons/hi";

import getContentHref from "@/Utility/Navbar/getContentHref";
import fetchCategoryContents from "@/Utility/Navbar/fetchCategoryContents";
import defaultLogo from "@/assets/logo.jpg";

import UserIcons from "../UserIcons/UserIcons";

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
}) {
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
        className={`fixed top-0 right-0 h-full overflow-y-scroll bg-white w-80 max-w-[85vw] shadow-2xl border-l border-gray-100 transform transition-all duration-300 ease-in-out ${
          isMenuOpen
            ? "translate-x-0 opacity-100"
            : "translate-x-full opacity-0"
        }`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
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
                    <div className="flex items-center justify-between px-4 py-4 rounded-xl text-base font-medium transition-all duration-200 relative overflow-hidden group">
                      <NavLink
                        to={item.href}
                        onClick={closeMenu}
                        className="flex-1"
                      >
                        {({ isActive }) => (
                          <span
                            className={`block transition-all duration-200 ${
                              isActive
                                ? "text-primary font-semibold"
                                : "text-gray-700 group-hover:text-primary"
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
                        className={`p-2 rounded-lg transition-all duration-200 flex-shrink-0 ml-2 ${
                          expandedMenus[item.name]
                            ? "bg-gradient-to-r from-primary to-blue-600 text-white shadow-lg shadow-primary/25"
                            : "text-gray-700 hover:bg-gray-100 group-hover:text-primary"
                        }`}
                      >
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
                    </div>

                    {/* Mobile Submenu */}
                    {expandedMenus[item.name] && (
                      <div className="mt-2 ml-4 bg-gray-50 rounded-lg p-3">
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
                                      className={`block transition-all duration-200 ${
                                        isActive
                                          ? "text-primary font-semibold"
                                          : "text-gray-700 group-hover:text-primary"
                                      }`}
                                    >
                                      {subItem.name}
                                    </span>
                                  )}
                                </NavLink>
                                {subItem.content_count > 0 && (
                                  <>
                                    {/* <span className="text-xs text-gray-500 mx-2">
                                      ({subItem.content_count})
                                    </span> */}
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        const subItemKey = `${item.categoryType}-${subItem.categoryId}`;
                                        if (
                                          expandedSubItems[subItemKey] ===
                                          undefined
                                        ) {
                                          fetchCategoryContents(
                                            categoryContents,
                                            loadingContents,
                                            setLoadingContents,
                                            setCategoryContents,
                                            subItem.categoryId,
                                            item.categoryType
                                          );
                                        }
                                        toggleSubItemExpand(subItemKey);
                                      }}
                                      className={`p-1 rounded-lg transition-all duration-200 flex-shrink-0 ${
                                        expandedSubItems[
                                          `${item.categoryType}-${subItem.categoryId}`
                                        ]
                                          ? "bg-primary/20 text-primary"
                                          : "text-gray-500 hover:bg-gray-100"
                                      }`}
                                    >
                                      <svg
                                        className={`w-4 h-4 transition-transform duration-200 ${
                                          expandedSubItems[
                                            `${item.categoryType}-${subItem.categoryId}`
                                          ]
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
                                          d="M19 9l-7 7-7-7"
                                        />
                                      </svg>
                                    </button>
                                  </>
                                )}
                              </div>

                              {/* Nested content items for mobile - Vertical List */}
                              {expandedSubItems[
                                `${item.categoryType}-${subItem.categoryId}`
                              ] &&
                                subItem.content_count > 0 &&
                                item.categoryType &&
                                categoryContents[
                                  `${item.categoryType}-${subItem.categoryId}`
                                ] && (
                                  <div className="mt-2 ml-4 px-3 py-2 bg-white rounded-lg ">
                                    <div className="flex flex-col gap-2">
                                      {(
                                        categoryContents[
                                          `${item.categoryType}-${subItem.categoryId}`
                                        ] || []
                                      ).map((contentItem, contentIdx) => {
                                        return (
                                          <div
                                            key={contentIdx}
                                            className="w-full rounded-lg overflow-hidden hover:shadow-lg transition-all duration-200 flex flex-row bg-gray-50 hover:bg-white border border-gray-100"
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
                                                className="flex flex-row h-full hover:no-underline w-full"
                                              >
                                                {/* Image Container */}
                                                <div className="w-20 h-20 bg-gray-200 overflow-hidden flex-shrink-0 relative group">
                                                  {contentItem?.image ||
                                                  contentItem?.thumbnail ||
                                                  contentItem?.image_url ? (
                                                    <img
                                                      src={
                                                        contentItem?.images
                                                          ?.length > 0
                                                          ? contentItem
                                                              ?.images[0]?.image
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
                                                <div className="flex-1 p-2 flex flex-col justify-center">
                                                  <p className="text-sm text-gray-700 font-medium line-clamp-2">
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
                                                className="flex flex-row h-full hover:no-underline w-full"
                                              >
                                                {/* Image Container */}
                                                <div className="w-20 h-20 bg-gray-200 overflow-hidden flex-shrink-0 relative group">
                                                  <img
                                                    src={
                                                      contentItem?.images
                                                        ?.length > 0
                                                        ? contentItem?.images[0]
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

                                                {/* Title Container */}
                                                <div className="flex-1 p-2 flex flex-col justify-center">
                                                  <p className="text-sm text-gray-700 font-medium line-clamp-2">
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
  );
}

export default MobileSidebar;
