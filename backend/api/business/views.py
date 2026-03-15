from django.core.cache import cache
from rest_framework.decorators import api_view, throttle_classes
from rest_framework import viewsets, permissions
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
from .serializers import BusinessSerializer, PortofolioUploadSerializer, PortofolioSerializer, ReviewSerializer
from rest_framework.permissions import IsAuthenticated
from .models import Business, Portofolio, Review
from .utils import get_business
from rest_framework.exceptions import ValidationError


class IsOwnerOrReadOnly(permissions.BasePermission):
    """
    Custom permission to allow only owners to edit objects.
    For Business: owner must match request.user.
    For Portofolio: the portfolio's business owner must match request.user.
    """
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True

        # Business objects
        if hasattr(obj, 'owner'):
            return obj.owner == request.user

        # Portofolio or Review objects
        if hasattr(obj, 'business') and obj.business is not None:
            return obj.business.owner == request.user

        return False
    
class BusinessListCreateView(ListCreateAPIView):
    serializer_class = BusinessSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Business.objects.filter(owner = self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)
        
class BusinessDetailView(RetrieveUpdateDestroyAPIView):
    serializer_class = BusinessSerializer
    permission_classes = [IsAuthenticated, IsOwnerOrReadOnly]

    def get_queryset(self):
        return Business.objects.filter(owner=self.request.user)

    def perform_update(self, serializer):
        serializer.save(owner=self.request.user)

class PortofolioListCreateView(ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = PortofolioUploadSerializer
    
    def get_queryset(self):
       
        business = get_business(self)
        
        return Portofolio.objects.filter(business=business)

    def get_serializer(self, *args, **kwargs):

        business = get_business(self)

        kwargs['context'] = kwargs.get('context', {})
        kwargs['context']['business'] = business
        
        if 'photos' in self.request.data:
            kwargs['data'] = self.request.data['photos']
        
        return super().get_serializer(*args, **kwargs)

    def perform_create(self, serializer):
        serializer.save()
        
class PortofolioDetailView(RetrieveUpdateDestroyAPIView):
    serializer_class = PortofolioSerializer
    permission_classes = [IsAuthenticated, IsOwnerOrReadOnly]

    def get_queryset(self):
       
        business = get_business(self)
        
        return Portofolio.objects.filter(business=business)

    def perform_update(self, serializer):

        business = get_business(self)
        
        serializer.save(business=business)
        
class ReviewListCreateView(ListCreateAPIView):
    serializer_class = ReviewSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        business = get_business(self)
        return Review.objects.filter(business=business)
    
    def perform_create(self, serializer):
        business = get_business(self)
        serializer.save(business=business)
        
class ReviewDetailView(RetrieveUpdateDestroyAPIView):
    serializer_class = ReviewSerializer
    permission_classes = [IsAuthenticated, IsOwnerOrReadOnly]

    def get_queryset(self):
        business = get_business(self)
        return Review.objects.filter(business=business)

    def perform_update(self, serializer):
        business = get_business(self)
        serializer.save(business=business)
