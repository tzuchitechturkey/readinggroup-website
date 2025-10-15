from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils import timezone


class User(AbstractUser):
    """Custom user model that keeps usernames while enforcing unique emails."""

    email = models.EmailField(unique=True)
    display_name = models.CharField(max_length=255, blank=True)
    is_first_login = models.BooleanField(default=True)
    last_password_change = models.DateTimeField(null=True, blank=True)

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
