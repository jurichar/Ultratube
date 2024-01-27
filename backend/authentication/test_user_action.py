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
        name=settings.DJANGO_CLIENT_NAME,
        client_id=settings.DJANGO_UID,
        client_secret=settings.DJANGO_SECRET,
        client_type=settings.DJANGO_CLIENT_TYPE,
        authorization_grant_type=settings.DJANGO_GRANT_AUTHORIZATION,
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
    self.client.get("/oauth/get-csrf-token/")
    self.client.cookies["token"] = access_token.token
    return (access_token.token, self.client)


def header_auth(access_token):
    return {"Authorization": f"Bearer {access_token}"}


class UserActionTest(APITestCase):
    def test_get_list_user(self):
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
        user = User.objects.create_superuser(username="test", password="test")
        application = Application.objects.create(
            name=settings.DJANGO_CLIENT_NAME,
            client_id=settings.DJANGO_UID,
            client_secret=settings.DJANGO_SECRET,
            client_type=settings.DJANGO_CLIENT_TYPE,
            authorization_grant_type=settings.DJANGO_GRANT_AUTHORIZATION,
            user=user,
        )
        datenow = timezone.now()
        expiry_date = datenow + timezone.timedelta(days=7)
        access_token = AccessToken.objects.create(
            user=user,
            application=application,
            token="shdjgjhgwfejhgwfjhgfew",
            expires=expiry_date,
            scope="write, read",
        )

        self.assertEqual(AccessToken.objects.get().user, user)
        self.client.login(username="test", password="test")
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {access_token.token}")
        self.client.get("/oauth/get-csrf-token/")
        self.client.cookies["token"] = access_token.token
        response = self.client.get(
            "http://localhost:8000/oauth/users/", **header_auth(access_token)
        )
        responseJson = json.loads(response.content)
        self.assertEqual(responseJson["count"], 11)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        response_detail = self.client.get(
            "http://localhost:8000/oauth/users/10/", **header_auth(access_token)
        )
        self.assertEqual(response_detail.status_code, status.HTTP_200_OK)
        self.assertEqual(
            json.loads(response_detail.content), {"username": "qenq", "email": ""}
        )
        data = {"username": "testchange", "email": "cc@lol.com"}
        response_patch = self.client.patch(
            "http://localhost:8000/oauth/users/10/",
            **header_auth(access_token),
            data=data,
        )
        print(response_patch.data)
        self.assertEqual(response_patch.status_code, status.HTTP_200_OK)
        response_detail10 = self.client.get(
            "http://localhost:8000/oauth/users/10/", **header_auth(access_token)
        )
        self.assertEqual(response_detail10.status_code, status.HTTP_200_OK)
        self.assertEqual(json.loads(response_detail.content), data)
