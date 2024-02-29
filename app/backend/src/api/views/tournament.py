from rest_framework import permissions, generics
from ..models import Tournament
from ..serializers.tournament import TournamentSerializer
from drf_yasg.utils import swagger_auto_schema
from rest_framework.response import Response
from rest_framework import permissions, status, generics

class TournamentListView(generics.ListAPIView):
	permission_classes = [permissions.AllowAny] # I need to adapt it to the authentication
	queryset = Tournament.objects.all()
	serializer_class = TournamentSerializer

class TournamentDetailView(generics.RetrieveAPIView):
	permission_classes = [permissions.AllowAny]
	queryset = Tournament.objects.all()
	serializer_class = TournamentSerializer
	lookup_field = 'pk'

class TournamentCreateView(generics.CreateAPIView):
	permission_classes = [permissions.AllowAny] # I need to adapt it to the authentication
	queryset = Tournament.objects.all()
	serializer_class = TournamentSerializer

	@swagger_auto_schema(request_body=TournamentSerializer)
	def post(self, request):
		serializer = TournamentSerializer(data=request.data)
		if serializer.is_valid():
			tournament = serializer.save()
			if tournament:
				return Response(serializer.data, status=status.HTTP_201_CREATED)
		return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class TournamentUpdateView(generics.UpdateAPIView):
	permission_classes = [permissions.IsAuthenticated]
	queryset = Tournament.objects.all()
	serializer_class = TournamentSerializer

class TournamentDeleteView(generics.DestroyAPIView):
	permission_classes = [permissions.IsAuthenticated]
	queryset = Tournament.objects.all()
	serializer_class = TournamentSerializer

# class TournamentMatchListView(generics.GenericAPIView):
# 	permission_classes = [permissions.AllowAny]
# 	queryset = Tournament.objects.all()
# 	serializer_class = TournamentSerializer

# class TournamentJoinView(generics.UpdateAPIView):
# 	permission_classes = [permissions.IsAuthenticated]
# 	queryset = Tournament.objects.all()
# 	serializer_class = TournamentSerializer

# 	def put(self, request, *args, **kwargs):
# 		tournament = self.get_object()
# 		serializer = self.get_serializer(tournament, data=request.data, partial=True)

# 		if serializer.is_valid():
# 			if tournament.player_qty < tournament.player_max and tournament.status == 'not_started':
# 				tournament.player_qty += 1
# 				tournament.player_in.add(request.user)
# 				tournament.avatar = request.data.get('avatar', None)
# 				if tournament.player_qty == tournament.player_max:
# 					tournament.status = 'in_progress'
# 				tournament.save()
# 				return Response(serializer.data, status=status.HTTP_200_OK)
# 			else:
# 				return Response("Tournament is full or already started", status=status.HTTP_400_BAD_REQUEST)
# 		return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# class TournamentStartView(generics.GenericAPIView):
# 	permission_classes = [permissions.AllowAny]
# 	queryset = Tournament.objects.all()
# 	serializer_class = TournamentSerializer

# 	@swagger_auto_schema(request_body=TournamentSerializer)
# 	def post (self, request):
# 		serializer = TournamentSerializer(data=request.data)
# 		if serializer.is_valid():
# 			tournament = serializer.save()
# 			torunament.status = 'in_progress'
# 			if tournament:
# 				return Response(serializer.data, status=status.HTTP_201_STARTED)

class TournamentDeleteView(generics.DestroyAPIView):
    permission_classes = [permissions.IsAuthenticated]
    queryset = Tournament.objects.all()
    serializer_class = TournamentSerializer