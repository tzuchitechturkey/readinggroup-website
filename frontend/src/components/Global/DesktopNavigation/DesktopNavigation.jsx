import React from "react";

import { Link, NavLink } from "react-router-dom";

import getContentHref from "@/Utility/Navbar/getContentHref";
import {
  getImageSizeClass,
  getItemSizeClass,
  getTitleSizeClass,
} from "@/Utility/Navbar/getTitleSizeClass";
import fetchCategoryContents from "@/Utility/Navbar/fetchCategoryContents";

function DesktopNavigation({
  navigationItems,
  handleNavClick,
  categoryContents,
  loadingContents,
  setLoadingContents,
  setCategoryContents,
  t,
  shouldOpenInNewTab,
}) {
  return (
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
                                categoryContents,
                                loadingContents,
                                setLoadingContents,
                                setCategoryContents,
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
                          {subItem.content_count > 0 && item.categoryType && (
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
  );
}

export default DesktopNavigation;
