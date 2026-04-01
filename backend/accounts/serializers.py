from django.contrib.auth import authenticate
from django.db.models import Q
from django.utils import timezone
from rest_framework import serializers
from rest_framework_simplejwt.tokens import RefreshToken

from readinggroup_backend.helpers import DateTimeFormattingMixin
from .models import User
from .enums import GroupName

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
            "group_name",
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

    group_name = serializers.ChoiceField(choices=GroupName.choices, required=False)
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
            "group_name",
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
    group_name = serializers.ChoiceField(choices=GroupName.choices)
    section_name = serializers.CharField(required=False, allow_blank=True)

    def validate(self, attrs):
        if User.objects.filter(username=attrs["username"]).exists():
            raise serializers.ValidationError({"username": "Username already exists"})
        if User.objects.filter(email=attrs["email"]).exists():
            raise serializers.ValidationError({"email": "Email already exists"})
        return attrs

    def create(self, validated_data):
        from .utils import generate_password

        password = generate_password()

        user = User(
            username=validated_data["username"],
            email=validated_data["email"],
            group_name=validated_data.get("group_name"),
            section_name=validated_data.get("section_name"),
        )

        user.set_password(password)
        user.is_first_login = True
        user.last_password_change = timezone.now()
        user.save()

        return user, password


# =========================
# Admin Update User
# =========================
class AdminUpdateUserSerializer(serializers.Serializer):

    username = serializers.CharField(max_length=150, required=False)
    email = serializers.EmailField(required=False)
    display_name = serializers.CharField(required=False, allow_blank=True)
    first_name = serializers.CharField(required=False, allow_blank=True)
    last_name = serializers.CharField(required=False, allow_blank=True)

    group_name = serializers.ChoiceField(choices=GroupName.choices, required=False)
    section_name = serializers.CharField(required=False, allow_blank=True)

    def validate(self, attrs):
        user = self.instance

        if "username" in attrs:
            if (
                User.objects.filter(username=attrs["username"])
                .exclude(pk=user.pk)
                .exists()
            ):
                raise serializers.ValidationError(
                    {"username": "Username already exists"}
                )

        if "email" in attrs:
            if User.objects.filter(email=attrs["email"]).exclude(pk=user.pk).exists():
                raise serializers.ValidationError({"email": "Email already exists"})

        return attrs

    def save(self):
        user = self.instance

        for field, value in self.validated_data.items():
            setattr(user, field, value)

        user.save()
        return user
