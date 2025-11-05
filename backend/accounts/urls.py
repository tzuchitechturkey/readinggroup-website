from django.urls import path

from .views import (
    LoginView,
    ProfileView, 
    PublicProfileView,
    RegisterView,
    # ConfirmEmailView,
    ForgotPasswordView,
    ResetPasswordView,
    PasswordChangeView,
    ResetTOTPAPIView,
    TOTPSetupAPIView,
    UserListView,
    FriendRequestListCreateView,
    FriendRequestActionView,
    UnfriendView,
    FriendRequestsForUserView,
    PendingFriendRequestsView,
)

app_name = "accounts"

urlpatterns = [
    path("register/", RegisterView.as_view(), name="register"),
    path("login/", LoginView.as_view(), name="login"),
    path("profile/", ProfileView.as_view(), name="profile"),
    path("profile/<int:pk>/", PublicProfileView.as_view(), name="profile-detail"),
    path("forgot-password/", ForgotPasswordView.as_view(), name="forgot-password"),
    path("forget-password/", ForgotPasswordView.as_view(), name="forget-password-alias"),
    path("reset-password/", ResetPasswordView.as_view(), name="reset-password"),
    path("change-password/", PasswordChangeView.as_view(), name="change-password"),
    path("reset-totp/", ResetTOTPAPIView.as_view(), name="reset-totp"),
    path("setup-totp/", TOTPSetupAPIView.as_view(), name="setup-totp"),
    path("users/", UserListView.as_view(), name="users-list"),
    path("friend-requests/", FriendRequestListCreateView.as_view(), name="friend-requests-list-create"),
    path("friend-requests/<int:pk>/action/", FriendRequestActionView.as_view(), name="friend-requests-action"),
    path("friend-requests/unfriend/<int:user_id>/", UnfriendView.as_view(), name="friend-requests-unfriend"),
    path("friend-requests/user/<int:user_id>/", FriendRequestsForUserView.as_view(), name="friend-requests-for-user"),
    path("friend-requests/pending/", PendingFriendRequestsView.as_view(), name="friend-requests-pending"),
    # Allow fetching pending requests for a specific user via path param (shows as path param in Swagger)
    path("friend-requests/pending/<int:user_id>/", PendingFriendRequestsView.as_view(), name="friend-requests-pending-user"),
    # path("confirm-email/<str:token>/", ConfirmEmailView.as_view(), name="confirm-email"),
]
