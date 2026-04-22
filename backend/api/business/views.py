from django.core.cache import cache
from rest_framework.decorators import api_view, throttle_classes
from rest_framework import viewsets, permissions
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
from .serializers import BusinessSerializer, PortfolioUploadSerializer, PortfolioSerializer, ReviewSerializer, ServiceSerializer, CategorySerializer
from rest_framework.permissions import IsAuthenticated
from .models import Business, Portfolio, Review, Service, Category
from .utils import get_business
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response
from django.db.models import Avg


class IsOwnerOrReadOnly(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        if hasattr(obj, 'owner'):
            return obj.owner == request.user
        if hasattr(obj, 'business') and obj.business is not None:
            return obj.business.owner == request.user
        return False


class BusinessListCreateView(ListCreateAPIView):
    serializer_class = BusinessSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return (
            Business.objects
            .filter(owner=self.request.user)
            .prefetch_related('review', 'portfolio', 'services', 'review__author')
            .annotate(avg_rating=Avg('review__rate'))
        )

    def perform_create(self, serializer):
        
        if self.request.user.profile.role == 'customer':
            self.request.user.profile.role = 'provider'
            self.request.user.profile.save()
            
            
        serializer.save(owner=self.request.user)


class BusinessDetailView(RetrieveUpdateDestroyAPIView):
    serializer_class = BusinessSerializer
    permission_classes = [IsAuthenticated, IsOwnerOrReadOnly]

    def get_queryset(self):
        return (
            Business.objects
            .prefetch_related('review', 'portfolio', 'services', 'review__author')
            .annotate(avg_rating=Avg('review__rate'))
        )

    def perform_update(self, serializer):
        serializer.save(owner=self.request.user)


class PortfolioListCreateView(ListCreateAPIView):
    serializer_class = PortfolioUploadSerializer
    permission_classes = [IsAuthenticated]

    def get_business(self):
        if not hasattr(self, 'business'):
            self.business = get_business(self)
        return self.business

    def get_queryset(self):
        return Portfolio.objects.filter(business=self.get_business())

    def get_serializer(self, *args, **kwargs):
        kwargs['context'] = kwargs.get('context', {})
        kwargs['context']['business'] = self.get_business()

        photos = self.request.data.getlist('photos')
        if photos:
            kwargs['data'] = [{'photo': photo} for photo in photos]
            kwargs['many'] = True

        return super().get_serializer(*args, **kwargs)

    def perform_create(self, serializer):
        serializer.save(business=self.get_business())


class PortfolioDetailView(RetrieveUpdateDestroyAPIView):
    serializer_class = PortfolioSerializer
    permission_classes = [IsAuthenticated, IsOwnerOrReadOnly]

    def get_business(self):
        if not hasattr(self, 'business'):
            self.business = get_business(self)
        return self.business

    def get_queryset(self):
        return Portfolio.objects.filter(business=self.get_business())

    def perform_update(self, serializer):
        serializer.save(business=self.get_business())


class ReviewListCreateView(ListCreateAPIView):
    serializer_class = ReviewSerializer
    permission_classes = [IsAuthenticated]

    def get_business(self):
        if not hasattr(self, 'business'):
            self.business = get_business(self)
        return self.business

    def get_queryset(self):
        return Review.objects.filter(business=self.get_business())

    def perform_create(self, serializer):
        serializer.save(business=self.get_business(), author=self.request.user)


class ReviewDetailView(RetrieveUpdateDestroyAPIView):
    serializer_class = ReviewSerializer
    permission_classes = [IsAuthenticated, IsOwnerOrReadOnly]

    def get_business(self):
        if not hasattr(self, 'business'):
            self.business = get_business(self)
        return self.business

    def get_queryset(self):
        return Review.objects.filter(business=self.get_business())

    def perform_update(self, serializer):
        serializer.save(business=self.get_business(), author=self.request.user)


class ServiceListCreateView(ListCreateAPIView):
    serializer_class = ServiceSerializer
    permission_classes = [IsAuthenticated]

    def get_business(self):
        if not hasattr(self, 'business'):
            self.business = get_business(self)
        return self.business

    def get_queryset(self):
        return Service.objects.filter(business=self.get_business())

    def perform_create(self, serializer):
        serializer.save(business=self.get_business())


class ServiceDetailView(RetrieveUpdateDestroyAPIView):
    serializer_class = ServiceSerializer
    permission_classes = [IsAuthenticated, IsOwnerOrReadOnly]

    def get_business(self):
        if not hasattr(self, 'business'):
            self.business = get_business(self)
        return self.business

    def get_queryset(self):
        return Service.objects.filter(business=self.get_business())

    def perform_update(self, serializer):
        serializer.save(business=self.get_business())


@api_view(["GET"])
def businesses(request):
    businesses = (
        Business.objects
        .all()
        .prefetch_related('review', 'portfolio', 'services', 'review__author')
        .annotate(avg_rating=Avg('review__rate'))
    )
    serializer = BusinessSerializer(businesses, many=True)
    return Response(serializer.data)



@api_view(["GET"])
def get_categories(request):
    categories = Category.objects.all()
    serializer = CategorySerializer(categories, many=True)
    return Response(serializer.data)