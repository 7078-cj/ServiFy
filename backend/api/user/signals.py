from django.db.models.signals import post_save, pre_save
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


@receiver(pre_save, sender=Booking)
def cache_old_booking(sender, instance, **kwargs):
    if instance.pk:
        try:
            old = Booking.objects.get(pk=instance.pk)
            instance._old_status = old.status
            instance._old_date = old.date
        except Booking.DoesNotExist:
            instance._old_status = None
            instance._old_date = None


@receiver(post_save, sender=Booking)
def booking_updated(sender, instance, created, **kwargs):
    instance = Booking.objects.select_related(
        "user",
        "service",
        "service__business",
        "service__business__owner"
    ).get(pk=instance.pk)

    serializer = BookingSerializer(instance)
    data = serializer.data
    data["created"] = created

    user_group = f"user_bookings_{instance.user.id}"
    owner_group = f"user_business_bookings_{instance.service.business.owner.id}"

    async_to_sync(channel_layer.group_send)(
        user_group,
        {
            "type": "booking_update",
            "data": data
        }
    )

    if created:
        async_to_sync(channel_layer.group_send)(
            owner_group,
            {
                "type": "booking_create",
                "data": data
            }
        )

        full_name = f"{instance.user.first_name} {instance.user.last_name}".strip() or instance.user.username

        broadcast_notification(
            instance.service.business.owner,
            "booking",
            f"{full_name} booked {instance.service.name}",
            f"New booking request for {instance.service.name}"
        )
        return

    old_status = getattr(instance, "_old_status", None)
    old_date = getattr(instance, "_old_date", None)

    status_changed = old_status != instance.status
    date_changed = old_date != instance.date

    status_messages = {
        "pending": "Your booking request is waiting for approval.",
        "approved": "Your booking has been approved.",
        "completed": "Your booking has been completed.",
        "cancelled": "Your booking has been cancelled.",
        "rejected": "Your booking was rejected."
    }

    if status_changed:
        body_message = status_messages.get(
            instance.status,
            f"Your booking status is now {instance.status}."
        )

        broadcast_notification(
            instance.user,
            "booking",
            f"Booking {instance.status.capitalize()}",
            body_message
        )

        async_to_sync(channel_layer.group_send)(
            owner_group,
            {
                "type": f"booking_{instance.status}",
                "data": data
            }
        )

    if date_changed:
        broadcast_notification(
            instance.user,
            "booking",
            "Booking Rescheduled",
            f"Your booking has been moved to {instance.date}"
        )