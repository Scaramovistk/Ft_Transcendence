from rest_framework import serializers
from ..models import Tournament

class TournamentSerializer(serializers.ModelSerializer):
	class Meta:
		model = Tournament
		fields = '__all__'
# May it be able to be edited in the tounament page?