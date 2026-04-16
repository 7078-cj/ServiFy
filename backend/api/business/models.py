from django.db import models
from ..user.models import User
from django.core.validators import MinValueValidator, MaxValueValidator





class Business(models.Model):
    owner = models.ForeignKey(User, related_name='businesses', on_delete=models.CASCADE)
    logo = models.ImageField(upload_to="logo/", blank=True, null=True)
    name = models.CharField(max_length=200)
    description = models.CharField(max_length=1000)

    
    address = models.CharField(max_length=500, blank=True, null=True)
    latitude = models.DecimalField(max_digits=9, decimal_places=6, blank=True, null=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, blank=True, null=True)
    
    
    def __str__(self):
        return self.name
    

class Portfolio(models.Model):
    business = models.ForeignKey(Business, related_name='portfolio', blank=True, on_delete=models.CASCADE)
    photo = models.ImageField(upload_to="portfolios/", blank=True, null=True)
    
    def __str__(self):
        return self.photo.name if self.photo else "No Photo"
    
class Review(models.Model):
    business = models.ForeignKey(Business, related_name='review', blank=True, on_delete=models.CASCADE)
    author = models.ForeignKey(User, related_name='reviews', on_delete=models.CASCADE)
    message = models.CharField(max_length=500)
    rate = models.IntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)]
    )
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ["-created_at"]
        
    def __str__(self):
        return self.message
    
    
class Service(models.Model):
    business = models.ForeignKey(Business, related_name='services', on_delete=models.CASCADE)
    thumbnail = models.ImageField(upload_to="services/", blank=True, null=True)
    name = models.CharField(max_length=200)
    description = models.CharField(max_length=1000)
    price = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return self.name
    
    