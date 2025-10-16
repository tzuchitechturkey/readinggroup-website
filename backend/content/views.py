from rest_framework import filters, viewsets
from rest_framework.permissions import SAFE_METHODS, BasePermission

from .models import (
    Event,
    HistoryEntry,
    MediaCard,
    Post,
    Reading,
    TeamMember,
    TvProgram,
    Video,
    WeeklyMoment,
)
from .serializers import (
    EventSerializer,
    HistoryEntrySerializer,
    MediaCardSerializer,
    PostSerializer,
    ReadingSerializer,
    TeamMemberSerializer,
    TvProgramSerializer,
    VideoSerializer,
    WeeklyMomentSerializer,
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
    """ViewSet for managing Video content."""
    queryset = Video.objects.all()
    serializer_class = VideoSerializer
    search_fields = ("title", "category", "subject", "language")
    ordering_fields = ("published_at", "views", "created_at")


class PostViewSet(BaseContentViewSet):
    """ViewSet for managing Post content."""
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    search_fields = ("title", "subtitle", "writer", "category", "tags")
    ordering_fields = ("published_at", "views", "created_at")


class ReadingViewSet(BaseContentViewSet):
    """ViewSet for managing Reading content."""
    queryset = Reading.objects.all()
    serializer_class = ReadingSerializer
    search_fields = (
        "title",
        "author",
        "category",
        "genre",
        "language",
        "source",
    )
    ordering_fields = ("publish_date", "rating", "created_at")


class EventViewSet(BaseContentViewSet):
    """ViewSet for managing Event content."""
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    search_fields = ("title", "author", "category", "section", "country")
    ordering_fields = ("date", "created_at")
    filterset_fields = ("section", "category", "country", "language", "report_type")


class MediaCardViewSet(BaseContentViewSet):
    """ViewSet for managing MediaCard content."""
    queryset = MediaCard.objects.all()
    serializer_class = MediaCardSerializer
    search_fields = ("title", "description", "theme", "language", "kind")
    ordering_fields = ("created_at", "title")
    filterset_fields = ("kind", "language", "theme")


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
    search_fields = ("name", "position", "job_title")
    ordering_fields = ("name", "created_at")


class HistoryEntryViewSet(BaseContentViewSet):
    """ViewSet for managing HistoryEntry content."""
    queryset = HistoryEntry.objects.all()
    serializer_class = HistoryEntrySerializer
    search_fields = ("title", "description")
    ordering_fields = ("story_date")
    