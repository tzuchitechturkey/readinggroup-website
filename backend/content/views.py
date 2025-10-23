from rest_framework import filters, viewsets
from rest_framework.permissions import SAFE_METHODS, BasePermission
from rest_framework.pagination import LimitOffsetPagination
from rest_framework.response import Response
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi

from .models import (
    Event,
    HistoryEntry,
    Post,
    TeamMember,
    TvProgram,
    Video,
    WeeklyMoment,
    PostCategory,
    VideoCategory,
    TvProgramCategory,
    EventCategory,
    PositionTeamMember,
    EventSection,
)
from .serializers import (
    EventSerializer,
    HistoryEntrySerializer,
    PostSerializer,
    TeamMemberSerializer,
    TvProgramSerializer,
    VideoSerializer,
    WeeklyMomentSerializer,
    PostCategorySerializer,
    VideoCategorySerializer,
    TvProgramCategorySerializer,
    EventCategorySerializer,
    PositionTeamMemberSerializer,
    EventSectionSerializer,
)


class IsStaffOrReadOnly(BasePermission):
    """Allow read access to everyone but limit writes to staff members."""

    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:
            return True
        return request.user.is_authenticated and request.user.is_staff


class BaseContentViewSet(viewsets.ModelViewSet):
    """Common configuration shared across content viewsets."""

    permission_classes = [IsStaffOrReadOnly]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]

class VideoViewSet(BaseContentViewSet):
    queryset = Video.objects.all()
    serializer_class = VideoSerializer
    search_fields = ("title", "category", "language")
    ordering_fields = ("happened_at", "views", "created_at")
    filter_backends = [filters.SearchFilter]

    @swagger_auto_schema(
        manual_parameters=[
            openapi.Parameter('video_type', openapi.IN_QUERY, description="Filter by video type", type=openapi.TYPE_STRING),
            openapi.Parameter('language', openapi.IN_QUERY, description="Filter by language", type=openapi.TYPE_STRING),
            openapi.Parameter('category', openapi.IN_QUERY, description="Filter by category (JSON object with 'name' field)", type=openapi.TYPE_STRING),
            openapi.Parameter('happened_at', openapi.IN_QUERY, description="Filter by happened date", type=openapi.TYPE_STRING),
        ]
    )
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    def get_queryset(self):
        queryset = super().get_queryset()
        params = self.request.query_params

        video_type = params.get('video_type')
        if video_type:
            queryset = queryset.filter(video_type__iexact=video_type)
        
        language = params.get("language")
        if language:
            queryset = queryset.filter(language=language)
            
        category = params.get("category")
        if category:
            queryset = queryset.filter(category__name__iexact=category)
            
        happened_at = params.get('happened_at')
        if happened_at:
            queryset = queryset.filter(happened_at__date=happened_at)

        return queryset

class PostViewSet(BaseContentViewSet):
    """ViewSet for managing Post content."""
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    search_fields = ("title", "subtitle", "writer", "category", "tags")
    ordering_fields = ("published_at", "views", "created_at")
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    
    @swagger_auto_schema(
        manual_parameters=[
            openapi.Parameter('published_at', openapi.IN_QUERY, description="Filter by published date", type=openapi.TYPE_STRING),
            openapi.Parameter('writer', openapi.IN_QUERY, description="Filter by writer", type=openapi.TYPE_STRING),
            openapi.Parameter('category', openapi.IN_QUERY, description="Filter by category", type=openapi.TYPE_STRING),
            openapi.Parameter('post_type', openapi.IN_QUERY, description="Filter by post type", type=openapi.TYPE_STRING),
            openapi.Parameter('language', openapi.IN_QUERY, description="Filter by language", type=openapi.TYPE_STRING),
        ]
    )
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)
    
    def get_queryset(self):
        
        queryset = super().get_queryset()
        params = self.request.query_params

        published_at = params.get('published_at')
        if published_at:
            queryset = queryset.filter(published_at__date=published_at)
        
        writer = params.get("writer")
        if writer:
            queryset = queryset.filter(writer__icontains=writer)
            
        category = params.get("category")
        if category:
            queryset = queryset.filter(category__name__iexact=category)
        
        post_type = params.get("post_type")
        if post_type:
            queryset = queryset.filter(post_type__iexact=post_type)
        
        language = params.get("language")
        if language:
            queryset =queryset.filter(language__iexact=language)

        return queryset
class EventViewSet(BaseContentViewSet):
    """ViewSet for managing Event content."""
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    search_fields = ("title", "writer", "category", "section", "country")
    ordering_fields = ("date", "created_at")
    filterset_fields = ("section", "category", "country", "language", "report_type")


class TvProgramViewSet(BaseContentViewSet):
    """ViewSet for managing TvProgram content."""
    queryset = TvProgram.objects.all()
    serializer_class = TvProgramSerializer
    search_fields = ("title", "description", "writer", "category")
    ordering_fields = ("air_date", "created_at")


class WeeklyMomentViewSet(BaseContentViewSet):
    """ViewSet for managing WeeklyMoment content."""
    queryset = WeeklyMoment.objects.all()
    serializer_class = WeeklyMomentSerializer
    search_fields = ("title", "source", "language", "content_type")
    ordering_fields = ("created_at", "title")


class TeamMemberViewSet(BaseContentViewSet):
    """ViewSet for managing TeamMember content."""
    queryset = TeamMember.objects.all()
    serializer_class = TeamMemberSerializer
    search_fields = ("name", "job_title", "position__name")
    ordering_fields = ("name", "created_at")
    pagination_class = LimitOffsetPagination
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    
    @swagger_auto_schema(
        manual_parameters=[
            openapi.Parameter('Position', openapi.IN_QUERY, description="Filter by Position", type=openapi.TYPE_STRING),
        ]
    )
    def list(self, request, *args, **kwargs):
        if 'limit' in request.query_params or 'offset' in request.query_params:
            return super().list(request, *args, **kwargs)
        queryset = self.filter_queryset(self.get_queryset())
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
    
    def get_queryset(self):
        queryset = super().get_queryset()
        params = self.request.query_params

        position = params.get('Position')
        if position:
            queryset = queryset.filter(position__name__iexact=position)

        return queryset


class HistoryEntryViewSet(BaseContentViewSet):
    """ViewSet for managing HistoryEntry content."""
    queryset = HistoryEntry.objects.all()
    serializer_class = HistoryEntrySerializer
    search_fields = ("title", "description")
    ordering_fields = ("story_date")
    
class VideoCategoryViewSet(BaseContentViewSet):
    """ViewSet for managing VideoCategory content."""
    queryset = VideoCategory.objects.all()
    serializer_class = VideoCategorySerializer
    search_fields = ("name",)
    ordering_fields = ("created_at",)
    
class PostCategoryViewSet(BaseContentViewSet):
    """ViewSet for managing PostCategory content."""
    queryset = PostCategory.objects.all()
    serializer_class = PostCategorySerializer
    search_fields = ("name",)
    ordering_fields = ("created_at",)
    
class EventCategoryViewSet(BaseContentViewSet):
    """ViewSet for managing EventCategory content."""
    queryset = EventCategory.objects.all()
    serializer_class = EventCategorySerializer
    search_fields = ("name",)
    ordering_fields = ("created_at",)
    
class TvProgramCategoryViewSet(BaseContentViewSet):
    """ViewSet for managing TvProgramCategory content."""
    queryset = TvProgramCategory.objects.all()
    serializer_class = TvProgramCategorySerializer
    search_fields = ("name",)
    ordering_fields = ("created_at",)
    
class PositionTeamMemberViewSet(BaseContentViewSet):
    """ViewSet for managing PositionTeamMember content."""
    queryset = PositionTeamMember.objects.all()
    serializer_class = PositionTeamMemberSerializer
    search_fields = ("name",)
    ordering_fields = ("created_at",)
    
    
class EventSectionViewSet(BaseContentViewSet):
    """ViewSet for managing EventSection content."""
    queryset = EventSection.objects.all()
    serializer_class = EventSectionSerializer
    search_fields = ("name",)
    ordering_fields = ("created_at",)