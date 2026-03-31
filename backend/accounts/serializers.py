from django.contrib.auth import authenticate
from django.contrib.auth.models import Group
from django.db import transaction
from django.db.models import Q
from django.utils import timezone
from readinggroup_backend.helpers import DateTimeFormattingMixin
from rest_framework import serializers
from rest_framework_simplejwt.tokens import RefreshToken

from .models import FriendRequest, GroupProfile, User

try:
    from content.models import Post
except Exception:  # pragma: no cover - defensive import
    Post = None


class UserSerializer(DateTimeFormattingMixin, serializers.ModelSerializer):
    """Serialize the public profile of a user."""

    datetime_fields = ("date_joined", "last_password_change")
    groups = serializers.SerializerMethodField()
    friend_request_status = serializers.SerializerMethodField()
    profile_image_url = serializers.SerializerMethodField()
    status = serializers.SerializerMethodField()
    posts_count = serializers.SerializerMethodField()
    followers_count = serializers.SerializerMethodField()
    following_count = serializers.SerializerMethodField()
    group_id = serializers.SerializerMethodField()
    section_name = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = (
            "id",
            "email",
            "username",
            "display_name",
            "first_name",
            "last_name",
            "is_staff",
            "is_active",
            "group_id",
            "section_name",
            "is_first_login",
            "last_password_change",
            "date_joined",
            "groups",
            "profile_image_url",
            "status",
            "friend_request_status",
            "posts_count",
            "followers_count",
            "following_count",
            "profession_name",
            "about_me",
            "country",
            "mobile_number",
            "address_details",
            "website_address",
            "status",
        )
        read_only_fields = ("id", "is_staff", "is_active", "date_joined")

    def _get_primary_group(self, obj):
        try:
            return obj.groups.order_by("id").first()
        except Exception:
            return None

    def get_group_id(self, obj):
        g = self._get_primary_group(obj)
        return g.id if g else None

    def get_section_name(self, obj):
        g = self._get_primary_group(obj)
        if not g:
            return None
        try:
            profile = getattr(g, "profile", None)
            value = getattr(profile, "section_name", "")
            return value or None
        except Exception:
            return None

    def get_groups(self, obj):
        return list(obj.groups.values_list("name", flat=True))

    def get_status(self, obj):
        try:
            pending_requests = FriendRequest.objects.filter(
                to_user=obj, status=FriendRequest.STATUS_PENDING
            ).count()
            if pending_requests > 0:
                return f"You have {pending_requests} pending friend request(s)."
            return "No pending friend requests."
        except Exception:
            return "Status unavailable."

    def get_friend_request_status(self, obj):
        """Return the FriendRequest.status string between the requesting user and `obj`, or None.

        This mirrors the behavior of `FriendRequestStatusMixin.get_friend_request_status` used
        in `content` serializers: it returns the exact status string (e.g. "PENDING", "ACCEPTED")
        when a FriendRequest exists in either direction, otherwise None. If the request user
        is not authenticated or is the same as `obj`, return None.
        """
        request = self.context.get("request")
        if (
            not request
            or not getattr(request, "user", None)
            or not request.user.is_authenticated
        ):
            return None

        requester = request.user
        # don't expose relationship to self
        if requester == obj:
            return None

        try:
            fr = FriendRequest.objects.filter(from_user=requester, to_user=obj).first()
            if fr:
                return fr.status
            fr = FriendRequest.objects.filter(from_user=obj, to_user=requester).first()
            if fr:
                return fr.status
        except Exception:
            return None
        return None

    def get_profile_image_url(self, obj):
        request = self.context.get("request")
        if obj.profile_image and hasattr(obj.profile_image, "url"):
            if request:
                return request.build_absolute_uri(obj.profile_image.url)
            return obj.profile_image.url
        return None

    def get_posts_count(self, obj):
        # reuse same logic as UserSerializer
        if Post is None:
            return 0
        try:
            names = set()
            if obj.username:
                names.add(obj.username.strip())
            if obj.display_name:
                names.add(obj.display_name.strip())
            full = obj.get_full_name()
            if full:
                names.add(full.strip())

            queries = Q()
            for n in names:
                if n:
                    queries |= Q(writer__iexact=n)

            if not queries:
                return 0

            return Post.objects.filter(queries).count()
        except Exception:
            return 0

    def get_followers_count(self, obj):
        try:
            return FriendRequest.objects.filter(
                to_user=obj, status=FriendRequest.STATUS_ACCEPTED
            ).count()
        except Exception:
            return 0

    def get_following_count(self, obj):
        try:
            return FriendRequest.objects.filter(
                from_user=obj, status=FriendRequest.STATUS_ACCEPTED
            ).count()
        except Exception:
            return 0


class RegisterSerializer(serializers.ModelSerializer):
    """Handle registration of a new user."""

    password = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = User
        fields = (
            "id",
            "email",
            "username",
            "password",
            "display_name",
            "first_name",
            "last_name",
            "totp_secret",
        )
        extra_kwargs = {"username": {"required": False}}

    def validate(self, attrs):
        """Normalize username and validate uniqueness of email and username.

        Behavior:
        - If `username` is not provided, use the email as username.
        - Reject registration when the email OR username is already taken (case-insensitive).
        """
        attrs = super().validate(attrs)
        username = (attrs.get("username") or attrs.get("email") or "").strip()
        email = (attrs.get("email") or "").strip()

        # Validate email presence (Model will also enforce, but provide clearer message)
        if not email:
            raise serializers.ValidationError({"email": "Email is required."})

        # Check email uniqueness (case-insensitive)
        if User.objects.filter(email__iexact=email).exists():
            raise serializers.ValidationError(
                {"email": "A user with this email already exists."}
            )

        # Check username uniqueness (case-insensitive)
        if username and User.objects.filter(username__iexact=username).exists():
            raise serializers.ValidationError(
                {"username": "A user with this username already exists."}
            )

        attrs["username"] = username
        return attrs

    def create(self, validated_data):
        password = validated_data.pop("password")
        user = User(**validated_data)
        user.set_password(password)
        user.is_first_login = True
        user.last_password_change = timezone.now()
        user.save()
        group, _created = Group.objects.get_or_create(name="user")
        user.groups.add(group)

        return user

    def to_representation(self, instance):
        return UserSerializer(instance).data


class LoginSerializer(serializers.Serializer):
    """Authenticate a user and return JWT tokens."""

    username = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        identifier = attrs.get("username")
        password = attrs.get("password")
        request = self.context.get("request")

        if not identifier or not password:
            raise serializers.ValidationError(("Username and password are required."))

        user = authenticate(request=request, username=identifier, password=password)
        if user is None:
            try:
                user_obj = User.objects.get(email__iexact=identifier)
            except User.DoesNotExist as exc:
                raise serializers.ValidationError(("Invalid credentials.")) from exc

            user = authenticate(
                request=request, username=user_obj.username, password=password
            )

        if user is None:
            raise serializers.ValidationError(("Invalid credentials."))

        if not user.is_active:
            raise serializers.ValidationError(("This account is disabled."))

        refresh = RefreshToken.for_user(user)
        attrs["access"] = str(refresh.access_token)
        attrs["refresh"] = str(refresh)
        attrs["user"] = user
        return attrs

    def to_representation(self, instance):
        user: User = instance["user"]
        return {
            "access": instance["access"],
            "refresh": instance["refresh"],
            "user": UserSerializer(user).data,
        }


class ProfileUpdateSerializer(DateTimeFormattingMixin, serializers.ModelSerializer):
    """Update limited user profile fields."""

    datetime_fields = "date_joined"
    profile_image_url = serializers.SerializerMethodField()
    posts_count = serializers.SerializerMethodField()
    followers_count = serializers.SerializerMethodField()
    following_count = serializers.SerializerMethodField()
    status = serializers.SerializerMethodField()
    group_id = serializers.SerializerMethodField()
    section_name = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = (
            "id",
            "email",
            "username",
            "display_name",
            "first_name",
            "last_name",
            "is_staff",
            "is_active",
            "group_id",
            "section_name",
            "is_first_login",
            "last_password_change",
            "date_joined",
            "groups",
            "profile_image_url",
            "posts_count",
            "followers_count",
            "following_count",
            "profile_image",
            "profession_name",
            "about_me",
            "country",
            "mobile_number",
            "address_details",
            "website_address",
            "status",
        )
        read_only_fields = ("id", "is_staff", "is_active", "date_joined")

    def _get_primary_group(self, obj):
        try:
            return obj.groups.order_by("id").first()
        except Exception:
            return None

    def get_group_id(self, obj):
        g = self._get_primary_group(obj)
        return g.id if g else None

    def get_section_name(self, obj):
        g = self._get_primary_group(obj)
        if not g:
            return None
        try:
            profile = getattr(g, "profile", None)
            value = getattr(profile, "section_name", "")
            return value or None
        except Exception:
            return None

    def get_profile_image_url(self, obj):
        request = self.context.get("request")
        if (
            hasattr(obj, "profile_image")
            and obj.profile_image
            and hasattr(obj.profile_image, "url")
        ):
            if request:
                return request.build_absolute_uri(obj.profile_image.url)
            return obj.profile_image.url
        return None

    def get_status(self, obj):
        try:
            pending_requests = FriendRequest.objects.filter(
                to_user=obj, status=FriendRequest.STATUS_PENDING
            ).count()
            if pending_requests > 0:
                return f"You have {pending_requests} pending friend request(s)."
            return "No pending friend requests."
        except Exception:
            return "Status unavailable."

    def get_posts_count(self, obj):
        # reuse same logic as UserSerializer
        if Post is None:
            return 0
        try:
            names = set()
            if obj.username:
                names.add(obj.username.strip())
            if obj.display_name:
                names.add(obj.display_name.strip())
            full = obj.get_full_name()
            if full:
                names.add(full.strip())

            queries = Q()
            for n in names:
                if n:
                    queries |= Q(writer__iexact=n)

            if not queries:
                return 0

            return Post.objects.filter(queries).count()
        except Exception:
            return 0

    def get_followers_count(self, obj):
        try:
            return FriendRequest.objects.filter(
                to_user=obj, status=FriendRequest.STATUS_ACCEPTED
            ).count()
        except Exception:
            return 0

    def get_following_count(self, obj):
        try:
            return FriendRequest.objects.filter(
                from_user=obj, status=FriendRequest.STATUS_ACCEPTED
            ).count()
        except Exception:
            return 0


class FriendRequestSerializer(DateTimeFormattingMixin, serializers.ModelSerializer):
    """Serializer for FriendRequest model."""

    datetime_fields = ("created_at", "updated_at")
    from_user = UserSerializer(read_only=True)
    to_user = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())

    class Meta:
        model = FriendRequest
        fields = (
            "id",
            "from_user",
            "to_user",
            "status",
            "message",
            "created_at",
            "updated_at",
        )
        read_only_fields = ("id", "from_user", "status", "created_at", "updated_at")

    def validate(self, attrs):
        request = self.context.get("request")
        from_user = getattr(request, "user", None)
        to_user = attrs.get("to_user")
        if not from_user or not from_user.is_authenticated:
            raise serializers.ValidationError("Authentication required.")
        if from_user == to_user:
            raise serializers.ValidationError("Cannot send friend request to yourself.")

        # Prevent sending if blocked or already existing
        existing = FriendRequest.objects.filter(
            from_user=from_user, to_user=to_user
        ).first()
        if existing:
            raise serializers.ValidationError(
                "A friend request already exists between these users."
            )

        # Also check if 'to_user' previously blocked 'from_user'
        blocked = FriendRequest.objects.filter(
            from_user=to_user, to_user=from_user, status=FriendRequest.STATUS_BLOCKED
        ).exists()
        if blocked:
            raise serializers.ValidationError("You are blocked by this user.")

        return attrs

    def create(self, validated_data):
        request = self.context.get("request")
        from_user = getattr(request, "user", None)
        validated_data["from_user"] = from_user
        # default message may be empty
        return super().create(validated_data)


class PasswordChangeSerializer(serializers.Serializer):
    """Simple serializer for password updates."""

    current_password = serializers.CharField(write_only=True)
    new_password = serializers.CharField(write_only=True, min_length=8)

    def validate(self, attrs):
        user: User = self.context["request"].user
        if not user.check_password(attrs["current_password"]):
            raise serializers.ValidationError(
                {"current_password": ("Incorrect password.")}
            )
        return attrs

    def save(self, **kwargs):
        user: User = self.context["request"].user
        user.set_password(self.validated_data["new_password"])
        user.save(update_fields=["password"])
        # mark as changed and clear first-login requirement
        user.mark_password_changed()
        return user


class GroupCreateSerializer(serializers.Serializer):
    """Create a Django auth Group.

    This endpoint is intended for admins to manage available user groups.
    """

    name = serializers.CharField(max_length=150)

    def validate_name(self, value: str) -> str:
        name = (value or "").strip()
        if not name:
            raise serializers.ValidationError("Group name is required.")
        if Group.objects.filter(name__iexact=name).exists():
            raise serializers.ValidationError("A group with this name already exists.")
        return name

    def create(self, validated_data):
        return Group.objects.create(name=validated_data["name"])


class AdminCreateUserSerializer(serializers.Serializer):
    """Create a new user (admin-only) and assign them to a group.

    The password is generated server-side and sent to the provided email.
    """

    username = serializers.CharField(max_length=150)
    email = serializers.EmailField()
    group_id = serializers.IntegerField()
    section_name = serializers.CharField(max_length=255, required=False)

    def validate(self, attrs):
        attrs = super().validate(attrs)

        username = (attrs.get("username") or "").strip()
        email = (attrs.get("email") or "").strip()
        group_id = attrs.get("group_id")

        if not username:
            raise serializers.ValidationError({"username": "Username is required."})
        if not email:
            raise serializers.ValidationError({"email": "Email is required."})
        if group_id in (None, ""):
            raise serializers.ValidationError({"group_id": "group_id is required."})

        if User.objects.filter(username__iexact=username).exists():
            raise serializers.ValidationError(
                {"username": "A user with this username already exists."}
            )
        if User.objects.filter(email__iexact=email).exists():
            raise serializers.ValidationError(
                {"email": "A user with this email already exists."}
            )

        try:
            group_obj = Group.objects.filter(id=int(group_id)).first()
        except Exception:
            group_obj = None

        if not group_obj:
            raise serializers.ValidationError(
                {
                    "group_id": "Group not found for this id. Create it first, then assign the user."
                }
            )

        requested_section_name = (attrs.get("section_name") or "").strip()
        existing_section_name = ""
        try:
            existing_section_name = (group_obj.profile.section_name or "").strip()
        except Exception:
            existing_section_name = ""

        # Require section_name only when the group doesn't have one yet.
        if not existing_section_name and not requested_section_name:
            raise serializers.ValidationError(
                {"section_name": "section_name is required for this group."}
            )

        attrs["username"] = username
        attrs["email"] = email
        attrs["group_obj"] = group_obj
        if requested_section_name:
            attrs["section_name"] = requested_section_name
        return attrs

    def create_user_and_assign_group(self, *, password: str) -> User:
        """Create the user and attach group inside a DB transaction."""

        validated = dict(self.validated_data)
        group_obj = validated.pop("group_obj")
        validated.pop("group_id", None)
        section_name = (validated.pop("section_name", None) or "").strip()

        with transaction.atomic():
            user = User(**validated)
            user.set_password(password)
            # Ensure it can log in; keep same flags as registration flow.
            user.is_first_login = True
            user.last_password_change = timezone.now()
            user.save()
            user.groups.add(group_obj)

            if section_name:
                GroupProfile.objects.update_or_create(
                    group=group_obj, defaults={"section_name": section_name}
                )
        return user
