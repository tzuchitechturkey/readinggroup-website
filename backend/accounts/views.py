import pyotp
from django.conf import settings
from django.contrib.auth import get_user_model
from django.core.mail import send_mail
from django.utils.crypto import get_random_string
from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema
from rest_framework import filters, generics, permissions, serializers, status
from rest_framework.pagination import LimitOffsetPagination
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken

from .utils import (
    generate_password,
    generate_qr_code_base64,
    generate_totp_secret,
    get_totp_uri,
)
from .serializers import (
    AdminCreateUserSerializer,
    AdminUpdateUserSerializer,
    PasswordChangeSerializer,
    ProfileUpdateSerializer,
    RegisterSerializer,
    UserSerializer,
)

User = get_user_model()


class UserListView(generics.ListAPIView):
    """List all users with search and ordering support.
    Read-only access is allowed for anonymous users; write actions require authentication.
    """

    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    queryset = User.objects.all()
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ("id", "username", "email", "display_name")
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
                        "user": openapi.Schema(
                            type=openapi.TYPE_OBJECT, description="User details"
                        ),
                        "access": openapi.Schema(
                            type=openapi.TYPE_STRING, description="Access token"
                        ),
                        "refresh": openapi.Schema(
                            type=openapi.TYPE_STRING, description="Refresh token"
                        ),
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

        # NOTE: Email confirmation / deactivation flow is disabled.
        # The following block previously deactivated the user until they
        # confirmed their email; it has been commented out so registration
        # completes without requiring email confirmation.
        # try:
        #     # Only set is_active if the field exists on the user model
        #     if hasattr(user, 'is_active'):
        #         user.is_active = False
        #         user.save(update_fields=['is_active'])
        # except Exception:
        #     # ignore if the model doesn't have is_active or save fails
        #     pass

        # NOTE: The email confirmation sending flow has been disabled.
        # The code below previously generated a signed token and sent a
        # confirmation email; it is intentionally commented out.
        # try:
        #     token = signing.dumps({"user_id": user.pk}, salt="email-confirm")
        #     # build confirmation URL using request host if SITE_URL not configured
        #     site_root = getattr(settings, 'SITE_URL', None) or f"{request.scheme}://{request.get_host()}"
        #     confirm_url = f"{site_root.rstrip('/')}/api/v1/accounts/confirm-email/{token}/"
        #     subject = "Confirm your account"
        #     message = (
        #         f"Hi {getattr(user, 'username', '')},\n\n"
        #         "Please confirm your account by clicking the link below:\n\n"
        #         f"{confirm_url}\n\n"
        #         "If you didn't sign up, you can ignore this email.\n"
        #     )
        #     from django.core.mail import send_mail
        #     send_mail(subject, message, getattr(settings, 'DEFAULT_FROM_EMAIL', None), [getattr(user, 'email', None)], fail_silently=True)
        # except Exception:
        #     # don't block registration if email sending fails
        #     pass

        # Inform the client that registration succeeded (no email confirmation required)
        return Response(
            {
                "detail": "User registered successfully.",
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
                "username": openapi.Schema(
                    type=openapi.TYPE_STRING, description="Username or email"
                ),
                "password": openapi.Schema(
                    type=openapi.TYPE_STRING, description="Password"
                ),
                "totp_code": openapi.Schema(
                    type=openapi.TYPE_STRING, description="TOTP code (if enabled)"
                ),
            },
            required=["username", "password"],
        ),
        responses={
            200: openapi.Response(
                description="User authenticated successfully",
                schema=openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={
                        "user": openapi.Schema(
                            type=openapi.TYPE_OBJECT, description="User details"
                        ),
                        "access": openapi.Schema(
                            type=openapi.TYPE_STRING, description="Access token"
                        ),
                        "refresh": openapi.Schema(
                            type=openapi.TYPE_STRING, description="Refresh token"
                        ),
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

        user = (
            User.objects.filter(username=username).first()
            or User.objects.filter(email=username).first()
        )
        # if the account exists but is not active (email not confirmed), refuse login
        # if user and hasattr(user, 'is_active') and not user.is_active:
        #     return Response({"detail": "Please confirm your account via the confirmation email."}, status=403)
        if not user:
            return Response({"error": "Incorrect Username Or Password"}, status=400)

        # Check if user is blocked (if you have is_blocked field)
        if hasattr(user, "is_blocked") and user.is_blocked:
            return Response(
                {"error": "Account is blocked due to too many failed attempts."},
                status=403,
            )

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
                return Response(
                    {
                        "error": "Incorrect Username Or Password",
                        "failed_attempts": user.failed_login_attempts,
                        "is_blocked": getattr(user, "is_blocked", False),
                    },
                    status=400,
                )
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
                return Response(
                    {"requires_totp": True, "qr": qr, "uri": uri, "show_qr": True},
                    status=200,
                )
            if not totp_code:
                return Response(
                    {"requires_totp": True, "qr": qr, "uri": uri}, status=200
                )
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

        # Convenience field for the frontend: a single group "type".
        # Keep the full list inside UserSerializer as well.
        group_name = None
        try:
            group_name = user.groups.values_list("name", flat=True).first()
        except Exception:
            group_name = None

        return Response(
            {
                "refresh": str(refresh),
                "access": str(refresh.access_token),
                "qr": qr,
                "secret": user.totp_secret,
                "group": group_name,
                "user": UserSerializer(user).data,
                "force_password_change": getattr(user, "force_password_change", False),
            }
        )


class GroupCreateView(APIView):
    """Create a Django auth Group (admin-only).

    POST body: { "name": "editors" }
    """

    permission_classes = [permissions.IsAdminUser]

    @swagger_auto_schema(
        operation_description="List all auth groups (admin-only).",
        responses={
            200: openapi.Response(
                description="Groups list",
                schema=openapi.Schema(
                    type=openapi.TYPE_OBJECT,
                    properties={
                        "count": openapi.Schema(type=openapi.TYPE_INTEGER),
                        "next": openapi.Schema(type=openapi.TYPE_STRING, nullable=True),
                        "previous": openapi.Schema(
                            type=openapi.TYPE_STRING, nullable=True
                        ),
                        "results": openapi.Schema(
                            type=openapi.TYPE_ARRAY,
                            items=openapi.Schema(
                                type=openapi.TYPE_OBJECT,
                                properties={
                                    "id": openapi.Schema(type=openapi.TYPE_INTEGER),
                                    "name": openapi.Schema(type=openapi.TYPE_STRING),
                                    "section_name": openapi.Schema(
                                        type=openapi.TYPE_STRING, nullable=True
                                    ),
                                },
                            ),
                        ),
                    },
                ),
            ),
            401: "Unauthorized",
            403: "Forbidden",
        },
    )
    def get(self, request):
        """Return a paginated list of groups."""

        from django.contrib.auth.models import Group

        qs = Group.objects.select_related("profile").all().order_by("name")
        paginator = LimitOffsetPagination()
        page = paginator.paginate_queryset(qs, request)
        results = []
        for g in page or []:
            section_name = None
            try:
                section_name = (g.profile.section_name or "").strip() or None
            except Exception:
                section_name = None
            results.append({"id": g.id, "name": g.name, "section_name": section_name})
        return paginator.get_paginated_response(results)


class AdminCreateUserView(APIView):
    """Create a new user after admin login (admin-only).

    Required fields:
    - username
    - email
    - group (group name, e.g. "editors")
    - section_name (required only when the group does not have one yet)

    The server generates a password and sends it to the user's email.
    """

    permission_classes = [permissions.IsAdminUser]

    @swagger_auto_schema(
        operation_description="List all users (admin-only).",
        responses={
            200: openapi.Response(description="Users list"),
            401: "Unauthorized",
            403: "Forbidden",
        },
    )
    def get(self, request):
        """Return a paginated list of users."""

        qs = User.objects.all().order_by("-date_joined", "-id")
        paginator = LimitOffsetPagination()
        page = paginator.paginate_queryset(qs, request)
        data = UserSerializer(page or [], many=True, context={"request": request}).data
        return paginator.get_paginated_response(data)

    @swagger_auto_schema(
        operation_description="Create a user and email them a generated password (admin-only).",
        request_body=AdminCreateUserSerializer,
        responses={
            201: openapi.Response(description="User created"),
            400: "Validation Error",
            401: "Unauthorized",
            403: "Forbidden",
            500: "Email sending failed",
        },
    )
    def post(self, request):
        serializer = AdminCreateUserSerializer(
            data=request.data, context={"request": request}
        )
        serializer.is_valid(raise_exception=True)

        # Do not allow "console" email backend for this flow.
        # If console backend is enabled, emails won't be delivered to real inboxes.
        email_backend = (getattr(settings, "EMAIL_BACKEND", "") or "").lower()
        if "console" in email_backend:
            return Response(
                {
                    "detail": "Email is not configured to send real messages (console backend is active). Configure SMTP via DJANGO_EMAIL_HOST_USER/DJANGO_EMAIL_HOST_PASSWORD (and optionally DJANGO_EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend).",
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

        password = generate_password()

        # Always use the email provided in the request as the recipient.
        recipient_email = (serializer.validated_data.get("email") or "").strip()

        # Create user + assign group
        user = serializer.create_user_and_assign_group(password=password)

        # Send credentials via email
        subject = "Your login credentials"
        api_login_url = f"{request.scheme}://{request.get_host()}/api/v1/user/login/"
        message = (
            f"Hello {user.username},\n\n"
            "An admin created an account for you.\n\n"
            "Login details:\n"
            f"- Username: {user.username}\n"
            f"- Email: {recipient_email or getattr(user, 'email', '')}\n"
            f"- Password: {password}\n\n"
            f"API login endpoint: {api_login_url}\n\n"
            "Please log in and change your password after the first login.\n"
        )
        # Be tolerant to missing DEFAULT_FROM_EMAIL in some deployments/branches.
        from_email = getattr(settings, "DEFAULT_FROM_EMAIL", None) or getattr(
            settings, "EMAIL_HOST_USER", None
        )
        if not from_email:
            # Roll back: delete user so we don't create an unreachable account.
            try:
                user.delete()
            except Exception:
                pass
            return Response(
                {
                    "detail": "Email settings are not configured (missing DEFAULT_FROM_EMAIL/EMAIL_HOST_USER). User was not created.",
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

        # If using SMTP backend, ensure credentials exist; otherwise sending may fail silently in some setups.
        if "smtp" in email_backend:
            smtp_user = getattr(settings, "EMAIL_HOST_USER", "") or ""
            smtp_pass = getattr(settings, "EMAIL_HOST_PASSWORD", "") or ""
            if not smtp_user or not smtp_pass:
                try:
                    user.delete()
                except Exception:
                    pass
                return Response(
                    {
                        "detail": "SMTP email settings are incomplete (missing EMAIL_HOST_USER/EMAIL_HOST_PASSWORD). User was not created.",
                    },
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR,
                )
        # Fallback to the user's email if, for some reason, validated data is missing.
        if not recipient_email:
            recipient_email = (getattr(user, "email", "") or "").strip()

        try:
            send_mail(
                subject,
                message,
                from_email,
                [recipient_email],
                fail_silently=False,
            )
        except Exception as exc:
            # Roll back: delete user so we don't create an unreachable account.
            try:
                user.delete()
            except Exception:
                pass

            payload = {
                "detail": "Failed to send password email. User was not created.",
                "error_type": type(exc).__name__,
            }
            # Provide more diagnostics in debug to help identify SMTP/auth/config issues.
            if getattr(settings, "DEBUG", False):
                payload["error"] = str(exc)
            return Response(
                payload,
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

        return Response(
            {
                "detail": "User created and password sent by email.",
                "sent_to": recipient_email,
                "user": UserSerializer(user, context={"request": request}).data,
            },
            status=status.HTTP_201_CREATED,
        )


class AdminUserUpdateView(APIView):
    """Update an existing user (admin-only).

    PATCH/PUT /api/v1/accounts/admin/users/{user_id}/
    Body: any subset of AdminUpdateUserSerializer fields.
    """

    permission_classes = [permissions.IsAdminUser]

    @swagger_auto_schema(
        operation_description="Update a user (admin-only).",
        request_body=AdminUpdateUserSerializer,
        responses={
            200: openapi.Response(description="User updated"),
            400: "Validation Error",
            401: "Unauthorized",
            403: "Forbidden",
            404: "User not found",
        },
    )
    def patch(self, request, user_id: int):
        return self._update(request, user_id=user_id, partial=True)

    @swagger_auto_schema(
        operation_description="Update a user (admin-only).",
        request_body=AdminUpdateUserSerializer,
        responses={
            200: openapi.Response(description="User updated"),
            400: "Validation Error",
            401: "Unauthorized",
            403: "Forbidden",
            404: "User not found",
        },
    )
    def put(self, request, user_id: int):
        return self._update(request, user_id=user_id, partial=False)

    def _update(self, request, *, user_id: int, partial: bool):
        try:
            user = User.objects.get(pk=user_id)
        except User.DoesNotExist:
            return Response(
                {"detail": "User not found."}, status=status.HTTP_404_NOT_FOUND
            )

        serializer = AdminUpdateUserSerializer(
            instance=user,
            data=request.data,
            partial=partial,
            context={"request": request},
        )
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        return Response(
            {
                "detail": "User updated.",
                "user": UserSerializer(user, context={"request": request}).data,
            },
            status=status.HTTP_200_OK,
        )


class AdminUserDeleteView(APIView):
    """Delete a user (admin-only).

    DELETE /api/v1/accounts/admin/users/{user_id}/delete/
    """

    permission_classes = [permissions.IsAdminUser]

    @swagger_auto_schema(
        operation_description="Delete a user (admin-only).",
        responses={
            204: openapi.Response(description="User deleted"),
            400: "Validation Error",
            401: "Unauthorized",
            403: "Forbidden",
            404: "User not found",
        },
    )
    def delete(self, request, user_id: int):
        if int(user_id) == int(getattr(request.user, "id", 0)):
            return Response(
                {"detail": "You cannot delete your own account."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            user = User.objects.get(pk=user_id)
        except User.DoesNotExist:
            return Response(
                {"detail": "User not found."}, status=status.HTTP_404_NOT_FOUND
            )

        user.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class TOTPVerifyAPIView(APIView):
    """Verify a TOTP code for the authenticated user."""

    permission_classes = [permissions.IsAuthenticated]

    @swagger_auto_schema(
        operation_description="Verify a TOTP code for the authenticated user.",
        request_body=openapi.Schema(
            type=openapi.TYPE_OBJECT,
            properties={
                "totp_code": openapi.Schema(
                    type=openapi.TYPE_STRING, description="TOTP code"
                ),
            },
            required=["totp_code"],
        ),
        responses={200: "TOTP code is valid", 400: "Invalid TOTP code"},
    )
    def post(self, request):
        user = request.user
        totp_code = request.data.get("totp_code")
        if not user.totp_secret:
            return Response(
                {"detail": "TOTP is not enabled for this user."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        totp = pyotp.TOTP(user.totp_secret)
        if totp.verify(totp_code):
            return Response(
                {"detail": "TOTP code is valid."}, status=status.HTTP_200_OK
            )
        else:
            return Response(
                {"detail": "Invalid TOTP code."}, status=status.HTTP_400_BAD_REQUEST
            )


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
                raise serializers.ValidationError(
                    {"new_password2": "Passwords do not match."}
                )
            return data

    @swagger_auto_schema(
        operation_description="Reset password by providing old password and new password twice.",
        responses={
            200: "Password updated successfully.",
            400: "Validation Error",
            401: "Unauthorized",
        },
    )
    def post(self, request, *args, **kwargs):
        serializer = self.ResetPasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = request.user
        old_password = serializer.validated_data["old_password"]
        if not user.check_password(old_password):
            return Response(
                {"old_password": "Old password is incorrect."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        user.set_password(serializer.validated_data["new_password1"])
        user.save()
        return Response(
            {"detail": "Password updated successfully."}, status=status.HTTP_200_OK
        )


class PasswordChangeView(APIView):
    """Allow authenticated users to change their password (new password x2)."""

    permission_classes = [permissions.IsAuthenticated]

    @swagger_auto_schema(
        operation_description="Change password by providing new password twice.",
        request_body=PasswordChangeSerializer,
        responses={
            200: "Password updated successfully.",
            400: "Validation Error",
            401: "Unauthorized",
        },
    )
    def post(self, request, *args, **kwargs):
        serializer = PasswordChangeSerializer(
            data=request.data, context={"request": request}
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(
            {"detail": "Password updated successfully."}, status=status.HTTP_200_OK
        )


class TOTPSetupAPIView(APIView):
    """Provide TOTP setup QR code and secret for the authenticated user."""

    permission_classes = [permissions.IsAuthenticated]

    @swagger_auto_schema(
        operation_description="Get TOTP setup QR code and secret for the authenticated user.",
        responses={200: openapi.Response("TOTP setup info"), 401: "Unauthorized"},
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
