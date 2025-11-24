from django.urls import path
from .views import (
    RegisterView,
    LoginView,
    MessageListCreateView,
    ProfileView
)

urlpatterns = [
    path('auth/register', RegisterView.as_view(), name='register'),
    path('auth/login', LoginView.as_view(), name='login'),
    path('messages', MessageListCreateView.as_view(), name='messages'),
    path('profile', ProfileView.as_view(), name='profile'),
]
