from django.db import models
from django.contrib.auth.models import User
from ..business.models import Service


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
    address = models.CharField(max_length=200, blank=True, null=True)
    latitude = models.DecimalField(max_digits=9, decimal_places=6, blank=True, null=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, blank=True, null=True)

    def __str__(self):
        return self.user.username
    
class Location(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="saved_location",)
    name = models.CharField(max_length=200)
    address = models.CharField(max_length=200)
    latitude = models.DecimalField(max_digits=9, decimal_places=6)
    longitude = models.DecimalField(max_digits=9, decimal_places=6)
    
    def __str__(self):
        return self.name
    
class Booking(models.Model):
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
        ('cancelled', 'Cancelled'),
        ('completed', 'Completed'),
    )
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="bookings")
    service = models.ForeignKey(Service, on_delete=models.CASCADE, related_name="bookings")
    date = models.DateTimeField()
    address = models.CharField(max_length=200, blank=True, null=True)
    latitude = models.DecimalField(max_digits=9, decimal_places=6, default=0.0)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, default=0.0)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="pending")
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.service} by {self.service.business.name} for {self.user.username}"
    
class Notification(models.Model):
    TYPE_CHOICES = [
        ("booking", "Booking"),
        ("message", "Message"),
        ("reminder", "Reminder"),
        ("chat", "Chat"),
        ("business", "Business"),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="notifications")
    type = models.CharField(max_length=50, choices=TYPE_CHOICES, default="system")
    title = models.CharField(max_length=255)
    body = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    unread = models.BooleanField(default=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"[{self.type}] {self.title} → {self.user.username}"
    
        
    
    