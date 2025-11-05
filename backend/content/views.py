from rest_framework import filters, viewsets, status
from rest_framework.decorators import action
from rest_framework.permissions import SAFE_METHODS, BasePermission, IsAuthenticatedOrReadOnly, IsAuthenticated
from rest_framework.pagination import LimitOffsetPagination
from rest_framework.response import Response
from datetime import date
from drf_yasg.utils import swagger_auto_schema
from .helpers import annotate_likes_queryset
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
    MyListEntry,
    SeasonTitle,
    SeasonId,
    SocialMedia,
)
from .enums import VideoType, PostType
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
    LikeSerializer,
    SeasonTitleSerializer,
    SeasonIdSerializer,
    SocialMediaSerializer,
)
from .models import PostRating


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

    def get_permissions(self):
        """Allow certain actions for any authenticated user (likes, my-list, partial_update toggles).

        Default behavior remains IsStaffOrReadOnly for write operations. For actions that should be
        available to any logged-in user (like, partial_update toggle of has_liked, and per-view
        my-list endpoints), return IsAuthenticated permission instead.
        """
        # action may be None outside of request handling
        action = getattr(self, 'action', None)
        auth_actions = ('like', 'partial_update', 'my_list', 'my_list_item')
        if action in auth_actions:
            return [IsAuthenticated()]
        return [perm() for perm in self.permission_classes]

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
    @action(detail=False, methods=("get",), url_path="top-liked", url_name="top_liked")
    def top_liked(self, request):
        """Return top liked instances for this resource.

        Query params:
        - limit: int (default 5)
        """
        try:
            limit = int(request.query_params.get('limit', 5))
        except Exception:
            limit = 5

        # annotate queryset with likes info then order by annotated_likes_count
        qs = self.get_queryset()
        qs = self.annotate_likes(qs)
        # prefer annotated_likes_count (annotate_likes uses Count('likes'))
        try:
            qs = qs.order_by('-annotated_likes_count', '-created_at')[:limit]
        except Exception:
            # fallback: try ordering by annotated field name or likes_count
            qs = qs[:limit]

        serializer = self.get_serializer(qs, many=True, context={"request": request})
        return Response(serializer.data)

    @action(detail=False, methods=("get",), url_path="top-viewed", url_name="top_viewed")
    def top_viewed(self, request):
        """Return top viewed instances for this resource.
        Query params:
        - limit: int (default 5)
        """
        try:
            limit = int(request.query_params.get('limit', 5))
        except Exception:
            limit = 5

        qs = self.get_queryset()
        # if model has 'views' field, order by it; fallback to created_at if not
        try:
            qs = qs.order_by('-views', '-created_at')[:limit]
        except Exception:
            qs = qs.order_by('-created_at')[:limit]

        # annotate likes info as well so serializers can show likes_count/has_liked
        qs = self.annotate_likes(qs)
        serializer = self.get_serializer(qs, many=True, context={"request": request})
        return Response(serializer.data)
    
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
    search_fields = ("title",)
    ordering_fields = ("happened_at", "views", "created_at")
    filter_backends = [filters.SearchFilter]

    @swagger_auto_schema(
        operation_summary="List videos",
        operation_description="Retrieve a list of videos with optional filtering by video_type, language, category, and happened_at date.",
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
            try:
                parsed = date.fromisoformat(happened_at)
                queryset = queryset.filter(happened_at=parsed)
            except Exception:
                queryset = queryset.filter(happened_at=happened_at)
        
        return queryset

    @action(detail=True, methods=("post", "delete"), url_path="my-list", url_name="my_list_item")
    def my_list_item(self, request, pk=None):
        """Add or remove a video from the requesting user's My List.
        POST -> add (idempotent)
        DELETE -> remove (idempotent)
        """
        user = request.user
        if not user or not user.is_authenticated:
            return Response({"detail": "Authentication required."}, status=status.HTTP_401_UNAUTHORIZED)

        try:
            video = Video.objects.get(pk=pk)
        except Video.DoesNotExist:
            return Response({"detail": "Video not found."}, status=status.HTTP_404_NOT_FOUND)

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
            return Response({"detail": "Authentication required."}, status=status.HTTP_401_UNAUTHORIZED)

        # get videos via MyListEntry, preserve ordering by created_at in MyListEntry
        entries = MyListEntry.objects.filter(user=user).select_related('video').order_by('-created_at')
        # Extract videos preserving ordering from the MyListEntry records
        videos = [e.video for e in entries]

        # Use the view's pagination if configured. paginate_queryset accepts lists as well as querysets.
        page = self.paginate_queryset(videos)
        if page is not None:
            serializer = VideoSerializer(page, many=True, context={"request": request})
            return self.get_paginated_response(serializer.data)

        serializer = VideoSerializer(videos, many=True, context={"request": request})
        return Response(serializer.data)

    @action(detail=False, methods=("get",), url_path="top-mix", url_name="top_mix")
    def top_mix(self, request):
        """Return a combined payload with:
        - top_1: single top liked video overall
        - top_5_full: top 5 liked videos of type FULL_VIDEO
        - top_5_unit: top 5 liked videos of type UNIT_VIDEO
        """

        # overall queryset annotated with likes info (and has_liked when user present)
        base_queryset = self.annotate_likes(Video.objects.all())

        # overall top 1 by likes
        try:
            overall_qs = base_queryset.order_by('-annotated_likes_count', '-created_at')
        except Exception:
            overall_qs = base_queryset
        top1 = overall_qs.first()

        # top 5 for full videos
        queryset_full = Video.objects.filter(video_type=VideoType.FULL_VIDEO)
        queryset_full = self.annotate_likes(queryset_full)
        try:
            queryset_full = queryset_full.order_by('-annotated_likes_count', '-created_at')[:5]
        except Exception:
            queryset_full = queryset_full[:5]

        # top 5 for unit videos
        queryset_unit = Video.objects.filter(video_type=VideoType.UNIT_VIDEO)
        queryset_unit = self.annotate_likes(queryset_unit)
        try:
            queryset_unit = queryset_unit.order_by('-annotated_likes_count', '-created_at')[:5]
        except Exception:
            queryset_unit = queryset_unit[:5]

        # serialize results
        top1_data = VideoSerializer(top1, context={"request": request}).data if top1 else None
        top_full_data = VideoSerializer(queryset_full, many=True, context={"request": request}).data
        top_unit_data = VideoSerializer(queryset_unit, many=True, context={"request": request}).data

        return Response({
            "top_1": top1_data,
            "top_5_full": top_full_data,
            "top_5_unit": top_unit_data,
        })

class PostViewSet(BaseContentViewSet):
    """ViewSet for managing Post content."""
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    search_fields = ("title", "subtitle", "writer", "category__name", "tags")
    ordering_fields = ("views", "created_at")
    filterset_fields = ("created_at", "writer", "category__name", "language", "post_type")
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    
    @swagger_auto_schema(
        manual_parameters=post_manual_parameters
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

    @action(detail=True, methods=("post", "delete"), url_path="rating", url_name="rating")
    def rating(self, request, pk=None):
        """POST to set/update rating (body: { "rating": 1-5 }), DELETE to remove user's rating.

        Returns the serialized Post (with updated average/count/user_rating).
        """
        user = request.user
        if not user or not user.is_authenticated:
            return Response({"detail": "Authentication required."}, status=status.HTTP_401_UNAUTHORIZED)

        try:
            post = Post.objects.get(pk=pk)
        except Post.DoesNotExist:
            return Response({"detail": "Post not found."}, status=status.HTTP_404_NOT_FOUND)

        if request.method == "POST":
            try:
                # coerce to int and validate range
                raw = request.data.get('rating')
                rating_value = int(raw)
                if rating_value < 1 or rating_value > 5:
                    raise ValueError()
            except Exception:
                return Response({"detail": "Invalid rating. Must be integer 1-5."}, status=status.HTTP_400_BAD_REQUEST)

            # create or update rating
            PostRating.objects.update_or_create(user=user, post=post, defaults={"rating": rating_value})
            serializer = PostSerializer(post, context={"request": request})
            return Response(serializer.data, status=status.HTTP_200_OK)

        # DELETE: remove user's rating if exists
        PostRating.objects.filter(user=user, post=post).delete()
        serializer = PostSerializer(post, context={"request": request})
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    @action(detail=False, methods=("get",), url_path="top-liked-grouped", url_name="top_liked_grouped")
    def top_liked_grouped(self, request):
        """Return grouped top liked posts:

        - card_photo: top N posts where post_type is CARD or PHOTO
        - reading: top N posts where post_type is READING

        Query params:
        - limit: int (default 5)
        """
        try:
            limit = int(request.query_params.get('limit', 5))
        except Exception:
            limit = 5

        # Use the model helper to get grouped querysets
        groups = Post.top_liked_grouped(limit=limit)

        # Ensure annotated fields and has_liked are present using annotate_likes
        card_photo_qs = self.annotate_likes(groups.get('card_photo') or Post.objects.none())
        reading_qs = self.annotate_likes(groups.get('reading') or Post.objects.none())

        card_photo_data = PostSerializer(card_photo_qs, many=True, context={"request": request}).data
        reading_data = PostSerializer(reading_qs, many=True, context={"request": request}).data

        return Response({"card_photo": card_photo_data, "reading": reading_data})
    
    @action(detail=False, methods=("get",), url_path="top-commented-card-photo", url_name="top_commented_card_photo")
    def top_commented_card_photo(self, request):
        """Return top N posts by number of comments for post_type in (CARD, PHOTO).

        Query params:
        - limit: int (default 5)
        """
        try:
            limit = int(request.query_params.get('limit', 5))
        except Exception:
            limit = 5

        types = [PostType.CARD, PostType.PHOTO]

        qs = Post.top_commented_by_types(types=types, limit=limit)

        # annotate likes info (and has_liked for authenticated user)
        qs = self.annotate_likes(qs)

        serializer = PostSerializer(qs, many=True, context={"request": request})
        return Response(serializer.data)
    
    #add new action for top 5 in is_viewed for group card_photo and reading
    @action(detail=False, methods=("get",), url_path="top-viewed-grouped", url_name="top_viewed_grouped")
    def top_viewed_grouped(self, request):
        """Return grouped top viewed posts:
        - card_photo: top N posts where post_type is CARD or PHOTO
        - reading: top N posts where post_type is READING

        Query params:
        - limit: int (default 5)
        """
        try:
            limit = int(request.query_params.get('limit', 5))
        except Exception:
            limit = 5

        groups = Post.top_viewed_grouped(limit=limit)
        card_photo_queryset = self.annotate_likes(groups.get('card_photo') or Post.objects.none())
        reading_queryset = self.annotate_likes(groups.get('reading') or Post.objects.none())
        card_photo_data = PostSerializer(card_photo_queryset, many=True, context={"request": request}).data
        reading_data = PostSerializer(reading_queryset, many=True, context={"request": request}).data

        return Response({"card_photo": card_photo_data, "reading": reading_data})
class EventViewSet(BaseContentViewSet):
    """ViewSet for managing Event content."""
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    search_fields = ("title",)
    ordering_fields = ("happened_at", "created_at")
    filterset_fields = ("section", "category", "country", "language", "report_type", "tags")
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    
    @swagger_auto_schema(
        manual_parameters=event_manual_parameters
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
            try:
                parsed = date.fromisoformat(happened_at)
                queryset = queryset.filter(happened_at=parsed)
            except Exception:
                queryset = queryset.filter(happened_at=happened_at)
            
        report_type = params.get('report_type')
        if report_type:
            values = []
            for item in report_type.split(","):
                values.append(item.strip())
            if values:
                queryset =queryset.filter(report_type__in=values)
                
        tags = params.get("tags")
        if tags:
            values = []
            for item in tags.split(","):
                values.append(item.strip())
            if values:
                 queryset =queryset.filter(tags__in=values)
                 
        category = params.get("category")
        if category:
            values = []
            for item in category.split(","):
                values.append(item.strip())
            if values:
                 queryset =queryset.filter(category__name__in=values)
            
        return queryset

    @action(detail=False, methods=("get",), url_path="tags", url_name="tags")
    def tags(self, request):
        """Return a list of unique tags used by Event objects.
        Optional query params:
        - q: substring to filter tags (case-insensitive)
        - limit: integer to limit number of returned tags
        """
        q = request.query_params.get('q')
        try:
            limit = int(request.query_params.get('limit')) if request.query_params.get('limit') else None
        except Exception:
            limit = None

        # Gather all tags (stored as JSON list on the Event model)
        all_tag_lists = Event.objects.values_list('tags', flat=True)
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
                for t in str(tag_list).split(','):
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
    
    #add new action for top 5 in commented
    @action(detail=False, methods=("get",), url_path="top-commented", url_name="top_commented")
    def top_commented(self, request):
        """Return top N events by number of comments.
        Query params:
        - limit: int (default 5)
        """
        try:
            limit = int(request.query_params.get('limit', 5))
        except Exception:
            limit = 5

        qs = Event.top_commented(limit=limit)

        # annotate likes info (and has_liked for authenticated user)
        qs = self.annotate_likes(qs)

        serializer = EventSerializer(qs, many=True, context={"request": request})
        return Response(serializer.data)
    
    #add new action for top 5 in viewed
    @action(detail=False, methods=("get",), url_path="top-viewed", url_name="top_viewed")
    def top_viewed(self, request):
        """Return top viewed instances for this resource.
        Query params:
        - limit: int (default 5)
        """
        try:
            limit = int(request.query_params.get('limit', 5))
        except Exception:
            limit = 5

        qs = self.get_queryset()
        # if model has 'views' field, order by it; fallback to created_at if not
        try:
            qs = qs.order_by('-views', '-created_at')[:limit]
        except Exception:
            qs = qs.order_by('-created_at')[:limit]

        # annotate likes info as well so serializers can show likes_count/has_liked
        qs = self.annotate_likes(qs)
        serializer = self.get_serializer(qs, many=True, context={"request": request})
        return Response(serializer.data)

    #add new action last 5 posted for Event
    @action(detail=False, methods=("get",), url_path="last-posted", url_name="last_posted")
    def last_posted(self, request):
        """Return last posted instances for this resource.
        Query params:
        - limit: int (default 5)
        """
        try:
            limit = int(request.query_params.get('limit', 5))
        except Exception:
            limit = 5

        qs = self.get_queryset()
        qs = qs.order_by('-created_at')[:limit]

        # annotate likes info as well so serializers can show likes_count/has_liked
        qs = self.annotate_likes(qs)
        serializer = self.get_serializer(qs, many=True, context={"request": request})
        return Response(serializer.data)
    

class WeeklyMomentViewSet(BaseContentViewSet):
    """ViewSet for managing WeeklyMoment content."""
    queryset = WeeklyMoment.objects.all()
    serializer_class = WeeklyMomentSerializer
    search_fields = ("title", "source", "language", "content_type")
    ordering_fields = ("created_at", "title")
    
    #add action for top 5 Liked
    @action(detail=False, methods=("get",), url_path="top-liked", url_name="top_liked")
    def top_liked(self, request):
        """Return top liked instances for this resource.

        Query params:
        - limit: int (default 5)
        """
        try:
            limit = int(request.query_params.get('limit', 5))
        except Exception:
            limit = 5

        # annotate queryset with likes info then order by annotated_likes_count
        qs = self.get_queryset()
        qs = self.annotate_likes(qs)
        # prefer annotated_likes_count (annotate_likes uses Count('likes'))
        try:
            qs = qs.order_by('-annotated_likes_count', '-created_at')[:limit]
        except Exception:
            # fallback: try ordering by annotated field name or likes_count
            qs = qs[:limit]

        serializer = self.get_serializer(qs, many=True, context={"request": request})
        return Response(serializer.data)
    
class TeamMemberViewSet(BaseContentViewSet):
    """ViewSet for managing TeamMember content."""
    queryset = TeamMember.objects.all()
    serializer_class = TeamMemberSerializer
    search_fields = ("name", "job_title", "position__name")
    ordering_fields = ("name", "created_at")
    pagination_class = LimitOffsetPagination
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ("name", "job_title", "position__name")
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
    permission_classes = [IsAuthenticatedOrReadOnly]
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
    permission_classes = [IsAuthenticatedOrReadOnly]
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
    
class SeasonIdViewSet(BaseContentViewSet):
    """ViewSet for managing SeasonId content."""
    queryset = SeasonId.objects.all()
    serializer_class = SeasonIdSerializer
    search_fields = ("season_title__name",)
    ordering_fields = ("created_at",)

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
            return Response({"detail": "SeasonId not found."}, status=status.HTTP_404_NOT_FOUND)

        # Videos point to SeasonId via Video.season_name
        qs = Video.objects.filter(season_name=season).order_by('-happened_at', '-created_at')

        # annotate likes info so serializers can show likes_count/has_liked
        qs = self.annotate_likes(qs)

        # paginate if pagination is configured on the view
        page = self.paginate_queryset(qs)
        if page is not None:
            serializer = VideoSerializer(page, many=True, context={"request": request})
            return self.get_paginated_response(serializer.data)

        serializer = VideoSerializer(qs, many=True, context={"request": request})
        return Response(serializer.data)

class SeasonTitleViewSet(BaseContentViewSet):
    """ViewSet for managing SeasonTitle content."""
    queryset = SeasonTitle.objects.all()
    serializer_class = SeasonTitleSerializer
    search_fields = ("name",)
    ordering_fields = ("created_at",)
    
    @action(detail=True, methods=("get",), url_path="season-ids", url_name="season_ids")
    def season_ids(self, request, pk=None):
        """Return SeasonId objects linked to this SeasonTitle.

        GET /api/v1/season-titles/{pk}/season-ids/
        """
        try:
            season_title = self.get_object()
        except Exception:
            return Response({"detail": "SeasonTitle not found."}, status=status.HTTP_404_NOT_FOUND)

        qs = SeasonId.objects.filter(season_title=season_title).order_by('id')

        page = self.paginate_queryset(qs)
        if page is not None:
            serializer = SeasonIdSerializer(page, many=True, context={"request": request})
            return self.get_paginated_response(serializer.data)

        serializer = SeasonIdSerializer(qs, many=True, context={"request": request})
        return Response(serializer.data)
    
class LikeViewSet(BaseContentViewSet):
    """ViewSet for managing Like content."""
    queryset = Like.objects.all()
    serializer_class = LikeSerializer
    search_fields = ("user__username", "content_type", "object_id")
    ordering_fields = ("created_at",)
    
class VideoCategoryViewSet(BaseContentViewSet):
    """ViewSet for managing VideoCategory content."""
    queryset = VideoCategory.objects.all()
    serializer_class = VideoCategorySerializer
    search_fields = ("name",)
    ordering_fields = ("created_at",)

class EventSectionViewSet(BaseContentViewSet):
    """ViewSet for managing EventSection content."""
    queryset = EventSection.objects.all()
    serializer_class = EventSectionSerializer
    search_fields = ("name",)
    ordering_fields = ("created_at",)

    @action(detail=False, methods=("get",), url_path="top-with-events", url_name="top_with_events")
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

        from django.db.models import Count

        # annotate sections by number of related Event objects and pick top N
        sections_qs = EventSection.objects.annotate(events_count=Count("event")).order_by("-events_count")[:limit]

        result = []
        for section in sections_qs:
            # get events for this section; use section.events() helper
            events_qs = section.events().order_by("-happened_at", "-created_at")
            if events_limit is not None:
                events_qs = events_qs[:events_limit]

            # annotate likes on events so EventSerializer can include likes_count/has_liked
            events_qs = self.annotate_likes(events_qs)

            section_data = EventSectionSerializer(section, context={"request": request}).data
            events_data = EventSerializer(events_qs, many=True, context={"request": request}).data

            result.append({
                "section": section_data,
                "events": events_data,
                "events_count": getattr(section, "events_count", len(events_data)),
            })

        return Response(result)

    @action(detail=False, methods=("get",), url_path="top-with-top-liked", url_name="top_with_top_liked")
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

        from django.db.models import Count

        # pick top sections by number of related Event objects (same as top_with_events)
        sections_qs = EventSection.objects.annotate(events_count=Count("event")).order_by("-events_count")[:limit]

        result = []
        for section in sections_qs:
            # get events for this section
            events_qs = section.events().all()

            # annotate likes info so EventSerializer can include likes_count/has_liked
            events_qs = self.annotate_likes(events_qs)

            # order by annotated likes count (fallback to created_at)
            try:
                events_qs = events_qs.order_by('-annotated_likes_count', '-created_at')[:events_limit]
            except Exception:
                events_qs = events_qs[:events_limit]

            section_data = EventSectionSerializer(section, context={"request": request}).data
            events_data = EventSerializer(events_qs, many=True, context={"request": request}).data

            result.append({
                "section": section_data,
                "top_5": events_data,
            })

        return Response(result)
    
class CombinedTopLikedView(viewsets.ViewSet):
    """Return a combined payload with several top-liked groups in a single response.

    Response shape:
    {
      "posts_card_photo": [...],
      "posts_reading": [...],
      "videos": [...],
      "top_section": { "id": <id>, "name": <name>, "events": [...] }
    }

    Query params:
    - limit: int default 5 (number of items per group)
    - events_limit: int default 5 (number of events inside the top section)
    """

    def list(self, request):
        try:
            limit = int(request.query_params.get('limit', 5))
        except Exception:
            limit = 5

        try:
            events_limit = int(request.query_params.get('events_limit', 5))
        except Exception:
            events_limit = 5

        # Posts: use model helper to get grouped querysets (already ordered)
        groups = Post.top_liked_grouped(limit=limit)
        card_photo_qs = groups.get('card_photo') or Post.objects.none()
        reading_qs = groups.get('reading') or Post.objects.none()

        # Videos: use LikableMixin.top_liked via Video.top_liked
        videos_qs = Video.top_liked(limit=limit)

        # Top section by number of events, then its top liked events
        top_section = None
        events_in_top_section = []
        from django.db.models import Count as DjCount

        section = EventSection.objects.annotate(events_count=DjCount('event')).order_by('-events_count').first()
        if section:
            top_section = section
            events_qs = Event.objects.filter(section=section)
            # annotate and order by likes similar to other uses
            events_qs = annotate_likes_queryset(events_qs, request)
            try:
                events_qs = events_qs.order_by('-annotated_likes_count', '-created_at')[:events_limit]
            except Exception:
                events_qs = events_qs[:events_limit]
            events_in_top_section = events_qs

        # Annotate likes/has_liked for posts & videos
        card_photo_qs = annotate_likes_queryset(card_photo_qs, request)
        reading_qs = annotate_likes_queryset(reading_qs, request)
        videos_qs = annotate_likes_queryset(videos_qs, request)

        # Serialize
        card_photo_data = PostSerializer(card_photo_qs, many=True, context={"request": request}).data
        reading_data = PostSerializer(reading_qs, many=True, context={"request": request}).data
        videos_data = VideoSerializer(videos_qs, many=True, context={"request": request}).data

        top_section_data = None
        if top_section:
            events_data = EventSerializer(events_in_top_section, many=True, context={"request": request}).data
            top_section_data = {
                "id": top_section.pk,
                "name": top_section.name,
                "events": events_data,
            }

        return Response({
            "posts_card_photo": card_photo_data,
            "posts_reading": reading_data,
            "videos": videos_data,
            "top_section": top_section_data,
        })


class TopStatsViewSet(viewsets.ViewSet):
    """Standalone endpoint returning:

    - top 1 liked video
    - top 1 liked post (reading)
    - top 1 liked post (card)
    - top 1 liked post (photo)
    - top 1 liked event
    - top 1 liked weekly moment
    - top N posts by likes
    """

    def list(self, request):
        try:
            limit = int(request.query_params.get("limit", 5))
        except Exception:
            limit = 5

        # helper to get the top-liked single instance for a queryset
        def get_top_liked_for(qs):
            qs = annotate_likes_queryset(qs, request)
            try:
                qs = qs.order_by("-annotated_likes_count", "-created_at")
            except Exception:
                # if ordering by annotated field fails, fall back to created_at
                try:
                    qs = qs.order_by("-created_at")
                except Exception:
                    pass
            return qs.first()

    # top liked single items
        top_video = get_top_liked_for(Video.objects.all())
        top_event = get_top_liked_for(Event.objects.all())
        top_weekly = get_top_liked_for(WeeklyMoment.objects.all())

        top_post_reading = get_top_liked_for(Post.objects.filter(post_type=PostType.READING))
        top_post_card = get_top_liked_for(Post.objects.filter(post_type=PostType.CARD))
        top_post_photo = get_top_liked_for(Post.objects.filter(post_type=PostType.PHOTO))

        # top N posts by likes (new payload requested) - annotate and order by annotated likes
        try:
            posts_qs = annotate_likes_queryset(Post.objects.all(), request)
            try:
                posts_qs = posts_qs.order_by('-annotated_likes_count', '-created_at')[:limit]
            except Exception:
                posts_qs = posts_qs[:limit]
        except Exception:
            posts_qs = Post.objects.none()

        top_posts_data = PostSerializer(posts_qs, many=True, context={"request": request}).data

        def serialize_obj(obj):
            if obj is None:
                return None
            if isinstance(obj, Video):
                return VideoSerializer(obj, context={"request": request}).data
            if isinstance(obj, Post):
                return PostSerializer(obj, context={"request": request}).data
            if isinstance(obj, Event):
                return EventSerializer(obj, context={"request": request}).data
            if isinstance(obj, WeeklyMoment):
                return WeeklyMomentSerializer(obj, context={"request": request}).data
            return None

        top_liked_payload = {
            "video": serialize_obj(top_video),
            "post_reading": serialize_obj(top_post_reading),
            "post_card": serialize_obj(top_post_card),
            "post_photo": serialize_obj(top_post_photo),
            "event": serialize_obj(top_event),
            "weekly_moment": serialize_obj(top_weekly),
        }
        top_liked_payload["top_posts"] = top_posts_data
        return Response({"top_liked": top_liked_payload})

class SocialMediaViewSet(BaseContentViewSet):
    """ViewSet for managing SocialMedia content."""
    queryset = SocialMedia.objects.all()
    serializer_class = SocialMediaSerializer
    search_fields = ("platform", "url", "description")
    ordering_fields = ("created_at", "platform")