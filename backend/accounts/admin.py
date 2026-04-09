from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as DjangoUserAdmin

from .models import User


@admin.register(User)
class UserAdmin(DjangoUserAdmin):
    """Expose the custom user model in the admin site."""

    fieldsets = DjangoUserAdmin.fieldsets + (
        (
            "Profile",
            {
                "fields": (
                    "display_name",
                    "is_first_login",
                    "last_password_change",
                    "section_name",
                    "category_name",
                )
            },
        ),
    )
    add_fieldsets = DjangoUserAdmin.add_fieldsets + (
        (None, {"classes": ("wide",), "fields": ("display_name",)}),
    )
    list_display = (
        "username",
        "email",
        "display_name",
        "section_name",
        "category_name",
        "get_groups",
        "is_staff",
        "is_active",
    )
    list_filter = ("is_staff", "is_active", "groups")
    search_fields = ("username", "email", "display_name")

    @admin.display(description="Groups")
    def get_groups(self, obj: User) -> str:
        """Render user's groups as a comma-separated string."""

        return ", ".join(obj.groups.values_list("name", flat=True))
