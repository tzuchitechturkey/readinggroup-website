from django.contrib.auth import authenticate
from django.contrib.auth.models import Group
from django.db import transaction
from django.db.models import Q
from django.utils import timezone
from rest_framework import serializers
from rest_framework_simplejwt.tokens import RefreshToken

from readinggroup_backend.helpers import DateTimeFormattingMixin
from .enums import GroupName
from .models import User

try:
    from content.models import Post
except Exception:
    Post = None


def _demote_existing_team_leaders(
    *, section_name: str, exclude_user_id: int | None = None
):
    """Ensure there is at most one team leader per section.

    Business rule:
    - If a new user becomes `team_leader` for a given `section_name`, any existing
      `team_leader` user(s) in that same section are demoted to `editor`.
    """

    section_name = (section_name or "").strip()
    if not section_name:
        return

    editor_group, _created = Group.objects.get_or_create(name=GroupName.EDITOR)

    qs = User.objects.filter(
        section_name=section_name,
        groups__name=GroupName.TEAM_LEADER,
    )
    if exclude_user_id is not None:
        qs = qs.exclude(pk=exclude_user_id)

    for user in qs:
        user.groups.set([editor_group])


# =========================
# User Serializer
# =========================
class UserSerializer(DateTimeFormattingMixin, serializers.ModelSerializer):
    datetime_fields = ("date_joined", "last_password_change")
    profile_image_url = serializers.SerializerMethodField()
    posts_count = serializers.SerializerMethodField()
    group = serializers.SerializerMethodField()

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
            "group",
            "section_name",
            "category_name",
            "is_first_login",
            "last_password_change",
            "date_joined",
            "profile_image_url",
            "posts_count",
            "profession_name",
            "about_me",
            "country",
            "mobile_number",
            "address_details",
            "website_address",
        )

    def get_profile_image_url(self, obj):
        request = self.context.get("request")
        if obj.profile_image and hasattr(obj.profile_image, "url"):
            if request:
                return request.build_absolute_uri(obj.profile_image.url)
            return obj.profile_image.url
        return None

    def get_posts_count(self, obj):
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

            return Post.objects.filter(queries).count() if queries else 0
        except Exception:
            return 0

    def get_group(self, obj):
        """Return the user's primary group name.

        For safety, expose this only to staff users (e.g. admin panel).
        """

        request = self.context.get("request")
        if not request or not getattr(request, "user", None):
            return None
        if not getattr(request.user, "is_staff", False):
            return None

        try:
            groups = list(obj.groups.all())
            return groups[0].name if groups else None
        except Exception:
            return None


# =========================
# Register
# =========================
class RegisterSerializer(serializers.ModelSerializer):
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
        )

    def validate(self, attrs):
        username = (attrs.get("username") or attrs.get("email")).strip()
        email = (attrs.get("email") or "").strip().lower()

        if not email:
            raise serializers.ValidationError({"email": "Email is required."})

        if User.objects.filter(email__iexact=email).exists():
            raise serializers.ValidationError(
                {"email": "A user with this email already exists."}
            )

        if User.objects.filter(username__iexact=username).exists():
            raise serializers.ValidationError(
                {"username": "A user with this username already exists."}
            )

        attrs["username"] = username
        attrs["email"] = email
        return attrs

    def create(self, validated_data):
        password = validated_data.pop("password")

        user = User(**validated_data)
        user.set_password(password)
        user.is_first_login = True
        user.totp_verified = False
        user.last_password_change = timezone.now()
        user.save()

        return user

    def to_representation(self, instance):
        return UserSerializer(instance).data


# =========================
# Login
# =========================
class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        identifier = attrs.get("username")
        password = attrs.get("password")
        request = self.context.get("request")

        user = authenticate(request=request, username=identifier, password=password)

        if user is None:
            try:
                user_obj = User.objects.get(email__iexact=identifier)
                user = authenticate(
                    request=request,
                    username=user_obj.username,
                    password=password,
                )
            except User.DoesNotExist:
                raise serializers.ValidationError("Invalid credentials.")

        if not user:
            raise serializers.ValidationError("Invalid credentials.")

        refresh = RefreshToken.for_user(user)

        return {
            "access": str(refresh.access_token),
            "refresh": str(refresh),
            "user": user,
        }

    def to_representation(self, instance):
        return {
            "access": instance["access"],
            "refresh": instance["refresh"],
            "user": UserSerializer(instance["user"]).data,
        }


# =========================
# Profile Update
# =========================
class ProfileUpdateSerializer(DateTimeFormattingMixin, serializers.ModelSerializer):
    datetime_fields = ("date_joined",)
    section_name = serializers.CharField(required=False, allow_blank=True)
    category_name = serializers.CharField(required=False, allow_blank=True)

    class Meta:
        model = User
        fields = (
            "id",
            "email",
            "username",
            "display_name",
            "first_name",
            "last_name",
            "section_name",
            "category_name",
            "profile_image",
            "profession_name",
            "about_me",
            "country",
            "mobile_number",
            "address_details",
            "website_address",
        )

    def validate(self, attrs):
        attrs = super().validate(attrs)
        instance: User = self.instance

        if "email" in attrs:
            email = (attrs.get("email") or "").strip().lower()
            if not email:
                raise serializers.ValidationError({"email": "Email cannot be empty."})

            if (
                User.objects.filter(email__iexact=email)
                .exclude(pk=getattr(instance, "pk", None))
                .exists()
            ):
                raise serializers.ValidationError({"email": "Email already exists"})

            attrs["email"] = email

        return attrs


# =========================
# Password Change
# =========================
class PasswordChangeSerializer(serializers.Serializer):
    current_password = serializers.CharField(write_only=True)
    new_password = serializers.CharField(write_only=True, min_length=8)

    def validate(self, attrs):
        user = self.context["request"].user
        if not user.check_password(attrs["current_password"]):
            raise serializers.ValidationError(
                {"current_password": "Incorrect password."}
            )
        return attrs

    def save(self):
        user = self.context["request"].user
        user.set_password(self.validated_data["new_password"])
        user.save(update_fields=["password"])
        user.mark_password_changed()
        return user


# =========================
# Admin Create User
# =========================
class AdminCreateUserSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=150)
    email = serializers.EmailField()
    group = serializers.CharField(max_length=150)
    section_name = serializers.CharField(required=False, allow_blank=True)
    category_name = serializers.CharField(required=False, allow_blank=True)

    def validate(self, attrs):
        attrs = super().validate(attrs)

        username = (attrs.get("username") or "").strip()
        email = (attrs.get("email") or "").strip().lower()
        group_name = (attrs.get("group") or "").strip()
        section_name = (attrs.get("section_name") or "").strip()
        category_name = (attrs.get("category_name") or "").strip()

        if not username:
            raise serializers.ValidationError({"username": "Username is required."})
        if not email:
            raise serializers.ValidationError({"email": "Email is required."})
        if not group_name:
            raise serializers.ValidationError({"group": "Group is required."})

        if User.objects.filter(username__iexact=username).exists():
            raise serializers.ValidationError({"username": "Username already exists"})
        if User.objects.filter(email__iexact=email).exists():
            raise serializers.ValidationError({"email": "Email already exists"})

        attrs["username"] = username
        attrs["email"] = email
        attrs["group"] = group_name
        attrs["section_name"] = section_name
        attrs["category_name"] = category_name

        if attrs["group"] == GroupName.TEAM_LEADER and not attrs["section_name"]:
            raise serializers.ValidationError(
                {"section_name": "section_name is required for team_leader."}
            )
        return attrs

    def create_user_and_assign_group(self, *, password: str) -> User:
        """Create user + assign group (admin flow).

        `views.py` generates the password and emails it, so we accept the password as an argument.
        """

        validated = dict(self.validated_data)
        group_name = (validated.pop("group", "") or "").strip()
        section_name = (validated.pop("section_name", "") or "").strip()
        category_name = (validated.pop("category_name", "") or "").strip()

        with transaction.atomic():
            group_obj, _created = Group.objects.get_or_create(name=group_name)

            if group_name == GroupName.TEAM_LEADER:
                _demote_existing_team_leaders(section_name=section_name)

            user = User(**validated)
            user.section_name = section_name or None
            user.category_name = category_name or None
            user.set_password(password)
            user.is_first_login = True
            user.totp_verified = False
            user.last_password_change = timezone.now()
            user.save()
            user.groups.set([group_obj])
        return user


# =========================
# Admin Update User
# =========================
class AdminUpdateUserSerializer(serializers.Serializer):

    username = serializers.CharField(max_length=150, required=False)
    email = serializers.EmailField(required=False)
    display_name = serializers.CharField(required=False, allow_blank=True)
    first_name = serializers.CharField(required=False, allow_blank=True)
    last_name = serializers.CharField(required=False, allow_blank=True)
    group = serializers.CharField(max_length=150, required=False)
    section_name = serializers.CharField(required=False, allow_blank=True)
    category_name = serializers.CharField(required=False, allow_blank=True)

    def validate(self, attrs):
        attrs = super().validate(attrs)
        user: User = self.instance

        if "username" in attrs:
            attrs["username"] = (attrs.get("username") or "").strip()
            if not attrs["username"]:
                raise serializers.ValidationError(
                    {"username": "Username cannot be empty."}
                )

        if "username" in attrs:
            if (
                User.objects.filter(username__iexact=attrs["username"])
                .exclude(pk=user.pk)
                .exists()
            ):
                raise serializers.ValidationError(
                    {"username": "Username already exists"}
                )

        if "email" in attrs:
            attrs["email"] = (attrs.get("email") or "").strip().lower()
            if not attrs["email"]:
                raise serializers.ValidationError({"email": "Email cannot be empty."})
            if (
                User.objects.filter(email__iexact=attrs["email"])
                .exclude(pk=user.pk)
                .exists()
            ):
                raise serializers.ValidationError({"email": "Email already exists"})

        if "group" in attrs:
            group_name = (attrs.get("group") or "").strip()
            if not group_name:
                raise serializers.ValidationError({"group": "Group cannot be empty."})
            attrs["group"] = group_name

        if "section_name" in attrs:
            attrs["section_name"] = (attrs.get("section_name") or "").strip()

        if "category_name" in attrs:
            attrs["category_name"] = (attrs.get("category_name") or "").strip()

        # If the target group is team_leader, section_name must be present (either existing or provided).
        target_group = attrs.get("group")
        current_is_team_leader = user.groups.filter(name=GroupName.TEAM_LEADER).exists()
        target_is_team_leader = target_group == GroupName.TEAM_LEADER or (
            target_group is None and current_is_team_leader
        )

        if target_is_team_leader:
            target_section = (
                attrs.get("section_name")
                if "section_name" in attrs
                else (user.section_name or "")
            )
            if not (target_section or "").strip():
                raise serializers.ValidationError(
                    {"section_name": "section_name is required for team_leader."}
                )

        return attrs

    def save(self, **kwargs) -> User:
        user: User = self.instance
        validated = dict(self.validated_data)

        group_name = (validated.pop("group", "") or "").strip()
        section_name = validated.pop("section_name", None)
        category_name = validated.pop("category_name", None)

        with transaction.atomic():
            for field, value in validated.items():
                setattr(user, field, value)

            if section_name is not None:
                user.section_name = section_name or None

            if category_name is not None:
                user.category_name = category_name or None

            user.save()

            current_is_team_leader = user.groups.filter(
                name=GroupName.TEAM_LEADER
            ).exists()
            target_is_team_leader = bool(
                group_name == GroupName.TEAM_LEADER
                or (not group_name and current_is_team_leader)
            )
            target_section = (
                (user.section_name or "").strip() if target_is_team_leader else ""
            )

            if target_is_team_leader:
                _demote_existing_team_leaders(
                    section_name=target_section,
                    exclude_user_id=user.pk,
                )

            if group_name:
                group_obj, _created = Group.objects.get_or_create(name=group_name)
                user.groups.set([group_obj])

        return user
