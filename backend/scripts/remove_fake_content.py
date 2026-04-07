import argparse
import os
import re


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Remove fake content created by scripts/seed_fake_content.py"
    )
    parser.add_argument(
        "--yes",
        action="store_true",
        help="Actually delete rows. Without this flag the script only prints what it would delete.",
    )
    parser.add_argument(
        "--delete-users",
        action="store_true",
        help="Also delete the example users created by the seed script (userN@example.com).",
    )
    args = parser.parse_args()

    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "readinggroup_backend.settings")

    import django

    django.setup()

    from django.contrib.auth import get_user_model
    from django.db import transaction

    from content.models import (
        Authors,
        ContentAttachment,
        EventCommunity,
        LatestNews,
        LatestNewsImage,
        Learn,
        LearnCategory,
        MyListEntry,
        Photo,
        PhotoCollection,
        RelatedReports,
        RelatedReportsCategory,
        Video,
        VideoCategory,
    )

    User = get_user_model()

    # Seed script patterns
    patterns = {
        "video_categories": r"^Video Category \d+$",
        "learn_categories": r"^(Learn Category \d+|Poster Category 1)$",
        "learns": r"^(Learn \d+: |Poster Learn \d+: )",
        "events": r"^Community Event \d+$",
        "reports_categories": r"^Reports Category \d+$",
        "reports": r"^Report \d+: ",
        "videos": r"^Video \d+: ",
        "authors": r"^Author \d+$",
        "photo_collections": r"^Collection \d+: ",
        "news": r"^News \d+: ",
    }

    rx = {k: re.compile(v) for k, v in patterns.items()}

    qs_video_categories = VideoCategory.objects.filter(
        name__regex=patterns["video_categories"]
    )
    qs_learn_categories = LearnCategory.objects.filter(
        name__regex=patterns["learn_categories"]
    )
    qs_learns = Learn.objects.filter(title__regex=patterns["learns"])
    qs_events = EventCommunity.objects.filter(title__regex=patterns["events"])
    qs_reports_categories = RelatedReportsCategory.objects.filter(
        title__regex=patterns["reports_categories"]
    )
    qs_reports = RelatedReports.objects.filter(title__regex=patterns["reports"])
    qs_videos = Video.objects.filter(title__regex=patterns["videos"])
    qs_authors = Authors.objects.filter(name__regex=patterns["authors"])
    qs_photo_collections = PhotoCollection.objects.filter(
        title__regex=patterns["photo_collections"]
    )
    qs_news = LatestNews.objects.filter(title__regex=patterns["news"])

    # Dependents
    qs_mylist = MyListEntry.objects.filter(video__in=qs_videos)
    qs_attachments = ContentAttachment.objects.filter(Video__in=qs_videos)
    qs_photos = Photo.objects.filter(collection__in=qs_photo_collections)
    qs_news_images = LatestNewsImage.objects.filter(latest_news__in=qs_news)

    example_users_qs = User.objects.filter(email__regex=r"^user\d+@example\.com$")

    counts = {
        "MyListEntry": qs_mylist.count(),
        "EventCommunity": qs_events.count(),
        "LatestNewsImage": qs_news_images.count(),
        "LatestNews": qs_news.count(),
        "Photo": qs_photos.count(),
        "PhotoCollection": qs_photo_collections.count(),
        "ContentAttachment": qs_attachments.count(),
        "Video": qs_videos.count(),
        "Learn": qs_learns.count(),
        "LearnCategory": qs_learn_categories.count(),
        "VideoCategory": qs_video_categories.count(),
        "RelatedReports": qs_reports.count(),
        "RelatedReportsCategory": qs_reports_categories.count(),
        "Authors": qs_authors.count(),
    }

    if args.delete_users:
        counts["User(example)"] = example_users_qs.count()

    print("Planned deletions:")
    for model, c in counts.items():
        print(f"- {model}: {c}")

    if not args.yes:
        print("\nDry-run only. Re-run with --yes to delete.")
        return 0

    with transaction.atomic():
        # Delete in a safe order (children first)
        qs_mylist.delete()
        qs_events.delete()

        # News
        qs_news_images.delete()
        qs_news.delete()

        # Photos
        qs_photos.delete()
        qs_photo_collections.delete()

        # Videos and attachments
        qs_attachments.delete()
        qs_videos.delete()

        # Learns and categories
        qs_learns.delete()
        qs_learn_categories.delete()

        # Reports
        qs_reports.delete()
        qs_reports_categories.delete()

        # Authors
        qs_authors.delete()

        # Categories
        qs_video_categories.delete()

        if args.delete_users:
            example_users_qs.delete()

    print("\nDeletion complete")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
