from rest_framework import serializers
from readinggroup_backend.helpers import DateTimeFormattingMixin
from rest_framework.exceptions import ValidationError
from django.contrib.contenttypes.models import ContentType
from accounts.serializers import UserSerializer
from accounts.models import User as AccountUser
from django.db.models import Q
from .helpers import AbsoluteURLSerializer
from .models import (
    Event,
    HistoryEntry,
    Post,
    Content,
    TeamMember,
    Comments,
    Reply,
    Video,
    MyListEntry,
    WeeklyMoment,
    VideoCategory,
    PostCategory,
    EventCategory,
    ContentCategory,
    PositionTeamMember,
    EventSection,
    PostRating,
    Like,
    SeasonTitle,
    SeasonId,
    SocialMedia,
    NavbarLogo,
)

def _resolve_target_user(obj):
    """Resolve a User instance from common attributes on `obj`.

    Tries attributes like 'user', 'to_user', 'from_user', 'uploader', 'author',
    'owner', 'created_by', 'writer'. If the attribute is a string, attempts to
    find a matching User by username or display_name (case-insensitive).
    """
    attrs = ("user", "to_user", "from_user", "uploader", "author", "owner", "created_by", "writer")
    for a in attrs:
        if hasattr(obj, a):
            val = getattr(obj, a)
            if isinstance(val, AccountUser):
                return val
            if isinstance(val, str) and val.strip():
                try:
                    u = AccountUser.objects.filter(Q(username__iexact=val) | Q(display_name__iexact=val)).first()
                    if u:
                        return u
                except Exception:
                    pass
    return None

class ReplySerializer(DateTimeFormattingMixin, serializers.ModelSerializer):
    """Serializer for reply model attached to comments."""
    user = UserSerializer(read_only=True)
    likes_count = serializers.SerializerMethodField(read_only=True)
    has_liked = serializers.SerializerMethodField(read_only=True)
    comment = serializers.PrimaryKeyRelatedField(queryset=Comments.objects.all(), required=False)

    class Meta:
        model = Reply
        fields = (
            "id",
            "user",
            "comment",
            "text",
            "created_at",
            "likes_count",
            "has_liked",
        )

    def validate(self, attrs):
        # ensure comment is provided only when creating (POST), not when updating (PATCH)
        request = self.context.get("request")
        if request and request.method == "POST" and not attrs.get("comment"):
            raise ValidationError({"comment": "This field is required."})
        return attrs

    def create(self, validated_data):
        # set the user from request context if available
        request = self.context.get("request")
        user = getattr(request, "user", None)
        if user and user.is_authenticated:
            validated_data["user"] = user
        return super().create(validated_data)

    def get_likes_count(self, obj):
        # prefer annotated value (from queryset) to avoid extra queries and avoid colliding with model property
        return getattr(obj, "annotated_likes_count", getattr(obj, "likes_count", 0))

    def get_has_liked(self, obj):
        request = self.context.get("request")
        user = getattr(request, "user", None)
        # if annotated flag exists (boolean), use it; otherwise fall back to model method
        annotated = getattr(obj, "annotated_has_liked", None)
        if annotated is not None:
            return bool(annotated)
        if user and user.is_authenticated:
            return obj.has_liked(user)
        return False

class LikeSerializer(DateTimeFormattingMixin, serializers.ModelSerializer):
    """Serializer for Like model used across views that expose likes info."""
    user = UserSerializer(read_only=True)
    content_type = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Like
        fields = ("id", "user", "content_type", "object_id", "created_at")

    def get_content_type(self, obj):
        try:
            return obj.content_type.model if obj.content_type else None
        except Exception:
            return None
        
class VideoCategorySerializer(DateTimeFormattingMixin, AbsoluteURLSerializer):
    datetime_fields = ("created_at", "updated_at")
    class Meta:
        model = VideoCategory
        fields = "__all__"
        
class PostCategorySerializer(DateTimeFormattingMixin, AbsoluteURLSerializer):
    datetime_fields = ("created_at", "updated_at")
    class Meta:
        model = PostCategory
        fields = "__all__"
                
class EventCategorySerializer(DateTimeFormattingMixin, AbsoluteURLSerializer):
    datetime_fields = ("created_at", "updated_at")
    class Meta:
        model = EventCategory
        fields = "__all__"
        
class ContentCategorySerializer(DateTimeFormattingMixin, AbsoluteURLSerializer):
    datetime_fields = ("created_at", "updated_at")
    class Meta:
        model = ContentCategory
        fields = "__all__"

class EventSectionSerializer(DateTimeFormattingMixin, AbsoluteURLSerializer):
    datetime_fields = ("created_at", "updated_at")
    class Meta:
        model = EventSection
        fields = "__all__"
        
class PositionTeamMemberSerializer(DateTimeFormattingMixin, AbsoluteURLSerializer):
    datetime_fields = ("created_at", "updated_at")
    class Meta:
        model = PositionTeamMember
        fields = ["id", "name", "description"]
        
class SeasonTitleSerializer(DateTimeFormattingMixin, AbsoluteURLSerializer):
    datetime_fields = ("created_at", "updated_at")
    class Meta:
        model = SeasonTitle
        fields = "__all__"

class SeasonIdSerializer(DateTimeFormattingMixin, AbsoluteURLSerializer):
    datetime_fields = ("created_at", "updated_at")
    season_title_detail = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = SeasonId
        fields = "__all__"

    def get_season_title_detail(self, obj):
        try:
            st = obj.season_title
            if st is None:
                return None
            return {"id": st.pk, "name": st.name}
        except Exception:
            return None

class CommentsSerializer(DateTimeFormattingMixin, serializers.ModelSerializer):
    """Serializer for comments with nested replies info."""
    user = UserSerializer(read_only=True)
    replies = ReplySerializer(many=True, read_only=True)
    content_type = serializers.CharField(write_only=True, required=False)
    likes_count = serializers.SerializerMethodField(read_only=True)
    has_liked = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Comments
        fields = (
            "id",
            "user",
            "text",
            "created_at",
            "replies",
            "content_type",
            "object_id",
            "likes_count",
            "has_liked",
        )

    def to_representation(self, instance):
        data = super().to_representation(instance)
        # represent content_type as its model name
        try:
            data["content_type"] = instance.content_type.model
        except Exception:
            data["content_type"] = None
        return data

    def get_likes_count(self, obj):
        return getattr(obj, "annotated_likes_count", getattr(obj, "likes_count", 0))

    def get_has_liked(self, obj):
        request = self.context.get("request")
        user = getattr(request, "user", None)
        annotated = getattr(obj, "annotated_has_liked", None)
        if annotated is not None:
            return bool(annotated)
        if user and user.is_authenticated:
            return obj.has_liked(user)
        return False

    def validate(self, attrs):
        # 'content_type' is required only when creating (POST), not when updating (PATCH)
        request = self.context.get("request")
        if request and request.method == "POST":
            content_type_name = self.initial_data.get("content_type")
            if not content_type_name:
                raise ValidationError({"content_type": "This field is required."})

            # allow shorthand 'content' to mean the Post model in the content app
            ct_lookup_name = content_type_name.strip().lower()
            if ct_lookup_name in ("content", "post", "posts"):
                try:
                    ct = ContentType.objects.get(app_label__iexact="content", model__iexact="post")
                except ContentType.DoesNotExist:
                    raise ValidationError({"content_type": "Post content type not found in ContentType table."})
            else:
                try:
                    ct = ContentType.objects.get(model__iexact=content_type_name)
                except ContentType.DoesNotExist:
                    raise ValidationError({"content_type": f"ContentType with name '{content_type_name}' does not exist."})

            attrs["content_type"] = ct

            # ensure object_id exists on that model
            obj_id = attrs.get("object_id") or self.initial_data.get("object_id")
            if obj_id is None:
                raise ValidationError({"object_id": "This field is required."})

            model_cls = ct.model_class()
            if model_cls is None:
                raise ValidationError({"content_type": "Invalid content type."})

            try:
                model_cls.objects.get(pk=obj_id)
            except model_cls.DoesNotExist:
                raise ValidationError({"object_id": f"Object with id {obj_id} not found for content_type {content_type_name}."})
        
        return attrs

    def create(self, validated_data):
        # set the user from request context if available
        request = self.context.get("request")
        user = getattr(request, "user", None)
        if user and user.is_authenticated:
            validated_data["user"] = user
        return super().create(validated_data)

class VideoSerializer(DateTimeFormattingMixin, AbsoluteURLSerializer):
    """Serializer for Video model with absolute URL handling for file fields."""
    datetime_fields = ("happened_at", "created_at", "updated_at")
    category = serializers.PrimaryKeyRelatedField(queryset=VideoCategory.objects.all(), write_only=True, required=False)
    season_name = serializers.PrimaryKeyRelatedField(queryset=SeasonId.objects.all(), write_only=True, required=False)
    comments = CommentsSerializer(many=True, read_only=True)
    likes_count = serializers.SerializerMethodField(read_only=True)
    has_liked = serializers.SerializerMethodField(read_only=True)
    has_in_my_list = serializers.SerializerMethodField(read_only=True)
    user = serializers.SerializerMethodField(read_only=True)
    class Meta:
        model = Video
        fields = "__all__"
        file_fields = ("thumbnail",)
    
    def to_representation(self, instance):
        data = super().to_representation(instance)
        data["category"] = VideoCategorySerializer(instance.category, context=self.context).data if instance.category else None
        data["season_name"] = SeasonIdSerializer(instance.season_name, context=self.context).data if instance.season_name else None
        data["likes_count"] = getattr(instance, "annotated_likes_count", getattr(instance, "likes_count", 0))
        request = self.context.get("request")
        user = getattr(request, "user", None)
        annotated = getattr(instance, "annotated_has_liked", None)
        data["has_liked"] = bool(annotated) if annotated is not None else (instance.has_liked(user) if user and user.is_authenticated else False)
        # has_in_my_list indicates if the requesting user has saved this video
        try:
            if user and user.is_authenticated:
                data["has_in_my_list"] = MyListEntry.objects.filter(user=user, video=instance).exists()
            else:
                data["has_in_my_list"] = False
        except Exception:
            data["has_in_my_list"] = False
        return data
    
    def get_likes_count(self, obj):
        return getattr(obj, "likes_count", 0)

    def get_has_liked(self, obj):
        request = self.context.get("request")
        user = getattr(request, "user", None)
        if user and user.is_authenticated:
            return obj.has_liked(user)
        return False

    def get_has_in_my_list(self, obj):
        request = self.context.get("request")
        user = getattr(request, "user", None)
        if not user or not user.is_authenticated:
            return False
        try:
            return MyListEntry.objects.filter(user=user, video=obj).exists()
        except Exception:
            return False
        
    def get_user(self, obj):
        try:
            target = _resolve_target_user(obj)
            if target:
                return UserSerializer(target, context=self.context).data
        except Exception:
            pass
        return None
class PostSerializer(DateTimeFormattingMixin, AbsoluteURLSerializer):
    """Serializer for Post model with absolute URL handling for file fields."""
    datetime_fields = ("created_at", "updated_at")
    category = serializers.PrimaryKeyRelatedField(queryset=PostCategory.objects.all(), write_only=True, required=False)
    comments = CommentsSerializer(many=True, read_only=True)
    likes_count = serializers.SerializerMethodField(read_only=True)
    has_liked = serializers.SerializerMethodField(read_only=True)
    average_rating = serializers.SerializerMethodField(read_only=True)
    rating_count = serializers.SerializerMethodField(read_only=True)
    user_rating = serializers.SerializerMethodField(read_only=True)
    user = serializers.SerializerMethodField(read_only=True)
    class Meta:
        model = Post
        fields = "__all__"

    def to_representation(self, instance):
        data = super().to_representation(instance)
        data["category"] = PostCategorySerializer(instance.category, context=self.context).data if instance.category else None
        data["comments"] = CommentsSerializer(instance.comments.all(), many=True, context=self.context).data
        data["likes_count"] = getattr(instance, "annotated_likes_count", getattr(instance, "likes_count", 0))
        request = self.context.get("request")
        user = getattr(request, "user", None)
        annotated = getattr(instance, "annotated_has_liked", None)
        data["has_liked"] = bool(annotated) if annotated is not None else (instance.has_liked(user) if user and user.is_authenticated else False)
        # ratings: average, count, and the requesting user's rating (if any)
        try:
            avg = getattr(instance, 'annotated_rating_avg', None)
            count = getattr(instance, 'annotated_rating_count', None)
            if avg is None or count is None:
                from django.db.models import Avg, Count
                agg = PostRating.objects.filter(post=instance).aggregate(avg=Avg('rating'), count=Count('id'))
                avg = agg.get('avg')
                count = agg.get('count')
            data['average_rating'] = round(avg, 2) if avg is not None else None
            data['rating_count'] = int(count or 0)
        except Exception:
            data['average_rating'] = None
            data['rating_count'] = 0

        try:
            if user and user.is_authenticated:
                pr = PostRating.objects.filter(post=instance, user=user).first()
                data['user_rating'] = pr.rating if pr else None
            else:
                data['user_rating'] = None
        except Exception:
            data['user_rating'] = None
        return data
    def get_likes_count(self, obj):
        return getattr(obj, "likes_count", 0)

    def get_has_liked(self, obj):
        request = self.context.get("request")
        user = getattr(request, "user", None)
        if user and user.is_authenticated:
            return obj.has_liked(user)
        return False
    
    def get_average_rating(self, obj):
        """Return average rating for the post (rounded to 2 decimals) or None."""
        try:
            avg = getattr(obj, 'annotated_rating_avg', None)
            if avg is None:
                from django.db.models import Avg
                agg = PostRating.objects.filter(post=obj).aggregate(avg=Avg('rating'))
                avg = agg.get('avg')
            return round(avg, 2) if avg is not None else None
        except Exception:
            return None

    def get_rating_count(self, obj):
        """Return integer count of ratings for the post."""
        try:
            count = getattr(obj, 'annotated_rating_count', None)
            if count is None:
                from django.db.models import Count
                agg = PostRating.objects.filter(post=obj).aggregate(count=Count('id'))
                count = agg.get('count')
            return int(count or 0)
        except Exception:
            return 0

    def get_user_rating(self, obj):
        """Return the requesting user's rating for the post, or None."""
        request = self.context.get('request')
        user = getattr(request, 'user', None)
        if not user or not user.is_authenticated:
            return None
        try:
            pr = PostRating.objects.filter(post=obj, user=user).first()
            return pr.rating if pr else None
        except Exception:
            return None

    def get_user(self, obj):
        """Return the user associated with the post, or None."""
        request = self.context.get('request')
        user = getattr(request, 'user', None)
        if not user or not user.is_authenticated:
            return None
        try:
            return UserSerializer(user, context=self.context).data
        except Exception:
            return None

class ContentSerializer(DateTimeFormattingMixin, AbsoluteURLSerializer):
    """Serializer for Content model with absolute URL handling for file fields."""
    datetime_fields = ("created_at", "updated_at")
    category = serializers.PrimaryKeyRelatedField(queryset=ContentCategory.objects.all(), write_only=True, required=False)
    comments = CommentsSerializer(many=True, read_only=True)
    likes_count = serializers.SerializerMethodField(read_only=True)
    has_liked = serializers.SerializerMethodField(read_only=True)
    user = serializers.SerializerMethodField(read_only=True)
    class Meta:
        model = Content
        fields = "__all__"
        file_fields = ("image",)

    def to_representation(self, instance):
        data = super().to_representation(instance)
        data["category"] = ContentCategorySerializer(instance.category, context=self.context).data if instance.category else None
        # include comments for models that have GenericRelation
        try:
            data["comments"] = CommentsSerializer(instance.comments.all(), many=True, context=self.context).data
        except Exception:
            data["comments"] = []
        data["likes_count"] = getattr(instance, "annotated_likes_count", getattr(instance, "likes_count", 0))
        request = self.context.get("request")
        user = getattr(request, "user", None)
        annotated = getattr(instance, "annotated_has_liked", None)
        data["has_liked"] = bool(annotated) if annotated is not None else (instance.has_liked(user) if user and user.is_authenticated else False)
        return data

    def get_likes_count(self, obj):
        return getattr(obj, "likes_count", 0)

    def get_has_liked(self, obj):
        request = self.context.get("request")
        user = getattr(request, "user", None)
        if user and user.is_authenticated:
            return obj.has_liked(user)
        return False
    
    def get_user(self, obj):
        try:
            target = _resolve_target_user(obj)
            if target:
                return UserSerializer(target, context=self.context).data
        except Exception:
            pass
        return None
    
class EventSerializer(DateTimeFormattingMixin, AbsoluteURLSerializer):
    datetime_fields = ("start_time", "end_time", "created_at", "updated_at")
    category = serializers.PrimaryKeyRelatedField(queryset=EventCategory.objects.all(), write_only=True, required=False)
    comments = CommentsSerializer(many=True, read_only=True)
    likes_count = serializers.SerializerMethodField(read_only=True)
    has_liked = serializers.SerializerMethodField(read_only=True)
    section = serializers.PrimaryKeyRelatedField(queryset=EventSection.objects.all(), write_only=True, required=False)
    user = serializers.SerializerMethodField(read_only=True)
    class Meta:
        model = Event
        fields = "__all__"
        file_fields = ("image",)

    def to_representation(self, instance):
        data = super().to_representation(instance)
        data["category"] = EventCategorySerializer(instance.category, context=self.context).data if instance.category else None
        data["section"] = EventSectionSerializer(instance.section, context=self.context).data if instance.section else None
        # include comments for models that have GenericRelation
        try:
            data["comments"] = CommentsSerializer(instance.comments.all(), many=True, context=self.context).data
        except Exception:
            data["comments"] = []
        data["likes_count"] = getattr(instance, "annotated_likes_count", getattr(instance, "likes_count", 0))
        request = self.context.get("request")
        user = getattr(request, "user", None)
        annotated = getattr(instance, "annotated_has_liked", None)
        data["has_liked"] = bool(annotated) if annotated is not None else (instance.has_liked(user) if user and user.is_authenticated else False)
        return data
    def get_likes_count(self, obj):
        return getattr(obj, "likes_count", 0)

    def get_has_liked(self, obj):
        request = self.context.get("request")
        user = getattr(request, "user", None)
        if user and user.is_authenticated:
            return obj.has_liked(user)
        return False
    
    def get_user(self, obj):
        try:
            target = _resolve_target_user(obj)
            if target:
                return UserSerializer(target, context=self.context).data
        except Exception:
            pass
        return None
class WeeklyMomentSerializer(DateTimeFormattingMixin, AbsoluteURLSerializer):
    datetime_fields = ("start_time", "created_at", "updated_at")
    user = serializers.SerializerMethodField(read_only=True)
    class Meta:
        model = WeeklyMoment
        fields = "__all__"
        file_fields = ("image",)

    def get_user(self, obj):
        try:
            target = _resolve_target_user(obj)
            if target:
                return UserSerializer(target, context=self.context).data
        except Exception:
            pass
        return None

class TeamMemberSerializer(DateTimeFormattingMixin, AbsoluteURLSerializer):
    datetime_fields = ("created_at", "updated_at")
    position = serializers.PrimaryKeyRelatedField(queryset=PositionTeamMember.objects.all(), write_only=True, required=False)
    user = serializers.SerializerMethodField(read_only=True)
    class Meta:
        model = TeamMember
        fields = "__all__"
        file_fields = ("avatar",)
    def to_representation(self, instance):
        data = super().to_representation(instance)
        data["position"] = PositionTeamMemberSerializer(instance.position, context=self.context).data if instance.position else None
        return data
    def get_user(self, obj):
        try:
            target = _resolve_target_user(obj)
            if target:
                return UserSerializer(target, context=self.context).data
        except Exception:
            pass
        return None


class HistoryEntrySerializer(DateTimeFormattingMixin, AbsoluteURLSerializer):
    datetime_fields = ("story_date", "created_at", "updated_at")
    user = serializers.SerializerMethodField(read_only=True)
    class Meta:
        model = HistoryEntry
        fields = "__all__"
        file_fields = ("image",)
    
    def get_user(self, obj):
        try:
            target = _resolve_target_user(obj)
            if target:
                return UserSerializer(target, context=self.context).data
        except Exception:
            pass
        return None
    
    def to_representation(self, instance):
        data = super().to_representation(instance)
        # include resolved user representation (if present)
        try:
            data["user"] = self.get_user(instance)
        except Exception:
            data["user"] = None
        return data
    
class SocialMediaSerializer(DateTimeFormattingMixin, serializers.ModelSerializer):
    datetime_fields = ("created_at", "updated_at")
    class Meta:
        model = SocialMedia
        fields = "__all__"
        
class NavbarLogoSerializer(DateTimeFormattingMixin, AbsoluteURLSerializer):
    datetime_fields = ("created_at", "updated_at")
    class Meta:
        model = NavbarLogo
        fields = "__all__"