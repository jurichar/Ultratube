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
    fields = ['id', 'username', 'email']