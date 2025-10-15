from django.contrib.auth import authenticate
from django.utils.translation import gettext_lazy as _
from rest_framework import serializers
from rest_framework_simplejwt.tokens import RefreshToken

from .models import User


class UserSerializer(serializers.ModelSerializer):
    """Serialize the public profile of a user."""

    groups = serializers.SerializerMethodField()

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
        )
        read_only_fields = ("id", "is_staff", "is_active", "date_joined")

    def get_groups(self, obj):
        return list(obj.groups.values_list("name", flat=True))


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
        # For self-registered users, they have already chosen a password,
        # so do NOT force a first-login password change.
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
            raise serializers.ValidationError(_("Username and password are required."))

        user = authenticate(request=request, username=identifier, password=password)
        if user is None:
            try:
                user_obj = User.objects.get(email__iexact=identifier)
            except User.DoesNotExist as exc:
                raise serializers.ValidationError(_("Invalid credentials.")) from exc

            user = authenticate(request=request, username=user_obj.username, password=password)

        if user is None:
            raise serializers.ValidationError(_("Invalid credentials."))

        if not user.is_active:
            raise serializers.ValidationError(_("This account is disabled."))

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

    class Meta:
        model = User
        fields = (
            "id",
            "email",
            "username", 
            "first_name",
            "last_name",
            "about_me",
            "profession_name",
            "country",
            "address_details",
            "website_address",
            "mobile_number",
            "display_name",
        )


class PasswordChangeSerializer(serializers.Serializer):
    """Simple serializer for password updates."""

    current_password = serializers.CharField(write_only=True)
    new_password = serializers.CharField(write_only=True, min_length=8)

    def validate(self, attrs):
        user: User = self.context["request"].user
        if not user.check_password(attrs["current_password"]):
            raise serializers.ValidationError({"current_password": _("Incorrect password.")})
        return attrs

    def save(self, **kwargs):
        user: User = self.context["request"].user
        user.set_password(self.validated_data["new_password"])
        user.save(update_fields=["password"])
        # mark as changed and clear first-login requirement
        user.mark_password_changed()
        return user
