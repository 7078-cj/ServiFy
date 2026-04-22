from django.urls import path
from .views import (
    BusinessListCreateView,
    BusinessDetailView,
    PortfolioListCreateView,
    PortfolioDetailView,
    ReviewListCreateView,
    ReviewDetailView,
    ServiceListCreateView,
    ServiceDetailView,
    businesses,
    get_categories
)

urlpatterns = [
    # Explore
    path('all_businesses/', businesses, name='all-businesses'),

    # Business
    path('businesses/', BusinessListCreateView.as_view(), name='business-list-create'),
    path('businesses/<int:pk>/', BusinessDetailView.as_view(), name='business-detail'),

    # Portfolio 
    path('businesses/<int:business_pk>/portfolios/', PortfolioListCreateView.as_view(), name='portfolio-list-create'),
    path('businesses/<int:business_pk>/portfolios/<int:pk>/', PortfolioDetailView.as_view(), name='portfolio-detail'),

    # Reviews 
    path('businesses/<int:business_pk>/reviews/', ReviewListCreateView.as_view(), name='review-list-create'),
    path('businesses/<int:business_pk>/reviews/<int:pk>/', ReviewDetailView.as_view(), name='review-detail'),

    # Services
    path('businesses/<int:business_pk>/services/', ServiceListCreateView.as_view(), name='service-list-create'),
    path('businesses/<int:business_pk>/services/<int:pk>/', ServiceDetailView.as_view(), name='service-detail'),
    path('categories/', get_categories, name='categories'),
]

# ```
# GET  /businesses/                              → list your businesses
# POST /businesses/                              → create a business
# GET  /businesses/1/                            → business detail
# GET  /businesses/1/portfolios/                 → list portfolios for business 1
# GET  /businesses/1/reviews/                    → list reviews for business 1
# GET  /businesses/1/services/                   → list services for business 1
# GET  /all_businesses/                          → public explore page