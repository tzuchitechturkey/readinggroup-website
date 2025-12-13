from datetime import timedelta

from django.conf import settings
from django.contrib.contenttypes.fields import GenericForeignKey, GenericRelation
from django.contrib.contenttypes.models import ContentType
from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models
from django.db.models import Count
from django.utils import timezone

from .enums import (
    ContentStatus,
    EventStatus,
    PostStatus,
    PostType,
    ReportType,
    VideoStatus
    )


class TimestampedModel(models.Model):
    """Abstract base model that tracks creation and modification times."""
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True
        
class Like(models.Model):
    """Generic like model for any entity (Video/Post/Event/...)"""
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="likes")
    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    object_id = models.PositiveIntegerField()
    content_object = GenericForeignKey("content_type", "object_id")
    created_at = models.DateTimeField(default=timezone.now)

    class Meta:
        unique_together = (("user", "content_type", "object_id"),)  
        indexes = [
            models.Index(fields=["content_type", "object_id"]),
            models.Index(fields=["user"]),
        ]
        ordering = ("-created_at",)

    def __str__(self):
        return f"Like<{self.user_id}:{self.content_type_id}:{self.object_id}>"

class LikableMixin(models.Model):
    """Mixin to add liking functionality to any model."""
    likes = GenericRelation(Like, content_type_field='content_type', object_id_field='object_id', related_query_name='likes')

    class Meta:
        abstract = True

    @property
    def likes_count(self) -> int:
        return self.likes.count()

    def has_liked(self, user) -> bool:
        if not user or not user.is_authenticated:
            return False
        return self.likes.filter(user=user).exists()

    def add_like(self, user):
        if user and user.is_authenticated:
            Like.objects.get_or_create(user=user, content_type=ContentType.objects.get_for_model(self), object_id=self.pk)

    def remove_like(self, user):
        if user and user.is_authenticated:
            self.likes.filter(user=user).delete()

    def toggle_like(self, user):
        if self.has_liked(user):
            self.remove_like(user)
            return False
        else:
            self.add_like(user)
            return True
    
    @classmethod
    def top_liked(cls, limit: int = 5):
        """Return top `limit` instances of this model ordered by number of likes.

        Uses an aggregate Count on the related `likes` GenericRelation and orders
        by `-annotated_likes_count` then `-created_at` as a tiebreaker.
        """
        return cls.objects.annotate(annotated_likes_count=Count('likes')).order_by('-annotated_likes_count', '-created_at')[:limit]
    
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
            
class Video(LikableMixin, TimestampedModel):
    """Video content that powers the dashboard listings."""
    title = models.CharField(max_length=255)
    duration = models.CharField(max_length=64, blank=True, null=True)
    category = models.ForeignKey('VideoCategory', on_delete=models.SET_NULL, null=True, blank=True)
    video_type = models.CharField(max_length=100, blank=True, null=True)
    language = models.CharField(max_length=50)
    thumbnail = models.ImageField(upload_to="videos/thumbnails/", blank=True, null=True)
    thumbnail_url = models.URLField(blank=True)
    views = models.PositiveIntegerField(default=0)
    status = models.CharField(max_length=16, choices=VideoStatus.choices, default=VideoStatus.PUBLISHED)
    happened_at = models.DateTimeField(blank=True, null=True)
    is_featured = models.BooleanField(default=False)
    is_new = models.BooleanField(default=False)
    reference_code = models.CharField(max_length=32, blank=True)
    video_url = models.URLField()
    cast = models.JSONField(default=list, blank=True)
    season_name = models.ForeignKey('SeasonId', on_delete=models.SET_NULL, null=True, blank=True)
    description = models.TextField(blank=True)
    tags = models.JSONField(default=list, blank=True)
    is_weekly_moment = models.BooleanField(default=False)
    comments = GenericRelation('Comments', content_type_field='content_type', object_id_field='object_id', related_query_name='comments')

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
                if self.created_at and (timezone.now() - self.created_at) <= timedelta(hours=24):
                    if not self.is_new:
                        self.is_new = True
                        super().save(update_fields=["is_new"])
            except Exception:
                pass
            
    @classmethod
    def top_liked(cls, limit: int = 5):
        """Return top `limit` videos ordered by number of likes (descending) then created_at as tiebreaker.
        The returned queryset is annotated with `annotated_likes_count` to
        """
        qs = (
            cls.objects.filter(status=VideoStatus.PUBLISHED)
            .annotate(annotated_likes_count=Count('likes'))
            .order_by('-annotated_likes_count', '-created_at')
        )
        return qs
    
    @classmethod
    def top_viewed(cls, limit: int = 5):
        """Return top `limit` videos ordered by views."""
        qs = (
            cls.objects.filter(status=VideoStatus.PUBLISHED)
            .order_by('-views', '-created_at')
        )
        return qs
    
    @classmethod
    def top_commented(cls, limit: int = 5):
        """Return top `limit` videos ordered by number of comments (descending) then created_at as tiebreaker.
        The returned queryset is annotated with `annotated_comments_count` to
        """
        qs = (
            cls.objects.filter(status=VideoStatus.PUBLISHED)
            .annotate(annotated_comments_count=Count('comments'))
            .order_by('-annotated_comments_count', '-created_at')
        )
        return qs
    
    class Meta:
        ordering = ("-happened_at", "-created_at")

    def __str__(self) -> str:
        return self.title
    
class Post(LikableMixin, TimestampedModel):
    """Landing posts that appear across the application."""
    title = models.CharField(max_length=255)
    subtitle = models.CharField(max_length=255, blank=True)
    excerpt = models.TextField(blank=True)
    body = models.TextField(blank=True)
    writer = models.CharField(max_length=255)
    writer_avatar = models.URLField(blank=True)
    category = models.ForeignKey('PostCategory', on_delete=models.SET_NULL, null=True, blank=True)
    status = models.CharField(max_length=16, choices=PostStatus.choices, default=PostStatus.PUBLISHED)
    is_active = models.BooleanField(default=True)
    views = models.PositiveIntegerField(default=0)
    read_time = models.CharField(max_length=32, blank=True)
    tags = models.JSONField(default=list, blank=True)
    post_type = models.CharField(max_length=100, blank=True, choices=PostType.choices, default=PostType.CARD)
    language = models.CharField(max_length=50, blank=True)
    image = models.ImageField(upload_to="posts/images/", blank=True, null=True)
    image_url = models.URLField(max_length=1000, blank=True)
    metadata = models.CharField(max_length=255, blank=True)
    country = models.CharField(max_length=100, blank=True)
    camera_name = models.CharField(max_length=255, blank=True)
    comments = GenericRelation('Comments', content_type_field='content_type', object_id_field='object_id', related_query_name='posts')
    is_weekly_moment = models.BooleanField(default=False)
    
    @classmethod
    def top_liked(cls, limit: int = 5):
        """
        Return top `limit` posts where post_type is Card or Photo,
        ordered by number of likes (descending) then created_at as tiebreaker.
        """
        qs = (
            cls.objects.filter(post_type__in=[PostType.CARD, PostType.PHOTO], status=PostStatus.PUBLISHED)
            .annotate(annotated_likes_count=Count('likes'))
            .order_by('-annotated_likes_count', '-created_at')
        )
        # Return grouped shape to match callers that expect a dict with 'card_photo'
        return {"card_photo": qs}
    
    @classmethod
    def top_viewed(cls, limit: int = 5):
        """
        The returned querysets are ordered by `-views` then `-created_at`.
        The view will call `annotate_likes` on these querysets before serialization
        so we intentionally do not annotate likes here.
            """
        card_photo_qs = (
            cls.objects.filter(post_type__in=[PostType.CARD, PostType.PHOTO], status=PostStatus.PUBLISHED)
            .order_by('-views', '-created_at')
        )
        return {"card_photo": card_photo_qs}
    
    @classmethod
    def top_commented_by_types(cls, types: list, limit: int = 5):
        """
        Return top `limit` posts filtered by `post_type` in `types`, ordered by
        number of comments (descending) then created_at as tiebreaker.

        The returned queryset is annotated with `annotated_comments_count` to
        match the annotate_* naming convention used elsewhere.
        """
        qs = (
            cls.objects.filter(post_type__in=types, status=PostStatus.PUBLISHED)
            .annotate(annotated_comments_count=Count('comments'))
            .order_by('-annotated_comments_count', '-created_at')
        )
        return qs
    
    class Meta:
        ordering = ("-created_at",)

    def __str__(self) -> str:
        return self.title
    
class Event(LikableMixin, TimestampedModel):
    """Represent events and news items grouped by section."""
    title = models.CharField(max_length=255)
    writer = models.CharField(max_length=255)
    happened_at = models.DateField()
    image = models.ImageField(upload_to="events/images/", blank=True, null=True)
    image_url = models.URLField(max_length=1000, blank=True)
    category = models.ForeignKey('EventCategory', on_delete=models.SET_NULL, null=True, blank=True)
    report_type = models.CharField(max_length=50, choices=ReportType.choices, default=ReportType.NEWS)
    country = models.CharField(max_length=100, blank=True)
    language = models.CharField(max_length=50)
    status = models.CharField(max_length=16, choices=EventStatus.choices, default=EventStatus.PUBLISHED)
    duration_minutes = models.PositiveIntegerField(blank=True, null=True)
    section = models.ForeignKey('EventSection', on_delete=models.SET_NULL, null=True, blank=True)
    summary = models.TextField(blank=True)
    thumbnail = models.ImageField(upload_to="events/thumbnails/", blank=True, null=True)
    thumbnail_url = models.URLField(blank=True)
    views = models.PositiveIntegerField(default=0)
    video_url = models.CharField(max_length=255, blank=True)
    cast = models.JSONField(default=list, blank=True)
    tags = models.JSONField(default=list, blank=True)
    comments = GenericRelation('Comments', content_type_field='content_type', object_id_field='object_id', related_query_name='events')
    is_weekly_moment = models.BooleanField(default=False)
    external_link = models.URLField(max_length=1000, blank=True)
        
    @classmethod
    def top_liked(cls, limit: int = 5):
        """
        Return top `limit` posts ordered by number of likes (descending) then created_at as tiebreaker.
        """
        qs = (
            cls.objects.filter(status=EventStatus.PUBLISHED)
            .annotate(annotated_likes_count=Count('likes'))
            .order_by('-annotated_likes_count', '-created_at')
        )
        return qs
    
    @classmethod
    def top_viewed(cls, limit: int = 5):
        """Return top `limit` videos ordered by views."""
        qs = (
            cls.objects.filter(status=EventStatus.PUBLISHED)
            .order_by('-views', '-created_at')
        )
        return qs
    
    @classmethod
    def top_commented(cls, limit: int = 5):
        """Return top `limit` videos ordered by number of comments (descending) then created_at as tiebreaker.
        The returned queryset is annotated with `annotated_comments_count` to
        match the annotate_* naming convention used elsewhere.
        """
        qs = (
            cls.objects.filter(status=EventStatus.PUBLISHED)
            .annotate(annotated_comments_count=Count('comments'))
            .order_by('-annotated_comments_count', '-created_at')
        )
        return qs
    class Meta:
        ordering = ("-happened_at", "title")

    def __str__(self) -> str:
        return f"{self.title} ({self.section.name if self.section else ''})"
    
class Content(LikableMixin, TimestampedModel):
    """Landing posts that appear across the application."""
    title = models.CharField(max_length=255)
    subtitle = models.CharField(max_length=1000, blank=True)
    excerpt = models.TextField(blank=True)
    body = models.TextField(blank=True)
    writer = models.CharField(max_length=255)
    writer_avatar = models.URLField(blank=True)
    category = models.ForeignKey('ContentCategory', on_delete=models.SET_NULL, null=True, blank=True)
    status = models.CharField(max_length=16, choices=ContentStatus.choices, default=ContentStatus.DRAFT)
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
    comments = GenericRelation('Comments', content_type_field='content_type', object_id_field='object_id', related_query_name='posts')
    is_weekly_moment = models.BooleanField(default=False)
    
    
    @classmethod
    def top_liked(cls, limit: int = 5):
        """
        Return top `limit` Content ordered by number of likes (descending) then created_at as tiebreaker.
        """
        qs = (
            cls.objects.filter(status=ContentStatus.PUBLISHED)
            .annotate(annotated_likes_count=Count('likes'))
            .order_by('-annotated_likes_count', '-created_at')
        )
        return qs
    
    @classmethod
    def top_viewed(cls, limit: int = 5):
        """Return top `limit` Content ordered by views."""
        qs = (
            cls.objects.filter(status=ContentStatus.PUBLISHED)
            .order_by('-views', '-created_at')
        )
        return qs
    
    @classmethod
    def top_commented(cls, limit: int = 5):
        """Return top `limit` Content ordered by number of comments (descending) then created_at as tiebreaker.
        The returned queryset is annotated with `annotated_comments_count` to
        match the annotate_* naming convention used elsewhere.
        """
        qs = (
            cls.objects.filter(status=ContentStatus.PUBLISHED)
            .annotate(annotated_comments_count=Count('comments'))
            .order_by('-annotated_comments_count', '-created_at')
        )
        return qs
    
    class Meta:
        ordering = ("-created_at",)
    def __str__(self) -> str:
        return self.title
    
class Book(TimestampedModel):
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    category = models.ForeignKey('BookCategory', on_delete=models.SET_NULL, null=True, blank=True)
    
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
    content = models.ForeignKey('Content', on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to="posts/images/", blank=True, null=True)
    image_url = models.URLField(max_length=1000, blank=True)
    caption = models.CharField(max_length=255, blank=True)

    class Meta:
        ordering = ("-created_at",)

    def __str__(self) -> str:
        return f"ContentImage<{self.content_id}:{self.pk}>"


class ContentAttachment(TimestampedModel):
    """Multiple file attachments for a Content instance.
    Supports documents (Word, PDF, PowerPoint) and other file types.
    """
    content = models.ForeignKey('Content', on_delete=models.CASCADE, related_name='attachments', null=True, blank=True)
    file = models.FileField(upload_to="content/attachments/", help_text="Accepts: .doc, .docx, .pdf, .ppt, .pptx, and other document formats")
    file_name = models.CharField(max_length=255, blank=True, help_text="Original filename")
    file_size = models.PositiveIntegerField(blank=True, null=True, help_text="File size in bytes")
    description = models.CharField(max_length=500, blank=True)

    class Meta:
        ordering = ("-created_at",)

    def __str__(self) -> str:
        return f"ContentAttachment<{self.content_id}:{self.pk}>"

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

    def __str__(self) -> str:
        return self.name

class HistoryEntry(LikableMixin, TimestampedModel):
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
    
    
#=====================================================Auxiliary classes========================================================
class PostRating(TimestampedModel):
    """User rating for a Post (1-5 stars). Each user may rate a post once."""
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="post_ratings")
    post = models.ForeignKey('Post', on_delete=models.CASCADE, related_name='ratings')
    rating = models.PositiveSmallIntegerField(validators=[MinValueValidator(1), MaxValueValidator(5)])

    class Meta:
        unique_together = (('user', 'post'),)
        ordering = ("-created_at",)
    def __str__(self) -> str: 
        return f"PostRating<{self.user_id}:{self.post_id}:{self.rating}>"


class ContentRating(TimestampedModel):
    """User rating for a Content instance (1-5 stars). Each user may rate a content once."""
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="content_ratings")
    content = models.ForeignKey('Content', on_delete=models.CASCADE, related_name='ratings')
    rating = models.PositiveSmallIntegerField(validators=[MinValueValidator(1), MaxValueValidator(5)])

    class Meta:
        unique_together = (('user', 'content'),)
        ordering = ("-created_at",)

    def __str__(self) -> str:
        return f"ContentRating<{self.user_id}:{self.content_id}:{self.rating}>"

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

class PostCategory(TimestampedModel):
    """Categories for organizing posts."""
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)
    order = models.PositiveIntegerField(default=0, help_text="Manual ordering (lower values appear first)")

    class Meta:
        ordering = ("order", "-created_at")
    def __str__(self) -> str: 
        return self.name
    
class EventCategory(TimestampedModel):
    """Categories for organizing events."""
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)
    order = models.PositiveIntegerField(default=0, help_text="Manual ordering (lower values appear first)")

    class Meta:
        ordering = ("order", "-created_at")
    def __str__(self) -> str: 
        return self.name
    
class ContentCategory(TimestampedModel):
    """Categories for organizing content."""
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)
    order = models.PositiveIntegerField(default=0, help_text="Manual ordering (lower values appear first)")

    class Meta:
        ordering = ("order", "-created_at")
    def __str__(self) -> str: 
        return self.name

class VideoCategory(TimestampedModel):
    """Categories for organizing videos."""
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)
    order = models.PositiveIntegerField(default=0, help_text="Manual ordering (lower values appear first)")
    
    class Meta:
        ordering = ("order", "-created_at")
    def __str__(self) -> str: 
        return self.name
    
class BookCategory(TimestampedModel):
    """Categories for organizing books."""
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)
    order = models.PositiveIntegerField(default=0, help_text="Manual ordering (lower values appear first)")
    
    class Meta:
        ordering = ("order", "-created_at")
    def __str__(self) -> str: 
        return self.name
    
class SeasonTitle(models.Model):
    """Season and Title mapping for Videos."""
    name = models.CharField(max_length=255, blank=True, unique=True)
    description = models.TextField(blank=True)
    class Meta:
        ordering = ("name",)

    def __str__(self) -> str: 
        return self.name
    
class SeasonId(models.Model):
    """Season ID mapping for Videos."""
    season_title = models.ForeignKey("SeasonTitle", on_delete=models.CASCADE, related_name="season_ids")
    season_id = models.CharField(max_length=100)
    
    class Meta:
        ordering = ("season_title__name",)
    def __str__(self) -> str:
        return self.season_id

class MyListEntry(TimestampedModel):
    """User saved videos for later viewing."""
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="my_list")
    video = models.ForeignKey('Video', on_delete=models.CASCADE, related_name='saved_by')

    class Meta:
        unique_together = (('user', 'video'),)
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

class Comments(LikableMixin, TimestampedModel):
    """Comments for all models."""
    content_type = models.ForeignKey('contenttypes.ContentType', on_delete=models.CASCADE)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    object_id = models.PositiveIntegerField()
    text = models.CharField(max_length=1000)

    class Meta:
        ordering = ("-created_at",)
    def __str__(self):
        return f"Comment<{self.user_id}:{self.object_id}>"

class Reply(LikableMixin, TimestampedModel):
    """Replies to comments."""
    comment = models.ForeignKey(Comments, related_name='replies', on_delete=models.CASCADE)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    text = models.CharField(max_length=1000)

    class Meta:
        ordering = ("-created_at",)
    def __str__(self):
        return f"Reply<{self.user_id}:{self.comment_id}>"
        
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