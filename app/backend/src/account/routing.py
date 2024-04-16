from django.urls import re_path
from match.consumers import MatchConsumer, TimeConsumer

websocket_urlpatterns = [
    re_path(r"^wss/time/$", TimeConsumer.as_asgi()),
]