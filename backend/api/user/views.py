from django.shortcuts import render
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.response import Response
from rest_framework.decorators import api_view, throttle_classes, permission_classes
from .serializers import UserSerializer, ProfileSerializer, UserProfileSerializer, BookingSerializer
import os
from django.conf import settings
from rest_framework.throttling import AnonRateThrottle
from django.contrib.auth.models import User
from ..rate_limit.TestThrottle import TestThrottle
from rest_framework import status
from .utils import generate_pin, send_reset_email_async
from django.core.cache import cache
from rest_framework.generics import ListAPIView, ListCreateAPIView, RetrieveUpdateDestroyAPIView, RetrieveUpdateAPIView
from .models import Location, Booking
from ..business.models import Service
from .serializers import LocationSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework import viewsets, permissions
from ..business.utils import get_service
from rest_framework import viewsets, permissions
from rest_framework.exceptions import PermissionDenied


class IsBookingOwner(permissions.BasePermission):
    """Allow read to booking user, write only to the business owner."""

    def has_object_permission(self, request, view, obj):
        # Booking user can read and delete (cancel) their own booking
        if request.method in permissions.SAFE_METHODS or request.method == 'DELETE':
            return obj.user == request.user
        
        # Only the business owner can update (approve/reject/complete)
        return obj.service.business.owner == request.user
    
    
# Create your views here.
class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        
        token['username'] = user.username
        token['role'] = user.profile.role
        token['phone'] = user.profile.phone
        token['profile_image'] = (
            user.profile.profile_image.url if user.profile.profile_image else None
        )
        
        return token
    
class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer


@api_view(['POST'])
def registerUser(request):

    serializer = UserSerializer(data=request.data)

    if serializer.is_valid():
        serializer.save()
        return Response(
            {"message": "User registered successfully"},
            status=status.HTTP_201_CREATED
        )

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


RESET_CODE_TIMEOUT = 300 


@api_view(["POST"])
def request_password_reset(request):

    email = request.data.get("email")

    try:
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        return Response({"error": "User not found"}, status=404)

    code = generate_pin()

    cache.set(
        f"reset_code_{email}",
        code,
        timeout=RESET_CODE_TIMEOUT
    )

    send_reset_email_async(user, code)

    return Response({"message": "Reset code sent"})

@api_view(["POST"])
def verify_reset_code(request):

    email = request.data.get("email")
    code = request.data.get("code")

    stored_code = cache.get(f"reset_code_{email}")

    if stored_code is None:
        return Response(
            {"error": "Code expired or not requested"},
            status=status.HTTP_400_BAD_REQUEST
        )

    if stored_code != code:
        return Response(
            {"error": "Invalid code"},
            status=status.HTTP_400_BAD_REQUEST
        )

    return Response({"message": "Code verified", 'is_permitted': True})

@api_view(["POST"])
def reset_password(request):

    email = request.data.get("email")
    code = request.data.get("code")
    new_password = request.data.get("password")

    stored_code = cache.get(f"reset_code_{email}")

    if stored_code is None:
        return Response(
            {"error": "Code expired"},
            status=status.HTTP_400_BAD_REQUEST
        )

    if stored_code != code:
        return Response(
            {"error": "Invalid code"},
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        return Response(
            {"error": "User not found"},
            status=status.HTTP_404_NOT_FOUND
        )

    user.set_password(new_password)
    user.save()

    cache.delete(f"reset_code_{email}")

    return Response({"message": "Password updated"})

@api_view(["POST"])
def resend_reset_code(request):

    email = request.data.get("email")

    try:
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        return Response(
            {"error": "User not found"},
            status=status.HTTP_404_NOT_FOUND
        )

    code = generate_pin()

    cache.set(
        f"reset_code_{email}",
        code,
        timeout=RESET_CODE_TIMEOUT
    )

    send_reset_email_async(user, code)

    return Response({"message": "New reset code sent"})

class LocationListCreateView(ListCreateAPIView):
    serializer_class = LocationSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Location.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):

        serializer.save(user=self.request.user)
        
class LocationDetailView(RetrieveUpdateDestroyAPIView):
    serializer_class = LocationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):

        return Location.objects.filter(user=self.request.user)

    def perform_update(self, serializer):

        serializer.save(user=self.request.user)
        
        




@api_view(['GET'])
@throttle_classes([TestThrottle])
def test(request):
    
    return Response('Hello')

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def profile(request):
    user = request.user
    serializer = UserProfileSerializer(user, many=False)
    
    return Response(serializer.data)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def updateProfile(request):
    user = request.user
    profile = request.user.profile
    profile_serializer = ProfileSerializer(instance=profile,data=request.data,partial=True)
    user_serializer = UserSerializer(instance=user,data=request.data,partial=True)
    
    if profile_serializer.is_valid() and user_serializer.is_valid():
        profile_serializer.save()
        user_serializer.save()
        return Response(user_serializer.data)
    
    else:
        return Response(profile_serializer.errors | user_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class BookingListCreateView(ListCreateAPIView):
    serializer_class = BookingSerializer
    permission_classes = [IsAuthenticated]

    def get_service(self):
        service_id = self.kwargs.get("service_id")
        try:
            return Service.objects.get(id=service_id)
        except Service.DoesNotExist:
            raise PermissionDenied("Service not found")

    def get_queryset(self):
        return (
            Booking.objects
            .filter(
                user=self.request.user,
            )
            .select_related('user', 'service', 'service__business')
            .order_by('-created_at')
        )

    def perform_create(self, serializer):
        serializer.save(
            user=self.request.user,
            service=self.get_service()
        )


class BookingDetailView(RetrieveUpdateDestroyAPIView):
    serializer_class = BookingSerializer
    permission_classes = [IsAuthenticated, IsBookingOwner]

    def get_queryset(self):
        return (
            Booking.objects
            .filter(service__business__owner=self.request.user)
            .select_related('user', 'service', 'service__business')
        )
    
    def perform_update(self, serializer):
        booking = self.get_object()
        new_status = self.request.data.get("status")

        if new_status not in ["approved", "rejected", "completed"]:
            raise PermissionDenied("Invalid status update")

        if booking.service.business.owner != self.request.user:
            raise PermissionDenied("Only the business owner can update the booking status")

        serializer.save(status=new_status, partial=True)
        
class BookingCancelView(RetrieveUpdateAPIView):
    serializer_class = BookingSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return (
            Booking.objects
            .filter(user=self.request.user)        
            .select_related('user', 'service', 'service__business')
        )

    def perform_update(self, serializer):
        booking = self.get_object()

        if booking.status != "pending":
            raise PermissionDenied("Only pending bookings can be cancelled.")

        if booking.user != self.request.user:
            raise PermissionDenied("You can only cancel your own bookings.")

        serializer.save(status="cancelled", partial=True)
        
        
class AllBusinessBookingListView(ListAPIView):
    serializer_class = BookingSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return (
            Booking.objects
            .filter(service__business__owner=self.request.user)
            .select_related('user', 'service', 'service__business')
            .order_by('-created_at')
        )

class BusinessBookingListView(ListAPIView):
    serializer_class = BookingSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        business_id = self.kwargs.get("business_id")

        return (
            Booking.objects
            .filter(
                service__business_id=business_id,
                service__business__owner=self.request.user
            )
            .select_related('user', 'service', 'service__business')
            .order_by('-created_at')
        )
        
class UserBookingListView(ListAPIView):
    serializer_class = BookingSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return (
            Booking.objects
            .filter(user=self.request.user)
            .select_related('user', 'service', 'service__business')
            .order_by('-created_at')
        )
