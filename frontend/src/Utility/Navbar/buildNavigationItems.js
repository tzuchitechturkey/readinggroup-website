// Navigation items with dropdowns - built dynamically from siteInfo
const buildNavigationItems = (t, siteInfo) => {
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

export default buildNavigationItems;
