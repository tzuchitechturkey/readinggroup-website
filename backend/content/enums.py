from django.db import models

#======================================================= Content Model Start =======================================================
class ContentStatus(models.TextChoices):
    DRAFT = "draft", "Draft"
    PUBLISHED = "published", "Published"
    ARCHIVED = "archived", "Archived"
    
#======================================================= Content Model End =======================================================
#======================================================= Video Model Start =======================================================
class VideoStatus(models.TextChoices):
    DRAFT = "draft", "Draft"
    PUBLISHED = "published", "Published"
    ARCHIVED = "archived", "Archived"
    
#======================================================= Video Model End =======================================================
#======================================================= Event Model Start =======================================================    
class ReportType(models.TextChoices):
    VIDEOS = "videos", "Videos"
    REPORTS = "reports", "Reports"
    NEWS = "news", "News"
    
class EventStatus(models.TextChoices):
    DRAFT = "draft", "Draft"
    PUBLISHED = "published", "Published"
    ARCHIVED = "archived", "Archived"

#======================================================= Event Model End =======================================================
#======================================================= Post Model Start =======================================================
class PostType(models.TextChoices):
    CARD = "card", "Card"
    PHOTO = "photo", "Photo"

class PostStatus(models.TextChoices):
    DRAFT = "draft", "Draft"
    PUBLISHED = "published", "Published"
    ARCHIVED = "archived", "Archived"
    
#======================================================= Post Model End =======================================================

class Language(models.TextChoices):
    EN = "en", "English"
    AR = "ar", "Arabic"
    CH = "ch", "Chinese"
    