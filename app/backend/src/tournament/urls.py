from django.urls import path
from .views import (
    TournamentListView,
    TournamentDetailView,
    TournamentMatchHistoryView,
    TournamentCreateView,
    TournamentUpdateView,
    TournamentDeleteView,
    TournamentStartView,
    TournamentIncompleteView,
    TournamentFinishView
)
from . import views

urlpatterns = [
	path('list', TournamentListView.as_view(), name='tournament-list'),
	path('detail/<int:pk>', TournamentDetailView.as_view(), name='tournament-detail'),
	path('match_history/<int:pk>', TournamentMatchHistoryView.as_view(), name='tournament-match-history'),
	path('create', TournamentCreateView.as_view(), name='tournament-create'),
	path('update/<int:pk>', TournamentUpdateView.as_view(), name='tournament-update'),
	path('delete/<int:pk>', TournamentDeleteView.as_view(), name='tournament-delete'),
	path('start/<int:pk>', TournamentStartView.as_view(), name='tournament-start'),
	path('incomplete/<int:pk>', TournamentIncompleteView.as_view(), name='tournament-incomplete'),
	path('finish/<int:pk>/<str:char_array>', TournamentFinishView.as_view(), name='tournament-finish'),
]
