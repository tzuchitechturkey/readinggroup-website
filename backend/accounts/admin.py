from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as DjangoUserAdmin

from .models import User


@admin.register(User)
class UserAdmin(DjangoUserAdmin):
    """Expose the custom user model in the admin site."""

    fieldsets = DjangoUserAdmin.fieldsets + (("Profile", {"fields": ("display_name", "must_change_password", "last_password_change")}),)
    add_fieldsets = DjangoUserAdmin.add_fieldsets + (
        (None, {"classes": ("wide",), "fields": ("display_name",)}),
    )
    list_display = ("username", "email", "display_name", "is_staff", "is_active")
    search_fields = ("username", "email", "display_name")
