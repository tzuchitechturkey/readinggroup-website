from django.contrib import admin
from .models import (
    Event,
    HistoryEntry,
    MediaCard,
    Post,
    TeamMember,
    TvProgram,
    Video,
    WeeklyMoment,
    PostCategory,
    VideoCategory,
    EventCategory,
    TvProgramCategory,
)


@admin.register(Video)
class VideoAdmin(admin.ModelAdmin):
    list_display = ("title", "category", "language", "published_at", "views", "featured")
    list_filter = ("category", "language", "featured", "is_new")
    search_fields = ("title", "category")


@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    list_display = ("title", "writer", "category", "status", "is_active", "published_at")
    list_filter = ("status", "category", "is_active")
    search_fields = ("title", "writer", "category")

@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    list_display = ("title", "section", "category", "language", "date")
    list_filter = ("section", "category", "language")
    search_fields = ("title", "writer", "category")


@admin.register(MediaCard)
class MediaCardAdmin(admin.ModelAdmin):
    list_display = ("title", "kind", "language", "theme", "created_at")
    list_filter = ("kind", "language", "theme")
    search_fields = ("title", "description")


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
