from rest_framework import serializers
from ..user.serializers import UserSerializer
from .models import Portfolio, Review, Business, Service
from django.db.models import Avg, Min, Max
from ..user.serializers import BookingSerializer

class PortfolioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Portfolio
        fields = ['id', 'photo']


class PortfolioBulkSerializer(serializers.ListSerializer):

    def create(self, validated_data):
        business = self.context.get('business')

        portfolios = [
            Portfolio(
                business=business,
                photo=item["photo"]
            )
            for item in validated_data
        ]

        return Portfolio.objects.bulk_create(portfolios)


class PortfolioUploadSerializer(serializers.ModelSerializer):

    class Meta:
        model = Portfolio
        fields = ['photo']
        list_serializer_class = PortfolioBulkSerializer


class ReviewSerializer(serializers.ModelSerializer):
    author = UserSerializer(read_only=True)

    class Meta:
        model = Review
        fields = ['id', 'author', 'message', 'rate', 'created_at']


class ServiceSerializer(serializers.ModelSerializer):
    bookings = BookingSerializer(many=True, read_only=True)
    class Meta:
        model = Service
        fields = ['id', 'name', 'description', 'thumbnail', 'price','bookings']


class BusinessSerializer(serializers.ModelSerializer):
    owner = UserSerializer(read_only=True)
    reviews = ReviewSerializer(many=True, read_only=True, source='review')
    portfolio = PortfolioSerializer(many=True, read_only=True)
    services = ServiceSerializer(many=True, read_only=True)
    average_rating = serializers.SerializerMethodField()
    average_price = serializers.SerializerMethodField()
    min_price = serializers.SerializerMethodField()
    max_price = serializers.SerializerMethodField()

    class Meta:
        model = Business
        fields = [
            'id', 'owner', 'logo', 'name', 'description',
            'address', 'latitude', 'longitude',
            'reviews', 'portfolio', 'services',
            'average_rating', 'average_price',
            'min_price', 'max_price',
        ]

    def get_average_rating(self, obj):
        if hasattr(obj, 'avg_rating') and obj.avg_rating is not None:
            return round(obj.avg_rating, 1)
        result = obj.review.aggregate(avg=Avg('rate'))
        return round(result['avg'], 1) if result['avg'] is not None else None

    def get_average_price(self, obj):
        result = obj.services.aggregate(avg=Avg('price'))
        avg = result['avg']
        return round(avg, 2) if avg is not None else None

    def get_min_price(self, obj):
        result = obj.services.aggregate(min=Min('price'))
        min_val = result['min']
        return round(min_val, 2) if min_val is not None else None

    def get_max_price(self, obj):
        result = obj.services.aggregate(max=Max('price'))
        max_val = result['max']
        return round(max_val, 2) if max_val is not None else None