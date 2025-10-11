from django.urls import path

from .views import LoginView, PasswordChangeView, ProfileView, RegisterView

app_name = "accounts"

urlpatterns = [
    path("register/", RegisterView.as_view(), name="register"),
    path("login/", LoginView.as_view(), name="login"),
    path("profile/", ProfileView.as_view(), name="profile"),
    path("change-password/", PasswordChangeView.as_view(), name="change-password"),
]
