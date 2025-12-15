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
    // Writers
    "All Writers": "writers",
    "Add/Edit Writer": "createOrEditWriter",
    // Profile && Setting
    "Profile Settings": "profileSettings",
    profile: "profile",
    // About Us
    History: "history",
    Departments: "departments",
    "Our Team": "team",
    "The Books": "books",
    "Add/Edit Book": "createOrEditBook",
    "The Books Groups": "booksGroups",
    // Web site info
    "Website Info": "websiteInfo",
    "Sort Section": "sortSection",
  };
  return titleMap[title] || title.toLowerCase();
};
