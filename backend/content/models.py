from datetime import timedelta
import uuid

from django.conf import settings
from django.db import models
from django.utils import timezone
from django.utils.text import slugify

from .enums import (
    VideoType,
    LearnType,
    LearnCategoryDirection,
    ContentStatus,
    EventStatus,
    ReportType,
    LanguageChoices,
)

# ======================================================= New Models Start =======================================================


class TimestampedModel(models.Model):
    """Abstract base model that tracks creation and modification times."""

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class Video(TimestampedModel):
    """Video content that powers the dashboard listings."""

    title = models.CharField(max_length=255)
    duration = models.CharField(max_length=64, blank=True, null=True)
    category = models.ForeignKey(
        "VideoCategory", on_delete=models.SET_NULL, null=True, blank=True
    )
    description = models.TextField(blank=True)
    video_type = models.CharField(
        max_length=100, blank=True, null=True, choices=VideoType.choices
    )
    language = models.CharField(max_length=50)
    views = models.PositiveIntegerField(default=0)
    thumbnail = models.ImageField(upload_to="videos/thumbnails/", blank=True, null=True)
    thumbnail_url = models.JSONField(default=list, blank=True)
    happened_at = models.DateTimeField(blank=True, null=True)
    is_new = models.BooleanField(default=False)
    reference_code = models.CharField(max_length=32, blank=True)
    video_url = models.URLField()
    guest_speakers = models.JSONField(default=list, blank=True)

    @property
    def is_new_computed(self) -> bool:
        """Is the video considered 'new' within 24 hours of creation.
        This is a computed property and does NOT replace the DB boolean field
        `is_new`. Keeping the DB field allows admin filters and writes to work
        as before while the API exposes the computed value.
        """
        if not self.created_at:
            return False
        try:
            return timezone.now() - self.created_at <= timedelta(hours=24)
        except Exception:
            return False

    def save(self, *args, **kwargs):
        """Ensure `is_new` is set to True on creation if within 24 hours of `created_at`.
        We need to call super().save() first so `created_at` (auto_now_add) is
        populated by the database. After the initial save we check the creation
        time and update `is_new` if appropriate. We avoid infinite recursion by
        using update_fields on the follow-up save.
        """
        is_create = self.pk is None
        super().save(*args, **kwargs)
        if is_create:
            try:
                if self.created_at and (timezone.now() - self.created_at) <= timedelta(
                    hours=24
                ):
                    if not self.is_new:
                        self.is_new = True
                        super().save(update_fields=["is_new"])
            except Exception:
                pass

    class Meta:
        ordering = ("-happened_at", "-created_at")

    def __str__(self) -> str:
        return self.title


class VideoCategory(TimestampedModel):
    """Categories for organizing videos with multi-language support.

    Each category has a unique key that identifies it across all languages.
    The combination of (key, language) must be unique.
    """

    name = models.CharField(
        max_length=100, help_text="Category name in the specified language"
    )
    description = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)
    order = models.PositiveIntegerField(
        default=0, help_text="Manual ordering (lower values appear first)"
    )

    class Meta:
        ordering = ("order", "-created_at")

    def __str__(self) -> str:
        return


class Learn(TimestampedModel):
    title = models.CharField(max_length=255)
    subtitle = models.CharField(max_length=255, blank=True)
    category = models.ForeignKey(
        "LearnCategory",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="learns",
    )
    image = models.ImageField(upload_to="posts/images/", blank=True, null=True)
    image_url = models.URLField(max_length=1000, blank=True)
    happened_at = models.DateTimeField(blank=True, null=True)
    views = models.PositiveIntegerField(default=0)
    is_event = models.BooleanField(default=False)
    event_title = models.CharField(max_length=255, blank=True)
    guest_speakers = models.JSONField(default=list, blank=True)
    live_stream_link = models.URLField(blank=True, null=True)
    event_date = models.DateField(blank=True, null=True)
    event_time = models.TimeField(blank=True, null=True)

    class Meta:
        ordering = ("-created_at",)

    def __str__(self) -> str:
        return self.title


class LearnCategory(TimestampedModel):
    name = models.CharField(
        max_length=100, help_text="Category name in the specified language"
    )
    description = models.TextField(blank=True)
    direction = models.CharField(
        max_length=255, blank=True, choices=LearnCategoryDirection.choices
    )
    is_active = models.BooleanField(default=True)
    learn_type = models.CharField(
        max_length=100, blank=True, choices=LearnType.choices, default=LearnType.CARDS
    )
    order = models.PositiveIntegerField(
        default=0, help_text="Manual ordering (lower values appear first)"
    )

    class Meta:
        ordering = ("order", "-created_at")
        constraints = [
            models.UniqueConstraint(
                fields=["name", "learn_type"],
                name="unique_learncategory_name_per_type",
            )
        ]


class ContentAttachment(TimestampedModel):
    """Multiple file attachments for a Content instance.
    Supports documents (Word, PDF, PowerPoint) and other file types.
    """

    content = models.ForeignKey(
        "Content",
        on_delete=models.CASCADE,
        related_name="attachments",
        null=True,
        blank=True,
    )

    Video = models.ForeignKey(
        "Video",
        on_delete=models.CASCADE,
        related_name="attachments",
        null=True,
        blank=True,
    )

    file = models.FileField(
        upload_to="content/attachments/",
        help_text="Accepts: .doc, .docx, .pdf, .ppt, .pptx, and other document formats",
    )
    file_name = models.CharField(
        max_length=255, blank=True, help_text="Original filename"
    )
    file_size = models.PositiveIntegerField(
        blank=True, null=True, help_text="File size in bytes"
    )
    description = models.CharField(max_length=500, blank=True)

    class Meta:
        ordering = ("-created_at",)

    def __str__(self) -> str:
        return f"ContentAttachment<{self.content_id}:{self.pk}>"


# ======================================================= New Models end =======================================================


class Event(TimestampedModel):
    """Represent events and news items grouped by section."""

    title = models.CharField(max_length=255)
    writer = models.CharField(max_length=255)
    happened_at = models.DateField()
    image = models.ImageField(upload_to="events/images/", blank=True, null=True)
    image_url = models.URLField(max_length=1000, blank=True)
    category = models.ForeignKey(
        "EventCategory", on_delete=models.SET_NULL, null=True, blank=True
    )
    report_type = models.CharField(
        max_length=50, choices=ReportType.choices, default=ReportType.NEWS
    )
    country = models.CharField(max_length=100, blank=True)
    language = models.CharField(max_length=50)
    status = models.CharField(
        max_length=16, choices=EventStatus.choices, default=EventStatus.PUBLISHED
    )
    duration_minutes = models.PositiveIntegerField(blank=True, null=True)
    section = models.ForeignKey(
        "EventSection", on_delete=models.SET_NULL, null=True, blank=True
    )
    summary = models.TextField(blank=True)
    thumbnail = models.ImageField(upload_to="events/thumbnails/", blank=True, null=True)
    thumbnail_url = models.URLField(blank=True)
    views = models.PositiveIntegerField(default=0)
    video_url = models.CharField(max_length=255, blank=True)
    cast = models.JSONField(default=list, blank=True)
    tags = models.JSONField(default=list, blank=True)
    is_weekly_moment = models.BooleanField(default=False)
    external_link = models.URLField(max_length=1000, blank=True)

    class Meta:
        ordering = ("-happened_at", "title")

    def __str__(self) -> str:
        return f"{self.title} ({self.section.name if self.section else ''})"


class Content(TimestampedModel):
    """Landing posts that appear across the application."""

    title = models.CharField(max_length=255)
    subtitle = models.CharField(max_length=1000, blank=True)
    excerpt = models.TextField(blank=True)
    body = models.TextField(blank=True)
    writer = models.CharField(max_length=255)
    writer_avatar = models.URLField(blank=True)
    category = models.ForeignKey(
        "ContentCategory", on_delete=models.SET_NULL, null=True, blank=True
    )
    status = models.CharField(
        max_length=16, choices=ContentStatus.choices, default=ContentStatus.DRAFT
    )
    is_active = models.BooleanField(default=True)
    content_type = models.CharField(max_length=100, blank=True, null=True)
    views = models.PositiveIntegerField(default=0)
    read_time = models.CharField(max_length=32, blank=True)
    tags = models.JSONField(default=list, blank=True)
    language = models.CharField(max_length=50, blank=True)
    image = models.ImageField(upload_to="posts/images/", blank=True, null=True)
    image_url = models.URLField(max_length=1000, blank=True)
    metadata = models.CharField(max_length=1000, blank=True)
    country = models.CharField(max_length=100, blank=True)
    is_weekly_moment = models.BooleanField(default=False)

    class Meta:
        ordering = ("-created_at",)

    def __str__(self) -> str:
        return self.title


class Book(TimestampedModel):
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    category = models.ForeignKey(
        "BookCategory", on_delete=models.SET_NULL, null=True, blank=True
    )

    class Meta:
        ordering = ("name",)

    def __str__(self):
        return self.name


class ContentImage(TimestampedModel):
    """Multiple images / image urls attached to a Content instance.
    This model allows Content to have zero or more images (file uploads)
    and/or image URLs. Keeping a separate table preserves backward
    compatibility with the single `Content.image` / `Content.image_url`
    fields while enabling multi-image support used by a frontend slider.
    """

    content = models.ForeignKey(
        "Content", on_delete=models.CASCADE, related_name="images"
    )
    image = models.ImageField(upload_to="posts/images/", blank=True, null=True)
    image_url = models.URLField(max_length=1000, blank=True)
    caption = models.CharField(max_length=255, blank=True)

    class Meta:
        ordering = ("-created_at",)

    def __str__(self) -> str:
        return f"ContentImage<{self.content_id}:{self.pk}>"


class TeamMember(TimestampedModel):
    """Team member details for the About Us section."""

    name = models.CharField(max_length=255)
    position = models.ForeignKey(
        "PositionTeamMember", on_delete=models.SET_NULL, null=True, blank=True
    )
    job_title = models.CharField(max_length=255, blank=True)
    description = models.TextField(blank=True)
    avatar = models.ImageField(upload_to="team/avatars/", blank=True, null=True)
    avatar_url = models.URLField(blank=True)
    social_links = models.JSONField(default=list, blank=True)

    class Meta:
        ordering = ("name",)

    def __str__(self) -> str:
        return self.name


class HistoryEntry(TimestampedModel):
    """Timeline entries for the organisation history section."""

    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    story_date = models.DateField()
    image = models.ImageField(upload_to="history/images/", blank=True, null=True)
    image_url = models.URLField(max_length=1000, blank=True)
    views = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ("story_date", "title")

    def __str__(self) -> str:
        return f"{self.title} ({self.story_date} - present)"


class SectionOrder(models.Model):
    """Persist global ordering for dashboard/top-stats sections.
    Each row stores a section key (e.g. 'video', 'post_card') and a
    numeric position. Lower numbers appear earlier.
    """

    key = models.CharField(max_length=100, unique=True)
    position = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ("position",)

    def __str__(self) -> str:
        return f"SectionOrder<{self.key}:{self.position}>"


class EventCategory(TimestampedModel):
    """Categories for organizing events with multi-language support.

    Each category has a unique key that identifies it across all languages.
    The combination of (key, language) must be unique.
    """

    key = models.CharField(
        max_length=100,
        db_index=True,
        blank=True,
        default="",
        help_text="Unique identifier for this category across all languages",
    )
    name = models.CharField(
        max_length=100, help_text="Category name in the specified language"
    )
    description = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)
    order = models.PositiveIntegerField(
        default=0, help_text="Manual ordering (lower values appear first)"
    )
    language = models.CharField(
        max_length=10, choices=LanguageChoices.choices, default=LanguageChoices.ENGLISH
    )
    translation_group = models.UUIDField(
        default=uuid.uuid4,
        editable=False,
        help_text="UUID grouping translations of the same category",
    )

    class Meta:
        ordering = ("order", "-created_at")
        unique_together = (("key", "language"),)
        indexes = [
            models.Index(fields=["key", "language"]),
        ]

    def save(self, *args, **kwargs):
        """Auto-generate unique key on creation if not provided."""
        if not self.pk and not self.key:
            # Generate unique key from name and uuid
            base_key = slugify(self.name) if self.name else "category"
            unique_suffix = str(uuid.uuid4())[:8]
            self.key = f"{base_key}-{unique_suffix}"
        super().save(*args, **kwargs)

    @classmethod
    def get_translations(cls, key):
        """Get all translations for a given key."""
        return cls.objects.filter(key=key)

    @classmethod
    def get_by_language(cls, key, language):
        """Get specific translation by key and language."""
        try:
            return cls.objects.get(key=key, language=language)
        except cls.DoesNotExist:
            return None

    def __str__(self) -> str:
        return f"{self.name} ({self.language})"


class ContentCategory(TimestampedModel):
    """Categories for organizing content with multi-language support.

    Each category has a unique key that identifies it across all languages.
    The combination of (key, language) must be unique.
    """

    key = models.CharField(
        max_length=100,
        db_index=True,
        blank=True,
        default="",
        help_text="Unique identifier for this category across all languages",
    )
    name = models.CharField(
        max_length=100, help_text="Category name in the specified language"
    )
    description = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)
    order = models.PositiveIntegerField(
        default=0, help_text="Manual ordering (lower values appear first)"
    )
    language = models.CharField(
        max_length=10, choices=LanguageChoices.choices, default=LanguageChoices.ENGLISH
    )
    translation_group = models.UUIDField(
        default=uuid.uuid4,
        editable=False,
        help_text="UUID grouping translations of the same category",
    )

    class Meta:
        ordering = ("order", "-created_at")
        unique_together = (("key", "language"),)
        indexes = [
            models.Index(fields=["key", "language"]),
        ]

    def save(self, *args, **kwargs):
        """Auto-generate unique key on creation if not provided."""
        if not self.pk and not self.key:
            # Generate unique key from name and uuid
            base_key = slugify(self.name) if self.name else "category"
            unique_suffix = str(uuid.uuid4())[:8]
            self.key = f"{base_key}-{unique_suffix}"
        super().save(*args, **kwargs)

    @classmethod
    def get_translations(cls, key):
        """Get all translations for a given key."""
        return cls.objects.filter(key=key)

    @classmethod
    def get_by_language(cls, key, language):
        """Get specific translation by key and language."""
        try:
            return cls.objects.get(key=key, language=language)
        except cls.DoesNotExist:
            return None

    def __str__(self) -> str:
        return f"{self.name} ({self.language})"


class Authors(TimestampedModel):
    """Authors for videos and posts."""

    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    position = models.CharField(max_length=255, blank=True)
    avatar = models.ImageField(upload_to="authors/avatars/", blank=True, null=True)
    avatar_url = models.URLField(blank=True)

    class Meta:
        ordering = ("name",)

    def __str__(self) -> str:
        return self.name


class BookCategory(TimestampedModel):
    """Categories for organizing books with multi-language support.

    Each category has a unique key that identifies it across all languages.
    The combination of (key, language) must be unique.
    """

    key = models.CharField(
        max_length=100,
        db_index=True,
        blank=True,
        default="",
        help_text="Unique identifier for this category across all languages",
    )
    name = models.CharField(
        max_length=100, help_text="Category name in the specified language"
    )
    description = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)
    order = models.PositiveIntegerField(
        default=0, help_text="Manual ordering (lower values appear first)"
    )
    language = models.CharField(
        max_length=10, choices=LanguageChoices.choices, default=LanguageChoices.ENGLISH
    )
    translation_group = models.UUIDField(
        default=uuid.uuid4,
        editable=False,
        help_text="UUID grouping translations of the same category",
    )

    class Meta:
        ordering = ("order", "-created_at")
        unique_together = (("key", "language"),)
        indexes = [
            models.Index(fields=["key", "language"]),
        ]

    def save(self, *args, **kwargs):
        """Auto-generate unique key on creation if not provided."""
        if not self.pk and not self.key:
            # Generate unique key from name and uuid
            base_key = slugify(self.name) if self.name else "category"
            unique_suffix = str(uuid.uuid4())[:8]
            self.key = f"{base_key}-{unique_suffix}"
        super().save(*args, **kwargs)

    @classmethod
    def get_translations(cls, key):
        """Get all translations for a given key."""
        return cls.objects.filter(key=key)

    @classmethod
    def get_by_language(cls, key, language):
        """Get specific translation by key and language."""
        try:
            return cls.objects.get(key=key, language=language)
        except cls.DoesNotExist:
            return None

    def __str__(self) -> str:
        return f"{self.name} ({self.language})"


class MyListEntry(TimestampedModel):
    """User saved videos for later viewing."""

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="my_list"
    )
    video = models.ForeignKey(
        "Video", on_delete=models.CASCADE, related_name="saved_by"
    )

    class Meta:
        unique_together = (("user", "video"),)
        ordering = ("-created_at",)

    def __str__(self) -> str:
        return f"MyListEntry<{self.user_id}:{self.video_id}>"


class PositionTeamMember(TimestampedModel):
    """Positions for Team Members."""

    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)

    class Meta:
        ordering = ("name",)

    def __str__(self) -> str:
        return self.name


class EventSection(TimestampedModel):
    """Sections for Events."""

    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)

    class Meta:
        ordering = ("name",)

    def events(self):
        """Return a queryset of Event objects that belong to this section."""
        return self.event_set.all()

    def __str__(self) -> str:
        return self.name


class NavbarLogo(TimestampedModel):
    logo = models.ImageField(upload_to="infowebsite/logos/", blank=True, null=True)

    class Meta:
        ordering = ("-created_at",)

    def __str__(self):
        return f"NavbarLogo<{self.pk}>"


class SocialMedia(TimestampedModel):
    platform = models.CharField(max_length=100)
    url = models.URLField(max_length=1000)

    class Meta:
        ordering = ("-created_at",)

    def __str__(self):
        return f"{self.platform}: {self.url}"
