from channels.generic.websocket import WebsocketConsumer, JsonWebsocketConsumer
from datetime import datetime
import time
import threading


class MatchConsumer(JsonWebsocketConsumer):

    def connect(self):
        self.accept()
    
    def disconnect(self, close_code):
        pass

    def receive_json(self, data):
        pass

class TimeConsumer(WebsocketConsumer):

    def connect(self):
        self.accept()

        def send_time(self):
            while True:
                self.send(text_data=str(datetime.now().strftime("%H:%M:%S")))
                time.sleep(1)
        threading.Thread(target=send_time, args=(self,)).start()

    def disconnect(self, close_code):
        pass

    def receive(self, text_data):
        pass