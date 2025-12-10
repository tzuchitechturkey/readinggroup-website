from django.db.models import Count as DjCount
from django.db.models import Count, Avg
from django.contrib.contenttypes.models import ContentType
from typing import Dict, List, Optional
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework.pagination import LimitOffsetPagination
from rest_framework.response import Response
from rest_framework import filters, viewsets, status
from .enums import PostType
from datetime import date
from drf_yasg.utils import swagger_auto_schema
from .swagger_parameters import(
    video_manual_parameters,
    post_manual_parameters,
    event_manual_parameters,
    team_member_manual_parameters,
    global_search_manual_parameters,
    content_manual_parameters,
    post_category_manual_parameters,
    content_category_manual_parameters,
    event_category_manual_parameters,
    video_category_manual_parameters,
)
from .models import (
    Event,
    HistoryEntry,
    Post,
    TeamMember,
    Video,
    Content,
    ContentImage,
    ContentAttachment,
    PostCategory,
    VideoCategory,
    EventCategory,
    ContentCategory,
    PositionTeamMember,
    EventSection,
    Comments,
    Reply,
    Like,
    MyListEntry,
    SeasonTitle,
    SeasonId,
    SectionOrder,
    SocialMedia,
    NavbarLogo,
    PostRating,
    Authors,
)
from .serializers import (
    EventSerializer,
    HistoryEntrySerializer,
    PostSerializer,
    ContentSerializer,
    TeamMemberSerializer,
    VideoSerializer,
    PostCategorySerializer,
    VideoCategorySerializer,
    EventCategorySerializer,
    ContentCategorySerializer,
    PositionTeamMemberSerializer,
    EventSectionSerializer,
    CommentsSerializer,
    ReplySerializer,
    LikeSerializer,
    SeasonTitleSerializer,
    SeasonIdSerializer,
    SocialMediaSerializer,
    NavbarLogoSerializer,
    ContentAttachmentSerializer,
    AuthorsSerializer,
)
from .views_helpers import(
    BaseContentViewSet,
    BaseCRUDViewSet,
    IsStaffOrReadOnly,
    annotate_likes_queryset,
    _filter_published,
)

class VideoViewSet(BaseContentViewSet):
    queryset = Video.objects.all()
    serializer_class = VideoSerializer
    search_fields = ("title",)
    ordering_fields = ("happened_at", "views", "created_at")
    filter_backends = [filters.SearchFilter]
    pagination_class = LimitOffsetPagination

    @swagger_auto_schema(
        operation_summary="all List videos",
        operation_description="Retrieve a list of videos with optional filtering by language, category, and happened_at date.",
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
        queryset = self.annotate_likes(queryset)
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

        happened_at = params.get('happened_at')
        if happened_at:
            try:
                parsed = date.fromisoformat(happened_at)
                queryset = queryset.filter(happened_at=parsed)
            except Exception:
                queryset = queryset.filter(happened_at=happened_at)
                
        is_new = params.get('is_new')
        if is_new is not None:
            if is_new.lower() in ('true'):
                queryset = queryset.filter(is_new=True)
            elif is_new.lower() in ('false'):
                queryset = queryset.filter(is_new=False)
        
        is_featured = params.get('is_featured')
        if is_featured is not None:
            if is_featured.lower() in ('true'):
                queryset =queryset.filter(is_featured=True)
            elif is_featured.lower() in ('false'):
                queryset =queryset.filter(is_featured=False)
                
        status = params.get("status")
        if status:
            values = []
            for item in status.split(","):
                values.append(item.strip())
            if values:
                 queryset =queryset.filter(status__in=values)
                 
        is_weekly_moment = params.get("is_weekly_moment")
        if is_weekly_moment is not None:
            if is_weekly_moment.lower() in ('true'):
                queryset = queryset.filter(is_weekly_moment=True)
            elif is_weekly_moment.lower() in ('false'):
                queryset = queryset.filter(is_weekly_moment=False)

        is_detail = bool(self.kwargs.get('pk')) if hasattr(self, 'kwargs') else False
        if not is_detail and not params.get('status'):
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
        
        return queryset.order_by('-created_at')

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

        qs = self.annotate_likes(qs)
        qs = qs.order_by('-created_at')

        page = self.paginate_queryset(qs)
        if page is not None:
            serializer = VideoSerializer(page, many=True, context={"request": request})
            return self.get_paginated_response(serializer.data)

        serializer = VideoSerializer(qs, many=True, context={"request": request})
        return Response(serializer.data)

    @action(detail=False, methods=("get",), url_path="top-rated", url_name="top_rated")
    def top_rated(self, request):
        """Return top N videos ordered by average user rating (if ratings exist).

        Query params:
        - limit: int default 5

        Behavior:
        - If a related `ratings` relation exists on Video (e.g. a VideoRating or similar
          with related_name='ratings'), the view will compute average rating and return
          videos ordered by average rating desc, then by number of ratings, then created_at.
        - If no ratings relation is present, falls back to ordering by likes (annotated)
          and then by views/created_at.
        """
        try:
            limit = int(request.query_params.get("limit", 5))
        except Exception:
            limit = 5

        qs = Video.objects.all()
        # only consider published videos for top-rated computation
        try:
            qs = _filter_published(qs)
        except Exception:
            pass

        try:
            qs = qs.filter(category__is_active=True)
        except Exception:
            pass

        try:
            # Annotate average rating and ratings count if a related `ratings` exists
            qs = qs.annotate(avg_rating=Avg('ratings__rating'), ratings_count=Count('ratings'))
            # Prefer items that actually have ratings
            rated_qs = qs.filter(ratings_count__gt=0).order_by('-avg_rating', '-ratings_count', '-created_at')[:limit]

            if rated_qs and len(rated_qs) > 0:
                # annotate likes so serializer can include likes_count/has_liked
                rated_qs = self.annotate_likes(rated_qs)
                serializer = self.get_serializer(rated_qs, many=True, context={"request": request})
                return Response(serializer.data)
        except Exception:
            # If annotation fails (no related ratings or other DB error), fall back
            pass

        # Fallback: order by likes (and views) if no rating system is available
        try:
            qs = qs.annotate(annotated_likes_count=Count('likes'))
            qs = qs.order_by('-annotated_likes_count', '-views', '-created_at')[:limit]
            qs = self.annotate_likes(qs)
        except Exception:
            qs = Video.objects.order_by('-views', '-created_at')[:limit]

        serializer = self.get_serializer(qs, many=True, context={"request": request})
        return Response(serializer.data)

class PostViewSet(BaseContentViewSet):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    search_fields = ("title", "subtitle", "writer", "category__name", "tags")
    ordering_fields = ("views", "created_at")
    filterset_fields = ("created_at", "writer", "category__name", "language", "post_type", "status")
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    pagination_class = LimitOffsetPagination
    
    @swagger_auto_schema(
        operation_summary="List all posts",
        operation_description="Retrieve a list of posts with optional filtering by created_at, writer, category, language, post_type, and status.",
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
                
        status = params.get("status")
        if status:
            values = []
            for item in status.split(","):
                values.append(item.strip())
            if values:
                 queryset =queryset.filter(status__in=values)
                 
        is_weekly_moment = params.get("is_weekly_moment")
        if is_weekly_moment is not None:
            if is_weekly_moment.lower() in ('true'):
                queryset = queryset.filter(is_weekly_moment=True)
            elif is_weekly_moment.lower() in ('false'):
                queryset = queryset.filter(is_weekly_moment=False)

        is_detail = bool(self.kwargs.get('pk')) if hasattr(self, 'kwargs') else False
        if not is_detail and not params.get('status'):
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
                                
        return queryset.order_by('-created_at')

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
            # Accept either a JSON object { "rating": X } or a primitive body containing the number.
            raw = None
            try:
                if isinstance(request.data, dict):
                    raw = request.data.get("rating")
                else:
                    # request.data may be a primitive (int/str) when the client sends a bare value
                    raw = request.data

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

class ContentViewSet(BaseContentViewSet):
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
        manual_parameters=content_manual_parameters
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
        queryset = self.annotate_likes(queryset)
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
                queryset =queryset.filter(category__name__in=values)
                
        language = params.get("language")
        if language:
            values = []
            for item in language.split(","):
                values.append(item.strip())
            if values:
                queryset =queryset.filter(language__in=values)
                
        status = params.get("status")
        if status:
            values = []
            for item in status.split(","):
                values.append(item.strip())
            if values:
                 queryset =queryset.filter(status__in=values)
                 
        is_weekly_moment = params.get("is_weekly_moment")
        if is_weekly_moment is not None:
            if is_weekly_moment.lower() in ('true'):
                queryset = queryset.filter(is_weekly_moment=True)
            elif is_weekly_moment.lower() in ('false'):
                queryset = queryset.filter(is_weekly_moment=False)

        is_detail = bool(self.kwargs.get('pk')) if hasattr(self, 'kwargs') else False
        if not is_detail and not params.get('status'):
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
            
        return queryset.order_by('-created_at')
    
    @action(detail=False, methods=("get",), url_path="last-posted", url_name="last_posted")
    def last_posted(self, request):
        """Return last published contents (default limit=5)."""
        try:
            limit = int(request.query_params.get('limit', 5))
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

        qs = qs.order_by('-created_at')[:limit]
        qs = annotate_likes_queryset(qs, request)

        page = self.paginate_queryset(qs)
        if page is not None:
            serializer = self.get_serializer(page, many=True, context={"request": request})
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(qs, many=True, context={"request": request})
        return Response(serializer.data)


    def create(self, request, *args, **kwargs):
        """Create Content and attach uploaded images/urls as ContentImage rows."""
        if hasattr(request, 'data'):
            if getattr(request, 'FILES', None):
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

        # handle file uploads and image urls
        try:
            # collect uploaded files: support images[] or repeated images key
            uploaded = []
            if hasattr(request.FILES, 'getlist'):
                uploaded = list(request.FILES.getlist('images') or request.FILES.getlist('images[]') or [])
            # fallback numbered keys image_0..image_n
            if not uploaded and 'image_count' in data:
                try:
                    cnt = int(data.get('image_count') or 0)
                except Exception:
                    cnt = 0
                for i in range(cnt):
                    key = f'image_{i}'
                    if key in request.FILES:
                        uploaded.append(request.FILES[key])

            # also accept any request.FILES keys that start with image_
            if not uploaded:
                for k, v in request.FILES.items():
                    if k.startswith('image_') or k in ('image',):
                        uploaded.append(v)

            for f in uploaded:
                try:
                    ContentImage.objects.create(content=content, image=f)
                except Exception:
                    pass

            # collect image_url_* fields
            url_items = []
            for k, v in data.items():
                if isinstance(k, str) and k.startswith('image_url_') and v:
                    url_items.append(v)

            # also support image_urls as json/list
            if not url_items and 'image_urls' in data:
                try:
                    import json
                    maybe = data.get('image_urls')
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
            if hasattr(request.FILES, 'getlist'):
                attachments = list(request.FILES.getlist('attachments') or request.FILES.getlist('attachments[]') or [])
            
            # fallback numbered keys attachment_0..attachment_n
            if not attachments and 'attachment_count' in data:
                try:
                    cnt = int(data.get('attachment_count') or 0)
                except Exception:
                    cnt = 0
                for i in range(cnt):
                    key = f'attachment_{i}'
                    if key in request.FILES:
                        attachments.append(request.FILES[key])

            # also accept any request.FILES keys that start with attachment_
            if not attachments:
                for k, v in request.FILES.items():
                    if k.startswith('attachment_') or k == 'attachment':
                        attachments.append(v)

            for f in attachments:
                try:
                    ContentAttachment.objects.create(
                        content=content,
                        file=f,
                        file_name=f.name,
                        file_size=f.size
                    )
                except Exception:
                    pass
        except Exception:
            # don't break creation if image handling fails
            pass

        headers = self.get_success_headers(serializer.data)
        return Response(self.get_serializer(content, context={'request': request}).data, status=status.HTTP_201_CREATED, headers=headers)

    def update(self, request, *args, **kwargs):
        """Update Content and optionally attach new uploaded images/urls as ContentImage rows."""
        partial = kwargs.pop('partial', False)
        instance = self.get_object()

        # same defensive copy logic as in create(): avoid copying when files present
        if hasattr(request, 'data'):
            if getattr(request, 'FILES', None):
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
            if hasattr(request.FILES, 'getlist'):
                uploaded = list(request.FILES.getlist('images') or request.FILES.getlist('images[]') or [])
            if not uploaded and 'image_count' in data:
                try:
                    cnt = int(data.get('image_count') or 0)
                except Exception:
                    cnt = 0
                for i in range(cnt):
                    key = f'image_{i}'
                    if key in request.FILES:
                        uploaded.append(request.FILES[key])

            for f in uploaded:
                try:
                    ContentImage.objects.create(content=content, image=f)
                except Exception:
                    pass

            url_items = []
            for k, v in data.items():
                if isinstance(k, str) and k.startswith('image_url_') and v:
                    url_items.append(v)
            if not url_items and 'image_urls' in data:
                try:
                    import json
                    maybe = data.get('image_urls')
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
            if hasattr(request.FILES, 'getlist'):
                attachments = list(request.FILES.getlist('attachments') or request.FILES.getlist('attachments[]') or [])
            
            if not attachments and 'attachment_count' in data:
                try:
                    cnt = int(data.get('attachment_count') or 0)
                except Exception:
                    cnt = 0
                for i in range(cnt):
                    key = f'attachment_{i}'
                    if key in request.FILES:
                        attachments.append(request.FILES[key])

            if not attachments:
                for k, v in request.FILES.items():
                    if k.startswith('attachment_') or k == 'attachment':
                        attachments.append(v)

            for f in attachments:
                try:
                    ContentAttachment.objects.create(
                        content=content,
                        file=f,
                        file_name=f.name,
                        file_size=f.size
                    )
                except Exception:
                    pass
        except Exception:
            pass

        return Response(self.get_serializer(content, context={'request': request}).data)

    
    @action(detail=True, methods=("post", "delete"), url_path="rating", url_name="rating")
    def rating(self, request, pk=None):
        """POST to set/update rating (body: { "rating": 1-5 }), DELETE to remove user's rating.
        Returns the serialized Content (with updated average/count/user_rating).
        """
        user = request.user
        if not user or not user.is_authenticated:
            return Response({"detail": "Authentication required."}, status=status.HTTP_401_UNAUTHORIZED)

        try:
            content = Content.objects.get(pk=pk)
        except Content.DoesNotExist:
            return Response({"detail": "Content not found."}, status=status.HTTP_404_NOT_FOUND)

        if request.method == "POST":
            # Accept either a JSON object { "rating": X } or a primitive body containing the number.
            raw = None
            try:
                if isinstance(request.data, dict):
                    raw = request.data.get("rating")
                else:
                    # request.data may be a primitive (int/str) when the client sends a bare value
                    raw = request.data

                rating_value = int(raw)
                if rating_value < 1 or rating_value > 5:
                    raise ValueError()
            except Exception:
                return Response({"detail": "Invalid rating. Must be integer 1-5."}, status=status.HTTP_400_BAD_REQUEST)

            # create or update rating (ContentRating)
            from .models import ContentRating
            ContentRating.objects.update_or_create(user=user, content=content, defaults={"rating": rating_value})
            serializer = ContentSerializer(content, context={"request": request})
            return Response(serializer.data, status=status.HTTP_200_OK)

        # DELETE: remove user's rating if exists
        from .models import ContentRating
        ContentRating.objects.filter(user=user, content=content).delete()
        serializer = ContentSerializer(content, context={"request": request})
        return Response(serializer.data, status=status.HTTP_200_OK)

class EventViewSet(BaseContentViewSet):
    """ViewSet for managing Event content."""
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    search_fields = ("title",)
    ordering_fields = ("happened_at", "created_at")
    filterset_fields = ("section", "category", "country", "language", "report_type", "tags")
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    pagination_class = LimitOffsetPagination
    
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
                 
        status = params.get("status")
        if status:
            values = []
            for item in status.split(","):
                values.append(item.strip())
            if values:
                 queryset =queryset.filter(status__in=values)
                 
        is_weekly_moment = params.get("is_weekly_moment")
        if is_weekly_moment is not None:
            if is_weekly_moment.lower() in ('true'):
                queryset = queryset.filter(is_weekly_moment=True)
            elif is_weekly_moment.lower() in ('false'):
                queryset = queryset.filter(is_weekly_moment=False)

        is_detail = bool(self.kwargs.get('pk')) if hasattr(self, 'kwargs') else False
        if not is_detail and not params.get('status'):
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
            
        return queryset.order_by('-created_at')

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
    
    @action(detail=False, methods=("get",), url_path="weekly-moments", url_name="weekly_moments")
    def weekly_moments(self, request):
        """Return Event items flagged as weekly moments and published."""
        qs = self.get_queryset()
        try:
            qs = qs.filter(is_weekly_moment=True)
        except Exception:
            pass

        qs = _filter_published(qs)
        qs = annotate_likes_queryset(qs, request)

        page = self.paginate_queryset(qs)
        if page is not None:
            serializer = self.get_serializer(page, many=True, context={"request": request})
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(qs, many=True, context={"request": request})
        return Response(serializer.data)
    
class TeamMemberViewSet(BaseContentViewSet):
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
    ordering_fields = ("story_date", "created_at")

class PostCategoryViewSet(BaseCRUDViewSet):
    """ViewSet for managing PostCategory content."""
    queryset = PostCategory.objects.all()
    serializer_class = PostCategorySerializer
    pagination_class = LimitOffsetPagination
    search_fields = ("name",)
    ordering_fields = ("order", "created_at")
    queryset = PostCategory.objects.all().order_by('order', '-created_at')
    
    @swagger_auto_schema(
        operation_summary="List all post categories",
        operation_description="Retrieve a list of post categories with optional filtering by is_active status.",
        manual_parameters=post_category_manual_parameters
    )
    def list(self, request, *args, **kwargs):
        """List endpoint documented with is_active filter for Swagger."""
        return super().list(request, *args, **kwargs)

    def get_queryset(self):
        queryset = super().get_queryset()
        is_active = self.request.query_params.get('is_active')
        if is_active is not None:
            queryset = queryset.filter(is_active=is_active)
        try:
            queryset = queryset.annotate(post_count=Count('post'))
        except Exception:
            pass
        return queryset
    
    @action(detail=False, methods=("post",), url_path="reorder", url_name="reorder")
    def reorder(self, request):
        """Reorder PostCategories based on provided order.
        
        Body: { "categories": [{"id": 1, "order": 0}, {"id": 2, "order": 1}, ...] }
        """
        try:
            categories_data = request.data.get("categories", [])
            for item in categories_data:
                category_id = item.get("id")
                order_value = item.get("order")
                if category_id is not None and order_value is not None:
                    PostCategory.objects.filter(id=category_id).update(order=order_value)
            return Response({"detail": "Categories reordered successfully."}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=("get",), url_path="posts", url_name="posts")
    def posts(self, request, pk=None):
        """Return posts belonging to this PostCategory.

        Supports pagination and annotates likes so serializers can include likes_count/has_liked.
        """
        try:
            category = self.get_object()
        except Exception:
            return Response({"detail": "PostCategory not found."}, status=status.HTTP_404_NOT_FOUND)

        # Ensure category is active; behave like VideoCategory.videos which requires active category
        if not getattr(category, "is_active", True):
            return Response({"detail": "PostCategory not active."}, status=status.HTTP_404_NOT_FOUND)

        # Only include published posts whose category is active
        qs = Post.objects.filter(category=category)
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

        qs = qs.order_by('-created_at')
        qs = annotate_likes_queryset(qs, request)

        page = self.paginate_queryset(qs)
        if page is not None:
            serializer = PostSerializer(page, many=True, context={"request": request})
            return self.get_paginated_response(serializer.data)

        serializer = PostSerializer(qs, many=True, context={"request": request})
        return Response(serializer.data)
    
class ContentCategoryViewSet(BaseCRUDViewSet):
    """ViewSet for managing ContentCategory content."""
    queryset = ContentCategory.objects.all()
    serializer_class = ContentCategorySerializer
    pagination_class = LimitOffsetPagination
    search_fields = ("name",)
    ordering_fields = ("order", "created_at")
    queryset = ContentCategory.objects.all().order_by('order', '-created_at')

    @swagger_auto_schema(
        operation_summary="List all content categories",
        operation_description="Retrieve a list of content categories with optional filtering by is_active status.",
        manual_parameters=content_category_manual_parameters
    )
    def list(self, request, *args, **kwargs):
        """List endpoint documented with is_active filter for Swagger."""
        return super().list(request, *args, **kwargs)

    def get_queryset(self):
        queryset = super().get_queryset()
        is_active = self.request.query_params.get('is_active')
        if is_active is not None:
            queryset = queryset.filter(is_active=is_active)
        try:
            queryset = queryset.annotate(content_count=Count('content'))
        except Exception:
            pass
        return queryset
    
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
                    ContentCategory.objects.filter(id=category_id).update(order=order_value)
            return Response({"detail": "Categories reordered successfully."}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=("get",), url_path="contents", url_name="contents")
    def contents(self, request, pk=None):
        """Return Content objects belonging to this ContentCategory."""
        try:
            category = self.get_object()
        except Exception:
            return Response({"detail": "ContentCategory not found."}, status=status.HTTP_404_NOT_FOUND)

        qs = Content.objects.filter(category=category).order_by('-created_at')
        qs = annotate_likes_queryset(qs, request)

        page = self.paginate_queryset(qs)
        if page is not None:
            serializer = ContentSerializer(page, many=True, context={"request": request})
            return self.get_paginated_response(serializer.data)

        serializer = ContentSerializer(qs, many=True, context={"request": request})
        return Response(serializer.data)
    
class ContentAttachmentViewSet(BaseCRUDViewSet):
    """ViewSet for managing ContentAttachment content."""
    queryset = ContentAttachment.objects.all()
    serializer_class = ContentAttachmentSerializer
    search_fields = ("file_name",)
    ordering_fields = ("created_at",)
    
    def create(self, request, *args, **kwargs):
        """Create a new ContentAttachment with content_id from request data."""
        content_id = request.data.get('content_id')
        
        if not content_id:
            return Response(
                {'error': 'content_id is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            content = Content.objects.get(id=content_id)
        except Content.DoesNotExist:
            return Response(
                {'error': f'Content with id {content_id} not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        # Create the attachment with the content
        file = request.FILES.get('file')
        if not file:
            return Response(
                {'error': 'file is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        attachment = ContentAttachment.objects.create(
            content=content,
            file=file,
            file_name=request.data.get('file_name', file.name),
            file_size=file.size,
            description=request.data.get('description', '')
        )
        
        serializer = self.get_serializer(attachment)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    
    
    
class EventCategoryViewSet(BaseCRUDViewSet):
    """ViewSet for managing EventCategory content."""
    queryset = EventCategory.objects.all()
    serializer_class = EventCategorySerializer
    pagination_class = LimitOffsetPagination
    search_fields = ("name",)
    ordering_fields = ("order", "created_at")
    queryset = EventCategory.objects.all().order_by('order', '-created_at')

    @swagger_auto_schema(
        operation_summary="List all event categories",
        operation_description="Retrieve a list of event categories with optional filtering by is_active status.",
        manual_parameters=event_category_manual_parameters
    )
    def list(self, request, *args, **kwargs):
        """List endpoint documented with is_active filter for Swagger."""
        return super().list(request, *args, **kwargs)

    def get_queryset(self):
        queryset = super().get_queryset()
        is_active = self.request.query_params.get('is_active')
        if is_active is not None:
            queryset = queryset.filter(is_active=is_active)
        try:
            queryset = queryset.annotate(event_count=Count('event'))
        except Exception:
            pass
        return queryset
    
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
                    EventCategory.objects.filter(id=category_id).update(order=order_value)
            return Response({"detail": "Categories reordered successfully."}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=("get",), url_path="events", url_name="events")
    def events(self, request, pk=None):
        """Return Event objects belonging to this EventCategory."""
        try:
            category = self.get_object()
        except Exception:
            return Response({"detail": "EventCategory not found."}, status=status.HTTP_404_NOT_FOUND)

        # Ensure category is active (mirror VideoCategory.videos / PostCategory.posts behavior)
        if not getattr(category, "is_active", True):
            return Response({"detail": "EventCategory not active."}, status=status.HTTP_404_NOT_FOUND)

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
            return Response({"detail": "No published events in this category."}, status=status.HTTP_404_NOT_FOUND)

        qs = published_qs.order_by('-happened_at', '-created_at')
        qs = annotate_likes_queryset(qs, request)

        page = self.paginate_queryset(qs)
        if page is not None:
            serializer = EventSerializer(page, many=True, context={"request": request})
            return self.get_paginated_response(serializer.data)

        serializer = EventSerializer(qs, many=True, context={"request": request})
        return Response(serializer.data)


class PositionTeamMemberViewSet(BaseCRUDViewSet):
    """ViewSet for managing PositionTeamMember content."""
    queryset = PositionTeamMember.objects.all()
    serializer_class = PositionTeamMemberSerializer
    search_fields = ("name",)
    ordering_fields = ("created_at",)
    
class SeasonIdViewSet(BaseCRUDViewSet):
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
            return Response({"detail": "SeasonId not found."}, status=status.HTTP_404_NOT_FOUND)

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
        qs = qs.order_by('-created_at')
        qs = annotate_likes_queryset(qs, request)

        # paginate if pagination is configured on the view
        page = self.paginate_queryset(qs)
        if page is not None:
            serializer = VideoSerializer(page, many=True, context={"request": request})
            return self.get_paginated_response(serializer.data)

        serializer = VideoSerializer(qs, many=True, context={"request": request})
        return Response(serializer.data)

class SeasonTitleViewSet(BaseCRUDViewSet):
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
            return Response({"detail": "SeasonTitle not found."}, status=status.HTTP_404_NOT_FOUND)

        # SeasonId doesn't have a created_at timestamp; order by the season_id field instead
        qs = SeasonId.objects.filter(season_title=season_title).order_by('season_id')

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
    
class VideoCategoryViewSet(BaseCRUDViewSet):
    """ViewSet for managing VideoCategory content."""
    queryset = VideoCategory.objects.all()
    serializer_class = VideoCategorySerializer
    pagination_class = LimitOffsetPagination
    search_fields = ("name",)
    ordering_fields = ("order", "created_at")
    queryset = VideoCategory.objects.all().order_by('order', '-created_at')

    @swagger_auto_schema(
        operation_summary="List all video categories",
        operation_description="Retrieve a list of video categories with optional filtering by is_active status.",
        manual_parameters=video_category_manual_parameters
    )
    def list(self, request, *args, **kwargs):
        """List endpoint documented with is_active filter for Swagger."""
        return super().list(request, *args, **kwargs)
    
    def get_queryset(self):
        queryset = super().get_queryset()
        is_active = self.request.query_params.get('is_active')
        if is_active is not None:
            queryset = queryset.filter(is_active=is_active)
            
        try:
            queryset = queryset.annotate(video_count=Count('video'))
        except Exception:
            pass

        return queryset
    
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
                    VideoCategory.objects.filter(id=category_id).update(order=order_value)
            return Response({"detail": "Categories reordered successfully."}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=True, methods=("get",), url_path="videos", url_name="videos")
    def videos(self, request, pk=None):
        """Return Video objects belonging to this VideoCategory."""
        try:
            category = self.get_object()
        except Exception:
            return Response({"detail": "VideoCategory not found."}, status=status.HTTP_404_NOT_FOUND)
        # Ensure category is active
        if not getattr(category, "is_active", True):
            return Response({"detail": "VideoCategory not active."}, status=status.HTTP_404_NOT_FOUND)

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
            return Response({"detail": "No published videos in this category."}, status=status.HTTP_404_NOT_FOUND)

        qs = published_qs.order_by('-created_at')
        qs = annotate_likes_queryset(qs, request)

        page = self.paginate_queryset(qs)
        if page is not None:
            serializer = VideoSerializer(page, many=True, context={"request": request})
            return self.get_paginated_response(serializer.data)

        serializer = VideoSerializer(qs, many=True, context={"request": request})
        return Response(serializer.data)

class EventSectionViewSet(BaseCRUDViewSet):
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

        # annotate sections by number of related Event objects and pick top N
        sections_qs = EventSection.objects.annotate(events_count=Count("event")).order_by("-events_count")[:limit]

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

            # annotate likes on events so EventSerializer can include likes_count/has_liked
            events_qs = annotate_likes_queryset(events_qs, request)

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

        # pick top sections by number of related Event objects (same as top_with_events)
        sections_qs = EventSection.objects.annotate(events_count=Count("event")).order_by("-events_count")[:limit]

        result = []
        for section in sections_qs:
            # get events for this section
            events_qs = section.events().all()
            try:
                events_qs = _filter_published(events_qs)
            except Exception:
                pass

            # annotate likes info so EventSerializer can include likes_count/has_liked
            events_qs = annotate_likes_queryset(events_qs, request)

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

        groups = Post.top_liked(limit=limit)
        card_photo_qs = groups.get('card_photo') or Post.objects.none()
        # ensure posts are published and belong to active categories
        try:
            card_photo_qs = _filter_published(card_photo_qs)
        except Exception:
            try:
                card_photo_qs = card_photo_qs.filter(status="published")
            except Exception:
                pass
        try:
            card_photo_qs = card_photo_qs.filter(category__is_active=True)
        except Exception:
            pass

        videos_qs = Video.objects.all()
        try:
            videos_qs = _filter_published(videos_qs)
        except Exception:
            pass
        # only include videos with active category
        try:
            videos_qs = videos_qs.filter(category__is_active=True)
        except Exception:
            pass

        # Top section by number of events, then its top liked events
        top_section = None
        events_in_top_section = []

        section = EventSection.objects.annotate(events_count=DjCount('event')).order_by('-events_count').first()
        if section:
            top_section = section
            events_qs = Event.objects.filter(section=section)
            try:
                events_qs = _filter_published(events_qs)
            except Exception:
                pass
            # only include events whose category is active
            try:
                events_qs = events_qs.filter(category__is_active=True)
            except Exception:
                pass
            # annotate and order by likes similar to other uses
            events_qs = annotate_likes_queryset(events_qs, request)
            try:
                events_qs = events_qs.order_by('-annotated_likes_count', '-created_at')[:events_limit]
            except Exception:
                events_qs = events_qs[:events_limit]
            events_in_top_section = events_qs

        # Annotate likes/has_liked for posts & videos, then order & slice to respect limit
        card_photo_qs = annotate_likes_queryset(card_photo_qs, request)
        try:
            card_photo_qs = card_photo_qs.order_by('-annotated_likes_count', '-created_at')[:limit]
        except Exception:
            card_photo_qs = card_photo_qs[:limit]

        videos_qs = annotate_likes_queryset(videos_qs, request)
        try:
            videos_qs = videos_qs.order_by('-annotated_likes_count', '-created_at')[:limit]
        except Exception:
            videos_qs = videos_qs[:limit]

        # Serialize
        card_photo_data = PostSerializer(card_photo_qs, many=True, context={"request": request}).data
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
            "videos": videos_data,
            "top_section": top_section_data,
        })

class TopStatsViewSet(viewsets.ViewSet):
    """
    Endpoints:
      Returns top-liked objects per type in the requested order.
      If no 'order' param, uses default order.
      If user is staff, persists the order for future requests.
    """

    DEFAULT_KEYS: List[str] = [
        "video",
        "post_card",
        "post_photo",
        "event",
        "content",
    ]

    # -----------------------
    # Helpers: Query building
    # -----------------------
    def _get_top_liked_object(self, queryset, request):
        """return single top liked object from the given queryset."""
        # ensure we only consider published items when the model supports it
        try:
            qs = _filter_published(queryset)
        except Exception:
            qs = queryset

        # also ensure the related category (if present) is active
        try:
            qs = qs.filter(category__is_active=True)
        except Exception:
            # model may not have a category relation
            pass

        qs = annotate_likes_queryset(qs, request)
        try:
            qs = qs.order_by("-annotated_likes_count", "-created_at")
        except Exception:
            try:
                qs = qs.order_by("-created_at")
            except Exception:
                pass
        return qs.first()

    def _get_top_posts_queryset(self, request, limit: int):
        """return queryset of top liked Posts limited to 'limit'."""
        try:
            qs = Post.objects.all()
            try:
                qs = _filter_published(qs)
            except Exception:
                pass

            # only consider posts whose category is active
            try:
                qs = qs.filter(category__is_active=True)
            except Exception:
                pass

            qs = annotate_likes_queryset(qs, request)
            try:
                return qs.order_by("-annotated_likes_count", "-created_at")[:limit]
            except Exception:
                return qs[:limit]
        except Exception:
            return Post.objects.none()

    # -----------------------
    # Helpers: Serialization
    # -----------------------
    def _serialize_any(self, obj, request):
        """return serialized data for any supported object type, or None if unsupported."""
        if obj is None:
            return None
        if isinstance(obj, Video):
            return VideoSerializer(obj, context={"request": request}).data
        if isinstance(obj, Post):
            return PostSerializer(obj, context={"request": request}).data
        if isinstance(obj, Event):
            return EventSerializer(obj, context={"request": request}).data
        if isinstance(obj, Content):
            return ContentSerializer(obj, context={"request": request}).data
        return None

    # -----------------------
    # Helpers: Ordering
    # -----------------------
    def _parse_order_query(self, order_query: Optional[str]) -> Dict[str, int]:
        """
        check if order_query is like 'video=1,post_card=2,...' and parse it into a dict.
        returns {'video': 1, 'post_card': 2, ...} or {} if invalid.
        """
        if not order_query:
            return {}

        order_pairs: Dict[str, int] = {}
        parts = [part.strip() for part in order_query.split(",") if part.strip()]

        for part in parts:
            if "=" not in part:
                continue

            key_text, position_text = part.split("=", 1)
            key = key_text.strip()
            try:
                position = int(position_text.strip())
            except Exception:
                continue

            order_pairs[key] = position

        return order_pairs

    def _persist_order_if_staff(self, request, order_by_key: Dict[str, int], all_keys: List[str]) -> None:
        """
        if the request user is staff, persist the given order_by_key into SectionOrder model.
        order_by_key: {'video': 1, 'post_card': 2, ...}
        all_keys: list of all possible keys to complete the order.        
        """
        user = getattr(request, "user", None)
        if not (user and user.is_authenticated and user.is_staff):
            return
        
        # order_by_key: {'video': 1, 'post_card': 2, ...}
        for key, position in order_by_key.items():
            if key in all_keys:
                SectionOrder.objects.update_or_create(
                    key=key,
                    defaults={"position": int(position)},
                )

        #complete with remaining keys
        remaining_keys = [key for key in all_keys if key not in order_by_key]
        start_position = (max(order_by_key.values()) + 1) if order_by_key else 1000
        for offset, key in enumerate(remaining_keys, start=start_position):
            SectionOrder.objects.update_or_create(
                key=key,
                defaults={"position": int(offset)},
            )

    def _load_persisted_order(self) -> Dict[str, int]:
        """
        read persisted order from SectionOrder model.
        returns dict like {'video': 1, 'post_card': 2, ...} or {} if none found.
        """
        try:
            stored = SectionOrder.objects.all()
            if stored.exists():
                return {row.key: row.position for row in stored}
        except Exception:
            pass
        return {}

    def _build_final_key_order(self, base_keys: List[str], order_by_key: Dict[str, int]) -> List[str]:
        """
        order base_keys according to order_by_key dict.
        any keys in base_keys not in order_by_key are appended at the end in original order
        returns ordered list of keys.
        """
        if not order_by_key:
            return list(base_keys)

        # filter and sort keys present in order_by_key
        sorted_by_position = sorted(order_by_key.items(), key=lambda item: item[1])
        ordered_keys = [key for key, _ in sorted_by_position if key in base_keys]

        # append any missing keys from base_keys
        for key in base_keys:
            if key not in ordered_keys:
                ordered_keys.append(key)

        return ordered_keys

    # -----------------------
    # Main endpoint
    # -----------------------
    def list(self, request):
        # 1) limit
        try:
            limit = int(request.query_params.get("limit", 5))
        except Exception:
            limit = 5

        # 2) maximized liked objects per type
        top_video = self._get_top_liked_object(Video.objects.all(), request)
        top_event = self._get_top_liked_object(Event.objects.all(), request)
        top_content = self._get_top_liked_object(Content.objects.all(), request)

        top_post_card = self._get_top_liked_object(
            Post.objects.filter(post_type=PostType.CARD), request
        )
        top_post_photo = self._get_top_liked_object(
            Post.objects.filter(post_type=PostType.PHOTO), request
        )

        # 3) maximized liked posts queryset
        top_posts_qs = self._get_top_posts_queryset(request, limit)
        top_posts_data = PostSerializer(top_posts_qs, many=True, context={"request": request}).data

        # 4) assemble base payload
        base_payload: Dict[str, object] = {
            "video": self._serialize_any(top_video, request),
            "post_card": self._serialize_any(top_post_card, request),
            "post_photo": self._serialize_any(top_post_photo, request),
            "event": self._serialize_any(top_event, request),
            "content": self._serialize_any(top_content, request),
            "top_posts": top_posts_data,
        }

        # 5) ordering
        order_query_text = request.query_params.get("order")
        order_pairs_from_query = self._parse_order_query(order_query_text)

        if order_pairs_from_query:
            # request has order → save it if staff
            self._persist_order_if_staff(request, order_pairs_from_query, self.DEFAULT_KEYS)
            final_key_order = self._build_final_key_order(self.DEFAULT_KEYS, order_pairs_from_query)
        else:
            # no order in request → load persisted order
            order_pairs_from_db = self._load_persisted_order()
            final_key_order = self._build_final_key_order(self.DEFAULT_KEYS, order_pairs_from_db)

        # 6) reorder base_payload according to final_key_order
        ordered_section_keys = [key for key in final_key_order if key in base_payload and key != "top_posts"]
        ordered_payload = {key: base_payload[key] for key in ordered_section_keys}
        ordered_payload["top_posts"] = base_payload["top_posts"]

        return Response(
            {
                "top_liked": ordered_payload,
                "order_used": ordered_section_keys,
                "limit": limit,
            },
            status=status.HTTP_200_OK,
        )

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
        manual_parameters=global_search_manual_parameters 
    )
    def list(self, request):
        search_term = request.query_params.get("q", "")
        if not search_term:
            return Response({"detail": "Query parameter 'q' is required."}, status=status.HTTP_400_BAD_REQUEST)

        # safety cap per model to avoid huge queries; page size is controlled by paginator
        try:
            per_model_cap = int(request.query_params.get("per_model", 50))
        except Exception:
            per_model_cap = 50

        # build per-model querysets and ensure only published items are considered
        video_q = Video.objects.filter(title__icontains=search_term).order_by("-created_at")[:per_model_cap]
        try:
            video_q = _filter_published(video_q)
        except Exception:
            pass
        # only include videos whose category is active
        try:
            video_q = video_q.filter(category__is_active=True)
        except Exception:
            pass
        video_queryset = annotate_likes_queryset(video_q, request)

        post_q = Post.objects.filter(title__icontains=search_term).order_by("-created_at")[:per_model_cap]
        try:
            post_q = _filter_published(post_q)
        except Exception:
            pass
        # only include posts whose category is active
        try:
            post_q = post_q.filter(category__is_active=True)
        except Exception:
            pass
        post_queryset = annotate_likes_queryset(post_q, request)

        event_q = Event.objects.filter(title__icontains=search_term).order_by("-created_at")[:per_model_cap]
        try:
            event_q = _filter_published(event_q)
        except Exception:
            pass
        # only include events whose category is active
        try:
            event_q = event_q.filter(category__is_active=True)
        except Exception:
            pass
        event_queryset = annotate_likes_queryset(event_q, request)

        content_q = Content.objects.filter(title__icontains=search_term).order_by("-created_at")[:per_model_cap]
        try:
            content_q = _filter_published(content_q)
        except Exception:
            pass
        # only include contents whose category is active
        try:
            content_q = content_q.filter(category__is_active=True)
        except Exception:
            pass
        content_queryset = annotate_likes_queryset(content_q, request)

        combined = []
        combined += [(obj, "video") for obj in video_queryset]
        combined += [(obj, "post") for obj in post_queryset]
        combined += [(obj, "event") for obj in event_queryset]
        combined += [(obj, "content") for obj in content_queryset]

        # sort by created_at (newest first)
        combined.sort(key=lambda t: getattr(t[0], "created_at", None) or 0, reverse=True)

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

class NavbarLogoViewSet(BaseContentViewSet):
    """ViewSet for retrieving the NavbarLogo."""
    queryset = NavbarLogo.objects.all()
    serializer_class = NavbarLogoSerializer

class SocialMediaViewSet(BaseContentViewSet):
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
    permission_classes = [IsStaffOrReadOnly]

    def list(self, request):
        # latest logo
        logo = NavbarLogo.objects.order_by('-created_at').first()
        logo_data = NavbarLogoSerializer(logo, context={"request": request}).data if logo else None

        # all social media links
        socials = SocialMedia.objects.all().order_by('-created_at')
        socials_data = SocialMediaSerializer(socials, many=True, context={"request": request}).data
        
        # only include categories that are active (is_active == True)
        post_categories = PostCategory.objects.filter(is_active=True).annotate(post_count=Count('post')).order_by('name')
        video_categories = VideoCategory.objects.filter(is_active=True).annotate(video_count=Count('video')).order_by('name')
        event_categories = EventCategory.objects.filter(is_active=True).annotate(event_count=Count('event')).order_by('name')
        content_categories = ContentCategory.objects.filter(is_active=True).annotate(content_count=Count('content')).order_by('name')
        
        # serialize categories
        post_categories_data = PostCategorySerializer(post_categories, many=True, context={"request": request}).data
        video_categories_data = VideoCategorySerializer(video_categories, many=True, context={"request": request}).data
        event_categories_data = EventCategorySerializer(event_categories, many=True, context={"request": request}).data
        content_categories_data = ContentCategorySerializer(content_categories, many=True, context={"request": request}).data

        return Response({
            "logo": logo_data,
            "socialmedia": socials_data,
            "post_categories": post_categories_data,
            "video_categories": video_categories_data,
            "event_categories": event_categories_data,
            "content_categories": content_categories_data,
        })

    def create(self, request):
        payload = request.data or {}
        logo_val = payload.get('logo', None)
        social_list = payload.get('socialmedia', []) or []

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
            sid = item.get('id')
            platform = item.get('platform', '')
            url = item.get('url', '')
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
            result_socials.append(SocialMediaSerializer(sm, context={"request": request}).data)

        # By default synchronize: remove social rows not present in payload unless replace=false is passed
        replace = request.query_params.get('replace', 'true').lower() not in ('0', 'false', 'no')
        if replace and processed_ids:
            SocialMedia.objects.exclude(pk__in=processed_ids).delete()

        return Response({"logo": created_logo, "socialmedia": result_socials}, status=status.HTTP_201_CREATED)
    
class AuthorsViewSet(BaseCRUDViewSet):
    """ViewSet for managing Authors content."""
    queryset = Authors.objects.all()
    serializer_class = AuthorsSerializer
    pagination_class = LimitOffsetPagination
    search_fields = ("name", "description")
    ordering_fields = ("created_at", "name")
    queryset = Authors.objects.all().order_by('-created_at')
