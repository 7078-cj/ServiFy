from .models import Business, Service
from rest_framework.exceptions import NotFound
import os

def get_business(view):
    business_pk = view.kwargs.get('business_pk')

    if not business_pk:
        raise NotFound('Business not found.')

    try:
        return Business.objects.get(pk=business_pk)
    except Business.DoesNotExist:
        raise NotFound('Business not found.')
    
def get_service(view):
    service_pk = view.kwargs.get('service_pk')

    if not service_pk:
        raise NotFound('Service not found.')

    try:
        return Service.objects.get(pk=service_pk)
    except Service.DoesNotExist:
        raise NotFound('Service not found.')
    


def _remove_file(field):
    if not field:
        return

    try:
        if field.name and hasattr(field, "path"):
            if os.path.isfile(field.path):
                os.remove(field.path)
    except Exception:
        pass