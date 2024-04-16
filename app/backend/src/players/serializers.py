from rest_framework import serializers
from core.models import Account

class FriendRequestSerializer(serializers.ModelSerializer):
	class Meta:
		model = Account
		fields = ['id', 'username', 'avatar', 'login_otp_used']