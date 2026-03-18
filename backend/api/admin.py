from django.contrib import admin
from .business.models import Business, Portfolio, Review


# Register your models here.
admin.site.register(Business)
admin.site.register(Portfolio)
admin.site.register(Review)