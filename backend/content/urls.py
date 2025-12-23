from rest_framework.routers import DefaultRouter
from .views import (
    EventViewSet,
    HistoryEntryViewSet,
    PostViewSet,
    ContentViewSet,
    TeamMemberViewSet,
    VideoViewSet,
    VideoCategoryViewSet,
    PostCategoryViewSet,
    EventCategoryViewSet,
    ContentCategoryViewSet,
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
    SocialMediaViewSet,
    NavbarLogoViewSet,
    SiteInfoViewSet,
    ContentAttachmentViewSet,
    AuthorsViewSet,
    BookViewSet,
    BookCategoryViewSet,
)

app_name = "content"

router = DefaultRouter()
router.register(r"videos", VideoViewSet, basename="video")
router.register(r"posts", PostViewSet, basename="post")
router.register(r"events", EventViewSet, basename="event")
router.register(r"contents", ContentViewSet, basename="content")
router.register(r"team", TeamMemberViewSet, basename="team-member")
router.register(r"history", HistoryEntryViewSet, basename="history-entry")
router.register(r"video-categories", VideoCategoryViewSet, basename="video-category")
router.register(r"post-categories", PostCategoryViewSet, basename="post-category")
router.register(r"event-categories", EventCategoryViewSet, basename="event-category")
router.register(r"content-categories", ContentCategoryViewSet, basename="content-category")
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
router.register(r"social-media", SocialMediaViewSet, basename="social-media")
router.register(r"navbar-logos", NavbarLogoViewSet, basename="navbar-logo")
router.register(r"site-info", SiteInfoViewSet, basename="site-info")
router.register(r"content-attachments", ContentAttachmentViewSet, basename="content-attachment")
router.register(r"authors", AuthorsViewSet, basename="authors")
router.register(r"book",BookViewSet , basename="book")
router.register(r"book-category", BookCategoryViewSet, basename="book-category")


urlpatterns = router.urls
