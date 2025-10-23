from rest_framework import filters, viewsets, status
from rest_framework.permissions import SAFE_METHODS, BasePermission
from rest_framework.pagination import LimitOffsetPagination
from rest_framework.response import Response
from rest_framework.views import APIView
from drf_yasg.utils import swagger_auto_schema
from .swagger_parameters import(
    video_manual_parameters,
    post_manual_parameters,
    event_manual_parameters,
    team_member_manual_parameters,
    post_like_parameters,
    video_like_parameters,
    event_like_parameters,
    tvprogram_like_parameters,
    weeklymoment_like_parameters,
    post_comment_parameters,
    video_comment_parameters,
    event_comment_parameters,
    tvprogram_comment_parameters,
    weeklymoment_comment_parameters
)

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
    TvProgramLike,
    WeeklyMomentLike,
    PostLike,
    VideoLike,
    EventLike,
    PostComment,
    VideoComment,
    TvProgramComment,
    EventComment,
    WeeklyMomentComment,
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
    TvProgramLikeSerializer,
    WeeklyMomentLikeSerializer,
    PostLikeSerializer,
    VideoLikeSerializer,
    EventLikeSerializer,
    PostCommentSerializer,
    VideoCommentSerializer,
    TvProgramCommentSerializer,
    EventCommentSerializer,
    WeeklyMomentCommentSerializer,
)


# Top 5 videos by views
class Top5VideosView(APIView):
    def get(self, request):
        top_videos = Video.top_by_views()
        serializer = VideoSerializer(top_videos, many=True, context={'request': request})
        return Response(serializer.data)

# Top 1 video by views
class Top1VideoView(APIView):
    def get(self, request):
        top_video = Video.top1_by_views()
        serializer = VideoSerializer(top_video, context={'request': request}) if top_video else None
        return Response(serializer.data if serializer else None)

# Top 5 videos by likes
class Top5VideosByLikesView(APIView):
    def get(self, request):
        top_videos = Video.top_by_likes()
        serializer = VideoSerializer(top_videos, many=True, context={'request': request})
        return Response(serializer.data)
    
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
        manual_parameters=post_manual_parameters
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
        params = self.request.query_params

        section = params.get('section')
        if section:
            queryset = queryset.filter(section__name__iexact=section)
        
        category = params.get("category")
        if category:
            queryset =queryset.filter(category__name__iexact=category)
            
        country = params.get("country")
        if country:
            queryset =queryset.filter(country__iexact=country)

        return queryset


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
    
class TvProgramLikeViewSet(BaseContentViewSet):
    """ViewSet for managing TvProgramLike content."""
    queryset = TvProgramLike.objects.all()
    serializer_class = TvProgramLikeSerializer
    search_fields = ("user", "tv_program")
    ordering_fields = ("created_at",)
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    
    @swagger_auto_schema(
        manual_parameters=tvprogram_like_parameters
    )
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)
    
    def get_queryset(self):
        queryset = super().get_queryset()
        params = self.request.query_params

        tv_program = params.get('tv_program')
        if tv_program:
            queryset =queryset.filter(tv_program__id=tv_program)
        
        user = params.get("user")
        if user:
            queryset =queryset.filter(user__id=user)

        return queryset
    
class WeeklyMomentLikeViewSet(BaseContentViewSet):
    """ViewSet for managing WeeklyMomentLike content."""
    queryset = WeeklyMomentLike.objects.all()
    serializer_class = WeeklyMomentLikeSerializer
    search_fields = ("user", "weekly_moment")
    ordering_fields = ("created_at",)
    
    @swagger_auto_schema(
        manual_parameters=weeklymoment_like_parameters
    )
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)
    
    def get_queryset(self):
        queryset = super().get_queryset()
        params = self.request.query_params

        weekly_moment = params.get('weekly_moment')
        if weekly_moment:
            queryset =queryset.filter(weekly_moment__id=weekly_moment)
        
        user = params.get("user")
        if user:
            queryset =queryset.filter(user__id=user)

        return queryset
    
class PostLikeViewSet(BaseContentViewSet):
    """ViewSet for managing PostLike content."""
    queryset = PostLike.objects.all()
    serializer_class = PostLikeSerializer
    search_fields = ("user", "post")
    ordering_fields = ("created_at",)
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    
    @swagger_auto_schema(
        manual_parameters=post_like_parameters  
    )
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)
    
    def get_queryset(self):
        queryset = super().get_queryset()
        params = self.request.query_params

        post = params.get('post')
        if post:
            queryset =queryset.filter(post__id=post)
        
        user = params.get("user")
        if user:
            queryset =queryset.filter(user__id=user)

        return queryset
    
class VideoLikeViewSet(BaseContentViewSet):
    """ViewSet for managing VideoLike content."""
    queryset = VideoLike.objects.all()
    serializer_class = VideoLikeSerializer
    search_fields = ("user", "video")
    ordering_fields = ("created_at",)
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    
    @swagger_auto_schema(
        manual_parameters=video_like_parameters
    )
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)
    
    def get_queryset(self):
        queryset = super().get_queryset()
        params = self.request.query_params

        video = params.get('video')
        if video:
            queryset =queryset.filter(video__id=video)
        
        user = params.get("user")
        if user:
            queryset =queryset.filter(user__id=user)

        return queryset
    
class EventLikeViewSet(BaseContentViewSet):
    """ViewSet for managing EventLike content."""
    queryset = EventLike.objects.all()
    serializer_class = EventLikeSerializer
    search_fields = ("user", "event")
    ordering_fields = ("created_at",)
    
    @swagger_auto_schema(
        manual_parameters=event_like_parameters
    )
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)
    
    def get_queryset(self):
        queryset = super().get_queryset()
        params = self.request.query_params

        event = params.get('event')
        if event:
            queryset =queryset.filter(event__id=event)
        
        user = params.get("user")
        if user:
            queryset =queryset.filter(user__id=user)

        return queryset
    
class PostCommentViewSet(BaseContentViewSet):
    """ViewSet for managing PostComment content."""
    queryset = PostComment.objects.all()
    serializer_class = PostCommentSerializer
    search_fields = ("user", "post", "content")
    ordering_fields = ("created_at",)
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    
    @swagger_auto_schema(
        manual_parameters=post_comment_parameters
    )
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)
    
    def get_queryset(self):
        queryset = super().get_queryset()
        params = self.request.query_params

        post = params.get('post')
        if post:
            queryset =queryset.filter(post__id=post)
        
        user = params.get("user")
        if user:
            queryset =queryset.filter(user__id=user)

        return queryset
    
class VideoCommentViewSet(BaseContentViewSet):
    """ViewSet for managing VideoComment content."""
    queryset = VideoComment.objects.all()
    serializer_class = VideoCommentSerializer
    search_fields = ("user", "video", "content")
    ordering_fields = ("created_at",)
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    
    @swagger_auto_schema(
        manual_parameters=video_comment_parameters
    ) 
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)
    
    def get_queryset(self):
        queryset = super().get_queryset()
        params = self.request.query_params

        video = params.get('video')
        if video:
            queryset =queryset.filter(video__id=video)
        
        user = params.get("user")
        if user:
            queryset =queryset.filter(user__id=user)

        return queryset
    
class TvProgramCommentViewSet(BaseContentViewSet):
    """ViewSet for managing TvProgramComment content."""
    queryset = TvProgramComment.objects.all()
    serializer_class = TvProgramCommentSerializer
    search_fields = ("user", "tv_program", "content")
    ordering_fields = ("created_at",)
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    
    @swagger_auto_schema(
        manual_parameters=tvprogram_comment_parameters
    )
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)
    
    def get_queryset(self):
        queryset = super().get_queryset()
        params = self.request.query_params

        tv_program = params.get('tv_program')
        if tv_program:
            queryset =queryset.filter(tv_program__id=tv_program)
        
        user = params.get("user")
        if user:
            queryset =queryset.filter(user__id=user)

        return queryset
    
class EventCommentViewSet(BaseContentViewSet):
    """ViewSet for managing EventComment content."""
    queryset = EventComment.objects.all()
    serializer_class = EventCommentSerializer
    search_fields = ("user", "event", "content")
    ordering_fields = ("created_at",)
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    
    @swagger_auto_schema(
        manual_parameters=event_comment_parameters
    )
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)
    
    def get_queryset(self):
        queryset = super().get_queryset()
        params = self.request.query_params

        event = params.get('event')
        if event:
            queryset =queryset.filter(event__id=event)
        
        user = params.get("user")
        if user:
            queryset =queryset.filter(user__id=user)

        return queryset
    
class WeeklyMomentCommentViewSet(BaseContentViewSet):
    """ViewSet for managing WeeklyMomentComment content."""
    queryset = WeeklyMomentComment.objects.all()
    serializer_class = WeeklyMomentCommentSerializer
    search_fields = ("user", "weekly_moment", "content")
    ordering_fields = ("created_at",)
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    
    @swagger_auto_schema(
        manual_parameters=weeklymoment_comment_parameters
    )
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)   
    
    def get_queryset(self):
        queryset = super().get_queryset()
        params = self.request.query_params

        weekly_moment = params.get('weekly_moment')
        if weekly_moment:
            queryset =queryset.filter(weekly_moment__id=weekly_moment)
        
        user = params.get("user")
        if user:
            queryset =queryset.filter(user__id=user)

        return queryset