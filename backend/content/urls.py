from rest_framework.routers import DefaultRouter
from .views import (
    ContentAttachmentViewSet,
    EventCommunityViewSet,
    VideoCategoryViewSet,
    LearnCategoryViewSet,
    LearnViewSet,
    VideoViewSet,
    TeamMemberViewSet,
    PositionTeamMemberViewSet,
    SocialMediaViewSet,
    NavbarLogoViewSet,
    SiteInfoViewSet,
    AuthorsViewSet,
)

app_name = "content"

router = DefaultRouter()
router.register(r"learn", LearnViewSet, basename="learn")
router.register(r"videos", VideoViewSet, basename="video")
router.register(r"authors", AuthorsViewSet, basename="authors")
router.register(r"team", TeamMemberViewSet, basename="team-member")
router.register(r"site-info", SiteInfoViewSet, basename="site-info")
router.register(r"navbar-logos", NavbarLogoViewSet, basename="navbar-logo")
router.register(r"social-media", SocialMediaViewSet, basename="social-media")
router.register(r"video-categories", VideoCategoryViewSet, basename="video-category")
router.register(r"learn-categories", LearnCategoryViewSet, basename="learn-category")
router.register(r"event-communities", EventCommunityViewSet, basename="event-community")
router.register(
    r"content-attachments", ContentAttachmentViewSet, basename="content-attachment"
)
router.register(
    r"position-team-members", PositionTeamMemberViewSet, basename="position-team-member"
)

urlpatterns = router.urls
