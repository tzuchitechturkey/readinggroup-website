from collections import defaultdict

from django.conf import settings
from django.db.models import Count, F, Max
from rest_framework import viewsets, filters, status
from rest_framework.decorators import action
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response
from rest_framework.pagination import LimitOffsetPagination
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models.functions import TruncMonth
from drf_yasg.utils import swagger_auto_schema
from .enums import LearnType, VideoType, LearnCategoryDirection
from .youtube import YouTubeAPIError, fetch_video_info
from .daai_tv import DaaiTVError, fetch_daai_tv_info
from .swagger_parameters import (
    event_community_manual_parameters,
    learn_category_manual_parameters,
    video_category_manual_parameters,
    by_type_video_manual_parameters,
    video_manual_parameters,
    learn_manual_parameters,
)
from .models import (
    RelatedReportsCategory,
    ContentAttachment,
    HistoryEventImage,
    LatestNewsImage,
    PhotoCollection,
    RelatedReports,
    EventCommunity,
    VideoCategory,
    LearnCategory,
    HistoryEvent,
    OurTeamImage,
    SocialMedia,
    HistoryYear,
    BookReview,
    NavbarLogo,
    LatestNews,
    OurTeam,
    Learn,
    Video,
    Photo,
    Book,
)

from .serializers import (
    RelatedReportsCategorySerializer,
    ContentAttachmentSerializer,
    HistoryEventImageSerializer,
    PhotoCollectionSerializer,
    LatestNewsImageSerializer,
    RelatedReportsSerializer,
    EventCommunitySerializer,
    VideoCategorySerializer,
    LearnCategorySerializer,
    OurTeamImageSerializer,
    HistoryEventSerializer,
    HistoryYearSerializer,
    SocialMediaSerializer,
    LatestNewsSerializer,
    BookReviewSerializer,
    NavbarLogoSerializer,
    OurTeamSerializer,
    VideoSerializer,
    LearnSerializer,
    PhotoSerializer,
    BookSerializer,
)


# ========================================== new viewsets start ============================================
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
    """ViewSet for managing Video content with multi-language support."""

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
        operation_summary="Top viewed videos by category",
        operation_description="Return top viewed videos in the same category as the specified video.",
    )
    @action(detail=True, methods=["get"], url_path="top-views")
    def top_views(self, request, pk=None):
        # Get the current video instance
        video = self.get_object()

        # Get all videos with the same category_id, excluding the current video
        qs = (
            self.get_queryset()
            .filter(category_id=video.category_id, category__is_active=True)
            .exclude(id=video.id)
            .order_by("-views")
        )

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
    """ViewSet for managing Learn content with multi-language support."""

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
        operation_description="Return last 3 cards grouped by direction.",
    )
    @action(
        detail=False,
        methods=("get",),
        url_path="last-three-cards",
        url_name="last-three-cards",
    )
    def last_three_cards(self, request):
        """
        Return:
        - vertical: last 2 vertical cards
        - horizontal: last 1 horizontal card
        """

        def base_queryset():
            return Learn.objects.filter(
                category__learn_type=LearnType.CARDS,
                category__is_active=True,
            ).select_related("category")

        # Last 2 vertical
        vertical_qs = (
            base_queryset()
            .filter(category__direction=LearnCategoryDirection.VERTICAL)
            .order_by("-created_at")[:2]
        )

        # Last 1 horizontal
        horizontal_qs = (
            base_queryset()
            .filter(category__direction=LearnCategoryDirection.HORIZONTAL)
            .order_by("-created_at")[:1]
        )

        vertical_data = LearnSerializer(
            vertical_qs, many=True, context={"request": request}
        ).data

        horizontal_data = (
            LearnSerializer(horizontal_qs.first(), context={"request": request}).data
            if horizontal_qs
            else None
        )

        if not vertical_data and not horizontal_data:
            return Response(
                {"detail": "No learn items found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        return Response(
            {
                "vertical": vertical_data,
                "horizontal": horizontal_data,
            },
            status=status.HTTP_200_OK,
        )

    @swagger_auto_schema(
        operation_summary="Top viewed poster learn",
        operation_description="Return one poster learn with the highest views.",
    )
    @action(detail=False, methods=["get"], url_path="top-one-views-poster")
    def top_one_views_poster(self, request):
        """
        Return one poster learn with the highest views.
        """
        poster_learn = (
            Learn.objects.filter(
                category__learn_type=LearnType.POSTERS,
                category__is_active=True,
            )
            .order_by("-views")
            .first()
        )

        if not poster_learn:
            return Response(
                {"detail": "No poster learns found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        serializer = self.get_serializer(poster_learn, context={"request": request})
        return Response(serializer.data, status=status.HTTP_200_OK)


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

        try:
            queryset = queryset.annotate(learn_count=Count("learn"))
        except Exception:
            pass

        if getattr(self, "action", None) != "list":
            return queryset

        params = self.request.query_params
        is_active = params.get("is_active")
        learn_type = params.get("learn_type")

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

        created_at = request.query_params.get("created_at")
        if created_at:
            try:
                year, month = created_at.split("-")
                learns = learns.filter(
                    created_at__year=int(year),
                    created_at__month=int(month),
                )
            except Exception:
                pass
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
    """ViewSet for managing EventCommunity content with multi-language support."""

    queryset = EventCommunity.objects.all()
    serializer_class = EventCommunitySerializer
    pagination_class = LimitOffsetPagination
    search_fields = ("title",)
    ordering_fields = ("-start_event_date", "-start_event_time")
    filter_backends = [
        filters.SearchFilter,
        filters.OrderingFilter,
        DjangoFilterBackend,
    ]
    filterset_fields = ("learn__category__learn_type",)

    @swagger_auto_schema(
        operation_summary="List all event communities",
        operation_description="Retrieve a list of event communities with optional filtering by start_event_date and learn category type.",
        manual_parameters=event_community_manual_parameters,
    )
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    def get_queryset(self):
        queryset = super().get_queryset()
        params = self.request.query_params

        start_event_date = params.get("start_event_date")
        if start_event_date:
            try:
                year, month = start_event_date.split("-")
                queryset = queryset.filter(
                    start_event_date__year=int(year),
                    start_event_date__month=int(month),
                )
            except Exception:
                pass

        return queryset.order_by("-start_event_date", "-start_event_time")

    @swagger_auto_schema(
        operation_summary="Get event months",
        operation_description="Return all months that have EventCommunity posts.",
    )
    @action(detail=False, methods=["get"], url_path="event-months")
    def event_months(self, request):
        """
        GET /event-communities/event-months/
        Returns months grouped by year.
        """
        months = (
            EventCommunity.objects.filter(start_event_date__isnull=False)
            .annotate(month=TruncMonth("start_event_date"))
            .values_list("month", flat=True)
            .distinct()
            .order_by("month")
        )

        result = defaultdict(list)

        for month in months:
            year = month.strftime("%Y")
            month_num = month.strftime("%m")
            result[year].append(month_num)

        return Response(result)


class RelatedReportsCategoryViewSet(viewsets.ModelViewSet):
    """ViewSet for managing RelatedReportsCategory content with multi-language support."""

    queryset = RelatedReportsCategory.objects.all()
    serializer_class = RelatedReportsCategorySerializer
    pagination_class = LimitOffsetPagination
    search_fields = ("title",)
    ordering_fields = ("created_at",)
    ordering = ("-created_at",)
    filter_backends = [
        filters.SearchFilter,
        filters.OrderingFilter,
    ]
    queryset = RelatedReportsCategory.objects.all().order_by("-created_at")

    @swagger_auto_schema(
        operation_summary="Get related reports by category",
        operation_description="Return related reports belonging to this RelatedReportsCategory with pagination. Optional ordering parameter can be applied.",
    )
    @action(detail=True, methods=["get"], url_path="related-reports")
    def related_reports(self, request, pk=None):
        """
        Return related reports belonging to this RelatedReportsCategory with pagination.
        """
        category = self.get_object()
        related_reports = RelatedReports.objects.filter(category=category)

        created_at = request.query_params.get("created_at")
        if created_at:
            try:
                year, month = created_at.split("-")
                related_reports = related_reports.filter(
                    created_at__year=int(year),
                    created_at__month=int(month),
                )
            except Exception:
                pass
        ordering = request.query_params.get("ordering")
        if ordering:
            related_reports = related_reports.order_by(ordering)

        page = self.paginate_queryset(related_reports)
        if page is not None:
            serializer = RelatedReportsSerializer(
                page, many=True, context={"request": request}
            )
            return self.get_paginated_response(serializer.data)

        serializer = RelatedReportsSerializer(
            related_reports, many=True, context={"request": request}
        )
        return Response(serializer.data, status=status.HTTP_200_OK)


class RelatedReportsViewSet(viewsets.ModelViewSet):
    """ViewSet for managing RelatedReports content with multi-language support."""

    queryset = RelatedReports.objects.all()
    serializer_class = RelatedReportsSerializer
    pagination_class = LimitOffsetPagination
    search_fields = ("title", "category__title")
    ordering_fields = ("created_at", "happened_at")
    ordering = ("-created_at",)
    filter_backends = [
        filters.SearchFilter,
        filters.OrderingFilter,
        DjangoFilterBackend,
    ]
    parser_classes = (MultiPartParser, FormParser, JSONParser)

    def get_queryset(self):
        """Optimize queryset with select_related for category."""
        return RelatedReports.objects.select_related("category").all()

    def retrieve(self, request, *args, **kwargs):
        """Retrieve a single RelatedReports instance and increment its view count."""
        instance = self.get_object()
        instance.views = instance.views + 1
        instance.save(update_fields=["views"])
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

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

    @action(
        detail=False,
        methods=("post",),
        url_path="fetch-daai-tv-info",
    )
    def fetch_daai_tv_info(self, request):
        """Fetch video information from Daai TV website.

        POST /related-reports/fetch-daai-tv-info/
        Body: { "video_url": "https://www.daai.tv/program/P1840/P18400170" }
        """
        video_url = request.data.get("video_url") or request.data.get("url")
        if not video_url:
            return Response(
                {"detail": "video_url is required."}, status=status.HTTP_400_BAD_REQUEST
            )

        try:
            info = fetch_daai_tv_info(video_url)
        except DaaiTVError as exc:
            return Response({"detail": str(exc)}, status=status.HTTP_400_BAD_REQUEST)

        response_payload = {
            "program_id": info.program_id,
            "title": info.title,
            "description": info.description,
            "thumbnail_url": info.thumbnail_url,
            "video_url": info.video_url,
            "duration": info.duration,
            "published_at": info.published_at,
        }

        return Response(response_payload, status=status.HTTP_200_OK)

    # new endpoint to get 3 top views related reports for home page
    @swagger_auto_schema(
        operation_summary="Top viewed related reports",
        operation_description="Return top 3 related reports ordered by views.",
    )
    @action(detail=False, methods=["get"], url_path="top-views")
    def top_views(self, request):
        top_reports = RelatedReports.objects.filter(category__is_active=True).order_by(
            "-views"
        )[:3]

        serializer = self.get_serializer(
            top_reports, many=True, context={"request": request}
        )
        return Response(serializer.data, status=status.HTTP_200_OK)


class PhotoCollectionViewSet(viewsets.ModelViewSet):
    """ViewSet for managing photo collections."""

    queryset = PhotoCollection.objects.all()
    serializer_class = PhotoCollectionSerializer
    pagination_class = LimitOffsetPagination
    search_fields = ("title", "description")
    ordering_fields = ("-created_at", "-updated_at")
    parser_classes = (MultiPartParser, FormParser, JSONParser)
    filter_backends = [filters.SearchFilter]

    def get_queryset(self):
        queryset = PhotoCollection.objects.all().order_by("-created_at", "-updated_at")
        return queryset

    def perform_create(self, serializer):
        PhotoCollection.objects.update(is_new=False)
        serializer.save(is_new=True)

    def perform_update(self, serializer):
        # Preserve is_new status or update if needed
        instance = serializer.instance
        serializer.save()

    @swagger_auto_schema(
        operation_summary="Create photos in collection",
        operation_description="Create photos in this collection by uploading images. Supports multiple image upload with 'images' field or single image upload with 'image' field. Optional captions can be provided with 'caption_{index}' for multiple images or 'caption' for single image.",
    )
    @action(detail=True, methods=["post"], url_path="photos")
    def create_photos(self, request, pk=None):
        """Create photos for a specific collection.

        POST /photo-collection/{id}/photos/
        Accepts multiple images and creates photos in the collection.
        """
        collection = self.get_object()

        # Check if collection already has 30 photos
        current_count = collection.photos.count()
        if current_count >= 30:
            return Response(
                {"error": "This collection already has the maximum of 30 photos."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Get images from request
        images = request.FILES.getlist("images")
        if not images:
            # Try single image
            image = request.FILES.get("image")
            if image:
                images = [image]
            else:
                return Response(
                    {
                        "error": "No images provided. Use 'images' for multiple or 'image' for single upload."
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )

        # Check if adding these photos would exceed the limit
        if current_count + len(images) > 30:
            return Response(
                {
                    "error": f"Cannot add {len(images)} photos. Collection has {current_count} photos and limit is 30."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Create photos
        created_photos = []
        for idx, image in enumerate(images):
            caption = request.data.get(f"caption_{idx}", "") or request.data.get(
                "caption", ""
            )
            order = current_count + idx

            photo = Photo.objects.create(
                collection=collection,
                image=image,
                caption=caption,
                order=order,
            )
            created_photos.append(photo)

        serializer = PhotoSerializer(
            created_photos, many=True, context={"request": request}
        )
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    # get last 4 photo collections for home page
    @swagger_auto_schema(
        operation_summary="Get last 4 photo collections",
        operation_description="Return last 4 photo collections ordered by created_at desc.",
    )
    @action(detail=False, methods=["get"], url_path="last-4-photos")
    def last_four_photos(self, request):
        # Get the last 4 photo collections ordered by created_at descending
        collections = PhotoCollection.objects.order_by("-created_at")[:4]
        serializer = PhotoCollectionSerializer(
            collections, many=True, context={"request": request}
        )
        return Response(serializer.data)


class PhotoViewSet(viewsets.ModelViewSet):
    """ViewSet for managing individual photos."""

    queryset = Photo.objects.all()
    serializer_class = PhotoSerializer
    pagination_class = LimitOffsetPagination
    search_fields = ("caption",)
    ordering_fields = ("created_at", "order")
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]


class LatestNewsImageViewSet(viewsets.ModelViewSet):
    """ViewSet for managing individual images in latest news."""

    queryset = LatestNewsImage.objects.all()
    serializer_class = LatestNewsImageSerializer
    pagination_class = LimitOffsetPagination
    search_fields = ("caption",)
    ordering_fields = ("created_at", "order")
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]


class LatestNewsViewSet(viewsets.ModelViewSet):
    """ViewSet for managing latest news items."""

    queryset = LatestNews.objects.all()
    serializer_class = LatestNewsSerializer
    pagination_class = LimitOffsetPagination
    search_fields = ("title", "description")
    ordering_fields = ("created_at",)
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    parser_classes = (MultiPartParser, FormParser, JSONParser)

    @swagger_auto_schema(
        operation_summary="Create images for news item",
        operation_description="Add images to this news item by uploading. Supports multiple image upload with 'images' field or single image upload with 'image' field. Optional captions can be provided with 'caption_{index}' for multiple images or 'caption' for single image.",
    )
    def perform_create(self, serializer):
        LatestNews.objects.update(is_new=False)
        serializer.save(is_new=True)

    def perform_update(self, serializer):
        # Preserve is_new status or update if needed
        instance = serializer.instance
        serializer.save()

    @action(detail=True, methods=["post"], url_path="images")
    def create_images(self, request, pk=None):
        """Create images for a specific latest news item.

        POST /latest-news/{id}/images/
        Accepts multiple images and creates images for the news item.
        """
        news = self.get_object()

        # Get images from request
        images = request.FILES.getlist("images")
        if not images:
            # Try single image
            image = request.FILES.get("image")
            if image:
                images = [image]
            else:
                return Response(
                    {
                        "error": "No images provided. Use 'images' for multiple or 'image' for single upload."
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )

        # Get current count for ordering
        current_count = news.images.count()

        # Create images
        created_images = []
        for idx, image in enumerate(images):
            caption = request.data.get(f"caption_{idx}", "") or request.data.get(
                "caption", ""
            )
            order = current_count + idx

            news_image = LatestNewsImage.objects.create(
                latest_news=news,
                image=image,
                caption=caption,
                order=order,
            )
            created_images.append(news_image)

        serializer = LatestNewsImageSerializer(
            created_images, many=True, context={"request": request}
        )
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @swagger_auto_schema(
        operation_summary="Delete images from news item",
        operation_description="Delete one or more images from this news item. Provide image IDs in 'image_ids' array or single 'image_id'.",
    )
    @action(detail=True, methods=["delete"], url_path="images/delete")
    def delete_images(self, request, pk=None):
        """Delete images from a specific latest news item.

        DELETE /latest-news/{id}/images/delete/
        Body: {"image_ids": [1, 2, 3]} or {"image_id": 1}
        """
        news = self.get_object()

        # Get image IDs from request
        image_ids = request.data.get("image_ids", [])
        if not image_ids:
            # Try single image_id
            image_id = request.data.get("image_id")
            if image_id:
                image_ids = [image_id]
            else:
                return Response(
                    {
                        "error": "No image IDs provided. Use 'image_ids' array or single 'image_id'."
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )

        # Delete images that belong to this news item
        deleted_count, _ = LatestNewsImage.objects.filter(
            latest_news=news, id__in=image_ids
        ).delete()

        return Response(
            {
                "message": f"Successfully deleted {deleted_count} image(s)",
                "deleted_count": deleted_count,
            },
            status=status.HTTP_200_OK,
        )

    @swagger_auto_schema(
        operation_summary="Get random other news",
        operation_description="Get 3 random latest news excluding the current news item.",
    )
    @action(detail=True, methods=["get"], url_path="random-others")
    def random_others(self, request, pk=None):
        """
        GET /latest-news/{id}/random-others/
        Returns 3 random news objects excluding the current one.
        """
        current_news = self.get_object()
        random_news = LatestNews.objects.exclude(pk=current_news.pk).order_by("?")[:3]
        serializer = LatestNewsSerializer(
            random_news, many=True, context={"request": request}
        )

        return Response(serializer.data, status=status.HTTP_200_OK)


class OurTeamViewSet(viewsets.ModelViewSet):
    queryset = OurTeam.objects.all().order_by("-created_at")
    serializer_class = OurTeamSerializer
    pagination_class = LimitOffsetPagination
    search_fields = ("title",)
    ordering_fields = ("created_at", "title")
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]

    @action(detail=True, methods=["get", "post"], url_path="images")
    def upload_images(self, request, pk=None):
        team = self.get_object()

        if request.method.lower() == "get":
            serializer = OurTeamImageSerializer(
                team.images.all(), many=True, context={"request": request}
            )
            return Response(serializer.data, status=status.HTTP_200_OK)

        files = request.FILES.getlist("images")

        if not files:
            return Response(
                {"error": "No images provided"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # 🔥 نحسب آخر order موجود
        last_order = team.images.aggregate(max_order=Max("order"))["max_order"]
        last_order = last_order if last_order is not None else -1

        created_images = []

        for index, file in enumerate(files, start=last_order + 1):
            obj = OurTeamImage.objects.create(
                our_team=team,
                image=file,
                order=index,
            )
            created_images.append(obj)

        serializer = OurTeamImageSerializer(
            created_images, many=True, context={"request": request}
        )

        return Response(serializer.data, status=status.HTTP_201_CREATED)


class OurTeamImageViewSet(viewsets.ModelViewSet):
    """ViewSet for managing individual images in OurTeam."""

    queryset = OurTeamImage.objects.all()
    serializer_class = OurTeamImageSerializer
    pagination_class = LimitOffsetPagination
    search_fields = ("caption",)
    ordering_fields = ("created_at", "order")
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]


class BookViewSet(viewsets.ModelViewSet):
    """ViewSet for managing books and their review files."""

    queryset = Book.objects.all()
    serializer_class = BookSerializer
    pagination_class = None
    search_fields = ("title", "description")
    ordering_fields = ("created_at", "updated_at")
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    parser_classes = (MultiPartParser, FormParser, JSONParser)

    def create(self, request, *args, **kwargs):
        """Allow only one Book instance."""

        if Book.objects.exists():
            raise ValidationError({"error": "A book has already been created."})

        return super().create(request, *args, **kwargs)

    @action(detail=True, methods=["post"], url_path="reviews")
    def create_reviews(self, request, pk=None):
        """Create review files for a specific book.

        POST /book/{id}/reviews/
        Accepts multiple files under 'reviews' or single file under 'image'.
        """
        book = self.get_object()

        review_files = request.FILES.getlist("reviews")
        if not review_files:
            single_file = request.FILES.get("image")
            if single_file:
                review_files = [single_file]
            else:
                return Response(
                    {
                        "error": "No review files provided. Use 'reviews' for multiple or 'image' for single upload."
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )

        current_count = book.reviews.count()
        created_reviews = []
        for idx, review_file in enumerate(review_files):
            review = BookReview.objects.create(
                book=book,
                image=review_file,
                order=current_count + idx,
            )
            created_reviews.append(review)

        serializer = BookReviewSerializer(
            created_reviews, many=True, context={"request": request}
        )
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class BookReviewViewSet(viewsets.ModelViewSet):
    """ViewSet for managing individual review files in books."""

    queryset = BookReview.objects.all()
    serializer_class = BookReviewSerializer
    pagination_class = LimitOffsetPagination
    search_fields = ("book__title",)
    ordering_fields = ("created_at", "order")
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    parser_classes = (MultiPartParser, FormParser, JSONParser)


class HistoryYearViewSet(viewsets.ModelViewSet):
    """ViewSet for managing history years."""

    queryset = HistoryYear.objects.all().order_by("year")
    serializer_class = HistoryYearSerializer
    pagination_class = None

    search_fields = ("year",)
    ordering_fields = ("year", "created_at")
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]


class HistoryEventViewSet(viewsets.ModelViewSet):
    """ViewSet for managing history events."""

    queryset = HistoryEvent.objects.all().order_by("-created_at")
    serializer_class = HistoryEventSerializer
    pagination_class = LimitOffsetPagination

    search_fields = ("title",)
    ordering_fields = ("created_at",)
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]

    @action(detail=True, methods=["post"], url_path="images")
    def upload_images(self, request, pk=None):
        """Upload multiple images for an event (same as OurTeam)."""

        event = self.get_object()
        files = request.FILES.getlist("images")

        if not files:
            return Response(
                {"error": "No images provided"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        created_images = []

        for index, file in enumerate(files):
            obj = HistoryEventImage.objects.create(
                event=event,
                image=file,
                order=index,
            )
            created_images.append(obj)

        serializer = HistoryEventImageSerializer(
            created_images, many=True, context={"request": request}
        )

        return Response(serializer.data, status=status.HTTP_201_CREATED)


class HistoryEventImageViewSet(viewsets.ModelViewSet):
    """ViewSet for managing individual event images."""

    queryset = HistoryEventImage.objects.all()
    serializer_class = HistoryEventImageSerializer
    pagination_class = LimitOffsetPagination

    search_fields = ("caption",)
    ordering_fields = ("created_at", "order")
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]


# ========================================== new viewset end============================================
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

        video_categories_data = VideoCategorySerializer(
            video_categories, many=True, context={"request": request}
        ).data

        return Response(
            {
                "logo": logo_data,
                "socialmedia": socials_data,
                "video_categories": video_categories_data,
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
