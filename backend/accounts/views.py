from django.contrib.auth import get_user_model
from django.core.mail import send_mail
from django.utils.crypto import get_random_string
from django.conf import settings
from django.core.mail import EmailMultiAlternatives

from rest_framework import generics, permissions, status , serializers
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import AllowAny


from .serializers import (
    LoginSerializer,
    PasswordChangeSerializer,
    ProfileUpdateSerializer,
    RegisterSerializer,
    UserSerializer,
)
import pyotp
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from .utils import generate_totp_secret, get_totp_uri, generate_qr_code_base64
from email.mime.image import MIMEImage
import base64


User = get_user_model()

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
        username = request.data.get("username")
        password = request.data.get("password")
        totp_code = request.data.get("totp_code")
        user = User.objects.filter(username=username).first() or User.objects.filter(email=username).first()
        if not user or not user.check_password(password):
            return Response({"detail": "Invalid credentials."}, status=status.HTTP_401_UNAUTHORIZED)
        # If user has TOTP enabled, require code
        if user.totp_secret:
            if not totp_code:
                return Response({"detail": "TOTP code required."}, status=status.HTTP_400_BAD_REQUEST)
            totp = pyotp.TOTP(user.totp_secret)
            if not totp.verify(totp_code):
                return Response({"detail": "Invalid TOTP code."}, status=status.HTTP_401_UNAUTHORIZED)
        refresh = RefreshToken.for_user(user)
        return Response(
            {
                "user": UserSerializer(user).data,
                "access": str(refresh.access_token),
                "refresh": str(refresh),
            },
            status=status.HTTP_200_OK,
        )


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
        return Response(UserSerializer(request.user).data)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop("partial", False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(UserSerializer(instance).data)

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
            200: openapi.Response("TOTP reset and email sent"),
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

        # Generate new TOTP secret
        new_secret = generate_totp_secret()
        user.totp_secret = new_secret
        user.save()

        # Create QR code
        uri = get_totp_uri(new_secret, user.username)
        qr_base64 = generate_qr_code_base64(uri)
        if qr_base64.startswith("data:image"):
            qr_base64 = qr_base64.split(",")[1]

        qr_image_data = base64.b64decode(qr_base64)

        # Create email
        subject = "Your TOTP Reset Instructions"
        from_email = settings.DEFAULT_FROM_EMAIL
        to = [user.email]
        text_content = f"Hi {user.username},\nYour TOTP has been reset. Please check your email in HTML view to see the QR code."

        html_content = f"""
        <html>
        <body>
            <p>Hi {user.username},</p>
            <p>Your TOTP secret has been <strong>reset</strong>.</p>
            <p>Please scan the new QR code below using your authenticator app:</p>
            <img src=\"cid:qr_code\" alt=\"QR Code\" />
            <p>If you did not request this, please contact support immediately.</p>
        </body>
        </html>
        """

        # Build email
        email_msg = EmailMultiAlternatives(subject, text_content, from_email, to)
        email_msg.attach_alternative(html_content, "text/html")

        # Attach image
        qr_image = MIMEImage(qr_image_data)
        qr_image.add_header("Content-ID", "<qr_code>")
        qr_image.add_header("Content-Disposition", "inline", filename="qrcode.png")
        email_msg.attach(qr_image)

        # Send
        try:
            email_msg.send()
            return Response(
                {"message": "TOTP reset and email sent successfully"}, status=200
            )
        except Exception as e:
            return Response({"error": f"Failed to send email: {str(e)}"}, status=500)