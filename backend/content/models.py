from datetime import timedelta

from django.conf import settings
from django.db import models
from django.utils import timezone
from jsonschema import ValidationError
from simple_history.models import HistoricalRecords

from .enums import (
    VideoType,
    LearnType,
    LearnCategoryDirection,
)


# ======================================================= New Models Start =======================================================
class TimestampedModel(models.Model):
    """Abstract base model that tracks creation and modification times."""

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="+",
        editable=False,
    )
    updated_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="+",
        editable=False,
    )
    history = HistoricalRecords(inherit=True)

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
    base_video = models.ForeignKey(
        "self",
        null=True,
        blank=True,
        on_delete=models.CASCADE,
        related_name="translations",
    )

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
        return self.name


class ContentAttachment(TimestampedModel):
    """Attachments for all data found in our database (e.g. videos, learns)."""

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
        return f"ContentAttachment<{self.file_name}:{self.pk}>"


class Learn(TimestampedModel):
    title = models.CharField(max_length=255, blank=True, null=True)
    subtitle = models.CharField(max_length=255, blank=True, null=True)
    category = models.ForeignKey(
        "LearnCategory",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="learns",
    )
    image = models.ImageField(upload_to="posts/images/", blank=True, null=True)
    image_url = models.URLField(max_length=1000, blank=True)
    author_name = models.CharField(max_length=255, blank=True, null=True)
    author_country = models.CharField(max_length=255, blank=True, null=True)
    happened_at = models.DateTimeField(blank=True, null=True)
    views = models.PositiveIntegerField(default=0)

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


class RelatedReports(TimestampedModel):
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    category = models.ForeignKey(
        "RelatedReportsCategory",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="related_reports",
    )
    thumbnail_url = models.JSONField(default=list, blank=True)
    image = models.ImageField(
        upload_to="related-reports/images/", blank=True, null=True
    )
    external_link = models.URLField(blank=True, null=True)
    happened_at = models.DateTimeField(blank=True, null=True)
    duration = models.CharField(max_length=64, blank=True, null=True)
    views = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ("-created_at",)

    def __str__(self) -> str:
        return self.title


class RelatedReportsCategory(TimestampedModel):
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ("-created_at",)

    def __str__(self) -> str:
        return self.title


class PhotoCollection(TimestampedModel):
    """Photo collection model for managing photo albums/galleries."""

    title = models.CharField(max_length=255, blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    image = models.ImageField(
        upload_to="photo-collections/covers/", blank=True, null=True
    )
    happened_at = models.DateTimeField(blank=True, null=True)
    is_new = models.BooleanField(default=False)

    class Meta:
        ordering = ("-happened_at", "-created_at")

    def __str__(self) -> str:
        return self.title or f"PhotoCollection {self.pk}"


class Photo(TimestampedModel):
    """Individual photo in a photo collection."""

    collection = models.ForeignKey(
        "PhotoCollection", on_delete=models.CASCADE, related_name="photos"
    )
    image = models.ImageField(upload_to="photo-collections/photos/")
    caption = models.CharField(max_length=500, blank=True)
    order = models.PositiveIntegerField(
        default=0, help_text="Order of photo in the collection"
    )

    class Meta:
        ordering = ("order", "created_at")
        constraints = [
            models.UniqueConstraint(
                fields=["collection", "order"],
                name="unique_photo_order_per_collection",
            )
        ]

    def __str__(self) -> str:
        return f"Photo {self.order} in {self.collection.title}"

    def save(self, *args, **kwargs):
        """Ensure a collection doesn't exceed 30 photos."""
        if not self.pk:  # Only check on creation
            photo_count = Photo.objects.filter(collection=self.collection).count()
            if photo_count >= 28:
                raise ValidationError(
                    "A photo collection cannot have more than 30 photos."
                )
        super().save(*args, **kwargs)


class LatestNews(TimestampedModel):
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    happened_at = models.DateTimeField(blank=True, null=True)
    is_new = models.BooleanField(default=False)

    class Meta:
        ordering = ("-created_at",)

    def __str__(self) -> str:
        return self.title


class LatestNewsImage(TimestampedModel):
    """Individual image for a latest news item."""

    latest_news = models.ForeignKey(
        "LatestNews", on_delete=models.CASCADE, related_name="images"
    )
    image = models.ImageField(upload_to="latest-news/images/")
    caption = models.CharField(max_length=500, blank=True)
    order = models.PositiveIntegerField(
        default=0, help_text="Order of image in the news item"
    )

    class Meta:
        ordering = ("order", "created_at")
        constraints = [
            models.UniqueConstraint(
                fields=["latest_news", "order"],
                name="unique_image_order_per_news",
            )
        ]

    def __str__(self) -> str:
        return f"Image {self.order} for {self.latest_news.title}"


class EventCommunity(TimestampedModel):
    title = models.CharField(max_length=255)
    language = models.CharField(max_length=50, blank=True, null=True)
    guest_speakers = models.JSONField(default=list, blank=True)
    live_stream_link = models.URLField(blank=True, null=True)
    start_event_date = models.DateField(blank=True, null=True)
    start_event_time = models.TimeField(blank=True, null=True)
    duration = models.CharField(max_length=64, blank=True, null=True)
    base_event = models.ForeignKey(
        "self",
        null=True,
        blank=True,
        on_delete=models.CASCADE,
        related_name="translations",
    )

    class Meta:
        ordering = ("-start_event_date", "-start_event_time")

    def __str__(self):
        return self.title


class EventCommunityImage(TimestampedModel):
    """Individual image for an event community item."""

    event = models.ForeignKey(
        "EventCommunity", on_delete=models.CASCADE, related_name="images"
    )
    image = models.ImageField(upload_to="event-community/images/")
    caption = models.CharField(max_length=500, blank=True, null=True)
    order = models.PositiveIntegerField(
        default=0, help_text="Order of image in the event"
    )

    class Meta:
        ordering = ("order", "created_at")

    def __str__(self) -> str:
        return f"Image {self.order} for {self.event.title}"


class OurTeam(TimestampedModel):
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    is_heart = models.BooleanField(default=False)
    image = models.ImageField(upload_to="our-team/images/", blank=True, null=True)
    image_url = models.JSONField(default=list, blank=True)

    def save(self, *args, **kwargs):
        """Ensure only one OurTeam item has is_heart=True at any time."""
        super().save(*args, **kwargs)
        if self.is_heart:
            OurTeam.objects.filter(is_heart=True).exclude(pk=self.pk).update(
                is_heart=False
            )

    class Meta:
        ordering = ("title",)

    def __str__(self) -> str:
        return self.title


class OurTeamImage(TimestampedModel):
    """Individual image for an our team member."""

    our_team = models.ForeignKey(
        "OurTeam", on_delete=models.CASCADE, related_name="images"
    )
    image = models.ImageField(upload_to="our-team/images/")
    caption = models.CharField(max_length=500, blank=True)
    order = models.PositiveIntegerField(
        default=0, help_text="Order of image for the team member"
    )

    class Meta:
        ordering = ("order", "created_at")
        constraints = [
            models.UniqueConstraint(
                fields=["our_team", "order"],
                name="unique_image_order_per_team_member",
            )
        ]

    def __str__(self) -> str:
        return f"Image {self.order} for {self.our_team.title}"


class Book(TimestampedModel):
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    image = models.ImageField(upload_to="books/images/", blank=True, null=True)
    cover_image = models.FileField(upload_to="books/covers/", blank=True, null=True)

    class Meta:
        ordering = ("-created_at",)

    def __str__(self) -> str:
        return self.title


class BookReview(TimestampedModel):
    book = models.ForeignKey("Book", on_delete=models.CASCADE, related_name="reviews")
    image = models.FileField(upload_to="books/reviews/")
    order = models.PositiveIntegerField(
        default=0, help_text="Order of review image in the book"
    )

    class Meta:
        ordering = ("order", "created_at")
        constraints = [
            models.UniqueConstraint(
                fields=["book", "order"], name="unique_review_order_per_book"
            )
        ]

    def __str__(self) -> str:
        return f"Review {self.order} for {self.book.title}"


class HistoryEvent(TimestampedModel):
    year = models.PositiveIntegerField()
    month = models.PositiveSmallIntegerField(default=1)
    title = models.CharField(max_length=255)
    sub_title_one = models.CharField(max_length=255, blank=True)
    sub_title_two = models.CharField(max_length=255, blank=True)
    description = models.TextField(blank=True)

    class Meta:
        ordering = ("year", "month")

    def __str__(self):
        return f"{self.year} - {self.title}"


class HistoryEventImage(TimestampedModel):
    event = models.ForeignKey(
        HistoryEvent, on_delete=models.CASCADE, related_name="images"
    )
    image = models.ImageField(upload_to="our-history/images/")
    caption = models.CharField(max_length=1000, blank=False, null=False)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ("order", "created_at")
        constraints = [
            models.UniqueConstraint(
                fields=["event", "order"],
                name="unique_image_order_per_event",
            )
        ]

    def __str__(self):
        return f"{self.event.title} - Image {self.order}"


# ======================================================= New Models end =======================================================
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
