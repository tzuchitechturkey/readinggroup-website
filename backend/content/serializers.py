from accounts.serializers import UserSerializer
from django.conf import settings
from .enums import LearnType
from readinggroup_backend.helpers import DateTimeFormattingMixin
from rest_framework import serializers

from .helpers import AbsoluteURLSerializer, get_account_user
from .youtube import YouTubeAPIError, fetch_video_info
from .models import (
    RelatedReportsCategory,
    ContentAttachment,
    PhotoCollection,
    RelatedReports,
    EventCommunity,
    LearnCategory,
    VideoCategory,
    LatestNews,
    LatestNewsImage,
    Video,
    Photo,
    Learn,
    SocialMedia,
    NavbarLogo,
    Authors,
)


class ContentAttachmentSerializer(DateTimeFormattingMixin, AbsoluteURLSerializer):
    """Serializer for Content file attachments (documents, PDFs, etc)."""

    datetime_fields = ("created_at", "updated_at")

    class Meta:
        model = ContentAttachment
        fields = "__all__"
        file_fields = ("file",)


class VideoCategorySerializer(DateTimeFormattingMixin, AbsoluteURLSerializer):
    datetime_fields = ("created_at", "updated_at")
    video_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = VideoCategory
        fields = "__all__"


class LearnCategorySerializer(DateTimeFormattingMixin, AbsoluteURLSerializer):
    datetime_fields = (
        "created_at",
        "updated_at",
        "happened_at",
    )
    learn_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = LearnCategory
        fields = "__all__"


class VideoSerializer(DateTimeFormattingMixin, AbsoluteURLSerializer):
    """Serializer for Video model with absolute URL handling for file fields."""

    datetime_fields = ("happened_at", "created_at", "updated_at")
    attachments = serializers.ListField(
        child=serializers.IntegerField(), write_only=True, required=False
    )
    attachments_data = ContentAttachmentSerializer(
        many=True, read_only=True, source="attachments"
    )
    category = serializers.PrimaryKeyRelatedField(
        queryset=VideoCategory.objects.all(), write_only=True, required=False
    )
    user = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Video
        fields = "__all__"
        file_fields = ("thumbnail",)

    def create(self, validated_data):
        attachments_ids = validated_data.pop("attachments", [])
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

        instance = super().create(validated_data)
        if attachments_ids:
            attachment_instances = ContentAttachment.objects.filter(
                id__in=attachments_ids
            )
            instance.attachments.set(attachment_instances)
        return instance

    def to_representation(self, instance):
        data = super().to_representation(instance)
        data["category"] = (
            VideoCategorySerializer(instance.category, context=self.context).data
            if instance.category
            else None
        )
        # include associated ContentAttachment rows as 'attachments_data'
        try:
            data["attachments_data"] = ContentAttachmentSerializer(
                instance.attachments.all(), many=True, context=self.context
            ).data
        except Exception:
            data["attachments_data"] = []
        return data

    def update(self, instance, validated_data):
        attachments_ids = validated_data.pop("attachments", None)
        instance = super().update(instance, validated_data)
        if attachments_ids is not None:
            attachment_instances = ContentAttachment.objects.filter(
                id__in=attachments_ids
            )
            instance.attachments.set(attachment_instances)
        return instance

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


class EventCommunitySerializer(DateTimeFormattingMixin, AbsoluteURLSerializer):
    datetime_fields = ("created_at", "updated_at", "start_event_date", "end_event_date")
    learn = serializers.PrimaryKeyRelatedField(
        queryset=Learn.objects.filter(category__learn_type=LearnType.POSTERS),
        write_only=True,
        required=False,
    )

    class Meta:
        model = EventCommunity
        fields = "__all__"

    def to_representation(self, instance):
        data = super().to_representation(instance)
        data["learn"] = (
            LearnSerializer(instance.learn, context=self.context).data
            if instance.learn
            else None
        )
        return data


class RelatedReportsCategorySerializer(DateTimeFormattingMixin, AbsoluteURLSerializer):
    datetime_fields = ("created_at", "updated_at")
    related_reports_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = RelatedReportsCategory
        fields = "__all__"


class RelatedReportsSerializer(DateTimeFormattingMixin, AbsoluteURLSerializer):
    datetime_fields = ("created_at", "updated_at")
    category = serializers.PrimaryKeyRelatedField(
        queryset=RelatedReportsCategory.objects.all(), write_only=True, required=False
    )

    class Meta:
        model = RelatedReports
        fields = "__all__"
        file_fields = ("image",)

    def to_representation(self, instance):
        data = super().to_representation(instance)
        data["category"] = (
            RelatedReportsCategorySerializer(
                instance.category, context=self.context
            ).data
            if instance.category
            else None
        )
        return data


class PhotoSerializer(DateTimeFormattingMixin, AbsoluteURLSerializer):
    """Serializer for individual photos in a collection."""

    datetime_fields = ("created_at", "updated_at")

    class Meta:
        model = Photo
        fields = "__all__"
        file_fields = ("image",)


class PhotoCollectionSerializer(DateTimeFormattingMixin, AbsoluteURLSerializer):
    """Serializer for photo collections."""

    datetime_fields = ("created_at", "updated_at", "happened_at")
    photos = PhotoSerializer(many=True, read_only=True)
    photo_count = serializers.SerializerMethodField()
    is_new = serializers.BooleanField(read_only=True)

    class Meta:
        model = PhotoCollection
        fields = "__all__"
        file_fields = ("image",)

    def get_photo_count(self, obj):
        """Return the number of photos in the collection."""
        return obj.photos.count()

    def to_representation(self, instance):
        data = super().to_representation(instance)
        # Ensure nested photos serializer gets the request context
        if "photos" in data and instance.photos.exists():
            data["photos"] = PhotoSerializer(
                instance.photos.all(), many=True, context=self.context
            ).data
        return data


class LatestNewsImageSerializer(DateTimeFormattingMixin, AbsoluteURLSerializer):
    """Serializer for individual images in latest news."""

    datetime_fields = ("created_at", "updated_at")

    class Meta:
        model = LatestNewsImage
        fields = "__all__"
        file_fields = ("image",)


class LatestNewsSerializer(DateTimeFormattingMixin, AbsoluteURLSerializer):
    datetime_fields = ("created_at", "updated_at", "happened_at")
    images = LatestNewsImageSerializer(many=True, read_only=True)
    image_count = serializers.SerializerMethodField()
    is_new = serializers.BooleanField(read_only=True)

    class Meta:
        model = LatestNews
        fields = "__all__"

    def get_image_count(self, obj):
        return obj.images.count()

    def to_representation(self, instance):
        data = super().to_representation(instance)
        # Ensure nested images serializer gets the request context
        if "images" in data and instance.images.exists():
            data["images"] = LatestNewsImageSerializer(
                instance.images.all(), many=True, context=self.context
            ).data
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
