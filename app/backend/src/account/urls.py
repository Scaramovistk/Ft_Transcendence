from django.urls import path
from rest_framework import permissions
from .views import (
    RegisterView,
    LoginView,
    LogoutView,
    VerifyOTPView,
    AccountDetailView,
    AccountUpdateView,
    AccountDeleteView,
    AccountDeleteAvatarView
)
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView
)
from . import views

urlpatterns = [
	# Authentication
	path('login', LoginView.as_view(), name='login'),
	path('logout', LogoutView.as_view(), name='logout'),
	path('otp', VerifyOTPView.as_view(), name='verify_otp'),
	path('token/refresh', TokenRefreshView.as_view(), name='token_refresh'),
	path('token/verify', TokenVerifyView.as_view(), name='token_verify'),
	path('register', RegisterView.as_view(), name='auth_register'),

	# Accounts
	path('detail', AccountDetailView.as_view(), name='profile-detail'),
	path('update', AccountUpdateView.as_view(), name='profile-update'),
	path('delete', AccountDeleteView.as_view(), name='profile-delete'),
	path('delete-avatar', AccountDeleteAvatarView.as_view(), name='profile-delete-avatar'),
]
