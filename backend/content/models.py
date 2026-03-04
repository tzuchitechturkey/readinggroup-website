from datetime import timedelta
import uuid

from django.conf import settings
from django.db import models
from django.utils import timezone
from django.utils.text import slugify
from jsonschema import ValidationError

from .enums import (
    VideoType,
    LearnType,
    LearnCategoryDirection,
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


class EventCommunity(TimestampedModel):
    title = models.CharField(max_length=255)
    guest_speakers = models.JSONField(default=list, blank=True)
    live_stream_link = models.URLField(blank=True, null=True)
    learn = models.ForeignKey(
        "Learn",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="event_communities",
        limit_choices_to={"category__learn_type": LearnType.POSTERS},
    )
    start_event_date = models.DateField(blank=True, null=True)
    start_event_time = models.TimeField(blank=True, null=True)
    duration = models.CharField(max_length=64, blank=True, null=True)

    class Meta:
        ordering = ("-start_event_date", "-start_event_time")

    def clean(self):
        if self.learn and self.learn.category:
            if self.learn.category.learn_type != LearnType.POSTERS:
                raise ValidationError(
                    {
                        "learn": "Only Learn objects with learn_type='posters' are allowed."
                    }
                )

    def save(self, *args, **kwargs):
        self.full_clean()
        super().save(*args, **kwargs)

        if self.learn:
            if not self.learn.is_event:
                self.learn.is_event = True
                self.learn.save(update_fields=["is_event"])

    def delete(self, *args, **kwargs):
        learn_instance = self.learn
        super().delete(*args, **kwargs)

        if learn_instance:
            if not EventCommunity.objects.filter(learn=learn_instance).exists():
                learn_instance.is_event = False
                learn_instance.save(update_fields=["is_event"])

    def __str__(self):
        return self.title


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


# ======================================================= New Models end =======================================================

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
