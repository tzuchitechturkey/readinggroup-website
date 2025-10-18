from __future__ import annotations

from datetime import datetime
from typing import Optional, Union, Iterable

from django.utils import timezone


def format_datetime(
    value: Union[datetime, str, None],
    fmt: str = "%Y-%m-%d %H:%M",
) -> Optional[str]:
    """
    create a formatted datetime string in the current timezone.
    If value is None or empty, returns None.
    If value is a string, attempts to parse it as an ISO format datetime.
    If parsing fails, returns the original string.
    If value is naive, makes it aware in the current timezone.
    Returns the formatted datetime string according to fmt.
    """
    if not value:
        return None

    if isinstance(value, str):
        try:
            value = datetime.fromisoformat(value.replace("Z", "+00:00"))
        except Exception:
            return value 

    if timezone.is_naive(value):
        value = timezone.make_aware(value)

    local_dt = value.astimezone(timezone.get_current_timezone())
    return local_dt.strftime(fmt)


class DateTimeFormattingMixin:
    """
    Mixin to format specified datetime fields in serializer output. 
    Attributes:
    datetime_fields: Iterable[str]
        List of field names to format as datetime strings.
    date_format: str
        Format string for datetime formatting.
    """
    datetime_fields: Iterable[str] = ("created_at", "updated_at", "final_decision_at")
    date_format: str = "%Y-%m-%d %H:%M"

    def _format_datetime_field(
        self, value: Union[datetime, str, None]
    ) -> Optional[str]:
        return format_datetime(value, self.date_format)

    def to_representation(self, instance):
        """
        Override to format datetime fields in the representation.
        """
        data = super().to_representation(instance)
        for field in self.datetime_fields:
            if field in data and data[field]:
                data[field] = self._format_datetime_field(data[field])
        return data
