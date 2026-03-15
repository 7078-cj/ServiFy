from rest_framework import serializers
from ..user.serializers import UserSerializer
from .models import Portofolio, Review, Business

class PortofolioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Portofolio
        fields = ['id', 'photo']
        
    def get_photo(self, obj):
        if obj.photo:
            return obj.photo   
        return None


class PortofolioBulkSerializer(serializers.ListSerializer):

    def create(self, validated_data):
        business = self.context.get('business')

        portfolios = [
            Portofolio(
                business=business,
                photo=item["photo"]
            )
            for item in validated_data
        ]

        return Portofolio.objects.bulk_create(portfolios)


class PortofolioUploadSerializer(serializers.ModelSerializer):

    class Meta:
        model = Portofolio
        fields = ['photo']
        list_serializer_class = PortofolioBulkSerializer

# Review serializer
class ReviewSerializer(serializers.ModelSerializer):
    author = UserSerializer(read_only=True) 

    class Meta:
        model = Review
        fields = ['id', 'author', 'message', 'rate', 'created_at']

# Business serializer
class BusinessSerializer(serializers.ModelSerializer):
    owner = UserSerializer(read_only=True)
    reviews = ReviewSerializer(many=True, read_only=True)
    portfolio = PortofolioSerializer(many=True, read_only=True)

    class Meta:
        model = Business
        fields = [
            'id', 'owner', 'name', 'description',
            'address', 'latitude', 'longitude',
            'reviews', 'portfolio'
        ]