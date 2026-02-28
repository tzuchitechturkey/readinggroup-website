from drf_yasg import openapi

# ========================================== video swagger parameters start ============================================
video_category_manual_parameters = [
    openapi.Parameter(
        "search",
        openapi.IN_QUERY,
        description="Search term for filtering video categories by name",
        type=openapi.TYPE_STRING,
    ),
    openapi.Parameter(
        "is_active",
        openapi.IN_QUERY,
        description="Filter by is_active status",
        type=openapi.TYPE_STRING,
    ),
    openapi.Parameter(
        "language",
        openapi.IN_QUERY,
        description="Filter by language",
        type=openapi.TYPE_STRING,
    ),
]

video_manual_parameters = [
    openapi.Parameter(
        "search",
        openapi.IN_QUERY,
        description="Search term for filtering videos by title or subtitle",
        type=openapi.TYPE_STRING,
    ),
    openapi.Parameter(
        "language",
        openapi.IN_QUERY,
        description="Filter by language",
        type=openapi.TYPE_ARRAY,
        items=openapi.Items(type=openapi.TYPE_STRING),
    ),
    openapi.Parameter(
        "category",
        openapi.IN_QUERY,
        description="Filter by category (JSON object with 'name' field)",
        type=openapi.TYPE_ARRAY,
        items=openapi.Items(type=openapi.TYPE_STRING),
    ),
    openapi.Parameter(
        "happened_at",
        openapi.IN_QUERY,
        description=(
            "Filter by happened_at. "
            "Formats supported: "
            "YYYY (year), "
            "YYYY-MM (year-month), "
            "YYYY-MM-DD (full date). "
            "Examples: 2026 | 2026-02 | 2026-02-14"
        ),
        type=openapi.TYPE_STRING,
    ),
    openapi.Parameter(
        "video_type",
        openapi.IN_QUERY,
        description="Filter by Video Type",
        type=openapi.TYPE_ARRAY,
        items=openapi.Items(type=openapi.TYPE_STRING),
    ),
    openapi.Parameter(
        "is_new",
        openapi.IN_QUERY,
        description="Filter by is_new status",
        type=openapi.TYPE_ARRAY,
        items=openapi.Items(type=openapi.TYPE_STRING),
    ),
]

by_type_video_manual_parameters = [
    openapi.Parameter(
        "video_type",
        openapi.IN_QUERY,
        description="Filter by Video Type",
        type=openapi.TYPE_ARRAY,
        items=openapi.Items(type=openapi.TYPE_STRING),
    ),
]

# ========================================== video swagger parameters end ============================================
# ========================================== learn swagger parameters start ============================================
learn_category_manual_parameters = [
    openapi.Parameter(
        "search",
        openapi.IN_QUERY,
        description="Search term for filtering learn categories by name",
        type=openapi.TYPE_STRING,
    ),
    openapi.Parameter(
        "is_active",
        openapi.IN_QUERY,
        description="Filter by is_active status",
        type=openapi.TYPE_STRING,
    ),
    openapi.Parameter(
        "learn_type",
        openapi.IN_QUERY,
        description="Filter by Learn Type",
        type=openapi.TYPE_ARRAY,
        items=openapi.Items(type=openapi.TYPE_STRING),
    ),
    openapi.Parameter(
        "created_at",
        openapi.IN_QUERY,
        description=(
            "Filter by created_at. "
            "Formats supported: "
            "YYYY (year), "
            "YYYY-MM (year-month), "
            "YYYY-MM-DD (full date). "
            "Examples: 2026 | 2026-02 | 2026-02-14"
        ),
        type=openapi.TYPE_STRING,
    ),
]

learn_manual_parameters = [
    openapi.Parameter(
        "search",
        openapi.IN_QUERY,
        description="Search term for filtering learn items by title or subtitle",
        type=openapi.TYPE_STRING,
    ),
    openapi.Parameter(
        "happened_at",
        openapi.IN_QUERY,
        description=(
            "Filter by happened_at. "
            "Formats supported: "
            "YYYY (year), "
            "YYYY-MM (year-month), "
            "YYYY-MM-DD (full date). "
            "Examples: 2026 | 2026-02 | 2026-02-14"
        ),
        type=openapi.TYPE_STRING,
    ),
    openapi.Parameter(
        "learn_type",
        openapi.IN_QUERY,
        description="Filter by Learn Type",
        type=openapi.TYPE_ARRAY,
        items=openapi.Items(type=openapi.TYPE_STRING),
    ),
    openapi.Parameter(
        "category",
        openapi.IN_QUERY,
        description="Filter by category (JSON object with 'name' field)",
        type=openapi.TYPE_ARRAY,
        items=openapi.Items(type=openapi.TYPE_STRING),
    ),
]

# ========================================== learn swagger parameters end ============================================
team_member_manual_parameters = [
    openapi.Parameter(
        "Position",
        openapi.IN_QUERY,
        description="Filter by Position",
        type=openapi.TYPE_STRING,
    ),
]
