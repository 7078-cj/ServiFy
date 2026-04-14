from rest_framework import serializers
from django.contrib.auth.models import User

from .models import Profile, Location, Booking, Notification

class ProfileSerializer(serializers.ModelSerializer):

    class Meta:
        model = Profile
        fields = [
            "role",
            "phone",
            "profile_image",
            "address",
            "longitude",
            "latitude"
        ]
        
class LocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Location
        fields = [
            "name",
            "address",
            "longitude",
            "latitude"
        ]
    


class UserSerializer(serializers.ModelSerializer):
    profile = ProfileSerializer(read_only=True)
    
    class Meta:
        model = User
        fields = ('id', 'username','first_name', 'last_name', 'email', 'password', "profile")
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name']
        )
        return user
    
class UserProfileSerializer(serializers.ModelSerializer):
    saved_location = LocationSerializer(many=True, read_only=True)
    profile = ProfileSerializer(read_only=True)
    
    class Meta:
        model = User
        fields = ('id', 'username', 'first_name', 'last_name', 'email', 'password', "profile", "saved_location")
        extra_kwargs = {'password': {'write_only': True}}
    

class BookingSerializer(serializers.ModelSerializer):
    user = UserProfileSerializer(read_only=True)
    business_name = serializers.CharField(source='service.business.name', read_only=True)
    business_logo = serializers.CharField(source='service.business.logo', read_only=True)
    business_latitude = serializers.DecimalField(source='service.business.latitude', max_digits=9, decimal_places=6, read_only=True)
    business_longitude = serializers.DecimalField(source='service.business.longitude', max_digits=9, decimal_places=6, read_only=True)
    service_name = serializers.CharField(source='service.name', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)

    class Meta:
        model = Booking
        fields = [
            'id',
            'user',
            'service_name',
            'business_name',
            'business_logo',
            'business_latitude',
            'business_longitude',
            'latitude',
            'longitude',
            'address',
            'date',
            'status',
            'status_display',
            'created_at',
        ]
        read_only_fields = ['id', 'user', 'status', 'created_at', 'service', 'service_name', 'status_display']
        
class NotificationSerializer(serializers.ModelSerializer):
    time_label = serializers.SerializerMethodField()

    class Meta:
        model = Notification
        fields = ["id", "type", "title", "body", "time_label", "unread", "created_at"]
        read_only_fields = ["id", "created_at"]

    def get_time_label(self, obj):
        from django.utils import timezone
        from datetime import timedelta

        now = timezone.now()
        diff = now - obj.created_at

        if diff < timedelta(minutes=1):
            return "Just now"
        elif diff < timedelta(hours=1):
            minutes = diff.seconds // 60
            return f"{minutes} min ago"
        elif diff < timedelta(days=1):
            hours = diff.seconds // 3600
            return f"{hours} hour{'s' if hours > 1 else ''} ago"
        elif diff < timedelta(days=7):
            days = diff.days
            return f"{days} day{'s' if days > 1 else ''} ago"
        else:
            return obj.created_at.strftime("%b %d, %Y")
