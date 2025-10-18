from django.contrib.auth import authenticate
from django.contrib.auth.models import Group
from rest_framework import serializers
from rest_framework_simplejwt.tokens import RefreshToken

from .models import User


class UserSerializer(serializers.ModelSerializer):
    """Serialize the public profile of a user."""
    groups = serializers.SerializerMethodField()
    profile_image_url = serializers.SerializerMethodField()
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
        )
        read_only_fields = ("id", "is_staff", "is_active", "date_joined")

    def get_groups(self, obj):
        return list(obj.groups.values_list("name", flat=True))

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
        attrs = super().validate(attrs)
        username = attrs.get("username") or attrs.get("email")
        attrs["username"] = username
        return attrs

    def create(self, validated_data):
        password = validated_data.pop("password")
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        group, _created = Group.objects.get_or_create(name="user")
        user.groups.add(group)

        user.mark_password_changed()
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


class ProfileUpdateSerializer(serializers.ModelSerializer):
    """Update limited user profile fields."""

    profile_image_url = serializers.SerializerMethodField()

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
            "profile_image",
            "profession_name",
            "about_me",
            "country",
            "mobile_number",
            "address_details",
            "website_address" 
        )
        read_only_fields = ("id", "is_staff", "is_active", "date_joined")

    def get_profile_image_url(self, obj):
        request = self.context.get('request')
        if hasattr(obj, 'profile_image') and obj.profile_image and hasattr(obj.profile_image, 'url'):
            if request:
                return request.build_absolute_uri(obj.profile_image.url)
            return obj.profile_image.url
        return None

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
