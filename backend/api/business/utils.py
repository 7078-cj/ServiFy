from .models import Business
from rest_framework.exceptions import NotFound

def get_business(view):
    business_pk = view.kwargs.get('business_pk')

    if not business_pk:
        raise NotFound('Business not found.')

    try:
        return Business.objects.get(pk=business_pk)
    except Business.DoesNotExist:
        raise NotFound('Business not found.')