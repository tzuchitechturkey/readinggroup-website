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
    // Team
    "Our Team": "team",
    "Add/Edit Team Member": "createOrEditTeam",
    // Books
    "The Book": "book",
    "The Reviews": "createOrEditReviews",
    // History
    "All History": "history",
    "Add/Edit History": "createOrEditHistory",
    // Web site info
    "Website Info": "websiteInfo",
    "Sort Section": "sortSection",
  };
  return titleMap[title] || title.toLowerCase();
};
