from django.core.cache import cache
from rest_framework.decorators import api_view, throttle_classes
from rest_framework import viewsets, permissions
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response
from .serializers import ConversationSerializer, MessageSerializer
from .models import Conversation, Message
from .utils import get_participant, get_conversation
    

from rest_framework.generics import ListCreateAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import ValidationError
from django.db.models import Prefetch

from django.contrib.auth.models import User
from .models import Conversation, Message
from .serializers import ConversationSerializer
from .utils import get_participant
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response

class IsSenderOrReadOnly(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return obj.sender == request.user


class ConversationListCreateView(ListCreateAPIView):
    serializer_class = ConversationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return (
            Conversation.objects
            .filter(participants=self.request.user)
            .prefetch_related("participants", "messages__sender")
            .order_by("-updated_at")
        )

    def get_participant(self):
        return get_participant(self)

    def perform_create(self, serializer):
        user = self.request.user
        other_user = self.get_participant()

        existing = (
            Conversation.objects
            .filter(participants=user)
            .filter(participants=other_user)
            .first()
        )

        if existing:
            raise ValidationError({
                "detail": "Conversation already exists.",
                "conversation_id": existing.id
            })

        conversation = serializer.save()
        conversation.participants.set([user, other_user])

@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
def delete_conversation(request, conversation_id):
    try:
        conversation = Conversation.objects.get(id=conversation_id)
    except Conversation.DoesNotExist:
        return Response({"detail": "Conversation not found."}, status=404)

    if request.user not in conversation.participants.all():
        return Response({"detail": "Not authorized to delete this conversation."}, status=403)

    conversation.delete()
    return Response({"detail": "Conversation deleted."}, status=204)

class MessageListCreateView(ListCreateAPIView):
    serializer_class = MessageSerializer
    permission_classes = [IsAuthenticated, IsSenderOrReadOnly]
    
    def get_conversation(self):
        return get_conversation(self)

    def get_queryset(self):
        conversation_id = self.kwargs["conversation_id"]
        return (
            Message.objects
            .filter(conversation_id=conversation_id)
            .select_related("sender")
            .order_by("created_at")
        )

    def perform_create(self, serializer):
        conversation_id = self.kwargs["conversation_id"]
        conversation = Conversation.objects.filter(id=conversation_id, participants=self.request.user).first()

        if not conversation:
            raise ValidationError("Conversation not found or you are not a participant.")

        serializer.save(sender=self.request.user, conversation=conversation)

class MessageDetailView(RetrieveUpdateDestroyAPIView):
    serializer_class = MessageSerializer
    permission_classes = [IsAuthenticated, IsSenderOrReadOnly]

    def get_queryset(self):
        conversation_id = self.kwargs["conversation_id"]
        return Message.objects.filter(conversation_id=conversation_id, sender=self.request.user)
    