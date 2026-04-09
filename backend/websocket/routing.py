from django.urls import path
from . import consumers

websocket_urlpatterns = [
    path('ws/some_path/<str:id>/', consumers.MyWebSocketConsumer.as_asgi()),
    path('ws/business_bookings/<str:user_id>/', consumers.UserBusinessBookingsConsumer.as_asgi()),
    path('ws/user_bookings/<str:user_id>/', consumers.UserBookingsConsumer.as_asgi()),
    path('ws/business_reviews/<str:business_id>/', consumers.BusinessReviewsConsumer.as_asgi()),
    path('ws/chat/<str:conversation_id>/', consumers.ChatConsumer.as_asgi()),
]