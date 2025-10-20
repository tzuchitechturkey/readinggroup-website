from rest_framework import serializers
from readinggroup_backend.helpers import DateTimeFormattingMixin

from .models import (
    Event,
    HistoryEntry,
    MediaCard,
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


class VideoSerializer(DateTimeFormattingMixin, AbsoluteURLSerializer):
    """Serializer for Video model with absolute URL handling for file fields."""
    datetime_fields = ("published_at", "created_at", "updated_at")
    class Meta:
        model = Video
        fields = "__all__"
        file_fields = ("thumbnail",)


class PostSerializer(DateTimeFormattingMixin, AbsoluteURLSerializer):
    """Serializer for Post model with absolute URL handling for file fields."""
    datetime_fields = ("published_at", "created_at", "updated_at")
    class Meta:
        model = Post
        fields = "__all__"

class EventSerializer(DateTimeFormattingMixin, AbsoluteURLSerializer):
    datetime_fields = ("start_time", "end_time", "created_at", "updated_at")
    class Meta:
        model = Event
        fields = "__all__"
        file_fields = ("image",)

class MediaCardSerializer(DateTimeFormattingMixin, AbsoluteURLSerializer):
    datetime_fields = ("created_at", "updated_at")
    class Meta:
        model = MediaCard
        fields = "__all__"
        file_fields = ("image", "cover_image")


class TvProgramSerializer(DateTimeFormattingMixin, AbsoluteURLSerializer):
    datetime_fields = ("air_date", "created_at", "updated_at")
    class Meta:
        model = TvProgram
        fields = "__all__"
        file_fields = ("image",)


class WeeklyMomentSerializer(DateTimeFormattingMixin, AbsoluteURLSerializer):
    datetime_fields = ("start_time", "created_at", "updated_at")
    class Meta:
        model = WeeklyMoment
        fields = "__all__"
        file_fields = ("image",)


class TeamMemberSerializer(DateTimeFormattingMixin, AbsoluteURLSerializer):
    datetime_fields = ("created_at", "updated_at")
    class Meta:
        model = TeamMember
        fields = "__all__"
        file_fields = ("avatar",)


class HistoryEntrySerializer(DateTimeFormattingMixin, AbsoluteURLSerializer):
    datetime_fields = ("story_date", "created_at", "updated_at")
    class Meta:
        model = HistoryEntry
        fields = "__all__"
        file_fields = ("image",)

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
        
        
class PositionTeamMemberSerializer(DateTimeFormattingMixin, AbsoluteURLSerializer):
    datetime_fields = ("created_at", "updated_at")
    class Meta:
        model = PositionTeamMember
        fields = ["id", "name", "description"]