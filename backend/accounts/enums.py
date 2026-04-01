from django.db import models


class GroupName(models.TextChoices):
    TEAM_LEADER = "team_leader", "Team Leader"
    EDITOR = "editor", "Editor"
    ADMIN = "admin", "Admin"
