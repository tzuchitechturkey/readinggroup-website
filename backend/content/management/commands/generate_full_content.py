from __future__ import annotations

import base64
from datetime import timedelta
from typing import Dict, List

from django.core.files.base import ContentFile
from django.core.management.base import BaseCommand
from django.db import transaction
from django.utils import timezone

from content.enums import LearnCategoryDirection, LearnType, VideoType
from content.models import (
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

PLACEHOLDER_IMAGE = base64.b64decode(
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/Pv8O3QAAAABJRU5ErkJggg=="
)


def _save_placeholder(instance, field_name: str, filename: str) -> None:
    """Save a 1×1 placeholder PNG to an ImageField/FileField."""
    field = getattr(instance, field_name)
    field.save(filename, ContentFile(PLACEHOLDER_IMAGE), save=False)


class SampleContentBuilder:
    """Utility class that seeds the database with rich demo content."""

    def __init__(self, stdout, reset: bool = False) -> None:
        self.stdout = stdout
        self.reset = reset
        self.now = timezone.now()
        self.video_categories: Dict[str, VideoCategory] = {}
        self.learn_categories: Dict[str, LearnCategory] = {}
        self.related_reports_categories: Dict[str, RelatedReportsCategory] = {}
        self.summary: Dict[str, int] = {}

    # ------------------------------------------------------------------
    # Public API
    # ------------------------------------------------------------------
    def build(self) -> Dict[str, int]:
        if self.reset:
            self._reset_existing()

        self.video_categories = self._ensure_video_categories()
        self.learn_categories = self._ensure_learn_categories()
        self.related_reports_categories = self._ensure_related_reports_categories()

        videos = self._ensure_videos()
        self._record("videos", len(videos))

        learns = self._ensure_learns()
        self._record("learns", len(learns))

        related_reports = self._ensure_related_reports()
        self._record("related_reports", len(related_reports))

        photo_collections = self._ensure_photo_collections()
        self._record("photo_collections", len(photo_collections))

        latest_news = self._ensure_latest_news()
        self._record("latest_news", len(latest_news))

        event_communities = self._ensure_event_communities()
        self._record("event_communities", len(event_communities))

        our_teams = self._ensure_our_teams()
        self._record("our_teams", len(our_teams))

        books = self._ensure_books()
        self._record("books", len(books))

        history_events = self._ensure_history_events()
        self._record("history_events", len(history_events))

        self._ensure_social_media()
        self._ensure_navbar_logo()

        return self.summary

    # ------------------------------------------------------------------
    # Helpers
    # ------------------------------------------------------------------
    def _record(self, key: str, value: int) -> None:
        self.summary[key] = value

    def _reset_existing(self) -> None:
        self.stdout.write("Resetting existing content tables...")
        ContentAttachment.objects.all().delete()
        HistoryEventImage.objects.all().delete()
        HistoryEvent.objects.all().delete()
        BookReview.objects.all().delete()
        Book.objects.all().delete()
        OurTeamImage.objects.all().delete()
        OurTeam.objects.all().delete()
        EventCommunityImage.objects.all().delete()
        EventCommunity.objects.all().delete()
        LatestNewsImage.objects.all().delete()
        LatestNews.objects.all().delete()
        Photo.objects.all().delete()
        PhotoCollection.objects.all().delete()
        RelatedReports.objects.all().delete()
        RelatedReportsCategory.objects.all().delete()
        Learn.objects.all().delete()
        LearnCategory.objects.all().delete()
        Video.objects.all().delete()
        VideoCategory.objects.all().delete()
        SocialMedia.objects.all().delete()
        NavbarLogo.objects.all().delete()

    def _ensure_video_categories(self) -> Dict[str, VideoCategory]:
        specs = [
            {"name": "Community Stories", "description": "Updates from global volunteers.", "order": 1},
            {"name": "Education Highlights", "description": "Clips from reading classrooms.", "order": 2},
            {"name": "Health Missions", "description": "Medical outreach spotlights.", "order": 3},
            {"name": "Environmental Stewardship", "description": "Earth-friendly initiatives.", "order": 4},
        ]
        result: Dict[str, VideoCategory] = {}
        for spec in specs:
            name = spec["name"]
            obj, created = VideoCategory.objects.get_or_create(
                name=name,
                defaults={"description": spec["description"], "order": spec["order"]},
            )
            if not created:
                obj.description = spec["description"]
                obj.order = spec["order"]
                obj.save(update_fields=["description", "order"])
            result[name] = obj
        return result

    def _ensure_learn_categories(self) -> Dict[str, LearnCategory]:
        specs = [
            {
                "name": "Reading Circles",
                "description": "Cards for reflection circle facilitators.",
                "direction": LearnCategoryDirection.HORIZONTAL,
                "learn_type": LearnType.CARDS,
                "order": 1,
            },
            {
                "name": "Mission Posters",
                "description": "Visual posters for community events.",
                "direction": LearnCategoryDirection.VERTICAL,
                "learn_type": LearnType.POSTERS,
                "order": 2,
            },
            {
                "name": "Youth Cards",
                "description": "Learning cards designed for young volunteers.",
                "direction": LearnCategoryDirection.HORIZONTAL,
                "learn_type": LearnType.CARDS,
                "order": 3,
            },
        ]
        result: Dict[str, LearnCategory] = {}
        for spec in specs:
            obj, created = LearnCategory.objects.get_or_create(
                name=spec["name"],
                learn_type=spec["learn_type"],
                defaults={
                    "description": spec["description"],
                    "direction": spec["direction"],
                    "order": spec["order"],
                },
            )
            if not created:
                obj.description = spec["description"]
                obj.direction = spec["direction"]
                obj.order = spec["order"]
                obj.save(update_fields=["description", "direction", "order"])
            result[spec["name"]] = obj
        return result

    def _ensure_related_reports_categories(self) -> Dict[str, RelatedReportsCategory]:
        specs = [
            {"title": "Field Reports", "description": "On-the-ground volunteer dispatches."},
            {"title": "Research Notes", "description": "Study summaries and literature references."},
        ]
        result: Dict[str, RelatedReportsCategory] = {}
        for spec in specs:
            obj, created = RelatedReportsCategory.objects.get_or_create(
                title=spec["title"],
                defaults={"description": spec["description"]},
            )
            if not created:
                obj.description = spec["description"]
                obj.save(update_fields=["description"])
            result[spec["title"]] = obj
        return result

    def _ensure_videos(self) -> List[Video]:
        video_data = [
            {
                "title": "Compassion in Motion",
                "category": "Community Stories",
                "video_type": VideoType.FULL_VIDEO,
                "duration": "05:12",
                "language": "English",
                "video_url": "https://www.youtube.com/watch?v=readinggroup01",
                "thumbnail_url": ["https://images.unsplash.com/photo-1469474968028-56623f02e42e"],
                "views": 1540,
                "reference_code": "VID-001",
                "description": "Field teams from Hualien share the first week of community listening tours.",
                "guest_speakers": ["Dr. Mei Lin", "Brother Yong"],
                "days_ago": 6,
            },
            {
                "title": "Books That Bind Us",
                "category": "Education Highlights",
                "video_type": VideoType.CLIP_VIDEO,
                "duration": "04:05",
                "language": "Mandarin",
                "video_url": "https://www.youtube.com/watch?v=readinggroup02",
                "thumbnail_url": ["https://images.unsplash.com/photo-1455885666463-1ea8f31ebb6b"],
                "views": 980,
                "reference_code": "VID-002",
                "description": "Students across Asia Pacific showcase creative reading corners they built together.",
                "guest_speakers": ["Teacher Jia", "Student Collective"],
                "days_ago": 12,
            },
            {
                "title": "Mobile Health Checkpoints",
                "category": "Health Missions",
                "video_type": VideoType.FULL_VIDEO,
                "duration": "06:45",
                "language": "English",
                "video_url": "https://www.youtube.com/watch?v=readinggroup03",
                "thumbnail_url": ["https://images.unsplash.com/photo-1488521787991-ed7bbaae773c"],
                "views": 2120,
                "reference_code": "VID-003",
                "description": "Nurses set up mobile checkpoints for seniors living alone.",
                "guest_speakers": ["Nurse Pei", "Volunteer Team 3"],
                "days_ago": 3,
            },
            {
                "title": "Greening the Schoolyards",
                "category": "Environmental Stewardship",
                "video_type": VideoType.CLIP_VIDEO,
                "duration": "07:30",
                "language": "English",
                "video_url": "https://www.youtube.com/watch?v=readinggroup04",
                "thumbnail_url": ["https://images.unsplash.com/photo-1500530855697-b586d89ba3ee"],
                "views": 760,
                "reference_code": "VID-004",
                "description": "Youth chapters convert unused corners into edible gardens.",
                "guest_speakers": ["Green Club", "Mentor Ruth"],
                "days_ago": 20,
            },
            {
                "title": "Evening Reading Circles",
                "category": "Community Stories",
                "video_type": VideoType.CLIP_VIDEO,
                "duration": "03:58",
                "language": "English",
                "video_url": "https://www.youtube.com/watch?v=readinggroup05",
                "thumbnail_url": ["https://images.unsplash.com/photo-1455885666463-1ea8f31ebb6b"],
                "views": 1345,
                "reference_code": "VID-005",
                "description": "Care recipients host small reading circles after dinner service.",
                "guest_speakers": ["Sister Qian", "Kitchen Team"],
                "days_ago": 1,
            },
        ]
        objects: List[Video] = []
        for data in video_data:
            category = self.video_categories.get(data["category"])
            defaults = {
                "duration": data["duration"],
                "language": data["language"],
                "video_url": data["video_url"],
                "thumbnail_url": data["thumbnail_url"],
                "views": data["views"],
                "video_type": data["video_type"],
                "reference_code": data["reference_code"],
                "description": data["description"],
                "guest_speakers": data["guest_speakers"],
                "happened_at": self.now - timedelta(days=data["days_ago"]),
                "category": category,
            }
            video, created = Video.objects.get_or_create(
                title=data["title"], defaults=defaults
            )
            if not created:
                for field, value in defaults.items():
                    setattr(video, field, value)
                video.save()
            objects.append(video)
        return objects

    def _ensure_learns(self) -> List[Learn]:
        learn_data = [
            {
                "title": "Circle of Compassion",
                "subtitle": "Reflections for reading circle participants",
                "category": "Reading Circles",
                "image_url": "https://images.unsplash.com/photo-1469474968028-56623f02e42e",
                "days_ago": 10,
                "views": 420,
            },
            {
                "title": "Healing through Stories",
                "subtitle": "Cards for hospital volunteers",
                "category": "Reading Circles",
                "image_url": "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c",
                "days_ago": 25,
                "views": 310,
            },
            {
                "title": "Community Mission 2025",
                "subtitle": "Poster for the spring outreach campaign",
                "category": "Mission Posters",
                "image_url": "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee",
                "days_ago": 5,
                "views": 680,
            },
            {
                "title": "Youth Volunteer Kickoff",
                "subtitle": "Cards for first-time young volunteers",
                "category": "Youth Cards",
                "image_url": "https://images.unsplash.com/photo-1448932223592-d1fc686e76ea",
                "days_ago": 14,
                "views": 195,
            },
        ]
        objects: List[Learn] = []
        for data in learn_data:
            category = self.learn_categories.get(data["category"])
            defaults = {
                "subtitle": data["subtitle"],
                "category": category,
                "image_url": data["image_url"],
                "happened_at": self.now - timedelta(days=data["days_ago"]),
                "views": data["views"],
            }
            learn, created = Learn.objects.get_or_create(
                title=data["title"], defaults=defaults
            )
            if not created:
                for field, value in defaults.items():
                    setattr(learn, field, value)
                learn.save()
            objects.append(learn)
        return objects

    def _ensure_related_reports(self) -> List[RelatedReports]:
        report_data = [
            {
                "title": "Typhoon Relief Dispatch — Week 1",
                "description": "First week summary from the relief convoy teams.",
                "category": "Field Reports",
                "thumbnail_url": ["https://images.unsplash.com/photo-1469474968028-56623f02e42e"],
                "external_link": "https://example.com/reports/typhoon-week1",
                "duration": "12:30",
                "views": 840,
                "days_ago": 8,
            },
            {
                "title": "Literacy Impact Study 2024",
                "description": "Key findings from our annual reading programme evaluation.",
                "category": "Research Notes",
                "thumbnail_url": ["https://images.unsplash.com/photo-1434030216411-0b793f4b4173"],
                "external_link": "https://example.com/reports/literacy-2024",
                "duration": "08:15",
                "views": 510,
                "days_ago": 30,
            },
            {
                "title": "Mobile Clinic Routes — Q1",
                "description": "Quarter-one coverage map and patient statistics.",
                "category": "Field Reports",
                "thumbnail_url": ["https://images.unsplash.com/photo-1488521787991-ed7bbaae773c"],
                "external_link": "https://example.com/reports/clinic-q1",
                "duration": "06:45",
                "views": 370,
                "days_ago": 45,
            },
        ]
        objects: List[RelatedReports] = []
        for data in report_data:
            category = self.related_reports_categories.get(data["category"])
            defaults = {
                "description": data["description"],
                "category": category,
                "thumbnail_url": data["thumbnail_url"],
                "external_link": data["external_link"],
                "duration": data["duration"],
                "views": data["views"],
                "happened_at": self.now - timedelta(days=data["days_ago"]),
            }
            report, created = RelatedReports.objects.get_or_create(
                title=data["title"], defaults=defaults
            )
            if not created:
                for field, value in defaults.items():
                    setattr(report, field, value)
                report.save()
            objects.append(report)
        return objects

    def _ensure_photo_collections(self) -> List[PhotoCollection]:
        collections_data = [
            {
                "title": "Hualien Community Visit 2024",
                "description": "Photos from the annual community listening tour.",
                "days_ago": 14,
                "photos": [
                    {"caption": "Team gathering at the community centre", "order": 0},
                    {"caption": "Volunteers distributing reading materials", "order": 1},
                    {"caption": "Evening reflection circle", "order": 2},
                ],
            },
            {
                "title": "Mobile Library Launch",
                "description": "Opening of the retrofitted book bus.",
                "days_ago": 60,
                "photos": [
                    {"caption": "The book bus arrives at the village", "order": 0},
                    {"caption": "Children choosing their first books", "order": 1},
                ],
            },
        ]
        objects: List[PhotoCollection] = []
        for data in collections_data:
            collection, created = PhotoCollection.objects.get_or_create(
                title=data["title"],
                defaults={
                    "description": data["description"],
                    "happened_at": self.now - timedelta(days=data["days_ago"]),
                },
            )
            if not created:
                collection.description = data["description"]
                collection.happened_at = self.now - timedelta(days=data["days_ago"])
                collection.save(update_fields=["description", "happened_at"])

            existing_orders = set(
                collection.photos.values_list("order", flat=True)
            )
            for photo_spec in data["photos"]:
                if photo_spec["order"] in existing_orders:
                    continue
                photo = Photo(
                    collection=collection,
                    caption=photo_spec["caption"],
                    order=photo_spec["order"],
                )
                _save_placeholder(photo, "image", f"photo_{collection.pk}_{photo_spec['order']}.png")
                photo.save()

            objects.append(collection)
        return objects

    def _ensure_latest_news(self) -> List[LatestNews]:
        news_data = [
            {
                "title": "Reading Group Reaches 1 000 Members",
                "description": "A milestone celebration across all regional chapters.",
                "days_ago": 3,
                "images": [
                    {"caption": "Milestone banner unveiled at headquarters", "order": 0},
                    {"caption": "Volunteer coordinators gather for a group photo", "order": 1},
                ],
            },
            {
                "title": "New Youth Chapter Opens in Taichung",
                "description": "Students launch their own reading circle with local support.",
                "days_ago": 10,
                "images": [
                    {"caption": "Opening ceremony at Taichung campus", "order": 0},
                ],
            },
            {
                "title": "Partnership with City Libraries Announced",
                "description": "Books and volunteers will rotate through twelve branches.",
                "days_ago": 18,
                "images": [
                    {"caption": "Signing ceremony with library directors", "order": 0},
                    {"caption": "First batch of donated books arrives", "order": 1},
                ],
            },
        ]
        objects: List[LatestNews] = []
        for data in news_data:
            news, created = LatestNews.objects.get_or_create(
                title=data["title"],
                defaults={
                    "description": data["description"],
                    "happened_at": self.now - timedelta(days=data["days_ago"]),
                },
            )
            if not created:
                news.description = data["description"]
                news.happened_at = self.now - timedelta(days=data["days_ago"])
                news.save(update_fields=["description", "happened_at"])

            existing_orders = set(news.images.values_list("order", flat=True))
            for img_spec in data["images"]:
                if img_spec["order"] in existing_orders:
                    continue
                img = LatestNewsImage(
                    latest_news=news,
                    caption=img_spec["caption"],
                    order=img_spec["order"],
                )
                _save_placeholder(img, "image", f"news_{news.pk}_{img_spec['order']}.png")
                img.save()

            objects.append(news)
        return objects

    def _ensure_event_communities(self) -> List[EventCommunity]:
        event_data = [
            {
                "title": "Spring Compassion Summit",
                "language": "English",
                "guest_speakers": ["Sister Hui", "Brother Yong"],
                "live_stream_link": "https://youtube.com/live/readinggroup-spring",
                "start_event_date": (self.now + timedelta(days=14)).date(),
                "start_event_time": "09:00",
                "duration": "03:00",
            },
            {
                "title": "Youth Volunteer Orientation",
                "language": "Mandarin",
                "guest_speakers": ["Dr. Mei Lin"],
                "live_stream_link": None,
                "start_event_date": (self.now + timedelta(days=30)).date(),
                "start_event_time": "14:00",
                "duration": "01:30",
            },
        ]
        objects: List[EventCommunity] = []
        for data in event_data:
            defaults = {
                "language": data["language"],
                "guest_speakers": data["guest_speakers"],
                "live_stream_link": data["live_stream_link"],
                "start_event_date": data["start_event_date"],
                "start_event_time": data["start_event_time"],
                "duration": data["duration"],
            }
            event, created = EventCommunity.objects.get_or_create(
                title=data["title"], defaults=defaults
            )
            if not created:
                for field, value in defaults.items():
                    setattr(event, field, value)
                event.save()
            objects.append(event)
        return objects

    def _ensure_our_teams(self) -> List[OurTeam]:
        teams_data = [
            {
                "title": "Core Facilitation Team",
                "description": "Experienced circle leaders from across the network.",
                "is_heart": True,
                "image_url": ["https://images.unsplash.com/photo-1544723795-3fb6469f5b39"],
                "images": [
                    {"caption": "Team photo at the annual retreat", "order": 0},
                ],
            },
            {
                "title": "Youth Outreach Team",
                "description": "University students driving campus reading circles.",
                "is_heart": False,
                "image_url": ["https://images.unsplash.com/photo-1494790108377-be9c29b29330"],
                "images": [
                    {"caption": "Youth team at the Taichung launch", "order": 0},
                    {"caption": "Workshop session on active listening", "order": 1},
                ],
            },
            {
                "title": "Medical Volunteer Corps",
                "description": "Healthcare professionals pairing care with compassionate reading.",
                "is_heart": False,
                "image_url": ["https://images.unsplash.com/photo-1524504388940-b1c1722653e1"],
                "images": [
                    {"caption": "Clinic day in Hualien", "order": 0},
                ],
            },
        ]
        objects: List[OurTeam] = []
        for data in teams_data:
            team, created = OurTeam.objects.get_or_create(
                title=data["title"],
                defaults={
                    "description": data["description"],
                    "is_heart": data["is_heart"],
                    "image_url": data["image_url"],
                },
            )
            if not created:
                team.description = data["description"]
                team.is_heart = data["is_heart"]
                team.image_url = data["image_url"]
                team.save(update_fields=["description", "is_heart", "image_url"])

            existing_orders = set(team.images.values_list("order", flat=True))
            for img_spec in data["images"]:
                if img_spec["order"] in existing_orders:
                    continue
                img = OurTeamImage(
                    our_team=team,
                    caption=img_spec["caption"],
                    order=img_spec["order"],
                )
                _save_placeholder(img, "image", f"team_{team.pk}_{img_spec['order']}.png")
                img.save()

            objects.append(team)
        return objects

    def _ensure_books(self) -> List[Book]:
        books_data = [
            {
                "title": "The Quiet Volunteer",
                "description": "Stories of everyday compassion from the field.",
                "reviews": 2,
            },
            {
                "title": "Lanterns in the Rain",
                "description": "A collection of poems written by relief volunteers.",
                "reviews": 1,
            },
            {
                "title": "Reading as Service",
                "description": "Practical guide to starting community reading circles.",
                "reviews": 3,
            },
        ]
        objects: List[Book] = []
        for data in books_data:
            book, created = Book.objects.get_or_create(
                title=data["title"],
                defaults={"description": data["description"]},
            )
            if not created:
                book.description = data["description"]
                book.save(update_fields=["description"])

            existing_count = book.reviews.count()
            for i in range(existing_count, data["reviews"]):
                review = BookReview(book=book, order=i)
                _save_placeholder(review, "image", f"book_{book.pk}_review_{i}.png")
                review.save()

            objects.append(book)
        return objects

    def _ensure_history_events(self) -> List[HistoryEvent]:
        events_data = [
            {
                "year": 2018,
                "month": 3,
                "title": "Reading Group Founded",
                "sub_title_one": "Six founding families",
                "sub_title_two": "Hualien, Taiwan",
                "description": "The very first reading group started with six families meeting weekly.",
                "images": [
                    {"caption": "Founding members at the first gathering", "order": 0},
                ],
            },
            {
                "year": 2019,
                "month": 9,
                "title": "First Mobile Library",
                "sub_title_one": "A retrofitted bus",
                "sub_title_two": "Serving rural communities",
                "description": "A donated bus was converted into a travelling library with cushions and shelves.",
                "images": [
                    {"caption": "The book bus on its inaugural route", "order": 0},
                    {"caption": "Children boarding the mobile library", "order": 1},
                ],
            },
            {
                "year": 2021,
                "month": 6,
                "title": "Youth Mentorship Wing Launched",
                "sub_title_one": "Student-led curriculum",
                "sub_title_two": "Compassion stories",
                "description": "University students created their own curriculum centred on compassion stories.",
                "images": [
                    {"caption": "Inaugural youth circle session", "order": 0},
                ],
            },
            {
                "year": 2023,
                "month": 1,
                "title": "Hospital Reflection Corners",
                "sub_title_one": "Care teams and readers",
                "sub_title_two": "Six hospitals joined",
                "description": "Care teams designed mobile reading corners for patients in recovery.",
                "images": [
                    {"caption": "First reflection corner at Hualien Hospital", "order": 0},
                ],
            },
        ]
        objects: List[HistoryEvent] = []
        for data in events_data:
            event, created = HistoryEvent.objects.get_or_create(
                year=data["year"],
                month=data["month"],
                title=data["title"],
                defaults={
                    "sub_title_one": data["sub_title_one"],
                    "sub_title_two": data["sub_title_two"],
                    "description": data["description"],
                },
            )
            if not created:
                event.sub_title_one = data["sub_title_one"]
                event.sub_title_two = data["sub_title_two"]
                event.description = data["description"]
                event.save(update_fields=["sub_title_one", "sub_title_two", "description"])

            existing_orders = set(event.images.values_list("order", flat=True))
            for img_spec in data["images"]:
                if img_spec["order"] in existing_orders:
                    continue
                img = HistoryEventImage(
                    event=event,
                    caption=img_spec["caption"],
                    order=img_spec["order"],
                )
                _save_placeholder(img, "image", f"history_{event.pk}_{img_spec['order']}.png")
                img.save()

            objects.append(event)
        return objects

    def _ensure_social_media(self) -> None:
        entries = [
            {"platform": "YouTube", "url": "https://youtube.com/@readinggroup"},
            {"platform": "Facebook", "url": "https://facebook.com/readinggroup"},
            {"platform": "Instagram", "url": "https://instagram.com/readinggroup"},
            {"platform": "Podcast", "url": "https://example.com/podcast"},
        ]
        for entry in entries:
            SocialMedia.objects.update_or_create(
                platform=entry["platform"], defaults={"url": entry["url"]}
            )

    def _ensure_navbar_logo(self) -> None:
        if NavbarLogo.objects.exists():
            return
        logo = NavbarLogo()
        _save_placeholder(logo, "logo", "readinggroup-logo.png")
        logo.save()


class Command(BaseCommand):
    help = "Generate comprehensive demo content for the reading group website."

    def add_arguments(self, parser):
        parser.add_argument(
            "--reset",
            action="store_true",
            help="Delete existing content-related rows before generating demo data.",
        )

    @transaction.atomic
    def handle(self, *args, **options):
        builder = SampleContentBuilder(self.stdout, reset=options.get("reset", False))
        summary = builder.build()
        if not summary:
            self.stdout.write(self.style.WARNING("No content generated."))
            return
        lines = ["Generated content summary:"]
        for key, value in summary.items():
            lines.append(f"  {key}: {value}")
        self.stdout.write(self.style.SUCCESS("\n".join(lines)))
