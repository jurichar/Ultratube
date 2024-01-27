from django.urls import include, path
from .views import AccessTokenDetail, DiscordAuthView, FortyTwoAuthView
from .views import UserList, UserLogin, UserLogout, UserRegister, UserViewSet
from .views import get_csrf_token
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
    path("", include(router.urls)),
    # path("user/", UserList.as_view(), name="user-list"),
    path("get-csrf-token/", get_csrf_token, name="get-csrf-token"),
    path("update-token/<str:token>/", AccessTokenDetail.as_view(), name="token-api"),
]

urlpatterns = format_suffix_patterns(urlpatterns)
