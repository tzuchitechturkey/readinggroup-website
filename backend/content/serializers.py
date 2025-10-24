from rest_framework import serializers
from readinggroup_backend.helpers import DateTimeFormattingMixin

from .models import (
    Event,
    HistoryEntry,
    Post,
    TeamMember,
    TvProgram,
    Video,
    WeeklyMoment,
    VideoCategory,
    PostCategory,
    EventCategory,
    TvProgramCategory,
    PositionTeamMember,
    EventSection,
    TvProgramLike,
    WeeklyMomentLike,
    PostLike,
    VideoLike,
    EventLike,
    PostComment,
    VideoComment,
    TvProgramComment,
    EventComment,
    WeeklyMomentComment,
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

class VideoSerializer(DateTimeFormattingMixin, AbsoluteURLSerializer):
    """Serializer for Video model with absolute URL handling for file fields."""
    datetime_fields = ("happened_at", "created_at", "updated_at")
    category = serializers.PrimaryKeyRelatedField(queryset=VideoCategory.objects.all(), write_only=True, required=False)
    class Meta:
        model = Video
        fields = "__all__"
        file_fields = ("thumbnail",)
    def to_representation(self, instance):
        data = super().to_representation(instance)
        data["category"] = VideoCategorySerializer(instance.category, context=self.context).data if instance.category else None
        return data


class PostSerializer(DateTimeFormattingMixin, AbsoluteURLSerializer):
    """Serializer for Post model with absolute URL handling for file fields."""
    datetime_fields = ("created_at", "updated_at")
    category = serializers.PrimaryKeyRelatedField(queryset=PostCategory.objects.all(), write_only=True, required=False)

    class Meta:
        model = Post
        fields = "__all__"
        extra_fields = ["category_obj"]

    def to_representation(self, instance):
        data = super().to_representation(instance)
        data["category"] = PostCategorySerializer(instance.category, context=self.context).data if instance.category else None
        return data

class EventSerializer(DateTimeFormattingMixin, AbsoluteURLSerializer):
    datetime_fields = ("start_time", "end_time", "created_at", "updated_at")
    category = serializers.PrimaryKeyRelatedField(queryset=EventCategory.objects.all(), write_only=True, required=False)
    section = serializers.PrimaryKeyRelatedField(queryset=EventSection.objects.all(), write_only=True, required=False)
    class Meta:
        model = Event
        fields = "__all__"
        file_fields = ("image",)
        
    def to_representation(self, instance):
        data = super().to_representation(instance)
        data["category"] = EventCategorySerializer(instance.category, context=self.context).data if instance.category else None
        data["section"] = EventSectionSerializer(instance.section, context=self.context).data if instance.section else None
        return data

class TvProgramSerializer(DateTimeFormattingMixin, AbsoluteURLSerializer):
    datetime_fields = ("air_date", "created_at", "updated_at")
    category = serializers.PrimaryKeyRelatedField(queryset=TvProgramCategory.objects.all(), write_only=True, required=False)

    class Meta:
        model = TvProgram
        fields = "__all__"
        file_fields = ("image",)
        
    def to_representation(self, instance):
        data = super().to_representation(instance)
        data["category"] = TvProgramCategorySerializer(instance.category, context=self.context).data if instance.category else None
        return data

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
        
class PostLikeSerializer(DateTimeFormattingMixin, AbsoluteURLSerializer):
    datetime_fields = ("created_at", "updated_at")
    class Meta:
        model = PostLike
        fields = "__all__"
        
class VideoLikeSerializer(DateTimeFormattingMixin, AbsoluteURLSerializer):
    datetime_fields = ("created_at", "updated_at")
    class Meta:
        model = VideoLike
        fields = "__all__"
        
class EventLikeSerializer(DateTimeFormattingMixin, AbsoluteURLSerializer):
    datetime_fields = ("created_at", "updated_at")
    class Meta:
        model = EventLike
        fields = "__all__"
        
class TvProgramLikeSerializer(DateTimeFormattingMixin, AbsoluteURLSerializer):
    datetime_fields = ("created_at", "updated_at")
    class Meta:
        model = TvProgramLike
        fields = "__all__"
        
class WeeklyMomentLikeSerializer(DateTimeFormattingMixin, AbsoluteURLSerializer):
    datetime_fields = ("created_at", "updated_at")
    class Meta:
        model = WeeklyMomentLike
        fields = "__all__"
        
class TvProgramLikeSerializer(DateTimeFormattingMixin, AbsoluteURLSerializer):
    datetime_fields = ("created_at", "updated_at")
    class Meta:
        model = TvProgramLike
        fields = "__all__"
        
class PostCommentSerializer(DateTimeFormattingMixin, AbsoluteURLSerializer):
    datetime_fields = ("created_at", "updated_at")
    class Meta:
        model = PostComment
        fields = "__all__"
        
class VideoCommentSerializer(DateTimeFormattingMixin, AbsoluteURLSerializer):
    datetime_fields = ("created_at", "updated_at")
    class Meta:
        model = VideoComment
        fields = "__all__"
    
class TvProgramCommentSerializer(DateTimeFormattingMixin, AbsoluteURLSerializer):
    datetime_fields = ("created_at", "updated_at")
    class Meta:
        model = TvProgramComment
        fields = "__all__"
        
class EventCommentSerializer(DateTimeFormattingMixin, AbsoluteURLSerializer):
    datetime_fields = ("created_at", "updated_at")
    class Meta:
        model = EventComment
        fields = "__all__"
        
class WeeklyMomentCommentSerializer(DateTimeFormattingMixin, AbsoluteURLSerializer):
    datetime_fields = ("created_at", "updated_at")
    class Meta:
        model = WeeklyMomentComment
        fields = "__all__"