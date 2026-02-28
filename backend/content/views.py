from django.conf import settings
from django.db.models import Count, F, Q
from rest_framework import viewsets, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.pagination import LimitOffsetPagination
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from django_filters.rest_framework import DjangoFilterBackend
from datetime import date
from drf_yasg.utils import swagger_auto_schema
from django.utils import timezone
from .enums import LearnType, VideoType, LearnCategoryDirection
from .youtube import YouTubeAPIError, fetch_video_info
from .swagger_parameters import (
    video_manual_parameters,
    learn_manual_parameters,
    video_category_manual_parameters,
    learn_category_manual_parameters,
    by_type_video_manual_parameters,
    team_member_manual_parameters,
    content_manual_parameters,
    content_category_manual_parameters,
)
from .models import (
    ContentAttachment,
    EventCommunity,
    VideoCategory,
    LearnCategory,
    Learn,
    Video,
    HistoryEntry,
    TeamMember,
    Content,
    ContentImage,
    ContentCategory,
    PositionTeamMember,
    SocialMedia,
    NavbarLogo,
    Authors,
    Book,
    BookCategory,
)
from .serializers import (
    ContentAttachmentSerializer,
    EventCommunitySerializer,
    VideoCategorySerializer,
    LearnCategorySerializer,
    VideoSerializer,
    LearnSerializer,
    HistoryEntrySerializer,
    ContentSerializer,
    TeamMemberSerializer,
    ContentCategorySerializer,
    PositionTeamMemberSerializer,
    SocialMediaSerializer,
    NavbarLogoSerializer,
    AuthorsSerializer,
    BookSerializer,
    BookCategorySerializer,
)


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


class VideoViewSet(viewsets.ModelViewSet):
    queryset = Video.objects.all()
    serializer_class = VideoSerializer
    search_fields = (
        "title",
        "guest_speakers",
    )
    ordering_fields = ("happened_at", "views", "created_at")
    filter_backends = [filters.SearchFilter]
    pagination_class = LimitOffsetPagination
    parser_classes = (MultiPartParser, FormParser, JSONParser)

    @swagger_auto_schema(
        operation_summary="all List videos",
        operation_description="Retrieve a list of videos with optional filtering by language, category, and happened_at date.",
        manual_parameters=video_manual_parameters,
    )
    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.views = instance.views + 1
        instance.save(update_fields=["views"])
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    def get_queryset(self):
        queryset = super().get_queryset()
        queryset = queryset.filter(category__is_active=True)
        params = self.request.query_params

        # Allow search filter to work before custom filtering
        if params.get("search"):
            return queryset.order_by("-created_at")

        language = params.getlist("language")
        if language:
            values = []
            for item in language:
                values.extend([v.strip() for v in item.split(",") if v.strip()])
            if values:
                queryset = queryset.filter(language__in=values)

        category = params.get("category")
        if category:
            values = [v.strip() for v in category.split(",") if v.strip()]
            if values:
                ids = [v for v in values if v.isdigit()]
                names = [v for v in values if not v.isdigit()]

                filters = []

                if ids:
                    filters.append(queryset.filter(category_id__in=ids))

                if names:
                    filters.append(queryset.filter(category__name__in=names))

                if filters:
                    queryset = filters[0]
                    for q in filters[1:]:
                        queryset = queryset.union(q)

        happened_at = params.get("happened_at")
        if happened_at:
            try:
                year, month = happened_at.split("-")
                queryset = queryset.filter(
                    happened_at__year=int(year),
                    happened_at__month=int(month),
                )
            except Exception:
                pass

        is_new = params.get("is_new")
        if is_new is not None:
            if is_new.lower() in ("true"):
                queryset = queryset.filter(is_new=True)
            elif is_new.lower() in ("false"):
                queryset = queryset.filter(is_new=False)

        # Add video_type filtering
        video_type = params.get("video_type")
        if video_type:
            values = [v.strip() for v in video_type.split(",") if v.strip()]
            if values:
                queryset = queryset.filter(video_type__in=values)

        return queryset.order_by("-created_at")

    @action(
        detail=False,
        methods=("post",),
        url_path="fetch-youtube-info",
    )
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

    # used for home page
    @swagger_auto_schema(
        operation_summary="Videos by type",
        operation_description="Return last 1 FULL_VIDEO and last 3 CLIP_VIDEO ordered newest → oldest.",
        manual_parameters=by_type_video_manual_parameters,
    )
    @action(
        detail=False,
        methods=["get"],
        url_path="by_type_video",
    )
    def by_type_video(self, request):
        """Return:
        - last 1 FULL_VIDEO
        - last 3 CLIP_VIDEO
        """

        def base_queryset(video_type_value):
            return Video.objects.filter(
                video_type=video_type_value,
                category__is_active=True,
            ).order_by("-created_at")

        full_video_qs = base_queryset(VideoType.FULL_VIDEO)[:1]
        clip_video_qs = base_queryset(VideoType.CLIP_VIDEO)[:3]
        payload = {
            "full_video": VideoSerializer(
                full_video_qs, many=True, context={"request": request}
            ).data,
            "clip_video": VideoSerializer(
                clip_video_qs, many=True, context={"request": request}
            ).data,
        }

        if not payload["full_video"] and not payload["clip_video"]:
            return Response(
                {"detail": "No videos found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        return Response(payload, status=status.HTTP_200_OK)

    # used for video page
    @swagger_auto_schema(
        operation_summary="Top viewed videos",
        operation_description="Return videos ordered by views desc with pagination support.",
    )
    @action(detail=False, methods=["get"], url_path="top-views")
    def top_views(self, request):
        qs = self.get_queryset().filter(category__is_active=True).order_by("-views")

        page = self.paginate_queryset(qs)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(qs, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class VideoCategoryViewSet(viewsets.ModelViewSet):
    """ViewSet for managing VideoCategory content with multi-language support."""

    queryset = VideoCategory.objects.all()
    serializer_class = VideoCategorySerializer
    pagination_class = LimitOffsetPagination
    search_fields = ("name",)
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

    def get_queryset(self):
        queryset = super().get_queryset()
        params = self.request.query_params
        is_active = self.request.query_params.get("is_active")
        language = self.request.query_params.get("language")

        if params.get("search"):
            return queryset.order_by("-created_at")

        if is_active is not None:
            queryset = queryset.filter(is_active=is_active)
        if language:
            queryset = queryset.filter(language=language)
        try:
            queryset = queryset.annotate(video_count=Count("video"))
        except Exception:
            pass

        return queryset

    def get_serializer_context(self):
        """Add include_translations flag to serializer context."""
        context = super().get_serializer_context()
        context["include_translations"] = (
            self.request.query_params.get("include_translations", "false").lower()
            == "true"
        )
        return context

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


class LearnViewSet(viewsets.ModelViewSet):
    queryset = Learn.objects.all()
    serializer_class = LearnSerializer
    pagination_class = LimitOffsetPagination
    search_fields = ("title", "category__name")
    ordering_fields = ("views", "created_at", "happened_at")
    ordering = ("-created_at",)
    filter_backends = [
        filters.SearchFilter,
        filters.OrderingFilter,
        DjangoFilterBackend,
    ]

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

        if params.get("search"):
            return queryset.order_by("happened_at")

        happened_at = params.get("happened_at")
        if happened_at:
            try:
                year, month = happened_at.split("-")
                queryset = queryset.filter(
                    happened_at__year=int(year),
                    happened_at__month=int(month),
                )
            except Exception:
                pass

        # Add LearnCategory.learn_type filtering
        learn_type = params.get("learn_type")
        if learn_type:
            values = [item.strip() for item in learn_type.split(",") if item.strip()]
            if values:
                queryset = queryset.filter(category__learn_type__in=values)

        category = params.get("category")
        if category:
            values = [item.strip() for item in category.split(",") if item.strip()]
            if values:
                queryset = queryset.filter(category__name__in=values)

        return queryset

    @swagger_auto_schema(
        operation_summary="List learns by type",
        operation_description="Return learns filtered by type.",
    )
    @action(
        detail=False,
        methods=("get",),
        url_path="by_type_learn",
        url_name="by_type_learn",
    )
    def by_type_learn(self, request):
        """
        Return:
        - most viewed 1 posters (only upcoming events)
        - last 3 cards:
            * 2 vertical
            * 1 horizontal
        """

        now = timezone.localtime()
        today = now.date()
        current_time = now.time()

        def base_queryset(learn_type_value):
            return Learn.objects.filter(
                category__learn_type=learn_type_value,
                category__is_active=True,
            )

        posters_qs = (
            base_queryset(LearnType.POSTERS)
            .filter(
                is_event=True,
                event_date__isnull=False,
                event_time__isnull=False,
            )
            .filter(
                Q(event_date__gt=today)
                | Q(event_date=today, event_time__gte=current_time)
            )
            .order_by("-views")[:1]
        )

        # Last 2 vertical
        vertical_cards = list(
            base_queryset(LearnType.CARDS)
            .filter(category__direction=LearnCategoryDirection.VERTICAL)
            .order_by("-created_at")[:2]
        )

        # Last 1 horizontal
        horizontal_cards = list(
            base_queryset(LearnType.CARDS)
            .filter(category__direction=LearnCategoryDirection.HORIZONTAL)
            .order_by("-created_at")[:1]
        )

        # Combine
        cards_combined = vertical_cards + horizontal_cards

        # Sort again by newest (optional but clean)
        cards_qs = sorted(
            cards_combined,
            key=lambda x: x.created_at,
            reverse=True,
        )

        payload = {
            "posters": LearnSerializer(
                posters_qs, many=True, context={"request": request}
            ).data,
            "cards": LearnSerializer(
                cards_qs, many=True, context={"request": request}
            ).data,
        }

        if not payload["posters"] and not payload["cards"]:
            return Response(
                {"detail": "No learn items found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        return Response(payload, status=status.HTTP_200_OK)


class LearnCategoryViewSet(viewsets.ModelViewSet):
    """ViewSet for managing LearnCategory content with multi-language support."""

    queryset = LearnCategory.objects.all()
    serializer_class = LearnCategorySerializer
    pagination_class = LimitOffsetPagination
    search_fields = ("name",)
    ordering_fields = ("order", "created_at")
    queryset = LearnCategory.objects.all().order_by("order", "-created_at")

    @swagger_auto_schema(
        operation_summary="List all learn categories",
        operation_description="Retrieve a list of learn categories with optional filtering by is_active status, language, or key.",
        manual_parameters=learn_category_manual_parameters,
    )
    def list(self, request, *args, **kwargs):
        """List endpoint documented with is_active filter for Swagger."""
        return super().list(request, *args, **kwargs)

    def get_queryset(self):
        queryset = super().get_queryset()
        params = self.request.query_params
        is_active = self.request.query_params.get("is_active")
        learn_type = self.request.query_params.get("learn_type")

        if params.get("search"):
            return queryset.order_by("-created_at")

        if is_active is not None:
            queryset = queryset.filter(is_active=is_active)

        created_at = params.get("created_at")
        if created_at:
            try:
                year, month = created_at.split("-")
                queryset = queryset.filter(
                    created_at__year=int(year),
                    created_at__month=int(month),
                )
            except Exception:
                pass

        if learn_type:
            values = [item.strip() for item in learn_type.split(",") if item.strip()]
            if values:
                queryset = queryset.filter(learn_type__in=values)

        try:
            queryset = queryset.annotate(learn_count=Count("learn"))
        except Exception:
            pass

        return queryset

    @swagger_auto_schema(
        operation_summary="Get learns by category",
        operation_description="Return learn items belonging to this LearnCategory with pagination. Optional ordering parameter can be applied.",
    )
    @action(detail=True, methods=["get"], url_path="learns")
    def learns(self, request, pk=None):
        """
        Return learn objects belonging to this LearnCategory with pagination.
        """
        category = self.get_object()
        learns = Learn.objects.filter(category=category).select_related("category")
        ordering = request.query_params.get("ordering")
        if ordering:
            learns = learns.order_by(ordering)

        page = self.paginate_queryset(learns)
        if page is not None:
            serializer = LearnSerializer(page, many=True, context={"request": request})
            return self.get_paginated_response(serializer.data)

        serializer = LearnSerializer(learns, many=True, context={"request": request})
        return Response(serializer.data)


class EventCommunityViewSet(viewsets.ModelViewSet):
    queryset = EventCommunity.objects.all()
    serializer_class = EventCommunitySerializer
    pagination_class = LimitOffsetPagination
    search_fields = ("name",)
    ordering_fields = ("-start_event_date",)
    filter_backends = [
        filters.SearchFilter,
        filters.OrderingFilter,
        DjangoFilterBackend,
    ]
    filterset_fields = ("learn__category__learn_type",)


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

        video_categories = (
            VideoCategory.objects.filter(is_active=True)
            .annotate(video_count=Count("video"))
            .order_by("name")
        )
        content_categories = (
            ContentCategory.objects.filter(is_active=True)
            .annotate(content_count=Count("content"))
            .order_by("name")
        )

        video_categories_data = VideoCategorySerializer(
            video_categories, many=True, context={"request": request}
        ).data
        content_categories_data = ContentCategorySerializer(
            content_categories, many=True, context={"request": request}
        ).data

        return Response(
            {
                "logo": logo_data,
                "socialmedia": socials_data,
                "video_categories": video_categories_data,
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
