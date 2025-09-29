export const getSectionKey = (title) => {
  const titleMap = {
    Home: "home",
    Read: "read",
    "All Posts": "posts",
    "Add New Post": "createOrEditPost",
    "All Videos": "videos",
    Videos: "videos",
    "Add New Video": "createOrEditVideo",
    Settings: "settings",
    profile: "profile",
    team: "team",
    Refunds: "refunds",
    Declines: "declines",
    Payouts: "payouts",
  };
  return titleMap[title] || title.toLowerCase();
};
