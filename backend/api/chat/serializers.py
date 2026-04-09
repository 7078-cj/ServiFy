from rest_framework import serializers

from .models import Conversation, Message
from ..user.serializers import UserSerializer

# --- Message Serializer ---
class MessageSerializer(serializers.ModelSerializer):
    sender = UserSerializer(read_only=True)

    class Meta:
        model = Message
        fields = [
            "id",
            "conversation",
            "sender",
            "content",
            "image",
            "is_read",
            "created_at",
        ]
        read_only_fields = ["sender", "is_read", "created_at"]


# --- Conversation Serializer ---
class ConversationSerializer(serializers.ModelSerializer):
    participants = UserSerializer(many=True, read_only=True)
    messages = MessageSerializer(many=True, read_only=True)

    class Meta:
        model = Conversation
        fields = [
            "id",
            "participants",
            "messages",
            "created_at",
            "updated_at",
        ]