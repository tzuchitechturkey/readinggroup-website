from django.contrib.auth import authenticate
from django.contrib.auth.models import Group
from django.db.models import Q
from django.utils import timezone
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import serializers
from readinggroup_backend.helpers import DateTimeFormattingMixin
from .models import User, FriendRequest


try:
    from content.models import Post
except Exception:  # pragma: no cover - defensive import
    Post = None


class UserSerializer(DateTimeFormattingMixin, serializers.ModelSerializer):
    """Serialize the public profile of a user."""
    datetime_fields = ("date_joined", "last_password_change")
    groups = serializers.SerializerMethodField()
    profile_image_url = serializers.SerializerMethodField()
    status = serializers.SerializerMethodField()
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
            "is_first_login",
            "last_password_change",
            "date_joined",
            "groups",
            "profile_image_url",
            "status"
        )
        read_only_fields = (
            "id",
            "is_staff",
            "is_active",
            "date_joined"
        )

    def get_groups(self, obj):
        return list(obj.groups.values_list("name", flat=True))
    
    def get_status(self, obj):
        try:
            pending_requests = FriendRequest.objects.filter(
                to_user=obj,
                status=FriendRequest.STATUS_PENDING
            ).count()
            if pending_requests > 0:
                return f"You have {pending_requests} pending friend request(s)."
            return "No pending friend requests."
        except Exception:
            return "Status unavailable."

    def get_profile_image_url(self, obj):
        request = self.context.get('request')
        if obj.profile_image and hasattr(obj.profile_image, 'url'):
            if request:
                return request.build_absolute_uri(obj.profile_image.url)
            return obj.profile_image.url
        return None

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
            raise serializers.ValidationError({"email": "A user with this email already exists."})

        # Check username uniqueness (case-insensitive)
        if username and User.objects.filter(username__iexact=username).exists():
            raise serializers.ValidationError({"username": "A user with this username already exists."})

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

            user = authenticate(request=request, username=user_obj.username, password=password)

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
    datetime_fields = ("date_joined")
    profile_image_url = serializers.SerializerMethodField()
    posts_count = serializers.SerializerMethodField()
    followers_count = serializers.SerializerMethodField()
    following_count = serializers.SerializerMethodField()
    status = serializers.SerializerMethodField()

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
        read_only_fields = (
            "id", 
            "is_staff",
            "is_active",
            "date_joined"
        )

    def get_profile_image_url(self, obj):
        request = self.context.get('request')
        if hasattr(obj, 'profile_image') and obj.profile_image and hasattr(obj.profile_image, 'url'):
            if request:
                return request.build_absolute_uri(obj.profile_image.url)
            return obj.profile_image.url
        return None
    
    def get_status(self, obj):
        try:
            pending_requests = FriendRequest.objects.filter(
                to_user=obj,
                status=FriendRequest.STATUS_PENDING
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
            return FriendRequest.objects.filter(to_user=obj, status=FriendRequest.STATUS_ACCEPTED).count()
        except Exception:
            return 0

    def get_following_count(self, obj):
        try:
            return FriendRequest.objects.filter(from_user=obj, status=FriendRequest.STATUS_ACCEPTED).count()
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
            "updated_at"
        )
        read_only_fields = (
            "id",
            "from_user",
            "status",
            "created_at",
            "updated_at"
        )

    def validate(self, attrs):
        request = self.context.get("request")
        from_user = getattr(request, "user", None)
        to_user = attrs.get("to_user")
        if not from_user or not from_user.is_authenticated:
            raise serializers.ValidationError("Authentication required.")
        if from_user == to_user:
            raise serializers.ValidationError("Cannot send friend request to yourself.")

        # Prevent sending if blocked or already existing
        existing = FriendRequest.objects.filter(from_user=from_user, to_user=to_user).first()
        if existing:
            raise serializers.ValidationError("A friend request already exists between these users.")

        # Also check if 'to_user' previously blocked 'from_user'
        blocked = FriendRequest.objects.filter(from_user=to_user, to_user=from_user, status=FriendRequest.STATUS_BLOCKED).exists()
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
            raise serializers.ValidationError({"current_password": ("Incorrect password.")})
        return attrs

    def save(self, **kwargs):
        user: User = self.context["request"].user
        user.set_password(self.validated_data["new_password"])
        user.save(update_fields=["password"])
        # mark as changed and clear first-login requirement
        user.mark_password_changed()
        return user
