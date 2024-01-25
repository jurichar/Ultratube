from django.urls import path, include
from .views import AccessTokenDetail, DiscordAuthView, FortyTwoAuthView, UserList, UserLogin, UserLogout, UserRegister, get_csrf_token
from rest_framework.urlpatterns import format_suffix_patterns


urlpatterns = [
    path("callback/", DiscordAuthView.as_view(), name='token-generator'),
    path("42/callback/", FortyTwoAuthView.as_view(), name='token-generator-42'),
    path("register/", UserRegister.as_view(), name="register"),
    path("login/", UserLogin.as_view(), name="login"),
    path("logout/", UserLogout.as_view(), name="logout"),
    path('user/', UserList.as_view(), name="user-list"),
    path('get-csrf-token/', get_csrf_token, name='get-csrf-token'),

    path('update-token/<str:token>/',
         AccessTokenDetail.as_view(), name="token-api")
]

urlpatterns = format_suffix_patterns(urlpatterns)
