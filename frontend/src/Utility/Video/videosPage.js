// Apply local sorting to videos
export const applySorting = (videos) => {
  const sortedVideos = [...videos];

  switch (filters.sortBy) {
    case "newest":
      return sortedVideos.sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at),
      );
    case "oldest":
      return sortedVideos.sort(
        (a, b) => new Date(a.created_at) - new Date(b.created_at),
      );
    case "most_viewed":
      return sortedVideos.sort(
        (a, b) => (b.views_count || 0) - (a.views_count || 0),
      );
    case "most_liked":
      return sortedVideos.sort(
        (a, b) => (b.likes_count || 0) - (a.likes_count || 0),
      );
    case "alphabetical":
      return sortedVideos.sort((a, b) =>
        (a.title || "").localeCompare(b.title || ""),
      );
    default:
      return sortedVideos;
  }
};
