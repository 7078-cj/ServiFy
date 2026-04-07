from django.db.models.signals import post_delete, pre_save
from django.dispatch import receiver
from api.models import Portfolio, Service
from .utils import _remove_file  # or wherever you placed it


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