from django.utils import timezone
import email
import json
from re import I
from unittest import TestCase
from urllib import request
from django.conf import settings
from django.urls import reverse
from django.urls import include, path, reverse
from .views import UserLogin
from rest_framework.test import APITestCase, URLPatternsTestCase
from oauth2_provider.models import AccessToken, Application
from rest_framework.test import APIRequestFactory
from .models import User
from rest_framework import status
from rest_framework.test import APITestCase
from rest_framework.test import RequestsClient
from rest_framework.test import APIClient


data = {'username': 'testf', 'password': 'test',
        'email': 'test@test.com', 'first_name': 'ff', 'last_name': 'ddd'}


class AccountTests(APITestCase, URLPatternsTestCase):
    urlpatterns = [
        path("oauth/", include('authentication.urls')),
        path('o/', include('oauth2_provider.urls', namespace='oauth2_provider')),
    ]

    def test_create_account(self):

        url = 'http://localhost:8000/oauth/register/'
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn('token', response.cookies)
        self.assertIn('csrftoken', response.cookies)
        self.assertIn('sessionid', response.cookies)
        self.assertIsNotNone(response.cookies['sessionid'])
        self.assertIsNotNone(response.cookies['token'])
        self.assertIsNotNone(response.cookies['csrftoken'])
        self.assertEqual(User.objects.count(), 1)
        self.assertEqual(User.objects.get(username='testf').username, 'testf')
        print(AccessToken.objects.all().values_list())

    def test_login(self):
        user = User.objects.create_user(username='testf', password='test')
        print(User.objects.get(username='testf'))
        self.assertEqual(User.objects.get(username='testf').username, 'testf')
        data_login = {'username': 'testf', 'password': 'test'}
        url = '/oauth/login/'
        response = self.client.post(url, json.dumps(
            data_login), content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIsNotNone(response.cookies['sessionid'])
        self.assertIsNotNone(response.cookies['token'])
        self.assertIsNotNone(response.cookies['csrftoken'])
        self.assertEqual(User.objects.count(), 1)
        self.assertEqual(User.objects.get(username='testf').username, 'testf')

    def test_login_unauthorize(self):
        user = User.objects.create_user(username='testf', password='test')
        self.assertEqual(User.objects.get(username='testf').username, 'testf')
        data_login = {'username': 'testf', 'password': 'testd'}
        url = '/oauth/login/'
        response = self.client.post(url, json.dumps(
            data_login), content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_login_unauthorize_non_created(self):
        data_login = {'username': 'testf', 'password': 'testd'}
        url = '/oauth/login/'
        response = self.client.post(url, json.dumps(
            data_login), content_type='application/json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_logout(self):
        user = User.objects.create_user(username='testf', password='test')
        application = Application.objects.create(name=settings.DJANGO_CLIENT_NAME,
                                                 client_id=settings.DJANGO_UID, client_secret=settings.DJANGO_SECRET, client_type=settings.DJANGO_CLIENT_TYPE, authorization_grant_type=settings.DJANGO_GRANT_AUTHORIZATION,  user=user)
        print(application)
        datenow = timezone.now()

        expiry_date = datenow + timezone.timedelta(days=7)
        acces_token = AccessToken.objects.create(
            user=user, application=application, expires=expiry_date)
        client = APIClient()
        client.login(username='testf', password='test')
