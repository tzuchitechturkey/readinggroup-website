# YouTube Video Duration Extraction

## Overview
This feature automatically extracts and displays video duration from YouTube URLs without requiring manual input.

## How It Works

### Method 1: YouTube IFrame API (Current Implementation)
- Uses YouTube's IFrame Player API
- **Advantages:**
  - No API key required
  - Free to use
  - Accurate duration extraction
- **How it works:**
  1. Extracts video ID from URL
  2. Creates hidden iframe with YouTube player
  3. Waits for player to load
  4. Extracts duration using `getDuration()` method
  5. Formats and displays the duration
  6. Cleans up the iframe

### Method 2: YouTube Data API v3 (Optional - More Reliable)
If you want more reliability and faster performance, you can use YouTube Data API v3:

#### Setup:
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable **YouTube Data API v3**
4. Go to **Credentials** and create an **API Key**
5. Restrict the API key to YouTube Data API v3 (recommended)
6. Copy your API key

#### Configuration:
1. Create `.env` file in `frontend/` directory:
   ```bash
   cp .env.example .env
   ```

2. Add your API key:
   ```env
   VITE_YOUTUBE_API_KEY=your_actual_api_key_here
   ```

3. Restart the dev server:
   ```bash
   npm run dev
   ```

## Components

### VideoDurationCell
Location: `frontend/src/components/ForPages/Dashboard/Videos/VideoDurationCell/VideoDurationCell.jsx`

**Props:**
- `videoUrl` (string): YouTube video URL

**Features:**
- Automatic duration extraction
- Loading state with spinner
- Error handling (shows "N/A" if failed)
- Formatted display (HH:MM:SS or MM:SS)
- Clock icon for better UX

### Utility Functions
Location: `frontend/src/Utility/Global/getYouTubeDuration.js`

**Available functions:**
1. `extractYouTubeVideoId(url)` - Extracts video ID from various YouTube URL formats
2. `formatYouTubeDuration(duration)` - Converts ISO 8601 duration to readable format
3. `getYouTubeDuration(videoUrl, apiKey)` - Fetches duration using YouTube Data API v3

## Supported YouTube URL Formats

- `https://www.youtube.com/watch?v=VIDEO_ID`
- `https://youtu.be/VIDEO_ID`
- `https://www.youtube.com/embed/VIDEO_ID`
- Direct video ID: `VIDEO_ID`

## Usage in VideosList

The `VideoDurationCell` component is automatically used in the videos table:

```jsx
<TableCell className="text-[#1E1E1E] text-center text-[11px] py-4">
  <VideoDurationCell videoUrl={video.video_url} />
</TableCell>
```

## Performance Considerations

### Current Implementation (IFrame API):
- **Pros:**
  - No API key needed
  - No rate limits
  - Free forever
- **Cons:**
  - Slightly slower (needs to load player)
  - Multiple requests for many videos at once
  - Requires YouTube to be accessible

### YouTube Data API v3:
- **Pros:**
  - Very fast
  - Can fetch multiple videos in one request
  - More reliable
- **Cons:**
  - Requires API key
  - Has quota limits (10,000 units/day free)
  - Each video duration check costs 1 unit

## Troubleshooting

### Duration shows "N/A"
**Possible causes:**
1. Invalid YouTube URL
2. Video is private or deleted
3. Network connectivity issues
4. YouTube API is blocked in your region

**Solutions:**
- Verify the YouTube URL is correct
- Check if video is publicly accessible
- Try using YouTube Data API v3 method

### Loading takes too long
**Solutions:**
- Switch to YouTube Data API v3 method (much faster)
- Implement caching mechanism to store durations
- Consider fetching durations in backend

## Future Enhancements

1. **Backend Caching:**
   - Store duration in database when video is created
   - Update periodically via cron job

2. **Batch Processing:**
   - Fetch multiple video durations in single API call
   - Reduce API quota usage

3. **Fallback Chain:**
   - Try IFrame API first
   - Fall back to Data API v3 if available
   - Show placeholder if both fail

## API Quota Management

If using YouTube Data API v3:
- Free tier: 10,000 units/day
- Each duration check: 1 unit
- Can handle ~10,000 videos/day
- Consider implementing caching to reduce API calls

## Security Notes

- Never commit `.env` file to git
- API keys should be server-side only (future enhancement)
- Consider using environment variables in production
- Rotate API keys periodically

## Migration from Manual Duration

If you have existing videos with manual duration field:
1. Keep both methods for backward compatibility
2. Gradually migrate to auto-extraction
3. Use manual duration as fallback if extraction fails

## Testing

Test with various YouTube URLs:
```javascript
// Valid URLs
https://www.youtube.com/watch?v=dQw4w9WgXcQ
https://youtu.be/dQw4w9WgXcQ
https://www.youtube.com/embed/dQw4w9WgXcQ

// Invalid URLs (should show "N/A")
https://example.com/video.mp4
https://youtube.com/invalid
```
