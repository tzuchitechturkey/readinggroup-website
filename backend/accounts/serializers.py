from django.contrib.auth import authenticate
from django.contrib.auth.models import Group
from django.db import transaction
from django.db.models import Q
from django.utils import timezone
from readinggroup_backend.helpers import DateTimeFormattingMixin
from rest_framework import serializers
from rest_framework_simplejwt.tokens import RefreshToken

from .models import User

try:
    from content.models import Post
except Exception:
    Post = None


class UserSerializer(DateTimeFormattingMixin, serializers.ModelSerializer):
    """Serialize the public profile of a user."""

    datetime_fields = ("date_joined", "last_password_change")
    groups = serializers.SerializerMethodField()
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
    # Send group name as a string.
    group = serializers.CharField(max_length=150)
    section_name = serializers.CharField(max_length=255, required=False)

    def validate(self, attrs):
        attrs = super().validate(attrs)

        username = (attrs.get("username") or "").strip()
        email = (attrs.get("email") or "").strip()
        group_name = (attrs.get("group") or "").strip()

        if not username:
            raise serializers.ValidationError({"username": "Username is required."})
        if not email:
            raise serializers.ValidationError({"email": "Email is required."})
        if not group_name:
            raise serializers.ValidationError(
                {"group": "group (group name) is required."}
            )

        if User.objects.filter(username__iexact=username).exists():
            raise serializers.ValidationError(
                {"username": "A user with this username already exists."}
            )
        if User.objects.filter(email__iexact=email).exists():
            raise serializers.ValidationError(
                {"email": "A user with this email already exists."}
            )

        # NOTE: `group` is accepted as plain text. If the group doesn't exist yet,
        # it will be created when saving.
        group_obj = Group.objects.filter(name__iexact=group_name).first()

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
        attrs["group"] = group_name
        if requested_section_name:
            attrs["section_name"] = requested_section_name
        return attrs

    def create_user_and_assign_group(self, *, password: str) -> User:
        """Create the user and attach group inside a DB transaction."""

        validated = dict(self.validated_data)
        group_name = (validated.pop("group", None) or "").strip()
        section_name = (validated.pop("section_name", None) or "").strip()

        with transaction.atomic():
            group_obj = Group.objects.filter(name__iexact=group_name).first()
            if not group_obj:
                group_obj = Group.objects.create(name=group_name)

            user = User(**validated)
            user.set_password(password)
            # Ensure it can log in; keep same flags as registration flow.
            user.is_first_login = True
            user.last_password_change = timezone.now()
            user.save()
            user.groups.add(group_obj)
        return user


class AdminUpdateUserSerializer(serializers.Serializer):
    """Update an existing user (admin-only).

    All fields are optional to support PATCH.
    - `group` is plain text; if provided and doesn't exist, it will be created.
    - `section_name` can be provided with or without `group`. If provided with `group`, it will update the
      target group (the provided `group`, else the user's current primary group).
    """

    username = serializers.CharField(max_length=150, required=False)
    email = serializers.EmailField(required=False)
    display_name = serializers.CharField(
        max_length=255, required=False, allow_blank=True
    )
    first_name = serializers.CharField(max_length=150, required=False, allow_blank=True)
    last_name = serializers.CharField(max_length=150, required=False, allow_blank=True)
    is_staff = serializers.BooleanField(required=False)
    is_active = serializers.BooleanField(required=False)

    profession_name = serializers.CharField(
        max_length=255, required=False, allow_blank=True
    )
    about_me = serializers.CharField(required=False, allow_blank=True)
    country = serializers.CharField(max_length=100, required=False, allow_blank=True)
    mobile_number = serializers.CharField(
        max_length=20, required=False, allow_blank=True
    )
    address_details = serializers.CharField(required=False, allow_blank=True)
    website_address = serializers.URLField(required=False, allow_blank=True)

    group = serializers.CharField(max_length=150, required=False)
    section_name = serializers.CharField(
        max_length=255, required=False, allow_blank=True
    )

    def validate(self, attrs):
        attrs = super().validate(attrs)

        user: User = self.instance

        if "username" in attrs:
            username = (attrs.get("username") or "").strip()
            if not username:
                raise serializers.ValidationError(
                    {"username": "Username cannot be empty."}
                )
            if (
                User.objects.filter(username__iexact=username)
                .exclude(pk=user.pk)
                .exists()
            ):
                raise serializers.ValidationError(
                    {"username": "A user with this username already exists."}
                )
            attrs["username"] = username

        if "email" in attrs:
            email = (attrs.get("email") or "").strip()
            if not email:
                raise serializers.ValidationError({"email": "Email cannot be empty."})
            if User.objects.filter(email__iexact=email).exclude(pk=user.pk).exists():
                raise serializers.ValidationError(
                    {"email": "A user with this email already exists."}
                )
            attrs["email"] = email

        if "group" in attrs:
            group_name = (attrs.get("group") or "").strip()
            if not group_name:
                raise serializers.ValidationError({"group": "group cannot be empty."})
            attrs["group"] = group_name

            # If the group exists and has no section_name yet, require section_name when assigning.
            group_obj = Group.objects.filter(name__iexact=group_name).first()
            existing_section_name = ""
            try:
                existing_section_name = (group_obj.profile.section_name or "").strip()
            except Exception:
                existing_section_name = ""

            requested_section_name = (attrs.get("section_name") or "").strip()
            if group_obj and not existing_section_name and not requested_section_name:
                raise serializers.ValidationError(
                    {"section_name": "section_name is required for this group."}
                )

        # If section_name is provided without group, we'll update the user's current primary group.
        if "section_name" in attrs and "group" not in attrs:
            section_name = (attrs.get("section_name") or "").strip()
            if section_name:
                primary_group = user.groups.first()
                if not primary_group:
                    raise serializers.ValidationError(
                        {
                            "group": "User has no group; provide group to set section_name."
                        }
                    )
            attrs["section_name"] = section_name

        return attrs

    def save(self, **kwargs) -> User:
        user: User = self.instance
        validated = dict(self.validated_data)

        group_name = (validated.pop("group", None) or "").strip()
        section_name = (validated.pop("section_name", None) or "").strip()

        with transaction.atomic():
            # Update basic user fields
            for field, value in validated.items():
                setattr(user, field, value)
            user.save()

            target_group = None
            if group_name:
                target_group = Group.objects.filter(name__iexact=group_name).first()
                if not target_group:
                    target_group = Group.objects.create(name=group_name)
                # Replace groups with the requested one to match current API semantics.
                user.groups.set([target_group])
            else:
                target_group = user.groups.first()

        return user
