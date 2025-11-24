from rest_framework import serializers
from .models import Member, Message


class MemberSerializer(serializers.ModelSerializer):
    class Meta:
        model = Member
        fields = ['id', 'username', 'created_at']
        read_only_fields = ['id', 'created_at']


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, max_length=128)

    class Meta:
        model = Member
        fields = ['username', 'password']

    def create(self, validated_data):
        member = Member(username=validated_data['username'])
        member.set_password(validated_data['password'])
        member.save()
        return member


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=150)
    password = serializers.CharField(max_length=128, write_only=True)


class MessageSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='member.username', read_only=True)

    class Meta:
        model = Message
        fields = ['id', 'member', 'username', 'text', 'created_at']
        read_only_fields = ['id', 'created_at', 'username']
