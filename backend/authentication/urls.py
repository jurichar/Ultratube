from django.urls import include, path
from .views import AccessTokenDetail, DiscordAuthView, FortyTwoAuthView, sendEmailAPI
from .views import UserLogin, UserLogout, UserRegister, UserViewSet
from .views import get_csrf_token, CurrentUser
from rest_framework.urlpatterns import format_suffix_patterns
from rest_framework import routers

router = routers.SimpleRouter()
router.register("users", UserViewSet, basename="user")

urlpatterns = [
    path("callback/", DiscordAuthView.as_view(), name="token-generator"),
    path("42/callback/", FortyTwoAuthView.as_view(), name="42-generator"),
    path("register/", UserRegister.as_view(), name="register"),
    path("login/", UserLogin.as_view(), name="login"),
    path("logout/", UserLogout.as_view(), name="logout"),
    path("", CurrentUser.as_view(), name="current-user"),
    path("", include(router.urls)),
    path("get-csrf-token/", get_csrf_token, name="get-csrf-token"),
    path("update-token/<str:token>/", AccessTokenDetail.as_view(), name="token-api"),
    path("email", sendEmailAPI.as_view(), name="email"),
]

urlpatterns = format_suffix_patterns(urlpatterns)
