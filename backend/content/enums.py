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
class PostType(models.TextChoices):
    CARD = "card", "Card"
    PHOTO = "photo", "Photo"
    READING = "reading", "Reading"


class VideoType(models.TextChoices):
    FULL_VIDEO = "full_video", "Full Video"
    UNIT_VIDEO = "unit_video", "Unit Video"
    

class ReportType(models.TextChoices):
    VIDEOS = "videos", "Videos"
    REPORTS = "reports", "Reports"
    NEWS = "news", "News"