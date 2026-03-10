from django.contrib import admin

from .enums import LearnType
from .models import (
    EventCommunity,
    Video,
    VideoCategory,
    Learn,
    LearnCategory,
    SocialMedia,
    NavbarLogo,
    Authors,
    ContentAttachment,
    PhotoCollection,
    Photo,
    RelatedReports,
    RelatedReportsCategory,
    LatestNews,
    LatestNewsImage,
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
            kwargs["queryset"] = Learn.objects.filter(
                category__learn_type=LearnType.POSTERS
            )
        return super().formfield_for_foreignkey(db_field, request, **kwargs)


@admin.register(ContentAttachment)
class ContentAttachmentAdmin(admin.ModelAdmin):
    list_display = ("id", "file_name", "created_at")
    search_fields = ("file_name",)


@admin.register(RelatedReportsCategory)
class RelatedReportsCategoryAdmin(admin.ModelAdmin):
    list_display = ("id", "title", "is_active", "created_at")
    search_fields = ("title", "description")
    list_filter = ("is_active", "created_at")


@admin.register(RelatedReports)
class RelatedReportsAdmin(admin.ModelAdmin):
    list_display = ("id", "title", "category", "happened_at", "created_at")
    search_fields = ("title", "description", "category__title")
    list_filter = ("category", "happened_at", "created_at")


class PhotoInline(admin.TabularInline):
    """Inline admin for photos in a collection."""

    model = Photo
    extra = 1
    max_num = 30
    fields = ("image", "caption", "order")


@admin.register(PhotoCollection)
class PhotoCollectionAdmin(admin.ModelAdmin):
    list_display = ("id", "title", "happened_at", "photo_count", "created_at")
    search_fields = ("title", "description")
    list_filter = ("happened_at", "created_at")
    inlines = [PhotoInline]

    def photo_count(self, obj):
        return obj.photos.count()

    photo_count.short_description = "Photos"


@admin.register(Photo)
class PhotoAdmin(admin.ModelAdmin):
    list_display = ("id", "collection", "caption", "order", "created_at")
    search_fields = ("caption", "collection__title")
    list_filter = ("collection", "created_at")


class LatestNewsImageInline(admin.TabularInline):
    """Inline admin for images in latest news."""

    model = LatestNewsImage
    extra = 1
    fields = ("image", "caption", "order")


@admin.register(LatestNews)
class LatestNewsAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "title",
        "happened_at",
        "image_count",
        "created_at",
    )
    search_fields = ("title", "description")
    list_filter = ("happened_at", "created_at")
    inlines = [LatestNewsImageInline]

    def image_count(self, obj):
        return obj.images.count()

    image_count.short_description = "Images"


@admin.register(LatestNewsImage)
class LatestNewsImageAdmin(admin.ModelAdmin):
    list_display = ("id", "latest_news", "caption", "order", "created_at")
    search_fields = ("caption", "latest_news__title")
    list_filter = ("latest_news", "created_at")


# ----------------------------------------------------------------new models admin end----------------------------------------------------------------

@admin.register(SocialMedia)
class SocialMediaAdmin(admin.ModelAdmin):
    list_display = ("platform", "url")
    search_fields = ("platform", "url")


@admin.register(NavbarLogo)
class NavbarLogoAdmin(admin.ModelAdmin):
    list_display = ("logo",)
    search_fields = ("logo",)


@admin.register(Authors)
class AuthorsAdmin(admin.ModelAdmin):
    list_display = ("name", "description")
    search_fields = ("name", "description")
