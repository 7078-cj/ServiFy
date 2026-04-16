import random
import threading
from django.conf import settings
from django.core.mail import send_mail
from .models import Notification
from .serializers import NotificationSerializer
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer

channel_layer = get_channel_layer()

def generate_pin():
    return str(random.randint(1000, 9999))

def send_reset_email(user, code):
    send_mail(
        "Password Reset Code",
        f"Your password reset code is: {code}",
        settings.DEFAULT_FROM_EMAIL,
        [user.email],
    )

def send_reset_email_async(user, code):
    thread = threading.Thread(target=send_reset_email, args=(user, code))
    thread.daemon = True
    thread.start()
    
def broadcast_notification(user,type, title, body_message):

    notif = Notification.objects.create(
        user=user,
        type=type,
        title=title,
        body=body_message
    )

    data = NotificationSerializer(notif).data

    async_to_sync(channel_layer.group_send)(
        f"user_{notif.user.id}_notifications",
        {
            "type": "new__notification",
            "data": data
        }
    )