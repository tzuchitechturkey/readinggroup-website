from urllib import request

from django.conf import settings
from django.db.models import Count, F, Q
from rest_framework import viewsets, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.pagination import LimitOffsetPagination
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from django_filters.rest_framework import DjangoFilterBackend
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
    event_community_manual_parameters,
    team_member_manual_parameters,
)
from .models import (
    ContentAttachment,
    EventCommunity,
    VideoCategory,
    LearnCategory,
    Learn,
    Video,
    SocialMedia,
    NavbarLogo,
    Authors,
)
from .serializers import (
    ContentAttachmentSerializer,
    EventCommunitySerializer,
    VideoCategorySerializer,
    LearnCategorySerializer,
    VideoSerializer,
    LearnSerializer,
    SocialMediaSerializer,
    NavbarLogoSerializer,
    AuthorsSerializer,
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


class AuthorsViewSet(viewsets.ModelViewSet):
    """ViewSet for managing Authors content."""

    queryset = Authors.objects.all()
    serializer_class = AuthorsSerializer
    pagination_class = LimitOffsetPagination
    search_fields = ("name", "description")
    ordering_fields = ("created_at", "name")
    queryset = Authors.objects.all().order_by("-created_at")
