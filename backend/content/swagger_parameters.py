from drf_yasg import openapi

video_manual_parameters = [
    openapi.Parameter(
        'language',
        openapi.IN_QUERY,
        description="Filter by language",
        type=openapi.TYPE_ARRAY,
        items=openapi.Items(type=openapi.TYPE_STRING)
    ),
    openapi.Parameter(
        'category',
        openapi.IN_QUERY,
        description="Filter by category (JSON object with 'name' field)",
        type=openapi.TYPE_ARRAY,
        items=openapi.Items(type=openapi.TYPE_STRING)
    ),
    openapi.Parameter(
        'happened_at',
        openapi.IN_QUERY,
        description="Filter by happened date",
        type=openapi.TYPE_STRING
    ),  
    openapi.Parameter(
        'is_new',
        openapi.IN_QUERY,
        description="Filter by is_new status",
        type=openapi.TYPE_ARRAY,
        items=openapi.Items(type=openapi.TYPE_STRING)
    ),
    openapi.Parameter(
        'is_featured',
        openapi.IN_QUERY,
        description="Filter by is_featured status",
        type=openapi.TYPE_ARRAY,
        items=openapi.Items(type=openapi.TYPE_STRING)
    ),
]

post_manual_parameters = [
    openapi.Parameter(
        'created_at',
        openapi.IN_QUERY,
        description="Filter by created date",
        type=openapi.TYPE_STRING
    ),
    openapi.Parameter(
        'category',
        openapi.IN_QUERY,
        description="Filter by category (JSON object with 'name' field)",
        type=openapi.TYPE_ARRAY,
        items=openapi.Items(type=openapi.TYPE_STRING)
    ),
    openapi.Parameter(
        'language',
        openapi.IN_QUERY,
        description="Filter by language",
        type=openapi.TYPE_ARRAY,
        items=openapi.Items(type=openapi.TYPE_STRING)
    ),
    openapi.Parameter(
        'writer',
        openapi.IN_QUERY,
        description="Filter by writer",
        type=openapi.TYPE_ARRAY,
        items=openapi.Items(type=openapi.TYPE_STRING)
    ),
    openapi.Parameter(
        'post_type',
        openapi.IN_QUERY,
        description="Filter by Post Type",
        type=openapi.TYPE_ARRAY,
        items=openapi.Items(type=openapi.TYPE_STRING)
    ),
    openapi.Parameter(
        'status',
        openapi.IN_QUERY,
        description="Filter by status",
        type=openapi.TYPE_ARRAY,
        items=openapi.Items(type=openapi.TYPE_STRING)
    ),
]

event_manual_parameters = [
    openapi.Parameter(
        'section',
        openapi.IN_QUERY,
        description="Filter by Section",
        type=openapi.TYPE_ARRAY,
        items=openapi.Items(type=openapi.TYPE_STRING)
    ),
    openapi.Parameter(
        'country',
        openapi.IN_QUERY,
        description="Filter by Country",
        type=openapi.TYPE_ARRAY,
        items=openapi.Items(type=openapi.TYPE_STRING)
    ),
    openapi.Parameter(
        'writer',
        openapi.IN_QUERY,
        description="Filter by Writer",
        type=openapi.TYPE_ARRAY,
        items=openapi.Items(type=openapi.TYPE_STRING)
    ),
    openapi.Parameter(
        'language',
        openapi.IN_QUERY,
        description="Filter by Language",
        type=openapi.TYPE_ARRAY,
        items=openapi.Items(type=openapi.TYPE_STRING)
    ),
    openapi.Parameter(
        'happened_at',
        openapi.IN_QUERY,
        description="Filter by Happened At date",
        type=openapi.TYPE_STRING
    ),
    openapi.Parameter(
        'report_type',
        openapi.IN_QUERY,
        description="Filter by Report Type",
        type=openapi.TYPE_ARRAY,
        items=openapi.Items(type=openapi.TYPE_STRING)
    ),
    openapi.Parameter(
        'tags',
        openapi.IN_QUERY,
        description="Filter by Tags",
        type=openapi.TYPE_ARRAY,
        items=openapi.Items(type=openapi.TYPE_STRING)
    ),
    openapi.Parameter(
        'category',
        openapi.IN_QUERY,
        description="Filter by Category (JSON object with 'name' field)",
        type=openapi.TYPE_ARRAY,
        items=openapi.Items(type=openapi.TYPE_STRING)
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


global_search_manual_parameters = [
    openapi.Parameter(
        'q',
        openapi.IN_QUERY,
        description="Search term",
        type=openapi.TYPE_STRING
    ),
]

content_manual_parameters = [
    openapi.Parameter(
        'category',
        openapi.IN_QUERY,
        description="Filter by category (JSON object with 'name' field)",
        type=openapi.TYPE_ARRAY,
        items=openapi.Items(type=openapi.TYPE_STRING)
    ),
    openapi.Parameter(
        'language',
        openapi.IN_QUERY,
        description="Filter by language",
        type=openapi.TYPE_ARRAY,
        items=openapi.Items(type=openapi.TYPE_STRING)
    ),
    openapi.Parameter(
        'writer',
        openapi.IN_QUERY,
        description="Filter by writer",
        type=openapi.TYPE_ARRAY,
        items=openapi.Items(type=openapi.TYPE_STRING)
    ),
    openapi.Parameter(
        'status',
        openapi.IN_QUERY,
        description="Filter by status",
        type=openapi.TYPE_ARRAY,
        items=openapi.Items(type=openapi.TYPE_STRING)
    ),
]

content_category_manual_parameters = [
    openapi.Parameter(
        'is_active',
        openapi.IN_QUERY,
        description="Filter by is_active status",
        type=openapi.TYPE_STRING
    ),
]

post_category_manual_parameters = [
    openapi.Parameter(
        'is_active',
        openapi.IN_QUERY,
        description="Filter by is_active status",
        type=openapi.TYPE_STRING
    ),
]
event_category_manual_parameters = [
    openapi.Parameter(
        'is_active',
        openapi.IN_QUERY,
        description="Filter by is_active status",
        type=openapi.TYPE_STRING
    ),
]
video_category_manual_parameters = [
    openapi.Parameter(
        'is_active',
        openapi.IN_QUERY,
        description="Filter by is_active status",
        type=openapi.TYPE_STRING
    ),
]