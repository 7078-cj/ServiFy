from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth.models import User

from .serializers import BookingSerializer
from .models import Profile, Booking
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

    if created:
        owner_id = instance.service.business.owner.id
        async_to_sync(channel_layer.group_send)(
            f"user_business_bookings_{owner_id}",
            {
                "type": "booking_create",
                "data": data
            }
        )

    elif instance.status == "cancelled":
        owner_id = instance.service.business.owner.id
        async_to_sync(channel_layer.group_send)(
            f"user_business_bookings_{owner_id}",
            {
                "type": "booking_cancelled",
                "data": data
            }
        )