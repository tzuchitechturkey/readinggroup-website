from __future__ import annotations

from datetime import datetime
from typing import Optional, Union, Iterable

from django.utils import timezone


def truncate_to_minute(value: Union[datetime, str, None]) -> Optional[str]:
    """
    Truncate a datetime to minute precision and return a string in the form
    YYYY-MM-DD HH:MM. Accepts a datetime or an ISO-format string. Returns
    None if value is falsy.
    """
    if not value:
        return None

    if isinstance(value, str):
        try:
            value = datetime.fromisoformat(value.replace("Z", "+00:00"))
        except Exception:
            try:
                return value[:16].replace("T", " ")
            except Exception:
                return value

    if timezone.is_naive(value):
        value = timezone.make_aware(value)

    local_dt = value.astimezone(timezone.get_current_timezone())
    local_dt = local_dt.replace(second=0, microsecond=0)
    return local_dt.strftime("%Y-%m-%d %H:%M")


class DateTimeFormattingMixin:
    """
    Serializer mixin to format datetime fields in the representation.

    Usage:
      class MySerializer(DateTimeFormattingMixin, serializers.ModelSerializer):
              datetime_fields = ("created_at", "updated_at")

    The mixin will replace those fields in the serialized output with
    strings formatted as YYYY-MM-DD HH:MM.
    """

    datetime_fields: Iterable[str] = ("created_at", "updated_at")
    date_format: str = "%Y-%m-%d %H:%M"

    def _format_value(self, value: Union[datetime, str, None]) -> Optional[str]:
        return truncate_to_minute(value)

    def to_representation(self, instance):
        data = super().to_representation(instance)
        for field in getattr(self, "datetime_fields", ()):
            if field in data and data[field]:
                try:
                    data[field] = self._format_value(data[field])
                except Exception:
                    pass
        return data
