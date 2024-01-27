from django.views.decorators.csrf import ensure_csrf_cookie
from django.http import JsonResponse
from django.http import Http404
import requests
from rest_framework import viewsets
from django.contrib.auth import authenticate, login

from .serializer import (
    AccessTokenSerializer,
    UserDetailSerializer,
    UserListSerializer,
    UserLoginSerializer,
    UserModelSerializer,
    UserPatchSerializer,
)
from .models import User
from django.shortcuts import get_object_or_404, redirect
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.conf import settings
from rest_framework import generics
from oauth2_provider.models import AccessToken
from oauth2_provider.contrib.rest_framework import (
    OAuth2Authentication,
    TokenHasReadWriteScope,
)
from oauth2_provider.contrib.rest_framework import (
    OAuth2Authentication,
    TokenHasReadWriteScope,
)
from rest_framework.authentication import SessionAuthentication
from django.middleware.csrf import get_token
from django.views.decorators.csrf import csrf_exempt
from rest_framework import status


class UserRegister(APIView):
    authentication_classes = [SessionAuthentication]
    permission_classes = [AllowAny]

    @csrf_exempt
    def post(self, request, format=None):
        serializer = UserModelSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            try:
                authenticate_login_user(
                    request,
                    username=serializer.data["username"],
                    password=request.data["password"],
                )
                if not request.session.session_key:
                    request.session.save()
                access_token = get_or_create_access_token(request)
            except Exception:
                return Response("error", status=status.HTTP_400_BAD_REQUEST)
            response_serializer = Response(
                {
                    "data": serializer.data,
                    "access_token": access_token,
                    "session": request.session.session_key,
                },
                status=status.HTTP_201_CREATED,
            )
            if len(access_token):
                response_serializer.set_cookie(
                    "token",
                    access_token,
                    path="/",
                    domain="localhost",
                    httponly=True,
                    samesite="None",
                    expires=None,
                )
            response_serializer.set_cookie(
                "csrftoken",
                get_token(request),
                path="/",
                domain="localhost",
                httponly=True,
                samesite="None",
                expires=None,
            )
            return response_serializer

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserLogin(APIView):
    authentication_classes = [SessionAuthentication]
    permission_classes = [AllowAny]

    def get_object(self, username):
        try:
            return User.objects.get(username=username)
        except User.DoesNotExist:
            raise Http404

    @csrf_exempt
    def post(self, request, format=None):
        try:
            snippet = self.get_object(request.data["username"])
            serializer = UserLoginSerializer(snippet)
            try:
                authenticate_login_user(
                    request=request,
                    username=request.data["username"],
                    password=request.data["password"],
                )
                if not request.session.session_key:
                    request.session.save()
                access_token = get_or_create_access_token(request)

                print(serializer.data)
                response = Response(
                    {"data": serializer.data, "ACCESTOKEN": access_token}
                )
                response.set_cookie(
                    "token",
                    access_token,
                    path="/",
                    domain="localhost",
                    httponly=True,
                    samesite="None",
                    expires=None,
                )
                return response
            except Exception:
                return Response(
                    "password doesnt match ", status=status.HTTP_401_UNAUTHORIZED
                )
        except Exception as e:
            print(e)
            return Response("user doesnt exist", status=status.HTTP_403_FORBIDDEN)


@ensure_csrf_cookie
def get_csrf_token(request):
    return JsonResponse({"detail": "CSRF token obtenu avec succès"})


class UserLogout(APIView):
    authentication_classes = [OAuth2Authentication]
    permission_classes = [IsAuthenticated, TokenHasReadWriteScope]

    def post(self, request, format=None):
        try:
            request.auth.delete()
            return Response(
                {"message": "Successfully logged out."}, status=status.HTTP_200_OK
            )
        except Exception as e:
            return Response(
                {"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class FortyTwoAuthView(APIView):
    authentication_classes = []
    permission_classes = [AllowAny]

    def get(self, request):
        try:
            code = request.GET.get("code")
            data_request = get_object_for_token(
                code=code,
                redirect_uri=settings.FORTYTWO_REDIRECT,
                client_id=settings.FORTYTWO_KEY,
                client_secret=settings.FORTYTWO_SECRET,
            )
            token = call_application_get_access_token(
                "https://api.intra.42.fr/oauth/token", data_request
            )
            accessToken = token.json()["access_token"]
            user = get_information_user_access_token(
                "https://api.intra.42.fr/v2/me", accessToken
            )
            user = user.json()
            user_created = create_or_get_user(
                username=user["login"],
                email=user["email"],
                firstname=user["first_name"],
                lastname=user["last_name"],
            )

            authenticate_login_user(request, username=user_created.username)
            request.session.save()
            token_api = get_or_create_access_token(request)
        except Exception as e:
            print("errpor", e)
            return Response("cant create user ", status=status.HTTP_403_FORBIDDEN)
        frontend_redirect_url = request.GET.get(
            "state", "http://localhost:3000/register"
        )
        redirect_response = redirect(frontend_redirect_url)
        redirect_response.set_cookie(
            "token",
            token_api,
            path="/",
            domain="localhost",
            httponly=True,
            samesite="None",
            expires=None,
        )
        return redirect_response


class DiscordAuthView(APIView):
    def get(self, request):
        code = request.GET.get("code")
        return Response({"code": code})


class AccessTokenDetail(APIView):
    permission_classes = [AllowAny]

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
        return Response(
            serializer.errors,
        )


class MultipleSerializerMixin:
    detail_serializer_class = UserDetailSerializer
    partial_update_serializer_class = UserPatchSerializer

    def get_serializer_class(self):
        opt = {
            "retrieve": self.detail_serializer_class,
            "partial_update": self.update_serializer_class,
            "update": self.update_serializer_class,
        }.get(self.action, super().get_serializer_class())

        return super().get_serializer_class() if not opt else opt


class UserViewSet(MultipleSerializerMixin, viewsets.ReadOnlyModelViewSet):
    authentication_classes = [OAuth2Authentication]
    permission_classes = [IsAuthenticated, TokenHasReadWriteScope]

    queryset = User.objects.all()
    serializer_class = UserListSerializer
    detail_serializer_class = UserDetailSerializer
    update_serializer_class = UserPatchSerializer

    def partial_update(self, request, *args, **kwargs):
        instance = get_object_or_404(User, pk=kwargs.get("pk"))
        serializer = self.update_serializer_class(
            instance, data=request.data, partial=True
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response("update successful")


class UserList(generics.ListAPIView):
    authentication_classes = [OAuth2Authentication]
    permission_classes = [IsAuthenticated, TokenHasReadWriteScope]
    queryset = User.objects.all()
    required_scopes = ["read"]
    serializer_class = UserModelSerializer


# ----------------------------- utils.py -------------------------------

# -----------------------------  OmniAuth strategy ---------------------


def create_or_get_user(username="", password="", email="", firstname="", lastname=""):
    user, created = User.objects.get_or_create(
        username=username, email=email, first_name=firstname, last_name=lastname
    )
    if created:
        user.save()
    return user


def get_information_user_access_token(url, access_token):
    headers = {"Authorization": "Bearer " + access_token}
    information_user = requests.get(url, headers=headers)
    return information_user


def get_object_for_token(
    grant_type="authorization_code",
    code="",
    redirect_uri="",
    client_id="",
    client_secret="",
    scope="public",
):
    return {
        "grant_type": grant_type,
        "code": code,
        "redirect_uri": redirect_uri,
        "client_id": client_id,
        "client_secret": client_secret,
        "scope": scope,
    }


def call_application_get_access_token(url, token_params):
    response = requests.post(url, data=token_params)
    if response.status_code == 200:
        return response
    else:
        return {"cant get information, the authentication fail , please try again"}


# ----------------------------- utils.py -------------------------------
# ----------------------------- REGULAR USER STRATEGY ------------------


def authenticate_login_user(request, username, password=None):
    try:
        user = authenticate(request, username=username, password=password)
        backend = "authentication.custom_authenticate.CustomAuth"
        if user is not None:
            login(request, user, backend=backend)
            request.session.save()
        else:
            raise User.DoesNotExist

    except Exception as e:
        raise e


# ----------------------------- utils.py -------------------------------
# ----------------------------- TOKEN STRATEGY   -----------------------


def get_or_create_access_token(request):
    try:
        token_api = AccessToken.objects.get(user=request.user.pk)
        return token_api.token
    except Exception:
        try:
            token_api = create_access_token_api(
                request, settings.DJANGO_UID, settings.DJANGO_SECRET
            )
            return token_api
        except Exception:
            raise "cant create access token"


def create_access_token_api(request, client_id, client_secret):
    try:
        headers = {
            "Content-Type": "application/x-www-form-urlencoded",
            "Cache-Control": "no-cache",
        }
        data = {
            "grant_type": "client_credentials",
            "client_id": client_id,
            "client_secret": client_secret,
        }
        response = requests.post(
            "http://localhost:8000/o/token/", headers=headers, data=data
        )
        if response.status_code == 201 or response.status_code == 200:
            try:
                responseJson = response.json()
                add_user_to_access_token(request, responseJson["access_token"])
                return responseJson["access_token"]
            except Exception:
                return "cant update token with te user"
    except Exception:
        return "Cant get token, client_id and secret are not matching"


def add_user_to_access_token(request, access_token):
    update_token_url = "http://localhost:8000/oauth/update-token/" + access_token + "/"
    update_data = {
        "user": request.user.pk,
    }
    csrf_token = request.COOKIES.get("csrftoken", "")
    if len(csrf_token) == 0:
        csrf_token = get_token(request)
    headers = {
        "Authorization": "Bearer " + access_token,
        "X-CSRFToken": csrf_token,
    }
    modified_cookies = request.COOKIES.copy()
    if "sessionid" not in modified_cookies:
        modified_cookies["sessionid"] = request.session.session_key
    if "csrftoken" not in modified_cookies:
        modified_cookies["csrftoken"] = csrf_token
    response = requests.put(
        update_token_url, data=update_data, headers=headers, cookies=modified_cookies
    )
    if response.status_code != 200:
        raise response
