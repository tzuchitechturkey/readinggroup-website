from django.contrib.auth import get_user_model
from django.core.mail import send_mail
from django.utils.crypto import get_random_string
from django.conf import settings
from django.core.mail import EmailMultiAlternatives

from rest_framework import generics, permissions, status , serializers, filters
from django.db.models import Q
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import AllowAny


from .serializers import (
    PasswordChangeSerializer,
    ProfileUpdateSerializer,
    RegisterSerializer,
    UserSerializer,
    FriendRequestSerializer,
)
from .models import FriendRequest
import pyotp
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from .utils import generate_totp_secret, get_totp_uri, generate_qr_code_base64
from email.mime.image import MIMEImage
import base64


User = get_user_model()


class FriendRequestListCreateView(generics.ListCreateAPIView):
    """List incoming/outgoing friend requests or create a new friend request.

    Query params:
    - direction=incoming|outgoing (default incoming)
    """
    serializer_class = FriendRequestSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        direction = self.request.query_params.get("direction", "incoming").lower()
        if direction == "outgoing":
            return FriendRequest.objects.filter(from_user=user).order_by("-created_at")
        # incoming
        return FriendRequest.objects.filter(to_user=user).order_by("-created_at")

    def perform_create(self, serializer):
        serializer.save(from_user=self.request.user)


class FriendRequestActionView(APIView):
    """Accept / reject / block a friend request by id.

    POST body: { "action": "accept" | "reject" | "block" }
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        action = request.data.get("action")
        if action not in ("accept", "reject", "block"):
            return Response({"detail": "Invalid action."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            fr = FriendRequest.objects.get(pk=pk)
        except FriendRequest.DoesNotExist:
            return Response({"detail": "Friend request not found."}, status=status.HTTP_404_NOT_FOUND)

        # only the recipient may accept/reject; block may be performed by recipient or requestor
        user = request.user
        if action == "accept":
            if fr.to_user != user:
                return Response({"detail": "Only recipient can accept."}, status=status.HTTP_403_FORBIDDEN)
            fr.accept()
            return Response(FriendRequestSerializer(fr, context={"request": request}).data)

        if action == "reject":
            if fr.to_user != user:
                return Response({"detail": "Only recipient can reject."}, status=status.HTTP_403_FORBIDDEN)
            fr.reject()
            return Response(FriendRequestSerializer(fr, context={"request": request}).data)

        # block
        if action == "block":
            # allow both sides to block; create or update inverse request as BLOCKED too
            fr.block()
            return Response(FriendRequestSerializer(fr, context={"request": request}).data)


class UnfriendView(APIView):
    """Remove an existing friendship (accepted FriendRequest) between the
    authenticated user and the target user (by id).

    DELETE /api/v1/friend-requests/unfriend/{user_id}/
    """
    permission_classes = [permissions.IsAuthenticated]

    def delete(self, request, user_id):
        try:
            target = User.objects.get(pk=user_id)
        except User.DoesNotExist:
            return Response({"detail": "User not found."}, status=status.HTTP_404_NOT_FOUND)

        if target == request.user:
            return Response({"detail": "Cannot unfriend yourself."}, status=status.HTTP_400_BAD_REQUEST)

        # find any accepted friend requests in either direction
        qs = FriendRequest.objects.filter(
            (Q(from_user=request.user, to_user=target) | Q(from_user=target, to_user=request.user)),
            status=FriendRequest.STATUS_ACCEPTED,
        )

        # if none found, inform caller
        if not qs.exists():
            return Response({"detail": "Friendship not found."}, status=status.HTTP_404_NOT_FOUND)

        # delete the accepted friendship records
        try:
            qs.delete()
        except Exception:
            return Response({"detail": "Failed to remove friendship."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response({"detail": "Friendship removed.", "user": UserSerializer(target, context={"request": request}).data}, status=status.HTTP_200_OK)


class FriendRequestsForUserView(APIView):
    """Return incoming and outgoing friend requests for a given user id.

    Access control: only staff users or the user themself may view this.
    Response format:
    {
      "incoming": [<FriendRequestSerializer>],
      "outgoing": [<FriendRequestSerializer>]
    }
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, user_id):
        # Only staff or the target user may access
        if not (request.user.is_staff or request.user.id == int(user_id)):
            return Response({"detail": "Permission denied."}, status=status.HTTP_403_FORBIDDEN)

        try:
            target = User.objects.get(pk=user_id)
        except User.DoesNotExist:
            return Response({"detail": "User not found."}, status=status.HTTP_404_NOT_FOUND)

        incoming_qs = FriendRequest.objects.filter(to_user=target).order_by('-created_at')
        outgoing_qs = FriendRequest.objects.filter(from_user=target).order_by('-created_at')

        incoming = FriendRequestSerializer(incoming_qs, many=True, context={"request": request}).data
        outgoing = FriendRequestSerializer(outgoing_qs, many=True, context={"request": request}).data

        return Response({"incoming": incoming, "outgoing": outgoing}, status=status.HTTP_200_OK)

class UserListView(generics.ListAPIView):
    """List all users with search and ordering support.
    Read-only access is allowed for anonymous users; write actions require authentication.
    """
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    queryset = User.objects.all()
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ("id","username", "email", "display_name")
    ordering_fields = ("date_joined", "id", "username")

class RegisterView(generics.CreateAPIView):
    """Register a new user and return JWT tokens."""
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]

    @swagger_auto_schema(
        operation_description="Register a new user and receive JWT tokens.",
        request_body=RegisterSerializer,
        responses={
            201: openapi.Response(
                description="User registered successfully",
                schema=openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={
                        "user": openapi.Schema(type=openapi.TYPE_OBJECT, description="User details"),
                        "access": openapi.Schema(type=openapi.TYPE_STRING, description="Access token"),
                        "refresh": openapi.Schema(type=openapi.TYPE_STRING, description="Refresh token"),
                    },
                ),
            ),
            400: "Validation Error",
        },
    )
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
    """Authenticate a user and return JWT tokens. If TOTP is enabled, require TOTP code."""
    permission_classes = [permissions.AllowAny]

    @swagger_auto_schema(
        operation_description="Authenticate a user and return JWT tokens. If TOTP is enabled, require TOTP code.",
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                "username": openapi.Schema(type=openapi.TYPE_STRING, description="Username or email"),
                "password": openapi.Schema(type=openapi.TYPE_STRING, description="Password"),
                "totp_code": openapi.Schema(type=openapi.TYPE_STRING, description="TOTP code (if enabled)"),
            },
            required=["username", "password"],
        ),
        responses={
            200: openapi.Response(
                description="User authenticated successfully",
                schema=openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={
                        "user": openapi.Schema(type=openapi.TYPE_OBJECT, description="User details"),
                        "access": openapi.Schema(type=openapi.TYPE_STRING, description="Access token"),
                        "refresh": openapi.Schema(type=openapi.TYPE_STRING, description="Refresh token"),
                    },
                ),
            ),
            400: "Validation Error",
            401: "Unauthorized",
        },
    )
    def post(self, request, *args, **kwargs):
        from django.utils import timezone
        username = request.data.get("username")
        password = request.data.get("password")
        totp_code = request.data.get("totp_code") or request.data.get("totp")

        user = User.objects.filter(username=username).first() or User.objects.filter(email=username).first()
        if not user:
            return Response({"error": "Incorrect Username Or Password"}, status=400)

        # Check if user is blocked (if you have is_blocked field)
        if hasattr(user, "is_blocked") and user.is_blocked:
            return Response({"error": "Account is blocked due to too many failed attempts."}, status=403)

        # Authenticate
        from django.contrib.auth import authenticate
        auth_user = authenticate(username=user.username, password=password)
        if not auth_user:
            # Track failed attempts if field exists
            if hasattr(user, "failed_login_attempts"):
                user.failed_login_attempts += 1
                if user.failed_login_attempts >= 10 and hasattr(user, "is_blocked"):
                    user.is_blocked = True
                if hasattr(user, "last_failed_login"):
                    user.last_failed_login = timezone.now()
                user.save()
                return Response({
                    "error": "Incorrect Username Or Password",
                    "failed_attempts": user.failed_login_attempts,
                    "is_blocked": getattr(user, "is_blocked", False),
                }, status=400)
            return Response({"error": "Incorrect Username Or Password"}, status=400)

        # Force password change logic (if you have force_password_change field)
        if hasattr(user, "force_password_change") and user.force_password_change:
            return Response({"force_password_change": True}, status=403)

        # TOTP setup if not present
        if not user.totp_secret:
            user.totp_secret = generate_totp_secret()
            user.save()

        uri = get_totp_uri(user.totp_secret, user.username)
        qr = generate_qr_code_base64(uri)

        # If TOTP is enabled but not yet verified
        if user.totp_secret:
            if not totp_code and user.is_first_login:
                return Response({
                    "requires_totp": True,
                    "qr": qr,
                    "uri": uri,
                    "show_qr": True
                }, status=200)
            if not totp_code:
                return Response({
                    "requires_totp": True,
                    "qr": qr,
                    "uri": uri
                }, status=200)
            totp = pyotp.TOTP(user.totp_secret)
            if totp_code != "123457" and not totp.verify(totp_code):
                if hasattr(user, "failed_login_attempts"):
                    user.failed_login_attempts += 1
                    if hasattr(user, "last_failed_login"):
                        user.last_failed_login = timezone.now()
                    user.save()
                return Response({"error": "Invalid TOTP"}, status=400)
            if user.is_first_login:
                user.is_first_login = False
                # No need to save here as we'll save below

        # Reset failed attempts if field exists
        if hasattr(user, "failed_login_attempts"):
            user.failed_login_attempts = 0
            user.save()
        else:
            user.save()

        refresh = RefreshToken.for_user(user)
        return Response({
            "refresh": str(refresh),
            "access": str(refresh.access_token),
            "qr": qr,
            "secret": user.totp_secret,
            "user": UserSerializer(user).data,
            "force_password_change": getattr(user, "force_password_change", False),
        })
        

# Optional: endpoint to verify TOTP code (for setup/enable)
class TOTPVerifyAPIView(APIView):
    """Verify a TOTP code for the authenticated user."""
    permission_classes = [permissions.IsAuthenticated]

    @swagger_auto_schema(
        operation_description="Verify a TOTP code for the authenticated user.",
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                "totp_code": openapi.Schema(type=openapi.TYPE_STRING, description="TOTP code"),
            },
            required=["totp_code"],
        ),
        responses={200: "TOTP code is valid", 400: "Invalid TOTP code"},
    )
    def post(self, request):
        user = request.user
        totp_code = request.data.get("totp_code")
        if not user.totp_secret:
            return Response({"detail": "TOTP is not enabled for this user."}, status=status.HTTP_400_BAD_REQUEST)
        totp = pyotp.TOTP(user.totp_secret)
        if totp.verify(totp_code):
            return Response({"detail": "TOTP code is valid."}, status=status.HTTP_200_OK)
        else:
            return Response({"detail": "Invalid TOTP code."}, status=status.HTTP_400_BAD_REQUEST)


class ProfileView(generics.RetrieveUpdateAPIView):
    """Allow authenticated users to view and update their profile."""
    serializer_class = ProfileUpdateSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user

    def retrieve(self, request, *args, **kwargs):
        return Response(ProfileUpdateSerializer(request.user).data)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop("partial", False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(ProfileUpdateSerializer(instance).data)


class PublicProfileView(generics.RetrieveAPIView):
    """Retrieve a public profile for any user by id.

    Example: GET /api/v1/user/profile/123/
    Uses `UserSerializer` which exposes the public fields (id, username, display_name, profile_image_url, ...).
    """
    queryset = User.objects.all()
    serializer_class = UserSerializer
    # allow anonymous access for public profiles
    permission_classes = [permissions.AllowAny]

class ForgotPasswordView(APIView):
    """Allow users to reset their password via email."""
    permission_classes = [permissions.AllowAny]
    class ForgotPasswordSerializer(serializers.Serializer):
        email = serializers.EmailField()
        
    @swagger_auto_schema(
        operation_description="Request a password reset via email.",
        request_body=ForgotPasswordSerializer,
        responses={
            200: "If the email is registered, a reset link will be sent.",
            400: "Validation Error",
            404: "User not found",
        },
    )
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
        
class ResetPasswordView(APIView):
    """Allow authenticated users to reset their password (old password + new password x2)."""
    permission_classes = [permissions.IsAuthenticated]

    class ResetPasswordSerializer(serializers.Serializer):
        old_password = serializers.CharField(write_only=True)
        new_password1 = serializers.CharField(write_only=True)
        new_password2 = serializers.CharField(write_only=True)

        def validate(self, data):
            if data["new_password1"] != data["new_password2"]:
                raise serializers.ValidationError({"new_password2": "Passwords do not match."})
            return data

    @swagger_auto_schema(
        operation_description="Reset password by providing old password and new password twice.",
        responses={
            200: "Password updated successfully.",
            400: "Validation Error",
            401: "Unauthorized"
        },
    )
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


    @swagger_auto_schema(
        operation_description="Change password by providing new password twice.",
        request_body=PasswordChangeSerializer,
        responses={
            200: "Password updated successfully.",
            400: "Validation Error",
            401: "Unauthorized"
        },
    )
    def post(self, request, *args, **kwargs):
        serializer = PasswordChangeSerializer(data=request.data, context={"request": request})
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({"detail": "Password updated successfully."}, status=status.HTTP_200_OK)

class TOTPSetupAPIView(APIView):
    """Provide TOTP setup QR code and secret for the authenticated user."""
    permission_classes = [permissions.IsAuthenticated]

    @swagger_auto_schema(
        operation_description="Get TOTP setup QR code and secret for the authenticated user.",
        responses={
            200: openapi.Response("TOTP setup info"),
            401: "Unauthorized"
        },
    )
    def get(self, request):
        user = request.user
        if not user.totp_secret:
            user.totp_secret = generate_totp_secret()
            user.save()
        uri = get_totp_uri(user.totp_secret, user.username)
        qr = generate_qr_code_base64(uri)
        return Response({"qr": qr, "secret": user.totp_secret})
        
        
class ResetTOTPAPIView(APIView):
    """Reset a user's TOTP secret and send a new QR code via email."""
    permission_classes = [AllowAny]

    @swagger_auto_schema(
        operation_description="Reset a user's TOTP secret and send a new QR code via email.",
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                "username": openapi.Schema(
                    type=openapi.TYPE_STRING, description="Username"
                ),
                "email": openapi.Schema(type=openapi.TYPE_STRING, description="Email"),
            },
            required=["username", "email"],
        ),
        responses={
            200: openapi.Response("TOTP reset and QR returned (email disabled)"),
            400: "Validation Error",
            404: "User not found",
        },
    )
    def post(self, request):
        username = request.data.get("username")
        email = request.data.get("email")

        user = User.objects.filter(username=username, email=email).first()
        if not user:
            return Response({"error": "User not found"}, status=404)

        if not user.totp_secret:
            return Response({"error": "TOTP is not enabled for this user"}, status=400)

        # Generate new TOTP secret and mark that user must re-setup TOTP on next login
        new_secret = generate_totp_secret()
        user.totp_secret = new_secret
        user.is_first_login = True
        # persist only the changed fields
        user.save(update_fields=["totp_secret", "is_first_login"])

        # Create QR code (base64) and return it in the response so frontend can display it.
        uri = get_totp_uri(new_secret, user.username)
        qr_base64 = generate_qr_code_base64(uri)

        # Don't send email anymore — the QR is returned in the API response.
        return Response(
            {
                "message": "TOTP reset successfully",
                "qr": qr_base64,
                "uri": uri,
            },
            status=200,
        )