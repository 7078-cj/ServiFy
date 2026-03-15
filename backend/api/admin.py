from django.contrib import admin
from .business.models import Business, Portofolio, Review


# Register your models here.
admin.site.register(Business)
admin.site.register(Portofolio)
admin.site.register(Review)