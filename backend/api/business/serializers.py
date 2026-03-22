from rest_framework import serializers
from ..user.serializers import UserSerializer
from .models import Portfolio, Review, Business, Service
from django.db.models import Avg


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

    class Meta:
        model = Service
        fields = ['id', 'name', 'description', 'thumbnail', 'price']


class BusinessSerializer(serializers.ModelSerializer):
    owner = UserSerializer(read_only=True)
    reviews = ReviewSerializer(many=True, read_only=True)
    portfolio = PortfolioSerializer(many=True, read_only=True)
    services = ServiceSerializer(many=True, read_only=True)
    average_rating = serializers.SerializerMethodField()
    average_price = serializers.SerializerMethodField()

    class Meta:
        model = Business
        fields = [
            'id', 'owner', 'logo','name', 'description',
            'address', 'latitude', 'longitude',
            'reviews', 'portfolio', 'services',
            'average_rating', 'average_price'
        ]

    def get_average_rating(self, obj):
        result = obj.review.aggregate(avg=Avg('rate'))
        avg = result['avg']
        return round(avg, 1) if avg is not None else None

    def get_average_price(self, obj):
        result = obj.services.aggregate(avg=Avg('price'))
        avg = result['avg']
        return round(avg, 2) if avg is not None else None