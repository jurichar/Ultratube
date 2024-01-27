from django.utils import timezone
import json
from django.conf import settings
from rest_framework.test import APITestCase
from oauth2_provider.models import AccessToken, Application
from .models import User
from rest_framework import status


data = {
    "username": "testf",
    "password": "test",
    "email": "test@test.com",
    "first_name": "ff",
    "last_name": "ddd",
}


class AccountTests(APITestCase):
    def test_create_account(self):
        user = User.objects.create_user(username="testd", password="test")
        Application.objects.create(
            name="test",
            client_id="ddddddddd",
            client_secret="ddddddddddddddd",
            client_type="confidential",
            authorization_grant_type="client-credentials",
            user=user,
        )
        url = "http://localhost:8000/oauth/register/"
        response = self.client.post(url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn("token", response.cookies)
        self.assertIn("csrftoken", response.cookies)
        self.assertIn("sessionid", response.cookies)
        self.assertIsNotNone(response.cookies["sessionid"])
        self.assertIsNotNone(response.cookies["token"])
        self.assertIsNotNone(response.cookies["csrftoken"])
        self.assertEqual(User.objects.get(username="testf").username, "testf")

    def test_login(self):
        User.objects.create_user(username="testf", password="test")
        self.assertEqual(User.objects.get(username="testf").username, "testf")
        data_login = {"username": "testf", "password": "test"}
        url = "/oauth/login/"
        response = self.client.post(
            url, json.dumps(data_login), content_type="application/json"
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIsNotNone(response.cookies["sessionid"])
        self.assertIsNotNone(response.cookies["token"])
        self.assertIsNotNone(response.cookies["csrftoken"])
        self.assertEqual(User.objects.count(), 1)
        self.assertEqual(User.objects.get(username="testf").username, "testf")

    def test_login_unauthorize(self):
        User.objects.create_user(username="testf", password="test")
        self.assertEqual(User.objects.get(username="testf").username, "testf")
        data_login = {"username": "testf", "password": "testd"}
        url = "/oauth/login/"
        response = self.client.post(
            url, json.dumps(data_login), content_type="application/json"
        )
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_login_unauthorize_non_created(self):
        data_login = {"username": "testf", "password": "testd"}
        url = "/oauth/login/"
        response = self.client.post(
            url, json.dumps(data_login), content_type="application/json"
        )
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_logout(self):
        user = User.objects.create_superuser(username="test", password="test")
        application = Application.objects.create(
            name="test",
            client_id="ddddddddd",
            client_secret="ddddddddddddddd",
            client_type="confidential",
            authorization_grant_type="client-credentials",
            user=user,
        )
        datenow = timezone.now()
        expiry_date = datenow + timezone.timedelta(days=7)
        access_token = AccessToken.objects.create(
            user=user,
            application=application,
            token="shdjgjhgwfejhgwfjhgfew",
            expires=expiry_date,
            scope="write",
        )
        self.assertEqual(AccessToken.objects.get().user, user)
        self.client.login(username="test", password="test")
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {access_token.token}")
        custom_header = {"Authorization": f"Bearer {access_token.token}"}
        self.client.get("/oauth/get-csrf-token/")
        self.client.cookies["token"] = access_token.token
        response = self.client.post(
            "http://localhost:8000/oauth/logout/", **custom_header
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # self.assertIn('csrftoken', response.cookies)
