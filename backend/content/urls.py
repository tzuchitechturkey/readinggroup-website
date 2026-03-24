from rest_framework.routers import DefaultRouter
from .views import (
    RelatedReportsCategoryViewSet,
    ContentAttachmentViewSet,
    PhotoCollectionViewSet,
    LatestNewsImageViewSet,
    RelatedReportsViewSet,
    EventCommunityViewSet,
    VideoCategoryViewSet,
    LearnCategoryViewSet,
    OurTeamImageViewSet,
    SocialMediaViewSet,
    BookReviewViewSet,
    LatestNewsViewSet,
    NavbarLogoViewSet,
    SiteInfoViewSet,
    OurTeamViewSet,
    PhotoViewSet,
    LearnViewSet,
    VideoViewSet,
    BookViewSet,
)

app_name = "content"

router = DefaultRouter()
router.register(r"learn", LearnViewSet, basename="learn")
router.register(r"book", BookViewSet, basename="book")
router.register(r"videos", VideoViewSet, basename="video")
router.register(r"photos", PhotoViewSet, basename="photo")
router.register(r"our-team", OurTeamViewSet, basename="our-team")
router.register(r"site-info", SiteInfoViewSet, basename="site-info")
router.register(r"latest-news", LatestNewsViewSet, basename="latest-news")
router.register(r"book-reviews", BookReviewViewSet, basename="book-review")
router.register(r"navbar-logos", NavbarLogoViewSet, basename="navbar-logo")
router.register(r"social-media", SocialMediaViewSet, basename="social-media")
router.register(r"our-team-images", OurTeamImageViewSet, basename="our-team-image")
router.register(r"video-categories", VideoCategoryViewSet, basename="video-category")
router.register(r"learn-categories", LearnCategoryViewSet, basename="learn-category")
router.register(r"event-communities", EventCommunityViewSet, basename="event-community")
router.register(
    r"related-reports-categories",
    RelatedReportsCategoryViewSet,
    basename="related-reports-category",
)
router.register(r"related-reports", RelatedReportsViewSet, basename="related-reports")
router.register(
    r"content-attachments", ContentAttachmentViewSet, basename="content-attachment"
)
router.register(
    r"photo-collection", PhotoCollectionViewSet, basename="photo-collection"
)
router.register(
    r"latest-news-images", LatestNewsImageViewSet, basename="latest-news-image"
)
urlpatterns = router.urls
