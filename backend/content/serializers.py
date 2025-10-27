from rest_framework import serializers
from readinggroup_backend.helpers import DateTimeFormattingMixin
from rest_framework.exceptions import ValidationError
from django.contrib.contenttypes.models import ContentType

from .models import (
    Event,
    HistoryEntry,
    Post,
    TeamMember,
    Comments,
    Reply,
    LikeComment,
    TvProgram,
    Video,
    WeeklyMoment,
    VideoCategory,
    PostCategory,
    EventCategory,
    TvProgramCategory,
    PositionTeamMember,
    EventSection,
)


class AbsoluteURLSerializer(serializers.ModelSerializer):
    """Mixin that ensures file fields are returned as absolute URLs."""

    file_fields: tuple[str, ...] = ()

    def _build_absolute_uri(self, path: str | None) -> str | None:
        request = self.context.get("request")
        if request and path:
            return request.build_absolute_uri(path)
        return path

    def to_representation(self, instance):
        data = super().to_representation(instance)
        for field_name in getattr(self.Meta, "file_fields", self.file_fields):
            file_value = getattr(instance, field_name, None)
            if file_value:
                data[field_name] = self._build_absolute_uri(file_value.url)
        return data

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
class TvProgramCategorySerializer(DateTimeFormattingMixin, AbsoluteURLSerializer):
    datetime_fields = ("created_at", "updated_at")
    class Meta:
        model = TvProgramCategory
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


class ReplySerializer(serializers.ModelSerializer):
    """Serializer for reply model attached to comments."""
    user = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = Reply
        fields = ("id", "user", "text", "created_at")


class CommentsSerializer(serializers.ModelSerializer):
    """Serializer for comments with nested replies and like info."""
    user = serializers.StringRelatedField(read_only=True)
    replies = ReplySerializer(many=True, read_only=True)
    likes_count = serializers.SerializerMethodField()
    is_liked = serializers.SerializerMethodField()
    # accept content_type as a model name string on input
    content_type = serializers.CharField(write_only=True)

    class Meta:
        model = Comments
        fields = ("id", "user", "text", "created_at", "likes_count", "is_liked", "replies", "content_type", "object_id")

    def get_likes_count(self, obj):
        # reverse related name on LikeComment is 'likes'
        return obj.likes.count()

    def get_is_liked(self, obj):
        request = self.context.get("request")
        user = request.user if request else None
        if user and user.is_authenticated:
            return LikeComment.objects.filter(comment=obj, user=user).exists()
        return False

    def to_representation(self, instance):
        data = super().to_representation(instance)
        # represent content_type as its model name
        try:
            data["content_type"] = instance.content_type.model
        except Exception:
            data["content_type"] = None
        return data

    def validate(self, attrs):
        # 'content_type' arrives as a model name string; convert to ContentType
        ct_name = self.initial_data.get("content_type")
        if not ct_name:
            raise ValidationError({"content_type": "This field is required."})

        # allow shorthand 'content' to mean the Post model in the content app
        ct_lookup_name = ct_name.strip().lower()
        if ct_lookup_name in ("content", "post", "posts"):
            try:
                ct = ContentType.objects.get(app_label__iexact="content", model__iexact="post")
            except ContentType.DoesNotExist:
                raise ValidationError({"content_type": "Post content type not found in ContentType table."})
        else:
            try:
                ct = ContentType.objects.get(model__iexact=ct_name)
            except ContentType.DoesNotExist:
                raise ValidationError({"content_type": f"ContentType with name '{ct_name}' does not exist."})

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
            raise ValidationError({"object_id": f"Object with id {obj_id} not found for content_type {ct_name}."})

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
    # nested comments and likes info
    comments = CommentsSerializer(many=True, read_only=True)
    likes_count = serializers.SerializerMethodField()
    is_liked = serializers.SerializerMethodField()
    class Meta:
        model = Video
        fields = "__all__"
        file_fields = ("thumbnail",)
        extra_fields = ["is_liked"]
        
    def get_is_liked(self, obj):
        user = self.context.get("request").user if self.context.get("request") else None
        if user and user.is_authenticated:
            likes_rel = getattr(obj, "likes", None)
            if likes_rel is not None:
                return likes_rel.filter(user=user).exists()
        return False
    def get_likes_count(self, obj):
        return obj.likes.count()
    
    def to_representation(self, instance):
        data = super().to_representation(instance)
        data["category"] = VideoCategorySerializer(instance.category, context=self.context).data if instance.category else None
        return data


class PostSerializer(DateTimeFormattingMixin, AbsoluteURLSerializer):
    """Serializer for Post model with absolute URL handling for file fields."""
    datetime_fields = ("created_at", "updated_at")
    category = serializers.PrimaryKeyRelatedField(queryset=PostCategory.objects.all(), write_only=True, required=False)
    # nested comments serialized with CommentsSerializer
    comments = CommentsSerializer(many=True, read_only=True)
    likes_count = serializers.SerializerMethodField()
    is_liked = serializers.SerializerMethodField()
    class Meta:
        model = Post
        fields = "__all__"
        extra_fields = ["is_liked"]

    def get_is_liked(self, obj):
        user = self.context.get("request").user if self.context.get("request") else None
        if user and user.is_authenticated:
            return obj.likes.filter(user=user).exists()
        return False

    def to_representation(self, instance):
        data = super().to_representation(instance)
        data["category"] = PostCategorySerializer(instance.category, context=self.context).data if instance.category else None
        # include nested comments with replies and like info
        data["comments"] = CommentsSerializer(instance.comments.all(), many=True, context=self.context).data
        data["likes_count"] = self.get_likes_count(instance)
        return data

    def get_likes_count(self, obj):
        return obj.likes.count()

class EventSerializer(DateTimeFormattingMixin, AbsoluteURLSerializer):
    datetime_fields = ("start_time", "end_time", "created_at", "updated_at")
    category = serializers.PrimaryKeyRelatedField(queryset=EventCategory.objects.all(), write_only=True, required=False)
    # nested comments and likes
    comments = CommentsSerializer(many=True, read_only=True)
    likes_count = serializers.SerializerMethodField()
    section = serializers.PrimaryKeyRelatedField(queryset=EventSection.objects.all(), write_only=True, required=False)
    is_liked = serializers.SerializerMethodField()

    class Meta:
        model = Event
        fields = "__all__"
        file_fields = ("image",)
        extra_fields = ["is_liked"]

    def get_is_liked(self, obj):
        user = self.context.get("request").user if self.context.get("request") else None
        if user and user.is_authenticated:
            return obj.likes.filter(user=user).exists()
        return False

    def to_representation(self, instance):
        data = super().to_representation(instance)
        data["category"] = EventCategorySerializer(instance.category, context=self.context).data if instance.category else None
        data["section"] = EventSectionSerializer(instance.section, context=self.context).data if instance.section else None
        # include comments and likes count for models that have GenericRelation
        try:
            data["comments"] = CommentsSerializer(instance.comments.all(), many=True, context=self.context).data
        except Exception:
            data["comments"] = []
        data["likes_count"] = self.get_likes_count(instance)
        return data

    def get_likes_count(self, obj):
        likes_rel = getattr(obj, "likes", None)
        return likes_rel.count() if likes_rel is not None else 0

class TvProgramSerializer(DateTimeFormattingMixin, AbsoluteURLSerializer):
    datetime_fields = ("air_date", "created_at", "updated_at")
    category = serializers.PrimaryKeyRelatedField(queryset=TvProgramCategory.objects.all(), write_only=True, required=False)
    # nested comments and likes info
    comments = CommentsSerializer(many=True, read_only=True)
    likes_count = serializers.SerializerMethodField()

    is_liked = serializers.SerializerMethodField()
    class Meta:
        model = TvProgram
        fields = "__all__"
        file_fields = ("image",)
        extra_fields = ["is_liked"]
        
    def get_is_liked(self, obj):
        user = self.context.get("request").user if self.context.get("request") else None
        if user and user.is_authenticated:
            return obj.likes.filter(user=user).exists()
        return False
    def get_likes_count(self, obj):
        return obj.likes.count()
    
    def to_representation(self, instance):
        data = super().to_representation(instance)
        data["category"] = TvProgramCategorySerializer(instance.category, context=self.context).data if instance.category else None
        return data

class WeeklyMomentSerializer(DateTimeFormattingMixin, AbsoluteURLSerializer):
    datetime_fields = ("start_time", "created_at", "updated_at")
    is_liked = serializers.SerializerMethodField()
    class Meta:
        model = WeeklyMoment
        fields = "__all__"
        file_fields = ("image",)
        extra_fields = ["is_liked"]
        
    def get_is_liked(self, obj):
        user = self.context.get("request").user if self.context.get("request") else None
        if user and user.is_authenticated:
            return obj.likes.filter(user=user).exists()
        return False


class TeamMemberSerializer(DateTimeFormattingMixin, AbsoluteURLSerializer):
    datetime_fields = ("created_at", "updated_at")
    position = serializers.PrimaryKeyRelatedField(queryset=PositionTeamMember.objects.all(), write_only=True, required=False)
    class Meta:
        model = TeamMember
        fields = "__all__"
        file_fields = ("avatar",)
        
    def to_representation(self, instance):
        data = super().to_representation(instance)
        data["position"] = PositionTeamMemberSerializer(instance.position, context=self.context).data if instance.position else None
        return data


class HistoryEntrySerializer(DateTimeFormattingMixin, AbsoluteURLSerializer):
    datetime_fields = ("story_date", "created_at", "updated_at")
    class Meta:
        model = HistoryEntry
        fields = "__all__"
        file_fields = ("image",)
        