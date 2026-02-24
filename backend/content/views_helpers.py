from django.contrib.contenttypes.models import ContentType
from django.db.models import Count, Exists, OuterRef


from .enums import ContentStatus, EventStatus, VideoStatus


def _filter_published(queryset):
    """If the queryset's model exposes a `status` field, attempt to filter it
    to the published value for known enums (Post/Content/Event/Video).
    This helper swallows exceptions to remain safe for models without status.
    """
    try:
        return queryset.filter(status=ContentStatus.PUBLISHED)
    except Exception:
        pass

    try:
        return queryset.filter(status=EventStatus.PUBLISHED)
    except Exception:
        pass

    try:
        return queryset.filter(status=VideoStatus.PUBLISHED)
    except Exception:
        pass

    return queryset
