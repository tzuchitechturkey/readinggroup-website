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
    Video,
    MyListEntry,
    WeeklyMoment,
    VideoCategory,
    PostCategory,
    EventCategory,
    PositionTeamMember,
    EventSection,
)
from accounts.serializers import UserSerializer


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
    # include nested user info and like metadata
    user = UserSerializer(read_only=True)
    likes_count = serializers.SerializerMethodField(read_only=True)
    has_liked = serializers.SerializerMethodField(read_only=True)
    # accept comment id when creating a reply
    comment = serializers.PrimaryKeyRelatedField(queryset=Comments.objects.all(), required=False)

    class Meta:
        model = Reply
        fields = ("id", "user", "comment", "text", "created_at", "likes_count", "has_liked")

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


class CommentsSerializer(serializers.ModelSerializer):
    """Serializer for comments with nested replies info."""
    user = UserSerializer(read_only=True)
    replies = ReplySerializer(many=True, read_only=True)
    content_type = serializers.CharField(write_only=True, required=False)
    likes_count = serializers.SerializerMethodField(read_only=True)
    has_liked = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Comments
        fields = ("id", "user", "text", "created_at", "replies", "content_type", "object_id", "likes_count", "has_liked")

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
    # nested comments info
    comments = CommentsSerializer(many=True, read_only=True)
    likes_count = serializers.SerializerMethodField(read_only=True)
    has_liked = serializers.SerializerMethodField(read_only=True)
    has_in_my_list = serializers.SerializerMethodField(read_only=True)
    class Meta:
        model = Video
        fields = "__all__"
        file_fields = ("thumbnail",)
    
    def to_representation(self, instance):
        data = super().to_representation(instance)
        data["category"] = VideoCategorySerializer(instance.category, context=self.context).data if instance.category else None
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


class PostSerializer(DateTimeFormattingMixin, AbsoluteURLSerializer):
    """Serializer for Post model with absolute URL handling for file fields."""
    datetime_fields = ("created_at", "updated_at")
    category = serializers.PrimaryKeyRelatedField(queryset=PostCategory.objects.all(), write_only=True, required=False)
    comments = CommentsSerializer(many=True, read_only=True)
    likes_count = serializers.SerializerMethodField(read_only=True)
    has_liked = serializers.SerializerMethodField(read_only=True)
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
        return data

    def get_likes_count(self, obj):
        return getattr(obj, "likes_count", 0)

    def get_has_liked(self, obj):
        request = self.context.get("request")
        user = getattr(request, "user", None)
        if user and user.is_authenticated:
            return obj.has_liked(user)
        return False

class EventSerializer(DateTimeFormattingMixin, AbsoluteURLSerializer):
    datetime_fields = ("start_time", "end_time", "created_at", "updated_at")
    category = serializers.PrimaryKeyRelatedField(queryset=EventCategory.objects.all(), write_only=True, required=False)
    # nested comments
    comments = CommentsSerializer(many=True, read_only=True)
    likes_count = serializers.SerializerMethodField(read_only=True)
    has_liked = serializers.SerializerMethodField(read_only=True)
    section = serializers.PrimaryKeyRelatedField(queryset=EventSection.objects.all(), write_only=True, required=False)
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
    
class WeeklyMomentSerializer(DateTimeFormattingMixin, AbsoluteURLSerializer):
    datetime_fields = ("start_time", "created_at", "updated_at")
    class Meta:
        model = WeeklyMoment
        fields = "__all__"
        file_fields = ("image",)
        
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
        