from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth.models import User

from .serializers import BookingSerializer, NotificationSerializer
from .models import Profile, Booking, Notification
from .utils import broadcast_notification
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer

channel_layer = get_channel_layer()



    

@receiver(post_save, sender=User)
def create_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance)


@receiver(post_save, sender=Booking)
def booking_updated(sender, instance, created, **kwargs):
    instance = Booking.objects.select_related(
        "user", "service", "service__business", "service__business__owner"
    ).get(pk=instance.pk)

    serializer = BookingSerializer(instance)
    data = serializer.data
    data["created"] = created

    async_to_sync(channel_layer.group_send)(
        f"user_bookings_{instance.user.id}",
        {
            "type": "booking_update",
            "data": data
        }
    )
    
    status_messages = {
        "pending": "Your booking request has been sent and is waiting for approval.",
        "confirmed": "Your booking has been confirmed.",
        "completed": "Your booking has been completed successfully.",
        "cancelled": "Your booking has been cancelled.",
        "rejected": "Your booking request was rejected by the business.",
    }

    body_message = status_messages.get(
        instance.status,
        f"Your booking status has been updated to {instance.status}."
    )
    if instance.status != "cancelled":
        broadcast_notification( instance.user,
                                "booking", 
                                f"Booking {instance.status.capitalize()}", 
                                body_message)



    if created:
        owner_id = instance.service.business.owner.id

        async_to_sync(channel_layer.group_send)(
            f"user_business_bookings_{owner_id}",
            {
                "type": "booking_create",
                "data": data
            }
        )
        
        full_name = f"{instance.user.first_name} {instance.user.last_name}".strip() or instance.user.username

        body_message = (
            f"New booking: {full_name} • {instance.service.name} "
        )

        
        broadcast_notification( instance.service.business.owner,
                                "booking", 
                                f"{instance.user.first_name} {instance.user.last_name} booked {instance.service.name}",
                                body_message)        

    elif instance.status == "cancelled":
        owner_id = instance.service.business.owner.id
        async_to_sync(channel_layer.group_send)(
            f"user_business_bookings_{owner_id}",
            {
                "type": "booking_cancelled",
                "data": data
            }
        )
        broadcast_notification( instance.user,
                        "booking", 
                        f"Booking {instance.status.capitalize()}", 
                        "Your booking has been cancelled.")