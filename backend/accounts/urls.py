from django.urls import path
from .views import (
    AdminCreateUserView,
    AdminUserDeleteView,
    AdminUserUpdateView,
    LoginView,
    ProfileView,
    PublicProfileView,
    RegisterView,
    ForgotPasswordView,
    ResetPasswordView,
    PasswordChangeView,
    ResetTOTPAPIView,
    TOTPSetupAPIView,
    UserListView,
)

app_name = "accounts"

urlpatterns = [
    path("register/", RegisterView.as_view(), name="register"),
    path("login/", LoginView.as_view(), name="login"),
    path("admin/users/", AdminCreateUserView.as_view(), name="admin-users-create"),
    path(
        "admin/users/<int:user_id>/",
        AdminUserUpdateView.as_view(),
        name="admin-users-update",
    ),
    path(
        "admin/users/<int:user_id>/delete/",
        AdminUserDeleteView.as_view(),
        name="admin-users-delete",
    ),
    path("profile/", ProfileView.as_view(), name="profile"),
    path("profile/<int:pk>/", PublicProfileView.as_view(), name="profile-detail"),
    path("forgot-password/", ForgotPasswordView.as_view(), name="forgot-password"),
    path(
        "forget-password/", ForgotPasswordView.as_view(), name="forget-password-alias"
    ),
    path("reset-password/", ResetPasswordView.as_view(), name="reset-password"),
    path("change-password/", PasswordChangeView.as_view(), name="change-password"),
    path("reset-totp/", ResetTOTPAPIView.as_view(), name="reset-totp"),
    path("setup-totp/", TOTPSetupAPIView.as_view(), name="setup-totp"),
    path("users/", UserListView.as_view(), name="users-list"),
]
