from rest_framework import serializers
from datetime import datetime
from django.contrib.auth import authenticate
from core.models import Match, Account, Player
from django.db.models import Q


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()

    def validate(self, attrs: dict):
        user = authenticate(
            username=attrs.get("username"),
            password=attrs.get("password"),
        )
        if user is None:
            raise serializers.ValidationError("user does not exist")
        else:
            attrs["user_object"] = user
        return super().validate(attrs)


class PlayerSerializer(serializers.ModelSerializer):

    name = serializers.SerializerMethodField()

    class Meta:
        model = Player
        fields = ('id', 'playing', 'name')
    
    def get_name(self, instance):
        try:
            user: Account = instance.user
        except Account.DoesNotExist:
            return ()
        return (user.username)


class MatchSerializer(serializers.ModelSerializer):
    left_player = PlayerSerializer()
    right_player = PlayerSerializer()

    class Meta:
        model = Match
        fields = '__all__'


class MatchHistorySerializer(serializers.Serializer):
    # Define matches field using MethodField to dynamically filter matches
    matches = serializers.SerializerMethodField()

    def get_opponent_name(self, match, instance):
        if match.right_player == instance:
            opponent = match.left_player
        else:
            opponent = match.right_player
        if opponent is None:
            return "None"
        else:
            return opponent.user.username

    def get_opponent_id(self, match, instance):
        if match.right_player == instance:
            opponent = match.left_player
        else:
            opponent = match.right_player
        if opponent is None:
            return ""
        else:
            return opponent.user.id

    def get_matches(self, instance):
        """
        Method to dynamically filter matches based on status as finished and player
        """
        filtered_matches = Match.objects.filter(
            Q(status=Match.MatchStatus.FINISHED) & (Q(left_player=instance) | Q(right_player=instance))
        )

        serialized_matches = [
            {
                "date": match.created_at.strftime("%d %B %Y"),
                "opponent": self.get_opponent_name(match, instance),
                "opponent_id": self.get_opponent_id(match, instance),
                "end_score": (
                    str(match.left_score) + "-" + str(match.right_score)
                    if match.left_player == instance
                    else str(match.right_score) + "-" + str(match.left_score)
                ),
            }
            for match in filtered_matches
        ]
        return serialized_matches

    def to_representation(self, instance):
        """
        Custom representation method to format the match history data.
        """
        wins, losses = instance.wins_and_losses_count
        return {
            "matches": self.get_matches(instance),
            "wins": wins,
            "losses": losses,
            "total": wins + losses
        }