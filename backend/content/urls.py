from rest_framework.routers import DefaultRouter
from .views import (
    EventViewSet,
    HistoryEntryViewSet,
    PostViewSet,
    TeamMemberViewSet,
    VideoViewSet,
    WeeklyMomentViewSet,
    VideoCategoryViewSet,
    PostCategoryViewSet,
    EventCategoryViewSet,
    PositionTeamMemberViewSet,
    EventSectionViewSet,
    CommentsViewSet,
    ReplyViewSet,
    CombinedTopLikedView,
    TopStatsViewSet,
    GlobalSearchViewSet,
    SeasonTitleViewSet,
    LikeViewSet,
    SeasonIdViewSet,
    InfoWebSiteViewSet,
)

app_name = "content"

router = DefaultRouter()
router.register(r"videos", VideoViewSet, basename="video")
router.register(r"posts", PostViewSet, basename="post")
router.register(r"events", EventViewSet, basename="event")
router.register(r"weekly-moments", WeeklyMomentViewSet, basename="weekly-moment")
router.register(r"team", TeamMemberViewSet, basename="team-member")
router.register(r"history", HistoryEntryViewSet, basename="history-entry")
router.register(r"video-categories", VideoCategoryViewSet, basename="video-category")
router.register(r"post-categories", PostCategoryViewSet, basename="post-category")
router.register(r"event-categories", EventCategoryViewSet, basename="event-category")
router.register(r"position-team-members", PositionTeamMemberViewSet, basename="position-team-member")
router.register(r"event-sections", EventSectionViewSet, basename="event-section")
router.register(r"comments", CommentsViewSet, basename="comments")
router.register(r"replies", ReplyViewSet, basename="reply")
router.register(r"top-liked-combined", CombinedTopLikedView, basename="top-liked-combined")
router.register(r"top-stats", TopStatsViewSet, basename="top-stats")
router.register(r"global-search", GlobalSearchViewSet, basename="global-search")
router.register(r"season-titles", SeasonTitleViewSet, basename="season-title")
router.register(r"likes", LikeViewSet, basename="like")
router.register(r"season-ids", SeasonIdViewSet, basename="season-id")
router.register(r"info-websites", InfoWebSiteViewSet, basename="info-website")
urlpatterns = router.urls
