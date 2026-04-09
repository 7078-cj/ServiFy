from django.contrib.auth.models import User
from rest_framework.exceptions import NotFound, ValidationError

from .models import Conversation

def get_participant(view):
    # Try URL first, fallback to request.data
    participant_pk = (
        view.kwargs.get("participant_pk") or
        view.request.data.get("participant_id")
    )

    if not participant_pk:
        raise NotFound("Participant not provided.")

    if str(view.request.user.id) == str(participant_pk):
        raise ValidationError("You cannot start a conversation with yourself.")

    try:
        return User.objects.get(pk=participant_pk)
    except User.DoesNotExist:
        raise NotFound("Participant not found.")
    
def get_conversation(view):
    conversation_id = view.kwargs.get("conversation_id")
    if not conversation_id:
        raise NotFound("Conversation ID not provided.")

    try:
        return Conversation.objects.get(pk=conversation_id)
    except Conversation.DoesNotExist:
        raise NotFound("Conversation not found.")