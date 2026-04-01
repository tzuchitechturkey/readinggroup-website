from django.contrib.auth import authenticate
from django.contrib.auth.models import Group
from django.db import transaction
from django.db.models import Q
from django.utils import timezone
from rest_framework import serializers
from rest_framework_simplejwt.tokens import RefreshToken

from readinggroup_backend.helpers import DateTimeFormattingMixin
from .models import User

try:
    from content.models import Post
except Exception:
    Post = None


# =========================
# User Serializer
# =========================
class UserSerializer(DateTimeFormattingMixin, serializers.ModelSerializer):
    datetime_fields = ("date_joined", "last_password_change")
    profile_image_url = serializers.SerializerMethodField()
    posts_count = serializers.SerializerMethodField()

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
            "section_name",
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
        email = (attrs.get("email") or "").strip()

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
        return attrs

    def create(self, validated_data):
        password = validated_data.pop("password")

        user = User(**validated_data)
        user.set_password(password)
        user.is_first_login = True
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
            "profile_image",
            "profession_name",
            "about_me",
            "country",
            "mobile_number",
            "address_details",
            "website_address",
        )


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

    def validate(self, attrs):
        attrs = super().validate(attrs)

        username = (attrs.get("username") or "").strip()
        email = (attrs.get("email") or "").strip()
        group_name = (attrs.get("group") or "").strip()
        section_name = (attrs.get("section_name") or "").strip()

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
        return attrs

    def create_user_and_assign_group(self, *, password: str) -> User:
        """Create user + assign group (admin flow).

        `views.py` generates the password and emails it, so we accept the password as an argument.
        """

        validated = dict(self.validated_data)
        group_name = (validated.pop("group", "") or "").strip()
        section_name = (validated.pop("section_name", "") or "").strip()

        with transaction.atomic():
            group_obj, _created = Group.objects.get_or_create(name=group_name)

            user = User(**validated)
            user.section_name = section_name or None
            user.set_password(password)
            user.is_first_login = True
            user.last_password_change = timezone.now()
            user.save()
            user.groups.add(group_obj)
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
            attrs["email"] = (attrs.get("email") or "").strip()
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

        return attrs

    def save(self, **kwargs) -> User:
        user: User = self.instance
        validated = dict(self.validated_data)

        group_name = (validated.pop("group", "") or "").strip()
        section_name = validated.pop("section_name", None)

        with transaction.atomic():
            for field, value in validated.items():
                setattr(user, field, value)

            if section_name is not None:
                user.section_name = section_name or None

            user.save()

            if group_name:
                group_obj, _created = Group.objects.get_or_create(name=group_name)
                user.groups.set([group_obj])

        return user
