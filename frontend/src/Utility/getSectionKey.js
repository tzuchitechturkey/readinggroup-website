export const getSectionKey = (title) => {
  const titleMap = {
    Home: "home",
    Read: "read",
    "All Posts": "posts",
    "Add/Edit Post": "createOrEditPost",
    "Posts Categories": "postsCategories",
    "All Videos": "videos",
    "All Cards": "cards",
    // "All Photos": "photos",
    Videos: "videos",
    "Videos Categories": "videosCategories",
    "Add New Video": "createOrEditVideo",
    History: "history",
    "Our Team": "team",
    "Health Posts": "healthPosts",
    "News List": "newsList",
    "Tv Categories": "tvCategories",
    Settings: "settings",
    profile: "profile",
    team: "team",
    Refunds: "refunds",
    Declines: "declines",
    Payouts: "payouts",
  };
  return titleMap[title] || title.toLowerCase();
};
