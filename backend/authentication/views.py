import base64
from os import access
from django.http import Http404
from django.shortcuts import render
import requests
import base64
from datetime import datetime, timedelta

from django.contrib.auth import authenticate, login
from rest_framework.authentication import SessionAuthentication
from .serializer import AccessTokenSerializer, UserModelSerializer
from .models import User
from django.shortcuts import redirect
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.contrib.auth.decorators import login_required
from oauth2_provider.contrib.rest_framework import TokenHasReadWriteScope, TokenHasScope
from django.conf import settings
from rest_framework import permissions
from rest_framework import generics
from oauth2_provider.models import AccessToken
import requests




def create_or_get_user(username="", password="", email="", firstname="", lastname=""):
    user, created = User.objects.get_or_create(username=username, email=email, first_name=firstname, last_name=lastname)
    if created:
        user.save()
    return user
        
def get_information_user_access_token(url, access_token):
    headers = {
        'Authorization': "Bearer " + access_token
    }
    information_user = requests.get(url, headers=headers)
    return information_user
    
def get_object_for_token(grant_type="authorization_code", code="", redirect_uri="", client_id="", client_secret="", scope="public"):
    return {
        'grant_type': grant_type,
        'code' : code,
        'redirect_uri' : redirect_uri,
        'client_id': client_id,
        'client_secret' : client_secret,
        'scope': scope
    }

def call_application_get_access_token( url, token_params):
    response = requests.post(url, data=token_params)
    if ( response.status_code == 200):
        return response
    else:
        return {'cant get information, the authentication fail , please try again'}
    
def get_access_token_api(client_id, client_secret):
    try:
        print(client_id, client_secret)
        data={
            'grant_type': 'client_credentials',
            'client_id': client_id,
            'client_secret' :client_secret
        }
        response = requests.post('http://localhost:8000/o/token/', data=data)
        return response
    except:
        return "Cant get token, client_id and secret are not matching"

class FortyTwoAuthView(APIView):
    authentication_classes = []
    permission_classes = [AllowAny]
    def get(self, request):
        code = request.GET.get('code')
        data_request = get_object_for_token(code=code, redirect_uri=settings.FORTYTWO_REDIRECT, client_id=settings.FORTYTWO_KEY, client_secret=settings.FORTYTWO_SECRET)
        token = call_application_get_access_token("https://api.intra.42.fr/oauth/token", data_request)
        accessToken = token.json()['access_token']
        user = get_information_user_access_token('https://api.intra.42.fr/v2/me', accessToken)
        user = user.json()
        user_created = create_or_get_user(username=user['login'], email=user['email'], firstname=user['first_name'], lastname=user['last_name'])
        user = authenticate(request, username=user_created.username)
        backend = 'authentication.custom_authenticate.CustomAuth'
        if user is not None:
            login(request, user, backend=backend)
            request.session.save()
            print(request.user)
            print('accueil')
        else:
            print('Identifiants invalides.')
        token_api = get_access_token_api(settings.DJANGO_UID, settings.DJANGO_SECRET).json()
        update_token_url = 'http://localhost:8000/oauth/update-token/'+ token_api['access_token'] + '/'
        update_data = {
    'user': user_created.id,
}
        csrf_token = request.COOKIES.get('csrftoken', '')
        headers={
            'Authorization' : 'Bearer ' + accessToken,
            'X-CSRFToken': csrf_token,
        }
        expiration_date = datetime.now() + timedelta(days=7)

        response = requests.put(update_token_url, data=update_data, headers=headers, cookies=request.COOKIES)
        frontend_redirect_url = request.GET.get('state', 'http://localhost:3000/register')
        redirect_response = redirect(frontend_redirect_url)
        redirect_response.set_cookie('token', accessToken, path='/', domain='localhost', httponly=True, samesite='none', expires=None,)
        return redirect_response


class DiscordAuthView(APIView):
    def get(self, request):
        code = request.GET.get('code')
        return Response({'code': code})

class AccessTokenDetail(APIView):
    
    permission_classes = [IsAuthenticated]
    def get_object(self, token):
        try:
            return AccessToken.objects.get(token=token)
        except AccessToken.DoesNotExist:
            raise Http404
        
    def put(self, request, token, format=None):
            snippet = self.get_object(token)
            serializer = AccessTokenSerializer(snippet, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, )    

class UserList(generics.ListAPIView):
    queryset = User.objects.all()
    permission_classes = [ IsAuthenticated, TokenHasScope]
    required_scopes = ['read']
    serializer_class = UserModelSerializer
        