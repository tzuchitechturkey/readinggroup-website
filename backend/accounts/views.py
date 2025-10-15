from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken

from .serializers import (
    LoginSerializer,
    PasswordChangeSerializer,
    ProfileUpdateSerializer,
    RegisterSerializer,
    UserSerializer,
)

from django.contrib.auth import get_user_model
from django.core.mail import send_mail
from django.utils.crypto import get_random_string
from django.conf import settings
from rest_framework import serializers


class RegisterView(generics.CreateAPIView):
    """Register a new user and issue JWT tokens."""

    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        refresh = RefreshToken.for_user(user)
        return Response(
            {
                "user": UserSerializer(user).data,
                "access": str(refresh.access_token),
                "refresh": str(refresh),
            },
            status=status.HTTP_201_CREATED,
        )


class LoginView(APIView):
    """Authenticate an existing user."""

    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = LoginSerializer(data=request.data, context={"request": request})
        serializer.is_valid(raise_exception=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class ProfileView(generics.RetrieveUpdateAPIView):
    """Allow authenticated users to view and update their profile."""

    serializer_class = ProfileUpdateSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user

    def retrieve(self, request, *args, **kwargs):
        return Response(UserSerializer(request.user).data)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop("partial", False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(UserSerializer(instance).data)

# Forgot Password View
class ForgotPasswordView(APIView):
    permission_classes = [permissions.AllowAny]

    class ForgotPasswordSerializer(serializers.Serializer):
        email = serializers.EmailField()

    def post(self, request, *args, **kwargs):
        serializer = self.ForgotPasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data["email"]

        User = get_user_model()
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response(
                {"detail": "If the email is registered, a reset link will be sent."},
                status=status.HTTP_200_OK,
            )

        # Generate a temporary password
        temp_password = get_random_string(length=8)
        user.set_password(temp_password)
        user.save()

        # Send the temporary password via email
        send_mail(
            subject="Password Reset",
            message=f"Your temporary password is: {temp_password}",
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[email],
            fail_silently=False,
        )

        return Response(
            {"detail": "If the email is registered, a reset link will be sent."},
            status=status.HTTP_200_OK,
        )
        

# Reset Password View (requires token, old password, new password x2)
class ResetPasswordView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    class ResetPasswordSerializer(serializers.Serializer):
        old_password = serializers.CharField(write_only=True)
        new_password1 = serializers.CharField(write_only=True)
        new_password2 = serializers.CharField(write_only=True)

        def validate(self, data):
            if data["new_password1"] != data["new_password2"]:
                raise serializers.ValidationError({"new_password2": "Passwords do not match."})
            return data

    def post(self, request, *args, **kwargs):
        serializer = self.ResetPasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = request.user
        old_password = serializer.validated_data["old_password"]
        if not user.check_password(old_password):
            return Response({"old_password": "Old password is incorrect."}, status=status.HTTP_400_BAD_REQUEST)
        user.set_password(serializer.validated_data["new_password1"])
        user.save()
        return Response({"detail": "Password updated successfully."}, status=status.HTTP_200_OK)
    
class PasswordChangeView(APIView):
    """Allow authenticated users to change their password (new password x2)."""
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):
        serializer = PasswordChangeSerializer(data=request.data, context={"request": request})
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({"detail": "Password updated successfully."}, status=status.HTTP_200_OK)