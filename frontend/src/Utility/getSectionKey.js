export const getSectionKey = (title) => {
  const titleMap = {
    Home: "home",
    // Learn Posts
    "All Learn": "learn",
    "Add/Edit Learn": "createOrEditLearn",
    "Learn Categories": "learnCategories",
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
    // Photo Collection
    "All Photo Collections": "photoCollections",
    "Add/Edit Photo": "createOrEditPhotoCollection",
    "Photo Collections": "photoCollectionCategories",
    // Related Reports
    "All Related Reports": "relatedReports",
    "Add/Edit Related Report": "createOrEditRelatedReports",
    "Related Report Categories": "relatedReportCategories",
    // Latest News
    "All News": "news",
    "Add/Edit News": "createOrEditNews",
    // Live Stream Schedule
    "Live Stream Schedules": "liveStreamSchedules",
    "Add/Edit Live Stream Schedule": "createOrEditLiveStreamSchedule",
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
