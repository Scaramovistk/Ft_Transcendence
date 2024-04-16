from django.urls import path
from .views import (
    PlayerListView,
    PlayerDetailView,
    PlayerSearchView,
    PlayerFriendListView,
    PlayerFriendRequestView,
    PlayerFriendRequestSentView,
    PlayerFriendRequestReceivedView,
    PlayerFriendRequestAcceptView,
    PlayerFriendRequestRejectView
)
from . import views

urlpatterns = [
	path('list', PlayerListView.as_view(), name='player-list'),
	path('detail/<int:pk>', PlayerDetailView.as_view(), name='player-detail'),
	path('search/<str:username>', PlayerSearchView.as_view(), name='player-search'),
	path('friends/list', PlayerFriendListView.as_view(), name='player-friend-list'),
	path('friend-requests/<int:pk>', PlayerFriendRequestView.as_view(), name='player-friend-request'),
	path('friend-requests/sent', PlayerFriendRequestSentView.as_view(), name='player-friend-request-sent'),
	path('friend-requests/recieved', PlayerFriendRequestReceivedView.as_view(), name='player-friend-request-received'),
	path('friend-requests/accept/<int:pk>', PlayerFriendRequestAcceptView.as_view(), name='player-friend-request-accept'),
	path('friend-requests/reject/<int:pk>', PlayerFriendRequestRejectView.as_view(), name='player-friend-request-reject'),
]
