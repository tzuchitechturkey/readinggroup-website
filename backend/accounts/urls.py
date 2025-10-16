from django.urls import path

from .views import (
    LoginView,
    ProfileView, 
    RegisterView,
    ForgotPasswordView,
    ResetPasswordView,
    PasswordChangeView,
    ResetTOTPAPIView,
    TOTPSetupAPIView
)

app_name = "accounts"

urlpatterns = [
    path("register/", RegisterView.as_view(), name="register"),
    path("login/", LoginView.as_view(), name="login"),
    path("profile/", ProfileView.as_view(), name="profile"),
    path("forgot-password/", ForgotPasswordView.as_view(), name="forgot-password"),
    path("forget-password/", ForgotPasswordView.as_view(), name="forget-password-alias"),
    path("reset-password/", ResetPasswordView.as_view(), name="reset-password"),
    path("change-password/", PasswordChangeView.as_view(), name="change-password"),
    path("reset-totp/", ResetTOTPAPIView.as_view(), name="reset-totp"),
    path("setup-totp/", TOTPSetupAPIView.as_view(), name="setup-totp"),
]
