from django.contrib.auth.models import AbstractUser, Group
from django.db import models
from django.utils import timezone
from django.core.exceptions import ValidationError


class User(AbstractUser):
    """Custom user model that keeps usernames while enforcing unique emails."""

    # Personal information
    profile_image = models.ImageField(
        upload_to="profile_images/", null=True, blank=True
    )
    profession_name = models.CharField(max_length=255, blank=True)
    display_name = models.CharField(max_length=255, blank=True)
    about_me = models.TextField(blank=True)

    # Contect information
    country = models.CharField(max_length=100, blank=True)
    mobile_number = models.CharField(max_length=20, blank=True)
    address_details = models.TextField(blank=True)
    website_address = models.URLField(blank=True)
    email = models.EmailField(unique=True)

    # Security information
    is_first_login = models.BooleanField(default=True)
    last_password_change = models.DateTimeField(null=True, blank=True)
    totp_secret = models.CharField(max_length=32, blank=True, null=True)

    def __str__(self) -> str:  # pragma: no cover - trivial
        full_name = self.get_full_name()
        if full_name:
            return full_name
        if self.username:
            return self.username
        return self.email

    def mark_password_changed(self):
        """Mark the password as changed now and clear the first-login flag."""
        self.last_password_change = timezone.now()
        self.is_first_login = False
        self.save(update_fields=["last_password_change", "is_first_login"])


class GroupProfile(models.Model):
    """Extra metadata for a Django auth Group.

    We keep this in a separate model to avoid replacing the built-in Group model.
    """

    group = models.OneToOneField(
        Group, on_delete=models.CASCADE, related_name="profile"
    )
    section_name = models.CharField(max_length=255, blank=True, default="")

    def __str__(self) -> str:  # pragma: no cover - trivial
        return f"GroupProfile<{self.group_id}:{self.section_name}>"
