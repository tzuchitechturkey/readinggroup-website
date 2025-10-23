from drf_yasg import openapi


video_manual_parameters = [
    openapi.Parameter(
        'video_type',
        openapi.IN_QUERY, 
        description="Filter by video type",
        type=openapi.TYPE_STRING
    ),
    openapi.Parameter(
        'language',
        openapi.IN_QUERY,
        description="Filter by language",
        type=openapi.TYPE_STRING
    ),
    openapi.Parameter(
        'category',
        openapi.IN_QUERY,
        description="Filter by category (JSON object with 'name' field)",
        type=openapi.TYPE_STRING
    ),
    openapi.Parameter(
        'happened_at',
        openapi.IN_QUERY,
        description="Filter by happened date",
        type=openapi.TYPE_STRING
    ),
]

post_manual_parameters = [
    openapi.Parameter(
        'published_at',
        openapi.IN_QUERY,
        description="Filter by published date",
        type=openapi.TYPE_STRING
    ),
    openapi.Parameter(
        'writer',
        openapi.IN_QUERY,
        description="Filter by writer",
        type=openapi.TYPE_STRING
    ),
    openapi.Parameter(
        'category',
        openapi.IN_QUERY,
        description="Filter by category",
        type=openapi.TYPE_STRING
    ),
    openapi.Parameter(
        'post_type',
        openapi.IN_QUERY,
        description="Filter by post type",
        type=openapi.TYPE_STRING
    ),
    openapi.Parameter(
        'language',
        openapi.IN_QUERY,
        description="Filter by language",
        type=openapi.TYPE_STRING
    ),
]

event_manual_parameters = [
    openapi.Parameter(
        'section',
        openapi.IN_QUERY,
        description="Filter by Section",
        type=openapi.TYPE_STRING
    ),
    openapi.Parameter(
        'category',
        openapi.IN_QUERY,
        description="Filter by Category",
        type=openapi.TYPE_STRING
    ),
    openapi.Parameter(
        'country',
        openapi.IN_QUERY,
        description="Filter by Country",
        type=openapi.TYPE_STRING
    ),
    openapi.Parameter(
        'writer',
        openapi.IN_QUERY,
        description="Filter by Writer",
        type=openapi.TYPE_STRING
    ),
    openapi.Parameter(
        'language',
        openapi.IN_QUERY,
        description="Filter by Language",
        type=openapi.TYPE_STRING
    ),
    openapi.Parameter(
        'happened_at',
        openapi.IN_QUERY,
        description="Filter by Happened At date",
        type=openapi.TYPE_STRING
    ),
]

team_member_manual_parameters = [
    openapi.Parameter(
        'Position',
        openapi.IN_QUERY,
        description="Filter by Position",
        type=openapi.TYPE_STRING
    ),
]