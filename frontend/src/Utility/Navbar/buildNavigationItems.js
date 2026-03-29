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
    {
      name: t("About Us"),
      hasDropdown: true,
      subItems: [
        {
          name: t("Our History"),
          href: "/about/history",
          tab: "history",
        },
        {
          name: t("Team Functions"),
          href: "/about/team",
          tab: "our_team",
        },
        {
          name: t("Book"),
          href: "/about/book",
          tab: "book",
        },
      ],
    },
  ];

  return items;
};

export default buildNavigationItems;
