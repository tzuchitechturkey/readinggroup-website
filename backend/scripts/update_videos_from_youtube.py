import argparse
import os
from dataclasses import dataclass


def main() -> int:
    parser = argparse.ArgumentParser(
        description=(
            "Update Video rows from YouTube metadata while preserving category, "
            "guest_speakers, and video_type."
        )
    )
    parser.add_argument(
        "--yes",
        action="store_true",
        help="Apply updates. Without this flag the script will only print planned changes.",
    )
    parser.add_argument(
        "--limit",
        type=int,
        default=0,
        help="Maximum number of videos to process (0 = no limit).",
    )
    parser.add_argument(
        "--ids",
        type=str,
        default="",
        help="Comma-separated list of Video ids to update (optional).",
    )
    args = parser.parse_args()

    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "readinggroup_backend.settings")

    import django

    django.setup()

    from django.conf import settings
    from django.db import transaction

    from content.models import Video
    from content.youtube import YouTubeAPIError, fetch_video_info

    api_key = getattr(settings, "YOUTUBE_API_KEY", None)
    if not api_key:
        raise SystemExit("Missing YOUTUBE_API_KEY in Django settings")

    @dataclass
    class Plan:
        id: int
        video_url: str
        changes: dict

    qs = Video.objects.all().order_by("id")

    if args.ids.strip():
        try:
            ids = [int(x.strip()) for x in args.ids.split(",") if x.strip()]
        except ValueError:
            raise SystemExit("--ids must be a comma-separated list of integers")
        qs = qs.filter(id__in=ids)

    if args.limit and args.limit > 0:
        qs = qs[: args.limit]

    plans: list[Plan] = []

    for v in qs:
        if not v.video_url:
            continue
        try:
            info = fetch_video_info(v.video_url, api_key)
        except YouTubeAPIError as e:
            print(f"[skip] id={v.id} url={v.video_url} error={e}")
            continue

        changes: dict = {}

        # Preserve: category, guest_speakers, video_type
        # Update: title, description, duration, language, reference_code, thumbnail_url, happened_at
        if info.title and v.title != info.title:
            changes["title"] = info.title
        if info.description and v.description != info.description:
            changes["description"] = info.description
        if info.duration_formatted and v.duration != info.duration_formatted:
            changes["duration"] = info.duration_formatted
        if info.default_language and v.language != info.default_language:
            changes["language"] = info.default_language
        if info.video_id and v.reference_code != info.video_id:
            changes["reference_code"] = info.video_id
        if info.thumbnails and v.thumbnail_url != info.thumbnails:
            changes["thumbnail_url"] = info.thumbnails
        if info.published_at and v.happened_at != info.published_at:
            changes["happened_at"] = info.published_at

        if changes:
            plans.append(Plan(id=v.id, video_url=v.video_url, changes=changes))

    print(f"Videos scanned: {qs.count()}")
    print(f"Videos to update: {len(plans)}")

    for p in plans[:50]:
        print(f"- id={p.id} url={p.video_url} changes={list(p.changes.keys())}")
    if len(plans) > 50:
        print(f"... ({len(plans) - 50} more not shown)")

    if not args.yes:
        print("\nDry-run only. Re-run with --yes to apply updates.")
        return 0

    updated = 0
    with transaction.atomic():
        for p in plans:
            v = Video.objects.select_for_update().get(id=p.id)
            for field, value in p.changes.items():
                setattr(v, field, value)
            v.save(update_fields=list(p.changes.keys()) + ["updated_at"])
            updated += 1

    print(f"\nUpdated videos: {updated}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
