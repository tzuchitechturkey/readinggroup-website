const buildNavigationItems = (t, siteInfo) => {
  const items = [
    {
      name: t("HOME"),
      href: "/",
      hasDropdown: false,
    },
    {
      name: t("WATCH"),
      href: "/videos",
      hasDropdown: false,
      categoryType: "video",
    },
    {
      name: t("LEARN"),
      href: "/learn",
      hasDropdown: false,
      categoryType: "learn",
    },
    {
      name: t("COMMUNITY & EVENTS"),
      // href: "/events",
      hasDropdown: true,
      categoryType: "event",
      subItems: [
        {
          name: t("LIVESTREAM SCHEDULE"),
          href: "/livestream-schedule",
        },
        {
          name: t("Photo Collections"),
          href: "/photo-collections",
        },
        {
          name: t("Latest News"),
          href: "/latest-news",
        },
        {
          name: t("Realted Reports"),
          href: "/related-reports",
        },
      ],
    },
    {
      name: t("ABOUT US"),
      href: "/about",
      hasDropdown: true,
      subItems: [
        {
          name: t("OUR HISTORY"),
          href: "/about",
          tab: "history",
        },
        {
          name: t("TEAM FUNCTIONS"),
          href: "/about",
          tab: "our_team",
        },
        {
          name: t("SPECIAL BOOK OF 10 YEARS"),
          href: "/about/books",
          tab: "book_of_study",
        },
      ],
    },
  ];

  return items;
};

export default buildNavigationItems;
