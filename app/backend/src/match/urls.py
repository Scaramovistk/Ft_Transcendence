from django.urls import path
from .views import NewPlayerView, NewMatchView, UpdateMatchView, UpdatePlayersView, JoinMatchView
from . import views


urlpatterns = [
    path("new-player/", NewPlayerView.as_view(), name="new-player"),
    path("new-match/", NewMatchView.as_view(), name="new-match"),
    path("update-match/", UpdateMatchView.as_view(), name="update-match"),
    path("update-players/", UpdatePlayersView.as_view(), name="update-players"),
    path("join-match/", JoinMatchView.as_view(), name="join-match"),
]
