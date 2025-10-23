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
    EventSectionViewSet,
    TvProgramLikeViewSet,
    WeeklyMomentLikeViewSet,
    PostLikeViewSet,
    VideoLikeViewSet,
    EventLikeViewSet,
    PostCommentViewSet,
    VideoCommentViewSet,
    TvProgramCommentViewSet,
    EventCommentViewSet,
    WeeklyMomentCommentViewSet,
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
router.register(r"likes/videos", VideoLikeViewSet, basename="like-video")
router.register(r"likes/posts", PostLikeViewSet, basename="like-post")
router.register(r"likes/events", EventLikeViewSet, basename="like-event")
router.register(r"likes/tv-programs", TvProgramLikeViewSet, basename="like-tvprogram")
router.register(r"likes/weekly-moments", WeeklyMomentLikeViewSet, basename="like-weeklymoment")
router.register(r"comments/posts", PostCommentViewSet, basename="comment-post")
router.register(r"comments/videos", VideoCommentViewSet, basename="comment-video")
router.register(r"comments/events", EventCommentViewSet, basename="comment-event")
router.register(r"comments/tv-programs", TvProgramCommentViewSet, basename="comment-tvprogram")
router.register(r"comments/weekly-moments", WeeklyMomentCommentViewSet, basename="comment-weeklymoment")

urlpatterns = router.urls