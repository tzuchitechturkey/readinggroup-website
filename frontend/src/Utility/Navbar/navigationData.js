export const navigationData = [
  {
    name: "HOME",
    href: "/",
    hasDropdown: false,
  },
  {
    name: "WATCH",
    href: "/watch",
    hasDropdown: false,
  },
  {
    name: "LEARN",
    href: "/learn",
    hasDropdown: false,
  },
  {
    name: "COMMUNITY & EVENTS",
    href: "/community-events",
    hasDropdown: true,
    subItems: [
      // The specific subitems are likely dynamic or placeholders based on the screenshot text implies "Community & Events"
      // But the design shows dropping down from "ABOUT US".
      // Wait, the screenshot shows a dropdown open for "ABOUT US" with items: "OUR HISTORY", "TEAM FUNCTIONS", "SPECIAL BOOK OF 10 YEARS".
      // It doesn't show dropdown for Community & Events in the open state, but the arrow indicates it has one.
    ],
  },
  {
    name: "ABOUT US",
    href: "/about",
    hasDropdown: true,
    subItems: [
      { name: "OUR HISTORY", href: "/about/history" },
      { name: "TEAM FUNCTIONS", href: "/about/team" },
      { name: "SPECIAL BOOK OF 10 YEARS", href: "/about/book" },
    ],
  },
];
