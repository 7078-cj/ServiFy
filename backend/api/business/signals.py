from django.db.models.signals import post_delete, pre_save, post_save, pre_delete
from django.dispatch import receiver
from api.models import Portfolio, Service, Review, Business
from .utils import _remove_file
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from .serializers import ReviewSerializer
from  ..user.utils import broadcast_notification

channel_layer = get_channel_layer()

@receiver(pre_delete, sender=Business)
def delete_business_related_files(sender, instance, **kwargs):
    for portfolio in instance.portfolio.all():
        _remove_file(portfolio.photo)

    for service in instance.services.all():
        _remove_file(service.thumbnail)

@receiver(post_delete, sender=Business)
def delete_portfolio_photo(sender, instance, **kwargs):
    print("🔥 delete logo fired")
    _remove_file(instance.logo)

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
        "author", "business", "business__owner"
    ).get(pk=instance.pk)

    serializer = ReviewSerializer(instance)
    data = serializer.data
    data["created"] = created

    async_to_sync(channel_layer.group_send)(
        f'business_reviews_{instance.business.id}',
        {
            "type": "review_update",
            "data": data
        }
    )

    if created:
        async_to_sync(channel_layer.group_send)(
            f'business_reviews_{instance.business.id}',
            {
                "type": "review_create",
                "data": data
            }
        )

        owner = instance.business.owner
        author_name = (
            f"{instance.author.first_name} {instance.author.last_name}".strip()
            or instance.author.username
        )

        body_message = (
            f"{author_name} rated your business {instance.business.name} "
            f"{instance.rate}⭐"
        )

        broadcast_notification( owner,
                                "business", 
                                f"New Review Received", 
                                body_message)
        
@receiver(post_delete, sender=Review)
def review_deleted(sender, instance, **kwargs):
    async_to_sync(channel_layer.group_send)(
        f'business_reviews_{instance.business.id}',
        {
            "type": "review_delete",
            "data": {"id": instance.id}
        }
    )