from django.db import models


# ======================================================= Content Model Start =======================================================
class ContentStatus(models.TextChoices):
    DRAFT = "draft", "Draft"
    PUBLISHED = "published", "Published"
    ARCHIVED = "archived", "Archived"


# ======================================================= Content Model End =======================================================
# ======================================================= Video Model Start =======================================================
class VideoStatus(models.TextChoices):
    DRAFT = "draft", "Draft"
    PUBLISHED = "published", "Published"
    ARCHIVED = "archived", "Archived"


# ======================================================= Video Model End =======================================================
# ======================================================= Event Model Start =======================================================
class ReportType(models.TextChoices):
    VIDEOS = "videos", "Videos"
    REPORTS = "reports", "Reports"
    NEWS = "news", "News"


class EventStatus(models.TextChoices):
    DRAFT = "draft", "Draft"
    PUBLISHED = "published", "Published"
    ARCHIVED = "archived", "Archived"


# ======================================================= Event Model End =======================================================
# ======================================================= Post Model Start =======================================================
class PostType(models.TextChoices):
    CARD = "card", "Card"
    PHOTO = "photo", "Photo"


class PostStatus(models.TextChoices):
    DRAFT = "draft", "Draft"
    PUBLISHED = "published", "Published"
    ARCHIVED = "archived", "Archived"


# ======================================================= Post Model End =======================================================


class LanguageChoices(models.TextChoices):
    ENGLISH = "en", "English"
    TURKISH = "tr", "Turkish"
    ARABIC = "ar", "Arabic"
    CHINESE = "ch", "Chinese"
    JAPANESE = "jp", "Japanese"
    CHINESE_SIMPLIFIED = "chsi", "Chinese Simplified"
