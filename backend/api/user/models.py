from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone
from datetime import timedelta

# class Test(models.Model):
#     name = models.CharField(max_length=30, unique=True)
#     description = models.TextField(default="set a description")
#     created_at = models.DateTimeField(auto_now_add=True)

#     def __str__(self):
#         return self.name

class Profile(models.Model):

    ROLE_CHOICES = (
        ('admin', 'Admin'),
        ('provider', 'Service Provider'),
        ('customer', 'Customer'),
    )

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="profile",)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='customer')
    phone = models.CharField(max_length=15, blank=True, null=True)
    profile_image = models.ImageField(upload_to="profiles/", blank=True, null=True)

    def __str__(self):
        return self.user.username
    
class Location(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="saved_location",)
    name = models.CharField(max_length=200)
    latitude = models.DecimalField(max_digits=9, decimal_places=6, blank=True, null=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, blank=True, null=True)
    
    def __str__(self):
        return self.name
    