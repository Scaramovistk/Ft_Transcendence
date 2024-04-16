from channels.generic.websocket import WebsocketConsumer
from channels.exceptions import StopConsumer
from asgiref.sync import async_to_sync
from uuid import UUID

import json
import random

class MatchConsumer(WebsocketConsumer):

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.match_id = None
        self.match_group = None
        self.match = None
        self.connection_open = False

    def connect(self):
        from core.models import Match
        self.match_id = UUID(self.scope['url_route']['kwargs']['match_id'])
        self.match_group = f'chat_{self.match_id}'
        self.match = Match.objects.get(id=self.match_id)
        self.accept()
        async_to_sync(self.channel_layer.group_add)(self.match_group, self.channel_name)

    def disconnect(self, code):
        async_to_sync(self.channel_layer.group_discard)(self.match_group, self.channel_name)

    def receive(self, text_data):
        from core.models import Match
        data = json.loads(text_data)
        type = data['type']

        if type == 'new_player':
            async_to_sync(self.channel_layer.group_send)(
                self.match_group,
                {
                    'type': 'new_player',
                    'name': data['name'],
                }
            )
            if self.match.left_player is not None and self.match.right_player is not None:
                async_to_sync(self.channel_layer.group_send)(
                    self.match_group,
                    {
                        'type': 'start_match',
                        'left_name': self.match.left_player.user.username,
                        'right_name': self.match.right_player.user.username,
                    }
                )
        
        if type == 'end_match':
            self.set_players_to_not_playing()
            self.match.status = Match.MatchStatus.FINISHED
            self.match.left_score = data['left_score']
            self.match.right_score = data['right_score']
            self.match.save()
            async_to_sync(self.channel_layer.group_send)(
                    self.match_group,
                    {
                        'type': 'end_match',
                    }
                )
        
        if type == 'posY':
            async_to_sync(self.channel_layer.group_send)(
                self.match_group,
                {
                    'type': 'posY',
                    'pos_y': data['pos_y'],
                    'side': data['side'],
                }
            )
        
        if type == 'ball_reset':
            async_to_sync(self.channel_layer.group_send)(
                self.match_group,
                {
                    'type': 'ball_speed_y',
                    'random': random.random(),
                }
            )

    def new_player(self, event):
        self.send(text_data=json.dumps(event))
    
    def start_match(self, event):
        self.send(text_data=json.dumps(event))

    def end_match(self, event):
        self.send(text_data=json.dumps(event))
    
    def posY(self, event):
        self.send(text_data=json.dumps(event))
    
    def ball_speed_y(self, event):
        self.send(text_data=json.dumps(event))

    def set_players_to_not_playing(self):
        if self.match.left_player:
            self.match.left_player.playing = False
            self.match.left_player.save()
        if self.match.right_player:
            self.match.right_player.playing = False
            self.match.right_player.save()    
