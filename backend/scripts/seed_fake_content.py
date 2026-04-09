import argparse
import os
import random
import re
import string
import urllib.request
from datetime import timedelta


def _random_words(n: int) -> str:
    alphabet = string.ascii_lowercase
    return " ".join(
        "".join(random.choice(alphabet) for _ in range(random.randint(4, 10)))
        for _ in range(n)
    )


def _random_sentence(min_words: int = 6, max_words: int = 14) -> str:
    return _random_words(random.randint(min_words, max_words)).capitalize() + "."


def _random_paragraph(min_sentences: int = 2, max_sentences: int = 5) -> str:
    return " ".join(
        _random_sentence() for _ in range(random.randint(min_sentences, max_sentences))
    )


YOUTUBE_VIDEO_URL = "https://www.youtube.com/watch?v=OOqrTEhS-ZE"
IMAGE_URL = "https://media.tzuchi.us/wp-content/uploads/2023/02/17112929/TzuChiUSA-turkey-earthquake-relief-updates-0217_0002_20230217_Turkey_Istanbal_1st-Distribtuion_301-1.jpg"

_IMAGE_BYTES_CACHE: bytes | None = None


def _png_1x1_bytes() -> bytes:
    # Valid 1x1 transparent PNG
    return (
        b"\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00\x01\x00\x00\x00\x01"
        b"\x08\x06\x00\x00\x00\x1f\x15\xc4\x89\x00\x00\x00\x0cIDAT\x08\xd7c\xf8\xff\xff?\x00\x05\xfe\x02\xfe\xa7\x9f\x81\x81\x00\x00\x00\x00IEND\xaeB`\x82"
    )


def _fetch_image_bytes() -> bytes:
    global _IMAGE_BYTES_CACHE
    if _IMAGE_BYTES_CACHE is not None:
        return _IMAGE_BYTES_CACHE

    req = urllib.request.Request(
        IMAGE_URL,
        headers={
            "User-Agent": "readinggroup-seed-script/1.0",
        },
    )
    try:
        with urllib.request.urlopen(req, timeout=20) as resp:
            data = resp.read()
        # Basic sanity check: non-empty and looks like jpeg or png
        if not data or (
            not (data.startswith(b"\xff\xd8\xff") or data.startswith(b"\x89PNG"))
        ):
            raise ValueError("Unexpected image data")
        _IMAGE_BYTES_CACHE = data
        return data
    except Exception:
        _IMAGE_BYTES_CACHE = _png_1x1_bytes()
        return _IMAGE_BYTES_CACHE


def _safe_image_filename(prefix: str, ext: str = ".jpg") -> str:
    cleaned = re.sub(r"[^a-zA-Z0-9._-]+", "-", prefix).strip("-")
    if not cleaned:
        cleaned = "image"
    return f"{cleaned}{ext}"


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Seed fake content data into the database"
    )
    parser.add_argument("--users", type=int, default=3)
    parser.add_argument("--video-categories", type=int, default=4)
    parser.add_argument("--videos", type=int, default=30)
    parser.add_argument("--learn-categories", type=int, default=6)
    parser.add_argument("--learns", type=int, default=24)
    parser.add_argument("--events", type=int, default=8)
    parser.add_argument("--reports-categories", type=int, default=4)
    parser.add_argument("--reports", type=int, default=18)
    parser.add_argument("--photo-collections", type=int, default=4)
    parser.add_argument("--photos-per-collection", type=int, default=8)
    parser.add_argument("--news", type=int, default=10)
    parser.add_argument("--news-images", type=int, default=3)
    parser.add_argument("--mylist-entries", type=int, default=40)
    args = parser.parse_args()

    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "readinggroup_backend.settings")

    import django

    django.setup()

    from django.contrib.auth import get_user_model
    from django.core.files.base import ContentFile
    from django.db import transaction
    from django.utils import timezone

    from content.enums import LearnCategoryDirection, LearnType, VideoType
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
        SocialMedia,
        Video,
        VideoCategory,
    )

    User = get_user_model()

    now = timezone.now()

    def make_user(i: int):
        email = f"user{i}@example.com"
        username = f"user{i}"
        user, created = User.objects.get_or_create(
            email=email,
            defaults={
                "username": username,
                "display_name": f"User {i}",
                "is_staff": False,
                "is_superuser": False,
            },
        )
        if created:
            user.set_password("password")
            user.save(update_fields=["password"])
        return user

    with transaction.atomic():
        users = [make_user(i + 1) for i in range(args.users)]

        # Video categories
        video_categories = []
        for i in range(args.video_categories):
            vc = VideoCategory.objects.create(
                name=f"Video Category {i + 1}",
                description=_random_paragraph(),
                is_active=True,
                order=i,
            )
            video_categories.append(vc)

        # Learn categories (mix of cards/posters)
        learn_categories = []
        for i in range(args.learn_categories):
            learn_type = LearnType.POSTERS if i % 3 == 0 else LearnType.CARDS
            direction = (
                LearnCategoryDirection.HORIZONTAL
                if i % 2 == 0
                else LearnCategoryDirection.VERTICAL
            )
            lc = LearnCategory.objects.create(
                name=f"Learn Category {i + 1}",
                description=_random_paragraph(),
                direction=direction,
                is_active=True,
                learn_type=learn_type,
                order=i,
            )
            learn_categories.append(lc)

        poster_categories = [
            c for c in learn_categories if c.learn_type == LearnType.POSTERS
        ]
        if not poster_categories:
            poster_categories.append(
                LearnCategory.objects.create(
                    name="Poster Category 1",
                    description=_random_paragraph(),
                    direction=LearnCategoryDirection.HORIZONTAL,
                    is_active=True,
                    learn_type=LearnType.POSTERS,
                    order=999,
                )
            )

        # Learns
        learns = []
        for i in range(args.learns):
            category = random.choice(learn_categories)
            happened_at = now - timedelta(days=random.randint(0, 180))
            learn = Learn.objects.create(
                title=f"Learn {i + 1}: {_random_words(3).title()}",
                subtitle=_random_sentence(4, 9),
                category=category,
                image=None,
                image_url=IMAGE_URL,
                happened_at=happened_at,
                views=random.randint(0, 5000),
                is_event=False,
            )
            learns.append(learn)

        for i in range(args.events):
            start_date = (now - timedelta(days=random.randint(0, 90))).date()
            start_time = (
                (now - timedelta(minutes=random.randint(0, 1200)))
                .time()
                .replace(microsecond=0)
            )
            EventCommunity.objects.create(
                title=f"Community Event {i + 1}",
                guest_speakers=[{"name": _random_words(2).title()}],
                live_stream_link="https://example.com/live",
                start_event_date=start_date,
                start_event_time=start_time,
                duration=str(random.choice(["30m", "45m", "60m", "90m"])),
            )

        # Related reports categories + reports
        report_categories = []
        for i in range(args.reports_categories):
            rc = RelatedReportsCategory.objects.create(
                title=f"Reports Category {i + 1}",
                description=_random_paragraph(),
                is_active=True,
            )
            report_categories.append(rc)

        for i in range(args.reports):
            RelatedReports.objects.create(
                title=f"Report {i + 1}: {_random_words(3).title()}",
                description=_random_paragraph(),
                category=random.choice(report_categories),
                thumbnail_url={
                    "default": {"url": IMAGE_URL},
                    "medium": {"url": IMAGE_URL},
                    "maxres": {"url": IMAGE_URL},
                },
                external_link="https://example.com/report",
                happened_at=now - timedelta(days=random.randint(0, 365)),
                duration=str(random.choice(["5m", "10m", "20m"])),
            )

        # Videos
        videos = []
        for i in range(args.videos):
            happened_at = now - timedelta(days=random.randint(0, 365))
            video = Video.objects.create(
                title=f"Video {i + 1}: {_random_words(4).title()}",
                duration=str(random.choice(["5:00", "12:34", "27:10", "1:02:15"])),
                category=random.choice(video_categories),
                description=_random_paragraph(),
                video_type=random.choice([VideoType.CLIP_VIDEO, VideoType.FULL_VIDEO]),
                language=random.choice(["en", "ar", "tr"]),
                views=random.randint(0, 200000),
                thumbnail=None,
                thumbnail_url={
                    "default": {"url": IMAGE_URL},
                    "medium": {"url": IMAGE_URL},
                    "maxres": {"url": IMAGE_URL},
                },
                happened_at=happened_at,
                is_new=False,
                reference_code="".join(
                    random.choice(string.ascii_uppercase + string.digits)
                    for _ in range(8)
                ),
                video_url=YOUTUBE_VIDEO_URL,
                guest_speakers=[{"name": _random_words(2).title()}],
            )
            videos.append(video)

            # Attachments (optional, but FileField is required on ContentAttachment)
            if random.random() < 0.35:
                payload = (
                    f"Attachment for video {video.pk}\n{_random_paragraph()}\n".encode(
                        "utf-8"
                    )
                )
                attachment = ContentAttachment.objects.create(
                    Video=video,
                    file_name=f"video-{video.pk}.txt",
                    file_size=len(payload),
                    description=_random_sentence(),
                )
                attachment.file.save(
                    f"video-{video.pk}.txt", ContentFile(payload), save=True
                )

        # Authors
        for i in range(6):
            Authors.objects.create(
                name=f"Author {i + 1}",
                description=_random_paragraph(),
                position=random.choice(
                    ["Editor", "Contributor", "Speaker", "Volunteer"]
                ),
                avatar=None,
                avatar_url=IMAGE_URL,
            )

        # Social media
        for platform in ["facebook", "instagram", "youtube", "x"]:
            SocialMedia.objects.get_or_create(
                platform=platform,
                defaults={"url": f"https://example.com/{platform}"},
            )

        # Photo collections + photos (Photo.image is required)
        for i in range(args.photo_collections):
            pc = PhotoCollection.objects.create(
                title=f"Collection {i + 1}: {_random_words(3).title()}",
                description=_random_paragraph(),
                image=None,
                happened_at=now - timedelta(days=random.randint(0, 365)),
            )
            for j in range(args.photos_per_collection):
                photo = Photo.objects.create(
                    collection=pc,
                    caption=_random_sentence(),
                    order=j,
                )
                photo.image.save(
                    _safe_image_filename(f"collection-{pc.pk}-photo-{j + 1}"),
                    ContentFile(_fetch_image_bytes()),
                    save=True,
                )

        # Latest news + images (LatestNewsImage.image is required)
        for i in range(args.news):
            ln = LatestNews.objects.create(
                title=f"News {i + 1}: {_random_words(4).title()}",
                description=_random_paragraph(),
                happened_at=now - timedelta(days=random.randint(0, 90)),
                is_test=(i % 5 == 0),
            )
            for j in range(args.news_images):
                img = LatestNewsImage.objects.create(
                    latest_news=ln,
                    caption=_random_sentence(),
                    order=j,
                )
                img.image.save(
                    _safe_image_filename(f"news-{ln.pk}-img-{j + 1}"),
                    ContentFile(_fetch_image_bytes()),
                    save=True,
                )

        # My list entries (unique per user+video)
        if users and videos:
            pairs = set()
            for _ in range(args.mylist_entries):
                user = random.choice(users)
                video = random.choice(videos)
                key = (user.pk, video.pk)
                if key in pairs:
                    continue
                pairs.add(key)
                MyListEntry.objects.get_or_create(user=user, video=video)

    print("Seed complete")
    print(f"Users: {User.objects.count()}")
    print(f"Videos: {Video.objects.count()}")
    print(f"Learns: {Learn.objects.count()}")
    print(f"Events: {EventCommunity.objects.count()}")
    print(f"News: {LatestNews.objects.count()}")
    print(f"Photos: {Photo.objects.count()}")

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
