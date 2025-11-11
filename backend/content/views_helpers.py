from django.contrib.contenttypes.models import ContentType
from django.db.models import Count, Exists, OuterRef
from rest_framework import filters, status, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import SAFE_METHODS, BasePermission, IsAuthenticated
from rest_framework.response import Response

from .enums import ContentStatus, EventStatus, PostStatus, VideoStatus
from .models import Like


def annotate_likes_queryset(queryset, request=None):
    """Module-level helper to annotate a queryset with likes count and (when request.user authenticated) has_liked.
    This mirrors BaseContentViewSet.annotate_likes but is usable from function/class-based views.
    """
    try:
        queryset = queryset.annotate(annotated_likes_count=Count('likes'))
    except Exception:
        return queryset

    if request and getattr(request, 'user', None) and request.user.is_authenticated:
        try:
            ct = ContentType.objects.get_for_model(queryset.model)
            likes_subq = Like.objects.filter(content_type=ct, object_id=OuterRef('pk'), user=request.user)
            queryset = queryset.annotate(annotated_has_liked=Exists(likes_subq))
        except Exception:
            # ignore failures to annotate has_liked
            pass
    return queryset


def _filter_published(queryset):
    """If the queryset's model exposes a `status` field, attempt to filter it
    to the published value for known enums (Post/Content/Event/Video).
    This helper swallows exceptions to remain safe for models without status.
    """
    try:
        return queryset.filter(status=PostStatus.PUBLISHED)
    except Exception:
        pass

    try:
        return queryset.filter(status=ContentStatus.PUBLISHED)
    except Exception:
        pass

    try:
        return queryset.filter(status=EventStatus.PUBLISHED)
    except Exception:
        pass

    try:
        return queryset.filter(status=VideoStatus.PUBLISHED)
    except Exception:
        pass

    return queryset

class IsStaffOrReadOnly(BasePermission):
    """Allow read access to everyone but limit writes to staff members."""

    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:
            return True
        return request.user.is_authenticated and request.user.is_staff
    
class BaseCRUDViewSet(viewsets.ModelViewSet):
    """
    A base ViewSet that provides standard CRUD actions:
    - create
    - update / partial_update
    - destroy
    - list
    It does not include any additional actions such as like or top-liked.
    """
    permission_classes = [IsStaffOrReadOnly]

    def create(self, request, *args, **kwargs):
        """Create a new item"""
        return super().create(request, *args, **kwargs)

    def update(self, request, *args, **kwargs):
        """Update an existing item"""
        return super().update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        """Delete an item"""
        return super().destroy(request, *args, **kwargs)

    def list(self, request, *args, **kwargs):
        """List all items"""
        return super().list(request, *args, **kwargs)


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
        # include 'rating' so any authenticated user can rate posts (not only staff)
        auth_actions = ('like', 'partial_update', 'my_list', 'my_list_item', 'rating')
        if action in auth_actions:
            return [IsAuthenticated()]
        return [perm() for perm in self.permission_classes]

    def annotate_likes(self, queryset):
        """Annotate a queryset with likes_count and (when request.user authenticated) has_liked."""
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
        # Filter queryset to published state when possible (Post/Content/Event/Video)
        qs = _filter_published(qs)

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
        # Filter queryset to published state when possible (Post/Content/Event/Video)
        qs = _filter_published(qs)
        # if model has 'views' field, order by it; fallback to created_at if not
        try:
            qs = qs.order_by('-views', '-created_at')[:limit]
        except Exception:
            qs = qs.order_by('-created_at')[:limit]

        # annotate likes info as well so serializers can show likes_count/has_liked
        qs = self.annotate_likes(qs)
        serializer = self.get_serializer(qs, many=True, context={"request": request})
        return Response(serializer.data)

    @action(detail=False, methods=("get",), url_path="top-commented", url_name="top_commented")
    def top_commented(self, request):
        """Return top commented instances for this resource.
        Query params:
        - limit: int (default 5)
        """
        try:
            limit = int(request.query_params.get('limit', 5))
        except Exception:
            limit = 5

        qs = self.get_queryset()
        # Filter queryset to published state when possible (Post/Content/Event/Video)
        qs = _filter_published(qs)
        # if model has 'comments' field, order by it; fallback to created_at if not
        try:
            qs = qs.order_by('-comments_count', '-created_at')[:limit]
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


