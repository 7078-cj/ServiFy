from django.db.models.signals import post_delete, pre_save, post_save
from django.dispatch import receiver
from api.models import Portfolio, Service, Review
from .utils import _remove_file
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from .serializers import ReviewSerializer

channel_layer = get_channel_layer()


@receiver(post_delete, sender=Portfolio)
def delete_portfolio_photo(sender, instance, **kwargs):
    print("🔥 delete portfolio fired")
    _remove_file(instance.photo)


@receiver(post_delete, sender=Service)
def delete_service_thumbnail(sender, instance, **kwargs):
    print("🔥 delete service fired")
    _remove_file(instance.thumbnail)


@receiver(pre_save, sender=Portfolio)
def delete_old_portfolio_photo(sender, instance, **kwargs):
    if not instance.pk:
        return

    try:
        old = Portfolio.objects.get(pk=instance.pk)
    except Portfolio.DoesNotExist:
        return

    if old.photo != instance.photo:
        print("🔥 updating portfolio photo")
        _remove_file(old.photo)


@receiver(pre_save, sender=Service)
def delete_old_service_thumbnail(sender, instance, **kwargs):
    if not instance.pk:
        return

    try:
        old = Service.objects.get(pk=instance.pk)
    except Service.DoesNotExist:
        return

    if old.thumbnail != instance.thumbnail:
        print("🔥 updating service thumbnail")
        _remove_file(old.thumbnail)
        
@receiver(post_save, sender=Review)
def review_updated(sender, instance, created, **kwargs):
    instance = Review.objects.select_related(
        "author", "business"
    ).get(pk=instance.pk)

    serializer = ReviewSerializer(instance)
    data = serializer.data
    data["created"] = created

    async_to_sync(channel_layer.group_send)(
        f'business_reviews_{instance.business.id}',
        {
            "type": "updated",
            "data": data
        }
    )

    if created:
        owner_id = instance.service.business.owner.id

        async_to_sync(channel_layer.group_send)(
            f'business_reviews_{instance.business.id}',
            {
                "type": "created",
                "data": data
            }
        )
        
@receiver(post_delete, sender=Review)
def review_deleted(sender, instance, **kwargs):
    async_to_sync(channel_layer.group_send)(
        f'business_reviews_{instance.business.id}',
        {
            "type": "delete",
            "data": {"id": instance.id}
        }
    )