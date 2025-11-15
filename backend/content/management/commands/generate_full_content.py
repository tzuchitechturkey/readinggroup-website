from __future__ import annotations

import base64
from datetime import timedelta
from itertools import cycle
from typing import Dict, Iterable, List

from django.contrib.auth import get_user_model
from django.contrib.contenttypes.models import ContentType
from django.core.files.base import ContentFile
from django.core.management.base import BaseCommand
from django.db import transaction
from django.utils import timezone

from content.enums import ContentStatus, EventStatus, PostStatus, PostType, VideoStatus
from content.models import (
    Comments,
    Content,
    ContentCategory,
    ContentImage,
    ContentRating,
    Event,
    EventCategory,
    EventSection,
    HistoryEntry,
    Like,
    MyListEntry,
    NavbarLogo,
    PositionTeamMember,
    Post,
    PostCategory,
    PostRating,
    Reply,
    SectionOrder,
    SeasonId,
    SeasonTitle,
    SocialMedia,
    TeamMember,
    Video,
    VideoCategory,
)

PLACEHOLDER_LOGO = base64.b64decode(
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/Pv8O3QAAAABJRU5ErkJggg=="
)


class SampleContentBuilder:
    """Utility class that seeds the database with rich demo content."""

    def __init__(self, stdout, reset: bool = False) -> None:
        self.stdout = stdout
        self.reset = reset
        self.User = get_user_model()
        self.now = timezone.now()
        self.users: List = []
        self.video_categories: Dict[str, VideoCategory] = {}
        self.post_categories: Dict[str, PostCategory] = {}
        self.content_categories: Dict[str, ContentCategory] = {}
        self.event_categories: Dict[str, EventCategory] = {}
        self.event_sections: Dict[str, EventSection] = {}
        self.positions: Dict[str, PositionTeamMember] = {}
        self.season_ids: Dict[str, SeasonId] = {}
        self.summary: Dict[str, int] = {}

    # ------------------------------------------------------------------
    # Public API
    # ------------------------------------------------------------------
    def build(self) -> Dict[str, int]:
        if self.reset:
            self._reset_existing()

        self.users = self._ensure_users()
        self._record("users", len(self.users))

        self.positions = self._upsert_by_name(
            PositionTeamMember,
            [
                {"name": "Executive Director", "description": "Guides overall reading missions."},
                {"name": "Program Lead", "description": "Oversees learning circles and facilitators."},
                {"name": "Volunteer Coordinator", "description": "Connects volunteer leads across regions."},
                {"name": "Storyteller in Residence", "description": "Captures impact stories."},
            ],
        )

        self.video_categories = self._upsert_by_name(
            VideoCategory,
            [
                {"name": "Community Stories", "description": "Updates from global volunteers."},
                {"name": "Education Highlights", "description": "Clips from reading classrooms."},
                {"name": "Health Missions", "description": "Medical outreach spotlights."},
                {"name": "Environmental Stewardship", "description": "Earth-friendly initiatives."},
            ],
        )

        self.post_categories = self._upsert_by_name(
            PostCategory,
            [
                {"name": "Stories", "description": "Long-form reflections."},
                {"name": "Insights", "description": "Short lessons learned."},
                {"name": "Field Notes", "description": "Daily digest from volunteers."},
            ],
        )

        self.content_categories = self._upsert_by_name(
            ContentCategory,
            [
                {"name": "Impact Stories", "description": "Feature essays"},
                {"name": "Volunteer Voices", "description": "First-person perspectives"},
                {"name": "Program Updates", "description": "Milestones and metrics"},
            ],
        )

        self.event_categories = self._upsert_by_name(
            EventCategory,
            [
                {"name": "Disaster Relief", "description": "Rapid response deployments"},
                {"name": "Medical Outreach", "description": "Clinics and screenings"},
                {"name": "Education", "description": "Learning and literacy"},
            ],
        )

        self.event_sections = self._upsert_by_name(
            EventSection,
            [
                {"name": "Global Relief Updates", "description": "Macro view of deployments"},
                {"name": "Education & Youth", "description": "Clubs, camps, and cohorts"},
                {"name": "Healthcare Missions", "description": "Mobile clinic routes"},
            ],
        )

        self.season_ids = self._ensure_seasons()

        videos = self._ensure_videos()
        self._record("videos", len(videos))

        posts = self._ensure_posts()
        self._record("posts", len(posts))

        contents = self._ensure_contents()
        self._record("contents", len(contents))

        events = self._ensure_events()
        self._record("events", len(events))

        history_entries = self._ensure_history_entries()
        self._record("history_entries", len(history_entries))

        team_members = self._ensure_team_members()
        self._record("team_members", len(team_members))

        self._ensure_social_media()
        self._ensure_navbar_logo()
        self._ensure_section_order()

        self._seed_engagement(videos, posts, contents, events)
        self._seed_ratings(posts, contents)
        self._seed_my_list(videos)

        return self.summary

    # ------------------------------------------------------------------
    # Helpers
    # ------------------------------------------------------------------
    def _record(self, key: str, value: int) -> None:
        self.summary[key] = value

    def _reset_existing(self) -> None:
        self.stdout.write("Resetting existing content tables...")
        Like.objects.all().delete()
        Reply.objects.all().delete()
        Comments.objects.all().delete()
        MyListEntry.objects.all().delete()
        PostRating.objects.all().delete()
        ContentRating.objects.all().delete()
        ContentImage.objects.all().delete()
        Video.objects.all().delete()
        Event.objects.all().delete()
        Post.objects.all().delete()
        Content.objects.all().delete()
        HistoryEntry.objects.all().delete()
        TeamMember.objects.all().delete()
        SeasonId.objects.all().delete()
        SeasonTitle.objects.all().delete()
        SectionOrder.objects.all().delete()
        SocialMedia.objects.all().delete()
        NavbarLogo.objects.all().delete()
        ContentCategory.objects.all().delete()
        PostCategory.objects.all().delete()
        VideoCategory.objects.all().delete()
        EventCategory.objects.all().delete()
        EventSection.objects.all().delete()
        PositionTeamMember.objects.all().delete()

    def _upsert_by_name(self, model, entries: Iterable[Dict]) -> Dict[str, object]:
        objects = {}
        for entry in entries:
            payload = dict(entry)
            name = payload.pop("name")
            obj, created = model.objects.get_or_create(name=name, defaults=payload)
            if not created and payload:
                for field, value in payload.items():
                    setattr(obj, field, value)
                obj.save(update_fields=list(payload.keys()))
            objects[name] = obj
        return objects

    def _ensure_users(self) -> List:
        specs = [
            {
                "username": "reading_admin",
                "email": "reading-admin@example.com",
                "first_name": "Reading",
                "last_name": "Admin",
                "display_name": "Reading Admin",
                "profession_name": "Program Director",
                "about_me": "Helps coordinate the international reading circle network.",
                "country": "Taiwan",
                "is_staff": True,
                "is_superuser": True,
            },
            {
                "username": "circle_lead",
                "email": "circle-lead@example.com",
                "first_name": "Circle",
                "last_name": "Lead",
                "display_name": "Global Circle Lead",
                "profession_name": "Volunteer Facilitator",
                "about_me": "Hosts weekend reflection circles for new volunteers.",
                "country": "Malaysia",
                "is_staff": True,
            },
            {
                "username": "youth_editor",
                "email": "youth-editor@example.com",
                "first_name": "Youth",
                "last_name": "Editor",
                "display_name": "Youth Editor",
                "profession_name": "Student Coordinator",
                "about_me": "Captures campus highlights for the newsletter.",
                "country": "USA",
                "is_staff": False,
            },
        ]
        users: List = []
        for spec in specs:
            payload = dict(spec)
            username = payload.pop("username")
            password = payload.pop("password", "ReadingGroup#2025")
            user, created = self.User.objects.get_or_create(username=username, defaults=payload)
            if not created:
                for field, value in payload.items():
                    setattr(user, field, value)
            user.set_password(password)
            user.save()
            users.append(user)
        return users

    def _ensure_seasons(self) -> Dict[str, SeasonId]:
        mapping: Dict[str, SeasonId] = {}
        season_templates = [
            {
                "name": "Moments of Compassion",
                "description": "Seasonal spotlights on volunteer journeys.",
                "season_ids": ["MC-01", "MC-02"],
            },
            {
                "name": "Reading Circle Specials",
                "description": "Deep dives on themed learning journeys.",
                "season_ids": ["RC-01"],
            },
        ]
        for template in season_templates:
            payload = template.copy()
            season_ids = payload.pop("season_ids")
            name = payload.pop("name")
            title, created = SeasonTitle.objects.get_or_create(name=name, defaults=payload)
            if not created and payload:
                for field, value in payload.items():
                    setattr(title, field, value)
                title.save(update_fields=list(payload.keys()))
            for identifier in season_ids:
                season, _ = SeasonId.objects.get_or_create(season_title=title, season_id=identifier)
                mapping[identifier] = season
        return mapping

    def _ensure_videos(self) -> List[Video]:
        video_data = [
            {
                "title": "Compassion in Motion",
                "category": "Community Stories",
                "season": "MC-01",
                "duration": "05:12",
                "language": "English",
                "video_url": "https://www.youtube.com/watch?v=readinggroup01",
                "thumbnail_url": "https://images.unsplash.com/photo-1469474968028-56623f02e42e",
                "views": 1540,
                "is_featured": True,
                "is_weekly_moment": True,
                "reference_code": "VID-001",
                "description": "Field teams from Hualien share the first week of community listening tours.",
                "tags": ["medical", "community"],
                "cast": ["Dr. Mei Lin", "Brother Yong"],
                "days_ago": 6,
            },
            {
                "title": "Books That Bind Us",
                "category": "Education Highlights",
                "season": "RC-01",
                "duration": "04:05",
                "language": "Mandarin",
                "video_url": "https://www.youtube.com/watch?v=readinggroup02",
                "thumbnail_url": "https://images.unsplash.com/photo-1455885666463-1ea8f31ebb6b",
                "views": 980,
                "is_featured": False,
                "is_weekly_moment": False,
                "reference_code": "VID-002",
                "description": "Students across Asia Pacific showcase creative reading corners they built together.",
                "tags": ["education", "youth"],
                "cast": ["Teacher Jia", "Student Collective"],
                "days_ago": 12,
            },
            {
                "title": "Mobile Health Checkpoints",
                "category": "Health Missions",
                "season": "MC-02",
                "duration": "06:45",
                "language": "English",
                "video_url": "https://www.youtube.com/watch?v=readinggroup03",
                "thumbnail_url": "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c",
                "views": 2120,
                "is_featured": True,
                "is_weekly_moment": False,
                "reference_code": "VID-003",
                "description": "Nurses set up mobile checkpoints for seniors living alone.",
                "tags": ["health", "seniors"],
                "cast": ["Nurse Pei", "Volunteer Team 3"],
                "days_ago": 3,
            },
            {
                "title": "Greening the Schoolyards",
                "category": "Environmental Stewardship",
                "season": "RC-01",
                "duration": "07:30",
                "language": "English",
                "video_url": "https://www.youtube.com/watch?v=readinggroup04",
                "thumbnail_url": "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee",
                "views": 760,
                "is_featured": False,
                "is_weekly_moment": False,
                "reference_code": "VID-004",
                "description": "Youth chapters convert unused corners into edible gardens.",
                "tags": ["environment", "youth"],
                "cast": ["Green Club", "Mentor Ruth"],
                "days_ago": 20,
            },
            {
                "title": "Evening Reading Circles",
                "category": "Community Stories",
                "season": "MC-02",
                "duration": "03:58",
                "language": "English",
                "video_url": "https://www.youtube.com/watch?v=readinggroup05",
                "thumbnail_url": "https://images.unsplash.com/photo-1455885666463-1ea8f31ebb6b",
                "views": 1345,
                "is_featured": False,
                "is_weekly_moment": True,
                "reference_code": "VID-005",
                "description": "Care recipients host small reading circles after dinner service.",
                "tags": ["community", "reflection"],
                "cast": ["Sister Qian", "Kitchen Team"],
                "days_ago": 1,
            },
        ]
        objects: List[Video] = []
        for data in video_data:
            category = self.video_categories.get(data["category"])
            season = self.season_ids.get(data.get("season"))
            defaults = {
                "duration": data["duration"],
                "language": data["language"],
                "video_url": data["video_url"],
                "thumbnail_url": data["thumbnail_url"],
                "views": data["views"],
                "status": VideoStatus.PUBLISHED,
                "is_featured": data["is_featured"],
                "is_weekly_moment": data["is_weekly_moment"],
                "reference_code": data["reference_code"],
                "description": data["description"],
                "tags": data["tags"],
                "cast": data["cast"],
                "happened_at": (self.now - timedelta(days=data["days_ago"])),
            }
            video, created = Video.objects.get_or_create(title=data["title"], defaults=defaults)
            if not created:
                for field, value in defaults.items():
                    setattr(video, field, value)
            video.category = category
            video.season_name = season
            video.save()
            objects.append(video)
        return objects

    def _ensure_posts(self) -> List[Post]:
        post_data = [
            {
                "title": "Morning Pages from the Coastal Clinic",
                "subtitle": "Nurses reflect on gentle routines",
                "category": "Stories",
                "post_type": PostType.CARD,
                "writer": "Dr. Mei Lin",
                "language": "English",
                "image_url": "https://images.unsplash.com/photo-1469474968028-56623f02e42e",
                "writer_avatar": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e",
                "excerpt": "We greet every patient with tea before the first stethoscope check.",
                "body": "The clinic opens with shared breathing exercises...",
                "tags": ["medical", "mindfulness"],
                "views": 2240,
            },
            {
                "title": "Five Ways to Hold Listening Circles",
                "subtitle": "Techniques for first-time facilitators",
                "category": "Insights",
                "post_type": PostType.CARD,
                "writer": "Global Circle Lead",
                "language": "English",
                "image_url": "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee",
                "writer_avatar": "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
                "excerpt": "Curiosity and silence are still the best tools.",
                "body": "Start by grounding the group...",
                "tags": ["facilitation", "training"],
                "views": 1580,
            },
            {
                "title": "When Youth Design Their Own Shelves",
                "subtitle": "A quick look at creative reading nooks",
                "category": "Field Notes",
                "post_type": PostType.PHOTO,
                "writer": "Youth Editor",
                "language": "English",
                "image_url": "https://images.unsplash.com/photo-1448932223592-d1fc686e76ea",
                "writer_avatar": "https://images.unsplash.com/photo-1524504388940-b1c1722653e1",
                "excerpt": "Shelves became storytelling walls overnight.",
                "body": "Students in Taichung repurposed textile offcuts...",
                "tags": ["youth", "design"],
                "views": 940,
            },
            {
                "title": "Kitchen Teams That Read While Cooking",
                "subtitle": "Micro-habits that anchor gratitude",
                "category": "Stories",
                "post_type": PostType.CARD,
                "writer": "Sister Hui",
                "language": "Mandarin",
                "image_url": "https://images.unsplash.com/photo-1504674900247-0877df9cc836",
                "writer_avatar": "https://images.unsplash.com/photo-1544723795-3fb6469f5b39",
                "excerpt": "Every ladle becomes a reminder from the weekly reading.",
                "body": "The soup line slows down for thirty breaths...",
                "tags": ["kitchen", "practice"],
                "views": 1105,
            },
        ]
        objects: List[Post] = []
        for data in post_data:
            category = self.post_categories.get(data["category"])
            defaults = {
                "subtitle": data["subtitle"],
                "writer": data["writer"],
                "language": data["language"],
                "image_url": data["image_url"],
                "writer_avatar": data["writer_avatar"],
                "excerpt": data["excerpt"],
                "body": data["body"],
                "tags": data["tags"],
                "views": data["views"],
                "read_time": "6 min",
                "status": PostStatus.PUBLISHED,
                "post_type": data["post_type"],
            }
            post, created = Post.objects.get_or_create(title=data["title"], defaults=defaults)
            if not created:
                for field, value in defaults.items():
                    setattr(post, field, value)
            post.category = category
            post.save()
            objects.append(post)
        return objects

    def _ensure_contents(self) -> List[Content]:
        content_data = [
            {
                "title": "Learning with Lantern Light",
                "subtitle": "Rural reading nights",
                "category": "Impact Stories",
                "writer": "Brother Yong",
                "language": "English",
                "image_url": "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c",
                "excerpt": "Villagers keep study circles alive after work hours.",
                "body": "Lanterns move from home to home as mentors rotate...",
                "tags": ["rural", "reading"],
                "metadata": "Keywords: rural, lantern, learning",
                "gallery": [
                    "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429",
                    "https://images.unsplash.com/photo-1434030216411-0b793f4b4173",
                ],
            },
            {
                "title": "Field Libraries in a Backpack",
                "subtitle": "Every volunteer becomes a portal",
                "category": "Volunteer Voices",
                "writer": "Global Circle Lead",
                "language": "English",
                "image_url": "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c",
                "excerpt": "Quick start kits help pop-up gatherings stay structured.",
                "body": "Backpacks now carry laminated conversation prompts...",
                "tags": ["kit", "volunteer"],
                "metadata": "Keywords: kit, volunteers",
                "gallery": [
                    "https://images.unsplash.com/photo-1448932223592-d1fc686e76ea",
                ],
            },
            {
                "title": "Care Recipients Become Hosts",
                "subtitle": "Hospital rooms transform into book clubs",
                "category": "Program Updates",
                "writer": "Dr. Mei Lin",
                "language": "Mandarin",
                "image_url": "https://images.unsplash.com/photo-1469474968028-56623f02e42e",
                "excerpt": "Recovery plans now include reflection prompts.",
                "body": "Patients help annotate calming passages for the next visitor...",
                "tags": ["health", "reflection"],
                "metadata": "Keywords: hospital, hosts",
                "gallery": [
                    "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c",
                    "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee",
                ],
            },
        ]
        objects: List[Content] = []
        for data in content_data:
            category = self.content_categories.get(data["category"])
            defaults = {
                "subtitle": data["subtitle"],
                "writer": data["writer"],
                "language": data["language"],
                "image_url": data["image_url"],
                "excerpt": data["excerpt"],
                "body": data["body"],
                "tags": data["tags"],
                "metadata": data["metadata"],
                "status": ContentStatus.PUBLISHED,
                "content_type": "feature",
                "views": 875,
                "read_time": "7 min",
                "is_active": True,
            }
            content, created = Content.objects.get_or_create(title=data["title"], defaults=defaults)
            if not created:
                for field, value in defaults.items():
                    setattr(content, field, value)
            content.category = category
            content.save()
            gallery_urls = data.get("gallery", [])
            for url in gallery_urls:
                if url:
                    ContentImage.objects.get_or_create(content=content, image_url=url)
            objects.append(content)
        return objects

    def _ensure_events(self) -> List[Event]:
        event_data = [
            {
                "title": "Community Cookhouse Graduation",
                "writer": "Sister Hui",
                "category": "Education",
                "section": "Education & Youth",
                "language": "Mandarin",
                "image_url": "https://images.unsplash.com/photo-1504674900247-0877df9cc836",
                "thumbnail_url": "https://images.unsplash.com/photo-1504674900247-0877df9cc836",
                "summary": "Families share how cooking teams became study partners.",
                "tags": ["kitchen", "reading"],
                "video_url": "https://www.youtube.com/watch?v=readingevent01",
                "views": 640,
                "days_ago": 9,
            },
            {
                "title": "Mobile Library Convoy",
                "writer": "Brother Yong",
                "category": "Disaster Relief",
                "section": "Global Relief Updates",
                "language": "English",
                "image_url": "https://images.unsplash.com/photo-1469474968028-56623f02e42e",
                "thumbnail_url": "https://images.unsplash.com/photo-1469474968028-56623f02e42e",
                "summary": "Three trucks of books accompany relief goods.",
                "tags": ["relief", "library"],
                "video_url": "https://www.youtube.com/watch?v=readingevent02",
                "views": 1010,
                "days_ago": 15,
            },
            {
                "title": "Campus Mindfulness Retreat",
                "writer": "Youth Editor",
                "category": "Education",
                "section": "Healthcare Missions",
                "language": "English",
                "image_url": "https://images.unsplash.com/photo-1448932223592-d1fc686e76ea",
                "thumbnail_url": "https://images.unsplash.com/photo-1448932223592-d1fc686e76ea",
                "summary": "Students pair yoga with reading reflection.",
                "tags": ["youth", "mindfulness"],
                "video_url": "https://www.youtube.com/watch?v=readingevent03",
                "views": 480,
                "days_ago": 4,
            },
        ]
        objects: List[Event] = []
        for data in event_data:
            category = self.event_categories.get(data["category"])
            section = self.event_sections.get(data["section"])
            defaults = {
                "writer": data["writer"],
                "language": data["language"],
                "image_url": data["image_url"],
                "thumbnail_url": data["thumbnail_url"],
                "summary": data["summary"],
                "tags": data["tags"],
                "video_url": data["video_url"],
                "status": EventStatus.PUBLISHED,
                "report_type": "news",
                "views": data["views"],
                "happened_at": (self.now - timedelta(days=data["days_ago"])).date(),
            }
            event, created = Event.objects.get_or_create(title=data["title"], defaults=defaults)
            if not created:
                for field, value in defaults.items():
                    setattr(event, field, value)
            event.category = category
            event.section = section
            event.save()
            objects.append(event)
        return objects

    def _ensure_history_entries(self) -> List[HistoryEntry]:
        entries = [
            {
                "title": "Reading Group Launch",
                "story_date": self.now.date() - timedelta(days=365 * 2),
                "description": "The very first reading group started with six families.",
                "image_url": "https://images.unsplash.com/photo-1455885666463-1ea8f31ebb6b",
            },
            {
                "title": "First Mobile Library",
                "story_date": self.now.date() - timedelta(days=365 * 1),
                "description": "Retrofitted a bus with books and cushions.",
                "image_url": "https://images.unsplash.com/photo-1434030216411-0b793f4b4173",
            },
            {
                "title": "Youth Mentorship Wing",
                "story_date": self.now.date() - timedelta(days=260),
                "description": "Students created their own curriculum around compassion stories.",
                "image_url": "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
            },
            {
                "title": "Hospital Reflection Corners",
                "story_date": self.now.date() - timedelta(days=120),
                "description": "Care teams designed mobile shrines that hold the latest readings.",
                "image_url": "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429",
            },
        ]
        objects: List[HistoryEntry] = []
        for data in entries:
            defaults = {
                "story_date": data["story_date"],
                "description": data["description"],
                "image_url": data["image_url"],
            }
            entry, created = HistoryEntry.objects.get_or_create(title=data["title"], defaults=defaults)
            if not created:
                for field, value in defaults.items():
                    setattr(entry, field, value)
                entry.save(update_fields=list(defaults.keys()))
            objects.append(entry)
        return objects

    def _ensure_team_members(self) -> List[TeamMember]:
        members = [
            {
                "name": "Sister Hui",
                "position": "Executive Director",
                "job_title": "Kitchen & Care Lead",
                "description": "She brings recipes and reading prompts to every relief site.",
                "avatar_url": "https://images.unsplash.com/photo-1544723795-3fb6469f5b39",
                "social_links": [
                    {"label": "Email", "url": "mailto:hui@example.com"},
                ],
            },
            {
                "name": "Brother Yong",
                "position": "Program Lead",
                "job_title": "Logistics Storyteller",
                "description": "Coordinates transport routes while interviewing volunteers.",
                "avatar_url": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e",
                "social_links": [
                    {"label": "LinkedIn", "url": "https://linkedin.com/in/brotheryong"},
                ],
            },
            {
                "name": "Dr. Mei Lin",
                "position": "Volunteer Coordinator",
                "job_title": "Medical Lead",
                "description": "Designs gentle training for first-time caregivers.",
                "avatar_url": "https://images.unsplash.com/photo-1524504388940-b1c1722653e1",
                "social_links": [
                    {"label": "YouTube", "url": "https://youtube.com/@readinggroup"},
                ],
            },
            {
                "name": "Global Circle Lead",
                "position": "Storyteller in Residence",
                "job_title": "Facilitator",
                "description": "Helps volunteers capture their own micro-stories.",
                "avatar_url": "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
                "social_links": [
                    {"label": "Instagram", "url": "https://instagram.com/readinggroup"},
                ],
            },
        ]
        objects: List[TeamMember] = []
        for data in members:
            position = self.positions.get(data["position"])
            defaults = {
                "position": position,
                "job_title": data["job_title"],
                "description": data["description"],
                "avatar_url": data["avatar_url"],
                "social_links": data["social_links"],
            }
            member, created = TeamMember.objects.get_or_create(name=data["name"], defaults=defaults)
            if not created:
                for field, value in defaults.items():
                    setattr(member, field, value)
                member.save()
            objects.append(member)
        return objects

    def _ensure_social_media(self) -> None:
        entries = [
            {"platform": "YouTube", "url": "https://youtube.com/@readinggroup"},
            {"platform": "Facebook", "url": "https://facebook.com/readinggroup"},
            {"platform": "Instagram", "url": "https://instagram.com/readinggroup"},
            {"platform": "Podcast", "url": "https://example.com/podcast"},
        ]
        for entry in entries:
            SocialMedia.objects.update_or_create(platform=entry["platform"], defaults={"url": entry["url"]})

    def _ensure_navbar_logo(self) -> None:
        if NavbarLogo.objects.exists():
            return
        logo = NavbarLogo.objects.create()
        logo.logo.save("readinggroup-logo.png", ContentFile(PLACEHOLDER_LOGO), save=True)

    def _ensure_section_order(self) -> None:
        defaults = [
            ("video", 1),
            ("post_card", 2),
            ("post_photo", 3),
            ("event", 4),
            ("content", 5),
        ]
        for key, position in defaults:
            SectionOrder.objects.update_or_create(key=key, defaults={"position": position})

    def _seed_engagement(self, videos, posts, contents, events) -> None:
        comment_phrases = cycle([
            "Appreciate the behind-the-scenes look.",
            "Sharing this with our reading circle tonight.",
            "Beautiful reminder to slow down together.",
            "Inspired to try this with our youth chapter.",
        ])
        reply_phrases = cycle([
            "Thank you for reading along!",
            "Let us know how your group adapts it.",
            "Sending gratitude from Hualien.",
        ])
        collections = [videos, posts, contents, events]
        for objects in collections:
            if not objects:
                continue
            ct = ContentType.objects.get_for_model(objects[0].__class__)
            for index, obj in enumerate(objects):
                for user in self.users:
                    comment, _ = Comments.objects.get_or_create(
                        content_type=ct,
                        object_id=obj.pk,
                        user=user,
                        defaults={"text": f"{next(comment_phrases)} ({obj.title})"},
                    )
                    other_users = [u for u in self.users if u != user]
                    if other_users:
                        responder = other_users[index % len(other_users)]
                        Reply.objects.get_or_create(
                            comment=comment,
                            user=responder,
                            defaults={"text": next(reply_phrases)},
                        )
                    Like.objects.get_or_create(user=user, content_type=ct, object_id=obj.pk)

    def _seed_ratings(self, posts: Iterable[Post], contents: Iterable[Content]) -> None:
        for idx, post in enumerate(posts):
            ct_value = (idx % 5) + 1
            for offset, user in enumerate(self.users):
                rating_value = ((ct_value + offset - 1) % 5) + 1
                PostRating.objects.update_or_create(
                    user=user,
                    post=post,
                    defaults={"rating": rating_value},
                )
        for idx, content in enumerate(contents):
            base_value = ((idx + 2) % 5) + 1
            for offset, user in enumerate(self.users):
                rating_value = ((base_value + offset - 1) % 5) + 1
                ContentRating.objects.update_or_create(
                    user=user,
                    content=content,
                    defaults={"rating": rating_value},
                )

    def _seed_my_list(self, videos: Iterable[Video]) -> None:
        video_list = list(videos)
        if not video_list:
            return
        for idx, user in enumerate(self.users):
            picks = [video_list[idx % len(video_list)]]
            if len(video_list) > 1:
                picks.append(video_list[(idx + 1) % len(video_list)])
            for video in picks:
                MyListEntry.objects.get_or_create(user=user, video=video)


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
            lines.append(f"- {key}: {value}")
        self.stdout.write(self.style.SUCCESS("\n".join(lines)))
