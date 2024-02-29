from rest_framework import serializers
from ..models import Account
from django.core.files.base import ContentFile
from django.utils.crypto import get_random_string
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
import datetime
from django.utils import timezone
import pyotp
import io
import qrcode


class AccountSerializer(serializers.Serializer):
    username = serializers.CharField(required=True)
    password = serializers.CharField(write_only=True, required=True)
    email = serializers.EmailField(required=True)
    qr_code = serializers.ImageField(read_only=True)

    class Meta:
        model = Account
        fields = ('username', 'password', 'email', 'qr_code')

    def create(self, validated_data):
        # Check if user already exists
        if Account.objects.filter(username=validated_data['username']).exists():
            raise serializers.ValidationError({'username': 'Username already exists.'})
        if Account.objects.filter(email=validated_data['email'].lower().strip()).exists():
            raise serializers.ValidationError({'email': 'email is already in use.'})
        otp_base32 = pyotp.random_base32()
        otp_auth_url = pyotp.totp.TOTP(otp_base32).provisioning_uri(name=validated_data['email'].lower().strip(), issuer_name="Transcendence")
        stream = io.BytesIO()
        image = qrcode.make(f"{otp_auth_url}")
        image.save(stream)
        user = Account.objects.create_user(
            username=validated_data['username'],
            password=validated_data['password'],
            email=validated_data['email'].lower().strip(),
            qr_code=ContentFile(stream.getvalue(), name=f"qr{get_random_string(10)}.png"),
            otp_base32 = otp_base32
        )
        return user

class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()

    def validate(self, attrs: dict):
        user = authenticate(
            request=self.context.get("request"),
            username=attrs.get("username"),
            password=attrs.get("password"),
        )
        if user is None:
            raise serializers.ValidationError({'username': 'username does not exist.'})
        else:
            attrs["user_object"] = user
        return super().validate(attrs)

    def create(self, validated_data: dict):
        user: User = validated_data.get("user_object")
        totp = pyotp.TOTP(user.otp_base32).now()
        user.login_otp = totp
        user.otp_created_at = datetime.datetime.now(timezone.utc)
        user.login_otp_used = False
        user.save(update_fields=["login_otp", "otp_created_at", "login_otp_used"])
        return user

class VerifyOTPSerializer(serializers.Serializer):
    otp = serializers.CharField()
    id = serializers.CharField()

    def validate(self, attrs: dict):
        user: user = Account.objects.filter(id=attrs.get("id")).first()
        if not user:
            raise serializers.ValidationError({'password': 'incorrect password'})
        # if user.login_otp != attrs.get("otp") or not user.is_valid_otp():
        if (attrs.get("otp") != user.login_otp):
            totp = pyotp.TOTP(user.otp_base32).now()
            user.login_otp = totp
            user.otp_created_at = datetime.datetime.now(timezone.utc)
            user.login_otp_used = False
            user.save(update_fields=["login_otp", "otp_created_at", "login_otp_used"])
            raise serializers.ValidationError({'otp': 'otp is incorrect'})
        if ( not user.is_valid_otp):
            raise serializers.ValidationError({'otp': 'otp is incorrect2'})
        attrs["user"] = user
        return super().validate(attrs)

    def create(self, validated_data: dict):
        user: User = validated_data.get("user")
        refresh = RefreshToken.for_user(user)
        user.login_otp_used = True
        user.save(update_fields=["login_otp_used"])
        return {
            "refresh": str(refresh),
            "access": str(refresh.access_token),
        }

class AccountDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = Account
        fields = (
            'id',
            'username',
            'bio',
            'avatar',
            'friends',
            'friend_requests',
        )