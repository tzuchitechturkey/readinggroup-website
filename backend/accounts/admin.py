from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as DjangoUserAdmin

from .models import User, FriendRequest


@admin.register(User)
class UserAdmin(DjangoUserAdmin):
    """Expose the custom user model in the admin site."""

    fieldsets = DjangoUserAdmin.fieldsets + (
        (
            "Profile",
            {"fields": ("display_name", "is_first_login", "last_password_change")},
        ),
    )
    add_fieldsets = DjangoUserAdmin.add_fieldsets + (
        (None, {"classes": ("wide",), "fields": ("display_name",)}),
    )
    list_display = ("username", "email", "display_name", "is_staff", "is_active")
    search_fields = ("username", "email", "display_name")


@admin.register(FriendRequest)
class FriendRequestAdmin(admin.ModelAdmin):
    """Admin interface for FriendRequest model."""

    list_display = ("from_user", "to_user", "status", "created_at", "updated_at")
    list_filter = ("status", "created_at", "updated_at")
    search_fields = ("from_user__username", "to_user__username", "message")
