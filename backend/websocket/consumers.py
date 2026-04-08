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
        await self.channel_layer.group_add(
            f'user_business_bookings_{self.id}',
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

class UserBookingsConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.id = self.scope['url_route']['kwargs']['user_id']
        await self.channel_layer.group_add(
            f'user_bookings_{self.id}',
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
        
class BusinessReviewsConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.id = self.scope['url_route']['kwargs']['business_id']
        await self.channel_layer.group_add(
            f'business_reviews_{self.id}',
            self.channel_name
        )
        await self.accept()
        await self.send(text_data=json.dumps({
            'message': 'WebSocket connection established'
        }))

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            f'business_reviews_{self.id}',
            self.channel_name
        )
        
        await self.close()


    