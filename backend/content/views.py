from django.conf import settings
from django.db.models import Count as DjCount
from django.db.models import Count, Avg
from django.contrib.contenttypes.models import ContentType

from django.db.models import F
from rest_framework import viewsets, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend

from .models import Learn
from .serializers import LearnSerializer
from rest_framework.pagination import LimitOffsetPagination
from typing import Dict, List, Optional
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework.pagination import LimitOffsetPagination
from rest_framework.response import Response
from rest_framework import filters, viewsets, status
from .enums import VideoType
from datetime import date
from drf_yasg.utils import swagger_auto_schema
from .swagger_parameters import (
    video_manual_parameters,
    event_manual_parameters,
    team_member_manual_parameters,
    global_search_manual_parameters,
    content_manual_parameters,
    content_category_manual_parameters,
    event_category_manual_parameters,
    video_category_manual_parameters,
    learn_manual_parameters,
    learn_category_manual_parameters,
)
from .models import (
    Event,
    HistoryEntry,
    Learn,
    LearnCategory,
    TeamMember,
    Video,
    Content,
    ContentImage,
    ContentAttachment,
    VideoCategory,
    EventCategory,
    ContentCategory,
    PositionTeamMember,
    EventSection,
    MyListEntry,
    SeasonTitle,
    SeasonId,
    SocialMedia,
    NavbarLogo,
    Authors,
    Book,
    BookCategory,
)
from .serializers import (
    EventSerializer,
    HistoryEntrySerializer,
    LearnSerializer,
    ContentSerializer,
    TeamMemberSerializer,
    VideoSerializer,
    LearnCategorySerializer,
    VideoCategorySerializer,
    EventCategorySerializer,
    ContentCategorySerializer,
    PositionTeamMemberSerializer,
    EventSectionSerializer,
    SeasonTitleSerializer,
    SeasonIdSerializer,
    SocialMediaSerializer,
    NavbarLogoSerializer,
    ContentAttachmentSerializer,
    AuthorsSerializer,
    BookSerializer,
    BookCategorySerializer,
)
from .youtube import YouTubeAPIError, fetch_video_info
from .views_helpers import (
    _filter_published,
)


class VideoViewSet(viewsets.ModelViewSet):
    queryset = Video.objects.all()
    serializer_class = VideoSerializer
    search_fields = ("title",)
    ordering_fields = ("happened_at", "views", "created_at")
    filter_backends = [filters.SearchFilter]
    pagination_class = LimitOffsetPagination

    @swagger_auto_schema(
        operation_summary="all List videos",
        operation_description="Retrieve a list of videos with optional filtering by language, category, and happened_at date.",
        manual_parameters=video_manual_parameters,
    )
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    @action(detail=False, methods=("post",), url_path="fetch-youtube-info")
    def fetch_youtube_info(self, request):
        video_url = request.data.get("video_url") or request.data.get("url")
        if not video_url:
            return Response(
                {"detail": "video_url is required."}, status=status.HTTP_400_BAD_REQUEST
            )

        api_key = getattr(settings, "YOUTUBE_API_KEY", None)
        if not api_key:
            return Response(
                {"detail": "YouTube API key is not configured."},
                status=status.HTTP_503_SERVICE_UNAVAILABLE,
            )

        try:
            info = fetch_video_info(video_url, api_key)
        except YouTubeAPIError as exc:
            return Response({"detail": str(exc)}, status=status.HTTP_400_BAD_REQUEST)

        response_payload = {
            "title": info.title,
            "description": info.description,
            "duration_seconds": info.duration_seconds,
            "duration_formatted": info.duration_formatted,
            "reference_code": info.video_id,
            "default_language": info.default_language,
            "channel_title": info.channel_title,
            "thumbnails": info.thumbnails,
            "published_at": (
                info.published_at.isoformat() if info.published_at else None
            ),
        }

        return Response(response_payload, status=status.HTTP_200_OK)

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.views = instance.views + 1
        instance.save(update_fields=["views"])
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

    def get_queryset(self):
        queryset = super().get_queryset()
        params = self.request.query_params

        language = params.getlist("language")
        if language:
            values = []
            for item in language:
                values.extend([v.strip() for v in item.split(",") if v.strip()])
            if values:
                queryset = queryset.filter(language__in=values)

        category = params.get("category")
        if category:
            values = []
            for item in category.split(","):
                values.append(item.strip())
            if values:
                queryset = queryset.filter(category__name__in=values)

        happened_at = params.get("happened_at")
        if happened_at:
            try:
                parsed = date.fromisoformat(happened_at)
                queryset = queryset.filter(happened_at=parsed)
            except Exception:
                queryset = queryset.filter(happened_at=happened_at)

        is_new = params.get("is_new")
        if is_new is not None:
            if is_new.lower() in ("true"):
                queryset = queryset.filter(is_new=True)
            elif is_new.lower() in ("false"):
                queryset = queryset.filter(is_new=False)

        is_featured = params.get("is_featured")
        if is_featured is not None:
            if is_featured.lower() in ("true"):
                queryset = queryset.filter(is_featured=True)
            elif is_featured.lower() in ("false"):
                queryset = queryset.filter(is_featured=False)

        status = params.get("status")
        if status:
            values = []
            for item in status.split(","):
                values.append(item.strip())
            if values:
                queryset = queryset.filter(status__in=values)

        is_weekly_moment = params.get("is_weekly_moment")
        if is_weekly_moment is not None:
            if is_weekly_moment.lower() in ("true"):
                queryset = queryset.filter(is_weekly_moment=True)
            elif is_weekly_moment.lower() in ("false"):
                queryset = queryset.filter(is_weekly_moment=False)

        is_detail = bool(self.kwargs.get("pk")) if hasattr(self, "kwargs") else False
        if not is_detail and not params.get("status"):
            try:
                queryset = _filter_published(queryset)
            except Exception:
                try:
                    queryset = queryset.filter(status="published")
                except Exception:
                    pass
            try:
                queryset = queryset.filter(category__is_active=True)
            except Exception:
                pass

        return queryset.order_by("-created_at")

    @action(
        detail=True,
        methods=("post", "delete"),
        url_path="my-list",
        url_name="my_list_item",
    )
    def my_list_item(self, request, pk=None):
        """Add or remove a video from the requesting user's My List.
        POST -> add (idempotent)
        DELETE -> remove (idempotent)
        """
        user = request.user
        if not user or not user.is_authenticated:
            return Response(
                {"detail": "Authentication required."},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        try:
            video = Video.objects.get(pk=pk)
        except Video.DoesNotExist:
            return Response(
                {"detail": "Video not found."}, status=status.HTTP_404_NOT_FOUND
            )

        if request.method == "POST":
            # create if not exists
            MyListEntry.objects.get_or_create(user=user, video=video)
            serializer = self.get_serializer(video, context={"request": request})
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        # DELETE: remove if exists
        MyListEntry.objects.filter(user=user, video=video).delete()
        serializer = self.get_serializer(video, context={"request": request})
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(detail=False, methods=("get",), url_path="my-list", url_name="my_list")
    def my_list(self, request):
        """Return the list of videos saved by the requesting user."""
        user = request.user
        if not user or not user.is_authenticated:
            return Response(
                {"detail": "Authentication required."},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        # get videos via MyListEntry, preserve ordering by created_at in MyListEntry
        entries = (
            MyListEntry.objects.filter(user=user)
            .select_related("video")
            .order_by("-created_at")
        )
        # Extract videos preserving ordering from the MyListEntry records
        videos = [e.video for e in entries]

        # Use the view's pagination if configured. paginate_queryset accepts lists as well as querysets.
        page = self.paginate_queryset(videos)
        if page is not None:
            serializer = VideoSerializer(page, many=True, context={"request": request})
            return self.get_paginated_response(serializer.data)

        serializer = VideoSerializer(videos, many=True, context={"request": request})
        return Response(serializer.data)

    @swagger_auto_schema(
        operation_summary="List published videos",
        operation_description="Return videos with status='published' and whose category is active.",
        manual_parameters=video_manual_parameters,
    )
    @action(detail=False, methods=("get",), url_path="published", url_name="published")
    def published(self, request):
        """Return videos that are published and whose category is active.

        URL: /api/v1/videos/published/
        Supports pagination and includes likes annotation so serializers can show likes_count/has_liked.
        """
        qs = Video.objects.all()
        try:
            qs = _filter_published(qs)
        except Exception:
            try:
                qs = qs.filter(status="published")
            except Exception:
                pass

        try:
            qs = qs.filter(category__is_active=True)
        except Exception:
            pass

        qs = qs.order_by("-created_at")

        page = self.paginate_queryset(qs)
        if page is not None:
            serializer = VideoSerializer(page, many=True, context={"request": request})
            return self.get_paginated_response(serializer.data)

        serializer = VideoSerializer(qs, many=True, context={"request": request})
        return Response(serializer.data)

    @action(
        detail=False,
        methods=("get",),
        url_path="last-published-by-type",
        url_name="last_published_by_type",
    )
    def last_published_by_type(self, request):
        """
        Return:
        - last 1 FULL_LIVE_STREAM
        - last 3 NEW_CLIP
        ordered newest → oldest
        """

        def base_queryset(video_type_value):
            qs = Video.objects.filter(video_type=video_type_value)

            # published filter
            try:
                qs = _filter_published(qs)
            except Exception:
                qs = qs.filter(status="published")

            # active category (optional safety)
            try:
                qs = qs.filter(category__is_active=True)
            except Exception:
                pass

            return qs.order_by("-created_at")

        # ⭐ اخر 1 live stream
        live_stream_qs = base_queryset(VideoType.FULL_LIVE_STREAM)[:1]

        # ⭐ اخر 3 new clip
        new_clip_qs = base_queryset(VideoType.NEW_CLIP)[:3]

        payload = {
            "full_live_stream": VideoSerializer(
                live_stream_qs, many=True, context={"request": request}
            ).data,
            "new_clip": VideoSerializer(
                new_clip_qs, many=True, context={"request": request}
            ).data,
        }

        # اذا الاثنين فاضيين
        if not payload["full_live_stream"] and not payload["new_clip"]:
            return Response(
                {"detail": "No published videos found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        return Response(payload, status=status.HTTP_200_OK)


class LearnViewSet(viewsets.ModelViewSet):
    queryset = Learn.objects.all()
    serializer_class = LearnSerializer
    pagination_class = LimitOffsetPagination
    search_fields = ("title", "subtitle", "writer", "category__name", "tags")
    ordering_fields = ("views", "created_at", "happened_at")
    ordering = ("-created_at",)
    filter_backends = [
        filters.SearchFilter,
        filters.OrderingFilter,
        DjangoFilterBackend,
    ]

    filterset_fields = (
        "created_at",
        "writer",
        "category__name",
        "language",
        "status",
    )

    @swagger_auto_schema(
        operation_summary="List all learns",
        operation_description="Retrieve a list of learns with advanced filtering and ordering.",
        manual_parameters=learn_manual_parameters,
    )
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        Learn.objects.filter(pk=instance.pk).update(views=F("views") + 1)
        instance.refresh_from_db()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

    def get_queryset(self):
        queryset = super().get_queryset().select_related("category")

        params = self.request.query_params

        created_at = params.get("created_at")
        if created_at:
            queryset = queryset.filter(created_at__date=created_at)

        happened_at = params.get("happened_at")
        if happened_at:
            queryset = queryset.filter(happened_at__date=happened_at)

        writer = params.get("writer")
        if writer:
            values = [item.strip() for item in writer.split(",") if item.strip()]
            if values:
                queryset = queryset.filter(writer__in=values)

        category = params.get("category")
        if category:
            values = [item.strip() for item in category.split(",") if item.strip()]
            if values:
                queryset = queryset.filter(category__name__in=values)

        language = params.get("language")
        if language:
            values = [item.strip() for item in language.split(",") if item.strip()]
            if values:
                queryset = queryset.filter(language__in=values)

        status_param = params.get("status")
        if status_param:
            values = [item.strip() for item in status_param.split(",") if item.strip()]
            if values:
                queryset = queryset.filter(status__in=values)

        is_weekly_moment = params.get("is_weekly_moment")
        if is_weekly_moment is not None:
            if is_weekly_moment.lower() == "true":
                queryset = queryset.filter(is_weekly_moment=True)
            elif is_weekly_moment.lower() == "false":
                queryset = queryset.filter(is_weekly_moment=False)

        is_detail = bool(self.kwargs.get("pk")) if hasattr(self, "kwargs") else False
        if not is_detail and not params.get("status"):
            try:
                queryset = _filter_published(queryset)
            except Exception:
                queryset = queryset.filter(status="published")

            try:
                queryset = queryset.filter(category__is_active=True)
            except Exception:
                pass

        return queryset

    @action(detail=True, methods=["post"], url_path="increase-view")
    def increase_view(self, request, pk=None):
        Learn.objects.filter(pk=pk).update(views=F("views") + 1)
        return Response({"detail": "View increased"}, status=status.HTTP_200_OK)


class ContentViewSet(viewsets.ModelViewSet):
    queryset = Content.objects.all()
    serializer_class = ContentSerializer
    search_fields = ("title",)
    ordering_fields = ("views", "created_at")
    filterset_fields = ("writer", "category__name", "language", "status")
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    pagination_class = LimitOffsetPagination

    @swagger_auto_schema(
        operation_summary="List all contents",
        operation_description="Retrieve a list of contents with optional filtering by writer, category, language, and status.",
        manual_parameters=content_manual_parameters,
    )
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.views = instance.views + 1
        instance.save(update_fields=["views"])
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

    def get_queryset(self):

        queryset = super().get_queryset()
        params = self.request.query_params

        writer = params.get("writer")
        if writer:
            values = []
            for item in writer.split(","):
                values.append(item.strip())
            if values:
                queryset = queryset.filter(writer__in=values)

        Category = params.get("category")
        if Category:
            values = []
            for item in Category.split(","):
                values.append(item.strip())
            if values:
                queryset = queryset.filter(category__name__in=values)

        language = params.get("language")
        if language:
            values = []
            for item in language.split(","):
                values.append(item.strip())
            if values:
                queryset = queryset.filter(language__in=values)

        status = params.get("status")
        if status:
            values = []
            for item in status.split(","):
                values.append(item.strip())
            if values:
                queryset = queryset.filter(status__in=values)

        is_weekly_moment = params.get("is_weekly_moment")
        if is_weekly_moment is not None:
            if is_weekly_moment.lower() in ("true"):
                queryset = queryset.filter(is_weekly_moment=True)
            elif is_weekly_moment.lower() in ("false"):
                queryset = queryset.filter(is_weekly_moment=False)

        is_detail = bool(self.kwargs.get("pk")) if hasattr(self, "kwargs") else False
        if not is_detail and not params.get("status"):
            try:
                queryset = _filter_published(queryset)
            except Exception:
                try:
                    queryset = queryset.filter(status="published")
                except Exception:
                    pass
            try:
                queryset = queryset.filter(category__is_active=True)
            except Exception:
                pass

        return queryset.order_by("-created_at")

    @action(
        detail=False, methods=("get",), url_path="last-posted", url_name="last_posted"
    )
    def last_posted(self, request):
        """Return last published contents (default limit=5)."""
        try:
            limit = int(request.query_params.get("limit", 5))
        except Exception:
            limit = 5

        qs = Content.objects.all()
        try:
            qs = _filter_published(qs)
        except Exception:
            try:
                qs = qs.filter(status="published")
            except Exception:
                pass

        try:
            qs = qs.filter(category__is_active=True)
        except Exception:
            pass

        qs = qs.order_by("-created_at")[:limit]
        page = self.paginate_queryset(qs)
        if page is not None:
            serializer = self.get_serializer(
                page, many=True, context={"request": request}
            )
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(qs, many=True, context={"request": request})
        return Response(serializer.data)

    def create(self, request, *args, **kwargs):
        """Create Content and attach uploaded images/urls as ContentImage rows."""
        if hasattr(request, "data"):
            if getattr(request, "FILES", None):
                data = request.data
            else:
                try:
                    data = request.data.copy()
                except Exception:
                    data = request.data
        else:
            data = {}
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        content = serializer.save()

        # ربط المرفقات بالـ Content الجديد إذا أرسلت IDs فقط
        attachment_ids = request.data.get("attachments", [])
        if isinstance(attachment_ids, list) and attachment_ids:

            ContentAttachment.objects.filter(id__in=attachment_ids).update(
                content=content
            )

        # handle file uploads and image urls
        try:
            # collect uploaded files: support images[] or repeated images key
            uploaded = []
            if hasattr(request.FILES, "getlist"):
                uploaded = list(
                    request.FILES.getlist("images")
                    or request.FILES.getlist("images[]")
                    or []
                )
            # fallback numbered keys image_0..image_n
            if not uploaded and "image_count" in data:
                try:
                    cnt = int(data.get("image_count") or 0)
                except Exception:
                    cnt = 0
                for i in range(cnt):
                    key = f"image_{i}"
                    if key in request.FILES:
                        uploaded.append(request.FILES[key])

            # also accept any request.FILES keys that start with image_
            if not uploaded:
                for k, v in request.FILES.items():
                    if k.startswith("image_") or k in ("image",):
                        uploaded.append(v)

            for f in uploaded:
                try:
                    ContentImage.objects.create(content=content, image=f)
                except Exception:
                    pass

            # collect image_url_* fields
            url_items = []
            for k, v in data.items():
                if isinstance(k, str) and k.startswith("image_url_") and v:
                    url_items.append(v)

            # also support image_urls as json/list
            if not url_items and "image_urls" in data:
                try:
                    import json

                    maybe = data.get("image_urls")
                    if isinstance(maybe, str):
                        parsed = json.loads(maybe)
                        if isinstance(parsed, (list, tuple)):
                            url_items = parsed
                    elif isinstance(maybe, (list, tuple)):
                        url_items = list(maybe)
                except Exception:
                    url_items = []

            for url in url_items:
                if url:
                    try:
                        ContentImage.objects.create(content=content, image_url=url)
                    except Exception:
                        pass

            # handle file attachments
            attachments = []
            if hasattr(request.FILES, "getlist"):
                attachments = list(
                    request.FILES.getlist("attachments")
                    or request.FILES.getlist("attachments[]")
                    or []
                )

            # fallback numbered keys attachment_0..attachment_n
            if not attachments and "attachment_count" in data:
                try:
                    cnt = int(data.get("attachment_count") or 0)
                except Exception:
                    cnt = 0
                for i in range(cnt):
                    key = f"attachment_{i}"
                    if key in request.FILES:
                        attachments.append(request.FILES[key])

            # also accept any request.FILES keys that start with attachment_
            if not attachments:
                for k, v in request.FILES.items():
                    if k.startswith("attachment_") or k == "attachment":
                        attachments.append(v)

            for f in attachments:
                try:
                    ContentAttachment.objects.create(
                        content=content, file=f, file_name=f.name, file_size=f.size
                    )
                except Exception:
                    pass
        except Exception:
            # don't break creation if image handling fails
            pass

        headers = self.get_success_headers(serializer.data)
        return Response(
            self.get_serializer(content, context={"request": request}).data,
            status=status.HTTP_201_CREATED,
            headers=headers,
        )

    def update(self, request, *args, **kwargs):
        """Update Content and optionally attach new uploaded images/urls as ContentImage rows."""
        partial = kwargs.pop("partial", False)
        instance = self.get_object()

        # same defensive copy logic as in create(): avoid copying when files present
        if hasattr(request, "data"):
            if getattr(request, "FILES", None):
                data = request.data
            else:
                try:
                    data = request.data.copy()
                except Exception:
                    data = request.data
        else:
            data = {}
        serializer = self.get_serializer(instance, data=data, partial=partial)
        serializer.is_valid(raise_exception=True)
        content = serializer.save()

        # Attach any new uploaded images (do not delete existing by default)
        try:
            uploaded = []
            if hasattr(request.FILES, "getlist"):
                uploaded = list(
                    request.FILES.getlist("images")
                    or request.FILES.getlist("images[]")
                    or []
                )
            if not uploaded and "image_count" in data:
                try:
                    cnt = int(data.get("image_count") or 0)
                except Exception:
                    cnt = 0
                for i in range(cnt):
                    key = f"image_{i}"
                    if key in request.FILES:
                        uploaded.append(request.FILES[key])

            for f in uploaded:
                try:
                    ContentImage.objects.create(content=content, image=f)
                except Exception:
                    pass

            url_items = []
            for k, v in data.items():
                if isinstance(k, str) and k.startswith("image_url_") and v:
                    url_items.append(v)
            if not url_items and "image_urls" in data:
                try:
                    import json

                    maybe = data.get("image_urls")
                    if isinstance(maybe, str):
                        parsed = json.loads(maybe)
                        if isinstance(parsed, (list, tuple)):
                            url_items = parsed
                    elif isinstance(maybe, (list, tuple)):
                        url_items = list(maybe)
                except Exception:
                    url_items = []

            for url in url_items:
                if url:
                    try:
                        ContentImage.objects.create(content=content, image_url=url)
                    except Exception:
                        pass

            # handle file attachments
            attachments = []
            if hasattr(request.FILES, "getlist"):
                attachments = list(
                    request.FILES.getlist("attachments")
                    or request.FILES.getlist("attachments[]")
                    or []
                )

            if not attachments and "attachment_count" in data:
                try:
                    cnt = int(data.get("attachment_count") or 0)
                except Exception:
                    cnt = 0
                for i in range(cnt):
                    key = f"attachment_{i}"
                    if key in request.FILES:
                        attachments.append(request.FILES[key])

            if not attachments:
                for k, v in request.FILES.items():
                    if k.startswith("attachment_") or k == "attachment":
                        attachments.append(v)

            for f in attachments:
                try:
                    ContentAttachment.objects.create(
                        content=content, file=f, file_name=f.name, file_size=f.size
                    )
                except Exception:
                    pass
        except Exception:
            pass

        return Response(self.get_serializer(content, context={"request": request}).data)


class EventViewSet(viewsets.ModelViewSet):
    """ViewSet for managing Event content."""

    queryset = Event.objects.all()
    serializer_class = EventSerializer
    search_fields = ("title",)
    ordering_fields = ("happened_at", "created_at")
    filterset_fields = (
        "section",
        "category",
        "country",
        "language",
        "report_type",
        "tags",
    )
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    pagination_class = LimitOffsetPagination

    @swagger_auto_schema(manual_parameters=event_manual_parameters)
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.views = instance.views + 1
        instance.save(update_fields=["views"])
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

    def get_queryset(self):

        queryset = super().get_queryset()
        # annotate likes info
        params = self.request.query_params

        section = params.get("section")
        if section:
            values = []
            for item in section.split(","):
                values.append(item.strip())
            if values:
                queryset = queryset.filter(section__name__in=values)

        writer = params.get("writer")
        if writer:
            values = []
            for item in writer.split(","):
                values.append(item.strip())
            if values:
                queryset = queryset.filter(writer__in=values)

        country = params.get("country")
        if country:
            values = []
            for item in country.split(","):
                values.append(item.strip())
            if values:
                queryset = queryset.filter(country__in=values)

        language = params.get("language")
        if language:
            values = []
            for item in language.split(","):
                values.append(item.strip())
            if values:
                queryset = queryset.filter(language__in=values)

        happened_at = params.get("happened_at")
        if happened_at:
            try:
                parsed = date.fromisoformat(happened_at)
                queryset = queryset.filter(happened_at=parsed)
            except Exception:
                queryset = queryset.filter(happened_at=happened_at)

        report_type = params.get("report_type")
        if report_type:
            values = []
            for item in report_type.split(","):
                values.append(item.strip())
            if values:
                queryset = queryset.filter(report_type__in=values)

        tags = params.get("tags")
        if tags:
            values = []
            for item in tags.split(","):
                values.append(item.strip())
            if values:
                queryset = queryset.filter(tags__in=values)

        category = params.get("category")
        if category:
            values = []
            for item in category.split(","):
                values.append(item.strip())
            if values:
                queryset = queryset.filter(category__name__in=values)

        status = params.get("status")
        if status:
            values = []
            for item in status.split(","):
                values.append(item.strip())
            if values:
                queryset = queryset.filter(status__in=values)

        is_weekly_moment = params.get("is_weekly_moment")
        if is_weekly_moment is not None:
            if is_weekly_moment.lower() in ("true"):
                queryset = queryset.filter(is_weekly_moment=True)
            elif is_weekly_moment.lower() in ("false"):
                queryset = queryset.filter(is_weekly_moment=False)

        is_detail = bool(self.kwargs.get("pk")) if hasattr(self, "kwargs") else False
        if not is_detail and not params.get("status"):
            try:
                queryset = _filter_published(queryset)
            except Exception:
                try:
                    queryset = queryset.filter(status="published")
                except Exception:
                    pass
            try:
                queryset = queryset.filter(category__is_active=True)
            except Exception:
                pass

        return queryset.order_by("-created_at")

    @action(detail=False, methods=("get",), url_path="tags", url_name="tags")
    def tags(self, request):
        """Return a list of unique tags used by Event objects.
        Optional query params:
        - q: substring to filter tags (case-insensitive)
        - limit: integer to limit number of returned tags
        """
        q = request.query_params.get("q")
        try:
            limit = (
                int(request.query_params.get("limit"))
                if request.query_params.get("limit")
                else None
            )
        except Exception:
            limit = None

        # Gather all tags (stored as JSON list on the Event model)
        all_tag_lists = Event.objects.values_list("tags", flat=True)
        unique_tags = set()
        for tag_list in all_tag_lists:
            if not tag_list:
                continue
            # tags stored as list; defensive handling if stored otherwise
            if isinstance(tag_list, (list, tuple)):
                for t in tag_list:
                    if t is None:
                        continue
                    s = str(t).strip()
                    if s:
                        unique_tags.add(s)
            else:
                # fallback: if someone stored a comma-separated string
                for t in str(tag_list).split(","):
                    s = t.strip()
                    if s:
                        unique_tags.add(s)

        tags = sorted(unique_tags, key=lambda x: x.lower())
        if q:
            ql = q.lower()
            tags = [t for t in tags if ql in t.lower()]

        if limit is not None:
            tags = tags[:limit]

        return Response({"tags": tags})

    # add new action last 5 posted for Event
    @action(
        detail=False, methods=("get",), url_path="last-posted", url_name="last_posted"
    )
    def last_posted(self, request):
        """Return last posted instances for this resource.
        Query params:
        - limit: int (default 5)
        """
        try:
            limit = int(request.query_params.get("limit", 5))
        except Exception:
            limit = 5

        qs = self.get_queryset()
        qs = qs.order_by("-created_at")[:limit]

        # annotate likes info as well so serializers can show likes_count/has_liked
        serializer = self.get_serializer(qs, many=True, context={"request": request})
        return Response(serializer.data)

    @action(
        detail=False,
        methods=("get",),
        url_path="weekly-moments",
        url_name="weekly_moments",
    )
    def weekly_moments(self, request):
        """Return Event items flagged as weekly moments and published."""
        qs = self.get_queryset()
        try:
            qs = qs.filter(is_weekly_moment=True)
        except Exception:
            pass

        qs = _filter_published(qs)

        page = self.paginate_queryset(qs)
        if page is not None:
            serializer = self.get_serializer(
                page, many=True, context={"request": request}
            )
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(qs, many=True, context={"request": request})
        return Response(serializer.data)


class BookViewSet(viewsets.ModelViewSet):
    """ViewSet for managing Book content."""

    queryset = Book.objects.all()
    serializer_class = BookSerializer
    search_fields = ("name",)
    ordering_fields = ("created_at",)
    pagination_class = LimitOffsetPagination

    @swagger_auto_schema(
        operation_summary="List all books",
        operation_description="Retrieve a list of books with optional filtering by author, publisher, language, and tags.",
    )
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)


class TeamMemberViewSet(viewsets.ModelViewSet):
    """ViewSet for managing TeamMember content."""

    queryset = TeamMember.objects.all()
    serializer_class = TeamMemberSerializer
    search_fields = ("name", "job_title", "position__name")
    ordering_fields = ("name", "created_at")
    filterset_fields = ("name", "job_title", "position__name")
    pagination_class = LimitOffsetPagination
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]

    @swagger_auto_schema(
        operation_summary="List all team members",
        operation_description="Retrieve a list of team members with optional filtering by name, job title, and position.",
        manual_parameters=team_member_manual_parameters,
    )
    def list(self, request, *args, **kwargs):
        if "limit" in request.query_params or "offset" in request.query_params:
            return super().list(request, *args, **kwargs)
        queryset = self.filter_queryset(self.get_queryset())
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    def get_queryset(self):
        queryset = super().get_queryset()
        params = self.request.query_params

        position = params.get("Position")
        if position:
            queryset = queryset.filter(position__name__iexact=position)

        return queryset


class HistoryEntryViewSet(viewsets.ModelViewSet):
    """ViewSet for managing HistoryEntry content."""

    queryset = HistoryEntry.objects.all()
    serializer_class = HistoryEntrySerializer
    search_fields = ("title", "description")
    ordering_fields = ("story_date", "created_at")


class LearnCategoryViewSet(viewsets.ModelViewSet):
    """ViewSet for managing LearnCategory content with multi-language support."""

    queryset = LearnCategory.objects.all()
    serializer_class = LearnCategorySerializer
    pagination_class = LimitOffsetPagination
    search_fields = ("name", "key")
    ordering_fields = ("order", "created_at")
    queryset = LearnCategory.objects.all().order_by("order", "-created_at")

    @swagger_auto_schema(
        operation_summary="List all learn categories",
        operation_description="Retrieve a list of learn categories with optional filtering by is_active status, language, or key.",
        manual_parameters=learn_category_manual_parameters,
    )
    @action(detail=False, methods=["get"], url_path="by-type")
    def by_type(self, request):
        learn_type = request.query_params.get("type")

        if not learn_type:
            return Response(
                {"detail": "type parameter is required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        queryset = self.get_queryset().filter(learn_type=learn_type)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    def list(self, request, *args, **kwargs):
        """List endpoint documented with is_active filter for Swagger."""
        return super().list(request, *args, **kwargs)


class ContentCategoryViewSet(viewsets.ModelViewSet):
    """ViewSet for managing ContentCategory content with multi-language support."""

    queryset = ContentCategory.objects.all()
    serializer_class = ContentCategorySerializer
    pagination_class = LimitOffsetPagination
    search_fields = ("name", "key")
    ordering_fields = ("order", "created_at")
    queryset = ContentCategory.objects.all().order_by("order", "-created_at")

    @swagger_auto_schema(
        operation_summary="List all content categories",
        operation_description="Retrieve a list of content categories with optional filtering by is_active status, language, or key.",
        manual_parameters=content_category_manual_parameters,
    )
    def list(self, request, *args, **kwargs):
        """List endpoint documented with is_active filter for Swagger."""
        return super().list(request, *args, **kwargs)

    def get_serializer_context(self):
        """Add include_translations flag to serializer context."""
        context = super().get_serializer_context()
        context["include_translations"] = (
            self.request.query_params.get("include_translations", "false").lower()
            == "true"
        )
        return context

    def get_queryset(self):
        queryset = super().get_queryset()
        is_active = self.request.query_params.get("is_active")
        language = self.request.query_params.get("language")
        key = self.request.query_params.get("key")

        if is_active is not None:
            queryset = queryset.filter(is_active=is_active)
        if language:
            queryset = queryset.filter(language=language)
        if key:
            queryset = queryset.filter(key=key)
        try:
            queryset = queryset.annotate(content_count=Count("content"))
        except Exception:
            pass
        return queryset

    @action(
        detail=False,
        methods=["get"],
        url_path="by-key/(?P<key>[^/.]+)",
        url_name="by-key",
    )
    def by_key(self, request, key=None):
        """Get all translations for a specific category key."""
        categories = ContentCategory.objects.filter(key=key).order_by("language")
        if not categories.exists():
            return Response(
                {"detail": "No categories found with this key."},
                status=status.HTTP_404_NOT_FOUND,
            )
        serializer = self.get_serializer(categories, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=("post",), url_path="reorder", url_name="reorder")
    def reorder(self, request):
        """Reorder ContentCategories based on provided order.

        Body: { "categories": [{"id": 1, "order": 0}, {"id": 2, "order": 1}, ...] }
        """
        try:
            categories_data = request.data.get("categories", [])
            for item in categories_data:
                category_id = item.get("id")
                order_value = item.get("order")
                if category_id is not None and order_value is not None:
                    ContentCategory.objects.filter(id=category_id).update(
                        order=order_value
                    )
            return Response(
                {"detail": "Categories reordered successfully."},
                status=status.HTTP_200_OK,
            )
        except Exception as e:
            return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=("get",), url_path="contents", url_name="contents")
    def contents(self, request, pk=None):
        """Return Content objects belonging to this ContentCategory."""
        try:
            category = self.get_object()
        except Exception:
            return Response(
                {"detail": "ContentCategory not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        qs = Content.objects.filter(category=category).order_by("-created_at")

        page = self.paginate_queryset(qs)
        if page is not None:
            serializer = ContentSerializer(
                page, many=True, context={"request": request}
            )
            return self.get_paginated_response(serializer.data)

        serializer = ContentSerializer(qs, many=True, context={"request": request})
        return Response(serializer.data)


class ContentAttachmentViewSet(viewsets.ModelViewSet):
    """ViewSet for managing ContentAttachment content."""

    queryset = ContentAttachment.objects.all()
    serializer_class = ContentAttachmentSerializer
    search_fields = ("file_name",)
    ordering_fields = ("created_at",)

    def create(self, request, *args, **kwargs):
        """Create a ContentAttachment with uploaded file."""
        file = request.FILES.get("file")
        if not file:
            return Response(
                {"error": "file is required"}, status=status.HTTP_400_BAD_REQUEST
            )

        attachment = ContentAttachment.objects.create(
            file=file,
            file_name=request.data.get("file_name", file.name),
            file_size=file.size,
            description=request.data.get("description", ""),
        )

        serializer = self.get_serializer(attachment)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class EventCategoryViewSet(viewsets.ModelViewSet):
    """ViewSet for managing EventCategory content with multi-language support."""

    queryset = EventCategory.objects.all()
    serializer_class = EventCategorySerializer
    pagination_class = LimitOffsetPagination
    search_fields = ("name", "key")
    ordering_fields = ("order", "created_at")
    queryset = EventCategory.objects.all().order_by("order", "-created_at")

    @swagger_auto_schema(
        operation_summary="List all event categories",
        operation_description="Retrieve a list of event categories with optional filtering by is_active status, language, or key.",
        manual_parameters=event_category_manual_parameters,
    )
    def list(self, request, *args, **kwargs):
        """List endpoint documented with is_active filter for Swagger."""
        return super().list(request, *args, **kwargs)

    def get_serializer_context(self):
        """Add include_translations flag to serializer context."""
        context = super().get_serializer_context()
        context["include_translations"] = (
            self.request.query_params.get("include_translations", "false").lower()
            == "true"
        )
        return context

    def get_queryset(self):
        queryset = super().get_queryset()
        is_active = self.request.query_params.get("is_active")
        language = self.request.query_params.get("language")
        key = self.request.query_params.get("key")

        if is_active is not None:
            queryset = queryset.filter(is_active=is_active)
        if language:
            queryset = queryset.filter(language=language)
        if key:
            queryset = queryset.filter(key=key)
        try:
            queryset = queryset.annotate(event_count=Count("event"))
        except Exception:
            pass
        return queryset

    @action(
        detail=False,
        methods=["get"],
        url_path="by-key/(?P<key>[^/.]+)",
        url_name="by-key",
    )
    def by_key(self, request, key=None):
        """Get all translations for a specific category key."""
        categories = EventCategory.objects.filter(key=key).order_by("language")
        if not categories.exists():
            return Response(
                {"detail": "No categories found with this key."},
                status=status.HTTP_404_NOT_FOUND,
            )
        serializer = self.get_serializer(categories, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=("post",), url_path="reorder", url_name="reorder")
    def reorder(self, request):
        """Reorder EventCategories based on provided order.

        Body: { "categories": [{"id": 1, "order": 0}, {"id": 2, "order": 1}, ...] }
        """
        try:
            categories_data = request.data.get("categories", [])
            for item in categories_data:
                category_id = item.get("id")
                order_value = item.get("order")
                if category_id is not None and order_value is not None:
                    EventCategory.objects.filter(id=category_id).update(
                        order=order_value
                    )
            return Response(
                {"detail": "Categories reordered successfully."},
                status=status.HTTP_200_OK,
            )
        except Exception as e:
            return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=("get",), url_path="events", url_name="events")
    def events(self, request, pk=None):
        """Return Event objects belonging to this EventCategory."""
        try:
            category = self.get_object()
        except Exception:
            return Response(
                {"detail": "EventCategory not found."}, status=status.HTTP_404_NOT_FOUND
            )

        # Ensure category is active (mirror VideoCategory.videos / PostCategory.posts behavior)
        if not getattr(category, "is_active", True):
            return Response(
                {"detail": "EventCategory not active."},
                status=status.HTTP_404_NOT_FOUND,
            )

        # Only include published events in this category
        published_qs = Event.objects.filter(category=category)
        try:
            published_qs = _filter_published(published_qs)
        except Exception:
            try:
                published_qs = published_qs.filter(status="published")
            except Exception:
                pass

        if not published_qs.exists():
            return Response(
                {"detail": "No published events in this category."},
                status=status.HTTP_404_NOT_FOUND,
            )

        qs = published_qs.order_by("-happened_at", "-created_at")

        page = self.paginate_queryset(qs)
        if page is not None:
            serializer = EventSerializer(page, many=True, context={"request": request})
            return self.get_paginated_response(serializer.data)

        serializer = EventSerializer(qs, many=True, context={"request": request})
        return Response(serializer.data)


class BookCategoryViewSet(viewsets.ModelViewSet):
    """ViewSet for managing BookCategory content with multi-language support."""

    queryset = BookCategory.objects.all()
    serializer_class = BookCategorySerializer
    search_fields = ("name", "key")
    ordering_fields = ("order", "created_at")
    queryset = BookCategory.objects.all().order_by("order", "-created_at")

    def get_serializer_context(self):
        """Add include_translations flag to serializer context."""
        context = super().get_serializer_context()
        context["include_translations"] = (
            self.request.query_params.get("include_translations", "false").lower()
            == "true"
        )
        return context

    def get_queryset(self):
        queryset = super().get_queryset()
        is_active = self.request.query_params.get("is_active")
        language = self.request.query_params.get("language")
        key = self.request.query_params.get("key")

        if is_active is not None:
            queryset = queryset.filter(is_active=is_active)
        if language:
            queryset = queryset.filter(language=language)
        if key:
            queryset = queryset.filter(key=key)
        try:
            queryset = queryset.annotate(book_count=Count("book"))
        except Exception:
            pass
        return queryset

    @action(
        detail=False,
        methods=["get"],
        url_path="by-key/(?P<key>[^/.]+)",
        url_name="by-key",
    )
    def by_key(self, request, key=None):
        """Get all translations for a specific category key."""
        categories = BookCategory.objects.filter(key=key).order_by("language")
        if not categories.exists():
            return Response(
                {"detail": "No categories found with this key."},
                status=status.HTTP_404_NOT_FOUND,
            )
        serializer = self.get_serializer(categories, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=("post",), url_path="reorder", url_name="reorder")
    def reorder(self, request):
        """Reorder ContentCategories based on provided order.

        Body: { "categories": [{"id": 1, "order": 0}, {"id": 2, "order": 1}, ...] }
        """
        try:
            categories_data = request.data.get("categories", [])
            for item in categories_data:
                category_id = item.get("id")
                order_value = item.get("order")
                if category_id is not None and order_value is not None:
                    BookCategory.objects.filter(id=category_id).update(
                        order=order_value
                    )
            return Response(
                {"detail": "Categories reordered successfully."},
                status=status.HTTP_200_OK,
            )
        except Exception as e:
            return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=("get",), url_path="books", url_name="books")
    def books(self, request, pk=None):
        """Return all books related to this BookCategory (by id)."""
        books = Book.objects.filter(category_id=pk)
        serializer = BookSerializer(books, many=True, context={"request": request})
        return Response(serializer.data)


class PositionTeamMemberViewSet(viewsets.ModelViewSet):
    """ViewSet for managing PositionTeamMember content."""

    queryset = PositionTeamMember.objects.all()
    serializer_class = PositionTeamMemberSerializer
    search_fields = ("name",)
    ordering_fields = ("created_at",)


class SeasonIdViewSet(viewsets.ModelViewSet):
    """ViewSet for managing SeasonId content."""

    queryset = SeasonId.objects.all()
    serializer_class = SeasonIdSerializer
    search_fields = ("season_title__name",)
    ordering_fields = ("-created_at",)

    @action(detail=True, methods=("get",), url_path="videos", url_name="videos")
    def videos(self, request, pk=None):
        """Return all Video objects associated with this SeasonId.
        URL: /.../seasonid/{id}/videos/
        Videos are ordered by happened_at (newest first) then created_at.
        Supports pagination if the viewset/router has pagination configured.
        """
        try:
            season = self.get_object()
        except Exception:
            return Response(
                {"detail": "SeasonId not found."}, status=status.HTTP_404_NOT_FOUND
            )

        # Videos point to SeasonId via Video.season_name
        # Only include published videos whose related category is active.
        qs = Video.objects.filter(season_name=season)
        try:
            qs = _filter_published(qs)
        except Exception:
            try:
                qs = qs.filter(status="published")
            except Exception:
                pass

        try:
            qs = qs.filter(category__is_active=True)
        except Exception:
            # model may not have category relation in some edge cases
            pass

        # Order season videos by creation time (newest first)
        qs = qs.order_by("-created_at")

        # paginate if pagination is configured on the view
        page = self.paginate_queryset(qs)
        if page is not None:
            serializer = VideoSerializer(page, many=True, context={"request": request})
            return self.get_paginated_response(serializer.data)

        serializer = VideoSerializer(qs, many=True, context={"request": request})
        return Response(serializer.data)


class SeasonTitleViewSet(viewsets.ModelViewSet):
    """ViewSet for managing SeasonTitle content."""

    queryset = SeasonTitle.objects.all()
    serializer_class = SeasonTitleSerializer
    search_fields = ("name",)
    # SeasonTitle model does not have created_at; allow ordering by name instead
    ordering_fields = ("name",)

    @action(detail=True, methods=("get",), url_path="season-ids", url_name="season_ids")
    def season_ids(self, request, pk=None):
        """Return SeasonId objects linked to this SeasonTitle.

        GET /api/v1/season-titles/{pk}/season-ids/
        """
        try:
            season_title = self.get_object()
        except Exception:
            return Response(
                {"detail": "SeasonTitle not found."}, status=status.HTTP_404_NOT_FOUND
            )

        # SeasonId doesn't have a created_at timestamp; order by the season_id field instead
        qs = SeasonId.objects.filter(season_title=season_title).order_by("season_id")

        page = self.paginate_queryset(qs)
        if page is not None:
            serializer = SeasonIdSerializer(
                page, many=True, context={"request": request}
            )
            return self.get_paginated_response(serializer.data)

        serializer = SeasonIdSerializer(qs, many=True, context={"request": request})
        return Response(serializer.data)


class VideoCategoryViewSet(viewsets.ModelViewSet):
    """ViewSet for managing VideoCategory content with multi-language support."""

    queryset = VideoCategory.objects.all()
    serializer_class = VideoCategorySerializer
    pagination_class = LimitOffsetPagination
    search_fields = ("name", "key")
    ordering_fields = ("order", "created_at")
    queryset = VideoCategory.objects.all().order_by("order", "-created_at")

    @swagger_auto_schema(
        operation_summary="List all video categories",
        operation_description="Retrieve a list of video categories with optional filtering by is_active status, language, or key.",
        manual_parameters=video_category_manual_parameters,
    )
    def list(self, request, *args, **kwargs):
        """List endpoint documented with is_active filter for Swagger."""
        return super().list(request, *args, **kwargs)

    def get_serializer_context(self):
        """Add include_translations flag to serializer context."""
        context = super().get_serializer_context()
        context["include_translations"] = (
            self.request.query_params.get("include_translations", "false").lower()
            == "true"
        )
        return context

    def get_queryset(self):
        queryset = super().get_queryset()
        is_active = self.request.query_params.get("is_active")
        language = self.request.query_params.get("language")
        key = self.request.query_params.get("key")

        if is_active is not None:
            queryset = queryset.filter(is_active=is_active)
        if language:
            queryset = queryset.filter(language=language)
        if key:
            queryset = queryset.filter(key=key)

        try:
            queryset = queryset.annotate(video_count=Count("video"))
        except Exception:
            pass

        return queryset

    @action(
        detail=False,
        methods=["get"],
        url_path="by-key/(?P<key>[^/.]+)",
        url_name="by-key",
    )
    def by_key(self, request, key=None):
        """Get all translations for a specific category key."""
        categories = VideoCategory.objects.filter(key=key).order_by("language")
        if not categories.exists():
            return Response(
                {"detail": "No categories found with this key."},
                status=status.HTTP_404_NOT_FOUND,
            )
        serializer = self.get_serializer(categories, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=("post",), url_path="reorder", url_name="reorder")
    def reorder(self, request):
        """Reorder VideoCategories based on provided order.

        Body: { "categories": [{"id": 1, "order": 0}, {"id": 2, "order": 1}, ...] }
        """
        try:
            categories_data = request.data.get("categories", [])
            for item in categories_data:
                category_id = item.get("id")
                order_value = item.get("order")
                if category_id is not None and order_value is not None:
                    VideoCategory.objects.filter(id=category_id).update(
                        order=order_value
                    )
            return Response(
                {"detail": "Categories reordered successfully."},
                status=status.HTTP_200_OK,
            )
        except Exception as e:
            return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=("get",), url_path="videos", url_name="videos")
    def videos(self, request, pk=None):
        """Return Video objects belonging to this VideoCategory."""
        try:
            category = self.get_object()
        except Exception:
            return Response(
                {"detail": "VideoCategory not found."}, status=status.HTTP_404_NOT_FOUND
            )
        # Ensure category is active
        if not getattr(category, "is_active", True):
            return Response(
                {"detail": "VideoCategory not active."},
                status=status.HTTP_404_NOT_FOUND,
            )

        # Only expose the category when it has at least one published video.
        published_qs = Video.objects.filter(category=category)
        try:
            published_qs = _filter_published(published_qs)
        except Exception:
            try:
                published_qs = published_qs.filter(status="published")
            except Exception:
                pass

        try:
            published_qs = published_qs.filter(category__is_active=True)
        except Exception:
            pass

        if not published_qs.exists():
            return Response(
                {"detail": "No published videos in this category."},
                status=status.HTTP_404_NOT_FOUND,
            )

        qs = published_qs.order_by("-created_at")
        page = self.paginate_queryset(qs)
        if page is not None:
            serializer = VideoSerializer(page, many=True, context={"request": request})
            return self.get_paginated_response(serializer.data)

        serializer = VideoSerializer(qs, many=True, context={"request": request})
        return Response(serializer.data)


class EventSectionViewSet(viewsets.ModelViewSet):
    """ViewSet for managing EventSection content."""

    queryset = EventSection.objects.all()
    serializer_class = EventSectionSerializer
    search_fields = ("name",)
    ordering_fields = ("created_at",)

    @action(
        detail=False,
        methods=("get",),
        url_path="top-with-events",
        url_name="top_with_events",
    )
    def top_with_events(self, request):
        """Return top N EventSections ordered by number of events, including their events.

        Query params:
        - limit: int (default 3) number of sections to return
        - events_limit: optional int to limit number of events returned per section (default: all)
        """
        try:
            limit = int(request.query_params.get("limit", 3))
        except Exception:
            limit = 3

        try:
            events_limit = request.query_params.get("events_limit")
            events_limit = int(events_limit) if events_limit is not None else None
        except Exception:
            events_limit = None

        # annotate sections by number of related Event objects and pick top N
        sections_qs = EventSection.objects.annotate(
            events_count=Count("event")
        ).order_by("-events_count")[:limit]

        result = []
        for section in sections_qs:
            # get events for this section; use section.events() helper
            events_qs = section.events().order_by("-happened_at", "-created_at")
            try:
                events_qs = _filter_published(events_qs)
            except Exception:
                pass
            if events_limit is not None:
                events_qs = events_qs[:events_limit]

            section_data = EventSectionSerializer(
                section, context={"request": request}
            ).data
            events_data = EventSerializer(
                events_qs, many=True, context={"request": request}
            ).data

            result.append(
                {
                    "section": section_data,
                    "events": events_data,
                    "events_count": getattr(section, "events_count", len(events_data)),
                }
            )

        return Response(result)

    @action(
        detail=False,
        methods=("get",),
        url_path="top-with-top-liked",
        url_name="top_with_top_liked",
    )
    def top_with_top_liked(self, request):
        """Return top N EventSections each containing their top M events ordered by likes.

        Query params:
        - limit: int (default 3) number of sections to return
        - events_limit: int (default 5) number of top-liked events to include per section
        """
        try:
            limit = int(request.query_params.get("limit", 3))
        except Exception:
            limit = 3

        try:
            events_limit = request.query_params.get("events_limit")
            events_limit = int(events_limit) if events_limit is not None else 5
        except Exception:
            events_limit = 5

        # pick top sections by number of related Event objects (same as top_with_events)
        sections_qs = EventSection.objects.annotate(
            events_count=Count("event")
        ).order_by("-events_count")[:limit]

        result = []
        for section in sections_qs:
            # get events for this section
            events_qs = section.events().all()
            try:
                events_qs = _filter_published(events_qs)
            except Exception:
                pass

            # order by annotated likes count (fallback to created_at)
            try:
                events_qs = events_qs.order_by("-created_at")[:events_limit]
            except Exception:
                events_qs = events_qs[:events_limit]

            section_data = EventSectionSerializer(
                section, context={"request": request}
            ).data
            events_data = EventSerializer(
                events_qs, many=True, context={"request": request}
            ).data

            result.append(
                {
                    "section": section_data,
                    "top_5": events_data,
                }
            )

        return Response(result)


class GlobalSearchViewSet(viewsets.ViewSet):
    """
    ViewSet for searching across multiple content models by title.
    Query parameters:
    - q: search term (required)
    - limit: per-type result limit (optional, default is 5)
    Returns a JSON object with keys:
    - videos
    - posts
    - events
    - weekly_moments
    - contents
    Each key contains a list of serialized objects.
    """

    @swagger_auto_schema(
        description="Search across Videos, Posts, Events, and Weekly Moments by title.",
        manual_parameters=global_search_manual_parameters,
    )
    def list(self, request):
        search_term = request.query_params.get("q", "")
        if not search_term:
            return Response(
                {"detail": "Query parameter 'q' is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # safety cap per model to avoid huge queries; page size is controlled by paginator
        try:
            per_model_cap = int(request.query_params.get("per_model", 50))
        except Exception:
            per_model_cap = 50

        # build per-model querysets and ensure only published items are considered
        video_q = Video.objects.filter(title__icontains=search_term).order_by(
            "-created_at"
        )[:per_model_cap]
        try:
            video_q = _filter_published(video_q)
        except Exception:
            pass
        # only include videos whose category is active
        try:
            video_q = video_q.filter(category__is_active=True)
        except Exception:
            pass

        post_q = Post.objects.filter(title__icontains=search_term).order_by(
            "-created_at"
        )[:per_model_cap]
        try:
            post_q = _filter_published(post_q)
        except Exception:
            pass
        # only include posts whose category is active
        try:
            post_q = post_q.filter(category__is_active=True)
        except Exception:
            pass

        event_q = Event.objects.filter(title__icontains=search_term).order_by(
            "-created_at"
        )[:per_model_cap]
        try:
            event_q = _filter_published(event_q)
        except Exception:
            pass
        # only include events whose category is active
        try:
            event_q = event_q.filter(category__is_active=True)
        except Exception:
            pass

        content_q = Content.objects.filter(title__icontains=search_term).order_by(
            "-created_at"
        )[:per_model_cap]
        try:
            content_q = _filter_published(content_q)
        except Exception:
            pass
        # only include contents whose category is active
        try:
            content_q = content_q.filter(category__is_active=True)
        except Exception:
            pass

        combined = []

        # sort by created_at (newest first)
        combined.sort(
            key=lambda t: getattr(t[0], "created_at", None) or 0, reverse=True
        )

        # paginate combined list using LimitOffsetPagination; default page size = 10
        paginator = LimitOffsetPagination()
        paginator.default_limit = 10
        page = paginator.paginate_queryset(combined, request, view=self)

        results = []
        for item in page or []:
            obj, kind = item
            if kind == "video":
                data = VideoSerializer(obj, context={"request": request}).data
            elif kind == "post":
                data = PostSerializer(obj, context={"request": request}).data
            elif kind == "event":
                data = EventSerializer(obj, context={"request": request}).data
            elif kind == "content":
                data = ContentSerializer(obj, context={"request": request}).data
            else:
                continue

            data["_type"] = kind
            results.append(data)

        return paginator.get_paginated_response(results)


class NavbarLogoViewSet(viewsets.ModelViewSet):
    """ViewSet for retrieving the NavbarLogo."""

    queryset = NavbarLogo.objects.all()
    serializer_class = NavbarLogoSerializer


class SocialMediaViewSet(viewsets.ModelViewSet):
    """ViewSet for retrieving SocialMedia links."""

    queryset = SocialMedia.objects.all()
    serializer_class = SocialMediaSerializer
    search_fields = ("platform",)
    ordering_fields = ("platform", "created_at")
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ("platform",)


class SiteInfoViewSet(viewsets.ViewSet):
    """Combined endpoint returning/accepting site info: latest navbar logo and social media links.

    GET  /api/v1/site-info/ -> { logo: <NavbarLogo|null>, socialmedia: [ ... ] }
    POST /api/v1/site-info/ -> accept payload { logo: "...", socialmedia: [ {id?, platform, url}, ... ] }

    POST semantics: upsert socialmedia items (create if no id, update if id present) and create a new NavbarLogo row when `logo` is provided.
    By default POST will also remove SocialMedia rows not present in the payload (synchronize). If you want to avoid deletions send `?replace=false`.
    """

    def list(self, request):
        # latest logo
        logo = NavbarLogo.objects.order_by("-created_at").first()
        logo_data = (
            NavbarLogoSerializer(logo, context={"request": request}).data
            if logo
            else None
        )

        # all social media links
        socials = SocialMedia.objects.all().order_by("-created_at")
        socials_data = SocialMediaSerializer(
            socials, many=True, context={"request": request}
        ).data

        # only include categories that are active (is_active == True)
        post_categories = (
            PostCategory.objects.filter(is_active=True)
            .annotate(post_count=Count("post"))
            .order_by("name")
        )
        video_categories = (
            VideoCategory.objects.filter(is_active=True)
            .annotate(video_count=Count("video"))
            .order_by("name")
        )
        event_categories = (
            EventCategory.objects.filter(is_active=True)
            .annotate(event_count=Count("event"))
            .order_by("name")
        )
        content_categories = (
            ContentCategory.objects.filter(is_active=True)
            .annotate(content_count=Count("content"))
            .order_by("name")
        )

        # serialize categories
        post_categories_data = PostCategorySerializer(
            post_categories, many=True, context={"request": request}
        ).data
        video_categories_data = VideoCategorySerializer(
            video_categories, many=True, context={"request": request}
        ).data
        event_categories_data = EventCategorySerializer(
            event_categories, many=True, context={"request": request}
        ).data
        content_categories_data = ContentCategorySerializer(
            content_categories, many=True, context={"request": request}
        ).data

        return Response(
            {
                "logo": logo_data,
                "socialmedia": socials_data,
                "post_categories": post_categories_data,
                "video_categories": video_categories_data,
                "event_categories": event_categories_data,
                "content_categories": content_categories_data,
            }
        )

    def create(self, request):
        payload = request.data or {}
        logo_val = payload.get("logo", None)
        social_list = payload.get("socialmedia", []) or []

        created_logo = None
        if logo_val is not None:
            # create a new NavbarLogo; accept a string path/URL and store it in the ImageField value
            nl = NavbarLogo.objects.create(logo=logo_val)
            created_logo = NavbarLogoSerializer(nl, context={"request": request}).data

        processed_ids = []
        result_socials = []
        for item in social_list:
            if not isinstance(item, dict):
                continue
            sid = item.get("id")
            platform = item.get("platform", "")
            url = item.get("url", "")
            if sid:
                try:
                    sm = SocialMedia.objects.get(pk=sid)
                    sm.platform = platform or sm.platform
                    sm.url = url or sm.url
                    sm.save()
                except SocialMedia.DoesNotExist:
                    sm = SocialMedia.objects.create(platform=platform, url=url)
            else:
                sm = SocialMedia.objects.create(platform=platform, url=url)

            processed_ids.append(sm.pk)
            result_socials.append(
                SocialMediaSerializer(sm, context={"request": request}).data
            )

        # By default synchronize: remove social rows not present in payload unless replace=false is passed
        replace = request.query_params.get("replace", "true").lower() not in (
            "0",
            "false",
            "no",
        )
        if replace and processed_ids:
            SocialMedia.objects.exclude(pk__in=processed_ids).delete()

        return Response(
            {"logo": created_logo, "socialmedia": result_socials},
            status=status.HTTP_201_CREATED,
        )


class AuthorsViewSet(viewsets.ModelViewSet):
    """ViewSet for managing Authors content."""

    queryset = Authors.objects.all()
    serializer_class = AuthorsSerializer
    pagination_class = LimitOffsetPagination
    search_fields = ("name", "description")
    ordering_fields = ("created_at", "name")
    queryset = Authors.objects.all().order_by("-created_at")
