import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from api.business.models import Business
from api.user.models import Booking
from api.chat.models import Conversation

class MyWebSocketConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.id = self.scope['url_route']['kwargs']['id']
        await self.channel_layer.group_add(
            f'group_{self.id}',
            self.channel_name
        )
        await self.accept()
        await self.send(text_data=json.dumps({
            'message': 'WebSocket connection established'
        }))

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            f'group_{self.id}',
            self.channel_name
        )
        
        await self.close()
        
class UserBusinessBookingsConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.id = self.scope['url_route']['kwargs']['user_id']
        self.group_name = f'user_business_bookings_{self.id}'

        user = self.scope.get('user')
        if not user or not user.is_authenticated or str(user.id) != str(self.id):
            await self.close(code=4003)
            return

        await self.channel_layer.group_add(self.group_name, self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.group_name, self.channel_name)

    async def booking_create(self, event):
        await self.send(text_data=json.dumps({
            "type": "created",
            "data": event["data"]
        }))
    async def booking_cancelled(self, event):
        await self.send(text_data=json.dumps({
            "type": "updated",
            "data": event["data"]
        }))



class UserBookingsConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.id = self.scope['url_route']['kwargs']['user_id']
        self.group_name = f'user_bookings_{self.id}'

        user = self.scope.get('user')
        if not user or not user.is_authenticated or str(user.id) != str(self.id):
            await self.close(code=4003)
            return

        await self.channel_layer.group_add(self.group_name, self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.group_name, self.channel_name)

    async def booking_update(self, event):
        await self.send(text_data=json.dumps({
            "type": "updated",
            "data": event["data"]
        }))


class BusinessReviewsConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.id = self.scope['url_route']['kwargs']['business_id']
        self.group_name = f'business_reviews_{self.id}'

        user = self.scope.get('user')
        if not user or not user.is_authenticated:
            await self.close(code=4003)
            return

        self.is_owner = await self.is_business_owner()
        if not self.is_owner:
            is_customer = await self.is_business_customer()
            if not is_customer:
                await self.close(code=4003)
                return

        await self.channel_layer.group_add(self.group_name, self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.group_name, self.channel_name)

    async def review_update(self, event):
        await self.send(text_data=json.dumps({
            "type": "updated",
            "data": event["data"]
        }))

    async def review_create(self, event):
        await self.send(text_data=json.dumps({
            "type": "created",
            "data": event["data"]
        }))

    async def review_delete(self, event):
        await self.send(text_data=json.dumps({
            "type": "deleted",
            "data": event["data"]
        }))

    @database_sync_to_async
    def is_business_owner(self):
        return Business.objects.filter(
            id=self.id,
            owner=self.scope['user']
        ).exists()

    @database_sync_to_async
    def is_business_customer(self):
        return Booking.objects.filter(
            business_id=self.id,
            user=self.scope['user']
        ).exists()


class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.id = self.scope['url_route']['kwargs']['conversation_id']
        self.group_name = f'conversation_{self.id}'

        user = self.scope.get('user')
        if not user or not user.is_authenticated:
            await self.close(code=4003)
            return

        if not await self.is_participant():
            await self.close(code=4003)
            return

        await self.channel_layer.group_add(self.group_name, self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.group_name, self.channel_name)

    async def new_message(self, event):
        await self.send(text_data=json.dumps({
            "type": "created",
            "data": event['data']
        }))

    async def update_message(self, event):
        await self.send(text_data=json.dumps({
            "type": "updated",
            "data": event['data']
        }))

    async def delete_message(self, event):
        await self.send(text_data=json.dumps({
            "type": "deleted",
            "data": event['data']
        }))
        
    async def read_message(self, event):
        await self.send(text_data=json.dumps({
            "type": "read",
            "data": event['data']
        }))

    @database_sync_to_async
    def is_participant(self):
        return Conversation.objects.filter(
            id=self.id,
            participants=self.scope['user']
        ).exists()


class ConversationConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.id = self.scope['url_route']['kwargs']['user_id']
        self.group_name = f'user_{self.id}_conversation'

        user = self.scope.get('user')
        if not user or not user.is_authenticated or str(user.id) != str(self.id):
            await self.close(code=4003)
            return

        await self.channel_layer.group_add(self.group_name, self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.group_name, self.channel_name)

    async def new__conversation(self, event):
        conversation_id = event['data'].get('id')
        if not await self.is_participant(conversation_id):
            return
        await self.send(text_data=json.dumps({
            "type": "created",
            "data": event['data']
        }))

    async def delete__conversation(self, event):
        conversation_id = event['data'].get('id')
        if not await self.is_participant(conversation_id):
            return
        await self.send(text_data=json.dumps({
            "type": "deleted",
            "data": event['data']
        }))

    @database_sync_to_async
    def is_participant(self, conversation_id):
        if not conversation_id:
            return False
        return Conversation.objects.filter(
            id=conversation_id,
            participants__id=self.id
        ).exists()


    