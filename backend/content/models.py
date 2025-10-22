from django.db import models
from .enums import (
    PostStatus,
    EventSection,
    POSTTYPE,
)


class TimestampedModel(models.Model):
    """Abstract base model that tracks creation and modification times."""
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class Video(TimestampedModel):
    """Video content that powers the dashboard listings."""
    title = models.CharField(max_length=255)
    duration = models.CharField(max_length=64)
    category = models.ForeignKey('VideoCategory', on_delete=models.SET_NULL, null=True, blank=True)
    video_type = models.CharField(max_length=100)
    language = models.CharField(max_length=50)
    thumbnail = models.ImageField(upload_to="videos/thumbnails/", blank=True, null=True)
    thumbnail_url = models.URLField(blank=True)
    views = models.PositiveIntegerField(default=0)
    published_at = models.DateTimeField(blank=True, null=True)
    featured = models.BooleanField(default=False)
    is_new = models.BooleanField(default=False)
    reference_code = models.CharField(max_length=32, blank=True)
    video_url = models.URLField()
    cast = models.TextField(blank=True)
    season = models.CharField(max_length=32, blank=True)
    description = models.TextField(blank=True)
    tags = models.JSONField(default=list, blank=True)

    class Meta:
        ordering = ("-published_at", "-created_at")

    def __str__(self) -> str:  # pragma: no cover - trivial
        return self.title


class Post(TimestampedModel):
    """Landing posts that appear across the application."""
    title = models.CharField(max_length=255)
    subtitle = models.CharField(max_length=255, blank=True)
    excerpt = models.TextField(blank=True)
    body = models.TextField(blank=True)
    writer = models.CharField(max_length=255)
    writer_avatar = models.URLField(blank=True)
    category = models.ForeignKey('PostCategory', on_delete=models.SET_NULL, null=True, blank=True)
    status = models.CharField(max_length=16, choices=PostStatus.choices, default=PostStatus.DRAFT)
    is_active = models.BooleanField(default=True)
    views = models.PositiveIntegerField(default=0)
    read_time = models.CharField(max_length=32, blank=True)
    tags = models.JSONField(default=list, blank=True)
    published_at = models.DateTimeField(blank=True, null=True)
    post_type = models.CharField(max_length=100, blank=True, choices=POSTTYPE.choices, default=POSTTYPE.CARD)
    language = models.CharField(max_length=50, blank=True)
    image = models.ImageField(upload_to="posts/images/", blank=True, null=True)
    image_url = models.URLField(blank=True)
    metadata = models.CharField(max_length=255, blank=True)
    country = models.CharField(max_length=100, blank=True)
    camera_name = models.CharField(max_length=255, blank=True)

    class Meta:
        ordering = ("-published_at", "-created_at")

    def __str__(self) -> str:  # pragma: no cover - trivial
        return self.title

class Event(TimestampedModel):
    """Represent events and news items grouped by section."""
    title = models.CharField(max_length=255)
    writer = models.CharField(max_length=255)
    date = models.DateField()
    image = models.ImageField(upload_to="events/images/", blank=True, null=True)
    image_url = models.URLField(blank=True)
    category = models.ForeignKey('EventCategory', on_delete=models.SET_NULL, null=True, blank=True)
    report_type = models.CharField(max_length=50)
    country = models.CharField(max_length=100, blank=True)
    language = models.CharField(max_length=50)
    duration_minutes = models.PositiveIntegerField(blank=True, null=True)
    section = models.CharField(max_length=32, choices=EventSection.choices)
    summary = models.TextField(blank=True)

    class Meta:
        ordering = ("-date", "title")

    def __str__(self) -> str:  # pragma: no cover - trivial
        return f"{self.title} ({self.get_section_display()})"


class TvProgram(TimestampedModel):
    """Represents TV/news programs curated for the TV section."""
    title = models.CharField(max_length=255)
    description = models.TextField()
    air_date = models.DateField()
    image = models.ImageField(upload_to="tv/images/", blank=True, null=True)
    image_url = models.URLField(blank=True)
    writer = models.CharField(max_length=255)
    category = models.ForeignKey('TvProgramCategory', on_delete=models.SET_NULL, null=True, blank=True)
    is_live = models.BooleanField(default=False)

    class Meta:
        ordering = ("-air_date", "title")

    def __str__(self) -> str:  # pragma: no cover - trivial
        return self.title


class WeeklyMoment(TimestampedModel):
    """Weekly highlighted items displayed on the home page."""

    title = models.CharField(max_length=255)
    start_time = models.CharField(max_length=32)
    status_label = models.CharField(max_length=32)
    status_color = models.CharField(max_length=32, blank=True)
    content_type = models.CharField(max_length=100, blank=True)
    source = models.CharField(max_length=100, blank=True)
    language = models.CharField(max_length=50, blank=True)
    image = models.ImageField(upload_to="weekly/images/", blank=True, null=True)
    image_url = models.URLField(blank=True)

    class Meta:
        ordering = ("-created_at", "title")

    def __str__(self) -> str:  # pragma: no cover - trivial
        return self.title


class TeamMember(TimestampedModel):
    """Team member details for the About Us section."""
    name = models.CharField(max_length=255)
    position = models.ForeignKey('PositionTeamMember', on_delete=models.SET_NULL, null=True, blank=True)
    job_title = models.CharField(max_length=255, blank=True)
    description = models.TextField(blank=True)
    avatar = models.ImageField(upload_to="team/avatars/", blank=True, null=True)
    avatar_url = models.URLField(blank=True)
    social_links = models.JSONField(default=list, blank=True)

    class Meta:
        ordering = ("name",)

    def __str__(self) -> str:  # pragma: no cover - trivial
        return self.name


class HistoryEntry(TimestampedModel):
    """Timeline entries for the organisation history section."""
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    story_date = models.DateField()
    image = models.ImageField(upload_to="history/images/", blank=True, null=True)
    image_url = models.URLField(blank=True)

    class Meta:
        ordering = ("story_date", "title")

    def __str__(self) -> str:  # pragma: no cover - trivial
        return f"{self.title} ({self.story_date} - present)"
    
    
#Category Fot Videos
class VideoCategory(TimestampedModel):
    """Categories for organizing videos."""
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)

    class Meta:
        ordering = ("name",)

    def __str__(self) -> str: 
        return self.name

#Category for Posts
class PostCategory(TimestampedModel):
    """Categories for organizing posts."""
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)

    class Meta:
        ordering = ("name",)

    def __str__(self) -> str: 
        return self.name
    
#Category for Events
class EventCategory(TimestampedModel):
    """Categories for organizing events."""
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)

    class Meta:
        ordering = ("name",)

    def __str__(self) -> str: 
        return self.name
    
#Category for TvPrograms
class TvProgramCategory(TimestampedModel):
    """Categories for organizing TV programs."""
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)

    class Meta:
        ordering = ("name",)

    def __str__(self) -> str: 
        return self.name
    
class PositionTeamMember(TimestampedModel):
    """Positions for Team Members."""
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)

    class Meta:
        ordering = ("name",)

    def __str__(self) -> str: 
        return self.name