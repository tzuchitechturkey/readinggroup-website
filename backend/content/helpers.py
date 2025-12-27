from rest_framework import serializers
from django.db.models import Q
from accounts.models import User as AccountUser


# for serializers.py use
def get_account_user(obj):
    """
    Given an object that may have a user-related attribute, attempt to
    retrieve the associated AccountUser instance.
    """
    possible_user_attrs = (
        "user",
        "to_user",
        "from_user",
        "uploader",
        "author",
        "writer",
    )

    for attr_name in possible_user_attrs:
        if hasattr(obj, attr_name):
            attr_value = getattr(obj, attr_name)

            # If the value is an AccountUser instance, return it directly
            if isinstance(attr_value, AccountUser):
                return attr_value

            # If the value is a string (username or display name), attempt to look up the user
            if isinstance(attr_value, str) and attr_value.strip():
                try:
                    user = AccountUser.objects.filter(
                        Q(username__iexact=attr_value)
                        | Q(display_name__iexact=attr_value)
                    ).first()
                    if user:
                        return user
                except Exception:
                    # If a database error occurs, ignore it
                    pass

    # If no user is found,
    return None


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
