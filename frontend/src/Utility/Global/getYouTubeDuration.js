/**
 * Extract YouTube video ID from various URL formats
 * @param {string} url - YouTube video URL
 * @returns {string|null} - Video ID or null if not found
 */
export const extractYouTubeVideoId = (url) => {
  if (!url) return null;

  // Handle different YouTube URL formats
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /^([a-zA-Z0-9_-]{11})$/, // Direct video ID
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }

  return null;
};

/**
 * Convert ISO 8601 duration to readable format (HH:MM:SS or MM:SS)
 * @param {string} duration - ISO 8601 duration (e.g., "PT1H2M10S")
 * @returns {string} - Formatted duration
 */
export const formatYouTubeDuration = (duration) => {
  if (!duration) return "00:00";

  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return "00:00";

  const hours = parseInt(match[1] || 0);
  const minutes = parseInt(match[2] || 0);
  const seconds = parseInt(match[3] || 0);

  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  }

  return `${minutes}:${String(seconds).padStart(2, "0")}`;
};

/**
 * Fetch YouTube video duration using YouTube Data API v3
 * @param {string} videoUrl - YouTube video URL
 * @param {string} apiKey - YouTube Data API key
 * @returns {Promise<string>} - Formatted duration or "N/A" if failed
 */
export const getYouTubeDuration = async (videoUrl, apiKey) => {
  try {
    const videoId = extractYouTubeVideoId(videoUrl);
    if (!videoId) {
      return "N/A";
    }

    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&part=contentDetails&key=${apiKey}`
    );

    if (!response.ok) {
      console.error("YouTube API request failed:", response.status);
      return "N/A";
    }

    const data = await response.json();

    if (data.items && data.items.length > 0) {
      const duration = data.items[0].contentDetails.duration;
      return formatYouTubeDuration(duration);
    }

    return "N/A";
  } catch (error) {
    console.error("Error fetching YouTube duration:", error);
    return "N/A";
  }
};

/**
 * Get YouTube video duration without API (extracts from embedded player - less reliable)
 * This is a fallback method if API key is not available
 * @param {string} videoUrl - YouTube video URL
 * @returns {Promise<string>} - Duration placeholder
 */
export const getYouTubeDurationFallback = async (videoUrl) => {
  try {
    const videoId = extractYouTubeVideoId(videoUrl);
    if (!videoId) {
      return "N/A";
    }

    // This method requires the video to be embedded, which is not practical for backend data
    // Return a placeholder that indicates the video exists
    return "▶️"; // Play icon as placeholder
  } catch (error) {
    console.error("Error in fallback duration method:", error);
    return "N/A";
  }
};
