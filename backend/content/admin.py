from django.contrib import admin
from .models import (
    Event,
    HistoryEntry,
    Post,
    TeamMember,
    TvProgram,
    Video,
    WeeklyMoment,
    PostCategory,
    VideoCategory,
    EventCategory,
    TvProgramCategory,
    PositionTeamMember,
    EventSection,
    TvProgramLike,
    WeeklyMomentLike,
    PostLike,
    VideoLike,
    EventLike,
    PostComment,
    VideoComment,
    TvProgramComment,
    EventComment,
    WeeklyMomentComment,
)


@admin.register(Video)
class VideoAdmin(admin.ModelAdmin):
    list_display = ("title", "category", "language", "views", "featured")
    list_filter = ("category", "language", "featured", "is_new")
    search_fields = ("title", "category")


@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    list_display = ("title", "writer", "category", "status", "is_active", "published_at")
    list_filter = ("status", "category", "is_active")
    search_fields = ("title", "writer", "category")

@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    list_display = ("title", "section", "category", "language", "happened_at")
    list_filter = ("section", "category", "language")
    search_fields = ("title", "writer", "category")

@admin.register(TvProgram)
class TvProgramAdmin(admin.ModelAdmin):
    list_display = ("title", "category", "writer", "air_date", "is_live")
    list_filter = ("category", "is_live")
    search_fields = ("title", "description", "writer")


@admin.register(WeeklyMoment)
class WeeklyMomentAdmin(admin.ModelAdmin):
    list_display = ("title", "status_label", "source", "language", "created_at")
    list_filter = ("language",)
    search_fields = ("title", "source")


@admin.register(TeamMember)
class TeamMemberAdmin(admin.ModelAdmin):
    list_display = ("name", "position", "job_title", "created_at")
    search_fields = ("name", "position", "job_title")


@admin.register(HistoryEntry)
class HistoryEntryAdmin(admin.ModelAdmin):
    list_display = ("title", "story_date")
    list_filter = ("story_date",)
    search_fields = ("title", "description")
    
    
@admin.register(VideoCategory)
class VideoCategoryAdmin(admin.ModelAdmin):
    list_display = ("name",)
    search_fields = ("name",)

@admin.register(PostCategory)
class PostCategoryAdmin(admin.ModelAdmin):
    list_display = ("name",)
    search_fields = ("name",)
    
@admin.register(EventCategory)
class EventCategoryAdmin(admin.ModelAdmin):
    list_display = ("name",)
    search_fields = ("name",)
    
@admin.register(TvProgramCategory)
class TvProgramCategoryAdmin(admin.ModelAdmin): 
    list_display = ("name",)
    search_fields = ("name",)
    
@admin.register(PositionTeamMember)
class PositionTeamMemberAdmin(admin.ModelAdmin):
    list_display = ("name",)
    search_fields = ("name",)
    
@admin.register(EventSection)
class EventSectionAdmin(admin.ModelAdmin):
    list_display = ("name",)
    search_fields = ("name",)
    
@admin.register(VideoComment)
class VideoCommentAdmin(admin.ModelAdmin):
    list_display = ("user", "video", "created_at")
    search_fields = ("user__username", "video__title", "text")  
    
@admin.register(EventComment)
class EventCommentAdmin(admin.ModelAdmin):
    list_display = ("user", "event", "created_at")
    search_fields = ("user__username", "event__title", "text")
    
@admin.register(TvProgramComment)
class TvProgramCommentAdmin(admin.ModelAdmin):
    list_display = ("user", "tv_program", "created_at")
    search_fields = ("user__username", "tv_program__title", "text")
    
@admin.register(WeeklyMomentComment)
class WeeklyMomentCommentAdmin(admin.ModelAdmin):
    list_display = ("user", "weekly_moment", "created_at")
    search_fields = ("user__username", "weekly_moment__title", "text")
    
@admin.register(PostLike)
class PostLikeAdmin(admin.ModelAdmin):
    list_display = ("post", "user", "created_at")
    search_fields = ("post__title", "user__username")
    
@admin.register(VideoLike)
class VideoLikeAdmin(admin.ModelAdmin):
    list_display = ("video", "user", "created_at")
    search_fields = ("video__title", "user__username")
    
@admin.register(EventLike)
class EventLikeAdmin(admin.ModelAdmin):
    list_display = ("event", "user", "created_at")
    search_fields = ("event__title", "user__username")
    
@admin.register(TvProgramLike)
class TvProgramLikeAdmin(admin.ModelAdmin):
    list_display = ("tv_program", "user", "created_at")
    search_fields = ("tv_program__title", "user__username")
    
@admin.register(WeeklyMomentLike)
class WeeklyMomentLikeAdmin(admin.ModelAdmin):
    list_display = ("weekly_moment", "user", "created_at")
    search_fields = ("weekly_moment__title", "user__username")
    
@admin.register(PostComment)
class PostCommentAdmin(admin.ModelAdmin):
    list_display = ("user", "post", "created_at")
    search_fields = ("user__username", "post__title", "text")
