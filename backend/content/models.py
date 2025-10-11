from django.db import models


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
    category = models.CharField(max_length=100)
    video_type = models.CharField(max_length=100)
    subject = models.CharField(max_length=100, blank=True)
    language = models.CharField(max_length=50)
    thumbnail = models.ImageField(upload_to="videos/thumbnails/", blank=True, null=True)
    thumbnail_url = models.URLField(blank=True)
    views = models.PositiveIntegerField(default=0)
    published_at = models.DateTimeField()
    featured = models.BooleanField(default=False)
    is_new = models.BooleanField(default=False)
    reference_code = models.CharField(max_length=32, blank=True)
    video_url = models.URLField()

    class Meta:
        ordering = ("-published_at", "-created_at")

    def __str__(self) -> str:  # pragma: no cover - trivial
        return self.title


class Post(TimestampedModel):
    """Landing posts that appear across the application."""

    STATUS_CHOICES = [
        ("draft", "Draft"),
        ("published", "Published"),
        ("archived", "Archived"),
    ]

    title = models.CharField(max_length=255)
    subtitle = models.CharField(max_length=255, blank=True)
    excerpt = models.TextField(blank=True)
    body = models.TextField(blank=True)
    writer = models.CharField(max_length=255)
    writer_avatar = models.URLField(blank=True)
    category = models.CharField(max_length=100)
    status = models.CharField(max_length=16, choices=STATUS_CHOICES, default="draft")
    is_active = models.BooleanField(default=True)
    views = models.PositiveIntegerField(default=0)
    read_time = models.CharField(max_length=32, blank=True)
    tags = models.JSONField(default=list, blank=True)
    published_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        ordering = ("-published_at", "-created_at")

    def __str__(self) -> str:  # pragma: no cover - trivial
        return self.title


class Reading(TimestampedModel):
    """Guided reading entries offered on the site."""

    title = models.CharField(max_length=255)
    author = models.CharField(max_length=255)
    publish_date = models.DateField()
    category = models.CharField(max_length=100)
    genre = models.CharField(max_length=100)
    language = models.CharField(max_length=50)
    source = models.CharField(max_length=255)
    rating = models.DecimalField(max_digits=3, decimal_places=2, default=0)
    reviews = models.PositiveIntegerField(default=0)
    image = models.ImageField(upload_to="readings/images/", blank=True, null=True)
    image_url = models.URLField(blank=True)
    badge = models.CharField(max_length=100, blank=True)

    class Meta:
        ordering = ("-publish_date", "title")

    def __str__(self) -> str:  # pragma: no cover - trivial
        return self.title


class Event(TimestampedModel):
    """Represent events and news items grouped by section."""

    SECTION_CHOICES = [
        ("warm_discussion", "Warm Discussion"),
        ("drama", "Drama"),
        ("event_report", "Event Report"),
        ("recommendation", "Recommendation"),
        ("trending", "Trending"),
        ("breaking", "Breaking News"),
        ("latest", "Latest Updates"),
    ]

    title = models.CharField(max_length=255)
    author = models.CharField(max_length=255)
    date = models.DateField()
    image = models.ImageField(upload_to="events/images/", blank=True, null=True)
    image_url = models.URLField(blank=True)
    category = models.CharField(max_length=100)
    report_type = models.CharField(max_length=50)
    country = models.CharField(max_length=100, blank=True)
    language = models.CharField(max_length=50)
    duration_minutes = models.PositiveIntegerField(blank=True, null=True)
    section = models.CharField(max_length=32, choices=SECTION_CHOICES)
    summary = models.TextField(blank=True)

    class Meta:
        ordering = ("-date", "title")

    def __str__(self) -> str:  # pragma: no cover - trivial
        return f"{self.title} ({self.get_section_display()})"


class MediaCard(TimestampedModel):
    """Cards and photos displayed across the app."""

    KIND_CHOICES = [
        ("card", "Card"),
        ("photo", "Photo"),
        ("gallery", "Gallery"),
    ]

    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    theme = models.CharField(max_length=50, blank=True)
    language = models.CharField(max_length=50, blank=True)
    kind = models.CharField(max_length=16, choices=KIND_CHOICES, default="card")
    card_type = models.CharField(max_length=50, blank=True)
    image = models.ImageField(upload_to="cards/images/", blank=True, null=True)
    image_url = models.URLField(blank=True)
    cover_image = models.ImageField(upload_to="cards/covers/", blank=True, null=True)
    cover_image_url = models.URLField(blank=True)
    metadata = models.JSONField(default=dict, blank=True)

    class Meta:
        ordering = ("-created_at", "title")

    def __str__(self) -> str:  # pragma: no cover - trivial
        return self.title


class TvProgram(TimestampedModel):
    """Represents TV/news programs curated for the TV section."""

    title = models.CharField(max_length=255)
    description = models.TextField()
    air_date = models.DateField()
    image = models.ImageField(upload_to="tv/images/", blank=True, null=True)
    image_url = models.URLField(blank=True)
    writer = models.CharField(max_length=255)
    category = models.CharField(max_length=100)
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
    position = models.CharField(max_length=255, blank=True)
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
    from_date = models.DateField()
    to_date = models.DateField(blank=True, null=True)
    image = models.ImageField(upload_to="history/images/", blank=True, null=True)
    image_url = models.URLField(blank=True)

    class Meta:
        ordering = ("from_date", "title")

    def __str__(self) -> str:  # pragma: no cover - trivial
        return f"{self.title} ({self.from_date} - {self.to_date or 'present'})"
