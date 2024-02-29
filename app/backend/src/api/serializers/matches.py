from rest_framework import serializers
from ..models import Tournament

class MatchesRequestSerializer(serializers.ModelSerializer):
	class Meta:
		model = Tournament
		fields = ['player_in', 'life', 'created_at', 'started_at', 'finished_at', 'status']