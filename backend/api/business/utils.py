from .models import Business
from rest_framework.exceptions import ValidationError

def get_business(self):
    business_id = self.request.data.get('business_id')
    if not business_id:
        raise ValidationError({'business_id': 'This field is required.'})
    
    try:
        business = Business.objects.get(id=business_id)
    except Business.DoesNotExist:
        raise ValidationError({'business_id': 'Business not found.'})
    
    return business