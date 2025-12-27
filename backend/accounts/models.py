from django.contrib.auth.models import AbstractUser
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


# Friend request model for following / friend system
class FriendRequest(models.Model):
    STATUS_PENDING = "PENDING"
    STATUS_ACCEPTED = "ACCEPTED"
    STATUS_REJECTED = "REJECTED"
    STATUS_BLOCKED = "BLOCKED"

    STATUS_CHOICES = (
        (STATUS_PENDING, "Pending"),
        (STATUS_ACCEPTED, "Accepted"),
        (STATUS_REJECTED, "Rejected"),
        (STATUS_BLOCKED, "Blocked"),
    )

    from_user = models.ForeignKey(
        "User",
        related_name="sent_friend_requests",
        on_delete=models.CASCADE,
    )
    to_user = models.ForeignKey(
        "User",
        related_name="received_friend_requests",
        on_delete=models.CASCADE,
    )
    status = models.CharField(
        max_length=16, choices=STATUS_CHOICES, default=STATUS_PENDING
    )
    message = models.CharField(max_length=255, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ("from_user", "to_user")
        ordering = ("-created_at",)

    def accept(self):
        self.status = self.STATUS_ACCEPTED
        self.save(update_fields=["status", "updated_at"])

    def reject(self):
        self.status = self.STATUS_REJECTED
        self.save(update_fields=["status", "updated_at"])

    def block(self):
        self.status = self.STATUS_BLOCKED
        self.save(update_fields=["status", "updated_at"])

    def __str__(self) -> str:
        return f"FriendRequest<{self.from_user_id}->{self.to_user_id}:{self.status}>"

    def clean(self):
        """Model-level validation to prevent sending a friend request to self."""
        if self.from_user_id == self.to_user_id:
            raise ValidationError("Cannot send a friend request to yourself.")

    def save(self, *args, **kwargs):
        # enforce validation at save time as well
        self.full_clean()
        return super().save(*args, **kwargs)
