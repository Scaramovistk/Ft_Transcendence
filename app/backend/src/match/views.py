from core.models import Player, Match, Account
from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import permissions, generics
from .serializers import LoginSerializer
from django.db.models import Q


class NewPlayerView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        request_data = request.data.copy()

        if request_data.get('username') == "HAL 9000":
            request_data['password'] = "IMPOSTOETOUBO#ESTADOEQUADRILHA"

        login_serializer = LoginSerializer(data=request_data)
        login_serializer.is_valid(raise_exception=True)
        user: Account = login_serializer.validated_data.get("user_object")
        player, created = Player.objects.get_or_create(user=user)
        if not created and player.playing:
            return Response({"success": False, "username": user.username,
                             "message": user.username + " is already playing"},
                            status=400)
        else:
            player.playing = True
            player.save()
            status = 201 if created else 200
            return Response({"success": True, "username": user.username,
                             "message": "can play"}, status=status)


class NewMatchView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        match = Match.objects.create()
        user = Account.objects.get(username=request.data["left_player_name"])
        match.left_player = Player.objects.get(user=user)
        user = Account.objects.get(username=request.data["right_player_name"])
        match.right_player = Player.objects.get(user=user)
        match.status = Match.MatchStatus.PLAYING
        match.type = request.data["type"]
        match.max_score = request.data["max_score"]
        match.tournament_id = request.data["tournament_id"]
        match.save()
        return Response({"success": True, "match_id": match.id, }, status=201)

class UpdateMatchView(generics.UpdateAPIView):
    permission_classes = [permissions.AllowAny]

    def set_players_to_not_playing(self, match):
        if match.left_player:
            match.left_player.playing = False
            match.left_player.save()
        if match.right_player:
            match.right_player.playing = False
            match.right_player.save()


    def patch(self, request):
        try:
            match_id = request.data["id"]
            new_status = request.data["new_status"]
            left_score = request.data["left_score"]
            right_score = request.data["right_score"]

            match = Match.objects.get(id=match_id)

            if match.status == new_status:
                return Response({"success": True, "message": "Match is already in status: " + new_status}, status=200)

            match.status = new_status

            if new_status == Match.MatchStatus.FINISHED or new_status == Match.MatchStatus.CANCELLED:
                self.set_players_to_not_playing(match)
            
            match.left_score = left_score
            match.right_score = right_score
            match.save()
            
            if new_status == Match.MatchStatus.CANCELLED:
                match.delete()

            return Response({"success": True, "message": "Match updated to status: " + new_status}, status=200)
        
        except Match.DoesNotExist:
            return Response({"success": True, "message": "No status update, match already deleted"}, status=200)
        except Exception as e:
            return Response({"success": False, "message": str(e)}, status=400)

class UpdatePlayersView(generics.UpdateAPIView):
    permission_classes = [permissions.IsAuthenticated]

    def patch(self, request):
        try:
            left_name = request.data.get("left_player_name")
            right_name = request.data.get("right_player_name")
            type = request.data.get("type")

            if type == 'toggle_status':
                if left_name is not None:
                    left_player = Player.objects.get(user=Account.objects.get(username=left_name))
                    left_player.playing = False
                    left_player.save()
                    message = f"Left playing:  {left_player.playing}. "
                if right_name is not None:
                    right_player = Player.objects.get(user=Account.objects.get(username=right_name))
                    right_player.playing = False
                    right_player.save()
                    message += f"Right playing:  {right_player.playing}. "
                if message is None:
                    message = "Toggle status not done"
                return Response({"success": True, "message": message}, status=200)

            else:
                raise ValueError("Invalid type: " + type)
        
        except KeyError as e:
            return Response({"success": False, "message": f"Missing key: {e}"}, status=400)
        except ValueError as e:
            return Response({"success": False, "message": str(e)}, status=400)


class JoinMatchView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        user = request.user
        player, player_created = Player.objects.get_or_create(user=user)
        
        if not player_created and player.playing:
            return Response({"success": False, "username": user.username,
                             "message": user.username + " is already playing", },
                            status=400)
        
        player.playing = True
        player.save()

        try:
            match = Match.objects.filter(Q(status=Match.MatchStatus.CREATED) & ~Q(left_player=player)).order_by('created_at')[0]
            match.right_player = player
            match.status = Match.MatchStatus.PLAYING
            side = "right"
            status = 200
            match.save()
        except IndexError:
            match = Match.objects.create()
            match.type = request.data["type"]
            match.max_score = request.data["max_score"]
            match.left_player = player
            side = "left"
            status = 201
            match.save()

        return Response({"success": True, "username": player.user.username, "side":side, "id": match.id}, status=status)