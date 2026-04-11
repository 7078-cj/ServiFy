from django.db.models.signals import post_delete, pre_save, post_save, pre_delete
from django.dispatch import receiver
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer

from .models import Conversation, Message
from ..business.utils import _remove_file
from .serializers import MessageSerializer, ConversationSerializer

@receiver(post_save, sender=Conversation)
def conversation_created(sender, instance, created, **kwargs):
    data = ConversationSerializer(instance).data
    channel_layer = get_channel_layer()

    participants = instance.participants.all()

    for user in participants:
        async_to_sync(channel_layer.group_send)(
            f"user_{user.id}_conversation",
            {
                "type": "new_conversation",
                "data": data,
            }
        )
        
@receiver(pre_delete, sender=Conversation)
def clean_message_images(sender, instance, **kwargs):
    for message in instance.messages.all():
        _remove_file(message.image)

@receiver(post_delete, sender=Conversation)
def conversation_deleted(sender, instance, **kwargs):
    data = {"id": instance.id}
    channel_layer = get_channel_layer()

    participants = instance.participants.all()

    for user in participants:
        async_to_sync(channel_layer.group_send)(
            f"user_{user.id}_conversation",
            {
                "type": "delete_conversation",
                "data": data,
            }
        )

@receiver(post_save, sender=Message)
def message_created(sender, instance, created, **kwargs):
    instance = Message.objects.select_related("sender", "conversation").get(pk=instance.pk)
    data = MessageSerializer(instance).data
    if created:
        channel_layer = get_channel_layer()
        conversation_id = instance.conversation.id
        async_to_sync(channel_layer.group_send)(
            f"conversation_{conversation_id}",
            {
                "type": "new_message",
                "data": data
            }
        )
    else:
        channel_layer = get_channel_layer()
        conversation_id = instance.conversation.id
        async_to_sync(channel_layer.group_send)(
            f"conversation_{conversation_id}",
            {
                "type": "update_message",
                "data": data
            }
        )

@receiver(post_delete, sender=Message)
def message_deleted(sender, instance, **kwargs):
    _remove_file(instance.image)

    channel_layer = get_channel_layer()
    conversation_id = instance.conversation.id
    async_to_sync(channel_layer.group_send)(
        f"conversation_{conversation_id}",
        {
            "type": "delete_message",
            "data": {"id": instance.id}
        }
    )