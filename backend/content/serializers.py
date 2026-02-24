from accounts.serializers import UserSerializer
from django.conf import settings
from django.contrib.contenttypes.models import ContentType
from readinggroup_backend.helpers import DateTimeFormattingMixin
from rest_framework import serializers
from rest_framework.exceptions import ValidationError

from .helpers import AbsoluteURLSerializer, get_account_user
from .youtube import YouTubeAPIError, fetch_video_info
from .models import (
    Content,
    ContentCategory,
    ContentImage,
    ContentAttachment,
    Event,
    EventCategory,
    EventSection,
    HistoryEntry,
    MyListEntry,
    NavbarLogo,
    PositionTeamMember,
    Learn,
    LearnCategory,
    SeasonId,
    SeasonTitle,
    SocialMedia,
    TeamMember,
    Video,
    VideoCategory,
    Authors,
    BookCategory,
    Book,
)


class BookCategorySerializer(DateTimeFormattingMixin, AbsoluteURLSerializer):
    datetime_fields = ("created_at", "updated_at")
    book_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = BookCategory
        fields = "__all__"


class VideoCategorySerializer(DateTimeFormattingMixin, AbsoluteURLSerializer):
    datetime_fields = ("created_at", "updated_at")
    video_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = VideoCategory
        fields = "__all__"


class LearnCategorySerializer(DateTimeFormattingMixin, AbsoluteURLSerializer):
    datetime_fields = ("created_at", "updated_at")
    learn_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = LearnCategory
        fields = "__all__"


class EventCategorySerializer(DateTimeFormattingMixin, AbsoluteURLSerializer):
    datetime_fields = ("created_at", "updated_at")
    event_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = EventCategory
        fields = "__all__"


class ContentCategorySerializer(DateTimeFormattingMixin, AbsoluteURLSerializer):
    datetime_fields = ("created_at", "updated_at")
    content_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = ContentCategory
        fields = "__all__"


class EventSectionSerializer(DateTimeFormattingMixin, AbsoluteURLSerializer):
    datetime_fields = ("created_at", "updated_at")

    class Meta:
        model = EventSection
        fields = "__all__"


class ContentImageSerializer(DateTimeFormattingMixin, AbsoluteURLSerializer):
    """Serializer for the per-Content image rows (file + url + caption)."""

    datetime_fields = ("created_at", "updated_at")

    class Meta:
        model = ContentImage
        fields = ("id", "image", "image_url", "caption", "created_at", "updated_at")
        file_fields = ("image",)


class ContentAttachmentSerializer(DateTimeFormattingMixin, AbsoluteURLSerializer):
    """Serializer for Content file attachments (documents, PDFs, etc)."""

    datetime_fields = ("created_at", "updated_at")

    class Meta:
        model = ContentAttachment
        fields = (
            "id",
            "file",
            "file_name",
            "file_size",
            "description",
            "created_at",
            "updated_at",
        )
        file_fields = ("file",)


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
    # allow writing by primary key and represent as object in output
    season_title = serializers.PrimaryKeyRelatedField(
        queryset=SeasonTitle.objects.all()
    )

    class Meta:
        model = SeasonId
        fields = "__all__"

    def to_representation(self, instance):
        data = super().to_representation(instance)
        # replace season_title pk with detailed object
        try:
            st = instance.season_title
            data["season_title"] = (
                {"id": st.pk, "name": st.name} if st is not None else None
            )
        except Exception:
            data["season_title"] = None
        return data


class VideoSerializer(DateTimeFormattingMixin, AbsoluteURLSerializer):
    """Serializer for Video model with absolute URL handling for file fields."""

    datetime_fields = ("happened_at", "created_at", "updated_at")
    category = serializers.PrimaryKeyRelatedField(
        queryset=VideoCategory.objects.all(), write_only=True, required=False
    )
    season_name = serializers.PrimaryKeyRelatedField(
        queryset=SeasonId.objects.all(), write_only=True, required=False
    )
    has_in_my_list = serializers.SerializerMethodField(read_only=True)
    user = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Video
        fields = "__all__"
        file_fields = ("thumbnail",)

    def create(self, validated_data):
        youtube_url = validated_data.get("video_url")
        api_key = getattr(settings, "YOUTUBE_API_KEY", None)
        should_enrich = bool(youtube_url and api_key)

        if should_enrich:
            try:
                info = fetch_video_info(youtube_url, api_key)
            except YouTubeAPIError:
                info = None
            else:
                if not validated_data.get("title"):
                    validated_data["title"] = info.title
                if not validated_data.get("description"):
                    validated_data["description"] = info.description
                if not validated_data.get("duration"):
                    validated_data["duration"] = info.duration_formatted
                if not validated_data.get("language") and info.default_language:
                    validated_data["language"] = info.default_language
                if not validated_data.get("reference_code"):
                    validated_data["reference_code"] = info.video_id
                if not validated_data.get("thumbnail_url"):
                    thumbnails = info.thumbnails or {}
                    preferred_order = (
                        "maxres",
                        "high",
                        "medium",
                        "standard",
                        "default",
                    )
                    thumb_url = next(
                        (
                            thumbnails[size]["url"]
                            for size in preferred_order
                            if thumbnails.get(size) and thumbnails[size].get("url")
                        ),
                        None,
                    )
                    if thumb_url:
                        validated_data["thumbnail_url"] = thumb_url

        return super().create(validated_data)

    def to_representation(self, instance):
        data = super().to_representation(instance)
        data["category"] = (
            VideoCategorySerializer(instance.category, context=self.context).data
            if instance.category
            else None
        )
        data["season_name"] = (
            SeasonIdSerializer(instance.season_name, context=self.context).data
            if instance.season_name
            else None
        )
        request = self.context.get("request")
        user = getattr(request, "user", None)
        # has_in_my_list indicates if the requesting user has saved this video
        try:
            if user and user.is_authenticated:
                data["has_in_my_list"] = MyListEntry.objects.filter(
                    user=user, video=instance
                ).exists()
            else:
                data["has_in_my_list"] = False
        except Exception:
            data["has_in_my_list"] = False
        return data

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
            target = get_account_user(obj)
            if target:
                return UserSerializer(target, context=self.context).data
        except Exception:
            pass
        return None


class LearnSerializer(DateTimeFormattingMixin, AbsoluteURLSerializer):
    """Serializer for Learn model with absolute URL handling for file fields."""

    datetime_fields = ("created_at", "updated_at")
    category = serializers.PrimaryKeyRelatedField(
        queryset=LearnCategory.objects.all(), write_only=True, required=False
    )

    class Meta:
        model = Learn
        fields = "__all__"

    def to_representation(self, instance):
        data = super().to_representation(instance)
        data["category"] = (
            LearnCategorySerializer(instance.category, context=self.context).data
            if instance.category
            else None
        )
        return data


class ContentSerializer(DateTimeFormattingMixin, AbsoluteURLSerializer):
    """Serializer for Content model with absolute URL handling for file fields."""

    datetime_fields = ("created_at", "updated_at")
    category = serializers.PrimaryKeyRelatedField(
        queryset=ContentCategory.objects.all(), write_only=True, required=False
    )
    user = serializers.SerializerMethodField(read_only=True)
    images = ContentImageSerializer(many=True, read_only=True)
    attachments = serializers.ListField(
        child=serializers.IntegerField(), write_only=True, required=False
    )
    attachments_data = ContentAttachmentSerializer(
        many=True, read_only=True, source="attachments"
    )

    class Meta:
        model = Content
        fields = "__all__"
        file_fields = ("image",)

    def to_representation(self, instance):
        data = super().to_representation(instance)
        data["category"] = (
            ContentCategorySerializer(instance.category, context=self.context).data
            if instance.category
            else None
        )

        # include associated ContentImage rows as `images` for slider support
        try:
            data["images"] = ContentImageSerializer(
                instance.images.all(), many=True, context=self.context
            ).data
        except Exception:
            # fall back to empty list if anything goes wrong
            data["images"] = []
        return data

    def get_user(self, obj):
        try:
            target = get_account_user(obj)
            if target:
                return UserSerializer(target, context=self.context).data
        except Exception:
            pass
        return None

    def create(self, validated_data):
        """Handle creation with attachments field."""
        attachments_ids = validated_data.pop("attachments", [])
        instance = super().create(validated_data)

        if attachments_ids:
            attachment_instances = ContentAttachment.objects.filter(
                id__in=attachments_ids
            )
            instance.attachments.set(attachment_instances)

        return instance

    def update(self, instance, validated_data):
        """Handle update with attachments field."""
        attachments_ids = validated_data.pop("attachments", None)
        instance = super().update(instance, validated_data)

        if attachments_ids is not None:
            attachment_instances = ContentAttachment.objects.filter(
                id__in=attachments_ids
            )
            instance.attachments.set(attachment_instances)

        return instance


class BookSerializer(DateTimeFormattingMixin, AbsoluteURLSerializer):
    datetime_fields = ("created_at", "updated_at")
    category = serializers.PrimaryKeyRelatedField(
        queryset=BookCategory.objects.all(), write_only=True, required=False
    )

    class Meta:
        model = Book
        fields = "__all__"

    def to_representation(self, instance):
        data = super().to_representation(instance)
        data["category"] = (
            BookCategorySerializer(instance.category, context=self.context).data
            if instance.category
            else None
        )
        return data


class EventSerializer(DateTimeFormattingMixin, AbsoluteURLSerializer):
    datetime_fields = ("start_time", "end_time", "created_at", "updated_at")
    category = serializers.PrimaryKeyRelatedField(
        queryset=EventCategory.objects.all(), write_only=True, required=False
    )
    section = serializers.PrimaryKeyRelatedField(
        queryset=EventSection.objects.all(), write_only=True, required=False
    )
    user = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Event
        fields = "__all__"
        file_fields = ("image",)

    def to_representation(self, instance):
        data = super().to_representation(instance)
        data["category"] = (
            EventCategorySerializer(instance.category, context=self.context).data
            if instance.category
            else None
        )
        data["section"] = (
            EventSectionSerializer(instance.section, context=self.context).data
            if instance.section
            else None
        )
        return data

    def get_user(self, obj):
        try:
            target = get_account_user(obj)
            if target:
                return UserSerializer(target, context=self.context).data
        except Exception:
            pass
        return None


class TeamMemberSerializer(DateTimeFormattingMixin, AbsoluteURLSerializer):
    datetime_fields = ("created_at", "updated_at")
    position = serializers.PrimaryKeyRelatedField(
        queryset=PositionTeamMember.objects.all(), write_only=True, required=False
    )
    user = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = TeamMember
        fields = "__all__"
        file_fields = ("avatar",)

    def to_representation(self, instance):
        data = super().to_representation(instance)
        data["position"] = (
            PositionTeamMemberSerializer(instance.position, context=self.context).data
            if instance.position
            else None
        )
        return data

    def get_user(self, obj):
        try:
            target = get_account_user(obj)
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
            target = get_account_user(obj)
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


class AuthorsSerializer(DateTimeFormattingMixin, AbsoluteURLSerializer):
    datetime_fields = ("created_at", "updated_at")

    class Meta:
        model = Authors
        fields = "__all__"
