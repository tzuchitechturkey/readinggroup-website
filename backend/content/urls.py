from rest_framework.routers import DefaultRouter

from .views import (
    EventViewSet,
    HistoryEntryViewSet,
    MediaCardViewSet,
    PostViewSet,
    TeamMemberViewSet,
    TvProgramViewSet,
    VideoViewSet,
    WeeklyMomentViewSet,
)

app_name = "content"

router = DefaultRouter()
router.register(r"videos", VideoViewSet, basename="video")
router.register(r"posts", PostViewSet, basename="post")
router.register(r"events", EventViewSet, basename="event")
router.register(r"media-cards", MediaCardViewSet, basename="media-card")
router.register(r"tv-programs", TvProgramViewSet, basename="tv-program")
router.register(r"weekly-moments", WeeklyMomentViewSet, basename="weekly-moment")
router.register(r"team", TeamMemberViewSet, basename="team-member")
router.register(r"history", HistoryEntryViewSet, basename="history-entry")

urlpatterns = router.urls
