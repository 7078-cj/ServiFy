from django.urls import path, include


urlpatterns = [
     path('user/', include('api.user.urls')),
     path('', include('api.business.urls')),
     path('chat/', include('api.chat.urls')),
]