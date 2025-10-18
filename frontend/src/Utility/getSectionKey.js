export const getSectionKey = (title) => {
  const titleMap = {
    Home: "home",
    Read: "read",
    "All Posts": "posts",
    "Add/Edit Post": "createOrEditPost",
    "All Videos": "videos",
    "All Cards": "cards",
    "All Photos": "photos",
    Videos: "videos",
    "Add New Video": "createOrEditVideo",
    History: "history",
    "Our Team": "team",
    "Health Posts": "healthPosts",
    TV: "tv",
    Settings: "settings",
    profile: "profile",
    team: "team",
    Refunds: "refunds",
    Declines: "declines",
    Payouts: "payouts",
  };
  return titleMap[title] || title.toLowerCase();
};
