from django.contrib import admin
from .models import (
    EventCommunity,
    HistoryEntry,
    Content,
    TeamMember,
    Video,
    VideoCategory,
    ContentCategory,
    PositionTeamMember,
    Learn,
    LearnCategory,
    MyListEntry,
    SocialMedia,
    NavbarLogo,
    Authors,
    ContentAttachment,
    Book,
    BookCategory,
)


# ----------------------------------------------------------------new models admin start----------------------------------------------------------------


@admin.register(Video)
class VideoAdmin(admin.ModelAdmin):
    list_display = ("id", "title", "category_name", "views")
    list_filter = ("category__name", "is_new")
    search_fields = ("title", "category__name")

    def category_name(self, obj):
        return obj.category.name if obj.category else None

    category_name.short_description = "category"


@admin.register(VideoCategory)
class VideoCategoryAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "description", "created_at")
    search_fields = ("name",)
    list_filter = ("is_active",)


@admin.register(Learn)
class LearnAdmin(admin.ModelAdmin):
    list_display = ("id", "title", "category_name", "created_at")
    list_filter = ("category",)
    search_fields = ("title", "category__name")

    def category_name(self, obj):
        return obj.category.name if obj.category else None

    category_name.short_description = "Category"


@admin.register(LearnCategory)
class LearnCategoryAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "description", "created_at")
    search_fields = [
        "name",
    ]
    list_filter = ["is_active"]


@admin.register(EventCommunity)
class EventCommunityAdmin(admin.ModelAdmin):

    def formfield_for_foreignkey(self, db_field, request, **kwargs):
        if db_field.name == "learn":
            kwargs["queryset"] = Learn.objects.filter(category__learn_type="poster")
        return super().formfield_for_foreignkey(db_field, request, **kwargs)


@admin.register(Content)
class ContentAdmin(admin.ModelAdmin):
    list_display = ("id", "title", "category_name", "language", "writer", "created_at")
    list_filter = ("category__name", "language", "writer")
    search_fields = ("title", "category__name", "writer")

    def category_name(self, obj):
        return obj.category.name if obj.category else None

    category_name.short_description = "category"


@admin.register(ContentAttachment)
class ContentAttachmentAdmin(admin.ModelAdmin):
    list_display = ("id", "content", "file_name", "created_at")
    search_fields = ("file_name", "content__title")


# ----------------------------------------------------------------new models admin end----------------------------------------------------------------


@admin.register(TeamMember)
class TeamMemberAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "position", "job_title", "created_at")
    search_fields = ("name", "position", "job_title")


@admin.register(HistoryEntry)
class HistoryEntryAdmin(admin.ModelAdmin):
    list_display = ("id", "title", "story_date")
    list_filter = ("story_date",)
    search_fields = ("title", "description")


@admin.register(PositionTeamMember)
class PositionTeamMemberAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "description", "created_at")
    search_fields = ("name",)


@admin.register(MyListEntry)
class MyListEntryAdmin(admin.ModelAdmin):
    # ensure fields listed exist on MyListEntry model
    list_display = ("id", "user", "video", "created_at")
    search_fields = ("user__username", "video__title")


@admin.register(SocialMedia)
class SocialMediaAdmin(admin.ModelAdmin):
    list_display = ("platform", "url")
    search_fields = ("platform", "url")


@admin.register(NavbarLogo)
class NavbarLogoAdmin(admin.ModelAdmin):
    list_display = ("logo",)
    search_fields = ("logo",)


@admin.register(ContentCategory)
class ContentCategoryAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "key", "language", "description", "created_at")
    search_fields = ("name", "key")
    list_filter = ("language", "is_active")
    exclude = ("key", "translation_group")


@admin.register(Authors)
class AuthorsAdmin(admin.ModelAdmin):
    list_display = ("name", "description")
    search_fields = ("name", "description")


@admin.register(BookCategory)
class BookCategoryAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "key", "language", "description", "created_at")
    search_fields = ("name", "key")
    list_filter = ("language", "is_active")
    exclude = ("key", "translation_group")


@admin.register(Book)
class BookAdmin(admin.ModelAdmin):
    list_display = ("id", "name")
    search_fields = ("name",)
