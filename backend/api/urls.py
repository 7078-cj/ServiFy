from django.urls import path, include


urlpatterns = [
     path('user/', include('api.user.urls')),
     path('', include('api.business.urls')),# note the dot-style import
]