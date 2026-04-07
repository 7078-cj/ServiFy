from rest_framework import serializers
from django.contrib.auth.models import User

from .models import Profile, Location, Booking

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
    service_name = serializers.CharField(source='service.name', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)

    class Meta:
        model = Booking
        fields = [
            'id',
            'user',
            'service_name',
            'business_name',
            'latitude',
            'longitude',
            'address',
            'date',
            'status',
            'status_display',
            'created_at',
        ]
        read_only_fields = ['id', 'user', 'status', 'created_at','service', 'service_name', 'status_display']
