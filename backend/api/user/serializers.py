from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Profile

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
        model = Profile
        fields = [
            "name",
            "longitude",
            "latitude"
        ]
    


class UserSerializer(serializers.ModelSerializer):
    profile = ProfileSerializer(read_only=True)
    
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password', "profile")
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            
        )
        return user
    
class UserProfileSerializer(serializers.ModelSerializer):
    saved_locations = LocationSerializer(read_only=True)
    profile = ProfileSerializer(read_only=True)
    
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password', "profile", "location")
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            
        )
        return user
    
    
