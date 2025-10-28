from django.contrib import admin
from .models import (
    Event,
    HistoryEntry,
    Post,
    TeamMember,
    Video,
    WeeklyMoment,
    PostCategory,
    VideoCategory,
    EventCategory,
    PositionTeamMember,
    EventSection,
    Comments,
    Reply,
    MyListEntry,
)


@admin.register(Video)
class VideoAdmin(admin.ModelAdmin):
    list_display = ("title", "category", "language", "views", "featured")
    list_filter = ("category", "language", "featured", "is_new")
    search_fields = ("title", "category")


@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    list_display = ("title", "writer", "category", "status", "is_active")
    list_filter = ("status", "category", "is_active")
    search_fields = ("title", "writer", "category")

@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    list_display = ("title", "section", "category", "language", "happened_at")
    list_filter = ("section", "category", "language")
    search_fields = ("title", "writer", "category")

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
    
@admin.register(PositionTeamMember)
class PositionTeamMemberAdmin(admin.ModelAdmin):
    list_display = ("name",)
    search_fields = ("name",)
    
@admin.register(EventSection)
class EventSectionAdmin(admin.ModelAdmin):
    list_display = ("name",)
    search_fields = ("name",)
    
@admin.register(Comments)
class CommentsAdmin(admin.ModelAdmin):
    list_display = ("user", "content_type", "object_id", "created_at")
    # 'Comments' model uses the field name 'text'
    search_fields = ("user__username", "text")

@admin.register(Reply)
class ReplyAdmin(admin.ModelAdmin):
    list_display = ("user", "comment", "created_at")
    # 'Reply' model uses the field name 'text'
    search_fields = ("user__username", "text")
  
@admin.register(MyListEntry)
class MyListEntryAdmin(admin.ModelAdmin):
    # ensure fields listed exist on MyListEntry model
    list_display = ("user", "video", "created_at")
    search_fields = ("user__username", "video__title")