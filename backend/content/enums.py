from django.db import models

#In Post model
class PostStatus(models.TextChoices):
    DRAFT = "draft", "Draft"
    PUBLISHED = "published", "Published"
    ARCHIVED = "archived", "Archived"

#In Event model
class EventSection(models.TextChoices):
    WARM_DISCUSSION = "warm_discussion", "Warm Discussion"
    DRAMA = "drama", "Drama"
    EVENT_REPORT = "event_report", "Event Report"
    RECOMMENDATION = "recommendation", "Recommendation"
    TRENDING = "trending", "Trending"
    BREAKING = "breaking", "Breaking News"
    LATEST = "latest", "Latest Updates"
    
#In MediaCard model
class MediaCardKind(models.TextChoices):
    CARD = "card", "Card"
    PHOTO = "photo", "Photo"
    GALLERY = "gallery", "Gallery"