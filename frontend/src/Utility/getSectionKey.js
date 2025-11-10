export const getSectionKey = (title) => {
  const titleMap = {
    Home: "home",
    // Posts
    "All Posts": "posts",
    "Add/Edit Post": "createOrEditPost",
    "Posts Categories": "postsCategories",
    "All Cards": "cards",
    // Videos
    "All Videos": "videos",
    Videos: "videos",
    "Videos Categories": "videosCategories",
    "Add/Edit Video": "createOrEditVideo",
    "Series & Seasons": "seriesAndSeasons",
    "Videos Seasons": "videosSeasons",
    // contents
    "All Contents": "contents",
    "Add/Edit Content": "createOrEditContent",
    "Contents Categories": "contentsCategories",
    // Events
    "All Events": "events",
    "Add/Edit Event": "createOrEditEvent",
    "Events Categories": "eventsCategories",
    "Events Sections": "eventsSections",
    // Profile && Setting
    "Profile Settings": "profileSettings",
    profile: "profile",
    // About Us
    History: "history",
    positions: "positions",
    "Our Team": "team",
    // Web site info
    "Website Info": "websiteInfo",
    "Sort Section": "sortSection",
  };
  return titleMap[title] || title.toLowerCase();
};
