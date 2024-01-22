from dataclasses import field
from django.contrib.auth.models import Group
from .models import User
from rest_framework import serializers
from oauth2_provider.models import AccessToken


class AccessTokenSerializer(serializers.ModelSerializer):
    class Meta:
        model = AccessToken
        fields = '__all__'


class UserModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email',
                  'password', 'first_name', 'last_name']

    def create(self, validated_data):
        try:
            user = User(
                email=validated_data['email'],
                username=validated_data['username'],
                first_name=validated_data['first_name'],
                last_name=validated_data['last_name'],

            )
            user.set_password(validated_data['password'])
            user.save()
            return user
        except Exception as e:
            print(e)
            raise e


class UserLoginSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'password']
