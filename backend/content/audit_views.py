"""
Audit history views.

Endpoints:
  GET /api/v1/audit/users/{user_id}/     — all changes made by a specific user
  GET /api/v1/audit/sections/{section}/  — all changes inside a model/section
"""

import json

from django.core.serializers.json import DjangoJSONEncoder
from rest_framework import generics, status
from rest_framework.response import Response

from .models import (
    Book,
    BookReview,
    ContentAttachment,
    EventCommunity,
    EventCommunityImage,
    HistoryEvent,
    HistoryEventImage,
    LatestNews,
    LatestNewsImage,
    Learn,
    LearnCategory,
    NavbarLogo,
    OurTeam,
    OurTeamImage,
    Photo,
    PhotoCollection,
    RelatedReports,
    RelatedReportsCategory,
    SocialMedia,
    Video,
    VideoCategory,
)

# Maps URL slugs (same as router) → model class
SECTION_MAP = {
    "videos": Video,
    "video-categories": VideoCategory,
    "learn": Learn,
    "learn-categories": LearnCategory,
    "event-communities": EventCommunity,
    "event-community-images": EventCommunityImage,
    "related-reports": RelatedReports,
    "related-reports-categories": RelatedReportsCategory,
    "photo-collection": PhotoCollection,
    "photos": Photo,
    "latest-news": LatestNews,
    "latest-news-images": LatestNewsImage,
    "our-team": OurTeam,
    "our-team-images": OurTeamImage,
    "book": Book,
    "book-reviews": BookReview,
    "history-events": HistoryEvent,
    "history-event-images": HistoryEventImage,
    "navbar-logos": NavbarLogo,
    "social-media": SocialMedia,
    "content-attachments": ContentAttachment,
}

ALL_MODELS = list(SECTION_MAP.values())

# ─── helpers ──────────────────────────────────────────────────────────────────

_EXCLUDE = frozenset(
    [
        "history_id",
        "history_date",
        "history_type",
        "history_user",
        "history_change_reason",
        "history_object_repr",
    ]
)

_TYPE_MAP = {"+": "create", "~": "update", "-": "delete"}


def _safe(value):
    if value is None:
        return None
    try:
        json.dumps(value, cls=DjangoJSONEncoder)
        return value
    except (TypeError, ValueError):
        return str(value)


def _all_fields(record):
    return {
        f.name: _safe(getattr(record, f.name))
        for f in record._meta.fields
        if f.name not in _EXCLUDE and not f.name.startswith("history_")
    }


def _user_display(user):
    if not user:
        return None
    return user.display_name or user.username or None


def format_record(record, prev=None, model_name=None):
    """Convert a historical record to a dict."""
    entry = {
        "history_id": record.history_id,
        "history_date": record.history_date,
        "action": _TYPE_MAP.get(record.history_type, record.history_type),
        "performed_by": _user_display(record.history_user),
        "object_id": record.id,
    }
    if model_name:
        entry["model"] = model_name

    if record.history_type == "+":
        entry["data"] = _all_fields(record)
    elif record.history_type == "~":
        if prev:
            delta = record.diff_against(prev)
            entry["changes"] = {
                c.field: {"old": _safe(c.old), "new": _safe(c.new)}
                for c in delta.changes
            }
        else:
            entry["data"] = _all_fields(record)

    return entry


def get_model_history(model, filters=None):
    """Return formatted history list for a model, newest first."""
    qs = model.history.all()
    if filters:
        qs = qs.filter(**filters)

    records = list(qs.select_related("history_user"))
    result = []
    model_name = model.__name__

    for i, record in enumerate(records):
        prev = records[i + 1] if i + 1 < len(records) else None
        # Only pass prev if it's the same object
        same_obj_prev = prev if prev and prev.id == record.id else None
        result.append(format_record(record, same_obj_prev, model_name=model_name))

    return result


# ─── views ────────────────────────────────────────────────────────────────────


class UserAuditHistoryView(generics.GenericAPIView):
    """
    GET /api/v1/audit/users/{user_id}/

    Returns all create/update actions performed by a specific user,
    sorted newest → oldest, grouped across all models.
    """

    def get(self, request, user_id):
        all_records = []

        for model in ALL_MODELS:
            records = list(
                model.history.filter(history_user_id=user_id).select_related(
                    "history_user"
                )
            )
            model_name = model.__name__
            # Build a lookup: object_id → list of records (newest first per object)
            obj_records: dict[int, list] = {}
            for r in records:
                obj_records.setdefault(r.id, []).append(r)

            for obj_id, obj_hist in obj_records.items():
                # obj_hist is already newest→oldest for this object
                # To compute diff we need full object history (not filtered)
                full_hist = list(
                    model.history.filter(id=obj_id).select_related("history_user")
                )
                full_by_hid = {r.history_id: r for r in full_hist}

                for rec in obj_hist:
                    # Find the previous record in the full object history
                    full_obj_list = [r for r in full_hist if r.id == rec.id]
                    idx = next(
                        (
                            i
                            for i, r in enumerate(full_obj_list)
                            if r.history_id == rec.history_id
                        ),
                        None,
                    )
                    prev = (
                        full_obj_list[idx + 1]
                        if idx is not None and idx + 1 < len(full_obj_list)
                        else None
                    )
                    all_records.append(format_record(rec, prev, model_name=model_name))

        all_records.sort(key=lambda x: x["history_date"], reverse=True)
        return Response(all_records)


class SectionAuditHistoryView(generics.GenericAPIView):
    """
    GET /api/v1/audit/sections/{section}/

    Returns all create/update history for a specific model/section,
    sorted newest → oldest.

    {section} must match one of the router slugs, e.g.:
      videos, learn, latest-news, our-team, book, photos, ...
    """

    def get(self, request, section):
        model = SECTION_MAP.get(section)
        if not model:
            return Response(
                {
                    "error": f"Unknown section '{section}'. Available: {sorted(SECTION_MAP.keys())}"
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        return Response(get_model_history(model))
