from rest_framework import filters, viewsets, status
from rest_framework.decorators import action
from rest_framework.permissions import SAFE_METHODS, BasePermission
from rest_framework.pagination import LimitOffsetPagination
from rest_framework.response import Response
from drf_yasg.utils import swagger_auto_schema
from .swagger_parameters import(
    video_manual_parameters,
    post_manual_parameters,
    event_manual_parameters,
    team_member_manual_parameters,
)

from .models import (
    Event,
    HistoryEntry,
    Post,
    TeamMember,
    Video,
    WeeklyMoment,
    PostCategory,
    VideoCategory,
    EventCategory,
    PositionTeamMember,
    EventSection,
    Comments,
    Reply,
    Like,
)
from .serializers import (
    EventSerializer,
    HistoryEntrySerializer,
    PostSerializer,
    TeamMemberSerializer,
    VideoSerializer,
    WeeklyMomentSerializer,
    PostCategorySerializer,
    VideoCategorySerializer,
    EventCategorySerializer,
    PositionTeamMemberSerializer,
    EventSectionSerializer,
    CommentsSerializer,
    ReplySerializer,
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

    def annotate_likes(self, queryset):
        """Annotate a queryset with likes_count and (when request.user authenticated) has_liked."""
        from django.db.models import Count, Exists, OuterRef
        from django.contrib.contenttypes.models import ContentType

        request = getattr(self, 'request', None)
        # annotate total likes into a non-conflicting name to avoid model property collisions
        try:
            queryset = queryset.annotate(annotated_likes_count=Count('likes'))
        except Exception:
            # if model doesn't have 'likes' relation, skip
            return queryset

        # annotate whether the current user has liked each item into a non-conflicting name
        if request and getattr(request, 'user', None) and request.user.is_authenticated:
            ct = ContentType.objects.get_for_model(queryset.model)
            likes_subq = Like.objects.filter(content_type=ct, object_id=OuterRef('pk'), user=request.user)
            try:
                queryset = queryset.annotate(annotated_has_liked=Exists(likes_subq))
            except Exception:
                # fallback: ignore annotation if something fails
                pass
        return queryset
    
    @action(detail=True, methods=("post", "delete"), url_path="like", url_name="like")
    def like(self, request, pk=None):
        """POST to like, DELETE to unlike. Accessible to authenticated users."""
        instance = self.get_object()
        user = request.user
        if not user or not user.is_authenticated:
            return Response({"detail": "Authentication credentials were not provided."}, status=status.HTTP_401_UNAUTHORIZED)

        if request.method == "POST":
            instance.add_like(user)
        else:
            instance.remove_like(user)

        serializer = self.get_serializer(instance, context={"request": request})
        return Response(serializer.data)

    def partial_update(self, request, *args, **kwargs):
        """Allow toggling `has_liked` via PATCH with { has_liked: true/false } for authenticated users.

        This keeps compatibility with the frontend which PATCHes `has_liked` on posts.
        """
        instance = self.get_object()
        user = request.user
        if "has_liked" in request.data:
            if not user or not user.is_authenticated:
                return Response({"detail": "Authentication required."}, status=status.HTTP_401_UNAUTHORIZED)
            try:
                want = bool(request.data.get("has_liked"))
            except Exception:
                want = False
            if want:
                instance.add_like(user)
            else:
                instance.remove_like(user)
            serializer = self.get_serializer(instance, context={"request": request})
            return Response(serializer.data)

        return super().partial_update(request, *args, **kwargs)


class VideoViewSet(BaseContentViewSet):
    queryset = Video.objects.all()
    serializer_class = VideoSerializer
    search_fields = ("title", "category", "language")
    ordering_fields = ("happened_at", "views", "created_at")
    filter_backends = [filters.SearchFilter]

    @swagger_auto_schema(
        manual_parameters=video_manual_parameters
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
        # annotate likes info
        queryset = self.annotate_likes(queryset)
        params = self.request.query_params

        video_type = params.getlist('video_type')
        if video_type:
            values = []
            for item in video_type:
                values.extend([v.strip() for v in item.split(",") if v.strip()])
            if values:
                queryset = queryset.filter(video_type__in=values)

        language = params.getlist("language")
        if language:
            values = []
            for item in language:
                values.extend([v.strip() for v in item.split(",") if v.strip()])
            if values:
                queryset = queryset.filter(language__in=values)

        category = params.getlist("category")
        if category:
            values = []
            for item in category:
                values.extend([v.strip() for v in item.split(",") if v.strip()])
            if values:
                queryset = queryset.filter(category__name__in=values)

        happened_at = params.get('happened_at')
        if happened_at:
            queryset = queryset.filter(happened_at__date=happened_at)
        
        return queryset

class PostViewSet(BaseContentViewSet):
    """ViewSet for managing Post content."""
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    search_fields = ("title", "subtitle", "writer", "category__name", "tags")
    ordering_fields = ("views", "created_at")
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    
    @swagger_auto_schema(
        manual_parameters=post_manual_parameters
    )
    
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)
    
    def get_queryset(self):
        
        queryset = super().get_queryset()
        # annotate likes info
        queryset = self.annotate_likes(queryset)
        params = self.request.query_params

        created_at = params.get("created_at")
        if created_at:
            queryset = queryset.filter(created_at__date=created_at)

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
                queryset =queryset.filter(category__name__in=values)
                
        language = params.get("language")
        if language:
            values = []
            for item in language.split(","):
                values.append(item.strip())
            if values:
                queryset =queryset.filter(language__in=values)
                
        post_type = params.get("post_type")
        if post_type:
            values = []
            for item in post_type.split(","):
                values.append(item.strip())
            if values:
                queryset =queryset.filter(post_type__in=values)
                                
        return queryset
class EventViewSet(BaseContentViewSet):
    """ViewSet for managing Event content."""
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    search_fields = ("title", "writer", "category", "section", "country")
    ordering_fields = ("happened_at", "created_at")
    filterset_fields = ("section", "category", "country", "language", "report_type")
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    
    @swagger_auto_schema(
        manual_parameters=event_manual_parameters
    )
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)
    
    def get_queryset(self):
        
        queryset = super().get_queryset()
        # annotate likes info
        queryset = self.annotate_likes(queryset)
        params = self.request.query_params

        section = params.get('section')
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
                queryset =queryset.filter(country__in=values)
                
        language = params.get("language")
        if language:
            values = []
            for item in language.split(","):
                values.append(item.strip())
            if values:
                queryset =queryset.filter(language__in=values)
        
        happened_at = params.get('happened_at')
        if happened_at:
            queryset = queryset.filter(happened_at__date=happened_at)
            
        report_type = params.get('report_type')
        if report_type:
            values = []
            for item in report_type.split(","):
                values.append(item.strip())
            if values:
                queryset =queryset.filter(report_type__in=values)
            
        return queryset

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
        manual_parameters=team_member_manual_parameters
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
    
    
class CommentsViewSet(BaseContentViewSet):
    """ViewSet for managing Comments content."""
    queryset = Comments.objects.all()
    serializer_class = CommentsSerializer
    # enable pagination for comments list
    pagination_class = LimitOffsetPagination
    search_fields = ("user__username", "content_type", "object_id", "text")
    ordering_fields = ("created_at",)

    def get_queryset(self):
        """Filter comments by object_id and content_type if provided, then annotate likes."""
        from django.contrib.contenttypes.models import ContentType

        queryset = super().get_queryset()
        object_id = self.request.query_params.get('object_id')
        content_type_name = self.request.query_params.get('content_type')

        if object_id:
            queryset = queryset.filter(object_id=object_id)

        if content_type_name:
            # Convert content_type string (e.g., 'video', 'post') to ContentType object
            try:
                content_type = ContentType.objects.get(model__iexact=content_type_name)
                queryset = queryset.filter(content_type=content_type)
            except ContentType.DoesNotExist:
                # If content_type not found, return empty queryset
                queryset = queryset.none()

        # annotate likes info (uses annotated_* fields to avoid model property collisions)
        queryset = self.annotate_likes(queryset)
        return queryset.order_by('-created_at')

    @action(detail=True, methods=("get", "post"), url_path="replies", url_name="replies")
    def replies(self, request, pk=None):
        """List all replies for a specific comment (no pagination), or create a reply tied to that comment.

        GET  /api/v1/comments/{id}/replies/  -> all replies (no pagination)
        POST /api/v1/comments/{id}/replies/  -> create a reply (body: {"text": "..."})
        """
        comment = self.get_object()
        if request.method == "POST":
            data = request.data.copy()
            # ensure the reply is attached to this comment
            data["comment"] = comment.pk
            serializer = ReplySerializer(data=data, context={"request": request})
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        # GET: return ALL replies without pagination (annotate likes on replies too)
        qs = comment.replies.all().order_by('-created_at')
        qs = self.annotate_likes(qs)
        serializer = ReplySerializer(qs, many=True, context={"request": request})
        return Response(serializer.data)
    
class ReplyViewSet(BaseContentViewSet):
    """ViewSet for managing Reply content."""
    queryset = Reply.objects.all()
    serializer_class = ReplySerializer
    search_fields = ("user__username", "comment__id", "text")
    ordering_fields = ("created_at",)

    def get_queryset(self):
        """Filter replies by comment if provided, then annotate likes."""
        queryset = super().get_queryset()
        comment_id = self.request.query_params.get('comment')

        if comment_id:
            queryset = queryset.filter(comment_id=comment_id)

        queryset = self.annotate_likes(queryset)
        return queryset.order_by('-created_at')

class HistoryEntryViewSet(BaseContentViewSet):
    """ViewSet for managing HistoryEntry content."""
    queryset = HistoryEntry.objects.all()
    serializer_class = HistoryEntrySerializer
    search_fields = ("title", "description")
    ordering_fields = ("story_date")
    
    
#This endpoint is passed inside the main endpoint.
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
    