import re
from dataclasses import dataclass
from typing import Optional
from urllib import error, request
from html.parser import HTMLParser


class DaaiTVError(Exception):
    """Raised when the Daai TV request fails."""


class DaaiTVMetaParser(HTMLParser):
    """Simple HTML parser to extract meta tags and title from Daai TV pages."""

    def __init__(self):
        super().__init__()
        self.meta_tags = {}
        self.title = None
        self.in_title = False

    def handle_starttag(self, tag, attrs):
        attrs_dict = dict(attrs)

        if tag == "meta":
            # Extract Open Graph meta tags
            property_name = attrs_dict.get("property", "")
            content = attrs_dict.get("content", "")

            if property_name and content:
                self.meta_tags[property_name] = content

            # Also check for name attribute
            name = attrs_dict.get("name", "")
            if name and content:
                self.meta_tags[name] = content

        elif tag == "title":
            self.in_title = True

    def handle_data(self, data):
        if self.in_title and not self.title:
            self.title = data.strip()

    def handle_endtag(self, tag):
        if tag == "title":
            self.in_title = False


def extract_program_id(url: str) -> Optional[str]:
    """Extract the program ID from a Daai TV URL."""
    if not url:
        return None

    trimmed = url.strip()

    # Pattern to match daai.tv program URLs
    # Example: https://www.daai.tv/program/P1840/P18400170
    pattern = r"daai\.tv/program/([^/]+)/([^/\n?#]+)"
    match = re.search(pattern, trimmed)

    if match:
        # Return both parts as they might be needed
        return f"{match.group(1)}/{match.group(2)}"

    return None


@dataclass
class DaaiTVInfo:
    """Data class to hold Daai TV program information."""

    program_id: str
    title: str
    description: str
    thumbnail_url: Optional[str]
    video_url: Optional[str]
    duration: Optional[str]
    published_at: Optional[str]


def fetch_daai_tv_info(program_url: str) -> DaaiTVInfo:
    """
    Fetch program information from Daai TV website.

    Args:
        program_url: The full URL of the Daai TV program

    Returns:
        DaaiTVInfo object containing the program information

    Raises:
        DaaiTVError: If the request fails or URL is invalid
    """
    program_id = extract_program_id(program_url)
    if not program_id:
        raise DaaiTVError("Please provide a valid Daai TV program URL.")

    # Fetch the HTML content
    req = request.Request(
        program_url,
        headers={
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        },
    )

    try:
        with request.urlopen(req, timeout=15) as resp:
            html_content = resp.read().decode("utf-8")
    except error.HTTPError as exc:
        raise DaaiTVError(f"Daai TV request failed with status {exc.code}.") from exc
    except error.URLError as exc:
        raise DaaiTVError("Unable to contact Daai TV website.") from exc
    except Exception as exc:
        raise DaaiTVError(f"Error fetching Daai TV content: {str(exc)}") from exc

    # Parse the HTML
    parser = DaaiTVMetaParser()
    try:
        parser.feed(html_content)
    except Exception as exc:
        raise DaaiTVError(f"Error parsing Daai TV page: {str(exc)}") from exc

    # Extract information from meta tags
    meta = parser.meta_tags

    # Get title (try multiple sources)
    title = (
        meta.get("og:title") or meta.get("twitter:title") or parser.title or "Untitled"
    )

    # Get description
    description = (
        meta.get("og:description")
        or meta.get("description")
        or meta.get("twitter:description")
        or ""
    )

    # Get thumbnail
    thumbnail_url = meta.get("og:image") or meta.get("twitter:image") or None

    # Get video URL if available
    video_url = meta.get("og:video") or meta.get("og:video:url") or None

    # Get duration if available
    duration = meta.get("video:duration") or None

    # Get published date if available
    published_at = meta.get("article:published_time") or None

    return DaaiTVInfo(
        program_id=program_id,
        title=title,
        description=description,
        thumbnail_url=thumbnail_url,
        video_url=video_url,
        duration=duration,
        published_at=published_at,
    )
