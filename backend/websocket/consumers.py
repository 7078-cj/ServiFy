import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async

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

        await self.channel_layer.group_add(self.group_name, self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.group_name, self.channel_name)

    async def booking_create(self, event):
        await self.send(text_data=json.dumps({
            "type": "created",
            "data": event["data"]
        }))

class UserBookingsConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.id = self.scope['url_route']['kwargs']['user_id']
        self.group_name = f'user_bookings_{self.id}'

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
        
class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.id = self.scope['url_route']['kwargs']['conversation_id']
        self.group_name = f'conversation_{self.id}'

        await self.channel_layer.group_add(self.group_name, self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.group_name, self.channel_name)
        
    async def new_message(self, event):
        await self.send(text_data=json.dumps({
            "type": "created",
            "data":event['data']
        }))
    
    async def update_message(self, event):
        await self.send(text_data=json.dumps({
            "type": "updated",
            "data":event['data']
        }))
        
    async def delete_message(self, event):
        await self.send(text_data=json.dumps({
            "type": "delete_message",
            "data":event['data']
        }))



    