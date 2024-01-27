import json
from django.conf import settings
from rest_framework.test import APITestCase, URLPatternsTestCase
from oauth2_provider.models import AccessToken, Application
from .models import User
from django.utils import timezone
from rest_framework import status


def setUpAuth(
    self,
):
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
        scope="write read",
    )
    self.assertEqual(AccessToken.objects.get().user, user)
    self.client.login(username="test", password="test")
    self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {access_token.token}")
    self.client.get("/oauth/get-csrf-token/")
    self.client.cookies["token"] = access_token.token
    return (access_token.token, self.client, user)


def header_auth(access_token):
    return {"Authorization": f"Bearer {access_token}"}


class UserActionTest(APITestCase):
    def test_get_list_user_auth(self):
        User.objects.create(username="qq", password="dd")
        User.objects.create(username="qqd", password="dd")
        User.objects.create(username="qqs", password="dd")
        User.objects.create(username="qsq", password="dd")
        User.objects.create(username="qcq", password="dd")
        User.objects.create(username="qeq", password="dd")
        User.objects.create(username="qedcq", password="dd")
        User.objects.create(username="qeqqq", password="dd")
        User.objects.create(username="qedq", password="dd")
        User.objects.create(username="qenq", password="dd")
        self.assertEqual(User.objects.count(), 10)
        access_token, client, user = setUpAuth(self)
        custom_header = {"Authorization": f"Bearer {access_token}"}

        response = self.client.get(
            "http://localhost:8000/oauth/users/", **custom_header
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        responseJson = json.loads(response.content)
        self.assertEqual(responseJson["count"], 11)

    def test_list_unauthorized(self):
        User.objects.create(username="qq", password="dd")
        User.objects.create(username="qqd", password="dd")
        User.objects.create(username="qqs", password="dd")
        User.objects.create(username="qsq", password="dd")
        User.objects.create(username="qcq", password="dd")
        User.objects.create(username="qeq", password="dd")
        User.objects.create(username="qedcq", password="dd")
        User.objects.create(username="qeqqq", password="dd")
        User.objects.create(username="qedq", password="dd")
        User.objects.create(username="qenq", password="dd")
        self.assertEqual(User.objects.count(), 10)

        response = self.client.get(
            "http://localhost:8000/oauth/users/",
        )
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_list_empty(self):
        response = self.client.get(
            "http://localhost:8000/oauth/users/",
        )
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_user_detail_auth(self):
        access_token, client, user = setUpAuth(self)
        custom_header = {"Authorization": f"Bearer {access_token}"}
        response_detail = self.client.get(
            "http://localhost:8000/oauth/users/" + str(user.pk) + "/", **custom_header
        )
        self.assertEqual(response_detail.status_code, status.HTTP_200_OK)
        self.assertEqual(
            json.loads(response_detail.content), {"username": "test", "email": ""}
        )

    def test_user_detail_unauth(self):
        user = User.objects.create(username="test", password="test")
        response_detail = self.client.get(
            "http://localhost:8000/oauth/users/" + str(user.pk) + "/",
        )
        self.assertEqual(response_detail.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_user_detail_auth_NOT_FOUND(self):
        access_token, client, user = setUpAuth(self)
        custom_header = {"Authorization": f"Bearer {access_token}"}
        response_detail = self.client.get(
            "http://localhost:8000/oauth/users/" + str(4) + "/", **custom_header
        )
        self.assertEqual(response_detail.status_code, status.HTTP_404_NOT_FOUND)

    def test_user_patch(self):
        data = {"username": "lol", "email": "ccc@hotmail.com"}
        access_token, client, user = setUpAuth(self)
        custom_header = {"Authorization": f"Bearer {access_token}"}
        response_patch = self.client.patch(
            "http://localhost:8000/oauth/users/" + str(user.pk) + "/",
            **custom_header,
            data=data,
        )
        self.assertEqual(response_patch.status_code, status.HTTP_200_OK)
        response_detail = self.client.get(
            "http://localhost:8000/oauth/users/" + str(user.pk) + "/", **custom_header
        )
        self.assertEqual(response_detail.status_code, status.HTTP_200_OK)
        self.assertEqual(json.loads(response_detail.content), data)

    def test_user_patch_unauth(self):
        data = {"username": "lol", "email": "ccc@hotmail.com"}
        user = User.objects.create(username="test", password="test")
        response_patch = self.client.patch(
            "http://localhost:8000/oauth/users/" + str(user.pk) + "/",
            data=data,
        )
        self.assertEqual(response_patch.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_user_patch_NOT_FOUND(self):
        data = {"username": "lol", "email": "ccc@hotmail.com"}
        access_token, client, user = setUpAuth(self)
        custom_header = {"Authorization": f"Bearer {access_token}"}
        response_patch = self.client.patch(
            "http://localhost:8000/oauth/users/" + str(2) + "/",
            **custom_header,
            data=data,
        )
        self.assertEqual(response_patch.status_code, status.HTTP_404_NOT_FOUND)
