from django.urls import path
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from .views import (AllBusinessBookingListView, BusinessBookingListView, UserBookingListView, registerUser, 
                    MyTokenObtainPairView, 
                    test, 
                    request_password_reset, 
                    verify_reset_code, 
                    reset_password, 
                    resend_reset_code, 
                    LocationDetailView, 
                    LocationListCreateView,
                    profile,
                    updateProfile,
                    BookingListCreateView,
                    BookingDetailView,
                    BookingCancelView,
                    NotificationListCreateView,
                    NotificationRetrieveDestroyView)


urlpatterns = [
    path('token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('register/', registerUser, name='register_user'),
    path('test/', test, name='test'),
    path("forgot-password/", request_password_reset, name='request_password_reset'),
    path("verify-code/", verify_reset_code, name='verify_reset_code'),
    path("reset-password/", reset_password, name='reset_password'),
    path("resend-code/", resend_reset_code, name='resend_code'),
    path('locations/', LocationListCreateView.as_view(), name='locations-list-create'),
    path('locations/<int:pk>/', LocationDetailView.as_view(), name='locations-detail'),
    path('profile/', profile, name='profile'),
    path('profile/update', updateProfile, name='update-profile'),
    
    path(
        'services/<int:service_id>/bookings/',
        BookingListCreateView.as_view(),
        name='booking-list-create'
    ),
    
    path(
    'my-bookings/',
        UserBookingListView.as_view(),
        name='user-bookings'
    ),
    
    path(
        "bookings/<int:pk>/",
        BookingDetailView.as_view(),
        name="booking-detail"
    ),
    
    path(
        "business/bookings/",
        AllBusinessBookingListView.as_view(),
        name="business-bookings"
    ),
    path(
    "business/<int:business_id>/bookings/",
        BusinessBookingListView.as_view(),
        name="business-bookings"
    ),
    path("bookings/<int:pk>/cancel/", BookingCancelView.as_view(), name="booking-cancel"),
    path("notifications/", NotificationListCreateView.as_view(), name="notification-list-create"),
    path("notifications/<int:pk>/", NotificationRetrieveDestroyView.as_view(), name="notification-detail-destroy"),
    
]