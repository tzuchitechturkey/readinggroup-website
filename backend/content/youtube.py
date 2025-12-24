import json
import re
from dataclasses import dataclass
from datetime import datetime, timezone
from typing import Any, Dict, Optional
from urllib import error, request


class YouTubeAPIError(Exception):
    """Raised when the YouTube Data API request fails."""


def extract_video_id(url: str) -> Optional[str]:
    """Extract the YouTube video ID from a URL or return None if invalid."""
    if not url:
        return None

    trimmed = url.strip()

    # Direct video ID
    if re.fullmatch(r"[A-Za-z0-9_-]{11}", trimmed):
        return trimmed

    patterns = [
        r"(?:youtube\.com/watch\?v=|youtu\.be/|youtube\.com/embed/)([^&\n?#]+)",
        r"youtube\.com/shorts/([A-Za-z0-9_-]{11})",
    ]

    for pattern in patterns:
        match = re.search(pattern, trimmed)
        if match:
            return match.group(1)

    return None


def parse_iso8601_duration(duration: str) -> int:
    """Convert an ISO8601 duration string (e.g. PT1H2M10S) into total seconds."""
    if not duration:
        return 0

    match = re.fullmatch(r"PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?", duration)
    if not match:
        return 0

    hours = int(match.group(1) or 0)
    minutes = int(match.group(2) or 0)
    seconds = int(match.group(3) or 0)
    return hours * 3600 + minutes * 60 + seconds


def format_duration(total_seconds: int) -> str:
    """Format seconds into HH:MM:SS or MM:SS depending on length."""
    if total_seconds <= 0:
        return "00:00"

    hours, remainder = divmod(total_seconds, 3600)
    minutes, seconds = divmod(remainder, 60)

    if hours:
        return f"{hours}:{minutes:02d}:{seconds:02d}"
    return f"{minutes}:{seconds:02d}"


@dataclass
class YouTubeVideoInfo:
    video_id: str
    title: str
    description: str
    duration_seconds: int
    duration_formatted: str
    thumbnails: Dict[str, Any]
    channel_title: Optional[str]
    published_at: Optional[datetime]
    default_language: Optional[str]


def _load_json_from_url(url: str) -> Dict[str, Any]:
    req = request.Request(url, headers={"Accept": "application/json"})
    try:
        with request.urlopen(req, timeout=10) as resp:
            data = resp.read().decode("utf-8")
    except error.HTTPError as exc:
        raise YouTubeAPIError(f"YouTube API request failed with status {exc.code}.") from exc
    except error.URLError as exc:
        raise YouTubeAPIError("Unable to contact YouTube API.") from exc

    try:
        return json.loads(data)
    except json.JSONDecodeError as exc:
        raise YouTubeAPIError("Failed to decode YouTube API response.") from exc


def fetch_video_info(video_url: str, api_key: str) -> YouTubeVideoInfo:
    video_id = extract_video_id(video_url)
    if not video_id:
        raise YouTubeAPIError("Please provide a valid YouTube video URL or ID.")

    if not api_key:
        raise YouTubeAPIError("YouTube API key is not configured.")

    api_endpoint = (
        "https://www.googleapis.com/youtube/v3/videos"
        f"?id={video_id}&part=snippet,contentDetails&key={api_key}"
    )

    payload = _load_json_from_url(api_endpoint)

    items = payload.get("items") or []
    if not items:
        raise YouTubeAPIError("No video found for the provided URL.")

    item = items[0]
    snippet = item.get("snippet", {})
    content = item.get("contentDetails", {})

    duration_seconds = parse_iso8601_duration(content.get("duration", ""))
    published_at_raw = snippet.get("publishedAt")
    published_at = None
    if published_at_raw:
        try:
            published_at = datetime.fromisoformat(published_at_raw.replace("Z", "+00:00"))
            if published_at.tzinfo is None:
                published_at = published_at.replace(tzinfo=timezone.utc)
            else:
                published_at = published_at.astimezone(timezone.utc)
        except ValueError:
            published_at = None

    return YouTubeVideoInfo(
        video_id=video_id,
        title=snippet.get("title", ""),
        description=snippet.get("description", ""),
        duration_seconds=duration_seconds,
        duration_formatted=format_duration(duration_seconds),
        thumbnails=snippet.get("thumbnails", {}),
        channel_title=snippet.get("channelTitle"),
        published_at=published_at,
        default_language=snippet.get("defaultLanguage"),
    )
