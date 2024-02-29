from rest_framework import permissions, generics, status, serializers
from ..models import Account
from ..serializers.account import AccountDetailSerializer
from ..serializers.friends import FriendRequestSerializer
from rest_framework.response import Response

class PlayerListView(generics.ListAPIView):
    permission_classes = [permissions.IsAuthenticated]
    queryset = Account.objects.all()
    serializer_class = AccountDetailSerializer

class PlayerDetailView(generics.RetrieveAPIView):
    permission_classes = [permissions.IsAuthenticated]
    queryset = Account.objects.all()
    serializer_class = AccountDetailSerializer
    lookup_field = 'pk'

class PlayerSearchView(generics.ListAPIView):
    permission_classes = [permissions.IsAuthenticated]
    queryset = Account.objects.all()
    serializer_class = AccountDetailSerializer

    def get_queryset(self):
        username = self.kwargs['username']
        return self.queryset.filter(username__icontains=username)

class PlayerFriendListView(generics.GenericAPIView):
    permission_classes = [permissions.IsAuthenticated]
    queryset = Account.objects.all()
    serializer_class = FriendRequestSerializer

    def get(self, request):
        return Response(self.get_serializer(request.user.friends.all(), many=True).data, status=status.HTTP_200_OK)

class PlayerFriendRequestView(generics.GenericAPIView):
    permission_classes = [permissions.IsAuthenticated]
    queryset = Account.objects.all()
    serializer_class = AccountDetailSerializer

    def post(self, request, *args, **kwargs):

        try:
            user = Account.objects.get(pk=kwargs['pk'])
        except Account.DoesNotExist:
            raise serializers.ValidationError({'Error': 'user does not exist'})
        if request.user.friends.filter(username=user.username).exists():
            raise serializers.ValidationError({'Error': 'user is already a friend'})
        if request.user.friend_requests.filter(username=user.username).exists():
            raise serializers.ValidationError({'Error': 'friend request is already sent'})
        if request.user.username == user.username:
            raise serializers.ValidationError({'Error': 'you cannot send a friend request to yourself'})
        request.user.friend_requests.add(user)
        return Response(self.get_serializer(request.user).data, status=status.HTTP_200_OK)



class PlayerFriendRequestSentView(generics.GenericAPIView):
    permission_classes = [permissions.IsAuthenticated]
    queryset = Account.objects.all()
    serializer_class = FriendRequestSerializer

    def get(self, request):
        return Response(self.get_serializer(request.user.friend_requests.all(), many=True).data, status=status.HTTP_200_OK)

class PlayerFriendRequestReceivedView(generics.GenericAPIView):
    permission_classes = [permissions.IsAuthenticated]
    queryset = Account.objects.all()
    serializer_class = AccountDetailSerializer

    def get(self, request):
        return Response(self.get_serializer(request.user.received_friend_requests.all(), many=True).data, status=status.HTTP_200_OK)

class PlayerFriendRequestAcceptView(generics.GenericAPIView):
    permission_classes = [permissions.IsAuthenticated]
    queryset = Account.objects.all()
    serializer_class = AccountDetailSerializer

    def post(self, request, *args, **kwargs):
        try:
            user = Account.objects.get(pk=kwargs['pk'])
        except Account.DoesNotExist:
            raise serializers.ValidationError({'username': 'user does not exist'})
        if not request.user.received_friend_requests.filter(username=user.username).exists():
            raise serializers.ValidationError({'username': 'user did not send a friend request'})
        user.friends.add(request.user)
        request.user.friends.add(user)
        request.user.received_friend_requests.remove(user)
        user.friend_requests.remove(request.user)
        return Response(self.get_serializer(request.user).data, status=status.HTTP_200_OK)

class PlayerFriendRequestRejectView(generics.GenericAPIView):
    permission_classes = [permissions.IsAuthenticated]
    queryset = Account.objects.all()
    serializer_class = AccountDetailSerializer

    def post(self, request, *args, **kwargs):
        try:
            user = Account.objects.get(pk=kwargs['pk'])
        except Account.DoesNotExist:
            raise serializers.ValidationError({'username': 'user does not exist'})
        if not request.user.received_friend_requests.filter(username=user.username).exists():
            raise serializers.ValidationError({'username': 'user did not send a friend request'})
        request.user.received_friend_requests.remove(user)
        user.friend_requests.remove(request.user)
        return Response(self.get_serializer(request.user).data, status=status.HTTP_200_OK)

# sent request, recieved request, accept request, reject request,
