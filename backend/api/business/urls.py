from django.urls import path
from .views import (
    BusinessListCreateView,
    BusinessDetailView,
    PortofolioListCreateView,
    PortofolioDetailView,
    ReviewListCreateView,
    ReviewDetailView
)

urlpatterns = [
    # Business routes
    path('businesses/', BusinessListCreateView.as_view(), name='business-list-create'),
    path('businesses/<int:pk>/', BusinessDetailView.as_view(), name='business-detail'),

    # Portfolio routes
    path('portfolios/', PortofolioListCreateView.as_view(), name='portfolio-list-create'),
    path('portfolios/<int:pk>/', PortofolioDetailView.as_view(), name='portfolio-detail'),

    # Review routes
    path('reviews/', ReviewListCreateView.as_view(), name='review-list-create'),
    path('reviews/<int:pk>/', ReviewDetailView.as_view(), name='review-detail'),
]