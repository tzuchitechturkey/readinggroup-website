from rest_framework import serializers
from django.contrib.contenttypes.models import ContentType
from django.db.models import Count, Exists, OuterRef
from content.models import Like


#for serializers.py use
class AbsoluteURLSerializer(serializers.ModelSerializer):
    """Mixin that ensures file fields are returned as absolute URLs."""

    file_fields: tuple[str, ...] = ()

    def _build_absolute_uri(self, path: str | None) -> str | None:
        request = self.context.get("request")
        if request and path:
            return request.build_absolute_uri(path)
        return path

    def to_representation(self, instance):
        data = super().to_representation(instance)
        for field_name in getattr(self.Meta, "file_fields", self.file_fields):
            file_value = getattr(instance, field_name, None)
            if file_value:
                data[field_name] = self._build_absolute_uri(file_value.url)
        return data
        
#for views.py use
def annotate_likes_queryset(queryset, request=None):
    """Module-level helper to annotate a queryset with likes count and (when request.user authenticated) has_liked.

    This mirrors BaseContentViewSet.annotate_likes but is usable from function/class-based views.
    """
    try:
        queryset = queryset.annotate(annotated_likes_count=Count('likes'))
    except Exception:
        return queryset

    if request and getattr(request, 'user', None) and request.user.is_authenticated:
        try:
            ct = ContentType.objects.get_for_model(queryset.model)
            likes_subq = Like.objects.filter(content_type=ct, object_id=OuterRef('pk'), user=request.user)
            queryset = queryset.annotate(annotated_has_liked=Exists(likes_subq))
        except Exception:
            # ignore failures to annotate has_liked
            pass
    return queryset