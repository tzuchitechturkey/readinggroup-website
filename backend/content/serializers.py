from accounts.serializers import UserSerializer
from django.conf import settings
from django.contrib.contenttypes.models import ContentType
from readinggroup_backend.helpers import DateTimeFormattingMixin
from rest_framework import serializers
from rest_framework.exceptions import ValidationError
from django.db.models import Avg, Count

from .helpers import AbsoluteURLSerializer, get_account_user
from .youtube import YouTubeAPIError, fetch_video_info
from .models import (
    Comments,
    Content,
    ContentCategory,
    ContentImage,
    ContentAttachment,
    ContentRating,
    Event,
    EventCategory,
    EventSection,
    HistoryEntry,
    Like,
    MyListEntry,
    NavbarLogo,
    PositionTeamMember,
    Post,
    PostCategory,
    PostRating,
    Reply,
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


class ReplySerializer(DateTimeFormattingMixin, serializers.ModelSerializer):
    """Serializer for reply model attached to comments."""

    user = UserSerializer(read_only=True)
    likes_count = serializers.SerializerMethodField(read_only=True)
    has_liked = serializers.SerializerMethodField(read_only=True)
    comment = serializers.PrimaryKeyRelatedField(
        queryset=Comments.objects.all(), required=False
    )

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


class PostCategorySerializer(DateTimeFormattingMixin, AbsoluteURLSerializer):
    """Serializer for PostCategory with multilingual translation support."""
    datetime_fields = ("created_at", "updated_at")
    post_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = PostCategory
        fields = ('id', 'name', 'description', 'is_active', 'order', 'language', 
                  'source_language', 'created_at', 'updated_at', 'post_count')
    class Meta:
        model = PostCategory
        fields = ('id', 'name', 'description', 'is_active', 'order', 'language', 
                  'source_language', 'created_at', 'updated_at', 'post_count')
    
    def to_representation(self, instance):
        """Return data based on requested language in query params."""
        representation = super().to_representation(instance)
        
        # Get requested language from query params
        request = self.context.get('request')
        if request and request.method == 'GET':
            requested_lang = request.query_params.get('language')
            
            # If a specific language is requested and it exists in translations
            if requested_lang and requested_lang in instance.translations:
                translation = instance.translations[requested_lang]
                representation['name'] = translation.get('name', instance.name)
                representation['description'] = translation.get('description', instance.description)
                representation['language'] = requested_lang
        
        return representation
    
    def create(self, validated_data):
        """Create a new PostCategory and auto-translate to all languages."""
        from .translation_service import get_translation_service
        
        # Get the source language
        source_language = validated_data.get('language', 'en')
        name = validated_data.get('name')
        description = validated_data.get('description', '')
        
        # Set source_language field
        validated_data['source_language'] = source_language
        
        # Create the instance
        instance = super().create(validated_data)
        
        # Initialize translations with source language
        instance.translations = {
            source_language: {
                'name': name,
                'description': description,
                'is_source': True,
                'auto_translated': False
            }
        }
        
        # Auto-translate to all other languages using Gemini AI
        try:
            translation_service = get_translation_service()
            translations = translation_service.translate_all_languages(
                name=name,
                description=description,
                source_lang=source_language
            )
            
            # Add translations to the instance
            for lang_code, trans_data in translations.items():
                instance.translations[lang_code] = {
                    'name': trans_data['name'],
                    'description': trans_data['description'],
                    'is_source': False,
                    'auto_translated': True
                }
        except Exception as e:
            import logging
            logger = logging.getLogger(__name__)
            logger.error(f"Failed to auto-translate category: {e}")
        
        instance.save()
        return instance
    
    def update(self, instance, validated_data):
        """Update a PostCategory and update translations if needed."""
        from .translation_service import get_translation_service
        
        # Get the requested language from query params
        request = self.context.get('request')
        requested_lang = None
        if request:
            requested_lang = request.query_params.get('language')
        
        # If updating a specific language translation
        if requested_lang and requested_lang != instance.source_language:
            # Update only the specific language translation
            if not instance.translations:
                instance.translations = {}
            
            instance.translations[requested_lang] = {
                'name': validated_data.get('name', instance.name),
                'description': validated_data.get('description', instance.description),
                'is_source': False,
                'auto_translated': False  # Manual edit, not auto-translated
            }
            instance.save()
            return instance
        
        # If updating the source language
        name_changed = 'name' in validated_data and validated_data['name'] != instance.name
        desc_changed = 'description' in validated_data and validated_data['description'] != instance.description
        
        # Update the instance
        instance = super().update(instance, validated_data)
        
        # If source content changed, re-translate to all languages
        if name_changed or desc_changed:
            source_language = instance.source_language
            
            # Update source language in translations
            if not instance.translations:
                instance.translations = {}
            
            instance.translations[source_language] = {
                'name': instance.name,
                'description': instance.description,
                'is_source': True,
                'auto_translated': False
            }
            
            # Re-translate to all other languages
            try:
                translation_service = get_translation_service()
                translations = translation_service.translate_all_languages(
                    name=instance.name,
                    description=instance.description,
                    source_lang=source_language
                )
                
                for lang_code, trans_data in translations.items():
                    instance.translations[lang_code] = {
                        'name': trans_data['name'],
                        'description': trans_data['description'],
                        'is_source': False,
                        'auto_translated': True
                    }
            except Exception as e:
                import logging
                logger = logging.getLogger(__name__)
                logger.error(f"Failed to auto-translate category: {e}")
            
            instance.save()
        
        return instance


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
                    ct = ContentType.objects.get(
                        app_label__iexact="content", model__iexact="post"
                    )
                except ContentType.DoesNotExist:
                    raise ValidationError(
                        {
                            "content_type": "Post content type not found in ContentType table."
                        }
                    )
            else:
                try:
                    ct = ContentType.objects.get(model__iexact=content_type_name)
                except ContentType.DoesNotExist:
                    raise ValidationError(
                        {
                            "content_type": f"ContentType with name '{content_type_name}' does not exist."
                        }
                    )

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
                raise ValidationError(
                    {
                        "object_id": f"Object with id {obj_id} not found for content_type {content_type_name}."
                    }
                )

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
    category = serializers.PrimaryKeyRelatedField(
        queryset=VideoCategory.objects.all(), write_only=True, required=False
    )
    season_name = serializers.PrimaryKeyRelatedField(
        queryset=SeasonId.objects.all(), write_only=True, required=False
    )
    comments = CommentsSerializer(many=True, read_only=True)
    likes_count = serializers.SerializerMethodField(read_only=True)
    has_liked = serializers.SerializerMethodField(read_only=True)
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
        data["likes_count"] = getattr(
            instance, "annotated_likes_count", getattr(instance, "likes_count", 0)
        )
        request = self.context.get("request")
        user = getattr(request, "user", None)
        annotated = getattr(instance, "annotated_has_liked", None)
        data["has_liked"] = (
            bool(annotated)
            if annotated is not None
            else (instance.has_liked(user) if user and user.is_authenticated else False)
        )
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
            target = get_account_user(obj)
            if target:
                return UserSerializer(target, context=self.context).data
        except Exception:
            pass
        return None


class PostSerializer(DateTimeFormattingMixin, AbsoluteURLSerializer):
    """Serializer for Post model with absolute URL handling for file fields."""

    datetime_fields = ("created_at", "updated_at")
    category = serializers.PrimaryKeyRelatedField(
        queryset=PostCategory.objects.all(), write_only=True, required=False
    )
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
        data["category"] = (
            PostCategorySerializer(instance.category, context=self.context).data
            if instance.category
            else None
        )
        data["comments"] = CommentsSerializer(
            instance.comments.all(), many=True, context=self.context
        ).data
        data["likes_count"] = getattr(
            instance, "annotated_likes_count", getattr(instance, "likes_count", 0)
        )
        request = self.context.get("request")
        user = getattr(request, "user", None)
        annotated = getattr(instance, "annotated_has_liked", None)
        data["has_liked"] = (
            bool(annotated)
            if annotated is not None
            else (instance.has_liked(user) if user and user.is_authenticated else False)
        )
        # ratings: average, count, and the requesting user's rating (if any)
        try:
            avg = getattr(instance, "annotated_rating_avg", None)
            count = getattr(instance, "annotated_rating_count", None)
            if avg is None or count is None:

                agg = PostRating.objects.filter(post=instance).aggregate(
                    avg=Avg("rating"), count=Count("id")
                )
                avg = agg.get("avg")
                count = agg.get("count")
            data["average_rating"] = round(avg, 2) if avg is not None else None
            data["rating_count"] = int(count or 0)
        except Exception:
            data["average_rating"] = None
            data["rating_count"] = 0

        try:
            if user and user.is_authenticated:
                pr = PostRating.objects.filter(post=instance, user=user).first()
                data["user_rating"] = pr.rating if pr else None
            else:
                data["user_rating"] = None
        except Exception:
            data["user_rating"] = None
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
            avg = getattr(obj, "annotated_rating_avg", None)
            if avg is None:
                from django.db.models import Avg

                agg = PostRating.objects.filter(post=obj).aggregate(avg=Avg("rating"))
                avg = agg.get("avg")
            return round(avg, 2) if avg is not None else None
        except Exception:
            return None

    def get_rating_count(self, obj):
        """Return integer count of ratings for the post."""
        try:
            count = getattr(obj, "annotated_rating_count", None)
            if count is None:
                from django.db.models import Count

                agg = PostRating.objects.filter(post=obj).aggregate(count=Count("id"))
                count = agg.get("count")
            return int(count or 0)
        except Exception:
            return 0

    def get_user_rating(self, obj):
        """Return the requesting user's rating for the post, or None."""
        request = self.context.get("request")
        user = getattr(request, "user", None)
        if not user or not user.is_authenticated:
            return None
        try:
            pr = PostRating.objects.filter(post=obj, user=user).first()
            return pr.rating if pr else None
        except Exception:
            return None

    def get_user(self, obj):
        """Return the user associated with the post, or None."""
        request = self.context.get("request")
        user = getattr(request, "user", None)
        if not user or not user.is_authenticated:
            return None
        try:
            return UserSerializer(user, context=self.context).data
        except Exception:
            return None


class ContentSerializer(DateTimeFormattingMixin, AbsoluteURLSerializer):
    """Serializer for Content model with absolute URL handling for file fields."""

    datetime_fields = ("created_at", "updated_at")
    category = serializers.PrimaryKeyRelatedField(
        queryset=ContentCategory.objects.all(), write_only=True, required=False
    )
    comments = CommentsSerializer(many=True, read_only=True)
    likes_count = serializers.SerializerMethodField(read_only=True)
    has_liked = serializers.SerializerMethodField(read_only=True)
    user = serializers.SerializerMethodField(read_only=True)
    average_rating = serializers.SerializerMethodField(read_only=True)
    rating_count = serializers.SerializerMethodField(read_only=True)
    user_rating = serializers.SerializerMethodField(read_only=True)
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
        # include comments for models that have GenericRelation
        try:
            data["comments"] = CommentsSerializer(
                instance.comments.all(), many=True, context=self.context
            ).data
        except Exception:
            data["comments"] = []
        data["likes_count"] = getattr(
            instance, "annotated_likes_count", getattr(instance, "likes_count", 0)
        )
        request = self.context.get("request")
        user = getattr(request, "user", None)
        annotated = getattr(instance, "annotated_has_liked", None)
        data["has_liked"] = (
            bool(annotated)
            if annotated is not None
            else (instance.has_liked(user) if user and user.is_authenticated else False)
        )
        # ratings: average, count, and user's rating (if any)
        try:
            avg = getattr(instance, "annotated_rating_avg", None)
            count = getattr(instance, "annotated_rating_count", None)
            if avg is None or count is None:
                from django.db.models import Avg, Count

                agg = ContentRating.objects.filter(content=instance).aggregate(
                    avg=Avg("rating"), count=Count("id")
                )
                avg = agg.get("avg")
                count = agg.get("count")
            data["average_rating"] = round(avg, 2) if avg is not None else None
            data["rating_count"] = int(count or 0)
        except Exception:
            data["average_rating"] = None
            data["rating_count"] = 0

        try:
            if user and user.is_authenticated:
                cr = ContentRating.objects.filter(content=instance, user=user).first()
                data["user_rating"] = cr.rating if cr else None
            else:
                data["user_rating"] = None
        except Exception:
            data["user_rating"] = None
        # include associated ContentImage rows as `images` for slider support
        try:
            data["images"] = ContentImageSerializer(
                instance.images.all(), many=True, context=self.context
            ).data
        except Exception:
            # fall back to empty list if anything goes wrong
            data["images"] = []
        return data

    def get_average_rating(self, obj):
        try:
            avg = getattr(obj, "annotated_rating_avg", None)
            if avg is None:
                from django.db.models import Avg

                agg = ContentRating.objects.filter(content=obj).aggregate(
                    avg=Avg("rating")
                )
                avg = agg.get("avg")
            return round(avg, 2) if avg is not None else None
        except Exception:
            return None

    def get_rating_count(self, obj):
        try:
            count = getattr(obj, "annotated_rating_count", None)
            if count is None:
                from django.db.models import Count

                agg = ContentRating.objects.filter(content=obj).aggregate(
                    count=Count("id")
                )
                count = agg.get("count")
            return int(count or 0)
        except Exception:
            return 0

    def get_user_rating(self, obj):
        request = self.context.get("request")
        user = getattr(request, "user", None)
        if not user or not user.is_authenticated:
            return None
        try:
            cr = ContentRating.objects.filter(content=obj, user=user).first()
            return cr.rating if cr else None
        except Exception:
            return None

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
    comments = CommentsSerializer(many=True, read_only=True)
    likes_count = serializers.SerializerMethodField(read_only=True)
    has_liked = serializers.SerializerMethodField(read_only=True)
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
        # include comments for models that have GenericRelation
        try:
            data["comments"] = CommentsSerializer(
                instance.comments.all(), many=True, context=self.context
            ).data
        except Exception:
            data["comments"] = []
        data["likes_count"] = getattr(
            instance, "annotated_likes_count", getattr(instance, "likes_count", 0)
        )
        request = self.context.get("request")
        user = getattr(request, "user", None)
        annotated = getattr(instance, "annotated_has_liked", None)
        data["has_liked"] = (
            bool(annotated)
            if annotated is not None
            else (instance.has_liked(user) if user and user.is_authenticated else False)
        )
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
