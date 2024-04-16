from django.urls import re_path
from match.consumers import MatchConsumer

websocket_urlpatterns = [
    re_path(r"^wss/match/(?P<match_id>[0-9a-f-]+)/$", MatchConsumer.as_asgi()),
]