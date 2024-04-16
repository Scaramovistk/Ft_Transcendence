from django.db.models import Q
from rest_framework import serializers
from core.models import Tournament, Match

class TournamentSerializer(serializers.ModelSerializer):
	class Meta:
		model = Tournament
		fields = '__all__'

class TournMatchHistorySerializer(serializers.Serializer):
    # Define matches field using MethodField to dynamically filter matches
    matches = serializers.SerializerMethodField()

    def get_matches(self, tournament_id):
        """
        Method to dynamically filter matches based on tournament ID
        """
        filtered_matches = Match.objects.filter(
            Q(status="finished") & Q(tournament_id=tournament_id)
        )

        serialized_matches = [
            {
                "date": match.created_at.strftime("%d %B %Y"),
                "right_player": (
                    "" if match.right_player is None
                    else match.right_player.user.username
                ),
                "left_player": (
                    "" if match.left_player is None
                    else match.left_player.user.username
                ),
                "end_score": (
                    str(match.left_score) + "-" + str(match.right_score)
                ),
            }
            for match in filtered_matches
        ]
        return serialized_matches

    def to_representation(self, instance):
        """
        Custom representation method to format the match history data.
        """
        tournament_id = instance.id
        return {
            "matches": self.get_matches(tournament_id),
        }