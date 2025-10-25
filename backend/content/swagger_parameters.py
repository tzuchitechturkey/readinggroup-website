from drf_yasg import openapi


video_manual_parameters = [
    
    openapi.Parameter(
        'video_type',
        openapi.IN_QUERY,
        description="Filter by video type",
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
]

team_member_manual_parameters = [
    openapi.Parameter(
        'Position',
        openapi.IN_QUERY,
        description="Filter by Position",
        type=openapi.TYPE_STRING
    ),
]

# Like & Comment manual parameters for each content type
post_like_parameters = [
    openapi.Parameter(
        'post',
        openapi.IN_QUERY,
        description="Post ID",
        type=openapi.TYPE_INTEGER
    ),
    openapi.Parameter(
        'user',
        openapi.IN_QUERY,
        description="User ID",
        type=openapi.TYPE_INTEGER
    ),
]
video_like_parameters = [
    openapi.Parameter(
        'video',
        openapi.IN_QUERY,
        description="Video ID",
        type=openapi.TYPE_INTEGER
    ),
    openapi.Parameter(
        'user',
        openapi.IN_QUERY,
        description="User ID",
        type=openapi.TYPE_INTEGER
    ),
]
event_like_parameters = [
    openapi.Parameter(
        'event',
        openapi.IN_QUERY,
        description="Event ID",
        type=openapi.TYPE_INTEGER
    ),
    openapi.Parameter(
        'user',
        openapi.IN_QUERY,
        description="User ID",
        type=openapi.TYPE_INTEGER
    ),
]
tvprogram_like_parameters = [
    openapi.Parameter(
        'tv_program',
        openapi.IN_QUERY,
        description="TV Program ID",
        type=openapi.TYPE_INTEGER
    ),
    openapi.Parameter(
        'user',
        openapi.IN_QUERY,
        description="User ID",
        type=openapi.TYPE_INTEGER
    ),
]
weeklymoment_like_parameters = [
    openapi.Parameter(
        'weekly_moment',
        openapi.IN_QUERY,
        description="Weekly Moment ID",
        type=openapi.TYPE_INTEGER
    ),
    openapi.Parameter(
        'user',
        openapi.IN_QUERY,
        description="User ID",
        type=openapi.TYPE_INTEGER
    ),
]

post_comment_parameters = [
    openapi.Parameter(
        'post',
        openapi.IN_QUERY,
        description="Post ID",
        type=openapi.TYPE_INTEGER
    ),
    openapi.Parameter(
        'user',
        openapi.IN_QUERY,
        description="User ID",
        type=openapi.TYPE_INTEGER
    ),
    openapi.Parameter(
        'text',
        openapi.IN_QUERY,
        description="Comment text",
        type=openapi.TYPE_STRING
    ),
]
video_comment_parameters = [
    openapi.Parameter(
        'video',
        openapi.IN_QUERY,
        description="Video ID",
        type=openapi.TYPE_INTEGER
    ),
    openapi.Parameter(
        'user',
        openapi.IN_QUERY,
        description="User ID",
        type=openapi.TYPE_INTEGER
    ),
    openapi.Parameter(
        'text',
        openapi.IN_QUERY,
        description="Comment text",
        type=openapi.TYPE_STRING
    ),
]
event_comment_parameters = [
    openapi.Parameter(
        'event',
        openapi.IN_QUERY,
        description="Event ID",
        type=openapi.TYPE_INTEGER
    ),
    openapi.Parameter(
        'user',
        openapi.IN_QUERY,
        description="User ID",
        type=openapi.TYPE_INTEGER
    ),
    openapi.Parameter(
        'text',
        openapi.IN_QUERY,
        description="Comment text",
        type=openapi.TYPE_STRING
    ),
]
tvprogram_comment_parameters = [
    openapi.Parameter(
        'tv_program',
        openapi.IN_QUERY,
        description="TV Program ID",
        type=openapi.TYPE_INTEGER
    ),
    openapi.Parameter(
        'user',
        openapi.IN_QUERY,
        description="User ID",
        type=openapi.TYPE_INTEGER
    ),
    openapi.Parameter(
        'text',
        openapi.IN_QUERY,
        description="Comment text",
        type=openapi.TYPE_STRING
    ),
]
weeklymoment_comment_parameters = [
    openapi.Parameter(
        'weekly_moment',
        openapi.IN_QUERY,
        description="Weekly Moment ID",
        type=openapi.TYPE_INTEGER
    ),
    openapi.Parameter(
        'user',
        openapi.IN_QUERY,
        description="User ID",
        type=openapi.TYPE_INTEGER
    ),
    openapi.Parameter(
        'text',
        openapi.IN_QUERY,
        description="Comment text",
        type=openapi.TYPE_STRING
    ),
]