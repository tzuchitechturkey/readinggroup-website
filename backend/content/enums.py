from django.db import models


# ======================================================= Video Model Start =====================================================
class VideoType(models.TextChoices):
    CLIP_VIDEO = "clip_video", "Clip Video"
    FULL_VIDEO = "full_video", "Full Video"
# ======================================================= Video Model End ========================================================
# =======================================================  Learn Model Start =====================================================
class LearnType(models.TextChoices):
    CARDS = "cards", "Cards"
    POSTERS = "posters", "Posters"
    
# =======================================================  Learn Model End ========================================================
# =======================================================  LearnCategory Model Start ========================================================
class LearnCategoryDirection(models.TextChoices):
    HORIZONTAL = "horizontal", "Horizontal"
    VERTICAL = "vertical", "Vertical"
    
# =======================================================  LearnCategory Model End ========================================================
# ======================================================= Language Choices Start ================================================
class LanguageChoices(models.TextChoices):
    ENGLISH = "en", "English"
    TURKISH = "tr", "Turkish"
    ARABIC = "ar", "Arabic"
    CHINESE = "ch", "Chinese"
    JAPANESE = "jp", "Japanese"
    CHINESE_SIMPLIFIED = "chsi", "Chinese Simplified"
# ======================================================= Language Choices End ===================================================
