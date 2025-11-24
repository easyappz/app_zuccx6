from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, generics
from rest_framework.authtoken.models import Token
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication
from .models import Member, Message
from .serializers import (
    MemberSerializer,
    RegisterSerializer,
    LoginSerializer,
    MessageSerializer
)


class RegisterView(APIView):
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            member = serializer.save()
            token, created = Token.objects.get_or_create(user_id=member.id)
            member_data = MemberSerializer(member).data
            return Response(
                {'token': token.key, 'member': member_data},
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LoginView(APIView):
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            username = serializer.validated_data['username']
            password = serializer.validated_data['password']
            
            try:
                member = Member.objects.get(username=username)
                if member.check_password(password):
                    token, created = Token.objects.get_or_create(user_id=member.id)
                    member_data = MemberSerializer(member).data
                    return Response(
                        {'token': token.key, 'member': member_data},
                        status=status.HTTP_200_OK
                    )
                else:
                    return Response(
                        {'error': 'Invalid credentials'},
                        status=status.HTTP_401_UNAUTHORIZED
                    )
            except Member.DoesNotExist:
                return Response(
                    {'error': 'Invalid credentials'},
                    status=status.HTTP_401_UNAUTHORIZED
                )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class MemberAuthentication(TokenAuthentication):
    def authenticate_credentials(self, key):
        try:
            token = Token.objects.get(key=key)
        except Token.DoesNotExist:
            return None

        try:
            member = Member.objects.get(id=token.user_id)
        except Member.DoesNotExist:
            return None

        return (member, token)


class MessageListCreateView(generics.ListCreateAPIView):
    queryset = Message.objects.all().order_by('created_at')
    serializer_class = MessageSerializer
    authentication_classes = [MemberAuthentication]
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(member=self.request.user)


class ProfileView(APIView):
    authentication_classes = [MemberAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = MemberSerializer(request.user)
        return Response(serializer.data)
