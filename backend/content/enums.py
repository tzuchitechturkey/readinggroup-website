from django.db import models


# ======================================================= Content Model Start =======================================================
class ContentStatus(models.TextChoices):
    DRAFT = "draft", "Draft"
    PUBLISHED = "published", "Published"
    ARCHIVED = "archived", "Archived"


# ======================================================= Content Model End =======================================================
# ======================================================= Video Model Start =======================================================

class VideoType(models.TextChoices):
    NEW_CLIP = "new_clip", "New Clip"
    FULL_LIVE_STREAM = "full_live_stream", "Full Live Stream"


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
# ======================================================= Language Choices Start ================================================
class LanguageChoices(models.TextChoices):
    ENGLISH = "en", "English"
    TURKISH = "tr", "Turkish"
    ARABIC = "ar", "Arabic"
    CHINESE = "ch", "Chinese"
    JAPANESE = "jp", "Japanese"
    CHINESE_SIMPLIFIED = "chsi", "Chinese Simplified"


# ======================================================= Language Choices End ===================================================
# =======================================================  Learn Model Start =====================================================
class LearnType(models.TextChoices):
    CARDS = "cards", "Cards"
    POSTERS = "posters", "Posters"
