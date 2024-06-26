from rest_framework.views import APIView
from rest_framework.generics import RetrieveAPIView
from rest_framework.response import Response
from rest_framework import permissions, status, generics
from .serializers import AccountSerializer, AccountDetailSerializer, LoginSerializer, VerifyOTPSerializer
from core.models import Account, Player
from drf_yasg.utils import swagger_auto_schema

class RegisterView(APIView):
    permission_classes = [permissions.AllowAny]

    @swagger_auto_schema(request_body=AccountSerializer)
    def post(self, request):
        serializer = AccountSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            if user.id == 1:
                another_user_data = {'username': "HAL 9000", 'email': "HAL9000@HAL9000.com", 'password': "IMPOSTOETOUBO#ESTADOEQUADRILHA"}
                another_serializer = AccountSerializer(data=another_user_data)
                if another_serializer.is_valid():
                    another_user = another_serializer.save()
                    if another_user:
                        return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LoginView(generics.GenericAPIView):
    """Login with email and password"""

    permission_classes = [permissions.AllowAny]
    serializer_class = LoginSerializer

    def post(self, request, format=None):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response(
            {
                "success": True,
                "user": user.id,
                "qr_code": user.qr_code.url,
                "message": "Login Successful. Proceed to 2FA",
            },
            status=200,
        )

class LogoutView(generics.GenericAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = AccountDetailSerializer

    def post(self, request, *args, **kwargs):
        request.user.login_otp_used = False
        try:
            player = Player.objects.get(user=request.user)
            if player is not None:
                player.playing = False
                player.save()
        except: 
            pass
        request.user.save()
        return Response("logged out", status=status.HTTP_200_OK)


class VerifyOTPView(generics.GenericAPIView):
    serializer_class = VerifyOTPSerializer

    def post(self, request, format=None):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        login_info: dict = serializer.save()
        return Response(login_info,status=200)

class AccountDetailView(RetrieveAPIView):
    permission_classes = [permissions.IsAuthenticated]
    queryset = Account.objects.all()
    serializer_class = AccountDetailSerializer

    def get_object(self):
        return self.request.user

class AccountUpdateView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def put(self, request):
        user = request.user
        serializer = AccountDetailSerializer(user, data=request.data)
        if serializer.is_valid():
            max_size = 1024 * 1024 # 1MB
            if 'avatar' in request.data:
                if request.data['avatar'].size > max_size:
                    return Response({'avatar': 'File too large. Max size is 1MB.'}, status=status.HTTP_400_BAD_REQUEST)
                user.avatar.delete()
                user.avatar = request.data['avatar']
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class AccountDeleteView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def delete(self, request):
        user = request.user
        user.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

class AccountDeleteAvatarView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def delete(self, request):
        user = request.user
        if user.avatar:
            user.avatar.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        return Response(status=status.HTTP_404_NOT_FOUND)