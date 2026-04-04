# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Full-stack web application for a reading group platform (Tzu Chi). Built as a monorepo:
- **Backend**: Django 5.2 REST API (`/backend`)
- **Frontend**: React 19 + Vite 7 SPA (`/frontend`)
- **Production**: `https://readinggroup.tzuchitech.com` / API: `https://api.readinggroup.tzuchitech.com`

## Commands

### Frontend (`/frontend`)
```bash
npm run dev          # Dev server on port 3000
npm run build        # Production build
npm run lint         # ESLint
npm run i18n:extract # Extract i18n translation keys
```
First-time setup: `npm install --legacy-peer-deps` (required due to peer dep conflicts).

### Backend (`/backend`)
```bash
python manage.py runserver       # Dev server (defaults to SQLite)
python manage.py migrate
python manage.py createsuperuser
```

### Docker (full stack)
```bash
docker-compose up   # PostgreSQL (55432) + Django (8001) + React/nginx (3001)
```

## Architecture

### Frontend

**Entry point**: [frontend/src/App.jsx](frontend/src/App.jsx) — splits routes into `authRoutes` (wrapped in `NonAuthLayout`) and `userRoutes` (wrapped in Navbar + Footer, except `/dashboard` which has its own admin nav). All page components are lazy-loaded.

**API layer** ([frontend/src/api/](frontend/src/api/)): Axios instance in `axios.js` reads JWT from storage (via `getToken.js`) and attaches it as `Bearer` header. `AxiosInterceptor` component handles global error responses. Base URL is configured in [frontend/src/configs.js](frontend/src/configs.js) — toggle between `localhost:8000` and the production URL there.

**Path alias**: `@` resolves to `frontend/src/` (configured in `vite.config.js`).

**Component structure**:
- `src/components/ForPages/` — page-specific components, organized by feature (Auth, Dashboard, Videos, Profile, etc.)
- `src/components/Global/` — shared components (Navbar, Footer, Sidebar, SearchInput, etc.)
- `src/components/ui/` — headless Radix UI primitives styled with Tailwind (shadcn-style)
- `src/pages/` — thin page containers that compose `ForPages` components
- `src/hooks/` — custom React hooks
- `src/api/` — one file per resource (auth, contents, videos, dashboard, etc.)

**UI**: Tailwind CSS + Radix UI headless components. Rich text editing uses CKEditor 5 (for content) and Jodit. Charts use Recharts.

**i18n**: `i18next` with `react-i18next`. Translation files in `src/i18n/`. Extract new keys with `npm run i18n:extract`.

### Backend

**Django apps**:
- `accounts` — custom `User` model (extends `AbstractUser`, adds `profile_image`, `section_name`, `totp_secret`, `is_first_login`). Auth via JWT (SimpleJWT) with 3650-day token lifetime.
- `content` — all content models (see below). Registered at `api/v1/`.

**API URL structure**:
- `api/v1/user/` and `api/v1/accounts/` → `accounts.urls` (both namespaces point to same URLconf)
- `api/v1/` → `content.urls`
- `/` and `/swagger/` → Swagger UI (drf-yasg)
- `/redoc/` → ReDoc

**Content models** (all extend `TimestampedModel` with `created_at`/`updated_at`):
- `Video` + `VideoCategory` + `ContentAttachment` — video library with YouTube URLs, thumbnails, guest speakers
- `Learn` + `LearnCategory` — learning materials; `LearnCategory.learn_type` is `CARDS` or `POSTERS`
- `EventCommunity` — livestream schedule events, linked to `Learn` (posters only); toggles `Learn.is_event`
- `LatestNews` + `LatestNewsImage` — news items with ordered image galleries
- `RelatedReports` + `RelatedReportsCategory` — external report links
- `PhotoCollection` + `Photo` — photo albums (max 28 photos per collection enforced in `Photo.save()`)
- `OurTeam` + `OurTeamImage` — team member profiles; only one can have `is_heart=True`
- `Book` + `BookReview` — book catalog with review images
- `HistoryEvent` + `HistoryEventImage` — organization history timeline
- `NavbarLogo`, `SocialMedia` — site configuration

**REST Framework config**: `IsAuthenticatedOrReadOnly` by default, `LimitOffsetPagination` (page size 10), `DjangoFilterBackend` + `OrderingFilter` + `SearchFilter` on all viewsets. `APPEND_SLASH = False`.

**Database**: SQLite by default locally; PostgreSQL in production via env vars (`DJANGO_DB_ENGINE`, `DJANGO_DB_NAME`, etc.).

## Key Configuration

- **Frontend API URL**: [frontend/src/configs.js](frontend/src/configs.js) — change `BASE_URL` to switch between local and production
- **Backend secrets**: All sensitive values (DB, email, YouTube API key) should use env vars; currently some are hardcoded in `settings.py` — do not commit real credentials
- **CORS**: `CORS_ALLOW_ALL_ORIGINS=true` by default (dev); controlled by `DJANGO_CORS_ALLOW_ALL` env var
- **CI/CD**: GitHub Actions at [.github/workflows/deploy.yml](.github/workflows/deploy.yml) auto-deploys frontend to GitHub Pages on push to `main`
