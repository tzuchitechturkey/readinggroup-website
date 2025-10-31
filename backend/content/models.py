from django.db import models
from django.db.models import Count
from django.utils import timezone
from django.contrib.contenttypes.models import ContentType
from django.contrib.contenttypes.fields import GenericForeignKey, GenericRelation
from django.core.validators import MinValueValidator, MaxValueValidator
from django.conf import settings
from .enums import (
    PostStatus,
    PostType,
    VideoType,
    ReportType,
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
    
class SeasonTitle(models.Model):
    """Season and Title mapping for Videos."""
    name = models.CharField(max_length=255, blank=True)
    description = models.TextField(blank=True)
    class Meta:
        ordering = ("name",)
        

class Video(LikableMixin, TimestampedModel):
    """Video content that powers the dashboard listings."""
    title = models.CharField(max_length=255)
    duration = models.CharField(max_length=64)
    category = models.ForeignKey('VideoCategory', on_delete=models.SET_NULL, null=True, blank=True)
    video_type = models.CharField(max_length=100, choices=VideoType.choices, default=VideoType.FULL_VIDEO)
    language = models.CharField(max_length=50)
    thumbnail = models.ImageField(upload_to="videos/thumbnails/", blank=True, null=True)
    thumbnail_url = models.URLField(blank=True)
    views = models.PositiveIntegerField(default=0)
    happened_at = models.DateTimeField(blank=True, null=True)
    featured = models.BooleanField(default=False)
    is_new = models.BooleanField(default=False)
    reference_code = models.CharField(max_length=32, blank=True)
    video_url = models.URLField()
    cast = models.JSONField(default=list, blank=True)
    season = models.ForeignKey(SeasonTitle, on_delete=models.SET_NULL, null=True, blank=True)
    series = models.CharField(max_length=255, blank=True)
    description = models.TextField(blank=True)
    tags = models.JSONField(default=list, blank=True)
    comments = GenericRelation('Comments', content_type_field='content_type', object_id_field='object_id', related_query_name='comments')

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
    status = models.CharField(max_length=16, choices=PostStatus.choices, default=PostStatus.DRAFT)
    is_active = models.BooleanField(default=True)
    views = models.PositiveIntegerField(default=0)
    read_time = models.CharField(max_length=32, blank=True)
    tags = models.JSONField(default=list, blank=True)
    post_type = models.CharField(max_length=100, blank=True, choices=PostType.choices, default=PostType.CARD)
    language = models.CharField(max_length=50, blank=True)
    image = models.ImageField(upload_to="posts/images/", blank=True, null=True)
    image_url = models.URLField(blank=True)
    metadata = models.CharField(max_length=255, blank=True)
    country = models.CharField(max_length=100, blank=True)
    camera_name = models.CharField(max_length=255, blank=True)
    comments = GenericRelation('Comments', content_type_field='content_type', object_id_field='object_id', related_query_name='posts')
    @classmethod
    def top_liked_grouped(cls, limit: int = 5):
        """
        Return top liked posts grouped into two categories:
        - 'card_photo': top `limit` posts where post_type is Card or Photo
        - 'reading': top `limit` posts where post_type is Reading

        Each returned queryset is annotated with `likes_count` and ordered
        by `-likes_count` then `-created_at` as a tiebreaker.
        """
        # Annotate using the same field name used elsewhere in the codebase
        # (annotated_likes_count) so view helpers and serializers remain
        # consistent.
        card_photo_qs = (
            cls.objects.filter(post_type__in=[PostType.CARD, PostType.PHOTO])
            .annotate(annotated_likes_count=Count('likes'))
            .order_by('-annotated_likes_count', '-created_at')[:limit]
        )
        reading_qs = (
            cls.objects.filter(post_type=PostType.READING)
            .annotate(annotated_likes_count=Count('likes'))
            .order_by('-annotated_likes_count', '-created_at')[:limit]
        )
        return {"card_photo": card_photo_qs, "reading": reading_qs}

    @classmethod
    def top_viewed_grouped(cls, limit: int = 5):
        """
        Return top viewed posts grouped into two categories:
        - 'card_photo': top `limit` posts where post_type is Card or Photo
        - 'reading': top `limit` posts where post_type is Reading

        The returned querysets are ordered by `-views` then `-created_at`.
        The view will call `annotate_likes` on these querysets before serialization
        so we intentionally do not annotate likes here.
        """
        card_photo_qs = (
            cls.objects.filter(post_type__in=[PostType.CARD, PostType.PHOTO])
            .order_by('-views', '-created_at')[:limit]
        )
        reading_qs = (
            cls.objects.filter(post_type=PostType.READING)
            .order_by('-views', '-created_at')[:limit]
        )
        return {"card_photo": card_photo_qs, "reading": reading_qs}
    
    @classmethod
    def top_commented_by_types(cls, types: list, limit: int = 5):
        """
        Return top `limit` posts filtered by `post_type` in `types`, ordered by
        number of comments (descending) then created_at as tiebreaker.

        The returned queryset is annotated with `annotated_comments_count` to
        match the annotate_* naming convention used elsewhere.
        """
        qs = (
            cls.objects.filter(post_type__in=types)
            .annotate(annotated_comments_count=Count('comments'))
            .order_by('-annotated_comments_count', '-created_at')[:limit]
        )
        return qs
    class Meta:
        ordering = ("-created_at",)

    def __str__(self) -> str:
        return self.title


class MyListEntry(TimestampedModel):
    """User saved videos for later viewing."""
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="my_list")
    video = models.ForeignKey('Video', on_delete=models.CASCADE, related_name='saved_by')

    class Meta:
        unique_together = (('user', 'video'),)
        ordering = ("-created_at",)

    def __str__(self) -> str:  # pragma: no cover - trivial
        return f"MyListEntry<{self.user_id}:{self.video_id}>"
    
    
class Event(LikableMixin, TimestampedModel):
    """Represent events and news items grouped by section."""
    title = models.CharField(max_length=255)
    writer = models.CharField(max_length=255)
    happened_at = models.DateField()
    image = models.ImageField(upload_to="events/images/", blank=True, null=True)
    image_url = models.URLField(blank=True)
    category = models.ForeignKey('EventCategory', on_delete=models.SET_NULL, null=True, blank=True)
    report_type = models.CharField(max_length=50, choices=ReportType.choices, default=ReportType.NEWS)
    country = models.CharField(max_length=100, blank=True)
    language = models.CharField(max_length=50)
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
    class Meta:
        ordering = ("-happened_at", "title")

    def __str__(self) -> str:
        return f"{self.title} ({self.section.name if self.section else ''})"
    
    @classmethod
    def top_commented(cls, limit: int = 5):
        """Return top `limit` Event instances ordered by number of comments.

        Annotates queryset with `annotated_comments_count` then orders by
        `-annotated_comments_count` and `-created_at` as a tiebreaker.
        """
        try:
            qs = cls.objects.annotate(annotated_comments_count=Count('comments')).order_by('-annotated_comments_count', '-created_at')[:limit]
            return qs
        except Exception:
            # Fallback: return most recent events if annotation fails
            return cls.objects.order_by('-created_at')[:limit]


class PostRating(TimestampedModel):
    """User rating for a Post (1-5 stars). Each user may rate a post once."""
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="post_ratings")
    post = models.ForeignKey('Post', on_delete=models.CASCADE, related_name='ratings')
    rating = models.PositiveSmallIntegerField(validators=[MinValueValidator(1), MaxValueValidator(5)])

    class Meta:
        unique_together = (('user', 'post'),)
        ordering = ("-created_at",)

    def __str__(self) -> str:  # pragma: no cover - trivial
        return f"PostRating<{self.user_id}:{self.post_id}:{self.rating}>"

class WeeklyMoment(LikableMixin, TimestampedModel):
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
    views = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ("-created_at", "title")

    def __str__(self) -> str:
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

    def __str__(self) -> str:
        return self.name


class HistoryEntry(LikableMixin, TimestampedModel):
    """Timeline entries for the organisation history section."""
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    story_date = models.DateField()
    image = models.ImageField(upload_to="history/images/", blank=True, null=True)
    image_url = models.URLField(blank=True)
    views = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ("story_date", "title")

    def __str__(self) -> str:
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

class Reply(LikableMixin, TimestampedModel):
    """Replies to comments."""
    comment = models.ForeignKey(Comments, related_name='replies', on_delete=models.CASCADE)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    text = models.CharField(max_length=1000)

    class Meta:
        ordering = ("-created_at",)