from rest_framework import serializers

from .models import (
    Event,
    HistoryEntry,
    MediaCard,
    Post,
    TeamMember,
    TvProgram,
    Video,
    WeeklyMoment,
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


class VideoSerializer(AbsoluteURLSerializer):
    """Serializer for Video model with absolute URL handling for file fields."""
    class Meta:
        model = Video
        fields = (
            "id",
            "title",
            "duration",
            "category",
            "video_type",
            "subject",
            "language",
            "thumbnail",
            "thumbnail_url",
            "views",
            "published_at",
            "featured",
            "is_new",
            "reference_code",
            "video_url",
            "created_at",
            "updated_at",
        )
        read_only_fields = ("created_at", "updated_at")
        file_fields = ("thumbnail",)


class PostSerializer(AbsoluteURLSerializer):
    """Serializer for Post model with absolute URL handling for file fields."""
    class Meta:
        model = Post
        fields = (
            "id",
            "title",
            "subtitle",
            "excerpt",
            "body",
            "writer",
            "writer_avatar",
            "category",
            "status",
            "is_active",
            "views",
            "read_time",
            "tags",
            "published_at",
            "created_at",
            "updated_at",
        )
        read_only_fields = ("created_at", "updated_at")

class EventSerializer(AbsoluteURLSerializer):
    class Meta:
        model = Event
        fields = (
            "id",
            "title",
            "author",
            "date",
            "image",
            "image_url",
            "category",
            "report_type",
            "country",
            "language",
            "duration_minutes",
            "section",
            "summary",
            "created_at",
            "updated_at",
        )
        read_only_fields = ("created_at", "updated_at")
        file_fields = ("image",)


class MediaCardSerializer(AbsoluteURLSerializer):
    class Meta:
        model = MediaCard
        fields = (
            "id",
            "title",
            "description",
            "theme",
            "language",
            "kind",
            "card_type",
            "image",
            "image_url",
            "cover_image",
            "cover_image_url",
            "metadata",
            "created_at",
            "updated_at",
        )
        read_only_fields = ("created_at", "updated_at")
        file_fields = ("image", "cover_image")


class TvProgramSerializer(AbsoluteURLSerializer):
    class Meta:
        model = TvProgram
        fields = (
            "id",
            "title",
            "description",
            "air_date",
            "image",
            "image_url",
            "writer",
            "category",
            "is_live",
            "created_at",
            "updated_at",
        )
        read_only_fields = ("created_at", "updated_at")
        file_fields = ("image",)


class WeeklyMomentSerializer(AbsoluteURLSerializer):
    class Meta:
        model = WeeklyMoment
        fields = (
            "id",
            "title",
            "start_time",
            "status_label",
            "status_color",
            "content_type",
            "source",
            "language",
            "image",
            "image_url",
            "created_at",
            "updated_at",
        )
        read_only_fields = ("created_at", "updated_at")
        file_fields = ("image",)


class TeamMemberSerializer(AbsoluteURLSerializer):
    class Meta:
        model = TeamMember
        fields = (
            "id",
            "name",
            "position",
            "job_title",
            "description",
            "avatar",
            "avatar_url",
            "social_links",
            "created_at",
            "updated_at",
        )
        read_only_fields = ("created_at", "updated_at")
        file_fields = ("avatar",)


class HistoryEntrySerializer(AbsoluteURLSerializer):
    class Meta:
        model = HistoryEntry
        fields = (
            "id",
            "title",
            "description",
            "story_date",
            "image",
            "image_url",
            "created_at",
            "updated_at",
        )
        read_only_fields = ("created_at", "updated_at")
        file_fields = ("image",)
