from rest_framework.routers import DefaultRouter

from .views import (
    EventViewSet,
    HistoryEntryViewSet,
    PostViewSet,
    TeamMemberViewSet,
    TvProgramViewSet,
    VideoViewSet,
    WeeklyMomentViewSet,
    VideoCategoryViewSet,
    PostCategoryViewSet,
    EventCategoryViewSet,
    TvProgramCategoryViewSet,
    PositionTeamMemberViewSet,
    EventSectionViewSet
)

app_name = "content"

router = DefaultRouter()
router.register(r"videos", VideoViewSet, basename="video")
router.register(r"posts", PostViewSet, basename="post")
router.register(r"events", EventViewSet, basename="event")
router.register(r"tv-programs", TvProgramViewSet, basename="tv-program")
router.register(r"weekly-moments", WeeklyMomentViewSet, basename="weekly-moment")
router.register(r"team", TeamMemberViewSet, basename="team-member")
router.register(r"history", HistoryEntryViewSet, basename="history-entry")
router.register(r"video-categories", VideoCategoryViewSet, basename="video-category")
router.register(r"post-categories", PostCategoryViewSet, basename="post-category")
router.register(r"event-categories", EventCategoryViewSet, basename="event-category")
router.register(r"tvprogram-categories", TvProgramCategoryViewSet, basename="tvprogram-category")
router.register(r"position-team-members", PositionTeamMemberViewSet, basename="position-team-member")
router.register(r"event-sections", EventSectionViewSet, basename="event-section")

urlpatterns = router.urls
