const buildNavigationItems = (t, siteInfo) => {
  const items = [
    {
      name: t("Home"),
      href: "/",
      hasDropdown: false,
    },
    {
      name: t("Watch"),
      href: "/videos",
      hasDropdown: false,
      categoryType: "video",
    },
    {
      name: t("Learn"),
      href: "/learn",
      hasDropdown: false,
      categoryType: "learn",
    },
    {
      name: t("Community & Events"),
      // href: "/events",
      hasDropdown: true,
      categoryType: "event",
      subItems: [
        {
          name: t("Livestream Schedule"),
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
          name: t("Related Reports"),
          href: "/related-reports",
        },
      ],
    },
    // {
    //   name: t("ABOUT US"),
    //   href: "/about",
    //   hasDropdown: true,
    //   subItems: [
    //     {
    //       name: t("OUR HISTORY"),
    //       href: "/about",
    //       tab: "history",
    //     },
    //     {
    //       name: t("TEAM FUNCTIONS"),
    //       href: "/about",
    //       tab: "our_team",
    //     },
    //     {
    //       name: t("SPECIAL BOOK OF 10 YEARS"),
    //       href: "/about/books",
    //       tab: "book_of_study",
    //     },
    //   ],
    // },
  ];

  return items;
};

export default buildNavigationItems;
