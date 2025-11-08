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
        