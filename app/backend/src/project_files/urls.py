"""
URL configuration for project_files project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include

from drf_yasg.views import get_schema_view
from rest_framework import permissions
from drf_yasg import openapi
import os

schema_view = get_schema_view(
    openapi.Info(
        title="Transcendence API",
        default_version='v1',
        description="Welcome to the Transcendence API documentation."
    ),
    url=os.getenv("BACKEND_API_URL"),
    public=True,
    permission_classes=[permissions.AllowAny],
)

urlpatterns = [
    path('', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('admin/', admin.site.urls),
    path('match/', include('match.urls')),
    path('tournaments/', include('tournament.urls')),
    path('players/', include('players.urls')),
    path('accounts/', include('account.urls')),
    path('auth/', include('account.urls')),
]
