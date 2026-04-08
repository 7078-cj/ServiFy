from django.urls import path
from . import consumers

websocket_urlpatterns = [
    path('ws/some_path/<str:id>/', consumers.MyWebSocketConsumer.as_asgi()),
    path('ws/user_business_bookings/<str:user_id>/', consumers.UserBusinessBookingsConsumer.as_asgi()),
    path('ws/user_bookings/<str:user_id>/', consumers.UserBookingsConsumer.as_asgi()),
]