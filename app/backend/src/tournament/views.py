from rest_framework import permissions, generics
from core.models import Tournament
from django.utils import timezone
from .serializers import TournamentSerializer, TournMatchHistorySerializer
from drf_yasg.utils import swagger_auto_schema
from rest_framework.response import Response
from rest_framework import permissions, status, generics

class TournamentListView(generics.ListAPIView):
	permission_classes = [permissions.IsAuthenticated]
	queryset = Tournament.objects.all()
	serializer_class = TournamentSerializer

class TournamentDetailView(generics.RetrieveAPIView):
	permission_classes = [permissions.AllowAny]
	queryset = Tournament.objects.all()
	serializer_class = TournamentSerializer
	lookup_field = 'pk'

class TournamentCreateView(generics.CreateAPIView):
	permission_classes = [permissions.AllowAny]
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

class TournamentStartView(generics.UpdateAPIView):
	permission_classes = [permissions.IsAuthenticated]
	queryset = Tournament.objects.all()
	serializer_class = TournamentSerializer
	lookup_url_kwarg = 'pk'

	def put(self, request, *args, **kwargs):
		pk_tournament = self.kwargs.get('pk')

		tournament = self.get_object()
		serializer = self.get_serializer(tournament, data=request.data, partial=True)
		if serializer.is_valid():
			if tournament.status == 'Not Started':
				tournament.started_at = timezone.now()
				tournament.status = 'In Progress'
				tournament.save()
				return Response(serializer.data, status=status.HTTP_200_OK)
			else:
				return Response("Tournament already started", status=status.HTTP_400_BAD_REQUEST)
		return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class TournamentIncompleteView(generics.UpdateAPIView):
	permission_classes = [permissions.IsAuthenticated]
	queryset = Tournament.objects.all()
	serializer_class = TournamentSerializer
	lookup_url_kwarg = 'pk'

	def put(self, request, *args, **kwargs):
		pk_tournament = self.kwargs.get('pk')

		tournament = self.get_object()
		serializer = self.get_serializer(tournament, data=request.data, partial=True)

		if serializer.is_valid():
			if tournament.status == 'In Progress':
				tournament.finished_at = timezone.now()
				tournament.winner = 'None';
				tournament.status = 'Incomplete'
				tournament.save()
				return Response(serializer.data, status=status.HTTP_200_OK)
			else:
				return Response("Tournament is not in progress", status=status.HTTP_400_BAD_REQUEST)

		return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class TournamentFinishView(generics.UpdateAPIView):
	permission_classes = [permissions.IsAuthenticated]
	queryset = Tournament.objects.all()
	serializer_class = TournamentSerializer
	lookup_url_kwarg = 'pk'
	lookup_field = 'pk'

	def put(self, request, *args, **kwargs):
		pk_tournament = self.kwargs.get('pk')
		char_array = self.kwargs.get('char_array')

		tournament = self.get_object()
		serializer = self.get_serializer(tournament, data=request.data, partial=True)

		if serializer.is_valid():
			if tournament.status == 'In Progress':
				tournament.finished_at = timezone.now()
				tournament.winner = char_array;
				tournament.status = 'Finished'
				tournament.save()
				return Response(serializer.data, status=status.HTTP_200_OK)
			else:
				return Response("Tournament is not in progress", status=status.HTTP_400_BAD_REQUEST)

		return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class TournamentMatchHistoryView(generics.RetrieveAPIView):
    lookup_url_kwarg = 'pk'
    serializer_class = TournMatchHistorySerializer

    def get_object(self):
        pk_tournament = self.kwargs.get('pk')
        tournament = Tournament.objects.get(pk=pk_tournament)
        return tournament

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['id'] = self.kwargs.get('pk')
        return context