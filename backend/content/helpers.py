from accounts.models import FriendRequest, User as AccountUser
from django.db.models import Q
from rest_framework import serializers
from .models import VideoCategory, PostCategory, EventCategory, EventSection, PositionTeamMember
from readinggroup_backend.helpers import DateTimeFormattingMixin


class AbsoluteURLSerializer(serializers.ModelSerializer):
    """Mixin that ensures file fields are returned as absolute URLs."""

    file_fields: tuple[str, ...] = ()

    def _build_absolute_uri(self, path: str | None) -> str | None:
        request = self.context.get("request")
        if request and path:
            return request.build_absolute_uri(path)
        return path

    def to_representation(self, instance):
        data = super().to_representation(instance)
        for field_name in getattr(self.Meta, "file_fields", self.file_fields):
            file_value = getattr(instance, field_name, None)
            if file_value:
                data[field_name] = self._build_absolute_uri(file_value.url)
        return data


class FriendRequestStatusMixin:
    """Mixin to expose the FriendRequest.status between the requesting user and
    the 'owner' of the object being serialized.

    The mixin tries to resolve an associated User on the object by checking
    common attribute names (e.g. 'user', 'writer', 'author', 'uploader',
    'created_by', 'owner', 'to_user', 'from_user'). If a string name is
    found (like a Post.writer string) the mixin will attempt to match a
    User record by username or display_name.

    The SerializerMethodField exposed is named `friend_request_status` and
    returns the FriendRequest.status string when a FriendRequest exists
    between the requesting user and the resolved target user, otherwise None.
    """

    def _resolve_target_user(self, obj):
        # common attributes that may point to a User instance or a writer string
        attrs = ("user", "to_user", "from_user", "uploader", "author", "owner", "created_by", "writer")
        for a in attrs:
            if hasattr(obj, a):
                val = getattr(obj, a)
                if isinstance(val, AccountUser):
                    return val
                if isinstance(val, str) and val.strip():
                    # try to find a matching user by username or display_name
                    try:
                        u = AccountUser.objects.filter(Q(username__iexact=val) | Q(display_name__iexact=val)).first()
                        if u:
                            return u
                    except Exception:
                        # defensive fallback; ignore and continue
                        pass
        return None

    def get_friend_request_status(self, obj):
        request = self.context.get("request")
        if not request or not getattr(request, "user", None) or not request.user.is_authenticated:
            return None

        target = self._resolve_target_user(obj)
        if not target:
            return None

        try:
            # check request in both directions
            fr = FriendRequest.objects.filter(from_user=request.user, to_user=target).first()
            if fr:
                return fr.status
            fr = FriendRequest.objects.filter(from_user=target, to_user=request.user).first()
            if fr:
                return fr.status
        except Exception:
            return None
        return None



class VideoCategorySerializer(DateTimeFormattingMixin, AbsoluteURLSerializer):
    datetime_fields = ("created_at", "updated_at")
    class Meta:
        model = VideoCategory
        fields = "__all__"
        
class PostCategorySerializer(DateTimeFormattingMixin, AbsoluteURLSerializer):
    datetime_fields = ("created_at", "updated_at")
    class Meta:
        model = PostCategory
        fields = "__all__"
                
class EventCategorySerializer(DateTimeFormattingMixin, AbsoluteURLSerializer):
    datetime_fields = ("created_at", "updated_at")
    class Meta:
        model = EventCategory
        fields = "__all__"

class EventSectionSerializer(DateTimeFormattingMixin, AbsoluteURLSerializer):
    datetime_fields = ("created_at", "updated_at")
    class Meta:
        model = EventSection
        fields = "__all__"
        
class PositionTeamMemberSerializer(DateTimeFormattingMixin, AbsoluteURLSerializer):
    datetime_fields = ("created_at", "updated_at")
    class Meta:
        model = PositionTeamMember
        fields = ["id", "name", "description"]