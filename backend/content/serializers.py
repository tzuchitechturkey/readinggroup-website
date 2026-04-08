from accounts.serializers import UserSerializer
from django.conf import settings
from .enums import LearnType
from readinggroup_backend.helpers import DateTimeFormattingMixin
from rest_framework import serializers

from .helpers import AbsoluteURLSerializer, get_account_user
from .youtube import YouTubeAPIError, fetch_video_info
from .models import (
    RelatedReportsCategory,
    EventCommunityImage,
    ContentAttachment,
    HistoryEventImage,
    LatestNewsImage,
    PhotoCollection,
    RelatedReports,
    EventCommunity,
    LearnCategory,
    VideoCategory,
    OurTeamImage,
    HistoryEvent,
    SocialMedia,
    BookReview,
    NavbarLogo,
    LatestNews,
    OurTeam,
    Video,
    Photo,
    Learn,
    Book,
)


class ContentAttachmentSerializer(DateTimeFormattingMixin, AbsoluteURLSerializer):
    """Serializer for Content file attachments (documents, PDFs, etc)."""

    datetime_fields = ("created_at", "updated_at")

    class Meta:
        model = ContentAttachment
        fields = "__all__"
        file_fields = ("file",)


class VideoCategorySerializer(DateTimeFormattingMixin, AbsoluteURLSerializer):
    """Serializer for VideoCategory model with absolute URL handling for file fields."""

    datetime_fields = ("created_at", "updated_at")
    video_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = VideoCategory
        fields = "__all__"


class LearnCategorySerializer(DateTimeFormattingMixin, AbsoluteURLSerializer):
    """Serializer for LearnCategory model with absolute URL handling for file fields."""

    learn_count = serializers.IntegerField(read_only=True)
    datetime_fields = (
        "created_at",
        "updated_at",
        "happened_at",
    )

    class Meta:
        model = LearnCategory
        fields = "__all__"


class RelatedReportsCategorySerializer(DateTimeFormattingMixin, AbsoluteURLSerializer):
    """Serializer for RelatedReportsCategory model with absolute URL handling for file fields."""

    datetime_fields = ("created_at", "updated_at")
    related_reports_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = RelatedReportsCategory
        fields = "__all__"


class PhotoSerializer(DateTimeFormattingMixin, AbsoluteURLSerializer):
    """Serializer for individual photos in a collection."""

    datetime_fields = ("created_at", "updated_at")

    class Meta:
        model = Photo
        fields = "__all__"
        file_fields = ("image",)


class LatestNewsImageSerializer(DateTimeFormattingMixin, AbsoluteURLSerializer):
    """Serializer for individual images in latest news."""

    datetime_fields = ("created_at", "updated_at")

    class Meta:
        model = LatestNewsImage
        fields = "__all__"
        file_fields = ("image",)


class EventCommunityImageSerializer(DateTimeFormattingMixin, AbsoluteURLSerializer):
    """Serializer for individual images in an event community item."""

    datetime_fields = ("created_at", "updated_at")

    class Meta:
        model = EventCommunityImage
        fields = "__all__"
        file_fields = ("image",)


class OurTeamImageSerializer(DateTimeFormattingMixin, AbsoluteURLSerializer):
    """Serializer for OurTeamImage model with absolute URL handling for file fields."""

    datetime_fields = ("created_at", "updated_at")

    class Meta:
        model = OurTeamImage
        fields = "__all__"
        file_fields = ("image",)


class BookReviewSerializer(DateTimeFormattingMixin, AbsoluteURLSerializer):
    """Serializer for individual review files in a book."""

    datetime_fields = ("created_at", "updated_at")

    class Meta:
        model = BookReview
        fields = "__all__"
        file_fields = ("image",)


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
    base_video = serializers.PrimaryKeyRelatedField(
        queryset=Video.objects.all(), write_only=True, required=False, allow_null=True
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


class VideoMultiLangSerializer(serializers.Serializer):
    """Returns a video grouped by language keys.

    Output shape:
    {
        "id": 5,
        "ar": { ...all video fields... },   ← base language
        "en": { ...all video fields... }    ← added translation (omitted if not yet created)
    }
    The first language the video is created in is the base (base_video=null).
    Additional translations link back to the base via base_video FK.
    """

    def _serialize_lang(self, instance):
        data = VideoSerializer(instance, context=self.context).data
        data.pop("base_video", None)
        return data

    def to_representation(self, instance):
        base = instance if not instance.base_video_id else instance.base_video
        result = {"id": base.id}

        requested_languages = self.context.get("requested_languages") or []
        if requested_languages:
            # Only include requested languages; if base isn't that language,
            # try to use the corresponding translation.
            translations = {
                tr.language: tr
                for tr in (
                    base.translations.select_related("category")
                    .prefetch_related("attachments")
                    .all()
                )
            }
            for lang in requested_languages:
                if base.language == lang:
                    result[lang] = self._serialize_lang(base)
                elif lang in translations:
                    result[lang] = self._serialize_lang(translations[lang])
            return result

        # Default: include base language + all translations.
        result[base.language] = self._serialize_lang(base)
        for tr in (
            base.translations.select_related("category")
            .prefetch_related("attachments")
            .all()
        ):
            result[tr.language] = self._serialize_lang(tr)
        return result


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


class RelatedReportsSerializer(DateTimeFormattingMixin, AbsoluteURLSerializer):
    """Serializer for RelatedReports model with absolute URL handling for file fields."""

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


class PhotoCollectionSerializer(DateTimeFormattingMixin, AbsoluteURLSerializer):
    """Serializer for PhotoCollection model with absolute URL handling for file fields."""

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


class LatestNewsSerializer(DateTimeFormattingMixin, AbsoluteURLSerializer):
    """Serializer for LatestNews model with absolute URL handling for file fields."""

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


class EventCommunitySerializer(DateTimeFormattingMixin, AbsoluteURLSerializer):
    """Serializer for EventCommunity model with absolute URL handling for file fields."""

    datetime_fields = ("created_at", "updated_at", "start_event_date", "end_event_date")
    learn = serializers.PrimaryKeyRelatedField(
        queryset=Learn.objects.filter(category__learn_type=LearnType.POSTERS),
        write_only=True,
        required=False,
    )
    images = EventCommunityImageSerializer(many=True, read_only=True)

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
        data["images"] = EventCommunityImageSerializer(
            instance.images.all(), many=True, context=self.context
        ).data
        return data


class OurTeamSerializer(DateTimeFormattingMixin, AbsoluteURLSerializer):
    """Serializer for OurTeam model with absolute URL handling for file fields."""

    datetime_fields = ("created_at", "updated_at")
    images = OurTeamImageSerializer(many=True, read_only=True)

    class Meta:
        model = OurTeam
        fields = "__all__"
        file_fields = ("image",)

    def to_representation(self, instance):
        data = super().to_representation(instance)
        if "images" in data and instance.images.exists():
            data["images"] = OurTeamImageSerializer(
                instance.images.all(), many=True, context=self.context
            ).data
        return data


class BookSerializer(DateTimeFormattingMixin, AbsoluteURLSerializer):
    """Serializer for Book model with nested review files."""

    datetime_fields = ("created_at", "updated_at")
    reviews = BookReviewSerializer(many=True, read_only=True)

    class Meta:
        model = Book
        fields = "__all__"
        file_fields = ("image", "cover_image")

    def to_representation(self, instance):
        data = super().to_representation(instance)
        if "reviews" in data and instance.reviews.exists():
            data["reviews"] = BookReviewSerializer(
                instance.reviews.all(), many=True, context=self.context
            ).data
        return data


class HistoryEventImageSerializer(DateTimeFormattingMixin, AbsoluteURLSerializer):
    datetime_fields = ("created_at", "updated_at")

    class Meta:
        model = HistoryEventImage
        fields = "__all__"
        file_fields = ("image",)


class HistoryEventSerializer(DateTimeFormattingMixin, AbsoluteURLSerializer):
    datetime_fields = ("created_at", "updated_at")
    images = HistoryEventImageSerializer(many=True, read_only=True)

    class Meta:
        model = HistoryEvent
        fields = "__all__"

    def to_representation(self, instance):
        data = super().to_representation(instance)
        if "images" in data and instance.images.exists():
            data["images"] = HistoryEventImageSerializer(
                instance.images.all(), many=True, context=self.context
            ).data
        return data


# ------------------------------------------------------------------new models serializers end----------------------------------------------------------------
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
